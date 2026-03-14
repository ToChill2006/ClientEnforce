import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("onboarding-workflow-software");

export const metadata = buildLandingMetadata("onboarding-workflow-software");

export default function OnboardingWorkflowSoftwarePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("onboarding-workflow-software")} />;
}
