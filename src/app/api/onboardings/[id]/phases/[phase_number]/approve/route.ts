import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { sendOrgEmail } from "@/lib/send-email";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

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

      // Reset onboarding to in_progress so the client can fill out the next phase
      await supabase
        .from("onboardings")
        .update({ status: "in_progress", updated_at: now })
        .eq("id", onboardingId);
    } else {
      // No more phases — mark onboarding as completed
      await supabase
        .from("onboardings")
        .update({ status: "completed", updated_at: now })
        .eq("id", onboardingId);
    }

    // Fetch onboarding + client for emails
    const adminClient = supabaseAdmin();
    const { data: onboarding } = await adminClient
      .from("onboardings")
      .select("id, title, client_id, event_id, client_token, events(id, name), clients(id, full_name, email)")
      .eq("id", onboardingId)
      .eq("org_id", org_id)
      .single();

    let clientName = (onboarding as any)?.clients?.full_name ?? "Exhibitor";
    let clientEmail = (onboarding as any)?.clients?.email ?? null;
    const eventName = (onboarding as any)?.events?.name ?? "the event";
    const token = (onboarding as any)?.client_token;
    const portalBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://clientenforce.com";
    const portalLink = token ? `${portalBase}/c/${token}` : portalBase;
    const currentPhaseName = (phase as any).name ?? `Phase ${phaseNumber}`;

    // Fallback: join sometimes returns null if FK not cached — look up client directly
    if (!clientEmail && (onboarding as any)?.client_id) {
      const { data: clientRow } = await adminClient
        .from("clients")
        .select("full_name, email")
        .eq("id", (onboarding as any).client_id)
        .single();
      if (clientRow) {
        clientEmail = clientRow.email ?? null;
        clientName = clientRow.full_name ?? clientName;
      }
    }

    // Send email
    if (clientEmail) {
      try {
        const wl = await loadWhiteLabelForOrg(org_id);
        const nextPhaseName = (nextPhase as any)?.name ?? `Phase ${phaseNumber + 1}`;

        const { html, text } = nextPhase
          ? renderClientEnforceEmail({
              preheader: `${currentPhaseName} approved — next up: ${nextPhaseName}`,
              eyebrow: "Phase approved",
              title: `${currentPhaseName} approved!`,
              subtitle: `For ${eventName}`,
              paragraphs: [
                `Hi ${clientName}, great news — ${currentPhaseName} has been approved.`,
                `You can now move on to ${nextPhaseName}${(nextPhase as any).deadline ? ` (deadline: ${(nextPhase as any).deadline})` : ""}.`,
              ],
              primaryCta: { label: "Continue your onboarding →", href: portalLink },
              branding: wl,
            })
          : renderClientEnforceEmail({
              preheader: `Your onboarding for ${eventName} is complete`,
              eyebrow: "Onboarding complete",
              title: "You're all done!",
              subtitle: `Onboarding for ${eventName}`,
              paragraphs: [
                `Hi ${clientName}, congratulations — your onboarding for ${eventName} is now fully complete.`,
                "All phases have been reviewed and approved. You're good to go!",
              ],
              primaryCta: { label: "View your onboarding →", href: portalLink },
              branding: wl,
            });

        await sendOrgEmail(org_id, {
          to: clientEmail,
          subject: nextPhase
            ? `${currentPhaseName} approved — proceed to ${nextPhaseName}`
            : `Onboarding complete for ${eventName}`,
          html,
          text,
        });
      } catch (emailErr: any) {
        console.error("[approve] email send failed:", emailErr?.message || String(emailErr));
      }
    } else {
      console.warn("[approve] no client email found for onboarding", onboardingId);
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
