import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { percent } from "@/lib/progress";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const admin = supabaseAdmin();

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", token)
    .single();

  if (onboardingErr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: reqs, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("is_required, completed_at")
    .eq("onboarding_id", onboarding.id);

  if (reqErr) return NextResponse.json({ error: reqErr.message }, { status: 400 });

  const required_total = (reqs || []).filter((r) => r.is_required).length;
  const required_completed = (reqs || []).filter((r) => r.is_required && r.completed_at).length;

  return NextResponse.json({
    onboarding_id: onboarding.id,
    status: onboarding.status,
    locked_at: onboarding.locked_at,
    required_total,
    required_completed,
    percent: percent(required_completed, required_total),
  });
}