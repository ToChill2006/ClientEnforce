import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Inspect the £500 session
const sid = "cs_live_a136Bln1eGgm01DAVf4B8UjmNLJdMTpB3VbKgr3d3WV9MiJTbwwDEEXr";
const session = await stripe.checkout.sessions.retrieve(sid, {
  expand: ["payment_intent", "customer"]
});
console.log("payment_status:", session.payment_status);
console.log("status:", session.status);
console.log("customer_email:", session.customer_email);
console.log("customer_details:", JSON.stringify(session.customer_details, null, 2));
console.log("amount_total:", session.amount_total);
console.log("expires_at:", new Date(session.expires_at * 1000).toISOString());
if (session.payment_intent && typeof session.payment_intent === 'object') {
  console.log("payment_intent.status:", session.payment_intent.status);
}
