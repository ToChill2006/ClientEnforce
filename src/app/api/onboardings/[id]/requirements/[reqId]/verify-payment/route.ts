import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!profile?.org_id) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id: onboardingId, reqId } = await params;
  const admin = supabaseAdmin();

  // Verify onboarding belongs to this org
  const { data: onboarding } = await admin
    .from("onboardings")
    .select("id")
    .eq("id", onboardingId)
    .eq("org_id", profile.org_id)
    .single();

  if (!onboarding) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: req } = await admin
    .from("onboarding_requirements")
    .select("id, payment_status, payment_stripe_session_id")
    .eq("id", reqId)
    .eq("onboarding_id", onboardingId)
    .single();

  if (!req) return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
  if (req.payment_status === "paid") return NextResponse.json({ ok: true, status: "paid" });
  if (!req.payment_stripe_session_id) return NextResponse.json({ ok: false, reason: "no_session" });

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(req.payment_stripe_session_id);

    if (stripeSession.payment_status === "paid") {
      const now = new Date().toISOString();
      await admin
        .from("onboarding_requirements")
        .update({ payment_status: "paid", payment_paid_at: now, updated_at: now })
        .eq("id", reqId);
      return NextResponse.json({ ok: true, status: "paid" });
    }

    return NextResponse.json({ ok: true, status: stripeSession.payment_status });
  } catch (e: any) {
    return NextResponse.json({ ok: false, reason: e?.message }, { status: 500 });
  }
}
