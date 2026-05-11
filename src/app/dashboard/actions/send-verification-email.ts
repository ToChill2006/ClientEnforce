"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { appOrigin } from "@/lib/app-url";
import { renderClientEnforceEmail } from "@/lib/email-template";

const RATE_LIMIT_SECONDS = 60;

export async function sendVerificationEmail(): Promise<{ error?: string }> {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "Not signed in." };

  const email = data.user.email;
  if (!email) return { error: "No email address on account." };

  const admin = supabaseAdmin();

  // 60-second rate limit via email_verification_sent_at
  const { data: profile } = await admin
    .from("profiles")
    .select("email_verification_sent_at, email_verified")
    .eq("user_id", data.user.id)
    .limit(1)
    .single();

  if (profile?.email_verified) return { error: "Email already verified." };

  if (profile?.email_verification_sent_at) {
    const sentAt = new Date(profile.email_verification_sent_at).getTime();
    const secondsAgo = (Date.now() - sentAt) / 1000;
    if (secondsAgo < RATE_LIMIT_SECONDS) {
      const wait = Math.ceil(RATE_LIMIT_SECONDS - secondsAgo);
      return { error: `Please wait ${wait}s before requesting another email.` };
    }
  }

  // Generate a magic link that the /auth/verify-email route will handle
  const redirectTo = new URL("/auth/verify-email", appOrigin()).toString();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return { error: "Could not generate verification link." };
  }

  const verifyUrl = new URL("/auth/verify-email", appOrigin());
  verifyUrl.searchParams.set("token_hash", linkData.properties.hashed_token);
  verifyUrl.searchParams.set("type", "magiclink");

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";

  const emailTemplate = renderClientEnforceEmail({
    preheader: "Verify your ClientEnforce email address",
    eyebrow: "Account security",
    title: "Verify your email address",
    subtitle: "One click to confirm your account.",
    paragraphs: [
      "Click the button below to verify your email address and secure your ClientEnforce account.",
      "If you did not request this, you can safely ignore this message.",
    ],
    primaryCta: {
      label: "Verify email address",
      href: verifyUrl.toString(),
    },
    footerNote: "This is a transactional email from ClientEnforce.",
  });

  const send = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Verify your ClientEnforce email address",
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (send && "error" in send && send.error) {
    return { error: "Failed to send email. Please try again." };
  }

  await admin
    .from("profiles")
    .update({ email_verification_sent_at: new Date().toISOString() })
    .eq("user_id", data.user.id);

  return {};
}
