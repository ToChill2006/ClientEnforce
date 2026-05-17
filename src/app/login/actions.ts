"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const OTP_MAX_PER_HOUR = 5;

function safeNext(raw: string) {
  const n = String(raw || "").trim();
  return n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard";
}

export async function sendOtpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") || ""));

  if (!email) {
    redirect(`/login?error=${encodeURIComponent("Email is required.")}&next=${encodeURIComponent(next)}`);
  }

  // Server-side rate limit: max 5 OTP sends per email per hour
  try {
    const admin = supabaseAdmin();
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("otp_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .gte("sent_at", oneHourAgo);

    if ((count ?? 0) >= OTP_MAX_PER_HOUR) {
      redirect(`/login?error=${encodeURIComponent("Too many attempts. Please wait before trying again.")}&next=${encodeURIComponent(next)}`);
    }

    await admin.from("otp_rate_limits").insert({ email, sent_at: new Date().toISOString() });
    // Purge old entries (best-effort)
    try { await admin.from("otp_rate_limits").delete().lt("sent_at", oneHourAgo); } catch { /* ignore */ }
  } catch (e: any) {
    // If rate limit table doesn't exist yet, proceed (Supabase has its own limits)
    if (!String(e?.message ?? "").includes("does not exist")) {
      // Re-check if it's a rate-limit redirect (NEXT_REDIRECT)
      if (String(e?.message ?? "").includes("NEXT_REDIRECT")) throw e;
    }
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  // Never expose whether the email exists — always redirect to verify step.
  // A rate-limit error is the only safe one to surface.
  if (error && /rate.limit|too many/i.test(error.message)) {
    redirect(`/login?error=${encodeURIComponent("Too many attempts. Please wait a few minutes before trying again.")}&next=${encodeURIComponent(next)}`);
  }

  redirect(
    `/login?step=verify&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`
  );
}

export async function verifyOtpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const token = String(formData.get("token") || "").replace(/\s/g, "");
  const next = safeNext(String(formData.get("next") || ""));

  const base = `/login?step=verify&email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`;

  if (!email || !token) {
    redirect(`${base}&error=${encodeURIComponent("Email and code are required.")}`);
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });

  if (error) {
    redirect(
      `${base}&error=${encodeURIComponent("Invalid or expired code. Please try again.")}`
    );
  }

  redirect(next);
}
