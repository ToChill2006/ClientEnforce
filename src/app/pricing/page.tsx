import type { Metadata } from "next";
import Link from "next/link";

import { PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing | ClientEnforce – Client Onboarding Plans",
  description:
    "ClientEnforce pricing for client onboarding software. Compare Starter, Pro, and Business plans for templates, automation, audit trail, and team scale.",
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
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "£0",
    cadence: "/month",
    tagline: "For testing your onboarding flow and first client rollouts.",
    features: [
      "1 admin user",
      "1 onboarding template",
      "Client portal link per onboarding",
      "Document uploads + signatures",
      "Up to 5 active onboardings",
    ],
    cta: { label: "Get started", href: "/signup" },
    badge: "Free",
  },
  {
    name: "Pro",
    price: "£29",
    cadence: "/month",
    tagline: "For solo operators and small teams running onboarding at pace.",
    highlighted: true,
    badge: "Most popular",
    features: [
      "Up to 5 admin users",
      "Up to 10 templates",
      "Automated reminders (email)",
      "Audit timeline + evidence export",
      "Up to 50 active onboardings",
    ],
    cta: { label: "Start Pro", href: "/signup" },
  },
  {
    name: "Business",
    price: "£89",
    cadence: "/month",
    tagline: "For teams onboarding clients at volume with stricter controls.",
    features: [
      "Up to 15 admin users",
      "Unlimited templates",
      "Everything in Pro",
      "Advanced reporting level",
      "Up to 200 active onboardings",
    ],
    cta: { label: "Upgrade to Business", href: "/signup" },
    badge: "Scale",
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={[
        "rounded-3xl border bg-white p-6 shadow-sm sm:p-8",
        plan.highlighted ? "border-zinc-900" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-900">{plan.name}</h3>
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
    <>
      <PublicHeader />
      <main className="min-h-screen bg-zinc-50">
        <section className="border-b border-zinc-200 bg-white">
          <Container>
            <div className="py-14 sm:py-16">
              <p className="text-sm font-medium text-zinc-600">Pricing</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Straightforward pricing for client onboarding
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                Choose the plan that matches your onboarding volume. Every tier is focused on one
                goal: helping your team collect documents, signatures, and required client details
                faster.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                >
                  Start free
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Explore features
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="py-12">
              <div className="grid gap-5 lg:grid-cols-3">
                {plans.map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>

              <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <table className="w-full min-w-[680px] text-left text-sm text-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-900">
                      <th className="px-4 py-3 font-semibold">Plan</th>
                      <th className="px-4 py-3 font-semibold">Admin users</th>
                      <th className="px-4 py-3 font-semibold">Templates</th>
                      <th className="px-4 py-3 font-semibold">Active onboardings</th>
                      <th className="px-4 py-3 font-semibold">Automation + audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-t border-zinc-100 px-4 py-3 font-medium text-zinc-900">Starter</td>
                      <td className="border-t border-zinc-100 px-4 py-3">1</td>
                      <td className="border-t border-zinc-100 px-4 py-3">1</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 5</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Not included</td>
                    </tr>
                    <tr>
                      <td className="border-t border-zinc-100 px-4 py-3 font-medium text-zinc-900">Pro</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 5</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 10</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 50</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Included</td>
                    </tr>
                    <tr>
                      <td className="border-t border-zinc-100 px-4 py-3 font-medium text-zinc-900">Business</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 15</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Unlimited</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Up to 200</td>
                      <td className="border-t border-zinc-100 px-4 py-3">Advanced</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-zinc-900">Need a custom rollout plan?</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  If your team has specialized onboarding requirements or higher-volume rollout plans,
                  contact us and we can help you choose the best tier and implementation path.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
                  >
                    Contact sales
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Back to homepage
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
