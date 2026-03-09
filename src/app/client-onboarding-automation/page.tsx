import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-automation");

export const metadata = buildLandingMetadata("client-onboarding-automation");

export default function ClientOnboardingAutomationPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-automation")} />;
}
