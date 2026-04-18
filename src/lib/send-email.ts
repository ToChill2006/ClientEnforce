import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import nodemailer from "nodemailer";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

export type SendOrgEmailOpts = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function isMissingColumnError(err: any) {
  const msg = String(err?.message || err || "");
  return (
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    msg.includes("Could not find")
  );
}

/**
 * Send a client-facing email on behalf of an organisation.
 * Uses the org's configured provider (ClientEnforce/Resend or custom SMTP).
 * Always throws on failure — callers should catch and handle.
 *
 * Security note: SMTP credentials are stored as plaintext in the organizations
 * table, protected by Supabase RLS (org members only). At-rest encryption can
 * be added in a future hardening sprint.
 */
export async function sendOrgEmail(orgId: string, opts: SendOrgEmailOpts): Promise<void> {
  const admin = supabaseAdmin();

  let provider = "clientenforce";
  let smtpHost: string | null = null;
  let smtpPort: number | null = null;
  let smtpSecure: boolean | null = null;
  let smtpUsername: string | null = null;
  let smtpPassword: string | null = null;
  let smtpFromEmail: string | null = null;
  let smtpFromName: string | null = null;

  try {
    const { data, error } = await admin
      .from("organizations")
      .select(
        "email_provider, smtp_host, smtp_port, smtp_secure, smtp_username, smtp_password, smtp_from_email, smtp_from_name"
      )
      .eq("id", orgId)
      .single();

    if (error && !isMissingColumnError(error)) {
      throw new Error(`Failed to load email provider config: ${error.message}`);
    }

    if (data) {
      provider = data.email_provider ?? "clientenforce";
      smtpHost = data.smtp_host ?? null;
      smtpPort = data.smtp_port ?? null;
      smtpSecure = data.smtp_secure ?? null;
      smtpUsername = data.smtp_username ?? null;
      smtpPassword = data.smtp_password ?? null;
      smtpFromEmail = data.smtp_from_email ?? null;
      smtpFromName = data.smtp_from_name ?? null;
    }
  } catch (e: any) {
    if (!isMissingColumnError(e)) throw e;
    // Pre-migration DB — fall through to ClientEnforce default
  }

  if (provider === "smtp") {
    if (!smtpHost || !smtpPort) {
      throw new Error("Custom SMTP is selected but host/port are not configured.");
    }
    if (!smtpFromEmail) {
      throw new Error("Custom SMTP is selected but From email is not configured.");
    }

    const from = smtpFromName ? `${smtpFromName} <${smtpFromEmail}>` : smtpFromEmail;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure ?? false,
      // Only attach auth if both credentials are present
      ...(smtpUsername && smtpPassword
        ? { auth: { user: smtpUsername, pass: smtpPassword } }
        : {}),
      // Fail fast in serverless environments
      connectionTimeout: 10_000,
      socketTimeout: 30_000,
    });

    await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });

    return;
  }

  // Default: ClientEnforce via Resend — but honour Agency Pro white-label reply-to
  // so clients see the agency's support address rather than info@clientenforce.com.
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const wl = await loadWhiteLabelForOrg(orgId);
  const brandName = wl.brand_name?.trim() || "ClientEnforce";
  const from = `${brandName} <info@clientenforce.com>`;
  const replyTo = wl.support_email?.trim() || undefined;

  const { error: emailErr } = await resend.emails.send({
    from,
    replyTo,
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (emailErr) {
    throw new Error(emailErr.message);
  }
}
