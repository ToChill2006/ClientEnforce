import { supabaseServer } from "@/lib/supabase-server";

export type MemberRole = "owner" | "admin" | "member";

export async function requireUser() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Unauthorized");
  return data.user;
}

export async function requireProfile() {
  const user = await requireUser();
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, org_id, email, full_name")
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function requireRole(): Promise<MemberRole> {
  const user = await requireUser();
  const profile = await requireProfile();
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", profile.org_id)
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return data.role as MemberRole;
}

export function isAdmin(role: MemberRole) {
  return role === "owner" || role === "admin";
}

export async function requireAdmin() {
  const role = await requireRole();
  if (!isAdmin(role)) throw new Error("Forbidden");
  return role;
}