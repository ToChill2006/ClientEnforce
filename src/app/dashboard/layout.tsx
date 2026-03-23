import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import DashboardShell from "@/components/layout/DashboardShell";
import PageTransition from "@/components/layout/PageTransition";

function nameFromEmail(email?: string | null) {
  if (!email) return null;
  const local = email.split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function initialsFromIdentity(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const tokens = source.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    return (tokens[0][0] + tokens[1][0]).toUpperCase();
  }
  const local = source.includes("@") ? source.split("@")[0] : source;
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, "");
  return (cleaned.slice(0, 2) || "U").toUpperCase();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // AUTH (must remain exactly)
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const authEmail = data.user.email ?? null;
  const profileRes = await supabase
    .from("profiles")
    .select("full_name,email")
    .eq("user_id", data.user.id)
    .limit(1);
  const profile = Array.isArray(profileRes.data) && profileRes.data.length > 0 ? profileRes.data[0] : null;

  const meta = (data.user.user_metadata ?? {}) as { full_name?: unknown; name?: unknown };
  const fullName =
    (typeof profile?.full_name === "string" && profile.full_name.trim() ? profile.full_name.trim() : null) ||
    (typeof meta.full_name === "string" && meta.full_name.trim() ? meta.full_name.trim() : null) ||
    (typeof meta.name === "string" && meta.name.trim() ? meta.name.trim() : null) ||
    nameFromEmail(profile?.email ?? authEmail) ||
    "Signed in";

  const email = (typeof profile?.email === "string" && profile.email.trim() ? profile.email.trim() : authEmail) || null;
  const initials = initialsFromIdentity(fullName, email);

  return (
    <DashboardShell fullName={fullName} email={email} initials={initials}>
      <PageTransition>{children}</PageTransition>
    </DashboardShell>
  );
}
