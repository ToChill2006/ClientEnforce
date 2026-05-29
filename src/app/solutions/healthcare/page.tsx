import type { Metadata } from "next";
import { SolutionPage } from "@/components/marketing-v2/SolutionPage";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "M&A Due Diligence Software for Healthcare Practice Acquisitions";
const description =
  "Collect due diligence from dental, veterinary and healthcare practice sellers. One link per practice owner, every section tracked, automatic reminders.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/solutions/healthcare" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/solutions/healthcare`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HealthcareSolutionPage() {
  return (
    <SolutionPage
      eyebrow="Healthcare acquisitions"
      h1="Collect due diligence from dental, veterinary and healthcare practice sellers."
      sub="ClientEnforce gives healthcare acquirers structured intake. One link per practice owner, every section tracked, automatic reminders. No login required on their side."
      audience="practice owners"
      problems={[
        "Email threads with practice owners",
        "Documents in wrong formats",
        "No visibility across deals",
      ]}
      steps={[
        "Configure your due diligence template — we help on Day 1",
        "Each practice owner gets a unique link — no login required on their side",
        "They complete intake section by section",
        "Missing items trigger automatic reminders",
        "You see everything in one dashboard across all active deals",
      ]}
      related={[
        { href: "/dental-practices", label: "Dental practice onboarding →" },
        { href: "/health-wellness", label: "Health & wellness onboarding →" },
        { href: "/roll-up-acquisition-software", label: "Roll-up acquisition software →" },
        { href: "/ma-due-diligence-software", label: "M&A due diligence software →" },
        { href: "/case-study/telletire", label: "Telletire case study →" },
        { href: "/pricing", label: "Pricing →" },
      ]}
    />
  );
}
