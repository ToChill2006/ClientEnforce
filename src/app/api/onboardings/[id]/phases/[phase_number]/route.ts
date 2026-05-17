export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabaseServer } from "@/lib/supabase-server";
import { getOrgId, requireProfile } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

// PATCH /api/onboardings/[id]/phases/[phase_number]
// Accepts: { deadline: "YYYY-MM-DD" | null }
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; phase_number: string }> }
) {
  try {
    const { id: onboardingId, phase_number: phaseStr } = await params;
    const phaseNumber = parseInt(phaseStr, 10);
    if (isNaN(phaseNumber)) return err(400, "Invalid phase number");

    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const profile = await requireProfile();
    const body = await req.json().catch(() => null);
    if (!body || !("deadline" in body)) return err(400, "deadline field required");

    const deadline = body.deadline ?? null;
    if (deadline !== null && typeof deadline !== "string") return err(400, "deadline must be a date string or null");

    const { error } = await supabaseAdmin()
      .from("onboarding_phases")
      .update({ deadline, updated_at: new Date().toISOString() })
      .eq("onboarding_id", onboardingId)
      .eq("org_id", org_id)
      .eq("phase_number", phaseNumber);

    if (error) return err(400, error.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      action: "phase.deadline_set",
      entity_type: "phase",
      onboarding_id: onboardingId,
      metadata: { phase_number: phaseNumber, deadline },
    });
    return NextResponse.json({ ok: true, deadline });
  } catch (e: any) {
    return err(500, e?.message || "Internal error");
  }
}
