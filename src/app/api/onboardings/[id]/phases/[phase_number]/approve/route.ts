import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { sendOrgEmail } from "@/lib/send-email";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; phase_number: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: onboardingId, phase_number: phaseNumberStr } = await params;
    const phaseNumber = parseInt(phaseNumberStr, 10);

    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "onboardings_review")) return err(403, "Forbidden");

    // Fetch the phase
    const { data: phase, error: phaseErr } = await supabase
      .from("onboarding_phases")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber)
      .eq("org_id", org_id)
      .single();

    if (phaseErr || !phase) return err(404, "Phase not found");
    const reviewableStatuses = ["awaiting_review", "in_progress"];
    if (!reviewableStatuses.includes((phase as any).status)) return err(400, "Phase is not awaiting review");

    const now = new Date().toISOString();

    // Approve the phase
    await supabase
      .from("onboarding_phases")
      .update({
        status: "approved",
        reviewer_id: userData.user.id,
        reviewed_at: now,
        updated_at: now,
      })
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber);

    // Mark all requirements in this phase as approved
    await supabase
      .from("onboarding_requirements")
      .update({ review_status: "approved", updated_at: now })
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber)
      .neq("review_status", "needs_revision");

    // Unlock the next phase if it exists
    const { data: nextPhase } = await supabase
      .from("onboarding_phases")
      .select("id, name, deadline, phase_number")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber + 1)
      .maybeSingle();

    if (nextPhase) {
      await supabase
        .from("onboarding_phases")
        .update({ status: "in_progress", updated_at: now })
        .eq("id", (nextPhase as any).id);
    }

    // Fetch onboarding + client for emails
    const { data: onboarding } = await supabase
      .from("onboardings")
      .select("id, title, client_id, event_id, client_token, events(id, name), clients(id, full_name, email)")
      .eq("id", onboardingId)
      .eq("org_id", org_id)
      .single();

    const clientName = (onboarding as any)?.clients?.full_name ?? "Exhibitor";
    const clientEmail = (onboarding as any)?.clients?.email ?? null;
    const eventName = (onboarding as any)?.events?.name ?? "the event";
    const token = (onboarding as any)?.client_token;
    const portalBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://clientenforce.com";
    const portalLink = token ? `${portalBase}/c/${token}` : portalBase;
    const currentPhaseName = (phase as any).name;

    // Send email
    if (clientEmail) {
      try {
        if (nextPhase) {
          await sendOrgEmail(org_id, {
            to: clientEmail,
            subject: `Phase ${phaseNumber} approved — you can proceed to ${(nextPhase as any).name}`,
            html: `<p>Hi ${clientName},</p><p>Phase <strong>${currentPhaseName}</strong> has been approved for <strong>${eventName}</strong>.</p><p>You can now proceed to <strong>${(nextPhase as any).name}</strong>${(nextPhase as any).deadline ? ` (deadline: ${(nextPhase as any).deadline})` : ""}.</p><p><a href="${portalLink}">Continue your onboarding</a></p>`,
            text: `Hi ${clientName},\n\n${currentPhaseName} has been approved for ${eventName}.\n\nYou can now proceed to ${(nextPhase as any).name}.\n\n${portalLink}`,
          });
        } else {
          await sendOrgEmail(org_id, {
            to: clientEmail,
            subject: `Onboarding complete for ${eventName}`,
            html: `<p>Hi ${clientName},</p><p>Congratulations! Your onboarding for <strong>${eventName}</strong> is now complete.</p><p><a href="${portalLink}">View your completed onboarding</a></p>`,
            text: `Hi ${clientName},\n\nCongratulations! Your onboarding for ${eventName} is now complete.\n\n${portalLink}`,
          });
        }
      } catch { /* best-effort */ }
    }

    // Activity feed (best-effort)
    try {
      await supabase.from("team_activity").insert({
        org_id,
        actor_user_id: userData.user.id,
        actor_kind: "user",
        verb: "approved",
        subject_kind: "phase",
        subject_id: (phase as any).id,
        context: {
          onboarding_id: onboardingId,
          phase_number: phaseNumber,
          client_name: clientName,
          event_id: (onboarding as any)?.event_id,
          event_name: eventName,
        },
      });
    } catch { /* best-effort */ }

    return NextResponse.json({ ok: true, next_phase: nextPhase ?? null });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
