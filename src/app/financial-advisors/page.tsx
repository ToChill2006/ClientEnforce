import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { UsVerticalPage } from "@/components/marketing/us-vertical-page";
import { usVerticalBySlug } from "@/lib/us-landing-verticals";

const config = usVerticalBySlug["financial-advisors"]!;

export const metadata: Metadata = buildPageMetadata({
  title: config.metaTitle,
  description: config.metaDescription,
  path: "/financial-advisors",
  keywords: config.keywords,
  type: "website",
});

export default function FinancialAdvisorsPage() {
  return <UsVerticalPage config={config} />;
}
