import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce Pricing | Client Onboarding Software Plans",
  description:
    "Simple, transparent pricing for client onboarding software. Start free, upgrade when you need more. No long contracts.",
  path: "/pricing",
  keywords: [
    "client onboarding software pricing",
    "client onboarding platform pricing",
    "client onboarding automation plans",
  ],
  type: "website",
});

type Plan = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  bestFor: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Solo",
    price: "£0",
    cadence: "/month",
    tagline: "For testing your onboarding flow and first client rollouts.",
    bestFor: "Best for solo operators validating one core onboarding workflow before scaling.",
    features: [
      "1 admin user",
      "1 onboarding template",
      "Client portal link per onboarding",
      "Document uploads + signatures",
      "Up to 5 active onboardings",
    ],
    cta: { label: "Start free trial", href: "/signup" },
    badge: "Free",
  },
  {
    name: "Team",
    price: "£29",
    cadence: "/month",
    tagline: "For small teams running onboarding at pace.",
    bestFor: "Best for teams that need reminder automation and stronger process consistency across active clients.",
    highlighted: true,
    badge: "Most popular",
    features: [
      "Up to 5 admin users",
      "Up to 10 templates",
      "Automated reminders (email)",
      "Audit timeline + evidence export",
      "Up to 50 active onboardings",
    ],
    cta: { label: "Start Team plan", href: "/signup" },
  },
  {
    name: "Scale",
    price: "£89",
    cadence: "/month",
    tagline: "For teams onboarding clients at volume with stricter controls.",
    bestFor: "Best for agencies and service operations managing higher onboarding volume with multi-user governance needs.",
    features: [
      "Up to 15 admin users",
      "Unlimited templates",
      "Everything in Team",
      "Advanced reporting level",
      "Up to 200 active onboardings",
    ],
    cta: { label: "Start Scale plan", href: "/signup" },
    badge: "Scale",
  },
];

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free trial for ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can start a free trial of ClientEnforce without a credit card. Build your first onboarding template and send a client portal link on the same day.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change my plan later?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period.",
      },
    },
    {
      "@type": "Question",
      name: "Do my clients need to pay or create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your clients access their onboarding portal through a secure link - no login required, no account needed, no cost to them.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my data if I cancel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can export all your onboarding data and audit trails before cancelling. Your data is yours.",
      },
    },
  ],
};

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={[
        "rounded-3xl border bg-white p-6 shadow-sm sm:p-8",
        plan.highlighted ? "border-zinc-900" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">{plan.name}</h2>
        {plan.badge ? (
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-medium",
              plan.highlighted
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 bg-zinc-50 text-zinc-700",
            ].join(" ")}
          >
            {plan.badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
        {plan.price}
        <span className="ml-1 text-base font-medium text-zinc-600">{plan.cadence}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{plan.tagline}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{plan.bestFor}</p>

      <ul className="mt-6 space-y-3 text-sm text-zinc-800">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-900" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.cta.href}
        className={[
          "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium shadow-sm transition",
          plan.highlighted
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        ].join(" ")}
      >
        {plan.cta.label}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />
      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Pricing</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Simple pricing for client onboarding software
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Start free, then upgrade as your onboarding volume grows. Every plan includes the core workflow tools you need to standardize intake and reduce kickoff delays.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free trial
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Explore features
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-6 py-10 sm:py-12">
              <div className="grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Which plan should you pick?</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Solo</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Best when you are validating one onboarding workflow and onboarding volume is still low.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Team</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Best for agencies and service teams that need automated reminders and repeatable onboarding execution.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Scale</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Best when you manage higher onboarding volume and need stronger governance across multiple team members.
                    </p>
                  </article>
                </div>
              </section>

              <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Pricing FAQ</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Is there a free trial for ClientEnforce?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. You can start a free trial without a credit card and send your first onboarding portal the same day.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Can I change my plan later?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Yes. Upgrade or downgrade at any time. Changes apply from your next billing cycle.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">Do my clients need to create an account?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      No. Clients use a secure portal link with no account setup required.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">What happens if I cancel?</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      You can export your onboarding records and audit trails before cancellation.
                    </p>
                  </article>
                </div>
              </section>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={pricingFaqSchema} />
    </div>
  );
}
