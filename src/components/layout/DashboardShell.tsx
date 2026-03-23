"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarNav from "./SidebarNav";

interface DashboardShellProps {
  children: React.ReactNode;
  fullName: string;
  email: string | null;
  initials: string;
}

function SidebarContent({
  fullName,
  email,
  initials,
  onClose,
}: {
  fullName: string;
  email: string | null;
  initials: string;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="shrink-0 px-4 pt-4">
        <Link
          href="/"
          prefetch
          onClick={onClose}
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

      {/* Nav */}
      <SidebarNav onClose={onClose} />

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
    </>
  );
}

export default function DashboardShell({ children, fullName, email, initials }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      {/* Mobile top bar — hidden on lg+ */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-white px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)]"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <span className="relative h-7 w-7 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]">
            <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-0.5" priority />
          </span>
          <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            ClientEnforce
          </span>
        </Link>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-white"
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-[var(--color-border)] bg-white lg:flex">
        <SidebarContent fullName={fullName} email={email} initials={initials} />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              key="sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[320px] flex-col border-r border-[var(--color-border)] bg-white shadow-xl lg:hidden"
            >
              {/* Close button */}
              <div className="flex shrink-0 items-center justify-end px-4 pt-3">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)]"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <SidebarContent
                fullName={fullName}
                email={email}
                initials={initials}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content — padded right of sidebar on desktop, below top bar on mobile */}
      <div className="lg:pl-[240px]">
        <main className="min-h-screen px-4 pb-8 pt-[calc(3.5rem+1.5rem)] lg:px-6 lg:pt-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
