import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const ALLOWED_TIERS = ["pro", "business"] as const;

type Tier = (typeof ALLOWED_TIERS)[number];

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function safeUrl(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;
  try {
    // Allow absolute URLs only. Keeps us safe from open-redirects.
    const u = new URL(s);
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(401, { error: "Unauthorized" });

  const body = await req.json().catch(() => null);
  const tier = String(body?.tier || "").trim().toLowerCase() as Tier;

  if (!ALLOWED_TIERS.includes(tier)) {
    return json(400, { error: "Invalid tier" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(500, { error: "STRIPE_SECRET_KEY missing" });
  }

  const pricePro = process.env.STRIPE_PRICE_PRO;
  const priceBusiness = process.env.STRIPE_PRICE_BUSINESS;

  const priceId =
    tier === "pro" ? pricePro : tier === "business" ? priceBusiness : undefined;

  if (!priceId) {
    return json(500, {
      error:
        tier === "pro"
          ? "STRIPE_PRICE_PRO missing"
          : "STRIPE_PRICE_BUSINESS missing",
    });
  }

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("org_id, email")
    .eq("user_id", userData.user.id)
    .single();

  if (pErr) return json(400, { error: pErr.message });
  if (!profile?.org_id) return json(400, { error: "Profile org_id missing" });

  const { data: org, error: oErr } = await supabase
    .from("organizations")
    .select("id, stripe_customer_id, stripe_subscription_id, stripe_subscription_status")
    .eq("id", profile.org_id)
    .single();

  if (oErr) return json(400, { error: oErr.message });
  if (!org?.id) return json(400, { error: "Organization missing" });

  // Return URL: allow the caller to override, otherwise default to app settings.
  const fallbackAppUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const defaultReturnUrl =
    process.env.STRIPE_PORTAL_RETURN_URL || `${fallbackAppUrl}/dashboard/settings`;

  const returnUrl = safeUrl(body?.return_url) || safeUrl(body?.returnUrl) || defaultReturnUrl;

  // Ensure the org has a Stripe customer. If not, create one and persist it.
  let customerId: string | undefined = org.stripe_customer_id || undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: {
        org_id: org.id,
      },
    });

    customerId = customer.id;

    const { error: upErr } = await supabase
      .from("organizations")
      .update({ stripe_customer_id: customerId })
      .eq("id", org.id);

    if (upErr) {
      // Customer was created but we failed to persist it. Return a clear error.
      return json(500, { error: `Failed to persist Stripe customer: ${upErr.message}` });
    }
  }

  // If the org already has an active subscription, schedule it to cancel so we don't end up with two subscriptions.
  // (We keep it until period end to avoid cutting access immediately.)
  const existingSubId = (org as any)?.stripe_subscription_id as string | null | undefined;
  const existingSubStatus = String((org as any)?.stripe_subscription_status ?? "").toLowerCase();
  const cancellableStatuses = new Set(["active", "trialing", "past_due", "incomplete"]);

  if (existingSubId && cancellableStatuses.has(existingSubStatus)) {
    try {
      await stripe.subscriptions.update(existingSubId, {
        cancel_at_period_end: true,
        // keep proration simple; the new subscription will start immediately
        proration_behavior: "none",
      });
    } catch (e: any) {
      // Don't block checkout if we can't cancel the old one; webhook can still reconcile.
      console.warn("Failed to set cancel_at_period_end on existing subscription", existingSubId, e?.message || e);
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?billing=success`,
    cancel_url: `${returnUrl}?billing=cancel`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        org_id: org.id,
        tier,
        old_subscription_id: existingSubId || "",
      },
    },
    metadata: {
      org_id: org.id,
      user_id: userData.user.id,
      tier,
      old_subscription_id: existingSubId || "",
    },
  });

  return json(200, { url: session.url });
}