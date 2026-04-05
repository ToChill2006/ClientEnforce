import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle, Mail, BarChart3, Users, FileText, PenLine,
  Bell, ShieldCheck, TrendingUp, Layers, CheckCircle2, Clock,
} from "lucide-react";

import { JsonLd, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software — Stop Chasing Clients | ClientEnforce",
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
  ogImage: "https://clientenforce.com/images/og/clientenforce-homepage-og.png",
});

/* ─── Data ────────────────────────────────────────────────────────────────── */
const painPoints = [
  { icon: <Mail className="h-5 w-5" />, title: "You've sent the same request three times", body: "Documents, signatures, and approvals vanish into email threads and go unanswered." },
  { icon: <AlertCircle className="h-5 w-5" />, title: "Projects kick off with gaps", body: "A new engagement is technically started, but half the intake information is still missing." },
  { icon: <Layers className="h-5 w-5" />, title: "Status lives in three places at once", body: "Your team tracks onboarding across email threads, a spreadsheet, and someone's memory." },
  { icon: <Users className="h-5 w-5" />, title: "Clients blame delays on you", body: "A client blamed your team for delays that started because they never completed onboarding." },
] as const;

const features = [
  { icon: <FileText className="h-4 w-4" />, name: "Onboarding templates", desc: "Build once, reuse for every client" },
  { icon: <ShieldCheck className="h-4 w-4" />, name: "Required step enforcement", desc: "Intake cannot skip required steps" },
  { icon: <Bell className="h-4 w-4" />, name: "Automated reminders", desc: "Clients chased automatically" },
  { icon: <BarChart3 className="h-4 w-4" />, name: "Progress tracking", desc: "Live status across all onboardings" },
  { icon: <PenLine className="h-4 w-4" />, name: "E-signatures", desc: "Engagement letters signed in-portal" },
  { icon: <FileText className="h-4 w-4" />, name: "Document collection", desc: "Secure, structured file uploads" },
  { icon: <ShieldCheck className="h-4 w-4" />, name: "Audit trail", desc: "Timestamped evidence per client" },
  { icon: <Users className="h-4 w-4" />, name: "Team roles (RBAC)", desc: "Owner, admin, and member access" },
] as const;

const whoItsFor = [
  { icon: <TrendingUp className="h-5 w-5" />, title: "Agencies", href: "/onboarding-for-agencies", pain: "Running 10 onboardings at once with no consistent process.", solution: "One repeatable template. Live status across every active account." },
  { icon: <PenLine className="h-5 w-5" />, title: "Consultants", href: "/onboarding-for-consultants", pain: "Discovery and intake details buried in email before kickoff.", solution: "Keep intake, documents, and approvals in one portal before work begins." },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Accountants", href: "/onboarding-for-accountants", pain: "Compliance docs must be traceable — inbox collection is not enough.", solution: "Enforce required submissions. Maintain an audit-ready timeline." },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Ops teams", href: "/client-onboarding-software", pain: "Onboarding quality depends on your most organized teammate.", solution: "Standardize workflows so quality stays high as volume increases." },
] as const;

const homepageFaqItems = [
  { question: "What is client onboarding software?", answer: "Client onboarding software is a structured system that moves a new client from signed agreement to active delivery with trackable steps, document collection, e-signatures, and reminders." },
  { question: "How is ClientEnforce different from a CRM like Dubsado or HoneyBook?", answer: "ClientEnforce focuses on onboarding execution. Instead of broad CRM management, it is built to enforce completion from contract to kickoff-ready with a full audit trail and automated follow-ups." },
  { question: "Who is ClientEnforce built for?", answer: "ClientEnforce is built for agencies, consultants, accountants, and operations-led service teams that onboard clients repeatedly and need a reliable, repeatable process." },
  { question: "How long does it take to set up ClientEnforce?", answer: "Most teams can launch a first onboarding template in under 20 minutes, then refine it as they onboard real clients." },
  { question: "Does ClientEnforce replace my project management tool?", answer: "No. ClientEnforce handles onboarding from signed agreement to kickoff-ready. Your project management tool handles delivery after kickoff. The two work together." },
] as const;

