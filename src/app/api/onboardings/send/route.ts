import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SendOnboardingSchema } from "@/lib/onboarding-schema";
import { resend } from "@/lib/resend";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  followupsEnabledForTier,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";
import { appOrigin } from "@/lib/app-url";
import { renderClientEnforceEmail } from "@/lib/email-template";

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
    .select("id, org_id, client_id, title, client_token, status")
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

  const appUrl = appOrigin();
  const link = `${appUrl}/c/${onboarding.client_token}`;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const subject = `Action required: ${onboarding.title}`;
  const greeting = client.full_name ? `Hi ${client.full_name},` : "Hi,";
  const emailTemplate = renderClientEnforceEmail({
    preheader: `Complete your onboarding: ${onboarding.title}`,
    eyebrow: "Client onboarding",
    title: "Complete your onboarding",
    subtitle: onboarding.title,
    intro: greeting,
    paragraphs: [
      "Please complete your onboarding in ClientEnforce so your team can continue the next step.",
      `If the button does not work, copy and paste this link into your browser:\n${link}`,
    ],
    primaryCta: {
      label: "Open onboarding",
      href: link,
    },
    footerNote: "This is a transactional email from ClientEnforce.",
  });

  const { error: emailErr } = await resend.emails.send({
    from: "ClientEnforce <info@clientenforce.com>",
    to: [client.email],
    subject,
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (emailErr) return NextResponse.json({ error: emailErr.message }, { status: 400 });

  // Update onboarding state
  const { error: updErr } = await admin
    .from("onboardings")
    .update({ status: onboarding.status === "draft" ? "sent" : onboarding.status })
    .eq("id", onboarding.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

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
      const delayDays = Math.max(1, Number(orgSettings?.followup_delay_days ?? 1));
      const maxCount = Math.max(0, Number(orgSettings?.followup_max_count ?? 1));
      const sendHour = Math.min(23, Math.max(0, Number(orgSettings?.followup_send_hour ?? 9)));

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
