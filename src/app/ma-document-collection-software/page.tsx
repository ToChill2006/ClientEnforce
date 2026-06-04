import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckSquare, BarChart3, Shield, Clock, Inbox } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "M&A Document Collection Software | ClientEnforce (2026)",
  description:
    "Structured M&A document collection software. Replace email chains and shared drives with enforced intake portals, automated seller follow-up, and a full timestamped audit trail.",
  path: "/ma-document-collection-software",
  keywords: [
    "M&A document collection software",
    "M&A document collection",
    "acquisition document collection software",
    "due diligence document collection tool",
    "M&A document gathering software",
    "acquisition document management",
    "due diligence document collection",
  ],
});

const faqItems = [
  {
    question: "What is M&A document collection software?",
    answer:
      "M&A document collection software is a structured intake system that replaces email, Dropbox folders, and shared drives when gathering documents from acquisition targets. Instead of sending a checklist and hoping the seller returns everything, you give each target a secure intake portal with defined required submissions. The software enforces completion, sends automated reminders for outstanding documents, and gives you a real-time dashboard of what has been received across every active deal.",
  },
  {
    question: "How is this different from a shared Dropbox or Google Drive folder?",
    answer:
      "Shared drives are storage — you give the seller access to a folder and hope they put the right documents in the right place. M&A document collection software is enforcement — you define exactly what is required, the seller sees a structured checklist, required items cannot be skipped, and automated reminders fire until every document is submitted. Shared drives have no completion tracking, no required-field enforcement, and no audit trail.",
  },
  {
    question: "How does this compare to a virtual data room?",
    answer:
      "Virtual data rooms are buyer-side tools — you use them to share documents with investors and legal teams during buyer review. M&A document collection software is seller-side — it's the system that collects documents from the target before or during diligence. They solve different problems. Most professional acquirers use ClientEnforce to collect from sellers, then upload received documents to a VDR for buyer-side review.",
  },
  {
    question: "Can I collect different document types for different deals?",
    answer:
      "Yes. Each acquisition template you build in ClientEnforce defines exactly which documents are required for that deal type. An asset purchase template might require detailed equipment schedules and lease assignments. A stock purchase template might emphasise equity documentation and employee records. You build each template once and deploy it for every matching deal in under five minutes.",
  },
  {
    question: "What file formats can sellers submit?",
    answer:
      "ClientEnforce accepts any file format — PDF, Excel, Word, CSV, images, and others. Sellers can also respond via text fields, checkboxes, multiple choice, and signatures within the same portal. A single document collection intake might request a financial statement (PDF upload), a vendor list (Excel upload), a confirmation that no outstanding litigation exists (checkbox), and a disclosure acknowledgment (signature).",
  },
  {
    question: "How does automated follow-up work?",
    answer:
      "When a required document has not been submitted by the time you configure, ClientEnforce sends the seller an automated reminder email. Reminders repeat on a schedule you set — daily, every two days, weekly — until the document is submitted. You never need to manually track what is overdue or send individual chasing emails. Your dashboard shows which documents are outstanding across every active deal at a glance.",
  },
  {
    question: "Does the system create an audit trail of document submissions?",
    answer:
      "Yes. Every document submitted — upload time, file name, submission record — is logged with a date and timestamp. The full document receipt log is exportable as a PDF evidence pack. For deals that involve representations and warranties about disclosed documents, this record provides a defensible account of what the seller submitted and when.",
  },
  {
    question: "Can multiple people on the seller's side submit documents?",
    answer:
      "Yes. Sellers can share their portal link with the relevant person for each category — the CFO for financial statements, the IT lead for system documentation, the HR manager for employee records. All submissions are tracked under the same acquisition portal and appear in your dashboard in one place.",
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
  url: "https://clientenforce.com/ma-document-collection-software",
  description:
    "M&A document collection software for acquirers. Enforce required submissions, automate seller follow-up, and maintain a full timestamped audit trail — from a single dashboard.",
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
    icon: <Inbox className="h-5 w-5" />,
    title: "Email attachment chaos across multiple deals",
    body: "When sellers submit documents by email, they end up in different threads, with different names, in different formats. ClientEnforce gives every seller a portal with a structured submission checklist — everything in one place, every document labelled correctly.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Deals stall waiting for missing documents",
    body: "When a required financial statement or lease agreement is not submitted, deals slow down. ClientEnforce sends automated reminders until every required document is received — without your ops team having to track who owes what.",
  },
  {
    icon: <CheckSquare className="h-5 w-5" />,
    title: "Sellers submit partial collections and call it done",
    body: "Without enforcement, sellers forward a few attachments and consider their obligations complete. ClientEnforce marks required documents as outstanding until they are actually submitted — partial collections cannot be declared complete.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "No cross-deal visibility into collection status",
    body: "Running four acquisitions simultaneously across separate email threads and Dropbox folders means no unified view of what is received and what is missing. ClientEnforce shows completion across every active deal from one dashboard.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "No defensible record of what was submitted",
    body: "Email timestamps and attachment histories are not audit trails. ClientEnforce logs every document submission with a date, time, and file record — exportable as a PDF for post-closing reference, R&W claims, or legal proceedings.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Rebuilding your collection checklist for every deal",
    body: "Copy-pasting a document requirement list from a previous deal email is error-prone and inconsistent across deals. ClientEnforce templates let you define your standard document list once and deploy it for every new target in minutes.",
  },
];

