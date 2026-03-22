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
} from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Your onboarding — Acme Corp</p>
      </div>
      <div className="space-y-2 p-4">
        {[
          { label: "Signed engagement letter", done: true },
          { label: "Upload company registration", done: false },
          { label: "Complete discovery questionnaire", done: false },
        ].map((item) => (
          <div key={item.label} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${item.done ? "bg-[#00C2A8]/5 border border-[#00C2A8]/20" : "border border-white/[0.06]"}`}>
            <div className={`h-4 w-4 rounded-full border-2 ${item.done ? "border-[#00C2A8] bg-[#00C2A8]" : "border-white/20"} flex items-center justify-center`}>
              {item.done && <span className="text-[8px] text-[#0A0A0F] font-bold">✓</span>}
            </div>
            <span className="text-xs text-[#9A9AAF]">{item.label}</span>
            <span className={`ml-auto text-xs ${item.done ? "text-[#00C2A8]" : "text-white/30"}`}>{item.done ? "Done" : "Pending"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupDocumentCollection() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Documents received</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {[
          { name: "ID verification.pdf", ok: true },
          { name: "Signed agreement.pdf", ok: true },
          { name: "Bank statement.pdf", ok: false },
        ].map((doc) => (
          <div key={doc.name} className="flex items-center gap-3 px-4 py-3">
            <div className={`h-2 w-2 rounded-full ${doc.ok ? "bg-[#00C2A8]" : "bg-[#FF4D4D]/60"}`} />
            <span className="flex-1 text-xs text-[#9A9AAF]">{doc.name}</span>
            <span className={`text-xs font-medium ${doc.ok ? "text-[#00C2A8]" : "text-[#FF4D4D]"}`}>{doc.ok ? "Received" : "Missing"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupESignatures() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Engagement letter — sign below</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0F] p-3">
          <p className="text-xs leading-5 text-[#9A9AAF]/60">I agree to the terms of this engagement as outlined in the agreement dated...</p>
        </div>
        <div className="rounded-xl border border-dashed border-[#00C2A8]/30 bg-[#00C2A8]/5 px-4 py-5 text-center">
          <p className="text-base font-serif italic text-[#00C2A8]">Sarah Johnson</p>
          <p className="mt-1 text-xs text-[#9A9AAF]">Signed 14 Mar 2025, 10:42 AM</p>
        </div>
      </div>
    </div>
  );
}

function MockupReminders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Automated reminder queue</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {[
          { client: "Acme Corp", task: "Upload company docs", due: "2 days overdue" },
          { client: "BlueSky Ltd", task: "Sign engagement letter", due: "1 day overdue" },
          { client: "Peak Media", task: "Complete questionnaire", due: "Due today" },
        ].map((r) => (
          <div key={r.client} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#F0F0F0]">{r.client}</span>
              <span className="text-xs text-[#FF4D4D]/70">{r.due}</span>
            </div>
            <p className="mt-0.5 text-xs text-[#9A9AAF]">{r.task}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] bg-[#00C2A8]/5 px-4 py-2 text-xs text-[#00C2A8]">
        Sending automatically — no manual action needed
      </div>
    </div>
  );
}

function MockupAuditTrail() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Audit trail — Acme Corp</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {[
          { event: "Document uploaded", detail: "ID verification.pdf", time: "14 Mar, 11:02" },
          { event: "Signature captured", detail: "Engagement letter", time: "14 Mar, 10:42" },
          { event: "Portal link opened", detail: "Client accessed portal", time: "14 Mar, 10:38" },
          { event: "Onboarding created", detail: "Template: Agency intake", time: "13 Mar, 09:15" },
        ].map((entry) => (
          <div key={entry.event + entry.time} className="flex items-start gap-3 px-4 py-3">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00C2A8]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#F0F0F0]">{entry.event}</span>
                <span className="shrink-0 text-xs text-[#9A9AAF]/60">{entry.time}</span>
              </div>
              <p className="text-xs text-[#9A9AAF]">{entry.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupProgressTracking() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Active onboardings</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {[
          { name: "Acme Corp", pct: 80 },
          { name: "BlueSky Ltd", pct: 40 },
          { name: "Peak Media", pct: 100 },
          { name: "Horizon Group", pct: 15 },
        ].map((o) => (
          <div key={o.name} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#F0F0F0]">{o.name}</span>
              <span className="text-xs text-[#9A9AAF]">{o.pct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06]">
              <div
                className={`h-1.5 rounded-full ${o.pct === 100 ? "bg-[#00C2A8]" : "bg-[#00C2A8]/50"}`}
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Template library</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {[
          { name: "SEO client onboarding", steps: 6 },
          { name: "Paid media onboarding", steps: 5 },
          { name: "Accounting engagement", steps: 8 },
        ].map((t) => (
          <div key={t.name} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-medium text-[#9A9AAF]">{t.name}</span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-[#9A9AAF]">{t.steps} steps</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] bg-[#00C2A8]/5 px-4 py-2 text-xs text-[#00C2A8]">
        Reuse any template — consistent every time
      </div>
    </div>
  );
}

function MockupEnforcement() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0D14]">
      <div className="border-b border-white/[0.06] bg-[#0A0A0F] px-4 py-3">
        <p className="text-xs font-medium text-[#9A9AAF]">Completion check — Acme Corp</p>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#00C2A8]/5 border border-[#00C2A8]/20 px-3 py-2.5">
          <span className="text-[#00C2A8] text-xs font-bold">✓</span>
          <span className="text-xs text-[#9A9AAF]">Engagement letter signed</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-[#00C2A8]/5 border border-[#00C2A8]/20 px-3 py-2.5">
          <span className="text-[#00C2A8] text-xs font-bold">✓</span>
          <span className="text-xs text-[#9A9AAF]">ID verification uploaded</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#FF4D4D]/20 bg-[#FF4D4D]/5 px-3 py-2.5">
          <span className="text-[#FF4D4D] text-xs font-bold">!</span>
          <span className="text-xs text-[#9A9AAF]">Bank statement — required, not submitted</span>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-center text-xs text-[#9A9AAF]">
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
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-sans">
      <PublicHeader />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 sm:py-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">Features</p>
              <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight text-[#F0F0F0] sm:text-[64px]">
                Client onboarding features built for execution
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-7 text-[#9A9AAF]">
                Every feature in ClientEnforce supports one goal: getting clients from signed agreement to kickoff-ready without inbox chaos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                  Start free trial
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                  View pricing
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── Feature grid summary ──────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[32px]">Feature highlights</h2>
              </FadeUp>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, i) => (
                  <FadeUp key={feature.name} delay={i * 50}>
                    <div className="card-polish rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">
                        {feature.icon}
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-[#F0F0F0]">{feature.name}</h3>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── Alternating feature deep-dives ───────────────────────────── */}
        {features.map((feature, i) => {
          const isEven = i % 2 === 0;
          return (
            <section
              key={feature.name}
              className={`border-b border-white/[0.06] ${isEven ? "bg-[#0A0A0F]" : "bg-[#111118]"}`}
            >
              <PageContainer>
                <div className={`grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}>
                  <FadeUp className="flex flex-col justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">
                      {feature.icon}
                    </div>
                    <h2 className="mt-4 font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">{feature.name}</h2>
                    <p className="mt-4 text-base leading-7 text-[#9A9AAF]">{feature.description}</p>
                  </FadeUp>
                  <FadeUp delay={100}>
                    {feature.mockup}
                  </FadeUp>
                </div>
              </PageContainer>
            </section>
          );
        })}

        {/* ── Why ClientEnforce ──────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16 sm:py-20">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">
                  Built for onboarding — not bolted onto a CRM
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#9A9AAF]">
                  Most tools that handle client onboarding do it as one module inside a broader platform. Dubsado is a CRM. HoneyBook is a clientflow tool. ClientEnforce was built specifically for the onboarding phase and nothing else.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/dubsado-alternative" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    Compare to Dubsado →
                  </Link>
                  <Link href="/honeybook-alternative" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    Compare to HoneyBook →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="bg-[#111118]">
          <PageContainer>
            <div className="py-20 text-center">
              <FadeUp>
                <h2 className="font-serif text-4xl text-[#F0F0F0] sm:text-[48px]">Ready to run onboarding properly?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-[#9A9AAF]">
                  Launch a repeatable onboarding workflow with one portal, automated follow-ups, and clear completion visibility.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-8 py-4 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                    Start free trial
                  </Link>
                  <Link href="/client-onboarding-software" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    Explore client onboarding software →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
