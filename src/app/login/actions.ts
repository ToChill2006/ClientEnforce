"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "");
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}&next=${encodeURIComponent(next)}`);
  }

  try {
    const admin = supabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("user_id")
      .ilike("email", email)
      .maybeSingle();

    const userId = typeof profile?.user_id === "string" ? profile.user_id : null;
    if (userId) {
      const { data: lookup, error: lookupErr } = await admin.auth.admin.getUserById(userId);
      if (!lookupErr && lookup?.user && !lookup.user.email_confirmed_at) {
        redirect(`/login?error=${encodeURIComponent("Please verify your email first, then log in.")}&next=${encodeURIComponent(next)}`);
      }
    }
  } catch {
    // If admin lookup fails, continue to normal sign-in path.
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = /confirm|verified|verification/i.test(error.message)
      ? "Please verify your email first, then log in."
      : error.message;
    redirect(`/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}
