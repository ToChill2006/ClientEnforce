import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { PricingToggle } from "@/components/marketing/pricing-toggle";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce Pricing | Onboarding Software Plans for US Teams",
  description: "Simple, transparent pricing for US agencies, consultants, and accountants. Start free — no credit card required. Plans from $0 to $149/month.",
  path: "/pricing",
  keywords: ["client onboarding software pricing", "client portal software pricing US", "onboarding automation for agencies pricing"],
  type: "website",
});

const pricingFaqItems = [
  { question: "Is there a free trial for ClientEnforce?", answer: "Yes. You can start a free trial of ClientEnforce without a credit card. Build your first onboarding template and send a client portal link on the same day." },
  { question: "Can I change my plan later?", answer: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period." },
  { question: "Do my clients need to pay or create an account?", answer: "No. Your clients access their onboarding portal through a secure link — no login required, no account needed, no cost to them." },
  { question: "What happens to my data if I cancel?", answer: "You can export all your onboarding data and audit trails before cancelling. Your data is yours." },
  { question: "Do you offer annual billing?", answer: "Yes. Annual billing is available and saves you the equivalent of 2 months compared to monthly. Toggle to annual above to see the annual pricing." },
] as const;

const comparisonFeatures = [
  { name: "Admin users", solo: "1", team: "Up to 5", scale: "Up to 15", agency: "Up to 15" },
  { name: "Onboarding templates", solo: "1", team: "Up to 10", scale: "Unlimited", agency: "Unlimited" },
  { name: "Active onboardings", solo: "5", team: "50", scale: "200", agency: "Unlimited" },
  { name: "Client portal (no login)", solo: true, team: true, scale: true, agency: true },
  { name: "Document uploads", solo: true, team: true, scale: true, agency: true },
  { name: "E-signatures", solo: true, team: true, scale: true, agency: true },
  { name: "Automated reminders", solo: false, team: true, scale: true, agency: true },
  { name: "Audit trail", solo: false, team: true, scale: true, agency: true },
  { name: "Evidence export (PDF)", solo: false, team: true, scale: true, agency: true },
  { name: "Team roles (RBAC)", solo: false, team: true, scale: true, agency: true },
  { name: "Advanced reporting", solo: false, team: "Limited", scale: "Full", agency: "Full" },
  { name: "White-label portals", solo: false, team: false, scale: false, agency: true },
  { name: "Custom portal domain", solo: false, team: false, scale: false, agency: true },
  { name: "Priority support", solo: false, team: true, scale: true, agency: "Dedicated" },
] as const;

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

function Check() {
  return <svg className="mx-auto h-4 w-4 text-[var(--color-success)]" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Cross() {
  return <svg className="mx-auto h-4 w-4 text-[var(--color-border-strong)]" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function Cell({ val }: { val: boolean | string }) {
  if (val === true) return <Check />;
  if (val === false) return <Cross />;
  return <span className="text-xs text-[var(--color-text-secondary)]">{val}</span>;
}

export default async function PricingPage() {
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") ?? "GB";
  const currency = country === "US" ? "USD" : "GBP";

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <FadeUp>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Pricing</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-[56px]" style={{ fontFamily: "var(--font-display)" }}>
                Straightforward pricing for US teams that onboard clients
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[var(--color-text-secondary)]">
                Start free, then upgrade as your onboarding volume grows. Every paid plan includes automated reminders, audit trails, and required-step enforcement — no IT setup required.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                  Start Free Trial
                </Link>
                <Link href="/contact" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                  Book a 15-min Demo
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">No credit card required · 30-day money-back guarantee · Cancel anytime</p>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Plans */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20">
          <PageContainer>
            <PricingToggle currency={currency} />
          </PageContainer>
        </section>

        {/* Which plan */}
        <section className="border-b border-[var(--color-border)] bg-white py-20">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Which plan should you pick?</h2>
            </FadeUp>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { name: "Solo", desc: "Best when you're testing one workflow or onboarding your first few clients. Free, no card required." },
                { name: "Team", desc: "Best for US agencies and service teams that need automated follow-ups, audit trails, and repeatable execution." },
                { name: "Scale", desc: "Best when you're managing high onboarding volume and need stronger governance across a larger team." },
                { name: "Agency Pro", desc: "Best for agencies that want to deliver a fully branded onboarding experience under their own domain." },
              ].map((p, i) => (
                <FadeUp key={p.name} delay={i * 80}>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{p.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Comparison table */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Full feature comparison</h2>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto">
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Feature</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Solo</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Team</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Scale</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Agency Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {comparisonFeatures.map((row) => (
                      <tr key={row.name} className="hover:bg-[var(--color-bg-subtle)]">
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row.name}</td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.solo} /></td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.team} /></td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.scale} /></td>
                        <td className="px-5 py-3.5 text-center"><Cell val={row.agency} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-20">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Pricing FAQ</h2>
            </FadeUp>
            <div className="mt-8 max-w-2xl">
              <FaqAccordion items={pricingFaqItems} />
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Your next client deserves a better start."
          subtext="Launch your first onboarding template in under 20 minutes. No credit card required. 30-day money-back guarantee."
          primaryLabel="Start Free Trial"
          secondaryLabel="Book a 15-min Demo →"
          secondaryHref="/contact"
        />

      </main>
      <PublicFooter />
      <JsonLd data={pricingFaqSchema} />
    </div>
  );
}
