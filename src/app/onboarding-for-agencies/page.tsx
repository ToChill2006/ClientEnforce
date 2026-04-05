import type { Metadata } from "next";
import Link from "next/link";
import { Mail, AlertCircle, FileText, Users, BarChart3, Bell, ShieldCheck, LayoutTemplate } from "lucide-react";

import { JsonLd, PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Agencies | Built for Volume | ClientEnforce",
  description: "Client onboarding software built for digital agencies. Run consistent onboarding across every client, automate follow-ups, and start projects with complete intake - every time.",
  path: "/onboarding-for-agencies",
  keywords: ["onboarding software for agencies", "agency client onboarding software", "client onboarding workflow software", "client onboarding automation", "client onboarding software"],
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
  { question: "How many onboarding templates should an agency start with?", answer: "Most agencies start with one template per core service line. That keeps setup simple while still standardizing onboarding across account managers." },
  { question: "Can account managers see all active onboardings in one place?", answer: "Yes. ClientEnforce gives visibility across active onboardings so teams can spot blockers and overdue tasks quickly." },
  { question: "What if a client does not complete tasks on time?", answer: "Automated reminders and escalation rules handle overdue tasks so account managers do not have to manually chase every item." },
  { question: "How fast can an agency launch?", answer: "Most teams can launch their first onboarding template in under 20 minutes and refine it during the first week of live usage." },
] as const;

const agencyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

export default function OnboardingForAgenciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Onboarding software for agencies</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[56px]" style={{ fontFamily: "var(--font-display)" }}>
              Client onboarding software for agencies — built for teams that onboard at volume
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--color-text-secondary)]">
              Most agency onboarding problems are not people problems — they are process problems. When you are running 5, 10, or 20 client onboardings simultaneously, the manual approach collapses and the client experience suffers before the work even begins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]">
                Try ClientEnforce free
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]">
                See how it works
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Pain points */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Sound familiar?</h2>
            </FadeUp>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <FadeUp key={point.title} delay={i * 80}>
                  <article className="card-lift h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">{point.icon}</div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{point.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>How ClientEnforce works for agencies</h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { step: "01", icon: <LayoutTemplate className="h-5 w-5" />, title: "Build one template per service line", body: "Create onboarding templates for SEO, paid media, design, or retainer onboarding so each team follows a clear process." },
                  { step: "02", icon: <FileText className="h-5 w-5" />, title: "Send the portal link when a client signs", body: "Clients complete intake, upload files, and sign documents in one portal instead of scattered threads." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Track completion and kick off on time", body: "Ops sees completion live and delivery starts only when required onboarding is complete." },
                ].map((step, i) => (
                  <FadeUp key={step.step} delay={i * 100}>
                    <article className="card-lift rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 shadow-[var(--shadow-sm)]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">{step.icon}</div>
                        <span className="text-5xl font-bold text-[var(--color-bg-muted)]" style={{ fontFamily: "var(--font-display)" }}>{step.step}</span>
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{step.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Feature callout */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Built for agency workflows</h2>
            </FadeUp>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: <Bell className="h-5 w-5" />, title: "Automated reminders", body: "Overdue task nudges go out automatically so your account managers focus on delivery, not chasing." },
                { icon: <ShieldCheck className="h-5 w-5" />, title: "Audit trail", body: "Every submission timestamped. Every document stored. Evidence ready when a client asks what happened." },
                { icon: <BarChart3 className="h-5 w-5" />, title: "Volume visibility", body: "One dashboard shows completion status across all active onboardings — spot blockers before they delay kickoff." },
              ].map((card, i) => (
                <FadeUp key={card.title} delay={i * 80}>
                  <article className="card-lift h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">{card.icon}</div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{card.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
            </FadeUp>
            <div className="mt-8 max-w-2xl">
              <FaqAccordion items={faqItems} />
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[{ href: "/client-onboarding-software", label: "Client onboarding software" }, { href: "/client-onboarding-automation", label: "Onboarding automation" }, { href: "/dubsado-alternative", label: "Dubsado alternative" }, { href: "/blog", label: "Onboarding blog" }].map((link) => (
                <Link key={link.href} href={link.href} className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Ready to standardize agency onboarding?"
          subtext="Launch a template your whole team can use and stop delaying kickoffs for missing intake."
          primaryLabel="Try ClientEnforce free"
          secondaryLabel="View pricing"
          secondaryHref="/pricing"
        />

      </main>
      <PublicFooter />
      <JsonLd data={agencyFaqSchema} />
    </div>
  );
}
