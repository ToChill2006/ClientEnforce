import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

const PatchSchema = z.object({
  followup_delay_days: z.number().int().min(1).max(30),
  followup_max_count: z.number().int().min(0).max(10),
  followup_send_hour: z.number().int().min(0).max(23),
  followup_timezone: z.string().min(1).max(64),
});

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

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

async function selectOrganizationTier(supabase: Awaited<ReturnType<typeof supabaseServer>>, orgId: string) {
  const primary = await supabase
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", orgId)
    .single();

  if (!(primary as any)?.error) {
    return { data: (primary as any).data ?? null, error: null as any };
  }

  const err = (primary as any).error;
  const msg = String(err?.message || "").toLowerCase();

  if (msg.includes("plan_tier") && (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))) {
    const fallback = await supabase
      .from("organizations")
      .select("tier")
      .eq("id", orgId)
      .single();

    return { data: (fallback as any).data ?? null, error: (fallback as any).error ?? null };
  }

  if (msg.includes("tier") && (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))) {
    const fallback = await supabase
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single();

    return { data: (fallback as any).data ?? null, error: (fallback as any).error ?? null };
  }

  return { data: null, error: err };
}

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "followups_view")) {
    return json(403, { error: "Forbidden" });
  }

  const { data: orgTier, error: tierError } = await selectOrganizationTier(supabase, profile.org_id);

  if (tierError) return json(400, { error: tierError.message });

  const tier = normalizeTier((orgTier as any)?.tier ?? (orgTier as any)?.plan_tier);
  if (!followupsEnabledForTier(tier)) {
    return json(403, {
      error: "Follow-up automation is not included in your current plan. Upgrade to Pro to enable automated reminders.",
    });
  }

  const { data: org, error } = await supabase
    .from("organizations")
    .select("id, followup_delay_days, followup_max_count, followup_send_hour, followup_timezone")
    .eq("id", profile.org_id)
    .single();

  if (error) return json(400, { error: error.message });
  return json(200, { settings: org });
}

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "followups_settings_write")) {
    return json(403, { error: "Forbidden" });
  }

  const { data: orgTier, error: tierError } = await selectOrganizationTier(supabase, profile.org_id);

  if (tierError) return json(400, { error: tierError.message });

  const tier = normalizeTier((orgTier as any)?.tier ?? (orgTier as any)?.plan_tier);
  if (!followupsEnabledForTier(tier)) {
    return json(403, {
      error: "Follow-up automation is not included in your current plan. Upgrade to Pro to modify reminder settings.",
    });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, {
      error: "Invalid payload",
      details: parsed.error.flatten(),
    });
  }

  const { error } = await supabase
    .from("organizations")
    .update(parsed.data)
    .eq("id", profile.org_id);

  if (error) return json(400, { error: error.message });
  return json(200, { ok: true });
}