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

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:gap-2 md:flex">
          <Link
            href="/client-onboarding-software"
            aria-label="Client onboarding software"
            className={navItemClassName()}
          >
            <span className="xl:hidden">Software</span>
            <span className="hidden xl:inline">Client onboarding software</span>
          </Link>
          <Link
            href="/client-onboarding-checklist"
            aria-label="Client onboarding checklist"
            className={navItemClassName()}
          >
            <span className="xl:hidden">Checklist</span>
            <span className="hidden xl:inline">Client onboarding checklist</span>
          </Link>
          <Link
            href="/client-onboarding-automation"
            aria-label="Client onboarding automation"
            className={navItemClassName()}
          >
            <span className="xl:hidden">Automation</span>
            <span className="hidden xl:inline">Client onboarding automation</span>
          </Link>
          <Link
            href="/client-onboarding-tools"
            aria-label="Best client onboarding tools"
            className={navItemClassName()}
          >
            <span className="xl:hidden">Tools</span>
            <span className="hidden xl:inline">Best client onboarding tools</span>
          </Link>
          <Link href="/blog" className={navItemClassName()}>
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 sm:inline-flex"
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

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
            <div className="text-sm font-semibold text-zinc-900">Client onboarding, enforced.</div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Launch a clean onboarding process with one portal for documents, signatures, reminders,
              and progress tracking.
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

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
