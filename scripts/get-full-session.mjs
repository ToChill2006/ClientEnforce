import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: reqs } = await supabase
  .from("onboarding_requirements")
  .select("id, payment_status, payment_stripe_session_id, payment_amount, label")
  .eq("type", "payment")
  .neq("payment_status", "paid");

for (const req of reqs ?? []) {
  console.log(`\nReq ${req.id}  [${req.label}]  amount=${req.payment_amount}  status=${req.payment_status}`);
  console.log(`Full session ID: ${req.payment_stripe_session_id}`);

  if (!req.payment_stripe_session_id) { console.log("No session ID"); continue; }

  try {
    const session = await stripe.checkout.sessions.retrieve(req.payment_stripe_session_id);
    console.log(`Stripe payment_status: ${session.payment_status}`);
    console.log(`Stripe customer_email: ${session.customer_email}`);
    console.log(`Stripe customer_details:`, session.customer_details);
  } catch(e) {
    console.log(`Stripe error: ${e.message}`);
    // Try with connected account if main fails
    console.log("(session may be on connected account - check Stripe dashboard directly)");
  }
}
