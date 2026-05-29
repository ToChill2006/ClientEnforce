import Link from "next/link";
import { DEMO_URL, CONTACT_EMAIL } from "./constants";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/case-study/telletire", label: "Case Study" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-slate-950 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 rounded-sm"
        >
          ClientEnforce
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 rounded-sm"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={DEMO_URL}
          className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
        >
          Book a demo
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-950">
            ClientEnforce
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
            Structured due diligence intake for M&amp;A operators.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Product
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/features" className="text-slate-700 hover:text-slate-950">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-slate-700 hover:text-slate-950">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="text-slate-700 hover:text-slate-950">
                Solutions
              </Link>
            </li>
            <li>
              <Link
                href="/case-study/telletire"
                className="text-slate-700 hover:text-slate-950"
              >
                Case study
              </Link>
            </li>
            <li>
              <a href={DEMO_URL} className="text-slate-700 hover:text-slate-950">
                Book a demo
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-slate-700 hover:text-slate-950"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="text-slate-500">clientenforce.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ClientEnforce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F8FAFC] text-slate-950 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
