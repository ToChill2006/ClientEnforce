import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-intake-and-onboarding-software");

export const metadata = buildLandingMetadata("client-intake-and-onboarding-software");

export default function ClientIntakeAndOnboardingSoftwarePage() {
  return (
    <SeoLandingTemplate
      page={page}
      schema={buildLandingSchemas("client-intake-and-onboarding-software")}
    />
  );
}
