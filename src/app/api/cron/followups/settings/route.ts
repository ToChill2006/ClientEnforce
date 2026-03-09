import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  followupsEnabledForTier,
  followupsUnavailableMessage,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";

const PatchSchema = z.object({
  followup_delay_days: z.number().int().min(1).max(30),
  followup_max_count: z.number().int().min(0).max(10),
  followup_send_hour: z.number().int().min(0).max(23),
  followup_timezone: z.string().min(1).max(64),
});

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "followups_view")) {
    return json(403, { error: permissionDenied("You do not have access to view follow-up settings.") });
  }

  const { tier, error: tierError } = await selectOrganizationTier(supabase, profile.org_id);

  if (tierError) return json(400, { error: tierError.message });

  if (!followupsEnabledForTier(tier)) {
    return json(403, {
      error: followupsUnavailableMessage("view"),
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
    return json(403, { error: permissionDenied("You do not have access to change follow-up settings.") });
  }

  const { tier, error: tierError } = await selectOrganizationTier(supabase, profile.org_id);

  if (tierError) return json(400, { error: tierError.message });

  if (!followupsEnabledForTier(tier)) {
    return json(403, {
      error: followupsUnavailableMessage("configure"),
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
