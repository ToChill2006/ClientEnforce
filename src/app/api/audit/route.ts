import { NextResponse } from "next/server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isMissingColumn(error: any, column: string) {
  return !!error?.message && new RegExp(`column .*${column}.* does not exist`, "i").test(error.message);
}

function pickActorLabel(event: any, profile: any) {
  const fullName =
    profile?.full_name ||
    profile?.display_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.name ||
    profile?.username ||
    null;

  return (
    fullName ||
    event?.actor_name ||
    profile?.email ||
    event?.actor_email ||
    event?.user_email ||
    null
  );
}

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function auditEnabledForTier(tier: "free" | "pro" | "business") {
  return tier === "pro" || tier === "business";
}

export async function GET(req: Request) {
  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "audit_view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin =
    typeof supabaseAdmin === "function"
      ? (supabaseAdmin as any)()
      : (supabaseAdmin as any);

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", profile.org_id)
    .single();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);
  if (!auditEnabledForTier(tier)) {
    return NextResponse.json(
      { error: "Audit log is not included in your current plan. Upgrade to Pro to access audit history." },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const onboardingId = url.searchParams.get("onboarding_id");
  const limit = Math.min(Number(url.searchParams.get("limit") || 200), 500);

  const orgId = profile.org_id;
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  let q = admin
    .from("audit_logs")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (onboardingId) q = q.eq("onboarding_id", onboardingId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const events = data ?? [];

  const actorIds = Array.from(
    new Set(
      events
        .map((event: any) => event.actor_user_id ?? event.user_id ?? null)
        .filter(Boolean)
    )
  );

  let actorMap = new Map<string, any>();

  if (actorIds.length > 0) {
    const loadById = async (withFullName: boolean) =>
      admin
        .from("profiles")
        .select(withFullName ? "id, user_id, full_name, display_name, first_name, last_name, name, username, email" : "id, user_id, display_name, first_name, last_name, name, username, email")
        .in("id", actorIds);

    const loadByUserId = async (withFullName: boolean) =>
      admin
        .from("profiles")
        .select(withFullName ? "id, user_id, full_name, display_name, first_name, last_name, name, username, email" : "id, user_id, display_name, first_name, last_name, name, username, email")
        .in("user_id", actorIds);

    let byId = await loadById(true);
    let byUserId = await loadByUserId(true);

    if (
      (byId.error && isMissingColumn(byId.error, "full_name")) ||
      (byUserId.error && isMissingColumn(byUserId.error, "full_name"))
    ) {
      byId = await loadById(false);
      byUserId = await loadByUserId(false);
    }

    const merged = new Map<string, any>();

    for (const row of byId.data ?? []) {
      if (row.id) merged.set(row.id, row);
      if (row.user_id) merged.set(row.user_id, row);
    }

    for (const row of byUserId.data ?? []) {
      if (row.id) merged.set(row.id, row);
      if (row.user_id) merged.set(row.user_id, row);
    }

    actorMap = merged;
  }

  const enrichedEvents = events.map((event: any) => {
    const actorId = event.actor_user_id ?? event.user_id ?? null;
    const actorProfile = actorId ? actorMap.get(actorId) : null;

    let actorLabel = pickActorLabel(event, actorProfile);

    // Fallback to the current signed-in profile when the actor id matches the requester.
    if (!actorLabel && actorId && actorId === profile.user_id) {
      actorLabel =
        profile.full_name ||
        profile.email ||
        null;
    }

    // Last resort: keep the UI populated with a short id.
    if (!actorLabel && actorId) {
      actorLabel = actorId.slice(0, 8);
    }

    return {
      ...event,
      actor_user_id: actorId,
      actor: actorLabel,
    };
  });

  return NextResponse.json({ events: enrichedEvents });
}