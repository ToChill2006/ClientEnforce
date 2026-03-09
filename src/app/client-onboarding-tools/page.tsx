import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-tools");

export const metadata = buildLandingMetadata("client-onboarding-tools");

export default function ClientOnboardingToolsPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-tools")} />;
}
