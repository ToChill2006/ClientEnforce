import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("onboarding-software-for-service-businesses");

export const metadata = buildLandingMetadata("onboarding-software-for-service-businesses");

export default function OnboardingSoftwareForServiceBusinessesPage() {
  return (
    <SeoLandingTemplate
      page={page}
      schema={buildLandingSchemas("onboarding-software-for-service-businesses")}
    />
  );
}
