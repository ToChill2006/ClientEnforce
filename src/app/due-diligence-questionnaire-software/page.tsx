import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckSquare, BarChart3, Shield, Clock, Layers } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Due Diligence Questionnaire Software for Acquisitions | ClientEnforce (2026)",
  description:
    "Build, send, and enforce structured due diligence questionnaires for acquisitions. Automated follow-up, required-field enforcement, and a timestamped audit trail. Free trial.",
  path: "/due-diligence-questionnaire-software",
  keywords: [
    "due diligence questionnaire software",
    "due diligence questionnaire software acquisitions",
    "acquisition questionnaire software",
    "M&A questionnaire tool",
    "due diligence questionnaire tool",
    "due diligence intake questionnaire",
    "acquisition intake questionnaire software",
  ],
});

const faqItems = [
  {
    question: "What is due diligence questionnaire software for acquisitions?",
    answer:
      "Due diligence questionnaire software for acquisitions is a structured intake platform that replaces emailed PDF checklists and shared folders when collecting information from acquisition targets. You build a questionnaire with every required document, disclosure, and question — then send each seller a portal link. The software enforces completion of required fields, sends automated reminders for outstanding items, and gives you a real-time dashboard of what each target has and hasn't submitted.",
  },
  {
    question: "How is this different from Typeform, Google Forms, or SurveyMonkey?",
    answer:
      "Generic form tools are designed for surveys — they collect one-time responses and move on. Due diligence questionnaire software is built for a workflow: required fields cannot be skipped, sellers can return to their portal over multiple sessions, you get automated reminders for incomplete submissions, and every response is logged with a timestamped audit trail. Typeform does not chase sellers for missing documents; ClientEnforce does.",
  },
  {
    question: "Can I include file uploads alongside questionnaire responses?",
    answer:
      "Yes. ClientEnforce questionnaire items can be any combination of file uploads, text responses, multiple-choice selections, signatures, confirmations, and checkboxes. A single due diligence questionnaire might ask the seller to describe their top 10 vendors (text), upload the last 3 years of financial statements (file), confirm whether there is outstanding litigation (checkbox), and sign a disclosure acknowledgment (signature) — all within the same portal.",
  },
  {
    question: "Can I reuse the same questionnaire across multiple acquisitions?",
    answer:
      "Yes. You build your due diligence questionnaire once as a template and deploy it for every new acquisition target in under five minutes. You can maintain separate templates for different deal types — asset purchase vs. stock purchase, or different sectors like auto service vs. dental practices — and each template is fully reusable.",
  },
  {
    question: "What happens when a seller leaves questionnaire items incomplete?",
    answer:
      "Required items trigger automated reminder emails on a schedule you configure. Sellers are reminded until the item is submitted. Your dashboard shows which items are outstanding across every active questionnaire — you can see at a glance which sellers are blocking their own deal progression and how long each item has been pending.",
  },
  {
    question: "Does the questionnaire produce an audit trail?",
    answer:
      "Yes. Every response — file uploaded, text submitted, checkbox confirmed, signature placed — is timestamped with the date and time of submission. The full questionnaire completion record is exportable as a PDF evidence pack. For deals subject to representations and warranties, this record documents exactly what the seller disclosed, when, and in what form.",
  },
  {
    question: "Do acquisition targets need an account to complete the questionnaire?",
    answer:
      "No. Sellers access their questionnaire portal through a unique link — no account registration, no password, no installation. They can complete sections across multiple sessions and the portal picks up where they left off. This dramatically reduces friction for sellers who are not technical and keeps submission rates high.",
  },
  {
    question: "Can different sections of the questionnaire go to different people on the seller's team?",
    answer:
      "Yes. Sellers can forward specific sections of their questionnaire to the relevant team member — CFO for financials, IT lead for system inventories, HR manager for employee records. All responses are tracked under the same acquisition portal and appear on your dashboard in one place.",
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
  url: "https://clientenforce.com/due-diligence-questionnaire-software",
  description:
    "Due diligence questionnaire software for acquisitions. Build structured questionnaires, enforce completion, automate seller follow-up, and export a full timestamped audit trail.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const problems = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "PDF checklists get ignored or returned incomplete",
    body: "Emailing a due diligence questionnaire as a PDF or Word doc invites partial responses, misinterpretation, and endless follow-up emails. ClientEnforce gives sellers a structured portal — item by item, required fields enforced, no ambiguity about what is needed.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Manual chasing consumes your ops bandwidth",
    body: "Following up on incomplete questionnaire items by email is a full-time job at deal volume. ClientEnforce automates every follow-up reminder — sellers get chased automatically until each item is submitted, so your team focuses on deals, not inbox management.",
  },
  {
    icon: <CheckSquare className="h-5 w-5" />,
    title: "Sellers self-certify as 'done' while items are missing",
    body: "Without enforcement, sellers declare their questionnaire complete while half the required items are outstanding. ClientEnforce requires all mandatory items before the questionnaire is marked complete — no partial completions slip through to your deal pipeline.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "No visibility across multiple simultaneous deals",
    body: "Running five acquisition questionnaires from email threads means no unified view of where each deal stands. ClientEnforce shows you completion percentage, outstanding items, and last activity across every active questionnaire from a single dashboard.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "No defensible record of seller disclosures",
    body: "Post-closing disputes hinge on what was disclosed and when. Email responses and PDF attachments are not audit trails. ClientEnforce logs every questionnaire response with a timestamp and exportable PDF record — the documentation your legal team needs.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Rebuilding the questionnaire for every new deal",
    body: "Copy-pasting a due diligence checklist from a previous deal's email thread is error-prone and inconsistent. ClientEnforce templates let you build the questionnaire once and deploy it for every new acquisition in minutes — identical structure, every time.",
  },
];

