import type { Metadata } from "next";
import {
  CheckCircle,
  Bell,
  Link as LinkIcon,
  ChartLineUp,
  Folder,
  ClockCounterClockwise,
  Palette,
  EnvelopeSimple,
  PlusCircle,
  UsersThree,
  UploadSimple,
  Export,
} from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/marketing-v2/Chrome";
import {
  Container,
  Section,
  Eyebrow,
  FinalCTA,
} from "@/components/marketing-v2/primitives";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "Features | ClientEnforce";
const description =
  "Structured intake, multi-phase onboarding, automatic reminders, white-label portal, activity logs, team roles, bulk import — every feature M&A operators need to run due diligence.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/features" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/features`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const features = [
  {
    icon: LinkIcon,
    title: "Structured intake (no login for targets)",
    body: "Each acquisition target gets a unique link. They open it, complete each section, and submit — no account, no password, no friction. You stay in control of the structure.",
  },
  {
    icon: CheckCircle,
    title: "Multi-phase onboarding with approve/reject",
    body: "Break diligence into phases. Review each phase as it lands, approve to unlock the next, or reject with comments so the seller knows exactly what to fix.",
  },
  {
    icon: Bell,
    title: "Automatic reminders with deadline triggers",
    body: "Set a deadline per section. Multi-tier reminder rules nudge sellers before things slip — daily, then escalating. You stop being the chaser.",
  },
  {
    icon: ChartLineUp,
    title: "Single dashboard across all active deals",
    body: "Every active acquisition, every outstanding item, every overdue section — in one view. Filter by deal, by phase, by status.",
  },
  {
    icon: Folder,
    title: "File storage isolated per deal",
    body: "Each onboarding has its own document space, organised by section. No cross-contamination between targets, no shared folders to manage.",
  },
  {
    icon: Palette,
    title: "White-label portal with custom domain",
    body: "Your brand throughout the seller experience. Custom domain, logo, colours — Enterprise plan unlocks full white-label.",
  },
  {
    icon: ClockCounterClockwise,
    title: "Activity log per onboarding",
    body: "Timestamped history of every action — submissions, approvals, comments, edits. Full audit trail for every deal.",
  },
  {
    icon: EnvelopeSimple,
    title: "Email notifications for every action",
    body: "Real-time emails when sellers submit, edit a section, upload documents, or hit a deadline. Stay informed without checking the dashboard.",
  },
  {
    icon: PlusCircle,
    title: "Ad-hoc requirements on live onboardings",
    body: "Forgot something? Need an extra document mid-flight? Add new requirements to an active onboarding without starting over.",
  },
  {
    icon: UsersThree,
    title: "Team roles and permissions",
    body: "Invite colleagues, assign roles, scope access per deal. Keep partners and analysts in the loop without exposing every onboarding.",
  },
  {
    icon: UploadSimple,
    title: "Bulk CSV import",
    body: "Import a batch of targets or requirements from a spreadsheet. Useful when migrating from email or kicking off a roll-up at speed.",
  },
  {
    icon: Export,
    title: "Evidence and bulk export",
    body: "Export documents, responses, and the full activity log per deal — for IC packs, legal review, or closing handover.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <Section ariaLabel="Features hero" className="pt-20 sm:pt-24 lg:pt-28">
        <Container className="max-w-3xl text-center">
          <Eyebrow>Features</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Every feature you need to run M&amp;A diligence.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Built for operators running multiple acquisitions in parallel. No
            login for sellers, full audit trail for you.
          </p>
        </Container>
      </Section>

      <Section ariaLabel="Feature list" className="pt-0">
        <Container>
          <ul className="grid gap-6 md:grid-cols-2">
            {features.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 text-white">
                  <Icon size={24} aria-hidden />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-slate-950 sm:text-xl">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA />
    </MarketingShell>
  );
}
