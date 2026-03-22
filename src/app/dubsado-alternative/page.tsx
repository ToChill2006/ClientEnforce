import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Best Dubsado Alternative for Agencies & Consultants | ClientEnforce",
  description:
    "Looking for a Dubsado alternative built for teams, not just freelancers? ClientEnforce focuses entirely on client onboarding — structured workflows, enforced completion, full audit trail.",
  path: "/dubsado-alternative",
  keywords: [
    "Dubsado alternative",
    "client onboarding software",
    "client onboarding automation",
    "onboarding software for agencies",
    "client onboarding checklist",
  ],
  type: "website",
});

const comparisonRows = [
  ["Primary focus", "Full CRM — invoicing, proposals, contracts, scheduling", "Client onboarding execution only"],
  ["Best for", "Solo freelancers and creative professionals", "Agencies, consultants, accountants — teams of 5–50"],
  ["Onboarding depth", "Module within a broader CRM", "Entire product built around onboarding completion"],
  ["Automated reminders", "Available", "Core feature — clients get nudged until tasks are done"],
  ["Audit trail", "Basic activity log", "Full timestamped evidence trail per client"],
  ["Compliance-ready export", "Not purpose-built", "PDF evidence pack per onboarding"],
  ["Client portal", "Yes — branded", "Yes — no client login required"],
  ["Multiple onboardings at once", "Manageable for solo use", "Built for volume — dashboard view across all clients"],
  ["Required step enforcement", "Flexible", "Enforced — kickoff cannot happen with incomplete intake"],
  ["Setup time", "Hours to days — complex workflow configuration", "Under 20 minutes — first template live same day"],
  ["Invoicing and payments", "Yes — built in", "No — not a CRM"],
  ["Proposals and contracts", "Yes", "E-signatures on onboarding documents only"],
] as const;

export default function DubsadoAlternativePage() {
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
                <span className="text-[#F0F0F0]">Dubsado Alternative</span>
              </div>

              <div className="mt-6 inline-flex items-center rounded-full border border-[#00C2A8]/20 bg-[#00C2A8]/8 px-3 py-1.5 text-xs font-medium text-[#00C2A8]">
                Honest comparison
              </div>

              <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight text-[#F0F0F0] sm:text-[64px]">
                The Dubsado alternative built for agencies — not just freelancers
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-7 text-[#9A9AAF]">
                Dubsado is a solid tool. But if you run an agency or a service team and your main pain is chaotic client onboarding, you need something more focused. ClientEnforce does one thing: gets clients through intake cleanly, every time.
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
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Dubsado is great — for the right person</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-[#9A9AAF]">
                  <p>Dubsado built its reputation with solo freelancers and creative professionals. Photographers, designers, consultants running one-person businesses. For them, it works well: proposals, contracts, invoicing, scheduling, and basic client management all in one place.</p>
                  <p>The problem starts when teams try to use it for structured, repeatable onboarding at volume. Dubsado was not designed for an agency account manager running eight client onboardings simultaneously. It was not built with compliance audit trails in mind. And the setup complexity becomes a bottleneck when your ops team needs to run a consistent process across every new client.</p>
                  <p className="text-[#F0F0F0] font-medium">That is the gap ClientEnforce fills.</p>
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
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">CRM vs dedicated onboarding software</h2>
                <p className="mt-3 text-base text-[#9A9AAF]">Here is what the difference looks like in practice.</p>
              </FadeUp>
              <FadeUp delay={100}>
                <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.08]">
                  <table className="w-full min-w-[700px] text-sm">
                    <thead>
                      <tr className="bg-[#00C2A8]/10">
                        <th className="px-5 py-4 text-left text-sm font-semibold text-[#F0F0F0]" />
                        <th className="px-5 py-4 text-left text-sm font-semibold text-[#9A9AAF]">Dubsado</th>
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
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Honestly — which one is right for you?</h2>
              </FadeUp>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <FadeUp>
                  <div className="h-full rounded-2xl border-l-2 border-[#9A9AAF]/40 bg-[#0A0A0F] p-6 border border-white/[0.08]">
                    <h3 className="font-serif text-xl text-[#F0F0F0]">Choose Dubsado if:</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        "You are a solo freelancer or creative professional",
                        "You need invoicing, payment processing, and proposals all in one place",
                        "Your client volume is low and you manage most things yourself",
                        "You want an all-in-one business management system",
                        "You are in photography, event management, or a similar creative field",
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
                  <div className="h-full rounded-2xl border-l-2 border-[#00C2A8] bg-[#0A0A0F] p-6 border border-white/[0.08]">
                    <h3 className="font-serif text-xl text-[#00C2A8]">Choose ClientEnforce if:</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        "You run an agency or service team with multiple people involved in onboarding",
                        "You onboard three or more clients per month and need a consistent, repeatable process",
                        "Your main pain is chasing clients for documents and signatures — not managing invoices",
                        "You need visibility across multiple onboardings simultaneously",
                        "You work in a compliance-sensitive environment and need an auditable intake trail",
                        "You have tried using Dubsado for onboarding and found the setup too complex",
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
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">How ClientEnforce handles onboarding — in three steps</h2>
              </FadeUp>
              <div className="relative mt-10">
                <div className="absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-white/[0.10] lg:block" />
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { step: "01", icon: <FileText className="h-5 w-5" />, title: "Build a template for each service line", body: "Map your onboarding steps once. Define which documents are required, what needs signing, what information you need, and in what order. Takes under 20 minutes." },
                    { step: "02", icon: <Mail className="h-5 w-5" />, title: "Send the portal link when a client signs", body: "One link. The client sees exactly what they need to do, in order. No login required. No confusion about where to send things." },
                    { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Watch completion — your team stops chasing", body: "Clients get automated reminders when tasks are overdue. Your dashboard shows completion across every active onboarding. Kickoff happens when intake is actually done." },
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

        {/* ── Pain points ───────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">If you have outgrown Dubsado for onboarding, this probably sounds familiar</h2>
                <ul className="mt-6 space-y-3">
                  {[
                    "You have customised Dubsado workflows extensively and they still do not enforce what clients actually need to do",
                    "Your account managers are still sending follow-up emails manually because the automations are not quite right",
                    "You cannot get a clear view of which clients are onboarding-complete and which are still missing information",
                    "A client started a project before intake was finished and it caused problems",
                    "You need a proper audit trail for compliance reasons and Dubsado's activity log is not sufficient",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#9A9AAF]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00C2A8]/60" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base text-[#9A9AAF]">
                  ClientEnforce was built specifically for these situations — not as a Dubsado replacement, but as a purpose-built solution for the onboarding phase that Dubsado was never designed to own.
                </p>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 text-center">
              <FadeUp>
                <h2 className="font-serif text-4xl text-[#F0F0F0] sm:text-[48px]">Ready to run onboarding properly?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-[#9A9AAF]">
                  Your next client deserves a cleaner start. Build your first onboarding template in under 20 minutes — no Dubsado migration needed.
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
                  { href: "/onboarding-for-agencies", label: "For agencies" },
                  { href: "/honeybook-alternative", label: "HoneyBook alternative" },
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
