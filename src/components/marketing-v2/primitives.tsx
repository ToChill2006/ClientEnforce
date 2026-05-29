import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DEMO_URL } from "./constants";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className={`py-16 sm:py-20 lg:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
      {children}
    </p>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  ariaLabel?: string;
};

export function CTAButton({
  children,
  href,
  variant = "primary",
  external,
  ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex h-12 min-w-[44px] items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 cursor-pointer";
  const styles = {
    primary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
    secondary:
      "bg-white text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50",
    ghost: "text-slate-900 hover:bg-slate-100",
  }[variant];
  const cls = `${base} ${styles}`;
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function PrimaryDemoButton({ label = "Book a 20-minute demo" }: { label?: string }) {
  return (
    <CTAButton href={DEMO_URL} external variant="primary">
      {label}
    </CTAButton>
  );
}

export function FinalCTA({
  heading = "Ready to stop chasing documents?",
  sub = "Book a 20-minute demo. We'll show you exactly how it works for your acquisition workflow.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <Section ariaLabel="Final call to action" className="bg-slate-900 text-white">
      <Container className="text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {heading}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
          {sub}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={DEMO_URL}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-slate-900 transition-all duration-150 hover:bg-slate-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Book a demo <ArrowRight size={16} weight="bold" aria-hidden />
          </a>
        </div>
      </Container>
    </Section>
  );
}

export function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-4xl font-semibold tracking-tight text-slate-950 tabular-nums sm:text-5xl">
        {value}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{label}</p>
    </div>
  );
}

export function PullQuote({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <figure>
      <blockquote className="text-balance text-xl font-medium leading-relaxed text-slate-900 sm:text-2xl lg:text-3xl">
        <span aria-hidden className="text-slate-300">“</span>
        {quote}
        <span aria-hidden className="text-slate-300">”</span>
      </blockquote>
      <figcaption className="mt-6 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{name}</span> — {role}
      </figcaption>
    </figure>
  );
}