const comparisonRows = [
  ["Primary purpose", "One-time survey collection", "Ongoing intake enforcement for acquisitions"],
  ["Required field enforcement", "Can be skipped — responses are optional", "Required items block completion until submitted"],
  ["Multi-session completion", "Typically single-session", "Sellers return to portal across multiple sessions"],
  ["Automated follow-up for incomplete items", "None", "Automated reminders until every required item is done"],
  ["File uploads alongside form responses", "Limited or separate", "Native — file uploads are first-class questionnaire items"],
  ["Multi-deal dashboard", "No", "Real-time completion across all active acquisitions"],
  ["Timestamped audit trail", "No", "Full export — every response logged with date and time"],
  ["Template reuse across deals", "Manual copy", "One template, unlimited deployments in under 5 minutes"],
  ["No account needed for seller", "Typically requires account", "Unique link — no registration, no password"],
] as const;

const questionnaireCategories = [
  { category: "Vendors & suppliers", items: "Top suppliers by spend, payment terms, volume commitments, supplier concentration risk" },
  { category: "Financial disclosures", items: "3 years P&L, balance sheet, tax returns, accounts receivable aging, debt schedules" },
  { category: "Contracts & leases", items: "Lease agreements, key customer contracts, service agreements, exclusivity clauses" },
  { category: "IT & systems", items: "Software inventory, POS or ERP systems, website access, cybersecurity disclosures" },
  { category: "HR & employment", items: "Employee roster, compensation schedules, non-compete agreements, benefits summary" },
  { category: "Equipment & assets", items: "Equipment list with serial numbers, ownership vs. lease status, maintenance records" },
  { category: "Legal & compliance", items: "Outstanding litigation, permits and licenses, environmental disclosures, IP ownership" },
  { category: "Insurance", items: "Active insurance certificates, claims history, coverage limits, policy renewal dates" },
];

