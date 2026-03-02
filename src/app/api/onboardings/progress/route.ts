import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const include = (url.searchParams.get("include") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const includeRequirements = include.includes("requirements");

  // Accept ?ids=a,b,c and also handle URL-encoded commas.
  const ids = (url.searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return json(400, { error: "Missing ids" });
  }

  if (ids.length > 50) {
    return json(400, { error: "Too many ids (max 50)" });
  }

  const supabase = await supabaseServer();
  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr) return json(401, { error: userErr.message });
  if (!userData.user) return json(401, { error: "Unauthorized" });

  // Resolve org_id (RLS policies typically depend on this)
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", userData.user.id)
    .single();

  if (pErr) return json(400, { error: pErr.message });
  if (!profile?.org_id) return json(403, { error: "No org" });

  // Pull requirements for those onboardings. RLS ensures tenant isolation.
  const { data: reqs, error: rErr } = await supabase
    .from("onboarding_requirements")
    .select("onboarding_id,is_required,completed_at")
    .in("onboarding_id", ids);

  if (rErr) return json(400, { error: rErr.message });

  const progress: Record<
    string,
    { required_total: number; required_completed: number; percent: number }
  > = {};

  // initialize so UI always has keys
  for (const id of ids) {
    progress[id] = { required_total: 0, required_completed: 0, percent: 0 };
  }

  for (const row of reqs || []) {
    const oid = row.onboarding_id as string;
    if (!progress[oid]) progress[oid] = { required_total: 0, required_completed: 0, percent: 0 };

    if (row.is_required) {
      progress[oid].required_total += 1;
      if (row.completed_at) progress[oid].required_completed += 1;
    }
  }

  for (const id of Object.keys(progress)) {
    const t = progress[id].required_total;
    const c = progress[id].required_completed;
    progress[id].percent = t === 0 ? 0 : Math.round((c / t) * 100);
  }

  if (includeRequirements) {
    const { data: fullReqs, error: fullErr } = await supabase
      .from("onboarding_requirements")
      .select(
        "id,onboarding_id,type,label,is_required,sort_order,completed_at,completed_by,value_text,file_path,signature_path,created_at,updated_at"
      )
      .in("onboarding_id", ids)
      .order("sort_order", { ascending: true });

    if (fullErr) return json(400, { error: fullErr.message });

    const requirements: Record<string, any[]> = {};
    for (const id of ids) requirements[id] = [];

    for (const row of fullReqs || []) {
      const oid = row.onboarding_id as string;
      (requirements[oid] ||= []).push(row);
    }

    return json(200, { ok: true, progress, requirements });
  }

  return json(200, { ok: true, progress });
}