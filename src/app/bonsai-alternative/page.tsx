import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("bonsai-alternative");

export const metadata = buildLandingMetadata("bonsai-alternative");

export default function BonsaiAlternativePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("bonsai-alternative")} />;
}
