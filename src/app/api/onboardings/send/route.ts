import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SendOnboardingSchema } from "@/lib/onboarding-schema";
import { sendOrgEmail } from "@/lib/send-email";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  followupsEnabledForTier,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";
import { appOrigin } from "@/lib/app-url";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg, emailBrandingFromWhiteLabel } from "@/lib/white-label";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_send")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to send onboarding links.") }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = SendOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await requireProfile();

  const admin = supabaseAdmin();
  const orgId = profile.org_id;

  // Load onboarding + client
  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, client_id, title, client_token, status, event_id, metadata")
    .eq("id", parsed.data.onboarding_id)
    .single();

  if (onboardingErr) return NextResponse.json({ error: onboardingErr.message }, { status: 400 });
  if (onboarding.org_id !== orgId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: client, error: clientErr } = await admin
    .from("clients")
    .select("email, full_name")
    .eq("id", onboarding.client_id)
    .single();

  if (clientErr) return NextResponse.json({ error: clientErr.message }, { status: 400 });

  // Load org email template settings (best-effort)
  let emailSettings: {
    email_subject_template?: string | null;
    email_heading?: string | null;
    email_body?: string | null;
    email_cta_label?: string | null;
  } = {};
  try {
    const { data: orgEmail } = await admin
      .from("organizations")
      .select("email_subject_template, email_heading, email_body, email_cta_label")
      .eq("id", orgId)
      .single();
    if (orgEmail) emailSettings = orgEmail;
  } catch {
    // Columns not yet migrated — use defaults
  }

  // Load white-label settings (tier-gated to Agency Pro). Returns an empty
  // object for non-agency orgs, so custom_domain / brand customisation only
  // apply when the org is actually entitled to them.
  const whiteLabel = await loadWhiteLabelForOrg(orgId);
  const branding = emailBrandingFromWhiteLabel(whiteLabel);
  const brandName = branding.brand_name || "ClientEnforce";

  // Use custom domain for portal link if configured, otherwise fall back to app origin
  const customDomain = whiteLabel.custom_domain?.trim() || null;
  const baseUrl = customDomain ? `https://${customDomain}` : appOrigin();
  const link = `${baseUrl}/c/${onboarding.client_token}`;

  function interpolate(template: string | null | undefined, title: string) {
    if (!template) return null;
    return template.replace(/\{\{title\}\}/gi, title);
  }

  const subject =
    interpolate(emailSettings.email_subject_template, onboarding.title) ??
    `Action required: ${onboarding.title}`;

  const greeting = client.full_name ? `Hi ${client.full_name},` : "Hi,";

  const emailTemplate = renderClientEnforceEmail({
    preheader: `Complete your onboarding: ${onboarding.title}`,
    eyebrow: "Client onboarding",
    title: emailSettings.email_heading?.trim() || "Complete your onboarding",
    subtitle: onboarding.title,
    intro: greeting,
    paragraphs: [
      emailSettings.email_body?.trim() ||
        `Please complete your onboarding in ${brandName} so your team can continue the next step.`,
      `If the button does not work, copy and paste this link into your browser:\n${link}`,
    ],
    primaryCta: {
      label: emailSettings.email_cta_label?.trim() || "Open onboarding",
      href: link,
    },
    footerNote: `This is a transactional email from ${brandName}.`,
    branding,
  });

  try {
    await sendOrgEmail(orgId, {
      to: client.email,
      subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to send email" }, { status: 400 });
  }

  // Update onboarding state
  const { error: updErr } = await admin
    .from("onboardings")
    .update({ status: onboarding.status === "draft" ? "sent" : onboarding.status })
    .eq("id", onboarding.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  // Event exhibitors use the deadline-based reminder rules system instead of the
  // generic follow-up scheduler, so skip queuing for them.
  if ((onboarding as any).event_id) {
    return NextResponse.json({ ok: true });
  }

  // Create follow-up jobs only when follow-up automation is enabled for the current plan.
  const { tier, error: tierError } = await selectOrganizationTier(admin as any, orgId);
  if (tierError) {
    console.warn("tier lookup failed in onboarding send", tierError);
  }

  if (followupsEnabledForTier(tier)) {
    try {
      const { data: orgSettings, error: orgSettingsErr } = await admin
        .from("organizations")
        .select("followup_delay_days, followup_max_count, followup_send_hour, followup_timezone")
        .eq("id", orgId)
        .single();

      // Defaults if org does not have settings yet
      let delayDays = Math.max(1, Number(orgSettings?.followup_delay_days ?? 1));
      let maxCount = Math.max(0, Number(orgSettings?.followup_max_count ?? 1));
      const sendHour = Math.min(23, Math.max(0, Number(orgSettings?.followup_send_hour ?? 9)));

      // Per-onboarding override — stored in onboardings.metadata.reminders
      const meta = (onboarding as any).metadata;
      const override = meta && typeof meta === "object" ? (meta as any).reminders : null;
      if (override && typeof override === "object" && override.enabled) {
        if (typeof override.days_between === "number" && override.days_between >= 1) {
          delayDays = Math.max(1, Math.min(90, Math.floor(override.days_between)));
        }
        if (typeof override.max_reminders === "number" && override.max_reminders >= 0) {
          maxCount = Math.max(0, Math.min(20, Math.floor(override.max_reminders)));
        }
      }

      if (orgSettingsErr) {
        // If the table/columns aren't present yet, skip quietly.
        throw new Error(orgSettingsErr.message);
      }

      if (maxCount > 0) {
        const now = new Date();

        // Schedule the first follow-up at `sendHour` UTC on (now + delayDays).
        const first = new Date(now);
        first.setUTCDate(first.getUTCDate() + delayDays);
        first.setUTCHours(sendHour, 0, 0, 0);

        // If that time is still in the past (edge cases), push it 1 day.
        if (first.getTime() <= now.getTime()) {
          first.setUTCDate(first.getUTCDate() + 1);
        }

        const jobs = Array.from({ length: maxCount }).map((_, i) => {
          const due = new Date(first);
          due.setUTCDate(due.getUTCDate() + i * delayDays);
          return {
            org_id: orgId,
            onboarding_id: onboarding.id,
            to_email: client.email,
            subject: `Reminder: ${onboarding.title}`,
            body: `Please complete your onboarding: ${link}`,
            due_at: due.toISOString(),
            status: "queued" as const,
          };
        });

        const { error: jobErr } = await admin.from("followup_jobs").insert(jobs);
        if (jobErr) {
          // Don't fail the send just because followups couldn't be queued.
          console.warn("followup_jobs insert failed", jobErr);
        }
      }
    } catch (e) {
      // Do not fail the send flow if follow-up scheduling fails.
      console.warn("follow-up schedule skipped", e);
    }
  }

  await admin.from("audit_logs").insert({
    org_id: orgId,
    actor_user_id: userData.user.id,
    action: "onboarding.sent",
    entity_type: "onboarding",
    entity_id: onboarding.id,
    metadata: { to: client.email, link },
  });

  return NextResponse.json({ ok: true, link });
}
