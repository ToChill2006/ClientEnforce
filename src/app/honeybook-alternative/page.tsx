import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best HoneyBook Alternative for Agencies & Service Teams | ClientEnforce",
  description:
    "Need a HoneyBook alternative with deeper onboarding? ClientEnforce is purpose-built for teams who onboard clients at volume — enforced completion, audit trail, zero inbox chasing.",
  path: "/honeybook-alternative",
  keywords: [
    "HoneyBook alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for accountants",
    "client onboarding checklist",
  ],
  type: "website",
});

const comparisonRows = [
  ["Primary focus", "Full clientflow — leads, proposals, contracts, payments, projects", "Client onboarding execution only"],
  ["Best for", "Solo creative professionals and independent business owners", "Agencies, consultants, accountants — teams of 5–50"],
  ["Onboarding depth", "Part of broader client management flow", "Entire product built around onboarding completion"],
  ["Required step enforcement", "Flexible — clients can progress without completing everything", "Enforced — required steps must be completed"],
  ["Automated reminders", "Available", "Core feature — automated until tasks are done"],
  ["Audit trail", "Activity log", "Full timestamped evidence trail per client"],
  ["Compliance-ready export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Multi-client dashboard", "Project view per client", "Cross-portfolio completion view"],
  ["Client portal", "Yes — branded", "Yes — no client login required"],
  ["Invoicing and payments", "Yes — built in", "No — not a CRM"],
  ["AI features", "HoneyBook AI for lead capture and follow-up", "Automated completion enforcement"],
  ["Setup time", "Medium — requires configuration", "Under 20 minutes — first template live same day"],
] as const;

