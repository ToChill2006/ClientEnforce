"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

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

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    const msg =
      /not found|no user|user not found/i.test(error.message)
        ? "No account found with that email address."
        : error.message;
    redirect(`/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`);
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
