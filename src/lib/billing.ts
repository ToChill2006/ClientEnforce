import { supabaseAdmin } from "@/lib/supabase-admin";
import { seatsForTier, tierFromPriceId, type Tier } from "@/lib/stripe";

export async function setOrgPlanFromStripe(params: {
  orgId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  status?: string | null;
  currentPeriodEnd?: number | null; // unix seconds
}) {
  const admin = supabaseAdmin();

  const tier: Tier = tierFromPriceId(params.stripePriceId);
  const seats_limit = seatsForTier(tier);

  const stripeStatus = (params.status || "none").toLowerCase();

  const mappedStatus =
    stripeStatus === "trialing"
      ? "trialing"
      : stripeStatus === "active"
      ? "active"
      : stripeStatus === "past_due"
      ? "past_due"
      : stripeStatus === "canceled"
      ? "canceled"
      : stripeStatus === "unpaid"
      ? "unpaid"
      : stripeStatus === "incomplete"
      ? "incomplete"
      : stripeStatus === "incomplete_expired"
      ? "incomplete_expired"
      : "none";

  const current_period_end = params.currentPeriodEnd
    ? new Date(params.currentPeriodEnd * 1000).toISOString()
    : null;

  const { error } = await admin
    .from("organizations")
    .update({
      tier,
      seats_limit,
      stripe_customer_id: params.stripeCustomerId ?? null,
      stripe_subscription_id: params.stripeSubscriptionId ?? null,
      stripe_price_id: params.stripePriceId ?? null,
      stripe_subscription_status: mappedStatus,
      current_period_end,
    })
    .eq("id", params.orgId);

  if (error) throw new Error(error.message);
}