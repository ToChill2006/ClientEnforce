import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  Mail,
  BarChart3,
  Users,
  FileText,
  PenLine,
  Bell,
  ShieldCheck,
  TrendingUp,
  Layers,
} from "lucide-react";

import { JsonLd, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software | Stop Chasing Clients | ClientEnforce",
  description:
    "ClientEnforce is client onboarding software that enforces completion - not just tracks it. Built for agencies, consultants, and accountants. Start free.",
  path: "/",
  keywords: [
    "client onboarding software",
    "client onboarding automation",
    "client onboarding checklist",
    "best client onboarding tools",
    "onboarding software for agencies",
  ],
  type: "website",
});

/* ─── Data ────────────────────────────────────────────────────────────────── */
const painPoints = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "You've sent the same request three times",
    body: "Documents, signatures, and approvals vanish into email threads and go unanswered.",
  },
  {
    icon: <AlertCircle className="h-5 w-5" />,
    title: "Projects kick off with gaps",
    body: "A new engagement is technically started, but half the intake information is still missing.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Status lives in three places at once",
    body: "Your team tracks onboarding across email threads, a spreadsheet, and someone's memory.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Clients blame delays on you",
    body: "A client blamed your team for delays that started because they never completed onboarding.",
  },
] as const;

const whoItsFor = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Agencies",
    href: "/onboarding-for-agencies",
    pain: "You are onboarding multiple clients at once, and account managers keep rebuilding the same process.",
    solution: "One repeatable template with required steps and live status across every active account.",
  },
  {
    icon: <PenLine className="h-5 w-5" />,
    title: "Consultants",
    href: "/onboarding-for-consultants",
    pain: "Discovery and intake details get buried in email, then delivery starts with avoidable gaps.",
    solution: "Keep intake, documents, and approvals in one portal before kickoff can move forward.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Accountants",
    href: "/onboarding-for-accountants",
    pain: "Compliance and engagement docs must be complete and traceable, but inbox collection is unreliable.",
    solution: "Enforce required submissions and maintain an audit-ready timeline for every onboarding.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Ops teams",
    href: "/client-onboarding-software",
    pain: "You need consistent execution across people, not one-off heroics from your most organised teammate.",
    solution: "Standardise workflows so onboarding quality stays high as volume increases.",
  },
] as const;

const homepageFaqItems = [
  {
    question: "What is client onboarding software?",
    answer:
      "Client onboarding software is a structured system that moves a new client from signed agreement to active delivery with trackable steps, document collection, e-signatures, and reminders.",
  },
  {
    question: "How is ClientEnforce different from a CRM like Dubsado or HoneyBook?",
    answer:
      "ClientEnforce focuses on onboarding execution. Instead of broad CRM management, it is built to enforce completion from contract to kickoff-ready with a full audit trail and automated follow-ups.",
  },
  {
    question: "Who is ClientEnforce built for?",
    answer:
      "ClientEnforce is built for agencies, consultants, accountants, and operations-led service teams that onboard clients repeatedly and need a reliable, repeatable process.",
  },
  {
    question: "How long does it take to set up ClientEnforce?",
    answer:
      "Most teams can launch a first onboarding template in under 20 minutes, then refine it as they onboard real clients.",
  },
  {
    question: "Does ClientEnforce replace my project management tool?",
    answer:
      "No. ClientEnforce handles onboarding from signed agreement to kickoff-ready. Your project management tool handles delivery after kickoff. The two work together.",
  },
] as const;

