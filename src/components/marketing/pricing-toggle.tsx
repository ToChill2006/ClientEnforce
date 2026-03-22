"use client";
import { useState } from "react";
import Link from "next/link";

type Plan = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
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
    monthlyPrice: "£0",
    annualPrice: "£0",
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
    cta: { label: "Start free — no card needed", href: "/signup" },
    badge: "Free",
  },
  {
    name: "Team",
    monthlyPrice: "£29",
    annualPrice: "£24",
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
    monthlyPrice: "£89",
    annualPrice: "£74",
    cadence: "/month",
    tagline: "For teams onboarding clients at volume with stricter controls.",
    bestFor: "Best for agencies and service operations managing higher onboarding volume with multi-user governance needs.",
    features: [
      "Up to 15 admin users",
      "Unlimited templates",
      "Everything in Team",
      "Advanced reporting",
      "Up to 200 active onboardings",
    ],
    cta: { label: "Start Scale plan", href: "/signup" },
    badge: "Best value",
  },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#00C2A8]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingToggle() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setAnnual(false)}
          className={`text-sm font-medium transition ${!annual ? "text-[#F0F0F0]" : "text-[#9A9AAF]"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
            annual ? "bg-[#00C2A8]" : "bg-white/10"
          }`}
          role="switch"
          aria-checked={annual}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              annual ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`text-sm font-medium transition ${annual ? "text-[#F0F0F0]" : "text-[#9A9AAF]"}`}
        >
          Annual
          <span className="ml-2 rounded-full bg-[#00C2A8]/15 px-2 py-0.5 text-xs font-semibold text-[#00C2A8]">
            2 months free
          </span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "relative rounded-3xl border p-7 transition card-polish",
              plan.highlighted
                ? "border-[#00C2A8]/40 bg-[#111118] shadow-[0_0_40px_rgba(0,194,168,0.12)]"
                : "border-white/[0.08] bg-[#111118]",
            ].join(" ")}
          >
            {plan.badge && (
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    plan.highlighted
                      ? "bg-[#00C2A8] text-[#0A0A0F]"
                      : "border border-white/10 bg-white/5 text-[#9A9AAF]",
                  ].join(" ")}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            <h2 className="font-serif text-2xl text-[#F0F0F0]">{plan.name}</h2>

            <div className="mt-4 flex items-end gap-1">
              <span className="font-serif text-5xl text-[#F0F0F0]">
                {annual ? plan.annualPrice : plan.monthlyPrice}
              </span>
              <span className="mb-1.5 text-sm text-[#9A9AAF]">{plan.cadence}</span>
            </div>
            {annual && plan.name !== "Solo" && (
              <p className="mt-1 text-xs text-[#00C2A8]">Billed annually</p>
            )}

            <p className="mt-3 text-sm leading-6 text-[#9A9AAF]">{plan.tagline}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#9A9AAF]">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.cta.href}
              className={[
                "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition",
                plan.highlighted
                  ? "bg-[#00C2A8] text-[#0A0A0F] hover:bg-[#00d4b8] shadow-[0_0_20px_rgba(0,194,168,0.3)]"
                  : "border border-white/10 bg-white/5 text-[#F0F0F0] hover:bg-white/10",
              ].join(" ")}
            >
              {plan.cta.label}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
