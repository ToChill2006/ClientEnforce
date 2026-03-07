import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
});

export type Tier = "free" | "pro" | "business";

export const TIER_SEATS: Record<Tier, number> = {
  free: 1,
  pro: 5,
  business: 15,
};

export function tierFromPriceId(priceId: string | null | undefined): Tier {
  const proMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const proYearly = process.env.STRIPE_PRICE_PRO_YEARLY;
  const businessMonthly = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
  const businessYearly = process.env.STRIPE_PRICE_BUSINESS_YEARLY;

  if (priceId && (priceId === businessMonthly || priceId === businessYearly)) return "business";
  if (priceId && (priceId === proMonthly || priceId === proYearly)) return "pro";
  return "free";
}

export function seatsForTier(tier: Tier) {
  return TIER_SEATS[tier] ?? 1;
}