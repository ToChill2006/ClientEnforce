import type { Metadata } from "next";
import Link from "next/link";
import { Mail, AlertCircle, FileText, Users, BarChart3, Bell, ShieldCheck, LayoutTemplate } from "lucide-react";

import { JsonLd, PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Agencies | Built for Volume | ClientEnforce",
  description:
    "Client onboarding software built for digital agencies. Run consistent onboarding across every client, automate follow-ups, and start projects with complete intake - every time.",
  path: "/onboarding-for-agencies",
  keywords: [
    "onboarding software for agencies",
    "agency client onboarding software",
    "client onboarding workflow software",
    "client onboarding automation",
    "client onboarding software",
  ],
  type: "website",
});

const painPoints = [
  { icon: <Mail className="h-5 w-5" />, title: "Chasing documents over email", body: "Your account manager is chasing four different clients for documents simultaneously — and losing track of what has arrived." },
  { icon: <AlertCircle className="h-5 w-5" />, title: "Near-complete but blocked", body: "One client is 80% through intake but missing a single file, and nobody knows unless someone manually checks." },
  { icon: <FileText className="h-5 w-5" />, title: "Kickoffs with missing assets", body: "A project kicked off last week but three required assets still have not arrived, and they are now your problem." },
  { icon: <Users className="h-5 w-5" />, title: "No documented process", body: "A new account manager joins and has no documented process to follow, so onboarding changes every time." },
] as const;

const faqItems = [
  { question: "Why do agencies need dedicated onboarding software?", answer: "Agencies often onboard multiple clients at once. Dedicated onboarding software keeps required steps, documents, and approvals in one enforceable workflow so kickoff quality stays consistent." },
  { question: "How many onboarding templates should an agency start with?", answer: "Most agencies start with one template per core service line. That keeps setup simple while still standardising onboarding across account managers." },
  { question: "Can account managers see all active onboardings in one place?", answer: "Yes. ClientEnforce gives visibility across active onboardings so teams can spot blockers and overdue tasks quickly." },
  { question: "What if a client does not complete tasks on time?", answer: "Automated reminders and escalation rules handle overdue tasks so account managers do not have to manually chase every item." },
  { question: "How fast can an agency launch?", answer: "Most teams can launch their first onboarding template in under 20 minutes and refine it during the first week of live usage." },
] as const;

const agencyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function OnboardingForAgenciesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0F0] font-sans">
      <PublicHeader />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-20 sm:py-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#00C2A8]">Onboarding software for agencies</p>
              <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight text-[#F0F0F0] sm:text-[64px]">
                Client onboarding software for agencies — built for teams that onboard at volume
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-7 text-[#9A9AAF]">
                Most agency onboarding problems are not people problems — they are process problems. When you are running 5, 10, or 20 client onboardings simultaneously, the manual approach collapses and the client experience suffers before the work even begins.
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#9A9AAF]">
                ClientEnforce gives agency teams one repeatable onboarding workflow so every client gets the same standard, and every account manager can see exactly what is complete.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-6 py-3.5 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                  Try ClientEnforce free
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                  See how it works
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── Pain points ───────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Sound familiar?</h2>
              </FadeUp>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {painPoints.map((point, i) => (
                  <FadeUp key={point.title} delay={i * 80}>
                    <article className="card-polish h-full rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">{point.icon}</div>
                      <h3 className="mt-4 text-base font-semibold text-[#F0F0F0]">{point.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{point.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">How ClientEnforce works for agencies</h2>
              </FadeUp>
              <div className="relative mt-10">
                <div className="absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-white/[0.10] lg:block" />
                <div className="grid gap-6 lg:grid-cols-3">
                  {[
                    { step: "01", icon: <LayoutTemplate className="h-5 w-5" />, title: "Build one template per service line", body: "Create onboarding templates for SEO, paid media, design, or retainer onboarding so each team follows a clear process." },
                    { step: "02", icon: <FileText className="h-5 w-5" />, title: "Send the portal link when a client signs", body: "Clients complete intake, upload files, and sign documents in one portal instead of scattered threads." },
                    { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Track completion and kick off on time", body: "Ops sees completion live and delivery starts only when required onboarding is complete." },
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

        {/* ── Feature callout ───────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#111118]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Built for agency workflows</h2>
              </FadeUp>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: <Bell className="h-5 w-5" />, title: "Automated reminders", body: "Overdue task nudges go out automatically so your account managers focus on delivery, not chasing." },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: "Audit trail", body: "Every submission timestamped. Every document stored. Evidence ready when a client asks what happened." },
                  { icon: <BarChart3 className="h-5 w-5" />, title: "Volume visibility", body: "One dashboard shows completion status across all active onboardings — spot blockers before they delay kickoff." },
                ].map((card, i) => (
                  <FadeUp key={card.title} delay={i * 80}>
                    <article className="card-polish h-full rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C2A8]/10 text-[#00C2A8]">{card.icon}</div>
                      <h3 className="mt-4 text-base font-semibold text-[#F0F0F0]">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9A9AAF]">{card.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0F]">
          <PageContainer>
            <div className="py-16">
              <FadeUp>
                <h2 className="font-serif text-3xl text-[#F0F0F0] sm:text-[40px]">Frequently asked questions</h2>
              </FadeUp>
              <div className="mt-8 max-w-2xl">
                <FaqAccordion items={faqItems} />
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { href: "/client-onboarding-software", label: "Client onboarding software" },
                  { href: "/client-onboarding-automation", label: "Onboarding automation" },
                  { href: "/dubsado-alternative", label: "Dubsado alternative" },
                  { href: "/blog", label: "Onboarding blog" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="card-polish rounded-xl border border-white/[0.08] bg-[#111118] px-4 py-3 text-sm text-[#9A9AAF] transition hover:text-[#F0F0F0]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* ── CTA band ──────────────────────────────────────────────────── */}
        <section className="bg-[#111118]">
          <PageContainer>
            <div className="py-20 text-center">
              <FadeUp>
                <h2 className="font-serif text-4xl text-[#F0F0F0] sm:text-[48px]">Ready to standardise agency onboarding?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-[#9A9AAF]">Launch a template your whole team can use and stop delaying kickoffs for missing intake.</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-[#00C2A8] px-8 py-4 text-sm font-semibold text-[#0A0A0F] shadow-[0_0_24px_rgba(0,194,168,0.3)] transition hover:bg-[#00d4b8]">
                    Try ClientEnforce free
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-[#F0F0F0] transition hover:bg-white/10">
                    View pricing
                  </Link>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
      <JsonLd data={agencyFaqSchema} />
    </div>
  );
}
