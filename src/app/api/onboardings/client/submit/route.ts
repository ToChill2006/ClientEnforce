import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ClientSubmitSchema } from "@/lib/onboarding-schema";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ClientSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = supabaseAdmin();

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", parsed.data.token)
    .single();

  if (onboardingErr) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (onboarding.locked_at || onboarding.status === "locked") {
    return NextResponse.json({ error: "Onboarding is locked" }, { status: 423 });
  }

  const { data: reqs, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("is_required, completed_at")
    .eq("onboarding_id", onboarding.id);

  if (reqErr) return NextResponse.json({ error: reqErr.message }, { status: 400 });

  const missing = (reqs || []).filter((r) => r.is_required && !r.completed_at).length;
  if (missing > 0) {
    return NextResponse.json({ error: "Missing required items" }, { status: 409 });
  }

  const now = new Date().toISOString();

  // Mark submitted + lock
  const { error: updErr } = await admin
    .from("onboardings")
    .update({
      status: "locked",
      locked_at: now,
    })
    .eq("id", onboarding.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  // Clear any pending follow-up jobs once the onboarding is submitted/locked
  const { error: delFollowupsErr } = await admin
    .from("followup_jobs")
    .delete()
    .eq("onboarding_id", onboarding.id);

  if (delFollowupsErr) {
    return NextResponse.json({ error: delFollowupsErr.message }, { status: 400 });
  }

  await admin.from("audit_logs").insert({
    org_id: onboarding.org_id,
    actor_user_id: null,
    action: "onboarding.client_submitted",
    entity_type: "onboarding",
    entity_id: onboarding.id,
    metadata: { cleared_followups: true },
  });

  await admin.from("audit_logs").insert({
    org_id: onboarding.org_id,
    actor_user_id: null,
    action: "onboarding.locked",
    entity_type: "onboarding",
    entity_id: onboarding.id,
    metadata: { locked_at: now },
  });

  return NextResponse.json({ ok: true });
}