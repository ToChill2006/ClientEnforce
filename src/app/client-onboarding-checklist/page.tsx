import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-checklist");

export const metadata = buildLandingMetadata("client-onboarding-checklist");

export default function ClientOnboardingChecklistPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-checklist")} />;
}
