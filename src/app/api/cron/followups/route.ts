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

  const primary = await supabase
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", profile.org_id)
    .single();

  let org = primary.data as any;
  let orgError = primary.error as any;

  if (orgError && /plan_tier/i.test(String(orgError?.message || ""))) {
    const fallback = await supabase
      .from("organizations")
      .select("tier")
      .eq("id", profile.org_id)
      .single();

    org = fallback.data as any;
    orgError = fallback.error as any;
  }

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

export async function PATCH(req: Request) {
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

  if (!roleHasPermission(role, "followups_run")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const primary = await supabase
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", profile.org_id)
    .single();

  let org = primary.data as any;
  let orgError = primary.error as any;

  if (orgError && /plan_tier/i.test(String(orgError?.message || ""))) {
    const fallback = await supabase
      .from("organizations")
      .select("tier")
      .eq("id", profile.org_id)
      .single();

    org = fallback.data as any;
    orgError = fallback.error as any;
  }

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);
  if (!followupsEnabledForTier(tier)) {
    return NextResponse.json(
      { error: "Follow-up automation is not included in your current plan. Upgrade to Pro to update reminders." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "").trim();
  const rawStatus = String(body?.status ?? "").trim().toLowerCase();
  const status = rawStatus === "cancelled" ? "cancelled" : rawStatus === "sent" ? "sent" : "";

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!status) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const now = new Date().toISOString();
  const payload =
    status === "sent"
      ? { status, last_error: null, sent_at: now, updated_at: now }
      : { status, updated_at: now };

  const { data: item, error } = await supabase
    .from("followup_jobs")
    .update(payload)
    .eq("org_id", profile.org_id)
    .eq("id", id)
    .select("id, status, last_error, sent_at, updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!item) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  return NextResponse.json({ item });
}
