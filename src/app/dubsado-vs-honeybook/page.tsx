import { SeoLandingTemplate } from "@/components/marketing/seo-pages";
import { buildLandingMetadata, buildLandingSchemas, getLandingPage } from "@/lib/content/seo-helpers";

const page = getLandingPage("dubsado-vs-honeybook");

export const metadata = buildLandingMetadata("dubsado-vs-honeybook");

export default function DubsadoVsHoneyBookPage() {
  return <SeoLandingTemplate page={page} schema={buildLandingSchemas("dubsado-vs-honeybook")} />;
}
