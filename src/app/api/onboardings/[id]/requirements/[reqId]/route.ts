import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole, getOrgId, HttpError, requireProfile } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { logAudit } from "@/lib/audit";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const PatchSchema = z.object({
  label: z.string().min(1).optional(),
  is_required: z.boolean().optional(),
  options: z.array(z.string()).optional().nullable(),
  allow_multi_select: z.boolean().optional(),
  include_other: z.boolean().optional(),
});

async function getOrgScopedRequirement(
  supabase: Awaited<ReturnType<typeof supabaseServer>>,
  onboardingId: string,
  reqId: string,
  orgId: string
) {
  // First verify the onboarding belongs to this org
  const { data: onboarding } = await supabase
    .from("onboardings")
    .select("id, org_id")
    .eq("id", onboardingId)
    .eq("org_id", orgId)
    .maybeSingle();

  if (!onboarding) return { req: null, notFound: true };

  const { data: req, error } = await supabase
    .from("onboarding_requirements")
    .select("*")
    .eq("id", reqId)
    .eq("onboarding_id", onboardingId)
    .maybeSingle();

  if (error) throw new HttpError(400, error.message);
  return { req, notFound: false };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: onboardingId, reqId } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "onboardings_review")) return err(403, "Forbidden");

    const profile = await requireProfile();
    const { req: existing, notFound } = await getOrgScopedRequirement(supabase, onboardingId, reqId, org_id);
    if (notFound || !existing) return err(404, "Requirement not found");

    const body = await req.json().catch(() => null);
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload: " + parsed.error.issues.map((i) => i.message).join(", "));

    const updates: Record<string, unknown> = {};
    if (parsed.data.label !== undefined) updates.label = parsed.data.label;
    if (parsed.data.is_required !== undefined) updates.is_required = parsed.data.is_required;
    if ("options" in parsed.data) updates.options = parsed.data.options ?? null;

    // Build metadata patch for multiple_choice config
    if (parsed.data.allow_multi_select !== undefined || parsed.data.include_other !== undefined) {
      const existingMeta = (existing as any).metadata ?? {};
      const nextMeta = { ...existingMeta };
      if (parsed.data.allow_multi_select !== undefined) nextMeta.allow_multi_select = parsed.data.allow_multi_select;
      if (parsed.data.include_other !== undefined) nextMeta.include_other = parsed.data.include_other;
      updates.metadata = nextMeta;
    }

    if (Object.keys(updates).length === 0) return err(400, "No fields to update");

    const admin = supabaseAdmin();
    const { data: updated, error: updateErr } = await admin
      .from("onboarding_requirements")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", reqId)
      .eq("onboarding_id", onboardingId)
      .select("*")
      .single();

    if (updateErr) return err(400, updateErr.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      actor_role: role,
      action: "requirement.updated",
      entity_type: "requirement",
      entity_id: reqId,
      onboarding_id: onboardingId,
    });
    return NextResponse.json({ requirement: updated });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; reqId: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: onboardingId, reqId } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "onboardings_review")) return err(403, "Forbidden");

    const profile = await requireProfile();
    const { req: existing, notFound } = await getOrgScopedRequirement(supabase, onboardingId, reqId, org_id);
    if (notFound || !existing) return err(404, "Requirement not found");

    const row = existing as any;

    // Allow removing template (non-ad-hoc) requirements only while the onboarding is in draft
    if (!row.is_ad_hoc) {
      const { data: ob } = await supabase.from("onboardings").select("status").eq("id", onboardingId).maybeSingle();
      if ((ob as any)?.status !== "draft") {
        return err(403, "Cannot remove a snapshotted requirement. Only ad-hoc requirements can be removed.");
      }
    }

    // Block if a submitted answer exists
    const hasAnswer =
      row.answer != null ||
      (row.value_text != null && row.value_text !== "") ||
      (row.file_path != null && row.file_path !== "") ||
      (row.signature_path != null && row.signature_path !== "") ||
      (Array.isArray(row.file_paths) && row.file_paths.length > 0);

    if (hasAnswer) {
      return err(
        409,
        "Cannot remove a requirement with a submitted answer. Flag it as 'needs revision' instead if the answer is no good."
      );
    }

    const admin = supabaseAdmin();
    const { error: deleteErr } = await admin
      .from("onboarding_requirements")
      .delete()
      .eq("id", reqId)
      .eq("onboarding_id", onboardingId);

    if (deleteErr) return err(400, deleteErr.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      actor_role: role,
      action: "requirement.deleted",
      entity_type: "requirement",
      entity_id: reqId,
      onboarding_id: onboardingId,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
