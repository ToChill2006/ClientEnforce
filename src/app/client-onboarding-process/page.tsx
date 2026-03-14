import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-process");

export const metadata = buildLandingMetadata("client-onboarding-process");

export default function ClientOnboardingProcessPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-process")} />;
}
