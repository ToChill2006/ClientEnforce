import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/marketing-v2/Chrome";
import {
  Container,
  Section,
  Eyebrow,
  FinalCTA,
  PullQuote,
} from "@/components/marketing-v2/primitives";
import { DEMO_URL } from "@/components/marketing-v2/constants";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "Pricing | ClientEnforce";
const description =
  "ClientEnforce pricing for M&A operators. Starter from £29/mo, Medium £89, Top £149, plus white-label Enterprise. Compare every plan side-by-side.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/pricing`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

type CellValue = string | boolean;

type Plan = {
  key: "starter" | "medium" | "top" | "enterprise";
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  highlighted?: boolean;
  cta: { label: string; href: string; external?: boolean };
};

const plans: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    price: "£29",
    cadence: "/mo",
    blurb: "1–3 active onboardings",
    cta: { label: "Get started", href: "/signup" },
  },
  {
    key: "medium",
    name: "Medium",
    price: "£89",
    cadence: "/mo",
    blurb: "Up to 10 active onboardings",
    highlighted: true,
    cta: { label: "Get started", href: "/signup" },
  },
  {
    key: "top",
    name: "Top",
    price: "£149",
    cadence: "/mo",
    blurb: "Unlimited active onboardings",
    cta: { label: "Get started", href: "/signup" },
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "White-label, integrations, founder access",
    cta: { label: "Book a demo", href: DEMO_URL, external: true },
  },
];

const matrix: { feature: string; values: Record<Plan["key"], CellValue> }[] = [
  {
    feature: "Active onboardings",
    values: { starter: "1–3", medium: "Up to 10", top: "Unlimited", enterprise: "Unlimited" },
  },
  {
    feature: "Auto-reminders",
    values: { starter: true, medium: true, top: true, enterprise: true },
  },
  {
    feature: "Team access",
    values: { starter: false, medium: true, top: true, enterprise: true },
  },
  {
    feature: "White-label",
    values: { starter: false, medium: false, top: false, enterprise: true },
  },
  {
    feature: "File storage",
    values: { starter: "10 GB", medium: "50 GB", top: "250 GB", enterprise: "Custom" },
  },
  {
    feature: "Activity log",
    values: { starter: true, medium: true, top: true, enterprise: true },
  },
  {
    feature: "Integrations",
    values: { starter: false, medium: "Standard", top: "Standard", enterprise: "Custom" },
  },
  {
    feature: "Support",
    values: { starter: "Email", medium: "Priority email", top: "Priority + Slack", enterprise: "Founder access" },
  },
];

const faqs = [
  {
    q: "Do my sellers need to create an account?",
    a: "No — they receive a unique link.",
  },
  {
    q: "How long does setup take?",
    a: "You're live on Day 1. We configure the template with you.",
  },
  {
    q: "Can I add requirements to a live onboarding?",
    a: "Yes — without starting over.",
  },
  {
    q: "Is data stored in the UK?",
    a: "Yes — Supabase UK region, encrypted at rest and in transit.",
  },
  {
    q: "What if I need features you don't have?",
    a: "We build them. Tim at Telletire asked — we delivered within the week.",
  },
];

function Cell({ value }: { value: CellValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={18} weight="bold" aria-label="Included" className="mx-auto text-sky-700" />
    ) : (
      <Minus size={18} aria-label="Not included" className="mx-auto text-slate-300" />
    );
  }
  return <span className="text-sm text-slate-700">{value}</span>;
}

export default function PricingPage() {
  return (
    <MarketingShell>
      <Section ariaLabel="Pricing hero" className="pt-20 sm:pt-24 lg:pt-28">
        <Container className="max-w-3xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Pricing that scales with your acquisition pipeline.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Start when you have one deal. Grow when you have ten. Talk to us when
            you want white-label.
          </p>
        </Container>
      </Section>

      <Section ariaLabel="Plans" className="pt-0">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <li
                key={plan.key}
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
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {plan.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-slate-950 tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.cadence}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{plan.blurb}</p>
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
        </Container>
      </Section>

      <Section
        ariaLabel="Plan comparison"
        className="bg-white border-y border-slate-200"
      >
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Compare plans</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Every plan, side by side.
            </h2>
          </div>
          <div className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
              <caption className="sr-only">
                ClientEnforce plan feature comparison
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-b border-slate-200 bg-white px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.key}
                      scope="col"
                      className="border-b border-slate-200 px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {p.name}
                      <div className="mt-1 text-sm font-semibold normal-case tracking-normal text-slate-900">
                        {p.price}
                        <span className="font-normal text-slate-500">{p.cadence}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? "bg-slate-50/60" : ""}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-slate-200 bg-inherit px-4 py-4 text-sm font-medium text-slate-900"
                    >
                      {row.feature}
                    </th>
                    {plans.map((p) => (
                      <td
                        key={p.key}
                        className="border-b border-slate-200 px-4 py-4 text-center"
                      >
                        <Cell value={row.values[p.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Customer testimonial">
        <Container className="max-w-4xl">
          <PullQuote
            quote="ClientEnforce checks all the boxes for managing tasks, tracking, and workflow needs — we'd highly recommend it to any organization looking for a more effective and user-friendly solution."
            name="Tim Tuckfield"
            role="M&A Integration & Optimization, Telletire"
          />
        </Container>
      </Section>

      <Section ariaLabel="Frequently asked questions" className="bg-white border-y border-slate-200">
        <Container className="max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Common questions.
          </h2>
          <dl className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-base font-semibold text-slate-950">{f.q}</dt>
                <dd className="mt-2 text-base leading-relaxed text-slate-700">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <FinalCTA
        heading="Have a question we didn't cover?"
        sub="Book 20 minutes with us. We'll answer it on the call."
      />
    </MarketingShell>
  );
}