const comparisonRows = [
  ["Primary purpose", "File storage and sharing", "Document intake enforcement and collection tracking"],
  ["Required document enforcement", "None — sellers upload whatever they want", "Required items block completion until submitted"],
  ["Automated follow-up", "None — you chase sellers manually", "Automated reminders until every document is received"],
  ["Cross-deal completion dashboard", "No — folder-per-deal with no status tracking", "Real-time completion across all active acquisitions"],
  ["Seller needs an account", "Yes — Drive/Dropbox account required", "No — unique link, no registration needed"],
  ["Structured checklist for sellers", "No — sellers navigate folders themselves", "Yes — explicit required item list per submission"],
  ["Timestamped audit trail", "Access log only", "Full submission log, exportable as PDF evidence pack"],
  ["Template reuse", "Manual folder copy per deal", "One template, unlimited deployments in minutes"],
  ["Pricing", "General file storage pricing", "Free trial — paid plans from $37/month"],
] as const;

const documentTypes = [
  { type: "Financial records", examples: "3 years P&L and balance sheet, tax returns, accounts receivable aging, debt schedules, bank statements" },
  { type: "Legal & contracts", examples: "Lease agreements, key customer contracts, supplier agreements, IP assignments, non-competes" },
  { type: "Equipment & assets", examples: "Equipment schedules with serial numbers, ownership vs. lease status, vehicle lists, maintenance records" },
  { type: "Vendor & supplier", examples: "Top suppliers by spend, volume commitments, payment terms, sole-source dependencies" },
  { type: "HR & employment", examples: "Employee roster, compensation schedules, benefits plans, employment agreements" },
  { type: "IT & systems", examples: "Software and system inventory, POS or ERP documentation, website access credentials, cybersecurity disclosures" },
  { type: "Insurance", examples: "Active insurance certificates, claims history, coverage limits, policy renewal dates" },
  { type: "Permits & compliance", examples: "Business licenses, health and safety permits, environmental compliance records, professional certifications" },
];

