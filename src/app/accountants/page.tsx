import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { UsVerticalPage } from "@/components/marketing/us-vertical-page";
import { usVerticalBySlug } from "@/lib/us-landing-verticals";

const config = usVerticalBySlug["accountants"]!;

export const metadata: Metadata = buildPageMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: "/accountants",
  keywords: config.keywords,
  type: "website",
});

export default function AccountantsPage() {
  return <UsVerticalPage config={config} />;
}
