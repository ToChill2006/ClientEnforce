import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "What Is Client Onboarding? Definition and Steps | ClientEnforce",
  description: "Client onboarding is the structured process of transitioning a new client from signed agreement to active project. Learn what it includes, why it matters, and how to do it right.",
  path: "/blog/what-is-client-onboarding",
  keywords: ["what is client onboarding", "client onboarding definition", "client onboarding steps", "client onboarding process", "how to onboard a client"],
  type: "article",
});

const publishedTime = "2026-04-13";

const faqItems = [
  {
    question: "What is the difference between client onboarding and customer onboarding?",
    answer: "Client onboarding typically refers to the intake process for professional and B2B service businesses — agencies, consultants, accountants, law firms — where the relationship is bespoke and compliance-sensitive. Customer onboarding is a broader term used in SaaS and consumer contexts to describe activating a user within a product. The key difference is that client onboarding usually involves legal documents, data collection, e-signatures, and a formal kickoff milestone, whereas product onboarding focuses on feature adoption.",
  },
  {
    question: "How long should client onboarding take?",
    answer: "For most service businesses, the intake phase (collecting documents, signatures, and required information) should be completable within 3–5 business days of the agreement being signed. The full onboarding process — including discovery, internal briefing, and kickoff — typically runs 1–2 weeks. If onboarding consistently takes longer than two weeks before work can begin, the process usually has structural problems: too many steps, no automation, or unclear requirements for the client.",
  },
  {
    question: "What documents are needed for client onboarding?",
    answer: "The standard document set for professional service businesses includes: a signed engagement letter or contract, a statement of work or scope of services, an NDA or confidentiality agreement, and identity verification if required by compliance obligations. Regulated industries (accounting, financial services, legal) typically also require anti-money laundering checks, source of funds declarations, and Know Your Customer documentation. The exact list depends on the industry and nature of the engagement.",
  },
  {
    question: "What is onboarding enforcement, and why does it matter?",
    answer: "Onboarding enforcement means that required steps cannot be skipped — the process cannot be marked complete, and delivery work cannot begin, until every required item is submitted. Most onboarding tools track progress but do not enforce it. Enforcement matters because without it, clients partially complete onboarding, account managers begin work on incomplete briefs, and documents are collected reactively when problems arise. Enforcement prevents the downstream issues that incomplete intake creates.",
  },
  {
    question: "Do clients need to create an account to complete onboarding?",
    answer: "In most modern onboarding platforms, no — clients access their onboarding portal via a single link and complete their steps without creating an account or remembering a password. This frictionless access significantly improves completion rates. Clients who are given a portal link they can use immediately are far more likely to complete required steps within 24 hours than clients who must first verify an email, create a password, and navigate an unfamiliar platform.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Client Onboarding? Definition, Steps, and How to Do It Right",
  description: "Client onboarding is the structured process of transitioning a new client from signed agreement to active project. Learn what it includes, why it matters, and how to do it right.",
  datePublished: publishedTime,
  dateModified: publishedTime,
  author: {
    "@type": "Organization",
    name: "ClientEnforce",
    url: "https://clientenforce.com",
  },
  publisher: {
    "@type": "Organization",
    name: "ClientEnforce",
    url: "https://clientenforce.com",
    logo: {
      "@type": "ImageObject",
      url: "https://clientenforce.com/C.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://clientenforce.com/blog/what-is-client-onboarding",
  },
};

export default function WhatIsClientOnboardingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-20">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <Link href="/blog" className="transition hover:text-[var(--color-text-primary)]">Blog</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">What Is Client Onboarding?</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                Guide
              </div>
              <time className="text-xs text-[var(--color-text-muted)]" dateTime={publishedTime}>
                April 13, 2026
              </time>
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              What Is Client Onboarding? Definition, Steps, and How to Do It Right
            </h1>

            {/* Featured snippet answer */}
            <div className="mt-8 max-w-3xl rounded-[var(--radius-lg)] border-l-4 border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Definition</p>
              <p className="mt-2 text-base leading-7 text-[var(--color-text-primary)]">
                Client onboarding is the structured process of transitioning a new client from signed agreement to active project. It includes intake forms, document collection, e-signatures, and completion of required steps — ensuring all information is gathered before delivery work begins. Done correctly, it sets clear expectations, establishes a compliance record, and prevents the ambiguity that causes disputes later in the engagement.
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Article body */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <div className="mx-auto max-w-3xl">

              {/* What does client onboarding include? */}
              <FadeUp>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  What does client onboarding include?
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  <p>
                    Client onboarding typically includes five core categories of activity:
                  </p>
                  <ol className="space-y-4 pl-4">
                    <li className="relative pl-4">
                      <span className="absolute left-0 font-bold text-[var(--color-accent)]">1.</span>
                      <strong className="text-[var(--color-text-primary)]">Legal and contractual documentation.</strong> Signed engagement letter, statement of work, NDA, and any industry-specific compliance documents. These establish the terms under which the engagement operates and are non-negotiable.
                    </li>
                    <li className="relative pl-4">
                      <span className="absolute left-0 font-bold text-[var(--color-accent)]">2.</span>
                      <strong className="text-[var(--color-text-primary)]">Client intake information.</strong> The facts and context your team needs to deliver the work: goals, constraints, key contacts, existing assets, and background information. Usually collected via an intake form or structured questionnaire.
                    </li>
                    <li className="relative pl-4">
                      <span className="absolute left-0 font-bold text-[var(--color-accent)]">3.</span>
                      <strong className="text-[var(--color-text-primary)]">Access and credentials.</strong> Logins, integrations, API keys, system access — whatever your team needs to actually do the work. Collecting these at onboarding rather than mid-project prevents one of the most common sources of delivery delay.
                    </li>
                    <li className="relative pl-4">
                      <span className="absolute left-0 font-bold text-[var(--color-accent)]">4.</span>
                      <strong className="text-[var(--color-text-primary)]">Billing and payment setup.</strong> Invoice contact, payment method, billing cycle, expense approval process. Getting this right at onboarding prevents billing friction that is disproportionately damaging to the client relationship.
                    </li>
                    <li className="relative pl-4">
                      <span className="absolute left-0 font-bold text-[var(--color-accent)]">5.</span>
                      <strong className="text-[var(--color-text-primary)]">Kickoff confirmation.</strong> A formal milestone — often a call or written sign-off — that confirms all required information is in place, expectations are set, and delivery work can formally begin. This is the endpoint of onboarding.
                    </li>
                  </ol>
                </div>
              </FadeUp>

              <div className="my-12 border-t border-[var(--color-border)]" />

              {/* Client onboarding steps */}
              <FadeUp>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  Client onboarding steps
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  The order matters. Teams that skip steps or run them in parallel often find themselves in situations where work has started before requirements were confirmed or documents were received.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      step: "Step 1",
                      title: "Internal setup",
                      body: "Assign the account manager, create the client workspace, and prepare the onboarding template or portal before the client is involved. Internal setup done in advance means the client's experience is smooth and professional from the first touchpoint.",
                    },
                    {
                      step: "Step 2",
                      title: "Send the onboarding portal",
                      body: "Share a structured onboarding portal or checklist with the client immediately after the agreement is signed. The portal should outline exactly what is needed, in what order, with no ambiguity. Clients who receive a clear list on day one complete onboarding faster than clients who receive ad hoc requests.",
                    },
                    {
                      step: "Step 3",
                      title: "Collect documents and signatures",
                      body: "Gather all required legal documents, signed forms, and compliance materials. These should be required steps — not optional. The portal should not allow the client to proceed without submitting them.",
                    },
                    {
                      step: "Step 4",
                      title: "Collect intake information and access",
                      body: "Complete the structured intake form, collect credentials, and gather any assets needed for delivery. This step often surfaces misalignment between what was sold and what the client is prepared to provide — catching that misalignment in onboarding is far less costly than catching it mid-project.",
                    },
                    {
                      step: "Step 5",
                      title: "Discovery and internal briefing",
                      body: "Conduct a structured intake call (if relevant to the engagement), document the output, and brief the delivery team. This step converts the raw information collected in steps 3 and 4 into an actionable internal brief.",
                    },
                    {
                      step: "Step 6",
                      title: "Kickoff confirmation",
                      body: "Confirm in writing that all required information is in place, all required steps are complete, and delivery work can begin. This written confirmation is the formal end of onboarding and the beginning of the active engagement.",
                    },
                  ].map((s) => (
                    <div key={s.step} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{s.step}</p>
                      <h3 className="mt-1 text-[15px] font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{s.body}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <div className="my-12 border-t border-[var(--color-border)]" />

              {/* Why it matters */}
              <FadeUp>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  Why client onboarding matters
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  <p>
                    The client onboarding phase has a disproportionate effect on the quality and profitability of the entire engagement. Most of the problems that emerge later in a client relationship — scope disputes, billing friction, missed expectations, compliance gaps — have their root cause in onboarding: something was not captured, something was not confirmed, something was not signed.
                  </p>
                  <p>
                    There are three specific reasons why onboarding quality compounds over time:
                  </p>
                  <ul className="space-y-3 pl-2">
                    {[
                      "Incomplete information gathered at onboarding means account managers go back to clients repeatedly during delivery — each request erodes the client's confidence in the team's competence.",
                      "Ambiguous scope confirmed verbally and never documented in writing becomes progressively harder to defend as the engagement grows and expectations diverge.",
                      "Missing compliance documentation discovered mid-engagement creates retrospective risk — particularly in regulated industries where the window to collect AML or KYC documentation is not unlimited.",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p>
                    Good onboarding does not just protect the business. It creates the conditions for a better client experience: clear expectations, a professional first impression, and a documented record that both parties can refer to when questions arise.
                  </p>
                </div>
              </FadeUp>

              <div className="my-12 border-t border-[var(--color-border)]" />

              {/* Common mistakes */}
              <FadeUp>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  Common client onboarding mistakes
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  <p>
                    Most onboarding failures come from one of five predictable mistakes:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Starting delivery before onboarding is complete",
                        body: "The most common and costly mistake. Delivery that starts before intake is complete always uncovers missing information at the worst possible time — when a deadline is approaching or the client is already unhappy.",
                      },
                      {
                        title: "Treating onboarding as optional or best-effort",
                        body: "If clients can skip required steps without consequence, many will. The checklist becomes a suggestion, not a requirement. Enforcement — making it impossible to proceed without completing required steps — is the only reliable fix.",
                      },
                      {
                        title: "Using email as the onboarding tool",
                        body: "Sending onboarding requests via email fragments the process across threads, makes it easy to miss outstanding items, creates no audit trail, and provides no automated follow-up. Email is not a workflow tool.",
                      },
                      {
                        title: "No audit trail",
                        body: "Knowing that a document was collected is not the same as being able to prove it, with a timestamp, in the event of a dispute. Teams without an audit trail are unable to demonstrate what was agreed, when, and by whom.",
                      },
                      {
                        title: "Manual follow-up for outstanding items",
                        body: "Account managers who are manually chasing clients for outstanding onboarding items are doing work that software should do. Every hour spent on manual follow-up is an hour not spent on delivery.",
                      },
                    ].map((mistake) => (
                      <div key={mistake.title} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{mistake.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{mistake.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              <div className="my-12 border-t border-[var(--color-border)]" />

              {/* How software helps */}
              <FadeUp>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  How onboarding enforcement software works
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                  <p>
                    Client onboarding software replaces ad hoc email threads and static checklists with a structured, automated process. The best onboarding platforms go beyond simple task tracking — they enforce completion.
                  </p>
                  <p>
                    Enforcement means that required steps must be completed before the onboarding can be marked done. The client cannot submit a partially complete intake form and move forward. Documents cannot be skipped. The process is structured, not flexible where flexibility causes problems.
                  </p>
                  <p>
                    In practice, a good client onboarding platform provides:
                  </p>
                  <ul className="space-y-3 pl-2">
                    {[
                      "A template-based workflow that defines what every new client must complete — built once, applied consistently",
                      "A client-facing portal accessible via a single link (no login required for clients)",
                      "Required-step enforcement — clients cannot skip items or proceed without completing them",
                      "Automated reminders for outstanding items — no manual chasing",
                      "A full timestamped audit trail of every step, document, and signature",
                      "A multi-client dashboard showing completion status across every active onboarding simultaneously",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p>
                    ClientEnforce is built around this model. It handles client onboarding from signed agreement to kickoff-ready — enforcing completion at every step, automating reminders, and maintaining the audit trail that compliance-sensitive businesses need. Most teams have a first onboarding template live within 20 minutes of signing up.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
                    >
                      Try ClientEnforce free — no credit card needed
                    </Link>
                  </div>
                </div>
              </FadeUp>

            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Client onboarding that enforces itself"
          subtext="Stop relying on account managers to chase clients for intake documents. ClientEnforce automates the follow-up, enforces required steps, and maintains the audit trail — so you can focus on delivery."
          primaryLabel="Start free trial — live in 20 minutes"
          secondaryLabel="See how it works →"
          secondaryHref="/features"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {faqItems.map((item) => (
                <FadeUp key={item.question}>
                  <article className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{item.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">{item.answer}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related */}
        <section className="bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/client-onboarding-software", label: "Client onboarding software" },
                { href: "/client-onboarding-automation", label: "Onboarding automation" },
                { href: "/resources/agency-onboarding-checklist", label: "Agency onboarding checklist" },
                { href: "/resources/consultant-intake-checklist", label: "Consultant intake checklist" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

      </main>
      <PublicFooter />
      <JsonLd data={faqSchema} />
      <JsonLd data={articleSchema} />
    </div>
  );
}
