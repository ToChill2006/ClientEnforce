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

function deriveTier(sub: Stripe.Subscription | null): Tier | null {
  if (!sub) return null;
  const fromMetadata = normalizeTier(sub.metadata?.tier);
  if (fromMetadata) return fromMetadata;
  return tierFromPriceId(firstSubscriptionPriceId(sub));
}

function statusRank(status: string | null | undefined) {
  const s = String(status ?? "").toLowerCase();
  if (s === "active") return 90;
  if (s === "trialing") return 80;
  if (s === "past_due") return 70;
  if (s === "unpaid") return 60;
  if (s === "incomplete") return 50;
  if (s === "incomplete_expired") return 40;
  if (s === "canceled") return 30;
  if (s === "paused") return 20;
  return 10;
}

function chooseCanonicalSubscription(subscriptions: Stripe.Subscription[]) {
  if (!subscriptions.length) return null;

  const sorted = [...subscriptions].sort((a, b) => {
    const rankDelta = statusRank(b.status) - statusRank(a.status);
    if (rankDelta !== 0) return rankDelta;
    return (b.created ?? 0) - (a.created ?? 0);
  });

  return sorted[0] ?? null;
}

export async function POST() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(401, { error: "Unauthorized" });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "billing_manage")) {
    return json(403, { error: permissionDenied("You do not have access to manage billing.") });
  }

  const profile = await requireProfile();
  const admin = supabaseAdmin();

  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .select("id, tier, stripe_customer_id, stripe_subscription_id, stripe_subscription_status, seats_limit")
    .eq("id", profile.org_id)
    .single();

  if (orgErr || !org?.id) return json(400, { error: orgErr?.message || "Organization not found." });

  const customerId = String(org.stripe_customer_id ?? "").trim();
  const subscriptionId = String(org.stripe_subscription_id ?? "").trim();

  if (!customerId && !subscriptionId) {
    return json(400, { error: "No Stripe billing reference found for this organization." });
  }

  const byId = new Map<string, Stripe.Subscription>();
  const addSub = (sub: Stripe.Subscription | null | undefined) => {
    if (!sub?.id) return;
    byId.set(sub.id, sub);
  };

  if (subscriptionId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      addSub(sub);
    } catch (e: any) {
      if (String(e?.code ?? "") !== "resource_missing") {
        return json(400, { error: String(e?.message || "Failed retrieving Stripe subscription.") });
      }
    }
  }

  if (customerId) {
    try {
      const listed = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 100,
      });
      for (const sub of listed.data) addSub(sub);
    } catch (e: any) {
      return json(400, { error: String(e?.message || "Failed listing Stripe subscriptions.") });
    }
  }

  const canonical = chooseCanonicalSubscription(Array.from(byId.values()));
  if (!canonical) {
    return json(404, { error: "No Stripe subscription found to sync." });
  }

  const nextTier = deriveTier(canonical);
  const nextStatus = String(canonical.status ?? "none").toLowerCase();
  const nextPriceId = firstSubscriptionPriceId(canonical);
  const nextCustomerId = asStripeId(canonical.customer) || customerId || null;

  const shouldGrantPaidTier =
    nextStatus === "active" ||
    nextStatus === "trialing" ||
    nextStatus === "past_due" ||
    nextStatus === "unpaid" ||
    nextStatus === "incomplete";

  const patch: Record<string, any> = {
    stripe_customer_id: nextCustomerId,
    stripe_subscription_id: canonical.id,
    stripe_subscription_status: nextStatus,
    stripe_price_id: nextPriceId,
  };

  if (typeof (canonical as any).current_period_end === "number") {
    patch.current_period_end = new Date((canonical as any).current_period_end * 1000).toISOString();
  }

  if (shouldGrantPaidTier && nextTier) {
    patch.tier = nextTier;
    patch.seats_limit = seatsForTier(nextTier);
    patch.pending_tier = null;
    patch.pending_interval = null;
    patch.pending_seats_limit = null;
  }

  const patchToApply = { ...patch };
  let updatedOrg: any = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { data, error } = await admin
      .from("organizations")
      .update(patchToApply)
      .eq("id", org.id)
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
    return json(404, { error: "Organization not found for billing sync." });
  }

  return json(200, {
    ok: true,
    org: updatedOrg,
    source: "stripe-sync",
    synced_subscription_id: canonical.id,
    synced_status: nextStatus,
    inferred_tier: nextTier,
  });
}