/* ─── Hero dashboard mockup ───────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111118] shadow-2xl">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0D0D14] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-white/10" />
        <span className="h-3 w-3 rounded-full bg-white/10" />
        <span className="h-3 w-3 rounded-full bg-white/10" />
        <span className="ml-3 text-xs text-[#9A9AAF]">ClientEnforce — Active onboardings</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active", value: "12" },
            { label: "Complete", value: "8" },
            { label: "Overdue", value: "3" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-[#0D0D14] px-3 py-3 text-center">
              <p className="font-serif text-2xl text-[#F0F0F0]">{s.value}</p>
              <p className="mt-0.5 text-xs text-[#9A9AAF]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Client rows */}
        {[
          { name: "Acme Agency", pct: 80, status: "In progress" },
          { name: "BlueSky Consulting", pct: 100, status: "Complete", complete: true },
          { name: "Peak Media Group", pct: 35, status: "Overdue", warn: true },
        ].map((client) => (
          <div key={client.name} className="rounded-xl border border-white/[0.06] bg-[#0D0D14] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#F0F0F0]">{client.name}</span>
              <span
                className={[
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  client.complete
                    ? "bg-[#00C2A8]/15 text-[#00C2A8]"
                    : client.warn
                    ? "bg-[#FF4D4D]/10 text-[#FF4D4D]"
                    : "bg-white/5 text-[#9A9AAF]",
                ].join(" ")}
              >
                {client.status}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-1.5 rounded-full transition-all ${client.complete ? "bg-[#00C2A8]" : client.warn ? "bg-[#FF4D4D]/60" : "bg-[#00C2A8]/70"}`}
                style={{ width: `${client.pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-right text-xs text-[#9A9AAF]">{client.pct}% complete</p>
          </div>
        ))}

        {/* Reminder queue */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0D0D14] px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-[#00C2A8]" />
            <span className="text-xs font-medium text-[#9A9AAF]">3 automated reminders queued for today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── JSON-LD ─────────────────────────────────────────────────────────────── */
const homepageSoftwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Client onboarding software that replaces email chaos with structured workflows, document collection, e-signatures, automated reminders, and audit-ready tracking.",
  url: "https://clientenforce.com",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "0",
    offerCount: "3",
  },
};

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-sans">
      <PublicHeader />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[calc(100vh-65px)] items-center overflow-hidden border-b border-white/[0.06]">
          {/* Animated gradient mesh */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute -top-1/3 left-1/4 h-[600px] w-[600px] rounded-full opacity-60"
              style={{
                background: "radial-gradient(circle, rgba(0,194,168,0.15) 0%, transparent 70%)",
                animation: "mesh-drift-a 14s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-40"
              style={{
                background: "radial-gradient(circle, rgba(80,80,200,0.12) 0%, transparent 70%)",
                animation: "mesh-drift-b 18s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(0,194,168,0.08) 0%, transparent 70%)",
                animation: "mesh-drift-a 22s ease-in-out infinite reverse",
              }}
            />
          </div>

          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00C2A8]/20 bg-[#00C2A8]/8 px-3 py-1.5 text-xs font-medium text-[#00C2A8]">
                Client onboarding software for agencies, consultants &amp; accountants
              </div>

              <h1 className="mt-6 font-serif text-5xl leading-[1.1] tracking-tight text-[#F0F0F0] sm:text-6xl lg:text-[72px]">
                Client onboarding that enforces completion — not just tracks it
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-7 text-[#9A9AAF]">
                Most teams lose hours every week chasing clients for documents, signatures, and approvals over email. ClientEnforce replaces that chaos with one structured workflow your clients actually complete.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8] hover:shadow-[0_0_36px_rgba(0,194,168,0.45)]"
                >
                  Start free trial
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10"
                >
                  See how it works
                </Link>
              </div>

              <p className="mt-4 text-xs text-[#9A9AAF]">Free to start · No credit card required</p>
            </div>

            <div>
              <DashboardMockup />
            </div>
          </div>
        </section>

        {/* ── Trust strip ───────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <div className="mx-auto max-w-[1200px] px-4 py-4 text-center text-sm text-[#9A9AAF] sm:px-6 lg:px-8">
            Used by teams in marketing, accounting, and consulting to run cleaner client onboarding.
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              {["Agencies", "Consultants", "Accountants", "Ops teams"].map((label) => (
                <span key={label} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs text-[#9A9AAF]">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sound familiar? ────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-serif text-4xl tracking-tight text-[#F0F0F0] sm:text-[48px]">Sound familiar?</h2>
              <p className="mt-3 max-w-2xl text-base text-[#9A9AAF]">
                Every service team recognises at least one of these.
              </p>
            </FadeUp>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <FadeUp key={point.title} delay={i * 80}>
                  <article className="card-polish h-full rounded-2xl border border-white/[0.08] bg-[#111118] p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">
                      {point.icon}
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#F0F0F0]">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{point.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section id="how-it-works" className="border-b border-white/[0.06] bg-[#111118]">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-serif text-4xl tracking-tight text-[#F0F0F0] sm:text-[48px]">How ClientEnforce works</h2>
              <p className="mt-3 max-w-2xl text-base text-[#9A9AAF]">
                Build once, send once, track in one place — that is how client onboarding automation should work.
              </p>
            </FadeUp>

            <div className="relative mt-12">
              {/* Dashed connector line (desktop only) */}
              <div className="absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-white/[0.12] lg:block" />

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Build one template per service line",
                    body: "Define required documents, signatures, and questions. Takes under 20 minutes. Reuse it for every client.",
                    icon: <FileText className="h-5 w-5" />,
                  },
                  {
                    step: "02",
                    title: "Send one portal link when a client signs",
                    body: "Clients see exactly what they need to do. No login required. No confusion about where to send things.",
                    icon: <Mail className="h-5 w-5" />,
                  },
                  {
                    step: "03",
                    title: "Track completion and stop chasing",
                    body: "Automated reminders handle overdue tasks. Your dashboard shows status across every active onboarding.",
                    icon: <BarChart3 className="h-5 w-5" />,
                  },
                ].map((step, i) => (
                  <FadeUp key={step.step} delay={i * 100}>
                    <article className="card-polish rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">
                          {step.icon}
                        </div>
                        <span className="font-serif text-4xl text-white/10">{step.step}</span>
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#F0F0F0]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{step.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Built for teams ───────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-serif text-4xl tracking-tight text-[#F0F0F0] sm:text-[48px]">
                Built for teams who onboard clients repeatedly
              </h2>
            </FadeUp>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {whoItsFor.map((segment, i) => (
                <FadeUp key={segment.title} delay={i * 80}>
                  <Link href={segment.href} className="group card-polish block h-full rounded-2xl border border-white/[0.08] bg-[#111118] p-6 transition hover:border-[#00C2A8]/30">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">
                      {segment.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[#F0F0F0] group-hover:text-[#00C2A8] transition">{segment.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{segment.pain}</p>
                    <p className="mt-3 text-sm leading-6 text-[#F0F0F0]">{segment.solution}</p>
                    <span className="mt-4 inline-flex items-center text-xs font-medium text-[#00C2A8] transition group-hover:gap-1">
                      Learn more →
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-serif text-4xl tracking-tight text-[#F0F0F0] sm:text-[48px]">
                Join the teams already running cleaner onboarding
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-[#9A9AAF]">
                Set up your first onboarding template in under 20 minutes. Your next client deserves a better start.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-8 py-4 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8] hover:shadow-[0_0_40px_rgba(0,194,168,0.45)]"
                >
                  Start free trial — no credit card needed
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10"
                >
                  Explore features →
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="bg-[#0A0A0F]">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-serif text-4xl tracking-tight text-[#F0F0F0] sm:text-[48px]">Frequently asked questions</h2>
            </FadeUp>
            <div className="mt-10 max-w-2xl">
              <FaqAccordion items={homepageFaqItems} />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={homepageSoftwareSchema} />
      <JsonLd data={homepageFaqSchema} />
    </div>
  );
}
