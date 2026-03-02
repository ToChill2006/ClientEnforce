import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import SidebarNav from "@/components/layout/SidebarNav";

function initialsFromEmail(email?: string | null) {
  if (!email) return "U";
  const local = email.split("@")[0] || "U";
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, "");
  return (cleaned.slice(0, 2) || "U").toUpperCase();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // AUTH (must remain exactly)
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const email = data.user.email ?? null;
  const initials = initialsFromEmail(email);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Fixed, full-height sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-72 border-r border-zinc-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="px-5 pt-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900">
                {initials}
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight text-zinc-900">ClientEnforce</div>
                <div className="text-[12px] text-zinc-500">Workspace</div>
              </div>
            </Link>
          </div>

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
                  <div className="truncate text-sm font-semibold text-zinc-900">Account</div>
                  <div className="truncate text-[12px] text-zinc-500">{email ?? "Signed in"}</div>
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

            <div className="mt-3 px-2 text-[11px] text-zinc-500">Secure workspace</div>
          </div>
        </div>
      </aside>

      {/* Main content: shifted right by sidebar width */}
      <div className="pl-72">
        <main className="min-h-screen px-6 py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}