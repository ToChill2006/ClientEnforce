import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { HttpError } from "@/lib/rbac";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

// Called from the exhibitor portal — no user auth, validated by the onboarding token
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; phase_number: string }> }
) {
  try {
    const { id: onboardingId, phase_number: phaseNumberStr } = await params;
    const phaseNumber = parseInt(phaseNumberStr, 10);

    // Portal calls pass the client_token in the body for authorization
    const body = await req.json().catch(() => ({}));
    const clientToken: string | null = body?.client_token ?? null;

    const admin = supabaseAdmin();

    // Validate onboarding by token
    const { data: onboarding, error: obErr } = await admin
      .from("onboardings")
      .select("id, org_id, client_token, client_id, event_id, owner_id, events(id, name), clients(id, full_name, email)")
      .eq("id", onboardingId)
      .single();

    if (obErr || !onboarding) return err(404, "Onboarding not found");
    if (clientToken && (onboarding as any).client_token !== clientToken) return err(403, "Invalid token");

    const org_id = (onboarding as any).org_id as string;

    const { data: phase, error: phaseErr } = await admin
      .from("onboarding_phases")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber)
      .single();

    if (phaseErr || !phase) return err(404, "Phase not found");

    const phaseStatus = (phase as any).status;
    if (phaseStatus !== "in_progress" && phaseStatus !== "rejected") {
      return err(400, `Phase cannot be submitted (current status: ${phaseStatus})`);
    }

    // Validate all required items in this phase have answers
    const { data: requirements } = await admin
      .from("onboarding_requirements")
      .select("id, label, is_required, value_text, value_json, file_path, signature_path, phase_number")
      .eq("onboarding_id", onboardingId);

    const phaseReqs = (requirements ?? []).filter(
      (r: any) => r.phase_number === phaseNumber || (!r.phase_number && phaseNumber === 1)
    );

    const missing = phaseReqs
      .filter((r: any) => {
        if (!r.is_required) return false;
        const hasAnswer = r.value_text || r.value_json || r.file_path || r.signature_path;
        return !hasAnswer;
      })
      .map((r: any) => r.label);

    if (missing.length > 0) {
      return err(400, `Required items missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` and ${missing.length - 3} more` : ""}`);
    }

    const now = new Date().toISOString();

    // Update phase to awaiting_review
    await admin
      .from("onboarding_phases")
      .update({ status: "awaiting_review", updated_at: now })
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber);

    // Update onboarding status so the admin badge reflects activity
    await admin
      .from("onboardings")
      .update({ status: "submitted", updated_at: now })
      .eq("id", onboardingId)
      .in("status", ["sent", "in_progress", "draft"]);

    // Clear needs_revision flags for resubmitted items
    await admin
      .from("onboarding_requirements")
      .update({ review_status: "pending", reviewer_comment: null, updated_at: now })
      .eq("onboarding_id", onboardingId)
      .eq("phase_number", phaseNumber)
      .eq("review_status", "needs_revision");

    const clientName = (onboarding as any).clients?.full_name ?? "Exhibitor";
    const eventName = (onboarding as any).events?.name ?? "the event";

    // Activity feed (best-effort)
    try {
      await admin.from("team_activity").insert({
        org_id,
        actor_kind: "exhibitor",
        verb: "submitted",
        subject_kind: "phase",
        subject_id: (phase as any).id,
        context: {
          onboarding_id: onboardingId,
          phase_number: phaseNumber,
          exhibitor_name: clientName,
          event_id: (onboarding as any).event_id,
          event_name: eventName,
        },
      });
    } catch { /* best-effort */ }

    // Email all org admins and owners about the submission
    try {
      const { sendOrgEmail } = await import("@/lib/send-email");
      const wl = await loadWhiteLabelForOrg(org_id);
      const phaseName = (phase as any).name ?? `Phase ${phaseNumber}`;
      const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://clientenforce.com"}/dashboard/onboardings/${onboardingId}`;

      // Get all admin/owner members of the org
      const { data: adminMembers } = await admin
        .from("memberships")
        .select("user_id")
        .eq("org_id", org_id)
        .in("role", ["owner", "admin"]);

      if (adminMembers && adminMembers.length > 0) {
        const userIds = adminMembers.map((m: any) => m.user_id);
        const { data: adminProfiles } = await admin
          .from("profiles")
          .select("email, full_name")
          .in("user_id", userIds);

        for (const profile of adminProfiles ?? []) {
          if (!(profile as any).email) continue;
          const { html, text } = renderClientEnforceEmail({
            preheader: `${clientName} submitted ${phaseName} for review`,
            eyebrow: "Awaiting review",
            title: `${clientName} submitted ${phaseName}`,
            subtitle: `For ${eventName}`,
            paragraphs: [
              `${clientName} has completed and submitted ${phaseName} for ${eventName}. Head to your dashboard to review and approve or request changes.`,
            ],
            primaryCta: { label: "Review submission →", href: reviewLink },
            branding: wl,
          });
          await sendOrgEmail(org_id, {
            to: (profile as any).email,
            subject: `${clientName} submitted ${phaseName} for review`,
            html,
            text,
          });
        }
      }
    } catch { /* best-effort */ }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
