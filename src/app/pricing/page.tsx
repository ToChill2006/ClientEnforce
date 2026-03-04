import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | ClientEnforce – Simple plans for onboarding",
  description:
    "ClientEnforce pricing for client onboarding automation. Choose a plan for client portals, document uploads, signatures, and workflow tracking.",
};

type Plan = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "£0",
    tagline: "For getting set up and testing the flow.",
    features: [
      "Client portal link",
      "Document requests + uploads",
      "Basic onboarding steps",
      "Signature capture",
      "Email support",
    ],
    cta: { label: "Start free", href: "/login" },
  },
  {
    name: "Pro",
    price: "£19/mo",
    tagline: "For solo operators and small teams.",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Automated reminders",
      "Multiple onboarding templates",
      "Audit-ready timeline",
      "Priority support",
    ],
    cta: { label: "Choose Pro", href: "/login" },
  },
  {
    name: "Team",
    price: "£49/mo",
    tagline: "For teams onboarding clients at scale.",
    features: [
      "Everything in Pro",
      "Team member roles",
      "Shared client dashboard",
      "Advanced reporting (coming soon)",
      "Dedicated onboarding help",
    ],
    cta: { label: "Choose Team", href: "/login" },
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-6 shadow-sm",
        plan.highlighted ? "border-zinc-900" : "border-zinc-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
          <p className="mt-1 text-sm text-zinc-600">{plan.tagline}</p>
        </div>

        {plan.highlighted ? (
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
            Most popular
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <div className="text-3xl font-semibold tracking-tight text-zinc-900">
          {plan.price}
        </div>
        <p className="mt-1 text-xs text-zinc-500">Cancel anytime.</p>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-zinc-700">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-zinc-900" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.cta.href}
        className={[
          "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium shadow-sm",
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
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <Container>
          <div className="py-14">
            <p className="text-sm font-medium text-zinc-600">Pricing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Simple pricing for client onboarding
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Choose a plan that fits your workflow. Upgrade when you’re ready.
              Every plan is built around document uploads, signatures, and tracking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                See features
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
              >
                Start free
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="py-12">
            <div className="grid gap-4 lg:grid-cols-3">
              {plans.map((p) => (
                <PlanCard key={p.name} plan={p} />
              ))}
            </div>

            {/* SEO paragraph */}
            <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">
                What you get with ClientEnforce
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                ClientEnforce is built to reduce onboarding delays by combining a client portal,
                structured onboarding checklists, document collection, and signature capture.
                If you’re searching for client onboarding software that’s simple to run and easy for clients to complete,
                ClientEnforce keeps everything in one place—so your team spends less time chasing.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}