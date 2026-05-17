import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getOrgId, requireProfile } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: onboardingId } = await params;
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    // Fetch phases
    const { data: phases } = await supabase
      .from("onboarding_phases")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .eq("org_id", org_id)
      .order("phase_number", { ascending: true });

    if (phases && phases.length > 0) {
      return NextResponse.json({ phases });
    }

    // No phases — if onboarding is locked, auto-init a single review phase
    const { data: onb } = await supabase
      .from("onboardings")
      .select("id, org_id, locked")
      .eq("id", onboardingId)
      .eq("org_id", org_id)
      .single();

    if (!onb) return err(404, "Onboarding not found");

    if (onb.locked) {
      const now = new Date().toISOString();
      const { data: created } = await supabase
        .from("onboarding_phases")
        .upsert(
          {
            org_id,
            onboarding_id: onboardingId,
            phase_number: 1,
            name: "Review",
            status: "awaiting_review",
            created_at: now,
            updated_at: now,
          },
          { onConflict: "onboarding_id,phase_number" }
        )
        .select();
      return NextResponse.json({ phases: created ?? [] });
    }

    return NextResponse.json({ phases: [] });
  } catch (e: any) {
    return err(500, e?.message || "Internal error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: onboardingId } = await params;
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const profile = await requireProfile();
    const body = await req.json();
    const { phase_number, status } = body;
    if (!phase_number || !status) return err(400, "phase_number and status required");

    const validStatuses = ["locked", "in_progress", "awaiting_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) return err(400, "Invalid status");

    const { error } = await supabase
      .from("onboarding_phases")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("onboarding_id", onboardingId)
      .eq("org_id", org_id)
      .eq("phase_number", phase_number);

    if (error) return err(400, error.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      action: "phase.updated",
      entity_type: "phase",
      onboarding_id: onboardingId,
      metadata: { phase_number, status },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return err(500, e?.message || "Internal error");
  }
}
