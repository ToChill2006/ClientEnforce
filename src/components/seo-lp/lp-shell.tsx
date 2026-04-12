import Image from "next/image";
import Link from "next/link";

export function LPHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
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

        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)]"
        >
          Start free trial
        </Link>
      </div>
    </header>
  );
}

export function LPFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} ClientEnforce. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
          <Link href="/privacy" className="transition hover:text-[var(--color-text-primary)]">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-[var(--color-text-primary)]">
            Terms
          </Link>
          <Link href="/client-onboarding-software" className="transition hover:text-[var(--color-text-primary)]">
            Client onboarding software
          </Link>
          <Link href="/pricing" className="transition hover:text-[var(--color-text-primary)]">
            Pricing
          </Link>
        </nav>
      </div>
    </footer>
  );
}
