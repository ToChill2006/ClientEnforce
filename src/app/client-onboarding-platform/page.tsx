import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("client-onboarding-platform");

export const metadata = buildLandingMetadata("client-onboarding-platform");

export default function ClientOnboardingPlatformPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("client-onboarding-platform")} />;
}