export default function DueDiligenceQuestionnaireSoftwarePage() {
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
              <span className="text-[var(--color-text-primary)]">Due Diligence Questionnaire Software</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Built for acquirers
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Due diligence questionnaire software that enforces answers — not just asks for them
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Stop emailing PDF checklists and chasing incomplete responses. ClientEnforce gives every acquisition target a structured questionnaire portal, enforces required items, sends automated follow-up, and logs every response in a timestamped audit trail.
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
              Used by TelleTire for tire shop acquisition questionnaires across 9 categories and 58 required items.{" "}
              <Link href="/telletire" className="underline hover:text-[var(--color-text-secondary)]">Read the case study →</Link>
            </p>
          </PageContainer>
        </section>

        {/* Problem */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why acquisition questionnaires break down
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most acquirers send their due diligence questionnaire as a PDF or shared document. It works on the first deal. By the fifth, it has become the main operational bottleneck. Here is what goes wrong — and what ClientEnforce fixes.
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Real-world case study</p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    TelleTire: 58-item questionnaire for every tire shop acquisition
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                    TelleTire is a tire and auto service roll-up operator. Their standard due diligence questionnaire covers 9 categories: vendors and inventory, POS systems, pricing and labor rates, utilities, finance and payments, IT and website access, facility profiles, marketing, and equipment lists. Each new acquisition target receives the same structured questionnaire portal — 58 required items, automated follow-up, and real-time completion tracking visible to TelleTire's deal team. The email chase is gone.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">9</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Questionnaire categories</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">58</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Required items per deal</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">&lt;5 min</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">To launch per new target</p>
                    </div>
                  </div>
                  <Link href="/telletire" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]">
                    Read the TelleTire case study →
                  </Link>
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison: Generic form tools vs ClientEnforce */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Generic form tools vs. acquisition questionnaire software
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Typeform and Google Forms collect responses. ClientEnforce enforces them — with required fields, multi-session completion, automated follow-up, and an audit trail.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Generic Form Tool<br /><span className="normal-case font-normal text-[10px]">(Typeform, Google Forms)</span></th>
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

        {/* What a questionnaire covers */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                What a standard acquisition questionnaire covers
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Every deal is different, but most acquisition due diligence questionnaires cover these eight core categories. Build them all into one ClientEnforce template — or use only the categories your deal requires.
              </p>
            </FadeUp>
            <FadeUp delay={60}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {questionnaireCategories.map((cat, i) => (
                  <FadeUp key={cat.category} delay={i * 40}>
                    <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                      <p className="font-semibold text-[var(--color-text-primary)]">{cat.category}</p>
                      <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">{cat.items}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                How acquisition questionnaires work in ClientEnforce
              </h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { step: "01", title: "Build your questionnaire template", body: "Define every required item — files, text, multi-choice, signatures, disclosures. Organise into categories. Mark required fields. Build once and reuse for every deal." },
                  { step: "02", title: "Deploy a portal per acquisition", body: "When a new deal opens, generate a questionnaire portal in under 5 minutes. Send the seller their unique link — no account setup, no installation, no friction." },
                  { step: "03", title: "Enforcement + automated follow-up", body: "Required fields cannot be skipped. Outstanding items trigger automated reminders on your schedule. Your dashboard shows real-time completion across every active deal." },
                  { step: "04", title: "Export the audit trail", body: "On completion, export a full timestamped questionnaire record as PDF. Every answer logged with date and time — your evidence pack for reps and warranties or post-closing disputes." },
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

        {/* Who it's for */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Who uses ClientEnforce for acquisition questionnaires
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Built for you if:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "You run a PE-backed roll-up or serial acquisition programme (3+ deals/year)",
                      "You need sellers to complete a structured questionnaire before deal progression",
                      "You are manually chasing incomplete questionnaire responses by email",
                      "Post-closing disputes require proof of what sellers disclosed and when",
                      "You want to reuse the same questionnaire structure across every new deal",
                      "You are acquiring in a fragmented vertical: auto service, HVAC, dental, vet, home services",
                      "You need a cross-deal view of questionnaire completion without digging through email",
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
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Look elsewhere if you need:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "A virtual data room for buyer-side document review and NDA gating",
                      "Full deal pipeline CRM with integrated financial modelling",
                      "Legal workflow automation for acquisition documentation and closings",
                      "Simple one-off survey collection with no enforcement or follow-up",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-[var(--color-text-muted)]">ClientEnforce handles seller-side questionnaire intake. VDRs like Intralinks or Datasite handle buyer-side review. Most professional acquirers use both — they complement each other.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Build your acquisition questionnaire in under an hour"
          subtext="Define every required item. Deploy to any seller in minutes. Automated follow-up handles the rest. Start free — no credit card needed."
          primaryLabel="Start free — no credit card"
          secondaryLabel="See TelleTire case study →"
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
                { href: "/ma-due-diligence-software", label: "M&A due diligence software" },
                { href: "/acquisition-due-diligence-software", label: "Acquisition due diligence tool" },
                { href: "/roll-up-acquisition-software", label: "Roll-up acquisition software" },
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
