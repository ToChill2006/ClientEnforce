"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

const solutionsByUseCase = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-onboarding-automation", label: "Client onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
  { href: "/client-onboarding-tools", label: "Best client onboarding tools" },
] as const;

const solutionsWhoFor = [
  { href: "/onboarding-for-agencies", label: "For agencies" },
  { href: "/onboarding-for-accountants", label: "For accountants" },
  { href: "/onboarding-for-consultants", label: "For consultants" },
] as const;

const solutionsCompare = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-2 text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
            <span className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              ClientEnforce
            </span>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            {[
              { heading: "By use case", links: solutionsByUseCase },
              { heading: "Who it\u2019s for", links: solutionsWhoFor },
              { heading: "Compare", links: solutionsCompare },
              {
                heading: "Navigate",
                links: [
                  { href: "/features", label: "Features" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                ] as const,
              },
            ].map((section) => (
              <div key={section.heading}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  {section.heading}
                </p>
                <div className="space-y-0.5">
                  {section.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-[var(--color-border)] px-4 py-4 space-y-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-[var(--color-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-[var(--color-accent)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
