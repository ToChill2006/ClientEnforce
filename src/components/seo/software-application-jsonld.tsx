import { JsonLd } from "@/components/marketing/public-shell";
import { buildSoftwareApplicationSchema } from "@/lib/seo";

type SoftwareApplicationJsonLdProps = {
  path: string;
};

export function SoftwareApplicationJsonLd({ path }: SoftwareApplicationJsonLdProps) {
  return <JsonLd data={buildSoftwareApplicationSchema(path)} />;
}
