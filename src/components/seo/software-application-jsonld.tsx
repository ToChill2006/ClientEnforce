import { JsonLd } from "@/components/marketing/public-shell";
import { buildSoftwareApplicationSchema } from "@/lib/seo";

type SoftwareApplicationJsonLdProps = {
  path: string;
  description?: string;
};

export function SoftwareApplicationJsonLd({ path, description }: SoftwareApplicationJsonLdProps) {
  return <JsonLd data={buildSoftwareApplicationSchema({ path, description })} />;
}
