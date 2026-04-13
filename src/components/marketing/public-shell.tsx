import Image from "next/image";
import Link from "next/link";

import type { Breadcrumb } from "@/lib/content/seo-content";
import { jsonLdString } from "@/lib/seo";
import { MobileMenu } from "@/components/marketing/mobile-menu";

const solutionsByUseCase = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-portal-software", label: "Client portal software" },
  { href: "/client-intake-software", label: "Client intake software" },
  { href: "/client-onboarding-automation", label: "Client onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
  { href: "/client-onboarding-tools", label: "Best client onboarding tools" },
] as const;

const solutionsWhoFor = [
  { href: "/agencies", label: "Agencies" },
  { href: "/consultants", label: "Consultants" },
  { href: "/accountants", label: "Accountants" },
  { href: "/ops-teams", label: "Ops teams" },
  { href: "/auto-service", label: "Auto service" },
  { href: "/dental-practices", label: "Dental practices" },
  { href: "/health-wellness", label: "Health & wellness" },
] as const;

const solutionsCompare = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
  { href: "/client-onboarding-software#why-software", label: "vs manual process" },
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 py-3.5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" priority />
          </span>
          <span
            className="text-[15px] font-bold tracking-tight text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ClientEnforce
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          <details className="group relative">
            <summary className="inline-flex list-none cursor-pointer select-none items-center gap-1 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]">
              Solutions
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 transition group-open:rotate-180" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="invisible absolute left-0 top-full z-50 mt-2 w-[440px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 opacity-0 shadow-[var(--shadow-lg)] transition group-open:visible group-open:opacity-100">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">By use case</p>
              <div className="space-y-0.5">
                {solutionsByUseCase.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Who it&apos;s for</p>
              <div className="grid grid-cols-2 gap-0.5">
                {solutionsWhoFor.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Compare</p>
              <div className="space-y-0.5">
                {solutionsCompare.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>

          {[
            { href: "/features", label: "Features" },
            { href: "/pricing", label: "Pricing" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center whitespace-nowrap rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] md:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden items-center justify-center whitespace-nowrap rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] md:inline-flex"
          >
            Start Free Trial
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */
const productLinks = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-portal-software", label: "Client portal software" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/client-onboarding-automation", label: "Onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
] as const;

const comparisonLinks = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
  { href: "/copilot-alternative", label: "vs Copilot" },
  { href: "/bonsai-alternative", label: "vs Bonsai" },
  { href: "/best-client-onboarding-software", label: "Best onboarding software" },
] as const;

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/agencies", label: "For agencies" },
  { href: "/consultants", label: "For consultants" },
  { href: "/accountants", label: "For accountants" },
  { href: "/ops-teams", label: "For ops teams" },
  { href: "/auto-service", label: "For auto service" },
  { href: "/dental-practices", label: "For dental practices" },
  { href: "/health-wellness", label: "For health & wellness" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
                <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" />
              </span>
              <span className="text-sm font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                ClientEnforce
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
              Client onboarding that enforces completion — not just tracks it.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="https://twitter.com/clientenforce" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/clientenforce" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Product</p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Compare</p>
            <ul className="mt-4 space-y-3">
              {comparisonLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Company</p>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} ClientEnforce. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]">Privacy</Link>
            <Link href="/terms" className="text-xs text-[var(--color-text-muted)] transition hover:text-[var(--color-text-primary)]">Terms</Link>
            <a href="https://saasbrowser.com/en/saas/1437807/clientenforce" target="_blank" rel="noopener">
              <img src="https://static-files.saasbrowser.com/saas-browser-badge-16.svg" alt="ClientEnforce - Compare B2B SaaS" width="120" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Shared layout utilities ────────────────────────────────────────────── */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">{children}</div>
  );
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-[var(--color-border-strong)]">/</span> : null}
              {isLast ? (
                <span className="text-[var(--color-text-primary)]">{item.name}</span>
              ) : (
                <Link href={item.path} className="transition hover:text-[var(--color-text-primary)]">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}

/* ─── CTA Band ───────────────────────────────────────────────────────────── */
export function CtaBand({
  heading,
  subtext,
  primaryLabel = "Start free trial",
  primaryHref = "/signup",
  secondaryLabel,
  secondaryHref,
}: {
  heading: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-accent)] py-24">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          transform: "skewY(-3deg)",
          transformOrigin: "top left",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 text-center lg:px-8">
        <h2
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl sm:text-[44px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heading}
        </h2>
        {subtext && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">{subtext}</p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-accent)] shadow-[var(--shadow-md)] transition hover:bg-blue-50 active:scale-[0.98] sm:w-auto"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
