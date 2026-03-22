import Image from "next/image";
import Link from "next/link";

import type { Breadcrumb } from "@/lib/content/seo-content";
import { jsonLdString } from "@/lib/seo";
import { MobileMenu } from "@/components/marketing/mobile-menu";

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
  { href: "/client-onboarding-software#why-software", label: "vs manual process" },
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" priority />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[#F0F0F0] sm:text-base">
            ClientEnforce
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2">
          <details className="group relative">
            <summary className="inline-flex list-none cursor-pointer select-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:bg-white/5 hover:text-[#F0F0F0]">
              Solutions
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </summary>

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-white/[0.08] bg-[#111118] p-4 opacity-0 shadow-2xl transition group-open:visible group-open:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">By use case</p>
              <div className="mt-2 grid gap-0.5">
                {solutionsByUseCase.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:bg-white/5 hover:text-[#F0F0F0]">
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Who it&apos;s for</p>
              <div className="mt-2 grid gap-0.5">
                {solutionsWhoFor.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:bg-white/5 hover:text-[#F0F0F0]">
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Compare</p>
              <div className="mt-2 grid gap-0.5">
                {solutionsCompare.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:bg-white/5 hover:text-[#F0F0F0]">
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
            <Link key={item.href} href={item.href} className="inline-flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:bg-white/5 hover:text-[#F0F0F0]">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[#9A9AAF] transition hover:text-[#F0F0F0] md:inline-flex">
            Login
          </Link>
          <Link href="/signup" className="hidden items-center justify-center whitespace-nowrap rounded-xl bg-[#00C2A8] px-4 py-2 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_16px_rgba(0,194,168,0.25)] transition hover:bg-[#00d4b8] hover:shadow-[0_0_24px_rgba(0,194,168,0.4)] md:inline-flex">
            Get started
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
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/client-onboarding-automation", label: "Onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
] as const;

const comparisonLinks = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
  { href: "/best-client-onboarding-software", label: "Best onboarding software" },
] as const;

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/onboarding-for-agencies", label: "For agencies" },
  { href: "/onboarding-for-accountants", label: "For accountants" },
  { href: "/onboarding-for-consultants", label: "For consultants" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0F]">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" />
              </span>
              <span className="text-sm font-semibold text-[#F0F0F0]">ClientEnforce</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-[#9A9AAF]">
              Client onboarding that enforces completion — not just tracks it.
            </p>
            {/* Social icons */}
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com/clientenforce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#9A9AAF] transition hover:bg-white/10 hover:text-[#F0F0F0]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/clientenforce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#9A9AAF] transition hover:bg-white/10 hover:text-[#F0F0F0]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Product</p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#9A9AAF] transition hover:text-[#F0F0F0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Comparisons */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Compare</p>
            <ul className="mt-4 space-y-3">
              {comparisonLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#9A9AAF] transition hover:text-[#F0F0F0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Resources</p>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#9A9AAF] transition hover:text-[#F0F0F0]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <p className="text-xs text-[#9A9AAF]">© {new Date().getFullYear()} ClientEnforce. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-[#9A9AAF] transition hover:text-[#F0F0F0]">Privacy</Link>
            <Link href="/terms" className="text-xs text-[#9A9AAF] transition hover:text-[#F0F0F0]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Shared layout utilities ────────────────────────────────────────────── */
export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#9A9AAF]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-[#9A9AAF]/50">/</span> : null}
              {isLast ? (
                <span className="text-[#F0F0F0]">{item.name}</span>
              ) : (
                <Link href={item.path} className="transition hover:text-[#F0F0F0]">
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
