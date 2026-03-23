import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, FileText, PenLine, FolderUp, BarChart3 } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Client Onboarding Software for Accountants | Compliant and Auditable | ClientEnforce",
  description: "Client onboarding software for accountants and accounting firms. Collect documents, capture signatures, run AML checks, and maintain a full audit trail - all in one structured workflow.",
  path: "/onboarding-for-accountants",
  keywords: ["onboarding software for accountants", "client onboarding software", "client onboarding checklist", "client onboarding automation", "client document collection software"],
  type: "website",
});

const painPoints = [
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Compliance exposure in the inbox", body: "Documents scattered across email threads and attachments forwarded between accounts creates untraceable gaps." },
  { icon: <FileText className="h-5 w-5" />, title: "AML documents arriving late or not at all", body: "Required identity and address verification sits requested in email, untracked, until someone notices it is missing." },
  { icon: <PenLine className="h-5 w-5" />, title: "Engagement letters signed informally", body: "Signed agreements live in PDF attachments across multiple email accounts — not in a central, auditable record." },
  { icon: <FolderUp className="h-5 w-5" />, title: "No exportable evidence pack", body: "When a file review comes up, answering 'did you receive this document?' takes twenty minutes of searching." },
] as const;

const faqItems = [
  { question: "Does ClientEnforce support AML and KYC document collection?", answer: "ClientEnforce allows you to define required documents as part of your onboarding template — including proof of identity, proof of address, and any other KYC documents your firm requires. The system enforces collection of these documents before marking onboarding as complete." },
  { question: "Can we export an audit trail for each client?", answer: "Yes. Every onboarding record includes a timestamped history of every document submitted, every step completed, and every signature collected. This can be exported as a PDF evidence pack at any time." },
  { question: "Does the client need to create an account to access the portal?", answer: "No. Clients access their onboarding portal through a secure link. No account creation, no password, no friction." },
  { question: "Can we use different templates for different types of client?", answer: "Yes. Build separate templates for business clients versus individual clients, or for different service types such as audit, tax, or bookkeeping." },
  { question: "Is ClientEnforce suitable for sole practitioners as well as larger firms?", answer: "Yes. Pricing is based on onboarding volume rather than team size. A sole practitioner onboarding a small number of clients per month can use ClientEnforce cost-effectively." },
] as const;

export default function OnboardingForAccountantsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Built for accountants
            </div>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[56px]" style={{ fontFamily: "var(--font-display)" }}>
              Client onboarding software for accountants — compliant, auditable, and structured
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-[var(--color-text-secondary)]">
              For accounting firms, client onboarding is not just a process — it is a compliance obligation. Documents need to be collected correctly, stored securely, and traceable. An email thread is not an audit trail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]">
                Try ClientEnforce free
              </Link>
              <Link href="/features" className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]">
                See all features
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Pain points */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>The compliance problem with email-based onboarding</h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">When a new client joins an accounting firm, the intake process typically needs to cover AML checks, KYC documentation, proof of identity, a signed engagement letter, and payment setup. Each of these needs to be completed, documented, and retrievable.</p>
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>How ClientEnforce handles accountant onboarding</h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { step: "01", icon: <ShieldCheck className="h-5 w-5" />, title: "Build a compliance-ready template", body: "Define all required steps: AML check, KYC documents, engagement letter signature, fee agreement, proof of identity. Mark each as required." },
                  { step: "02", icon: <FileText className="h-5 w-5" />, title: "Send the portal link when a client engages", body: "One link. The client sees their onboarding requirements clearly. They upload documents directly and sign the engagement letter in the portal." },
                  { step: "03", icon: <BarChart3 className="h-5 w-5" />, title: "Track completion and export the record", body: "See completion status for every active onboarding from one dashboard. When everything is in, export the full evidence pack as a PDF." },
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
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>What accountants need from onboarding software</h2>
            </FadeUp>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: <ShieldCheck className="h-5 w-5" />, title: "Timestamped audit trail", body: "Every document received, every step completed, every signature collected — with a date, time, and record of who submitted what." },
                { icon: <FileText className="h-5 w-5" />, title: "Required step enforcement", body: "AML checks are not optional. The system enforces these steps — onboarding is not complete until every required item is submitted." },
                { icon: <FolderUp className="h-5 w-5" />, title: "Exportable evidence pack", body: "Export a PDF at any point showing the complete onboarding record — all documents, signatures, steps, timestamps. Ready for audit." },
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
            <FadeUp delay={80}>
              <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-accent-subtle)] p-5">
                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  <span className="font-semibold text-[var(--color-text-primary)]">A note on compliance obligations:</span>{" "}
                  ClientEnforce is onboarding workflow software — it is not a compliance platform and does not provide legal or regulatory advice. It supports your onboarding process by enforcing completion, storing records, and providing an exportable audit trail. The specific compliance requirements for your firm should be defined by your compliance officer or professional adviser.
                </p>
              </div>
            </FadeUp>
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
              {[{ href: "/client-onboarding-software", label: "Client onboarding software" }, { href: "/client-onboarding-checklist", label: "Onboarding checklist" }, { href: "/honeybook-alternative", label: "HoneyBook alternative" }, { href: "/client-onboarding-automation", label: "Onboarding automation" }].map((link) => (
                <Link key={link.href} href={link.href} className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Run a compliant, auditable onboarding process"
          subtext="Without the admin overhead. Without the inbox chaos."
          primaryLabel="Start free trial"
          secondaryLabel="See pricing →"
          secondaryHref="/pricing"
        />

      </main>
      <PublicFooter />
    </div>
  );
}
