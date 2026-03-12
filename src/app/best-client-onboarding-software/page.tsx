import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("best-client-onboarding-software");

export const metadata = buildLandingMetadata("best-client-onboarding-software");

export default function BestClientOnboardingSoftwarePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("best-client-onboarding-software")} />;
}
