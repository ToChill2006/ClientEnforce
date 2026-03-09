"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";
import { appOrigin, normalizeAuthEmailLink } from "@/lib/app-url";

export async function signupAction(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "").trim() || "/dashboard";

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Email and password are required.")}`);
  }

  if (password.length < 8) {
    redirect(`/signup?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  }

  if (!process.env.RESEND_API_KEY) {
    redirect(`/signup?error=${encodeURIComponent("RESEND_API_KEY is not configured.")}`);
  }

  const admin = supabaseAdmin();

  const loginRedirect = new URL("/login", appOrigin());
  loginRedirect.searchParams.set("verified", "1");
  if (next && next.startsWith("/")) {
    loginRedirect.searchParams.set("next", next);
  }

  const callbackRedirect = new URL("/auth/callback", appOrigin());
  callbackRedirect.searchParams.set("next", `${loginRedirect.pathname}${loginRedirect.search}`);

  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName || null },
      redirectTo: callbackRedirect.toString(),
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message || "Signup failed")}`);
  }

  if (!data?.user) {
    redirect(`/signup?error=${encodeURIComponent("Signup failed")}`);
  }

  if (data.user) {
    try {
      await admin
        .from("profiles")
        .upsert(
          {
            user_id: data.user.id,
            email,
            full_name: fullName || null,
            org_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
    } catch (e) {
      console.error("[signup] profile upsert failed", e);
    }
  }

  const verifyLink = normalizeAuthEmailLink(data?.properties?.action_link);
  if (!verifyLink) {
    redirect(`/signup?error=${encodeURIComponent("Could not generate verification link.")}`);
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";

  const send = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: "Verify your ClientEnforce account",
    html: `
      <h2>Verify your email</h2>
      <p>Click the button below to verify your account and finish signup.</p>
      <p>
        <a href="${verifyLink}"
          style="display:inline-block;padding:12px 20px;background:#18181b;color:#fff;border-radius:8px;text-decoration:none;">
          Verify account
        </a>
      </p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });

  if (send && "error" in send && send.error) {
    const message = typeof send.error.message === "string" ? send.error.message : "Failed to send verification email.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  redirect(`/login?message=${encodeURIComponent("Check your email for a verification link.")}&next=${encodeURIComponent(next)}`);
}
