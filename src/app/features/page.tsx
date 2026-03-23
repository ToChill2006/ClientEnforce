import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  FolderUp,
  PenLine,
  Bell,
  ShieldCheck,
  BarChart3,
  LayoutTemplate,
  Lock,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "ClientEnforce Features | Client Onboarding Automation Tools",
  description:
    "Document collection, e-signatures, automated reminders, audit trail, and client portal - every feature ClientEnforce has is built for one job: getting clients through onboarding completely.",
  path: "/features",
  keywords: [
    "client onboarding software features",
    "client onboarding automation tools",
    "client onboarding workflow software",
  ],
  type: "website",
});

/* ─── Mockup components ───────────────────────────────────────────────────── */
function MockupClientPortal() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Your onboarding — Acme Corp</p>
      </div>
      <div className="space-y-2 p-4">
        {[
          { label: "Signed engagement letter", done: true },
          { label: "Upload company registration", done: false },
          { label: "Complete discovery questionnaire", done: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 ${item.done ? "bg-[var(--color-accent-subtle)] border border-[var(--color-accent-subtle)]" : "border border-[var(--color-border)]"}`}
          >
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-[var(--color-border-strong)]" />
            )}
            <span className="text-xs text-[var(--color-text-secondary)]">{item.label}</span>
            <span className={`ml-auto text-xs font-medium ${item.done ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}>
              {item.done ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupDocumentCollection() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Documents received</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { name: "ID verification.pdf", ok: true },
          { name: "Signed agreement.pdf", ok: true },
          { name: "Bank statement.pdf", ok: false },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 px-4 py-3">
            <div className={`h-2 w-2 shrink-0 rounded-full ${doc.ok ? "bg-[var(--color-success)]" : "bg-red-400"}`} />
            <span className="flex-1 text-xs text-[var(--color-text-secondary)]">{doc.name}</span>
            <span className={`text-xs font-semibold ${doc.ok ? "text-[var(--color-success)]" : "text-red-500"}`}>
              {doc.ok ? "Received" : "Missing"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupESignatures() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Engagement letter — sign below</p>
      </div>
      <div className="space-y-3 p-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
          <p className="text-xs leading-5 text-[var(--color-text-muted)]">I agree to the terms of this engagement as outlined in the agreement dated...</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-5 text-center">
          <p className="text-base italic text-[var(--color-accent)]" style={{ fontFamily: "Georgia, serif" }}>Sarah Johnson</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Signed 14 Mar 2025, 10:42 AM</p>
        </div>
      </div>
    </div>
  );
}

function MockupReminders() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Automated reminder queue</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { client: "Acme Corp", task: "Upload company docs", due: "2 days overdue" },
          { client: "BlueSky Ltd", task: "Sign engagement letter", due: "1 day overdue" },
          { client: "Peak Media", task: "Complete questionnaire", due: "Due today" },
        ].map((r) => (
          <div key={r.client} className="flex items-center gap-3 px-4 py-3">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-[var(--color-text-primary)]">{r.client}</span>
                <span className="shrink-0 text-xs text-red-500">{r.due}</span>
              </div>
              <p className="truncate text-xs text-[var(--color-text-muted)]">{r.task}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-accent-subtle)] px-4 py-2 text-xs font-medium text-[var(--color-accent)]">
        Sending automatically — no manual action needed
      </div>
    </div>
  );
}