/* ─── Hero product mockup ─────────────────────────────────────────────────── */
function HeroMockup() {
  const tasks = [
    { label: "Signed engagement letter", done: true },
    { label: "Proof of identity (passport)", done: true },
    { label: "Bank account details", done: true },
    { label: "Brand asset pack", done: false },
    { label: "Access to Google Analytics", done: false },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-xl)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <span className="ml-3 flex-1 rounded-full bg-[var(--color-bg-muted)] px-3 py-1 text-[10px] text-[var(--color-text-muted)]">
          app.clientenforce.com/portal/acme-agency
        </span>
      </div>

      <div className="p-5">
        {/* Client header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Onboarding</p>
            <h3 className="mt-0.5 text-base font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Acme Agency</h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600 border border-amber-200">
            2 tasks remaining
          </span>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Progress</span>
            <span className="text-xs font-bold text-[var(--color-accent)]">60%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
            <div className="h-full w-[60%] rounded-full bg-[var(--color-accent)]" />
          </div>
        </div>

        {/* Task list */}
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li key={task.label} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2.5">
              {task.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-[var(--color-border-strong)]" />
              )}
              <span className={`text-xs font-medium ${task.done ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-primary)]"}`}>
                {task.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Reminder */}
        <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] px-3 py-2.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
          <span className="text-[10px] font-semibold text-[var(--color-accent)]">Reminder sent 2 hours ago — awaiting client</span>
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
  description: "Client onboarding software that replaces email chaos with structured workflows, document collection, e-signatures, automated reminders, and audit-ready tracking.",
  url: "https://clientenforce.com",
  offers: { "@type": "AggregateOffer", priceCurrency: "GBP", lowPrice: "0", offerCount: "3" },
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
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />
      <main>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-white">
          {/* Subtle radial glow behind text */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-50"
            style={{ background: "radial-gradient(ellipse, var(--color-accent-subtle) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                For agencies · consultants · accountants
              </div>
              <h1
                className="mt-6 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-5xl lg:text-[64px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Client onboarding that enforces completion — not just tracks it
              </h1>
              <p className="mt-5 text-lg leading-7 text-[var(--color-text-secondary)]">
                Most teams lose hours every week chasing clients for documents, signatures, and approvals. ClientEnforce replaces that chaos with one structured workflow your clients actually complete.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                  Start free trial
                </Link>
                <Link href="#how-it-works" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                  See how it works
                </Link>
              </div>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                No credit card needed · Set up in 20 minutes · Automated follow-ups included · Cancel anytime
              </p>
            </div>
            <div>
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ── Social proof bar ────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Trusted by teams in marketing, accounting, and consulting
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
              {["Marketing agencies", "Accounting firms", "Consulting practices", "Operations teams", "Legal services"].map((label) => (
                <span key={label} className="text-sm font-semibold text-[var(--color-border-strong)]">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pain points ─────────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                Sound familiar?
              </h2>
              <p className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)]">
                Every service team recognizes at least one of these.
              </p>
            </FadeUp>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <FadeUp key={point.title} delay={i * 80}>
                  <article className="card-lift h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {point.icon}
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{point.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                How ClientEnforce works
              </h2>
              <p className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)]">
                Build once, send once, track in one place.
              </p>
            </FadeUp>

            <div className="relative mt-14">
              {/* Dashed connector */}
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {[
                  { step: "01", title: "Build one template per service line", body: "Define required documents, signatures, and questions. Takes under 20 minutes. Reuse it for every client.", icon: <FileText className="h-5 w-5" /> },
                  { step: "02", title: "Send one portal link when a client signs", body: "Clients see exactly what they need to do. No login required. No confusion about where to send things.", icon: <Mail className="h-5 w-5" /> },
                  { step: "03", title: "Track completion and stop chasing", body: "Automated reminders handle overdue tasks. Your dashboard shows status across every active onboarding.", icon: <BarChart3 className="h-5 w-5" /> },
                ].map((step, i) => (
                  <FadeUp key={step.step} delay={i * 100}>
                    <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                          {step.icon}
                        </div>
                        <span
                          className="text-5xl font-bold text-[var(--color-bg-muted)]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {step.step}
                        </span>
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature highlights ───────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                Everything you need to onboard clients properly
              </h2>
            </FadeUp>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <FadeUp key={f.name} delay={i * 50}>
                  <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-white text-[var(--color-accent)] shadow-[var(--shadow-xs)]">
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

        {/* ── AI automation ───────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                Intelligent onboarding automation — without the setup complexity
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-secondary)]">
                Set your rules once. ClientEnforce handles the rest — reminders, deadlines, escalations, and completion gates that run without manual input from your team.
              </p>
            </FadeUp>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Reminders run automatically", desc: "When a step is overdue, ClientEnforce follows up on a schedule you set. No manual nudging required." },
                { title: "Steps enforce themselves", desc: "Clients can't move past required items. The portal stays open until every mandatory step is done." },
                { title: "Kickoff alerts fire when intake is complete", desc: "Your team gets notified the moment a client finishes everything. No checking required." },
              ].map((item, i) => (
                <FadeUp key={item.title} delay={i * 80}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{item.desc}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Built for ────────────────────────────────────────────────────── */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]" style={{ fontFamily: "var(--font-display)" }}>
                Built for teams who onboard clients repeatedly
              </h2>
            </FadeUp>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {whoItsFor.map((seg, i) => (
                <FadeUp key={seg.title} delay={i * 80}>
                  <Link href={seg.href} className="group card-lift block h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {seg.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-[var(--color-text-primary)] transition group-hover:text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
                      {seg.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{seg.pain}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{seg.solution}</p>
                    <span className="mt-4 inline-flex items-center text-xs font-semibold text-[var(--color-accent)]">
                      Learn more →
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band ─────────────────────────────────────────────────────── */}
        <CtaBand
          heading="Your next client deserves a better start"
          subtext="Set up your first onboarding template in under 20 minutes."
          primaryLabel="Start free trial — no credit card needed"
          secondaryLabel="Explore features →"
          secondaryHref="/features"
        />

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="bg-[var(--color-bg-subtle)] py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
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
