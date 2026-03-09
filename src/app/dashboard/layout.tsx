import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import SidebarNav from "@/components/layout/SidebarNav";
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Fixed, full-height sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-[240px] bg-white">
        <div className="flex h-full flex-col">
          {/* Nav (client-side active state) */}
          <SidebarNav />

          {/* Account pinned bottom */}
          <div className="px-4 pb-5">
            <div className="rounded-xl border border-zinc-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-zinc-900">{fullName}</div>
                  <div className="truncate text-[12px] text-zinc-500">{email ?? "No email available"}</div>
                </div>
              </div>

              <form action="/dashboard/logout" method="post" className="mt-3">
                <button
                  type="submit"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content: shifted right by sidebar width */}
      <div className="pl-[240px]">
        <main className="min-h-screen px-6 py-8">
          <div className="mx-auto w-full max-w-7xl">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
