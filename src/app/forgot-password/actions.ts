"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { appOrigin, normalizeAuthEmailLink } from "@/lib/app-url";

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
  const admin =
    typeof supabaseAdmin === "function"
      ? (supabaseAdmin as any)()
      : (supabaseAdmin as any);

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

  const resetLink = normalizeAuthEmailLink(data.properties.action_link);

  // Send email using Resend
  const resendResult = await resend.emails.send({
    from: "ClientEnforce <support@clientenforce.com>",
    to: email,
    subject: "Reset your ClientEnforce password",
    html: `
      <h2>Reset your password</h2>
      <p>You requested a password reset.</p>
      <p>Click the button below to set a new password:</p>

      <a href="${resetLink}" 
        style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          border-radius:8px;
          text-decoration:none;
        ">
        Reset password
      </a>

      <p>If you didn't request this you can ignore this email.</p>
    `,
  });

  if ((resendResult as any)?.error) {
    redirect(
      "/forgot-password?error=" +
        encodeURIComponent((resendResult as any).error.message || "Failed to send reset email")
    );
  }

  redirect(
    "/forgot-password?sent=1&email=" + encodeURIComponent(email)
  );
}
