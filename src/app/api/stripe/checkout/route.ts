import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

const ALLOWED_TIERS = ["pro", "business"] as const;
const ALLOWED_INTERVALS = ["monthly", "yearly"] as const;

type Tier = (typeof ALLOWED_TIERS)[number];
type BillingInterval = (typeof ALLOWED_INTERVALS)[number];

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function safeSameOriginUrl(input: unknown, origin: string): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.origin !== origin) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(401, { error: "Unauthorized" });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "billing_manage")) {
    return json(403, { error: permissionDenied("You do not have access to manage billing.") });
  }

  const body = await req.json().catch(() => null);
  const tier = String(body?.tier || "").trim().toLowerCase() as Tier;
  const interval = String(body?.interval || "monthly").trim().toLowerCase() as BillingInterval;

  if (!ALLOWED_TIERS.includes(tier)) {
    return json(400, { error: "Invalid tier" });
  }

  if (!ALLOWED_INTERVALS.includes(interval)) {
    return json(400, { error: "Invalid interval" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return json(500, { error: "STRIPE_SECRET_KEY missing" });
  }

  const PRICE_IDS = {
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
    business: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
    },
  } as const;

  console.log("[stripe.checkout] config", {
    keyMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "live" : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ? "test" : "unknown",
    tier,
    interval,
    proMonthly: PRICE_IDS.pro.monthly,
    proYearly: PRICE_IDS.pro.yearly,
    businessMonthly: PRICE_IDS.business.monthly,
    businessYearly: PRICE_IDS.business.yearly,
  });

  const priceId = PRICE_IDS[tier]?.[interval];

  if (!priceId) {
    return json(500, {
      error: `Missing Stripe price for ${tier} ${interval}`,
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
  const origin = appOrigin();
  const defaultReturnUrl = `${origin}/dashboard/settings`;
  const configuredPortalReturn = safeSameOriginUrl(process.env.STRIPE_PORTAL_RETURN_URL, origin);
  const returnUrl =
    safeSameOriginUrl(body?.return_url, origin) ||
    safeSameOriginUrl(body?.returnUrl, origin) ||
    configuredPortalReturn ||
    defaultReturnUrl;

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

  try {
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
          interval,
          old_subscription_id: existingSubId || "",
        },
      },
      metadata: {
        org_id: org.id,
        user_id: userData.user.id,
        tier,
        interval,
        old_subscription_id: existingSubId || "",
      },
    });

    return json(200, { url: session.url });
  } catch (e: any) {
    const message = String(e?.message || "Stripe checkout failed");

    console.error("[stripe.checkout] failed", {
      code: e?.code,
      type: e?.type,
      message,
      tier,
      interval,
      priceId,
    });

    if (
      e?.code === "resource_missing" &&
      message.toLowerCase().includes("similar object exists in live mode")
    ) {
      return json(400, {
        error:
          "Stripe mode mismatch: this price exists in live mode, but the server is using a test secret key. Use test price IDs with sk_test_ keys, or live price IDs with sk_live_ keys.",
      });
    }

    if (e?.code === "resource_missing") {
      return json(400, {
        error: `Stripe price not found for ${tier} ${interval}. Check the configured STRIPE_PRICE_* environment variables.`,
      });
    }

    return json(500, {
      error: message,
    });
  }
}
