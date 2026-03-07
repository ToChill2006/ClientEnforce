import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function followupsEnabledForTier(tier: "free" | "pro" | "business") {
  return tier === "pro" || tier === "business";
}

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let profile;
  let role;
  try {
    profile = await requireProfile();
    role = await requireRole(["owner", "admin", "member"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!roleHasPermission(role, "followups_view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", profile.org_id)
    .single();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);

  if (!followupsEnabledForTier(tier)) {
    return NextResponse.json(
      { error: "Follow-up automation is not included in your current plan. Upgrade to Pro to view reminders." },
      { status: 403 }
    );
  }

  const { data: items, error } = await supabase
    .from("followup_jobs")
    .select("id, onboarding_id, to_email, subject, due_at, status, last_error, created_at, updated_at, sent_at")
    .eq("org_id", profile.org_id)
    .order("due_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items });
}