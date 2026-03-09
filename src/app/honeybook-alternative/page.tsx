import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("honeybook-alternative");

export const metadata = buildLandingMetadata("honeybook-alternative");

export default function HoneyBookAlternativePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("honeybook-alternative")} />;
}
