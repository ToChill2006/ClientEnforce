"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu as MenuIcon, X, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, MenuItem, MenuDivider, MenuLabel } from "@/components/ui/menu";
import { cn } from "@/lib/cn";

interface DashboardShellProps {
  children: React.ReactNode;
  fullName: string;
  email: string | null;
  initials: string;
  hasEnterpriseOnboarding?: boolean;
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/dashboard"
      prefetch
      onClick={onClick}
      className="flex items-center gap-2 rounded-[var(--radius-md)] px-1 py-1 text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-hover)]"
      aria-label="ClientEnforce"
    >
      <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-panel)]">
        <Image src="/C.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" priority />
      </span>
      <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        ClientEnforce
      </span>
    </Link>
  );
}

function UserMenu({ fullName, email, initials }: { fullName: string; email: string | null; initials: string }) {
  return (
    <Menu
      align="end"
      trigger={
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white ring-1 ring-[var(--color-border)] transition hover:opacity-90"
          aria-label="Account menu"
        >
          {initials}
        </button>
      }
    >
      <MenuLabel>
        <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{fullName}</div>
        {email && <div className="truncate text-[11px] text-[var(--color-text-muted)]">{email}</div>}
      </MenuLabel>
      <MenuDivider />
      <MenuItem href="/dashboard/settings" iconLeft={<SettingsIcon className="h-3.5 w-3.5" />}>
        Settings
      </MenuItem>
      <MenuItem href="/dashboard/team" iconLeft={<UserIcon className="h-3.5 w-3.5" />}>
        Team
      </MenuItem>
      <MenuDivider />
      <MenuItem
        iconLeft={<LogOut className="h-3.5 w-3.5" />}
        onSelect={async () => {
          await fetch("/dashboard/logout", { method: "POST" }).catch(() => {});
          window.location.href = "/login";
        }}
      >
        Sign out
      </MenuItem>
    </Menu>
  );
}

function SidebarContent({ onClose, hasEnterpriseOnboarding }: { onClose?: () => void; hasEnterpriseOnboarding?: boolean }) {
  return (
    <>
      <div className="shrink-0 px-4 pt-4">
        <Logo onClick={onClose} />
        <div className="mt-3 h-px bg-[var(--color-border)]" />
      </div>
      <SidebarNav onClose={onClose} hasEnterpriseOnboarding={hasEnterpriseOnboarding} />
    </>
  );
}

export default function DashboardShell({ children, fullName, email, initials, hasEnterpriseOnboarding }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-[var(--color-border)] bg-[var(--color-panel)] lg:flex">
          <SidebarContent hasEnterpriseOnboarding={hasEnterpriseOnboarding} />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[var(--color-overlay)] animate-overlay-in lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[300px] flex-col border-r border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-xl)] animate-drawer-in-right lg:hidden"
            >
              <div className="flex shrink-0 items-center justify-end px-4 pt-3">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-hover)]"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent onClose={() => setSidebarOpen(false)} hasEnterpriseOnboarding={hasEnterpriseOnboarding} />
            </aside>
          </>
        )}

        {/* Top bar */}
        <header
          className={cn(
            "fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-panel)] px-4 lg:pl-[calc(220px+1rem)] lg:pr-6"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-hover)] lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
            <UserMenu fullName={fullName} email={email} initials={initials} />
          </div>
        </header>

        {/* Main */}
        <div className="lg:pl-[220px]">
          <main className="min-h-screen px-4 pb-10 pt-[calc(3.5rem+1.5rem)] lg:px-8 lg:pt-[calc(3.5rem+1.75rem)]">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
  );
}