export default function HoneyBookAlternativePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-sans">
      <PublicHeader />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 sm:py-24">
              <div className="text-xs text-[#9A9AAF]">
                <Link href="/" className="transition hover:text-[#F0F0F0]">Home</Link>
                <span className="mx-1.5 text-white/20">/</span>
                <span>Alternatives</span>
                <span className="mx-1.5 text-white/20">/</span>
                <span className="text-[#F0F0F0]">HoneyBook Alternative</span>
              </div>

              <div className="mt-6 inline-flex items-center rounded-full border border-[#00C2A8]/20 bg-[#00C2A8]/8 px-3 py-1.5 text-xs font-medium text-[#00C2A8]">
                Honest comparison
              </div>

              <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight text-[#F0F0F0] sm:text-[64px]">
                The HoneyBook alternative for teams that have outgrown freelancer tools
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-7 text-[#9A9AAF]">
                HoneyBook works beautifully for independent creatives managing their whole business in one place. But if you run a team, onboard multiple clients a month, and need structured intake with an audit trail — you need something built for that job specifically.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                  Start free trial
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                  See how it works
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── Context ───────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">HoneyBook is excellent — for independent business owners</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-[#9A9AAF]">
                  <p>HoneyBook earned its loyal following by solving a real problem for solo creative professionals. Photographers, event planners, coaches, designers — people who need to manage enquiries, send proposals, collect contracts, take payments, and keep client comms organised, all without a dedicated ops person.</p>
                  <p>For that user, HoneyBook is genuinely good. It has a clean interface, solid automation, and a growing AI feature set. It is one of the best tools in its category.</p>
                  <p>The challenge comes when a team tries to use it as a structured onboarding system. HoneyBook's clientflow model is built around the solo operator managing one client relationship at a time. It was not designed for an operations manager tracking eight active onboardings simultaneously. It does not enforce required completion. And there is no compliance-grade audit trail of what was submitted, when, and by whom.</p>
                  <p className="text-[#F0F0F0] font-medium">For agencies, consultancies, accounting firms, and ops-led service teams, those gaps matter.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── Comparison table ──────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Clientflow tool vs dedicated onboarding software</h2>
                <p className="mt-3 text-base text-[#9A9AAF]">A practical comparison of where each tool is designed to operate.</p>
              </FadeUp>
              <FadeUp delay={100}>
                <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.08]">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="bg-[#00C2A8]/10">
                        <th className="px-5 py-4 text-left text-sm font-semibold text-[#F0F0F0]" />
                        <th className="px-5 py-4 text-left text-sm font-semibold text-[#9A9AAF]">HoneyBook</th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-[#00C2A8]">ClientEnforce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, i) => (
                        <tr key={row[0]} className={i % 2 === 0 ? "bg-[#111118]" : "bg-[#0A0A0F]"}>
                          <td className="px-5 py-3.5 text-sm font-medium text-[#F0F0F0]">{row[0]}</td>
                          <td className="px-5 py-3.5 text-sm text-[#9A9AAF]">{row[1]}</td>
                          <td className="px-5 py-3.5 text-sm text-[#9A9AAF]">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── Choose X if ───────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Which tool is right for your situation?</h2>
              </FadeUp>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <FadeUp>
                  <div className="h-full rounded-2xl border border-white/[0.08] border-l-2 border-l-[#9A9AAF]/40 bg-[#0A0A0F] p-6">
                    <h3 className="font-serif text-xl text-[#F0F0F0]">Choose HoneyBook if:</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        "You are an independent business owner or solo creative professional",
                        "You need to manage leads, proposals, contracts, payments, and client comms in one place",
                        "You are in photography, event planning, coaching, or a similar creative service",
                        "Your client volume is low enough to manage individually",
                        "You want AI-assisted lead capture and follow-up",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#9A9AAF]">
                          <span className="mt-0.5 text-white/30">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
                <FadeUp delay={80}>
                  <div className="h-full rounded-2xl border border-white/[0.08] border-l-2 border-l-[#00C2A8] bg-[#0A0A0F] p-6">
                    <h3 className="font-serif text-xl text-[#00C2A8]">Choose ClientEnforce if:</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        "You run a team — agency, consultancy, accounting firm, or ops-led service business",
                        "You onboard three or more clients per month and the process needs to be consistent every time",
                        "Clients regularly start projects before intake is complete and it causes problems",
                        "You need a real audit trail — not an activity log — for compliance or accountability",
                        "Your account managers are still doing manual follow-up despite having software",
                        "You want to separate your onboarding process from your CRM and manage it properly",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-[#9A9AAF]">
                          <span className="mt-0.5 text-[#00C2A8]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">What structured onboarding looks like in ClientEnforce</h2>
              </FadeUp>
              <div className="relative mt-10">
                <div className="absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-white/[0.10] lg:block" />
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { step: "01", icon: <FileText className="h-5 w-5" />, title: "One template per service line", body: "Build a reusable onboarding template that defines exactly what every new client needs to complete — documents, signatures, information, approvals. Build it once, use it every time." },
                    { step: "02", icon: <Mail className="h-5 w-5" />, title: "One portal link per client", body: "When a client signs, send them a single portal link. They see their onboarding steps clearly. No login required. No confusion. No 'where do I send this?'" },
                    { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Automated follow-up until it is done", body: "Clients receive automated reminders when tasks are overdue. Your dashboard shows completion status across every active onboarding at a glance." },
                  ].map((step, i) => (
                    <FadeUp key={step.step} delay={i * 100}>
                      <article className="card-polish rounded-2xl border border-white/[0.08] bg-[#111118] p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">{step.icon}</div>
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
          </PageContainer>
        </section>

        {/* ── Compliance note ───────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">A note for accountants, legal firms, and compliance-sensitive businesses</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-[#9A9AAF]">
                  <p>If you work in a regulated environment — accountancy, legal, financial services, HR consultancy — client onboarding is not just an operational task. It is a compliance requirement.</p>
                  <p>AML checks, KYC documentation, engagement letters, proof of identity — these need to be collected correctly, stored securely, and traceable if a regulator or internal audit asks for them. An email thread and an activity log are not sufficient for that purpose.</p>
                  <p>ClientEnforce maintains a full timestamped audit trail of every step in the onboarding process. Every document received, every signature collected, every required step completed — with a date, time, and clear record of who submitted what. That record is exportable as a PDF evidence pack at any point.</p>
                  <p className="text-[#F0F0F0] font-medium">This is not a feature HoneyBook was built to provide. For teams with compliance obligations, it is not optional.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 text-center">
              <FadeUp>
                <h2 className="font-serif text-4xl text-[#F0F0F0] sm:text-[48px]">Built for the teams HoneyBook was not designed for</h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-[#9A9AAF]">
                  If you have outgrown freelancer tools and need client onboarding that enforces completion, scales across a team, and leaves a proper audit trail — try ClientEnforce.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-8 py-4 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                    Start free trial — no credit card needed
                  </Link>
                  <Link href="/features" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    See full features →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── Related links ─────────────────────────────────────────────── */}
        <section className="bg-[#111118]">
          <PageContainer>
            <div className="py-12">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#9A9AAF]">Related</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { href: "/client-onboarding-software", label: "Client onboarding software" },
                  { href: "/client-onboarding-automation", label: "Onboarding automation" },
                  { href: "/onboarding-for-accountants", label: "For accountants" },
                  { href: "/dubsado-alternative", label: "Dubsado alternative" },
                  { href: "/client-onboarding-checklist", label: "Onboarding checklist" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="card-polish rounded-xl border border-white/[0.08] bg-[#0A0A0F] px-4 py-3 text-sm text-[#9A9AAF] transition hover:border-white/20 hover:text-[#F0F0F0]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
