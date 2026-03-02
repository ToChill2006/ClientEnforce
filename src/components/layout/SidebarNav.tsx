"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  return currentPath === href || currentPath.startsWith(href + "/");
}

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname() || "/dashboard";
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      className={
        "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition " +
        (active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900")
      }
    >
      <span
        className={
          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full transition " +
          (active ? "bg-zinc-900" : "bg-transparent group-hover:bg-zinc-300")
        }
        aria-hidden="true"
      />
      <span className="pl-2">{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  return (
    <div className="mt-5 flex-1 overflow-y-auto px-4 pb-4">
      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Navigation
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-2">
        <nav className="flex flex-col gap-1">
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/dashboard/onboardings" label="Onboardings" />
          <NavItem href="/dashboard/templates" label="Templates" />
          <NavItem href="/dashboard/clients" label="Clients" />
          <NavItem href="/dashboard/followups" label="Follow-ups" />
          <NavItem href="/dashboard/team" label="Team" />
          <NavItem href="/dashboard/settings" label="Settings" />
        </nav>
      </div>
    </div>
  );
}