import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckSquare, BarChart3, Shield, Zap, RefreshCw } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Acquisition Due Diligence Collection Tool | ClientEnforce (2026)",
  description:
    "Collect due diligence from acquisition targets without email chaos. Structured intake portals, automated follow-up, and a full audit trail — built for acquirers.",
  path: "/acquisition-due-diligence-software",
  keywords: [
    "acquisition due diligence collection tool",
    "acquisition due diligence software",
    "due diligence document collection tool",
    "acquisition intake tool",
    "M&A collection software",
    "business acquisition document collection",
  ],
});

const faqItems = [
  {
    question: "What is an acquisition due diligence collection tool?",
    answer:
      "An acquisition due diligence collection tool is software that structures and enforces the process of gathering documents and disclosures from a business being acquired. Instead of emailing a checklist and hoping the seller returns everything, the tool gives the seller a portal with defined required items, sends automated reminders for outstanding submissions, and gives the acquirer a real-time dashboard of what has been collected.",
  },
  {
    question: "What documents can I collect through ClientEnforce?",
    answer:
      "ClientEnforce supports file uploads (any format), text responses, multiple-choice answers, signatures, confirmations, and custom form fields. For a standard business acquisition, this covers: vendor and supplier lists with spend data, financial statements and tax returns, lease agreements, equipment schedules, IP ownership records, employee rosters and compensation, insurance certificates, IT and software inventories, environmental disclosures, and any deal-specific items your legal or ops team requires.",
  },
  {
    question: "How does automated follow-up work for sellers?",
    answer:
      "When a required item is not submitted by the deadline, ClientEnforce automatically sends a reminder to the seller on a schedule you configure — daily, every two days, weekly, whatever cadence works for your deal timeline. Reminders stop automatically when the item is submitted. You never need to manually track what is overdue or who needs chasing.",
  },
  {
    question: "Can I assign different sections to different people on the seller's side?",
    answer:
      "Yes. You can structure your intake by category — financials, HR, IT, legal, operations — and sellers can forward sections to the relevant person within their business. Each section is accessible via the same portal link, and all submissions are tracked in one place on your dashboard.",
  },
  {
    question: "Is there a limit to how many acquisitions I can run at once?",
    answer:
      "No. ClientEnforce is designed for teams running parallel deals. Each acquisition target gets its own intake portal, and your dashboard shows completion status across all of them simultaneously. The Team and Scale plans include unlimited active onboardings.",
  },
  {
    question: "How does the audit trail help with post-closing obligations?",
    answer:
      "Acquisition agreements frequently include representations and warranties from the seller about what was disclosed. If a post-closing dispute arises, the ClientEnforce audit trail provides a timestamped record of exactly what was submitted, when, and by whom — document by document. This record is exportable as a PDF and can be referenced in any post-closing proceeding.",
  },
  {
    question: "Does this work for asset purchases as well as stock purchases?",
    answer:
      "Yes. ClientEnforce is agnostic to deal structure. You build the intake template to match the information you need for the specific transaction type. Asset purchase deals typically require more detailed equipment and liability schedules; stock purchases often require more employee and equity documentation. You can build separate templates for each deal type and reuse them across similar transactions.",
  },
  {
    question: "Can I see which items are holding up deal progression?",
    answer:
      "Yes. Your dashboard shows, for each active acquisition, exactly which required items are outstanding, how long they have been pending, and when the last reminder was sent. This gives your deal team instant visibility into what is blocking each transaction without needing to dig through email threads.",
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
  url: "https://clientenforce.com/acquisition-due-diligence-software",
  description:
    "Acquisition due diligence collection tool for serial acquirers. Structured intake portals, automated seller follow-up, and a full audit trail — without email chaos.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const features = [
  { icon: <FileText className="h-5 w-5" />, title: "Structured intake portal per deal", body: "Each acquisition target gets a unique portal with their specific checklist — file uploads, text fields, multi-choice, signatures. No email, no shared drive, no confusion about what's needed." },
  { icon: <CheckSquare className="h-5 w-5" />, title: "Required-item enforcement", body: "Mark items as required and sellers cannot mark their intake complete without submitting them. Partial submissions no longer slip through." },
  { icon: <Zap className="h-5 w-5" />, title: "Automated seller reminders", body: "Outstanding items trigger automated follow-ups on a schedule you set. Stops when the item is submitted. Sellers get chased; you don't have to do it." },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Cross-deal dashboard", body: "See submission status, completion percentage, and outstanding items across every active acquisition simultaneously — not buried in separate email chains." },
  { icon: <Shield className="h-5 w-5" />, title: "Timestamped audit trail", body: "Every submission is logged with a date, time, and submission record. Exportable as a PDF evidence pack for post-closing reference or legal proceedings." },
  { icon: <RefreshCw className="h-5 w-5" />, title: "Reusable templates", body: "Build your standard due diligence template once. Launch a new intake for any target in under five minutes. Consistency across every deal." },
];

export default function AcquisitionDueDiligenceSoftwarePage() {
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
              <span className="text-[var(--color-text-primary)]">Acquisition Due Diligence Software</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              For serial acquirers
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Acquisition due diligence collection that closes the loop — automatically
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Email-based due diligence collection breaks at scale. ClientEnforce gives every seller a structured intake portal, enforces required submissions, and automatically chases outstanding items — so your deal team tracks deals, not documents.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Start free — no credit card
              </Link>
              <Link href="/telletire" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                TelleTire case study →
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Features */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Everything your due diligence collection needs — nothing it doesn't
              </h2>
            </FadeUp>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <FadeUp key={f.title} delay={i * 60}>
                  <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
                      {f.icon}
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-text-primary)]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{f.body}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Comparison */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Email + shared drive vs. acquisition due diligence software
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
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Email + Shared Drive</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">ClientEnforce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {([
                      ["Required document enforcement", "None — sellers submit whatever they want", "Required items block completion until submitted"],
                      ["Automated seller follow-up", "Manual — you chase by email", "Automated reminders until every item is received"],
                      ["Cross-deal dashboard", "No unified view — separate folders per deal", "Real-time completion across all active acquisitions"],
                      ["Seller access", "Requires account (Google/Dropbox)", "Unique link — no account registration needed"],
                      ["Structured checklist for sellers", "No — sellers navigate folders themselves", "Explicit required item list per submission"],
                      ["Timestamped audit trail", "Access log only", "Full submission log, exportable as PDF"],
                      ["Template reuse", "Manual copy per deal", "One template, unlimited deployments in minutes"],
                      ["Setup per new deal", "Folder structure, permissions, link sharing", "Under 5 minutes once template is built"],
                    ] as const).map((row, i) => (
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

        {/* Case study */}
        <section className="border-b border-[var(--color-border)] bg-white py-14">
          <PageContainer>
            <FadeUp>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Case study — roll-up acquisition</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  TelleTire: structured intake for tire shop acquisitions
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                  TelleTire acquires independent tire and auto service shops. Their standard intake covers 9 categories across 58 line items — from top-50 vendor lists and POS system details to utility invoices, fleet accounts, and equipment serial numbers. ClientEnforce gives each acquisition target a structured portal with exactly those requirements, enforces completion, and gives TelleTire's deal team real-time visibility into what each seller has and hasn't submitted.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    { stat: "9 categories", label: "Covered in one intake" },
                    { stat: "58 line items", label: "Per acquisition" },
                    { stat: "0 emails", label: "Needed to chase sellers" },
                  ].map((s) => (
                    <div key={s.stat} className="rounded-[var(--radius-md)] bg-white p-4">
                      <p className="text-2xl font-bold text-[var(--color-accent)]">{s.stat}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link href="/telletire" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline">
                  Read the full case study →
                </Link>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Who it's for */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Verticals that run acquisition due diligence through ClientEnforce
              </h2>
            </FadeUp>
            <FadeUp delay={60}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { vertical: "Auto service & tire shops", detail: "Vendor lists, POS systems, equipment schedules, utility invoices, fleet accounts" },
                  { vertical: "HVAC & home services", detail: "Equipment inventory, supplier contracts, license documentation, crew rosters" },
                  { vertical: "Dental & veterinary practices", detail: "Patient records disclosure, equipment lists, lease agreements, staff credentials" },
                  { vertical: "Franchised businesses", detail: "Franchise disclosure compliance, financial performance, territory documentation" },
                  { vertical: "Professional services firms", detail: "Client contracts, billing rates, IP ownership, staff non-competes" },
                  { vertical: "Multi-location retail", detail: "Lease schedules, inventory systems, POS data, brand license documentation" },
                ].map((v, i) => (
                  <FadeUp key={v.vertical} delay={i * 50}>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5">
                      <p className="font-semibold text-[var(--color-text-primary)]">{v.vertical}</p>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">{v.detail}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        <CtaBand
          heading="Start collecting. Stop chasing."
          subtext="Build your due diligence template once. Launch intake for any new acquisition in minutes. Automated follow-up handles the rest."
          primaryLabel="Start free — no credit card"
          secondaryLabel="See full features →"
          secondaryHref="/features"
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

        <section className="bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { href: "/ma-due-diligence-software", label: "M&A due diligence software" },
                { href: "/roll-up-acquisition-software", label: "Roll-up acquisition software" },
                { href: "/due-diligence-questionnaire-software", label: "Due diligence questionnaires" },
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
