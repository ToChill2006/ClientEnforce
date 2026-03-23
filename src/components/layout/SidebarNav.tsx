"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LayoutTemplate,
  Bell,
  Clock,
  FolderOpen,
  User,
  Users,
  Settings,
} from "lucide-react";

function isActive(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  return currentPath === href || currentPath.startsWith(href + "/");
}

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname() || "/dashboard";
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      prefetch
      className={
        "group flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]")
      }
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={
          "h-4 w-4 shrink-0 " +
          (active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]")
        }
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] first:mt-0">
      {children}
    </p>
  );
}

export default function SidebarNav() {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <SectionLabel>Main</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <NavItem href="/dashboard/onboardings" label="Onboardings" icon={ClipboardList} />
        <NavItem href="/dashboard/templates" label="Templates" icon={LayoutTemplate} />
        <NavItem href="/dashboard/clients" label="Clients" icon={User} />
      </div>

      <SectionLabel>Workflow</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/followups" label="Follow-ups" icon={Bell} />
        <NavItem href="/dashboard/storage" label="Files & Signatures" icon={FolderOpen} />
      </div>

      <SectionLabel>Team</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/team" label="Team members" icon={Users} />
        <NavItem href="/dashboard/settings" label="Settings" icon={Settings} />
      </div>

      <SectionLabel>More</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/audit" label="Activity & Timeline" icon={Clock} />
      </div>
    </nav>
  );
}
