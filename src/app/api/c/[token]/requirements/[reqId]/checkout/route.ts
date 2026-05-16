import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string; reqId: string }> }
) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return json(503, { error: "Payment service not configured" });
  }

  const { token, reqId } = await params;

  const admin = supabaseAdmin();

  // 1. Load onboarding by client_token
  const { data: onboarding, error: oErr } = await admin
    .from("onboardings")
    .select("id, org_id, status")
    .eq("client_token", token)
    .single();

  if (oErr || !onboarding) {
    return json(404, { error: "Invalid link" });
  }

  // 2. Load requirement — verify it belongs to this onboarding and is a payment type
  const { data: req, error: rErr } = await admin
    .from("onboarding_requirements")
    .select(
      "id, onboarding_id, org_id, type, label, payment_amount, payment_currency, payment_description, payment_status, phase_number"
    )
    .eq("id", reqId)
    .eq("onboarding_id", onboarding.id)
    .single();

  if (rErr || !req) {
    return json(404, { error: "Requirement not found" });
  }

  if (req.type !== "payment") {
    return json(400, { error: "Not a payment requirement" });
  }

  if (req.payment_status === "paid") {
    return json(400, { error: "Already paid" });
  }

  // 3. Load org stripe_account_id
  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .select("id, stripe_account_id, name")
    .eq("id", onboarding.org_id)
    .single();

  if (orgErr || !org) {
    return json(404, { error: "Organisation not found" });
  }

  if (!org.stripe_account_id) {
    return json(400, { error: "Payment temporarily unavailable. Please contact support." });
  }

  const amount = Number(req.payment_amount ?? 0);
  const currency = (req.payment_currency ?? "GBP").toLowerCase();
  const label = req.label ?? "Payment";
  const description = req.payment_description ?? undefined;
  const phaseNumber = req.phase_number ?? 1;

  if (!amount || amount <= 0) {
    return json(400, { error: "Invalid payment amount" });
  }

  const origin = appOrigin();
  const baseUrl = `${origin}/c/${token}/phase/${phaseNumber}`;

  // 5. Create Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_intent_data: {
        transfer_data: { destination: org.stripe_account_id },
        application_fee_amount: 0,
      },
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: label,
              ...(description ? { description } : {}),
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}?paid=${reqId}`,
      cancel_url: baseUrl,
      metadata: {
        onboarding_id: onboarding.id,
        requirement_id: reqId,
        org_id: onboarding.org_id,
      },
    });

    // 6. Update requirement with session id and set status to pending
    await admin
      .from("onboarding_requirements")
      .update({
        payment_stripe_session_id: session.id,
        payment_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", reqId);

    // 7. Return checkout URL
    return json(200, { url: session.url });
  } catch (e: any) {
    console.error("[payment-checkout] Stripe error", e?.message ?? e);
    return json(500, { error: e?.message ?? "Failed to create checkout session" });
  }
}
