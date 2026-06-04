import type { Metadata } from "next";
import Link from "next/link";
import { FileText, BarChart3, Shield, Zap, Users, RefreshCw } from "lucide-react";

import { PageContainer, PublicFooter, PublicHeader, CtaBand, JsonLd } from "@/components/marketing/public-shell";
import { FadeUp } from "@/components/marketing/fade-up";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Roll-Up Acquisition Intake System | ClientEnforce (2026)",
  description:
    "The intake system for PE-backed roll-ups. Collect due diligence from every acquired business with one reusable template, automated follow-up, and a cross-portfolio dashboard.",
  path: "/roll-up-acquisition-software",
  keywords: [
    "roll-up acquisition intake system",
    "roll-up acquisition software",
    "PE roll-up due diligence software",
    "business roll-up intake tool",
    "acquisition intake system",
    "fragmented vertical acquisition software",
  ],
});

const faqItems = [
  {
    question: "What is a roll-up acquisition intake system?",
    answer:
      "A roll-up acquisition intake system is the structured process — and the software that runs it — for collecting due diligence from businesses being consolidated into a platform. Roll-ups acquire the same type of business repeatedly (auto shops, HVAC companies, dental practices, etc.), so a well-built intake system lets them reuse the same template, launch intake for each new target in minutes, and track completion across every active acquisition from one dashboard.",
  },
  {
    question: "Why do roll-ups specifically need dedicated intake software?",
    answer:
      "Single-deal acquirers can get away with email and shared drives. Roll-up operators cannot. When you are acquiring 5, 10, or 20+ businesses per year, email-based collection creates a different problem for every deal — different sellers, different response rates, different completeness levels, no unified view of what is outstanding. A purpose-built intake system creates consistency: the same template, the same enforcement rules, the same automated follow-up cadence, for every target.",
  },
  {
    question: "How does ClientEnforce handle different deal types within the same roll-up?",
    answer:
      "You can build multiple templates in ClientEnforce — one for each deal type, geography, or acquisition tier. A roll-up that acquires both urban and rural locations might have different facility and staffing requirements. You build templates to match each scenario and deploy the right one for each new target.",
  },
  {
    question: "Can my deal team and ops team both use this simultaneously?",
    answer:
      "Yes. Multiple team members can access the ClientEnforce dashboard simultaneously. Deal leads can track their specific acquisitions, and a head of ops can see the full cross-portfolio view. Role-based access ensures each person sees what they need.",
  },
  {
    question: "What sectors use ClientEnforce for roll-up acquisitions?",
    answer:
      "ClientEnforce is used across fragmented verticals undergoing consolidation — auto service and tire shops, HVAC and home services, dental and veterinary practices, commercial cleaning, physical therapy, insurance agencies, and multi-location food service. Anywhere a PE-backed or founder-led platform is acquiring similar businesses repeatedly, the intake challenge is the same.",
  },
  {
    question: "How long does it take to launch intake for a new acquisition target?",
    answer:
      "Once your template is built, launching intake for a new target takes under five minutes: name the deal, assign the template, generate the portal link, and send. The seller accesses their intake immediately — no account setup, no installation, no onboarding call required on their end.",
  },
  {
    question: "Does ClientEnforce integrate with deal management or CRM tools?",
    answer:
      "ClientEnforce is focused on intake enforcement and does not natively integrate with deal management platforms. Most roll-up teams use ClientEnforce for the seller-side intake process and then log completion status in their deal CRM manually or via export. Native integrations are on the roadmap.",
  },
  {
    question: "How does the audit trail support representations and warranties claims?",
    answer:
      "When a seller makes representations about their business in the acquisition agreement, the ability to prove what was disclosed — and when — matters if those representations turn out to be inaccurate. ClientEnforce logs every submission with a timestamp, document record, and completion status. This record is exportable as a PDF and provides a defensible account of what the seller submitted as part of their due diligence disclosure.",
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
  url: "https://clientenforce.com/roll-up-acquisition-software",
  description:
    "Roll-up acquisition intake system. Reusable templates, automated seller follow-up, cross-portfolio dashboard, and timestamped audit trail for PE-backed consolidators.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

const verticals = [
  { name: "Auto service & tire shops", example: "Vendors, POS systems, equipment, utilities, fleet accounts, facility profile" },
  { name: "HVAC & home services", example: "Equipment inventory, supplier contracts, technician licensing, service area documentation" },
  { name: "Dental & orthodontic practices", example: "Patient data protocols, equipment, lease agreements, provider credentialing" },
  { name: "Veterinary practices", example: "Equipment schedules, supplier agreements, staff licenses, facility compliance" },
  { name: "Physical therapy clinics", example: "Payer contracts, therapist credentials, equipment lists, facility compliance" },
  { name: "Insurance agencies", example: "Carrier appointments, book of business disclosure, E&O certificates, staff licensing" },
  { name: "Commercial cleaning & facilities", example: "Contract schedules, equipment inventory, crew documentation, insurance certificates" },
  { name: "Multi-location food service", example: "Health permits, equipment lists, lease schedules, supplier contracts" },
];

export default function RollUpAcquisitionSoftwarePage() {
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
              <span className="text-[var(--color-text-primary)]">Roll-Up Acquisition Software</span>
            </nav>
            <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
              Built for roll-up operators
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              The intake system built for roll-up acquisition operators
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-text-secondary)]">
              Build your standard due diligence template once. Deploy it for every new acquisition in five minutes. Get automated follow-up, required-item enforcement, and a cross-portfolio dashboard — so your ops team runs acquisitions at scale, not chaos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto">
                Start free — no credit card
              </Link>
              <Link href="/telletire" className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)] sm:w-auto">
                See TelleTire case study →
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* The roll-up problem */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Why roll-up intake breaks down at scale
              </h2>
              <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 text-[var(--color-text-secondary)]">
                <p>
                  The first acquisition is manageable on email. The tenth is not. Roll-up operators face a specific version of the due diligence problem: the same process, repeated across many sellers, with no consistency and no unified visibility.
                </p>
                <p>
                  Every seller is different — different responsiveness, different internal contacts, different document formats. Without a structured system, your ops team becomes a full-time document-chasing operation. Deals stall because nobody knows exactly what is missing from each seller. Post-closing disputes arise because there is no clear record of what was disclosed.
                </p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  ClientEnforce is the intake infrastructure layer that roll-ups are missing. One template, consistent enforcement, automated follow-up, and a full audit trail — for every deal you run.
                </p>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Comparison */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Spreadsheet tracking vs. roll-up acquisition intake software
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                Spreadsheet tracking of due diligence breaks the moment you run multiple acquisitions in parallel. Here is what changes when you switch to a purpose-built intake system.
              </p>
            </FadeUp>
            <FadeUp delay={80}>
              <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
                <table className="w-full min-w-[540px] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                      <th className="sticky left-0 bg-[var(--color-bg-subtle)] z-10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]" />
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Spreadsheet + Email</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">ClientEnforce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {([
                      ["Template consistency across deals", "Copy-paste from previous deal — errors creep in", "Single template deployed identically for every target"],
                      ["Seller experience", "Email PDF checklist, return documents in reply", "Unique portal link — structured checklist, no account needed"],
                      ["Required item enforcement", "None — sellers self-declare complete", "Required items block completion until submitted"],
                      ["Automated seller follow-up", "Manual — someone on your team sends chase emails", "Automated reminders on a schedule until every item is received"],
                      ["Visibility across parallel deals", "One spreadsheet row per deal — no completion metrics", "Real-time dashboard: completion % and outstanding items per deal"],
                      ["Audit trail", "Email timestamps, unreliable", "Full timestamped submission log, exportable as PDF"],
                      ["Setup per new acquisition", "30–60 min — copy checklist, prepare emails, set up folder", "Under 5 minutes once template is built"],
                      ["Scalability", "Breaks at 3–5 parallel deals", "Designed for 20+ simultaneous acquisitions"],
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
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-14">
          <PageContainer>
            <FadeUp>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Live roll-up case study</p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  TelleTire: acquiring tire shops with structured intake
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--color-text-secondary)]">
                  TelleTire operates a tire and auto service roll-up, acquiring independent shops across the US. Their due diligence intake template covers vendors and inventory (top 50 suppliers by spend), POS and shop management systems, labor rates and parts pricing, utilities and recurring service invoices, finance and payment processors, IT and website access, facility profiles, marketing and social presence, and equipment schedules with serial numbers. ClientEnforce deploys this same intake — 58 required items across 9 categories — for every new acquisition. Each seller gets a portal; TelleTire sees completion in real time.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/telletire" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]">
                    Read the TelleTire case study →
                  </Link>
                </div>
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* How it works for roll-ups */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                How roll-ups run intake through ClientEnforce
              </h2>
            </FadeUp>
            <div className="relative mt-10">
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { step: "01", title: "Build once", body: "Define your standard due diligence template — every document, disclosure, and question your deal requires. Build a separate template for each deal type if needed." },
                  { step: "02", title: "Deploy in minutes", body: "New acquisition signed an LOI? Generate their intake portal in under 5 minutes. Send the link — no account setup for the seller, no installation, no call required." },
                  { step: "03", title: "Sellers are chased automatically", body: "Outstanding items trigger reminders on your schedule. Sellers cannot submit partial intake without flagging what is missing. Your ops team sees what is blocking each deal." },
                  { step: "04", title: "Close with confidence", body: "Export a full timestamped audit trail for each acquisition. Every document received, every step confirmed — a defensible record for post-closing reference." },
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

        {/* Verticals */}
        <section className="border-b border-[var(--color-border)] bg-white py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Used across every fragmented vertical
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
                The intake challenge is the same regardless of sector. The template content changes; the system stays the same.
              </p>
            </FadeUp>
            <FadeUp delay={60}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {verticals.map((v, i) => (
                  <FadeUp key={v.name} delay={i * 40}>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                      <p className="font-semibold text-[var(--color-text-primary)]">{v.name}</p>
                      <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">{v.example}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </PageContainer>
        </section>

        {/* Choose section */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <PageContainer>
            <FadeUp>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] sm:text-[36px]" style={{ fontFamily: "var(--font-display)" }}>
                Is ClientEnforce right for your roll-up?
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <FadeUp>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] p-6">
                  <h3 className="text-xl font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>Strong fit if you:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Acquire the same type of business repeatedly (3+ per year)",
                      "Need consistent intake across every deal — same template, same enforcement",
                      "Have an ops team manually chasing sellers for missing documents",
                      "Want cross-portfolio visibility into what every active target has submitted",
                      "Need a defensible audit trail for R&W purposes or post-closing disputes",
                      "Are running parallel acquisitions and need a single status view",
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
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Look elsewhere if you need:</h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "A full VDR for buyer-side document review with multi-party NDA gating",
                      "Integrated deal pipeline management and CRM in the same tool",
                      "Financial analysis, modelling, or data room watermarking",
                      "Legal workflow automation for deal documentation",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-border-strong)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-[var(--color-text-muted)]">Many roll-ups use ClientEnforce for seller-side intake, then move completed submissions to a VDR or deal platform for buyer-side analysis and legal review.</p>
                </div>
              </FadeUp>
            </div>
          </PageContainer>
        </section>

        <CtaBand
          heading="Build your roll-up intake template today"
          subtext="One template. Unlimited acquisitions. Automated follow-up. Real-time dashboard. Start free and have your first intake live in under an hour."
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

        <section className="bg-[var(--color-bg-subtle)] py-12">
          <PageContainer>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Related</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { href: "/ma-due-diligence-software", label: "M&A due diligence software" },
                { href: "/acquisition-due-diligence-software", label: "Acquisition due diligence tool" },
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
