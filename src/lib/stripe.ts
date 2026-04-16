import Stripe from "stripe";

// Lazy singleton — only instantiated on first method call inside a request handler,
// not at module evaluation time. Prevents build failures when STRIPE_SECRET_KEY
// is absent from the build environment.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_: Stripe, prop: string | symbol) {
    const client = getStripe();
    const val = Reflect.get(client, prop, client);
    return typeof val === "function" ? val.bind(client) : val;
  },
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