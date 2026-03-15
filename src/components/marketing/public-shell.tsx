import Image from "next/image";
import Link from "next/link";

import type { Breadcrumb } from "@/lib/content/seo-content";
import { jsonLdString } from "@/lib/seo";

function navItemClassName(isPrimary = false) {
  if (isPrimary) {
    return "inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800";
  }

  return "inline-flex items-center whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900";
}

const solutionsByUseCase = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-onboarding-automation", label: "Client onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
  { href: "/client-onboarding-tools", label: "Best client onboarding tools" },
] as const;

const solutionsWhoFor = [
  { href: "/onboarding-for-agencies", label: "For agencies" },
  { href: "/onboarding-for-accountants", label: "For accountants" },
  { href: "/client-onboarding-software", label: "For consultants" },
] as const;

const solutionsCompare = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
  { href: "/client-onboarding-software#why-software", label: "vs manual process" },
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce" fill className="object-contain p-1" priority />
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">
            ClientEnforce
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2">
          <details className="group relative">
            <summary className={`${navItemClassName()} list-none cursor-pointer select-none`}>
              <span className="inline-flex items-center gap-1.5">
                Solutions
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-zinc-500 transition group-open:rotate-180"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </summary>

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-zinc-200 bg-white p-3 opacity-0 shadow-lg transition group-open:visible group-open:opacity-100">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">By use case</div>
              <div className="mt-2 grid gap-1">
                {solutionsByUseCase.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Who it&apos;s for</div>
              <div className="mt-2 grid gap-1">
                {solutionsWhoFor.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Compare</div>
              <div className="mt-2 grid gap-1">
                {solutionsCompare.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </details>

          <Link href="/features" className={navItemClassName()}>
            Features
          </Link>
          <Link href="/pricing" className={navItemClassName()}>
            Pricing
          </Link>
          <Link href="/blog" className={navItemClassName()}>
            Blog
          </Link>
          <Link href="/contact" className={navItemClassName()}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 md:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/contact"
            className="hidden items-center justify-center whitespace-nowrap rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 md:inline-flex"
          >
            Book a demo
          </Link>
          <details className="relative md:hidden">
            <summary className="inline-flex list-none cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50">
              Menu
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">By use case</div>
              <div className="mt-2 grid gap-1">
                {solutionsByUseCase.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Who it&apos;s for</div>
              <div className="mt-2 grid gap-1">
                {solutionsWhoFor.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Compare</div>
              <div className="mt-2 grid gap-1">
                {solutionsCompare.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Navigate</div>
              <div className="mt-2 grid gap-1">
                <Link href="/features" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                  Features
                </Link>
                <Link href="/pricing" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                  Pricing
                </Link>
                <Link href="/blog" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                  Blog
                </Link>
                <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                  Contact
                </Link>
              </div>

              <div className="mt-3 border-t border-zinc-200 pt-3">
                <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
                  Login
                </Link>
                <Link href="/contact" className="mt-1 block rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                  Book a demo
                </Link>
                <Link href="/signup" className="mt-2 block rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                  Get started
                </Link>
              </div>
            </div>
          </details>
          <Link href="/signup" className={navItemClassName(true)}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

const productLinks = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/client-onboarding-automation", label: "Client onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
] as const;

const comparisonLinks = [
  { href: "/dubsado-alternative", label: "Dubsado alternative" },
  { href: "/honeybook-alternative", label: "HoneyBook alternative" },
  { href: "/best-client-onboarding-software", label: "Best client onboarding software" },
] as const;

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/onboarding-for-agencies", label: "Onboarding software for agencies" },
  { href: "/onboarding-for-accountants", label: "Onboarding software for accountants" },
] as const;

const companyAndLegalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="text-sm font-semibold text-zinc-900">Client onboarding, enforced.</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Replace email chaos with a structured onboarding workflow for documents, signatures, reminders, and kickoff readiness.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/client-onboarding-software"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Explore client onboarding software
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Comparisons</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {comparisonLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Resources</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Company & legal</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {companyAndLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-4 text-xs text-zinc-600">
          © {new Date().getFullYear()} ClientEnforce
        </div>
      </div>
    </footer>
  );
}

export function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-zinc-600">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-1.5">
              {index > 0 ? <span className="text-zinc-400">/</span> : null}
              {isLast ? (
                <span className="font-medium text-zinc-700">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-zinc-900 hover:underline hover:underline-offset-4">
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
