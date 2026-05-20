import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// Called from the client portal after Stripe redirects back with ?paid=reqId.
// Looks up the Stripe session by requirement ID and marks the requirement paid
// if the session payment_status is "paid". This is a fallback for when the
// Stripe webhook hasn't fired yet (or isn't configured).
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string; reqId: string }> }
) {
  const { token, reqId } = await params;
  const admin = supabaseAdmin();

  const { data: onboarding } = await admin
    .from("onboardings")
    .select("id, org_id")
    .eq("client_token", token)
    .single();

  if (!onboarding) return NextResponse.json({ error: "Invalid link" }, { status: 404 });

  // Load requirement — must belong to this onboarding
  const { data: req } = await admin
    .from("onboarding_requirements")
    .select("id, payment_status, payment_stripe_session_id, payment_amount, payment_currency")
    .eq("id", reqId)
    .eq("onboarding_id", onboarding.id)
    .single();

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Already marked paid — nothing to do
  if (req.payment_status === "paid") return NextResponse.json({ ok: true, status: "paid" });

  // No session ID stored — can't verify
  if (!req.payment_stripe_session_id) {
    return NextResponse.json({ ok: false, reason: "no_session" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(req.payment_stripe_session_id);

    if (session.payment_status === "paid") {
      const now = new Date().toISOString();
      await admin
        .from("onboarding_requirements")
        .update({
          payment_status: "paid",
          payment_paid_at: now,
          updated_at: now,
        })
        .eq("id", reqId);

      return NextResponse.json({ ok: true, status: "paid" });
    }

    return NextResponse.json({ ok: true, status: session.payment_status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: e?.message }, { status: 500 });
  }
}
