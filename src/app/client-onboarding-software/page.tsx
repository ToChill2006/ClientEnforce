import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { SoftwareApplicationJsonLd } from "@/components/seo/software-application-jsonld";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-software");

export const metadata = buildLandingMetadata("client-onboarding-software");

export default function ClientOnboardingSoftwarePage() {
  return (
    <>
      <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-software")} />
      <SoftwareApplicationJsonLd path="/client-onboarding-software" description={page.description} />
    </>
  );
}