export default function MaDocumentCollectionSoftwarePage() {
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
              <span className="text-[var(--color-text-primary)]">M&A Document Collection Software</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Built for acquirers
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              M&A document collection software that enforces submissions — not just requests them
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Replace email attachments and shared drives with structured intake portals. ClientEnforce gives each acquisition target a required document checklist, enforces completion, sends automated seller follow-up, and logs every submission in a timestamped audit trail.
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
              Used by TelleTire to collect documents from tire shop acquisitions — 58 items across 9 categories, automated.{" "}
              <Link href="/telletire" className="underline hover:text-[var(--color-text-secondary)]">Read the case study →</Link>
            </p>
          </PageContainer>
        </section>

        {/* Problem */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why M&A document collection breaks down
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                Most acquirers rely on email attachments and shared drives to collect documents from targets. It is manageable for a single deal. At three simultaneous acquisitions it becomes a coordination problem. At ten, it becomes the bottleneck that delays every close.
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

        {/* Case study */}
        <section className="border-b border-[var(--color-border)] bg-white py-14">
          <PageContainer>
            <FadeUp>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-8 md:flex md:items-start md:gap-8">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Real-world case study</p>
                  <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    How TelleTire collects documents from every tire shop acquisition
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                    TelleTire is a tire and auto service roll-up acquiring independent shops across the US. Their standard document collection covers 9 categories: top-50 vendor lists with spend data, POS and shop management system documentation, parts and labor pricing schedules, utility and recurring service invoices, payment processor statements, IT and website access credentials, facility photos and lease documents, marketing and social media access, and full equipment inventories with serial numbers. Each acquisition target receives the same structured portal — 58 required items, automated follow-up, and real-time visibility for TelleTire's deal team.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">58</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Required items per acquisition</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">9</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Document categories</p>
                    </div>
                    <div className="rounded-[var(--radius-md)] bg-white px-5 py-3">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">0</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Manual chase emails sent</p>
                    </div>
                  </div>
                  <Link href="/telletire" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]">
                    Read the full TelleTire case study →
                  </Link>
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison: Email + Dropbox vs ClientEnforce */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Email + shared drive vs. M&A document collection software
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Shared drives store files. ClientEnforce collects them — with required-item enforcement, automated follow-up, and a full audit trail.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Email + Shared Drive<br /><span className="normal-case font-normal text-[10px]">(Dropbox, Google Drive)</span></th>
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

        {/* Document types */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Document categories you can collect in ClientEnforce
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Build your collection template with any combination of these document types. Add required-field enforcement, automated reminders, and a timestamped receipt log for each one.
              </p>
            </FadeUp>
            <FadeUp delay={60}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {documentTypes.map((doc, i) => (
                  <FadeUp key={doc.type} delay={i * 40}>
                    <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                      <p className="font-semibold text-[var(--color-text-primary)]">{doc.type}</p>
                      <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">{doc.examples}</p>
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
                How M&A document collection works in ClientEnforce
              </h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { step: "01", title: "Build your document checklist", body: "Define every required document, file type, and related disclosure. Organise into categories. Mark each item as required or optional. Build once and reuse for every deal." },
                  { step: "02", title: "Deploy a portal per acquisition", body: "When a new deal opens, launch a collection portal for that target in under 5 minutes. Send the seller a unique link — no account, no installation, no friction." },
                  { step: "03", title: "Automated follow-up until complete", body: "Outstanding required documents trigger automated reminder emails. Sellers are chased until every item is submitted. Your dashboard shows real-time collection status across every active deal." },
                  { step: "04", title: "Export the submission record", body: "When collection is complete, export a full timestamped document receipt log as PDF. Every file received, every step confirmed — date and time stamped for post-closing reference." },
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
                Is ClientEnforce the right document collection tool for your M&A process?
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Strong fit if you:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Need structured, enforced document collection from acquisition targets",
                      "Run a roll-up or serial acquisition programme (3+ deals/year)",
                      "Are manually chasing sellers for missing documents by email",
                      "Want a defensible timestamped record of every document received",
                      "Need cross-deal visibility into collection status in one dashboard",
                      "Want to reuse the same document checklist for every new acquisition",
                      "Operate in fragmented verticals: auto service, HVAC, dental, vet, home services, insurance",
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
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Better served elsewhere if you need:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "A virtual data room for buyer-side document review and NDA gating",
                      "Integrated deal pipeline CRM with financial modelling",
                      "Legal document automation for acquisition agreements",
                      "Full document management for post-close integration",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-[var(--color-text-muted)]">Many acquirers use ClientEnforce for seller-side document collection, then move received documents to a VDR like Intralinks or Datasite for buyer-side review. They handle different stages of the same deal.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Start collecting deal documents — without the email chaos"
          subtext="Build your document collection template once. Deploy to any seller in minutes. Automated follow-up handles the rest."
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
                { href: "/due-diligence-questionnaire-software", label: "Due diligence questionnaires" },
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
