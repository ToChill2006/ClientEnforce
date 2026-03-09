"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { appOrigin, buildAuthTokenLink, normalizeAuthEmailLink } from "@/lib/app-url";
import { renderClientEnforceEmail } from "@/lib/email-template";

function isLocalSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("127.0.0.1:54321") || url.includes("localhost:54321");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(
      "/forgot-password?error=" +
        encodeURIComponent("Please enter your email address.")
    );
  }

  if (isLocalSupabase()) {
    const supabase = await supabaseServer();
    const callback = new URL("/auth/callback", appOrigin());
    callback.searchParams.set("next", "/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callback.toString(),
    });

    if (error) {
      redirect(
        "/forgot-password?error=" +
          encodeURIComponent(error.message || "Failed to send reset email")
      );
    }

    redirect(
      "/forgot-password?sent=1&email=" + encodeURIComponent(email)
    );
  }

  // Generate Supabase recovery link
  const admin = supabaseAdmin();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${appOrigin()}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    },
  });

  if (error || !data?.properties?.action_link) {
    redirect(
      "/forgot-password?error=" +
        encodeURIComponent(error?.message || "Could not generate reset link")
    );
  }

  const resetLink =
    buildAuthTokenLink({
      tokenHash: data?.properties?.hashed_token,
      type: "recovery",
      next: "/reset-password",
    }) || normalizeAuthEmailLink(data.properties.action_link);

  const emailTemplate = renderClientEnforceEmail({
    preheader: "Reset your ClientEnforce password",
    eyebrow: "Account security",
    title: "Reset your password",
    subtitle: "Use this secure link to set a new password.",
    paragraphs: [
      "You requested a password reset for your ClientEnforce account.",
      "If you did not request this, you can safely ignore this email.",
    ],
    primaryCta: {
      label: "Reset password",
      href: resetLink,
    },
    footerNote: "This is a transactional email from ClientEnforce.",
  });

  // Send email using Resend
  const resendResult = await resend.emails.send({
    from: "ClientEnforce <support@clientenforce.com>",
    to: email,
    subject: "Reset your ClientEnforce password",
    html: emailTemplate.html,
    text: emailTemplate.text,
  });

  if (resendResult && "error" in resendResult && resendResult.error) {
    const message =
      typeof resendResult.error.message === "string"
        ? resendResult.error.message
        : "Failed to send reset email";
    redirect(
      "/forgot-password?error=" +
        encodeURIComponent(message)
    );
  }

  redirect(
    "/forgot-password?sent=1&email=" + encodeURIComponent(email)
  );
}
