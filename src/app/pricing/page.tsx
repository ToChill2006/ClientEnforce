import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { PricingToggle } from "@/components/marketing/pricing-toggle";
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

const pricingFaqItems = [
  {
    question: "Is there a free trial for ClientEnforce?",
    answer: "Yes. You can start a free trial of ClientEnforce without a credit card. Build your first onboarding template and send a client portal link on the same day.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing period.",
  },
  {
    question: "Do my clients need to pay or create an account?",
    answer: "No. Your clients access their onboarding portal through a secure link — no login required, no account needed, no cost to them.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "You can export all your onboarding data and audit trails before cancelling. Your data is yours.",
  },
  {
    question: "Do you offer annual billing?",
    answer: "Yes. Annual billing is available and saves you the equivalent of 2 months compared to monthly. Toggle to annual above to see the annual pricing.",
  },
] as const;

const comparisonFeatures = [
  { name: "Admin users", solo: "1", team: "Up to 5", scale: "Up to 15" },
  { name: "Onboarding templates", solo: "1", team: "Up to 10", scale: "Unlimited" },
  { name: "Active onboardings", solo: "5", team: "50", scale: "200" },
  { name: "Client portal (no login)", solo: true, team: true, scale: true },
  { name: "Document uploads", solo: true, team: true, scale: true },
  { name: "E-signatures", solo: true, team: true, scale: true },
  { name: "Automated reminders", solo: false, team: true, scale: true },
  { name: "Audit trail", solo: false, team: true, scale: true },
  { name: "Evidence export (PDF)", solo: false, team: true, scale: true },
  { name: "Team roles (RBAC)", solo: false, team: true, scale: true },
  { name: "Advanced reporting", solo: false, team: "Limited", scale: "Full" },
  { name: "Priority support", solo: false, team: true, scale: true },
] as const;

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

function CheckIcon() {
  return (
    <svg className="mx-auto h-4 w-4 text-[#00C2A8]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="mx-auto h-4 w-4 text-white/20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <CheckIcon />;
  if (val === false) return <CrossIcon />;
  return <span className="text-xs text-[#9A9AAF]">{val}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-sans">
      <PublicHeader />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 sm:py-24">
              <FadeUp>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">Pricing</p>
                <h1 className="mt-4 font-serif text-5xl tracking-tight text-[#F0F0F0] sm:text-[64px]">
                  Simple pricing for client onboarding software
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-7 text-[#9A9AAF]">
                  Start free, then upgrade as your onboarding volume grows. Every plan includes the core workflow tools you need.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                    Start free trial
                  </Link>
                  <Link href="/features" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    Explore features
                  </Link>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── Plans with toggle ─────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16 sm:py-20">
              <PricingToggle />
            </div>
          </PageContainer>
        </section>

        {/* ── Which plan ────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Which plan should you pick?</h2>
              </FadeUp>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Solo",
                    desc: "Best when you are validating one onboarding workflow and volume is still low.",
                  },
                  {
                    name: "Team",
                    desc: "Best for agencies and service teams that need automated reminders and repeatable execution.",
                  },
                  {
                    name: "Scale",
                    desc: "Best when you manage higher onboarding volume and need stronger governance across multiple team members.",
                  },
                ].map((p, i) => (
                  <FadeUp key={p.name} delay={i * 80}>
                    <div className="card-polish rounded-2xl border border-white/[0.08] bg-[#111118] p-6">
                      <h3 className="font-serif text-xl text-[#F0F0F0]">{p.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{p.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── Comparison table ──────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Full feature comparison</h2>
              </FadeUp>
              <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="bg-[#00C2A8]/10">
                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#F0F0F0]">Feature</th>
                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#9A9AAF]">Solo</th>
                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#00C2A8]">Team</th>
                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#9A9AAF]">Scale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, i) => (
                      <tr key={row.name} className={i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#111118]"}>
                        <td className="px-5 py-3.5 text-sm text-[#9A9AAF]">{row.name}</td>
                        <td className="px-5 py-3.5 text-center">
                          <CellValue val={row.solo} />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <CellValue val={row.team} />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <CellValue val={row.scale} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Pricing FAQ</h2>
              </FadeUp>
              <div className="mt-8 max-w-2xl">
                <FaqAccordion items={pricingFaqItems} />
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="bg-[#111118]">
          <PageContainer>
            <div className="py-20 text-center">
              <FadeUp>
                <h2 className="font-serif text-4xl text-[#F0F0F0] sm:text-[48px]">Your next client deserves a better start.</h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-[#9A9AAF]">Set up your first onboarding template in under 20 minutes.</p>
                <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-8 py-4 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8] hover:shadow-[0_0_40px_rgba(0,194,168,0.45)]">
                  Start free trial — no credit card needed
                </Link>
              </FadeUp>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={pricingFaqSchema} />
    </div>
  );
}
