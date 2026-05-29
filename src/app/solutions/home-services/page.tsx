import type { Metadata } from "next";
import { SolutionPage } from "@/components/marketing-v2/SolutionPage";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "M&A Due Diligence Software for Home Services Roll-ups";
const description =
  "Structured due diligence intake for HVAC, plumbing and home services acquisitions. One link per service business owner, every section tracked, automatic reminders.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/solutions/home-services" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/solutions/home-services`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomeServicesSolutionPage() {
  return (
    <SolutionPage
      eyebrow="Home services roll-ups"
      h1="Structured intake for HVAC, plumbing and home services acquisitions."
      sub="ClientEnforce gives home services roll-up operators structured intake. One link per service business owner, every section tracked, automatic reminders. No login required on their side."
      audience="service business owners"
      problems={[
        "Email threads with service business owners",
        "Documents in wrong formats",
        "No visibility across deals",
      ]}
      steps={[
        "Configure your due diligence template — we help on Day 1",
        "Each service business owner gets a unique link — no login required on their side",
        "They complete intake section by section",
        "Missing items trigger automatic reminders",
        "You see everything in one dashboard across all active deals",
      ]}
      related={[
        { href: "/onboarding-software-for-service-businesses", label: "Onboarding software for service businesses →" },
        { href: "/roll-up-acquisition-software", label: "Roll-up acquisition software →" },
        { href: "/ma-due-diligence-software", label: "M&A due diligence software →" },
        { href: "/case-study/telletire", label: "Telletire case study →" },
        { href: "/features", label: "All features →" },
        { href: "/pricing", label: "Pricing →" },
      ]}
    />
  );
}
