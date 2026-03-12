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
                Product
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

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition group-open:visible group-open:opacity-100">
              <Link
                href="/client-onboarding-software"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding software
              </Link>
              <Link
                href="/features"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                About
              </Link>
            </div>
          </details>

          <details className="group relative">
            <summary className={`${navItemClassName()} list-none cursor-pointer select-none`}>
              <span className="inline-flex items-center gap-1.5">
                Resources
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

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition group-open:visible group-open:opacity-100">
              <Link
                href="/blog"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding blog
              </Link>
              <Link
                href="/client-onboarding-checklist"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding checklist
              </Link>
              <Link
                href="/client-onboarding-automation"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding automation
              </Link>
              <Link
                href="/client-onboarding-tools"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Best client onboarding tools
              </Link>
            </div>
          </details>

          <details className="group relative">
            <summary className={`${navItemClassName()} list-none cursor-pointer select-none`}>
              <span className="inline-flex items-center gap-1.5">
                Comparisons
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

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-lg transition group-open:visible group-open:opacity-100">
              <Link
                href="/dubsado-alternative"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Dubsado alternative
              </Link>
              <Link
                href="/honeybook-alternative"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                HoneyBook alternative
              </Link>
              <Link
                href="/client-onboarding-software-for-agencies"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                Client onboarding software for agencies
              </Link>
            </div>
          </details>

          <Link href="/contact" className={navItemClassName()}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 lg:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/" className={navItemClassName(true)}>
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

const resourceLinks = [
  {
    href: "/client-onboarding-software",
    label: "Client onboarding software",
  },
  {
    href: "/client-onboarding-checklist",
    label: "Client onboarding checklist",
  },
  {
    href: "/client-onboarding-automation",
    label: "Client onboarding automation",
  },
  {
    href: "/client-onboarding-tools",
    label: "Best client onboarding tools",
  },
  {
    href: "/blog",
    label: "Client onboarding blog",
  },
  {
    href: "/blog/client-onboarding-workflow",
    label: "Client onboarding workflow guide",
  },
  {
    href: "/blog/onboarding-documents-for-clients",
    label: "Onboarding documents for clients",
  },
];

const comparisonLinks = [
  {
    href: "/dubsado-alternative",
    label: "Dubsado alternative",
  },
  {
    href: "/honeybook-alternative",
    label: "HoneyBook alternative",
  },
  {
    href: "/client-onboarding-software-for-agencies",
    label: "Client onboarding software for agencies",
  },
];

const companyLinks = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/privacy",
    label: "Privacy",
  },
  {
    href: "/terms",
    label: "Terms",
  },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="text-sm font-semibold text-zinc-900">Client onboarding, enforced.</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Launch a clean onboarding process with one portal for documents, signatures, reminders,
              and progress tracking.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              ClientEnforce is built for agencies, consultants, and service teams that need reliable
              onboarding execution. Instead of managing intake across disconnected tools, your team can
              run one repeatable workflow from signed agreement to kickoff readiness.
            </p>
            <ul className="mt-3 space-y-1 text-sm leading-6 text-zinc-700">
              <li>Collect required files and approvals in one client portal.</li>
              <li>Automate follow-ups when onboarding tasks are incomplete.</li>
              <li>Track progress clearly across every active onboarding.</li>
              <li>Use templates to standardize delivery handoffs and reduce rework.</li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              If you are evaluating client onboarding software, compare features, pricing, and workflow
              fit before rollout. The guides and comparison pages below are designed to help you choose
              the right onboarding automation platform for your business.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              Need a starting point? Begin with the client onboarding software overview, then use the
              checklist and automation pages to design a rollout plan your team can execute consistently.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Go to homepage
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Browse resources
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Guides</div>
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
            <div className="text-sm font-semibold text-zinc-900">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {companyLinks.map((link) => (
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
