import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Get ALL payment requirements
const { data: reqs } = await supabase
  .from("onboarding_requirements")
  .select("id, payment_status, payment_stripe_session_id, payment_amount, payment_currency, label, onboarding_id")
  .eq("type", "payment")
  .order("updated_at", { ascending: false });

console.log(`\nAll payment requirements (${reqs?.length ?? 0} total):\n`);
for (const req of reqs ?? []) {
  const sid = req.payment_stripe_session_id;
  const hasSession = !!sid;
  console.log(`  ${req.id.slice(0,8)}  status=${req.payment_status.padEnd(10)}  amount=${String(req.payment_amount ?? '?').padEnd(8)}  session=${hasSession ? sid.slice(0,25) + '...' : 'none'}`);
}

// Now check all not_paid/pending with sessions against Stripe
const pending = (reqs ?? []).filter(r => r.payment_status !== 'paid' && r.payment_stripe_session_id);
console.log(`\nChecking ${pending.length} unpaid requirements with sessions against Stripe:\n`);
let marked = 0;
for (const req of pending) {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.payment_stripe_session_id);
    const stripeStatus = session.payment_status;
    process.stdout.write(`  ${req.id.slice(0,8)}  stripe=${stripeStatus.padEnd(10)} `);
    if (stripeStatus === 'paid') {
      const now = new Date().toISOString();
      await supabase.from("onboarding_requirements")
        .update({ payment_status: "paid", payment_paid_at: now, updated_at: now })
        .eq("id", req.id);
      console.log("→ MARKED PAID ✓");
      marked++;
    } else {
      console.log("→ not paid, skipped");
    }
  } catch(e) {
    console.log(`  ${req.id.slice(0,8)}  ERROR: ${e.message}`);
  }
}
console.log(`\nMarked ${marked} as paid.`);
