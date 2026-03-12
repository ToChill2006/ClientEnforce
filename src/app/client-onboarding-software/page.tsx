import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-software");

export const metadata = buildLandingMetadata("client-onboarding-software");

export default function ClientOnboardingSoftwarePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-software")} />;
}
