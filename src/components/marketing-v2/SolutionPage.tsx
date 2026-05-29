import {
  Envelope,
  FileX,
  Eye,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { MarketingShell } from "./Chrome";
import {
  Container,
  Section,
  Eyebrow,
  PrimaryDemoButton,
  CTAButton,
  PullQuote,
  Stat,
  FinalCTA,
} from "./primitives";
import { CASE_STUDY_PDF } from "./constants";

export type SolutionPageProps = {
  eyebrow: string;
  h1: string;
  sub: string;
  audience: string; // e.g. "shop owners"
  problems: string[];
  steps: string[];
  related?: { href: string; label: string }[];
};

export function SolutionPage({
  eyebrow,
  h1,
  sub,
  audience,
  problems,
  steps,
  related,
}: SolutionPageProps) {
  const problemIcons = [Envelope, FileX, Eye];
  return (
    <MarketingShell>
      <Section ariaLabel="Hero" className="pt-20 sm:pt-24 lg:pt-28">
        <Container className="max-w-4xl text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            {sub}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryDemoButton />
            <CTAButton href="/case-study/telletire" variant="secondary">
              Read the Telletire case study{" "}
              <ArrowRight size={16} weight="bold" aria-hidden />
            </CTAButton>
          </div>
        </Container>
      </Section>

      <Section
        ariaLabel="Common pain points"
        className="bg-white py-14 sm:py-16 lg:py-20 border-y border-slate-200"
      >
        <Container>
          <ul className="grid gap-8 sm:grid-cols-3">
            {problems.map((label, i) => {
              const Icon = problemIcons[i] ?? Envelope;
              return (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-700">
                    <Icon size={22} aria-hidden />
                  </span>
                  <p className="pt-2 text-base font-medium leading-relaxed text-slate-900">
                    {label}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section ariaLabel="How it works">
        <Container className="max-w-4xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Structured intake from {audience}, in one dashboard.
          </h2>
          <ol className="mt-12 space-y-6">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-5 sm:gap-6">
                <span
                  aria-hidden
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white tabular-nums"
                >
                  {i + 1}
                </span>
                <p className="pt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section
        ariaLabel="Customer testimonial"
        className="bg-white border-y border-slate-200"
      >
        <Container className="max-w-4xl">
          <PullQuote
            quote="ClientEnforce checks all the boxes for managing tasks, tracking, and workflow needs — we'd highly recommend it to any organization looking for a more effective and user-friendly solution."
            name="Tim Tuckfield"
            role="M&A Integration & Optimization, Telletire"
          />
          <dl className="mt-14 grid gap-10 sm:grid-cols-3">
            <Stat value="0" label="Follow-up emails for missing documents" />
            <Stat value="2" label="Simultaneous acquisitions from one dashboard" />
            <Stat value="1" label="System replacing email, spreadsheets and chasing" />
          </dl>
          <div className="mt-10">
            <Link
              href={CASE_STUDY_PDF}
              className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
            >
              Read the full case study{" "}
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
          </div>
        </Container>
      </Section>

      {related && related.length > 0 && (
        <Section ariaLabel="Related pages">
          <Container className="max-w-4xl">
            <Eyebrow>Related</Eyebrow>
            <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              More for {audience.toLowerCase()} and operators acquiring them.
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between rounded-md border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {r.label}
                    </span>
                    <ArrowRight
                      size={16}
                      weight="bold"
                      aria-hidden
                      className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <FinalCTA />
    </MarketingShell>
  );
}
