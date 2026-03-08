"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirect(
      "/reset-password?error=" +
        encodeURIComponent("Password must be at least 8 characters long.")
    );
  }

  if (password !== confirmPassword) {
    redirect(
      "/reset-password?error=" + encodeURIComponent("Passwords do not match.")
    );
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/reset-password?error=" + encodeURIComponent(error.message));
  }

  redirect(
    "/login?created=1&error=" +
      encodeURIComponent("Password updated. Please log in.")
  );
}