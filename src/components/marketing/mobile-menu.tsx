"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const solutionsByUseCase = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-portal-software", label: "Client portal software" },
  { href: "/client-intake-software", label: "Client intake software" },
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
  { href: "/copilot-alternative", label: "vs Copilot" },
  { href: "/bonsai-alternative", label: "vs Bonsai" },
  { href: "/client-onboarding-software#why-software", label: "vs manual process" },
] as const;

const sections = [
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
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-drawer"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col bg-white"
        >
          {/* Header row */}
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
            <span
              className="text-sm font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ClientEnforce
            </span>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.heading}>
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                    {section.heading}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[48px] items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* CTA buttons */}
          <div className="shrink-0 space-y-2 border-t border-[var(--color-border)] px-4 py-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              Start free trial
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
