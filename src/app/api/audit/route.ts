import { NextResponse } from "next/server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const profile = await requireProfile();
  await requireRole(["owner", "admin"]);

  const url = new URL(req.url);
  const onboardingId = url.searchParams.get("onboarding_id");
  const limit = Math.min(Number(url.searchParams.get("limit") || 200), 500);

  // you likely have org_id on profile
  const orgId = profile.org_id;
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const admin =
    typeof supabaseAdmin === "function"
      ? (supabaseAdmin as any)()
      : (supabaseAdmin as any);

  let q = admin
    .from("audit_logs")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (onboardingId) q = q.eq("onboarding_id", onboardingId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ events: data ?? [] });
}