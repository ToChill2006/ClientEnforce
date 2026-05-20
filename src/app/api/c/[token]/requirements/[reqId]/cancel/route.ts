import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// Called when client cancels/abandons a Stripe checkout — resets pending → not_paid
// so they can try again without being stuck.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string; reqId: string }> }
) {
  const { token, reqId } = await params;
  const admin = supabaseAdmin();

  const { data: onboarding } = await admin
    .from("onboardings")
    .select("id")
    .eq("client_token", token)
    .single();

  if (!onboarding) {
    return NextResponse.json({ error: "Invalid link" }, { status: 404 });
  }

  await admin
    .from("onboarding_requirements")
    .update({ payment_status: "not_paid", updated_at: new Date().toISOString() })
    .eq("id", reqId)
    .eq("onboarding_id", onboarding.id)
    .eq("payment_status", "pending"); // only reset if still pending, never undo a real payment

  return NextResponse.json({ ok: true });
}
