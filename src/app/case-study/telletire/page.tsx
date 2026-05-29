import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/marketing-v2/Chrome";
import {
  Container,
  Section,
  Eyebrow,
  Stat,
  PullQuote,
  PrimaryDemoButton,
} from "@/components/marketing-v2/primitives";
import { CASE_STUDY_PDF } from "@/components/marketing-v2/constants";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "Telletire case study | ClientEnforce";
const description =
  "How Telletire runs 2 simultaneous tire shop acquisitions from one dashboard — without follow-up emails, spreadsheets, or chasing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-study/telletire" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/case-study/telletire`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function TelletireCaseStudy() {
  return (
    <MarketingShell>
      <Section ariaLabel="Case study hero" className="pt-20 sm:pt-24 lg:pt-28">
        <Container className="max-w-4xl">
          <Eyebrow>Case study</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            How Telletire runs 2 simultaneous acquisitions from one dashboard.
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Tire shop M&amp;A roll-up operator · Kansas City, US
          </p>
        </Container>
      </Section>

      <Section ariaLabel="Outcomes" className="pt-0">
        <Container className="max-w-4xl">
          <dl className="grid gap-10 rounded-xl border border-slate-200 bg-white p-8 sm:grid-cols-3 sm:p-10">
            <Stat value="1" label="System replacing email + spreadsheets" />
            <Stat value="9" label="Sections per due diligence questionnaire" />
            <Stat value="0" label="Follow-up emails for missing documents" />
          </dl>
        </Container>
      </Section>

      <Section ariaLabel="The challenge" className="bg-white border-y border-slate-200">
        <Container className="max-w-3xl">
          <Eyebrow>The challenge</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Email chaos across multiple parallel acquisitions.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Tim runs M&amp;A integration at Telletire — a tire shop roll-up
              operator acquiring multiple businesses in parallel. Every
              acquisition required the same nine-section due diligence
              questionnaire, and every section turned into its own email thread.
            </p>
            <p>
              Sellers replied at different times, attached files in different
              formats, missed sections, and answered other sections twice. Tim
              spent more time chasing documents than evaluating businesses. His
              inbox became the project tracker — and it stopped scaling at deal
              two.
            </p>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Why ClientEnforce">
        <Container className="max-w-3xl">
          <Eyebrow>Why ClientEnforce</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Intake-first, no login, structured by section.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              ClientEnforce flips the model. Tim configures the nine-section
              template once. Every new acquisition target gets a unique link —
              no account, no login.
            </p>
            <p>
              Sellers walk through the questionnaire section by section. Missing
              items trigger automatic reminders. Tim sees every deal in one
              dashboard and approves each phase before the next unlocks.
            </p>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="The result" className="bg-white border-y border-slate-200">
        <Container className="max-w-3xl">
          <Eyebrow>The result</Eyebrow>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Two simultaneous deals. One dashboard. Zero chasing.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Telletire now runs two acquisitions in parallel from a single
              ClientEnforce dashboard. The nine-section template applies to
              every new target. Sellers complete intake without the email
              ping-pong; Tim reviews phase-by-phase.
            </p>
            <p>
              When Tim needed an additional requirement added mid-flight to a
              live onboarding, we shipped it within the week — the kind of
              roadmap responsiveness an off-the-shelf SaaS tool can&rsquo;t
              match.
            </p>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Customer testimonial">
        <Container className="max-w-4xl">
          <PullQuote
            quote="ClientEnforce checks all the boxes for managing tasks, tracking, and workflow needs — we'd highly recommend it to any organization looking for a more effective and user-friendly solution."
            name="Tim Tuckfield"
            role="M&A Integration & Optimization, Telletire"
          />
          <div className="mt-8">
            <Link
              href={CASE_STUDY_PDF}
              className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2"
            >
              Download the full case study (PDF){" "}
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
          </div>
        </Container>
      </Section>

      <Section ariaLabel="Call to action" className="bg-slate-900 text-white">
        <Container className="max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            See how it works for your acquisition workflow.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
            20 minutes. We&rsquo;ll show you the dashboard, the seller flow, and
            the reminder rules using your template.
          </p>
          <div className="mt-10 flex justify-center">
            <PrimaryDemoButton label="Book a demo" />
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
