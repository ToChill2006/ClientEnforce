"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabaseServer } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { buildNurtureSequence } from "@/lib/nurture-emails";

export async function signupAction(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("Email and password are required.")}`);
  }

  if (password.length < 8) {
    redirect(`/signup?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  }

  const admin = supabaseAdmin();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || null, email_verified: false },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message || "Signup failed")}`);
  }

  if (!data?.user) {
    redirect(`/signup?error=${encodeURIComponent("Signup failed")}`);
  }

  // Upsert profile row (email_verified starts false — banner in dashboard prompts them)
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

  // Sign in server-side so the session cookie is written before the redirect
  const supabase = await supabaseServer();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    // Account was created but sign-in failed — send them to login to complete manually
    redirect(`/login?message=${encodeURIComponent("Account created. Please sign in.")}`);
  }

  // Internal signup notification
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";

  const internalNotification = renderClientEnforceEmail({
    title: "New signup",
    eyebrow: "New user",
    subtitle: `${fullName || "(no name)"} · ${email}`,
    paragraphs: [
      `Email: ${email}`,
      `Name: ${fullName || "(not provided)"}`,
      `Signed up at: ${new Date().toUTCString()}`,
    ],
    footerNote: "Internal ClientEnforce signup notification.",
  });

  // Schedule nurture sequence
  const firstName = fullName?.split(" ")[0] || "";
  const nurtureEmails = buildNurtureSequence(firstName);

  const [internalResult, ...nurtureResults] = await Promise.allSettled([
    resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: "info@clientenforce.com",
      subject: `New signup: ${email}`,
      html: internalNotification.html,
      text: internalNotification.text,
    }),
    ...nurtureEmails.map((e) =>
      resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject: e.subject,
        html: e.html,
        text: e.text,
        ...(e.scheduledAt ? { scheduledAt: e.scheduledAt } : {}),
      })
    ),
  ]);

  if (internalResult.status === "rejected") {
    console.error("[signup] internal notification failed", internalResult.reason);
  }
  nurtureResults.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[signup] nurture email ${i + 1} failed (rejected)`, r.reason);
    } else if (r.value && "error" in r.value && r.value.error) {
      console.error(`[signup] nurture email ${i + 1} failed (resend error)`, r.value.error);
    } else {
      console.log(`[signup] nurture email ${i + 1} scheduled`, (r.value as any)?.data?.id);
    }
  });

  redirect("/dashboard?welcome=1");
}
