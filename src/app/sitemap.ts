import { MetadataRoute } from "next";
import { sitemapPublicPaths } from "@/lib/content/seo-content";
import { allLpPaths } from "@/lib/verticals";
import { absoluteUrl } from "@/lib/seo";

// Pages recently updated (May 2026) — signal freshness to search engines
const recentlyUpdatedPaths = new Set([
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/rocketlane-alternative",
  "/guidecx-alternative",
  "/dubsado-vs-honeybook",
  "/copilot-alternative",
  "/bonsai-alternative",
  "/dubsado-pricing-guide",
  "/honeybook-pricing-guide",
  "/client-portal-software",
  "/client-intake-software",
  "/client-onboarding-software",
  "/client-onboarding-software-for-agencies",
  "/client-onboarding-automation",
  "/client-onboarding-checklist",
  "/client-onboarding-process",
  "/onboarding-software-for-service-businesses",
  "/accountants",
  "/consultants",
  "/agencies",
  "/auto-service",
  "/best-client-onboarding-software",
  "/blog/honeybook-alternatives",
  "/blog/client-onboarding-checklist-template",
  "/fleet-account-onboarding",
  "/multi-location-client-onboarding",
  "/franchise-onboarding-software",
  "/commercial-client-intake",
]);

// High-priority comparison and landing pages beyond the main money page
const highPriorityPages = new Set([
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/copilot-alternative",
  "/bonsai-alternative",
  "/client-portal-software",
  "/client-intake-software",
  "/client-onboarding-software-for-agencies",
  "/client-onboarding-automation",
  "/client-onboarding-checklist",
  "/best-client-onboarding-software",
  "/rocketlane-alternative",
  "/dubsado-vs-honeybook",
  "/accountants",
  "/fleet-account-onboarding",
  "/multi-location-client-onboarding",
  "/franchise-onboarding-software",
  "/commercial-client-intake",
]);

// Paths excluded from sitemap — gated lead magnets and paid LPs (noindex,follow).
// These should not compete with canonical pages in SERPs and have no organic role.
const excludedFromSitemap = new Set<string>([
  "/downloads/client-onboarding-checklist",
  "/downloads/client-onboarding-checklist/view",
  "/downloads/fleet-account-onboarding-checklist",
  "/downloads/fleet-account-onboarding-checklist/view",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const recentDate = new Date("2026-05-04");

  const additionalPublicPaths = [
    "/copilot-alternative",
    "/bonsai-alternative",
    "/client-portal-software",
    "/client-intake-software",
    "/accountants",
    "/consultants",
    "/honeybook-pricing-guide",
    "/dubsado-pricing-guide",
    "/dubsado-vs-honeybook",
    "/blog/why-client-onboarding-fails",
    "/blog/client-onboarding-checklist-template",
    "/best-client-onboarding-software",
    "/blog/how-to-stop-chasing-clients-during-onboarding",
    "/blog/client-onboarding-guide",
    "/blog/honeybook-alternatives",
    "/blog/what-is-client-onboarding",
    // Blog posts (template-driven)
    "/blog/client-intake-form-template",
    "/blog/client-intake-process",
    "/client-onboarding-automation",
    "/blog/client-onboarding-best-practices",
    "/blog/client-onboarding-email-templates",
    "/blog/client-onboarding-mistakes",
    "/client-onboarding-process",
    "/blog/client-onboarding-workflow",
    "/fleet-account-onboarding",
    "/blog/how-to-improve-client-onboarding",
    "/blog/how-to-onboard-new-clients",
    "/blog/how-to-standardize-client-onboarding",
    "/blog/onboarding-automation-tools",
    "/blog/onboarding-documents-for-clients",
    "/blog/onboarding-experience-tips",
    "/resources/agency-onboarding-checklist",
    "/resources/consultant-intake-checklist",
    "/rocketlane-alternative",
    "/guidecx-alternative",
    // Vertical pages (canonical winners)
    "/fleet-account-onboarding",
    "/multi-location-client-onboarding",
    "/franchise-onboarding-software",
    "/commercial-client-intake",
    // Industry pages
    "/agencies",
    "/consultants",
    "/accountants",
    "/ops-teams",
    "/auto-service",
    "/dental-practices",
    "/health-wellness",
    "/law-firm",
    "/financial-advisors",
  ] as const;

  // /lp/* are paid landing pages set to noindex,follow — exclude from sitemap entirely.
  void allLpPaths;

  const canonicalPaths = Array.from(
    new Set([...sitemapPublicPaths, ...additionalPublicPaths]),
  ).filter((p) => !excludedFromSitemap.has(p));

  return canonicalPaths.map((path) => {
    const isHome = path === "/";
    const isMoneyPage = path === "/client-onboarding-software";
    const isHighPriority = highPriorityPages.has(path);
    const isBlogPost = path.startsWith("/blog/");
    const isHighValueBlog = path === "/blog/best-client-onboarding-software";
    const wasRecentlyUpdated = recentlyUpdatedPaths.has(path);

    return {
      url: absoluteUrl(path),
      lastModified: wasRecentlyUpdated ? recentDate : now,
      changeFrequency: isBlogPost ? "monthly" : "weekly",
      priority: isHome
        ? 1
        : isMoneyPage
          ? 0.95
          : isHighPriority
            ? 0.9
            : isHighValueBlog
              ? 0.85
              : isBlogPost
                ? 0.72
                : 0.85,
    } satisfies MetadataRoute.Sitemap[number];
  });
}
