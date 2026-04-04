import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

type Tier = "free" | "pro" | "business";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function asStripeId(v: any): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && typeof v.id === "string") return v.id;
  return null;
}

function normalizeTier(raw: unknown): Tier | null {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "free" || v === "pro" || v === "business") return v;
  if (v === "starter") return "free";
  return null;
}

function seatsForTier(tier: Tier) {
  if (tier === "business") return 15;
  if (tier === "pro") return 5;
  return 1;
}

function tierFromPriceId(priceId: string | null | undefined): Exclude<Tier, "free"> | null {
  if (!priceId) return null;

  const proMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const proYearly = process.env.STRIPE_PRICE_PRO_YEARLY;
  const businessMonthly = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
  const businessYearly = process.env.STRIPE_PRICE_BUSINESS_YEARLY;

  if (priceId === proMonthly || priceId === proYearly) return "pro";
  if (priceId === businessMonthly || priceId === businessYearly) return "business";
  return null;
}

function isMissingColumnError(error: any, column: string) {
  const msg = String(error?.message ?? "").toLowerCase();
  if (!msg) return false;
  return (
    msg.includes(column.toLowerCase()) &&
    (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))
  );
}

function shouldRetryWithoutPendingColumns(error: any) {
  return (
    isMissingColumnError(error, "pending_tier") ||
    isMissingColumnError(error, "pending_interval") ||
    isMissingColumnError(error, "pending_seats_limit")
  );
}

function stripPendingColumns(patch: Record<string, any>) {
  if ("pending_tier" in patch) delete patch.pending_tier;
  if ("pending_interval" in patch) delete patch.pending_interval;
  if ("pending_seats_limit" in patch) delete patch.pending_seats_limit;
}

function firstSubscriptionPriceId(sub: Stripe.Subscription | null) {
  if (!sub) return null;
  return sub.items?.data?.[0]?.price?.id ?? null;
}

function deriveTier(params: {
  session: Stripe.Checkout.Session;
  subscription: Stripe.Subscription | null;
  priceId: string | null;
}) {
  return (
    normalizeTier(params.session.metadata?.tier) ??
    normalizeTier(params.subscription?.metadata?.tier) ??
    tierFromPriceId(params.priceId)
  );
}

async function resolveSessionAndSubscription(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "line_items.data.price"],
  });

  const subscriptionId = asStripeId(session.subscription);
  let subscription: Stripe.Subscription | null =
    typeof session.subscription === "object" && session.subscription
      ? (session.subscription as Stripe.Subscription)
      : null;

  if (!subscription && subscriptionId) {
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  }

  return { session, subscription, subscriptionId };
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(401, { error: "Unauthorized" });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "billing_manage")) {
    return json(403, { error: permissionDenied("You do not have access to manage billing.") });
  }

  const profile = await requireProfile();
  const admin = supabaseAdmin();
  const { data: profileOrg, error: profileOrgErr } = await admin
    .from("organizations")
    .select("id, stripe_customer_id")
    .eq("id", profile.org_id)
    .single();

  if (profileOrgErr || !profileOrg?.id) {
    return json(400, { error: profileOrgErr?.message || "Organization not found." });
  }

  const body = await req.json().catch(() => null);
  const sessionId = String(body?.session_id ?? "").trim();

  if (!sessionId) return json(400, { error: "session_id is required." });

  let resolved: Awaited<ReturnType<typeof resolveSessionAndSubscription>>;
  try {
    resolved = await resolveSessionAndSubscription(sessionId);
  } catch (e: any) {
    return json(400, { error: String(e?.message || "Failed to load Stripe session.") });
  }

  const { session, subscription, subscriptionId } = resolved;
  if (session.mode !== "subscription") {
    return json(400, { error: "Provided session is not a subscription checkout." });
  }

  const orgIdFromSession = String(session.metadata?.org_id ?? "").trim();
  const targetOrgId = orgIdFromSession || String(profileOrg.id);

  if (orgIdFromSession && orgIdFromSession !== String(profileOrg.id)) {
    return json(403, { error: "Checkout session does not belong to your organization." });
  }

  const customerId = asStripeId(subscription?.customer) ?? asStripeId(session.customer);
  const existingCustomerId = String(profileOrg.stripe_customer_id ?? "").trim();
  if (!orgIdFromSession && existingCustomerId && customerId && existingCustomerId !== customerId) {
    return json(403, { error: "Checkout session customer does not match your organization." });
  }

  const priceId = firstSubscriptionPriceId(subscription);
  const nextTier = deriveTier({ session, subscription, priceId });

  const status = String(
    subscription?.status ??
      (session.payment_status === "paid" || session.status === "complete" ? "active" : "none")
  ).toLowerCase();

  const patch: Record<string, any> = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_subscription_status: status,
    stripe_price_id: priceId,
    pending_tier: null,
    pending_interval: null,
    pending_seats_limit: null,
  };

  const currentPeriodEndRaw = (subscription as any)?.current_period_end;
  if (typeof currentPeriodEndRaw === "number") {
    patch.current_period_end = new Date(currentPeriodEndRaw * 1000).toISOString();
  }

  if (nextTier) {
    patch.tier = nextTier;
    patch.seats_limit = seatsForTier(nextTier);
  }

  const patchToApply = { ...patch };
  let updatedOrg: any = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await admin
      .from("organizations")
      .update(patchToApply)
      .eq("id", targetOrgId)
      .select("id, tier, seats_limit, stripe_subscription_status, stripe_subscription_id")
      .single();

    if (!error) {
      updatedOrg = data;
      break;
    }

    const canRetry = attempt === 0 && shouldRetryWithoutPendingColumns(error);
    if (canRetry) {
      stripPendingColumns(patchToApply);
      continue;
    }

    return json(400, { error: error.message });
  }

  if (!updatedOrg?.id) {
    return json(404, { error: "Organization not found for checkout confirmation." });
  }

  return json(200, {
    ok: true,
    org: updatedOrg,
    source: "checkout-confirm",
  });
}
