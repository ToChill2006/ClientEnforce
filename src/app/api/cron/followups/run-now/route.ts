import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, requireProfile } from "@/lib/rbac";
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

export const runtime = "nodejs";

export async function POST() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let role;
  try {
    role = await requireRole(["owner", "admin", "member"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!roleHasPermission(role, "followups_run")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await requireProfile();

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
      { error: "Follow-up automation is not included in your current plan. Upgrade to Pro to run reminders." },
      { status: 403 }
    );
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 500 });

  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const res = await fetch(`${base}/api/cron/followups/run`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}