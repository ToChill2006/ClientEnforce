"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

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

  const supabase = await supabaseServer();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || null },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message || "Signup failed")}`);
  }

  if (!data?.user) {
    redirect(`/signup?error=${encodeURIComponent("Signup failed")}`);
  }

  if (data?.user) {
    try {
      await supabase
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

  // If email confirmation is disabled, Supabase returns a session immediately
  if (data?.session) {
    redirect(next);
  }

  // If confirmation emails are enabled, user must confirm first
  redirect(`/login?message=${encodeURIComponent("Check your email to confirm your account.")}`);
}