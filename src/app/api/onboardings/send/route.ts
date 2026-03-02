import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { SendOnboardingSchema } from "@/lib/onboarding-schema";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = SendOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", userData.user.id)
    .single();
  if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 400 });

  const { data: membership, error: membershipErr } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", profile.org_id)
    .eq("user_id", userData.user.id)
    .single();
  if (membershipErr) return NextResponse.json({ error: membershipErr.message }, { status: 400 });
  if (!(membership.role === "owner" || membership.role === "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const link = `${appUrl}/c/${onboarding.client_token}`;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const subject = `Action required: ${onboarding.title}`;
  const greeting = client.full_name ? `Hi ${client.full_name},` : "Hi,";
  const html = `
    <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
      <p>${greeting}</p>
      <p>Please complete your onboarding:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Thank you.</p>
    </div>
  `;

  const { error: emailErr } = await resend.emails.send({
    from: "ClientEnforce <info@clientenforce.com>",
    to: [client.email],
    subject,
    html,
  });

  if (emailErr) return NextResponse.json({ error: emailErr.message }, { status: 400 });

  // Update onboarding state
  const { error: updErr } = await admin
    .from("onboardings")
    .update({ status: onboarding.status === "draft" ? "sent" : onboarding.status })
    .eq("id", onboarding.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  // Create follow-up jobs using org settings (fallback to 24h if settings missing)
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
    // Timezone is stored but we schedule in UTC unless you later add a TZ library.
    const timezone = String(orgSettings?.followup_timezone ?? "UTC");

    if (orgSettingsErr) {
      // If the table/columns aren't present yet, fall back.
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
    // Fallback: single follow-up in 24h
    const { error: jobErr } = await admin.from("followup_jobs").insert({
      org_id: orgId,
      onboarding_id: onboarding.id,
      to_email: client.email,
      subject: `Reminder: ${onboarding.title}`,
      body: `Please complete your onboarding: ${link}`,
      due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "queued",
    });
    if (jobErr) console.warn("followup_jobs fallback insert failed", jobErr);
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