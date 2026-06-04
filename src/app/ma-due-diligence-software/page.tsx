import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckSquare, BarChart3, Shield, Clock, Users } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "M&A Due Diligence Intake Software | ClientEnforce (2026)",
  description:
    "Structured M&A due diligence intake software. Collect documents, enforce required submissions, and track completion across every acquisition target — from a single dashboard.",
  path: "/ma-due-diligence-software",
  keywords: [
    "M&A due diligence intake software",
    "M&A due diligence software",
    "acquisition due diligence software",
    "due diligence document collection",
    "M&A data room alternative",
    "acquisition intake software",
  ],
});

const faqItems = [
  {
    question: "What is M&A due diligence intake software?",
    answer:
      "M&A due diligence intake software is a structured collection system that replaces email chains and shared drives when gathering information from acquisition targets. It gives each target a secure portal with a defined checklist of required documents and disclosures, enforces completion before progressing, and gives the acquirer a real-time dashboard of what has been received across every active deal.",
  },
  {
    question: "How is ClientEnforce different from a virtual data room?",
    answer:
      "Virtual data rooms are repositories — you upload documents and grant access. ClientEnforce is an intake system — you define what you need, send each target a portal, and the software enforces submission and sends automated reminders until everything is complete. Most acquirers use both: ClientEnforce to collect and enforce intake, then upload the received documents to a VDR for buyer-side review.",
  },
  {
    question: "Can I manage multiple acquisition targets simultaneously?",
    answer:
      "Yes. Each target gets its own onboarding portal with its own checklist. Your dashboard shows completion status across every active deal at a glance — who has submitted what, what is outstanding, and how long items have been pending. For roll-up operators running multiple acquisitions in parallel, this replaces the spreadsheet tracking that breaks at scale.",
  },
  {
    question: "Does ClientEnforce create a timestamped audit trail?",
    answer:
      "Yes. Every submission — document uploaded, form completed, disclosure confirmed — is timestamped with a date, time, and submission record. The full audit trail is exportable as a PDF evidence pack. For deals that require post-closing documentation of what was disclosed and when, this is the record you need.",
  },
  {
    question: "Can I reuse the same questionnaire across multiple acquisitions?",
    answer:
      "Yes. You build a due diligence template once — vendors, financials, contracts, IT, HR, legal disclosures, whatever your standard intake covers — and reuse it for every new target. You can also create different templates per deal type (e.g., asset purchase vs. stock purchase) or per sector (e.g., auto service vs. HVAC).",
  },
  {
    question: "What types of due diligence information can I collect?",
    answer:
      "ClientEnforce supports file uploads, text responses, multiple choice, confirmations, signatures, and checkboxes. For a standard M&A intake, this covers: vendor and supplier lists, financial statements, inventory lists, lease agreements, IP and asset schedules, employee records, insurance certificates, IT and system inventories, and any bespoke disclosure requirements specific to your deal.",
  },
  {
    question: "Do targets need to create an account to submit their information?",
    answer:
      "No. Acquisition targets access their intake portal via a unique link — no account required, no password to set up. This dramatically reduces friction for sellers who are not technical and ensures submission rates stay high. You control what they see; they just fill it in.",
  },
  {
    question: "How long does it take to set up a due diligence intake for a new target?",
    answer:
      "If you have built a template previously, launching a new intake for a target takes under five minutes — name the deal, assign the template, generate the portal link, and send. Your first template takes longer to build depending on how many items your standard intake includes, but most teams have it live within one working day.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ClientEnforce",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://clientenforce.com/ma-due-diligence-software",
  description:
    "M&A due diligence intake software for acquirers who need structured, enforced document collection from acquisition targets — with a full timestamped audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const comparisonRows = [
  ["Primary purpose", "Document repository — store and share files", "Intake enforcement — collect, enforce, track completion"],
  ["Acquisition target experience", "Log in, navigate folders, upload files", "Click link, see checklist, submit — no account needed"],
  ["Required step enforcement", "None — seller can submit partial docs", "Enforced — required items cannot be skipped"],
  ["Automated follow-up", "Manual — you chase sellers by email", "Automated reminders until every item is submitted"],
  ["Multi-deal dashboard", "Folder-per-deal, no completion tracking", "Real-time completion status across all active deals"],
  ["Audit trail", "Access log", "Full timestamped submission record, exportable as PDF"],
  ["Template reuse", "No — new folder setup per deal", "Yes — one template, unlimited deals"],
  ["Setup time", "Hours — folder structure, permissions, access grants", "Under 5 minutes per deal once template is built"],
  ["Pricing", "$400–$1,500+/month for enterprise VDRs", "Free trial — paid plans from $37/month"],
] as const;

const problems = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Deals stall because sellers drag on document delivery",
    body: "When you rely on email to collect due diligence, reminders are manual and easy to ignore. ClientEnforce sends automated follow-ups on a defined schedule until every item is submitted — without you having to track who owed what.",
  },
  {
    icon: <CheckSquare className="h-5 w-5" />,
    title: "Partial submissions slip through",
    body: "Without enforcement, sellers mark themselves 'done' while half the required documents are missing. ClientEnforce requires all mandatory items before the intake is considered complete — and your dashboard reflects the real status.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "No visibility across parallel deals",
    body: "Running three acquisitions simultaneously from email and shared drives means no unified view. ClientEnforce gives you a single dashboard showing completion percentage, outstanding items, and last activity for every active deal.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "No defensible record of what was disclosed",
    body: "Post-closing disputes often hinge on what the seller disclosed and when. ClientEnforce maintains a full timestamped submission record for every item — document received, form completed, date, time — exportable as a PDF evidence pack.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Each acquisition starts from scratch",
    body: "Rebuilding your due diligence checklist by copy-pasting emails and folders for every new deal is a tax on your ops team. ClientEnforce lets you build the template once and launch a new intake for any target in under five minutes.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Sellers don't know what's expected",
    body: "Emailing a list of required documents in a PDF invites misinterpretation, partial submissions, and back-and-forth. ClientEnforce gives every seller a structured checklist with clear line items — exactly what's needed, in what format, with no ambiguity.",
  },
];

export default function MaDueDiligenceSoftwarePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>

        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-white py-24">
          <PageContainer>
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Link href="/" className="transition hover:text-[var(--color-text-primary)]">Home</Link>
              <span>/</span>
              <span className="text-[var(--color-text-primary)]">M&A Due Diligence Software</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Built for acquirers
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              M&A due diligence intake software that enforces completion — not just collects files
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Stop chasing acquisition targets by email. ClientEnforce gives each seller a structured intake portal, enforces every required submission, and shows you real-time completion across every active deal — from a single dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Start free — no credit card
              </Link>
              <Link href="/telletire" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                See real-world case study →
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Used by TelleTire for tire shop acquisition due diligence.{" "}
              <Link href="/telletire" className="underline hover:text-[var(--color-text-secondary)]">Read the case study →</Link>
            </p>
          </PageContainer>
        </section>

        {/* Problem statement */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why M&A due diligence intake breaks down
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most acquirers run their initial due diligence intake over email, shared drives, or a pasted checklist in a PDF. It works for one deal. It breaks at two. It falls apart at five. Here is what goes wrong — and what ClientEnforce fixes.
              </p>
            </FadeUp>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {problems.map((p, i) => (
                <FadeUp key={p.title} delay={i * 60}>
                  <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {p.icon}
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{p.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{p.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Case study callout */}
        <section className="border-b border-[var(--color-border)] bg-white py-14">
          <PageContainer>
            <FadeUp>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-8 md:flex md:items-start md:gap-8">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Real-world use case</p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How TelleTire uses ClientEnforce for tire shop acquisition due diligence
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                    TelleTire is a tire and auto service roll-up operator. When acquiring a new shop, they need structured intake covering 9 categories: vendors and inventory, POS systems, pricing and labor rates, utilities, finance and payments, IT and website access, facility profiles, marketing, and equipment lists. ClientEnforce replaced their email-based process with a single portal per acquisition — giving sellers a clear checklist and giving TelleTire real-time visibility into submission status across every active deal.
                  </p>
                  <Link href="/telletire" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]">
                    Read the TelleTire case study →
                  </Link>
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison: VDR vs ClientEnforce */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Virtual data room vs. M&A intake software
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Data rooms store documents. ClientEnforce collects them — with enforcement, automation, and an audit trail.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Virtual Data Room</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">ClientEnforce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {comparisonRows.map((row, i) => (
                      <tr key={row[0]} className={i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}>
                        <td className={`sticky left-0 z-10 px-5 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] ${i % 2 === 0 ? "bg-white" : "bg-[var(--color-bg-subtle)]"}`}>{row[0]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[1]}</td>
                        <td className="px-5 py-3.5 text-sm text-[var(--color-text-secondary)]">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Who it's for */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Who uses ClientEnforce for M&A intake
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Built for you if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You run a PE-backed roll-up and acquire 3–20+ businesses per year",
                      "You need each seller to complete a structured intake before deal progression",
                      "You run parallel acquisitions and need cross-deal visibility in one place",
                      "Post-closing disputes require proof of what was disclosed and when",
                      "Your ops team is manually chasing sellers for missing documents",
                      "You want to reuse the same due diligence template across every deal",
                      "You operate in auto service, HVAC, dental, vet, home services, or any fragmented vertical",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
              <FadeUp delay={80}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>A better fit elsewhere if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You only complete 1–2 acquisitions per year and email works fine",
                      "You need a full virtual data room for buyer-side document review",
                      "Your deals require complex NDA gating and multi-party access controls",
                      "You need integrated financial modelling or data analysis within the same tool",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-[var(--color-text-muted)]">For those cases, a VDR like Intralinks or Datasite handles the buyer-side review. ClientEnforce handles the seller-side intake — they work together.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                How M&A due diligence intake works in ClientEnforce
              </h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="absolute top-11 left-[calc(100%/6)] right-[calc(100%/6)] hidden h-px border-t border-dashed border-[var(--color-border-strong)] lg:block" />
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { step: "01", title: "Build your intake template", body: "Define every required document, disclosure, and question in a reusable template. Vendors, financials, contracts, IT, HR, equipment — structure it once." },
                  { step: "02", title: "Launch a portal per target", body: "When a new deal opens, generate a secure intake portal for that acquisition in under 5 minutes. Send the link to the seller — no account needed." },
                  { step: "03", title: "Enforcement & automated follow-up", body: "Sellers receive reminders on a defined schedule for every outstanding item. Required steps cannot be skipped. Your dashboard shows real-time progress." },
                  { step: "04", title: "Export the audit trail", body: "When intake is complete, export the full timestamped submission record as a PDF evidence pack. Every document received, every step confirmed, dated and logged." },
                ].map((s, i) => (
                  <FadeUp key={s.step} delay={i * 80}>
                    <article className="card-lift rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                      <span className="text-5xl font-bold text-[var(--color-bg-muted)]" style={{ fontFamily: "var(--font-display)" }}>{s.step}</span>
                      <h3 className="mt-3 text-[15px] font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{s.body}</p>
                    </article>
                  </FadeUp>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Launch your first M&A intake in under 20 minutes"
          subtext="Build your due diligence template once. Reuse it for every acquisition. Stop chasing sellers by email."
          primaryLabel="Start free — no credit card"
          secondaryLabel="See how TelleTire uses it →"
          secondaryHref="/telletire"
        />

        {/* FAQ */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2>
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
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { href: "/acquisition-due-diligence-software", label: "Acquisition due diligence tool" },
                { href: "/roll-up-acquisition-software", label: "Roll-up acquisition software" },
                { href: "/due-diligence-questionnaire-software", label: "Due diligence questionnaire software" },
                { href: "/ma-document-collection-software", label: "M&A document collection" },
                { href: "/telletire", label: "TelleTire case study" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="card-lift rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]">
                  {link.label}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

      </main>
      <PublicFooter />
      <JsonLd data={faqSchema} />
      <JsonLd data={productSchema} />
    </div>
  );
}
