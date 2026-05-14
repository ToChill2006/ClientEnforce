import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { sendOrgEmail } from "@/lib/send-email";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const RejectPayload = z.object({
  reviewer_note: z.string().optional().nullable(),
  per_item_flags: z.array(z.object({
    requirement_id: z.string().uuid(),
    comment: z.string().optional().nullable(),
  })).optional(),
});

export async function POST(
  req: Request,
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

    const body = await req.json().catch(() => null);
    const parsed = RejectPayload.safeParse(body ?? {});
    if (!parsed.success) return err(400, "Invalid payload");

    const { data: phase, error: phaseErr } = await supabase
      .from("onboarding_phases")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber)
      .eq("org_id", org_id)
      .single();

    if (phaseErr || !phase) return err(404, "Phase not found");
    if (!["awaiting_review", "in_progress"].includes((phase as any).status)) return err(400, "Phase is not awaiting review");

    const now = new Date().toISOString();
    const { reviewer_note, per_item_flags } = parsed.data;

    // Reject the phase
    await supabase
      .from("onboarding_phases")
      .update({
        status: "rejected",
        reviewer_id: userData.user.id,
        reviewer_note: reviewer_note ?? null,
        reviewed_at: now,
        updated_at: now,
      })
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber);

    // Flag individual requirements — do NOT wipe submitted answers
    if (per_item_flags && per_item_flags.length > 0) {
      for (const flag of per_item_flags) {
        await supabase
          .from("onboarding_requirements")
          .update({
            review_status: "needs_revision",
            reviewer_comment: flag.comment ?? null,
            updated_at: now,
          })
          .eq("id", flag.requirement_id)
          .eq("onboarding_id", onboardingId);
      }
    }

    // Fetch onboarding + client for emails — use admin to bypass RLS on the clients join
    const { data: onboarding } = await supabaseAdmin()
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
    const phaseName = (phase as any).name;
    const flagCount = per_item_flags?.length ?? 0;

    if (clientEmail) {
      try {
        const flaggedSummary = flagCount > 0
          ? `<p>${flagCount} item${flagCount === 1 ? "" : "s"} need${flagCount === 1 ? "s" : ""} revision. Please review the highlighted items in your portal.</p>`
          : "";
        const noteSummary = reviewer_note
          ? `<blockquote>${reviewer_note}</blockquote>`
          : "";

        await sendOrgEmail(org_id, {
          to: clientEmail,
          subject: `Action needed on ${phaseName} for ${eventName}`,
          html: `<p>Hi ${clientName},</p><p><strong>${phaseName}</strong> for <strong>${eventName}</strong> requires some updates.</p>${noteSummary}${flaggedSummary}<p><a href="${portalLink}">Review and resubmit</a></p>`,
          text: `Hi ${clientName},\n\n${phaseName} for ${eventName} requires some updates.\n\n${reviewer_note ?? ""}\n\n${portalLink}`,
        });
      } catch { /* best-effort */ }
    }

    // Activity feed (best-effort)
    try {
      await supabase.from("team_activity").insert({
        org_id,
        actor_user_id: userData.user.id,
        actor_kind: "user",
        verb: "rejected",
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

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
