"use client";
import { useState } from "react";
import Link from "next/link";

type Currency = "GBP" | "USD";

const plans = [
  {
    name: "Solo",
    GBP: { monthly: "£0", annual: "£0" },
    USD: { monthly: "$0", annual: "$0" },
    cadence: "/month",
    tagline: "For testing your onboarding flow and first client rollouts.",
    features: [
      "1 admin user",
      "1 onboarding template",
      "Client portal link per onboarding",
      "Document uploads + signatures",
      "Up to 5 active onboardings",
    ],
    cta: { label: "Start free — no card needed", href: "/signup" },
    badge: null as string | null,
    highlighted: false,
  },
  {
    name: "Team",
    GBP: { monthly: "£29", annual: "£24" },
    USD: { monthly: "$37", annual: "$30" },
    cadence: "/month",
    tagline: "For small teams running onboarding at pace.",
    features: [
      "Up to 5 admin users",
      "Up to 10 templates",
      "Automated reminders (email)",
      "Audit timeline + evidence export",
      "Up to 50 active onboardings",
    ],
    cta: { label: "Start Team plan", href: "/signup" },
    badge: "Most popular",
    highlighted: true,
  },
  {
    name: "Scale",
    GBP: { monthly: "£89", annual: "£74" },
    USD: { monthly: "$113", annual: "$94" },
    cadence: "/month",
    tagline: "For teams onboarding clients at volume with stricter controls.",
    features: [
      "Up to 15 admin users",
      "Unlimited templates",
      "Everything in Team",
      "Advanced reporting",
      "Up to 200 active onboardings",
    ],
    cta: { label: "Start Scale plan", href: "/signup" },
    badge: "Best value",
    highlighted: false,
  },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[var(--color-accent)]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingToggle({ currency = "GBP" }: { currency?: Currency }) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setAnnual(false)}
          className={`text-sm font-semibold transition ${!annual ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${annual ? "bg-[var(--color-accent)]" : "bg-[var(--color-border-strong)]"}`}
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-200 ${annual ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`text-sm font-semibold transition ${annual ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}
        >
          Annual
          <span className="ml-2 inline-flex items-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
            Save 20%
          </span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "relative flex flex-col rounded-[var(--radius-xl)] border p-8 transition",
              plan.highlighted
                ? "order-first border-[var(--color-accent)] bg-[var(--color-accent-subtle)] shadow-[var(--shadow-lg)] lg:order-none"
                : "order-last border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] lg:order-none",
            ].join(" ")}
          >
            {plan.badge && (
              <div className="mb-5">
                <span
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    plan.highlighted
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
                  ].join(" ")}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            <h2
              className="text-xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {plan.name}
            </h2>

            <div className="mt-4 flex items-end gap-1">
              <span
                className="text-5xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {annual ? plan[currency].annual : plan[currency].monthly}
              </span>
              <span className="mb-1.5 text-sm text-[var(--color-text-muted)]">{plan.cadence}</span>
            </div>
            {annual && plan.name !== "Solo" && (
              <p className="mt-1 text-xs font-semibold text-[var(--color-accent)]">Billed annually — 2 months free</p>
            )}

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{plan.tagline}</p>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.cta.href}
              className={[
                "mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]",
                plan.highlighted
                  ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]",
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
