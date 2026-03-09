import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-software-for-agencies");

export const metadata = buildLandingMetadata("client-onboarding-software-for-agencies");

export default function ClientOnboardingSoftwareForAgenciesPage() {
  return (
    <SeoLandingTemplate
      page={page}
      schema={buildLandingSchemas("client-onboarding-software-for-agencies")}
    />
  );
}
