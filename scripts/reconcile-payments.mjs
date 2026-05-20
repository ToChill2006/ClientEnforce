// One-time script: checks all not_paid/pending requirements with a Stripe session ID
// against Stripe's API and marks them paid if the session payment_status is "paid".
//
// Usage: node scripts/reconcile-payments.mjs

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing env vars. Run with:");
  console.error(
    "  STRIPE_SECRET_KEY=... NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/reconcile-payments.mjs"
  );
  process.exit(1);
}

const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const { data: reqs, error } = await supabase
  .from("onboarding_requirements")
  .select("id, payment_status, payment_stripe_session_id, payment_amount, payment_currency, label")
  .in("payment_status", ["not_paid", "pending"])
  .not("payment_stripe_session_id", "is", null);

if (error) {
  console.error("DB error:", error.message);
  process.exit(1);
}

console.log(`Found ${reqs.length} requirement(s) to check.\n`);

let marked = 0;
for (const req of reqs) {
  const sid = req.payment_stripe_session_id;
  process.stdout.write(`  ${req.id.slice(0, 8)}  [${req.label ?? "Payment"}]  session=${sid.slice(0, 20)}...  `);

  try {
    const session = await stripe.checkout.sessions.retrieve(sid);
    if (session.payment_status === "paid") {
      const now = new Date().toISOString();
      await supabase
        .from("onboarding_requirements")
        .update({ payment_status: "paid", payment_paid_at: now, updated_at: now })
        .eq("id", req.id);
      console.log("→ MARKED PAID ✓");
      marked++;
    } else {
      console.log(`→ ${session.payment_status} (skipped)`);
    }
  } catch (e) {
    console.log(`→ ERROR: ${e.message}`);
  }
}

console.log(`\nDone. Marked ${marked}/${reqs.length} as paid.`);
