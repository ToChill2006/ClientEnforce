import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      {/* Fixed full-height sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-[var(--color-border)] bg-white">
        {/* Logo */}
        <div className="shrink-0 px-4 pt-4">
          <Link
            href="/"
            prefetch
            className="flex items-center gap-2 rounded-[var(--radius-md)] px-1 py-1 text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            aria-label="ClientEnforce"
          >
            <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white">
              <Image
                src="/C.png"
                alt="ClientEnforce"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                priority
              />
            </span>
            <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              ClientEnforce
            </span>
          </Link>
          <div className="mt-3 h-px bg-[var(--color-border)]" />
        </div>

        {/* Nav items (client component for active state) */}
        <SidebarNav />

        {/* User card pinned to bottom */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-3">
          <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{fullName}</div>
              <div className="truncate text-[11px] text-[var(--color-text-muted)]">{email ?? "No email"}</div>
            </div>
          </div>
          <form action="/dashboard/logout" method="post" className="mt-1">
            <button
              type="submit"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content shifted right by sidebar width */}
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
