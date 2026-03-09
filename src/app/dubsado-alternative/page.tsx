import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("dubsado-alternative");

export const metadata = buildLandingMetadata("dubsado-alternative");

export default function DubsadoAlternativePage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("dubsado-alternative")} />;
}
