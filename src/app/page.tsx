import type { Metadata } from "next";
import {
  Envelope,
  FileX,
  Eye,
  CheckCircle,
  Bell,
  Link as LinkIcon,
  ChartLineUp,
  Folder,
  ClockCounterClockwise,
  Palette,
  EnvelopeSimple,
  ArrowRight,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-v2/Chrome";
import {
  Container,
  Section,
  Eyebrow,
  CTAButton,
  PrimaryDemoButton,
  FinalCTA,
  Stat,
  PullQuote,
} from "@/components/marketing-v2/primitives";
import { DEMO_URL, CASE_STUDY_PDF } from "@/components/marketing-v2/constants";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "ClientEnforce — Due diligence intake for M&A operators";
const description =
  "Collect due diligence from acquisition targets without email back-and-forth. One link per target, every section tracked, automatic reminders. No login required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const problems = [
  { icon: Envelope, label: "Email threads with sellers" },
  { icon: FileX, label: "Documents in wrong formats" },
  { icon: Eye, label: "No visibility across deals" },
];

const steps = [
  "Configure your due diligence template — we help on Day 1",
  "Each target gets a unique link — no login required on their side",
  "They complete intake section by section",
  "Missing items trigger automatic reminders",
  "You see everything in one dashboard across all active deals",
];

const features = [
  {
    icon: CheckCircle,
    title: "Multi-phase onboarding",
    body: "Structured phases with approve/reject so each step is signed off before the next begins.",
  },
  {
    icon: Bell,
    title: "Automatic reminders",
    body: "Deadline triggers and multi-tier rules chase missing items so you don’t have to.",
  },
  {
    icon: LinkIcon,
    title: "No login for sellers",
    body: "Each target gets a unique link. They never create an account.",
  },
  {
    icon: ChartLineUp,
    title: "Single dashboard",
    body: "Every active acquisition, every section, every outstanding item — in one view.",
  },
  {
    icon: Folder,
    title: "File storage per deal",
    body: "Documents are isolated per onboarding, organised by section.",
  },
  {
    icon: ClockCounterClockwise,
    title: "Full activity log",
    body: "Timestamped history of every action across every onboarding.",
  },
  {
    icon: Palette,
    title: "White-label portal",
    body: "Your brand, your domain, throughout the seller experience.",
  },
  {
    icon: EnvelopeSimple,
    title: "Email notifications",
    body: "Real-time updates when sellers submit, edit, or complete a section.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "£29",
    cadence: "/mo",
    blurb: "1–3 active onboardings",
    features: ["Core intake", "Auto-reminders", "Single user"],
    cta: { label: "Get started", href: "/signup", external: false },
    highlighted: false,
  },
  {
    name: "Medium",
    price: "£89",
    cadence: "/mo",
    blurb: "Up to 10 active onboardings",
    features: ["Everything in Starter", "Team access", "Priority support"],
    cta: { label: "Get started", href: "/signup", external: false },
    highlighted: true,
  },
  {
    name: "Top",
    price: "£149",
    cadence: "/mo",
    blurb: "Unlimited active onboardings",
    features: ["Everything in Medium", "Advanced workflows", "Analytics"],
    cta: { label: "Get started", href: "/signup", external: false },
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "White-label and integrations",
    features: ["Custom integrations", "Founder access", "Bespoke workflows"],
    cta: { label: "Book a demo", href: DEMO_URL, external: true },
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <Section ariaLabel="Hero" className="pt-20 sm:pt-24 lg:pt-32">
        <Container className="max-w-4xl text-center">
          <Eyebrow>For M&amp;A operators</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Collect due diligence from acquisition targets — without the email
            back-and-forth.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
            ClientEnforce gives M&amp;A operators a structured intake system. One
            link per target, every section tracked, automatic reminders. No login
            required on their side.
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
            {problems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Icon size={22} aria-hidden />
                </span>
                <p className="pt-2 text-base font-medium leading-relaxed text-slate-900">
                  {label}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section ariaLabel="How it works">
        <Container className="max-w-4xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            From template to closed deal, in one system.
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

      <Section ariaLabel="Features">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Features</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Everything an M&amp;A operator needs to collect, track and close.
            </h2>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className={`rounded-xl border border-slate-200 bg-white p-6 transition-shadow duration-150 hover:shadow-md ${
                  i === 0 || i === 3 ? "lg:col-span-2" : ""
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section ariaLabel="Built for these verticals">
        <Container className="max-w-4xl text-center">
          <Eyebrow>Built for</Eyebrow>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Operators acquiring across these verticals.
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { href: "/solutions/automotive", label: "Automotive roll-ups" },
              { href: "/solutions/home-services", label: "Home services roll-ups" },
              { href: "/solutions/healthcare", label: "Healthcare acquisitions" },
            ].map((v) => (
              <li key={v.href}>
                <Link
                  href={v.href}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
                >
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        ariaLabel="Pricing"
        className="bg-white border-y border-slate-200"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Simple pricing for every stage of your acquisition pipeline.
            </h2>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className={`flex flex-col rounded-xl border bg-white p-6 ${
                  plan.highlighted
                    ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md"
                    : "border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-slate-950 tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.cadence}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{plan.blurb}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-slate-700">
                      <Check
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-0.5 flex-none text-sky-700"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  {plan.cta.external ? (
                    <a
                      href={plan.cta.href}
                      className={`block w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 ${
                        plan.highlighted
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border border-slate-300 text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {plan.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={plan.cta.href}
                      className={`block w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 ${
                        plan.highlighted
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border border-slate-300 text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {plan.cta.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-slate-600">
            Need something custom?{" "}
            <Link href="/pricing" className="font-semibold text-sky-700 hover:text-sky-800">
              Compare plans in detail →
            </Link>
          </p>
        </Container>
      </Section>

      <FinalCTA />
    </MarketingShell>
  );
}
