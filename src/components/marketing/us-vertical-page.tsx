import Link from "next/link";
import {
  FileText, ShieldCheck, Bell, BarChart3, PenLine, Users,
  CheckCircle2,
} from "lucide-react";

import { PublicHeader, PublicFooter, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { PricingToggle } from "@/components/marketing/pricing-toggle";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { LeadCaptureInline } from "@/components/marketing/lead-capture-inline";
import type { UsVerticalConfig } from "@/lib/us-landing-verticals";

/* ─── Shared feature list (identical across all vertical pages) ──────────── */
const sharedFeatures = [
  { icon: <FileText className="h-4 w-4" />, name: "Onboarding templates", desc: "Build once, reuse for every client" },
  { icon: <ShieldCheck className="h-4 w-4" />, name: "Required step enforcement", desc: "Clients can't skip mandatory items" },
  { icon: <Bell className="h-4 w-4" />, name: "Automated email reminders", desc: "No manual follow-up — ever" },
  { icon: <BarChart3 className="h-4 w-4" />, name: "Real-time progress dashboard", desc: "See every onboarding at a glance" },
  { icon: <PenLine className="h-4 w-4" />, name: "E-signature collection", desc: "Agreements signed inside the portal" },
  { icon: <FileText className="h-4 w-4" />, name: "Document upload", desc: "Secure, structured file collection" },
  { icon: <ShieldCheck className="h-4 w-4" />, name: "Audit trail with timestamps", desc: "Defensible record of every step" },
  { icon: <Users className="h-4 w-4" />, name: "Team roles (RBAC)", desc: "Right access for every team member" },
  { icon: <CheckCircle2 className="h-4 w-4" />, name: "No login required for clients", desc: "Clients complete intake from a link" },
] as const;

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function TrustBar({ config }: { config: UsVerticalConfig }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8">
        {config.heroTrustNote && (
          <p className="mb-2 text-center text-xs font-semibold text-[var(--color-accent)]">
            {/* TODO: Replace with real customer logo strip when available */}
            {config.heroTrustNote}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            "No credit card required",
            "Live in 20 minutes",
            "30-day money-back guarantee",
            "Automated follow-ups included",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-success)]" />
              {item}
            </span>
          ))}
          {/* TODO: Replace placeholder with live G2/Capterra badge when reviews are collected */}
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            ★★★★★ <span className="font-normal">4.8 on G2 · 50+ reviews</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ config }: { config: UsVerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <FadeUp>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
            {config.badge}
          </div>
          <h1
            className="mt-5 max-w-4xl text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[60px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {config.heroHeadline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--color-text-secondary)]">
            {config.heroSubheadline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto"
            >
              Start Your Free Trial
            </Link>
            <a
              href="https://calendar.app.google/QfkFs4hWUoCbKupj7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto"
            >
              Book a 20-min walkthrough
            </a>
          </div>
          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            No credit card required · 30-day money-back guarantee · Cancel anytime
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function PainPointsSection({ config }: { config: UsVerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sound familiar?
          </h2>
          <p className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)]">
            If you run a {config.vertical.toLowerCase()} business in the US, at least one of these hits home.
          </p>
        </FadeUp>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {config.painPoints.map((point, i) => (
            <FadeUp key={point.title} delay={i * 80}>
              <article className="card-lift h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{point.body}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({ config }: { config: UsVerticalConfig }) {
  const steps = [
    {
      step: "01",
      title: "Build your template once",
      body: "Define every document, question, signature, and required step for your service type. Takes under 20 minutes. Reuse it for every client after that.",
    },
    {
      step: "02",
      title: "Send one link when a client signs",
      body: "Clients see exactly what they need to do, in order. No login required. No confusion about where to send things.",
    },
    {
      step: "03",
      title: "Track completion — stop chasing",
      body: "Automated reminders handle overdue tasks. Your dashboard shows what's done, what's pending, and what's overdue — across every active onboarding.",
    },
  ];

  return (
    <section id="how-it-works" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <p className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)]">
            {config.howItWorksIntro}
          </p>
        </FadeUp>
        <div className="relative mt-14">
          <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {steps.map((s, i) => (
              <FadeUp key={s.step} delay={i * 100}>
                <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <span
                    className="text-5xl font-bold text-[var(--color-bg-muted)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.step}
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{s.body}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ config }: { config: UsVerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything {config.vertical.toLowerCase()} teams need
          </h2>
        </FadeUp>
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sharedFeatures.map((f, i) => (
            <FadeUp key={f.name} delay={i * 40}>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                  {f.icon}
                </div>
                <p className="mt-3 text-[13px] font-semibold text-[var(--color-text-primary)]">{f.name}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComplianceCallout({ text }: { text: string }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-8 py-7">
            <p className="text-base font-semibold leading-7 text-[var(--color-accent)]">
              🔒 {text}
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function UseCasesBlock({ useCases }: { useCases: { title: string; description: string }[] }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for every type of health & wellness business
          </h2>
        </FadeUp>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {useCases.map((uc, i) => (
            <FadeUp key={uc.title} delay={i * 80}>
              <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <h3 className="text-[15px] font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  {uc.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{uc.description}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhiteLabelCallout() {
  return (
    <section className="border-b border-[var(--color-border)] bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="grid grid-cols-1 gap-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-[var(--color-accent-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                Agency Pro — White-Label Plan
              </span>
              <h2
                className="mt-4 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                White label client onboarding software — your brand, your portal.
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                With Agency Pro, every client portal carries your agency&apos;s logo, colors, and domain. Clients never see ClientEnforce — they see a premium, branded onboarding experience that builds trust from day one.
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--color-text-secondary)]">
                Built for agencies billing retainers — recover the cost in one saved hour per client.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "White-label client portals (your brand)",
                "Custom domain for portals",
                "Unlimited active onboardings",
                "Unlimited templates",
                "Everything in the Scale plan",
                "Dedicated onboarding support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function PricingSection({ config }: { config: UsVerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)]">
            Start free. Upgrade as your onboarding volume grows. No long contracts.
          </p>
        </FadeUp>
        <div className="mt-10">
          <PricingToggle currency="USD" />
        </div>
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          No credit card required · 30-day money-back guarantee · Cancel anytime
        </p>
        <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
          <Link href="/pricing" className="underline hover:text-[var(--color-text-primary)]">
            View full plan comparison →
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Map a lead magnet title to its asset slug for /api/leads/capture */
function titleToAssetSlug(title: string): string {
  if (title.toLowerCase().includes("fleet") || title.toLowerCase().includes("auto service")) {
    return "fleet-account-onboarding-checklist";
  }
  if (title.toLowerCase().includes("agency")) return "agency-onboarding-checklist";
  if (title.toLowerCase().includes("consultant")) return "consultant-intake-checklist";
  return "client-onboarding-checklist";
}

function LeadMagnetBanner({ config }: { config: UsVerticalConfig }) {
  const asset = titleToAssetSlug(config.leadMagnetTitle);
  return (
    <section className="border-b border-[var(--color-border)] bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-8 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Free Download</p>
              <h3
                className="mt-1 text-xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {config.leadMagnetTitle}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                The exact steps top US {config.leadMagnetTitle.toLowerCase().includes("agency") ? "agencies" : "businesses"} use to onboard clients without chasing.
              </p>
            </div>
            <div className="shrink-0">
              <LeadCaptureInline
                asset={asset}
                vertical={config.slug}
                buttonLabel="Get the free checklist"
              />
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">No spam. Unsubscribe any time.</p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function FaqSection({ config }: { config: UsVerticalConfig }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <h2
            className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked questions
          </h2>
        </FadeUp>
        <div className="mt-10 max-w-2xl">
          <FaqAccordion items={config.faqItems} />
        </div>
      </div>
    </section>
  );
}

/* ─── Main template ──────────────────────────────────────────────────────── */
export function UsVerticalPage({ config }: { config: UsVerticalConfig }) {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>
        <HeroSection config={config} />
        <TrustBar config={config} />
        <PainPointsSection config={config} />
        <HowItWorksSection config={config} />
        {config.showRoiCalculator && <RoiCalculator />}
        <FeaturesSection config={config} />
        {config.showComplianceCallout && config.complianceCallout && (
          <ComplianceCallout text={config.complianceCallout} />
        )}
        {config.showUseCasesBlock && config.useCases && (
          <UseCasesBlock useCases={config.useCases} />
        )}
        {config.showWhiteLabel && <WhiteLabelCallout />}
        <PricingSection config={config} />
        <LeadMagnetBanner config={config} />
        <FaqSection config={config} />
        <CtaBand
          heading={config.ctaHeading}
          subtext={config.ctaSubtext}
          primaryLabel="Start Your Free Trial"
          primaryHref="/signup"
          secondaryLabel="Book a 20-min walkthrough →"
          secondaryHref="https://calendar.app.google/QfkFs4hWUoCbKupj7"
          secondaryExternal
        />
      </main>
      <PublicFooter />
    </div>
  );
}
