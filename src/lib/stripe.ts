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
  business: 25,
};

export function tierFromPriceId(priceId: string | null | undefined): Tier {
  const pro = process.env.STRIPE_PRICE_PRO;
  const biz = process.env.STRIPE_PRICE_BUSINESS;

  if (priceId && biz && priceId === biz) return "business";
  if (priceId && pro && priceId === pro) return "pro";
  return "free";
}

export function seatsForTier(tier: Tier) {
  return TIER_SEATS[tier] ?? 1;
}