function MockupAuditTrail() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Audit trail — Acme Corp</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { event: "Document uploaded", detail: "ID verification.pdf", time: "14 Mar, 11:02" },
          { event: "Signature captured", detail: "Engagement letter", time: "14 Mar, 10:42" },
          { event: "Portal link opened", detail: "Client accessed portal", time: "14 Mar, 10:38" },
          { event: "Onboarding created", detail: "Template: Agency intake", time: "13 Mar, 09:15" },
        ].map((entry) => (
          <div key={entry.event + entry.time} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[var(--color-text-primary)]">{entry.event}</span>
                <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{entry.time}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">{entry.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupProgressTracking() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Active onboardings</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { name: "Acme Corp", pct: 80 },
          { name: "BlueSky Ltd", pct: 40 },
          { name: "Peak Media", pct: 100 },
          { name: "Horizon Group", pct: 15 },
        ].map((o) => (
          <div key={o.name} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-primary)]">{o.name}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{o.pct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
              <div
                className={`h-1.5 rounded-full ${o.pct === 100 ? "bg-[var(--color-success)]" : "bg-[var(--color-accent)]"}`}
                style={{ width: `${o.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupTemplates() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Template library</p>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { name: "SEO client onboarding", steps: 6 },
          { name: "Paid media onboarding", steps: 5 },
          { name: "Accounting engagement", steps: 8 },
        ].map((t) => (
          <div key={t.name} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{t.name}</span>
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-0.5 text-xs text-[var(--color-text-muted)]">
              {t.steps} steps
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-accent-subtle)] px-4 py-2 text-xs font-medium text-[var(--color-accent)]">
        Reuse any template — consistent every time
      </div>
    </div>
  );
}

function MockupEnforcement() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
        <p className="text-xs font-semibold text-[var(--color-text-muted)]">Completion check — Acme Corp</p>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">Engagement letter signed</span>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">ID verification uploaded</span>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2.5">
          <Circle className="h-4 w-4 shrink-0 text-red-400" />
          <span className="text-xs text-[var(--color-text-secondary)]">Bank statement — required, not submitted</span>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2.5 text-center text-xs text-[var(--color-text-muted)]">
          Kickoff blocked until all required steps are complete
        </div>
      </div>
    </div>
  );
}

/* ─── Feature data ────────────────────────────────────────────────────────── */
const features = [
  {
    icon: <Globe className="h-5 w-5" />,
    name: "Client portal",
    description:
      "Clients see exactly what they need to do — in one link. No login required. No confusion about where to send things.",
    mockup: <MockupClientPortal />,
  },
  {
    icon: <FolderUp className="h-5 w-5" />,
    name: "Document collection",
    description:
      "Required files get submitted in the portal, not scattered across email threads. You see what has arrived and what is still missing.",
    mockup: <MockupDocumentCollection />,
  },
  {
    icon: <PenLine className="h-5 w-5" />,
    name: "E-signatures",
    description:
      "Engagement letters and agreements get signed inside the onboarding flow — no separate DocuSign account needed.",
    mockup: <MockupESignatures />,
  },
  {
    icon: <Bell className="h-5 w-5" />,
    name: "Automated reminders",
    description:
      "When a client's task is overdue, the system nudges them automatically. Your team stops being the reminder service.",
    mockup: <MockupReminders />,
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    name: "Audit trail",
    description:
      "Every document received, every step completed, every signature collected — timestamped and exportable. Full evidence trail per client.",
    mockup: <MockupAuditTrail />,
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    name: "Progress tracking",
    description:
      "One dashboard. Every active onboarding. See instantly which clients are on track and which are stuck — without asking anyone.",
    mockup: <MockupProgressTracking />,
  },
  {
    icon: <LayoutTemplate className="h-5 w-5" />,
    name: "Template library",
    description:
      "Build one onboarding template per service line. Reuse it every time. Consistency without the manual setup.",
    mockup: <MockupTemplates />,
  },
  {
    icon: <Lock className="h-5 w-5" />,
    name: "Completion enforcement",
    description:
      "Required steps are required — clients cannot skip them. Kickoff happens when intake is actually done, not assumed to be.",
    mockup: <MockupEnforcement />,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Features</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[56px]" style={{ fontFamily: "var(--font-display)" }}>
              Client onboarding features built for execution
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--color-text-secondary)]">
              Every feature in ClientEnforce supports one goal: getting clients from signed agreement to kickoff-ready without inbox chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]">
                Start free trial
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]">
                View pricing
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Feature highlights grid */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Feature highlights
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <FadeUp key={feature.name} delay={i * 50}>
                  <div className="card-lift rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {feature.icon}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[var(--color-text-primary)]">{feature.name}</h3>
                  </div>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Alternating feature deep-dives */}
        {features.map((feature, i) => {
          const isEven = i % 2 === 0;
          return (
            <section
              key={feature.name}
              className={`border-b border-[var(--color-border)] py-16 sm:py-20 ${isEven ? "bg-white" : "bg-[var(--color-bg-subtle)]"}`}
            >
              <PageContainer>
                <div className={`grid gap-12 lg:grid-cols-2 lg:items-center ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}>
                  <FadeUp className="flex flex-col justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {feature.icon}
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-[var(--color-text-primary)] sm:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
                      {feature.name}
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">{feature.description}</p>
                  </FadeUp>
                  <FadeUp delay={100}>
                    {feature.mockup}
                  </FadeUp>
                </div>
              </PageContainer>
            </section>
          );
        })}

        {/* Why ClientEnforce */}
        <section className="border-b border-[var(--color-border)] bg-white py-16 sm:py-20">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
                Built for onboarding — not bolted onto a CRM
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most tools that handle client onboarding do it as one module inside a broader platform. Dubsado is a CRM. HoneyBook is a clientflow tool. ClientEnforce was built specifically for the onboarding phase and nothing else.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dubsado-alternative" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]">
                  Compare to Dubsado →
                </Link>
                <Link href="/honeybook-alternative" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]">
                  Compare to HoneyBook →
                </Link>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="Ready to run onboarding properly?"
          subtext="Launch a repeatable onboarding workflow with one portal, automated follow-ups, and clear completion visibility."
          primaryLabel="Start free trial"
          secondaryLabel="Explore client onboarding software →"
          secondaryHref="/client-onboarding-software"
        />
      </main>

      <PublicFooter />
    </div>
  );
}
