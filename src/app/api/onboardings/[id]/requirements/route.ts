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

const ALLOWED_TYPES = ["text", "textarea", "file", "signature", "select", "heading", "date", "checkbox", "multiple_choice", "info"] as const;

const PostSchema = z.object({
  phase_number: z.number().int().min(1),
  type: z.enum(ALLOWED_TYPES),
  label: z.string().min(1),
  is_required: z.boolean(),
  options: z.array(z.string()).optional(),
  allow_multi_select: z.boolean().optional(),
  include_other: z.boolean().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: onboardingId } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "onboardings_review")) return err(403, "Forbidden");

    const profile = await requireProfile();

    // Verify onboarding belongs to caller's org
    const { data: onboarding, error: obErr } = await supabase
      .from("onboardings")
      .select("id, org_id")
      .eq("id", onboardingId)
      .eq("org_id", org_id)
      .maybeSingle();

    if (obErr) return err(400, obErr.message);
    if (!onboarding) return err(404, "Onboarding not found");

    const body = await req.json().catch(() => null);
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload: " + parsed.error.issues.map((i) => i.message).join(", "));

    const { phase_number, type, label, is_required, options, allow_multi_select, include_other } = parsed.data;

    // Check if this phase is locked for editing
    const { data: phaseRow } = await supabase
      .from("onboarding_phases")
      .select("status")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phase_number)
      .maybeSingle();

    // Look up onboarding status so draft onboardings can have requirements added to any phase
    const { data: onboardingRow } = await supabase
      .from("onboardings")
      .select("status")
      .eq("id", onboardingId)
      .maybeSingle();
    const onboardingStatus = (onboardingRow as any)?.status ?? null;
    const isDraft = onboardingStatus === "draft";

    const phaseStatus = (phaseRow as any)?.status ?? null;
    if (phaseStatus === "awaiting_review" || phaseStatus === "approved") {
      return err(409, `Cannot add requirements to a phase that is ${phaseStatus === "awaiting_review" ? "under review" : "approved"}.`);
    }
    // "locked" phases can only receive new requirements while the onboarding is still a draft
    if (phaseStatus === "locked" && !isDraft) {
      return err(409, "Cannot add requirements to a locked phase.");
    }

    // Auto-assign sort_order = max + 1 for this onboarding + phase
    const { data: maxRow } = await supabase
      .from("onboarding_requirements")
      .select("sort_order")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phase_number)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSortOrder = ((maxRow as any)?.sort_order ?? -1) + 1;

    // Get current user id for created_by
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id ?? null;

    const metadataObj: Record<string, unknown> = {};
    if (allow_multi_select) metadataObj.allow_multi_select = true;
    if (include_other) metadataObj.include_other = true;
    const metadata = Object.keys(metadataObj).length > 0 ? metadataObj : null;

    const admin = supabaseAdmin();
    const { data: newReq, error: insertErr } = await admin
      .from("onboarding_requirements")
      .insert({
        onboarding_id: onboardingId,
        org_id,
        phase_number,
        type,
        label,
        is_required,
        options: options ?? null,
        metadata,
        sort_order: nextSortOrder,
        is_ad_hoc: true,
        created_by: userId,
      })
      .select("*")
      .single();

    if (insertErr) return err(400, insertErr.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      actor_role: role,
      action: "requirement.created",
      entity_type: "requirement",
      entity_id: (newReq as any).id,
      onboarding_id: onboardingId,
      metadata: { label, type },
    });
    return NextResponse.json({ requirement: newReq }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
