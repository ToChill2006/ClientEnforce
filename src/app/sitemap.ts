import { MetadataRoute } from "next";
import { sitemapPublicPaths } from "@/lib/content/seo-content";
import { allLpPaths } from "@/lib/verticals";
import { absoluteUrl } from "@/lib/seo";

// Pages recently updated (April 2026) — signal freshness to search engines
const recentlyUpdatedPaths = new Set([
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/rocketlane-alternative",
  "/dubsado-vs-honeybook",
  "/copilot-alternative",
  "/bonsai-alternative",
  "/client-portal-software",
  "/client-intake-software",
  "/client-onboarding-software",
  "/client-onboarding-software-for-agencies",
  "/client-onboarding-automation",
  "/client-onboarding-checklist",
  "/onboarding-for-accountants",
  "/blog/best-client-onboarding-software",
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
  "/client-onboarding-tools",
  "/rocketlane-alternative",
  "/dubsado-vs-honeybook",
  "/onboarding-for-agencies",
  "/onboarding-for-accountants",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const recentDate = new Date("2026-04-05");

  const additionalPublicPaths = [
    "/copilot-alternative",
    "/bonsai-alternative",
    "/client-portal-software",
    "/client-intake-software",
    "/onboarding-for-agencies",
    "/onboarding-for-accountants",
    "/onboarding-for-consultants",
    "/honeybook-pricing-guide",
    "/dubsado-pricing-guide",
    "/dubsado-vs-honeybook",
    "/downloads/client-onboarding-checklist",
    "/downloads/client-onboarding-checklist/view",
    "/blog/why-client-onboarding-fails",
    "/blog/client-onboarding-checklist-template",
    "/blog/best-client-onboarding-software-2026",
    "/blog/how-to-stop-chasing-clients-during-onboarding",
    "/blog/client-onboarding-guide",
    "/blog/honeybook-alternatives",
    "/blog/what-is-client-onboarding",
    "/resources/agency-onboarding-checklist",
    "/resources/consultant-intake-checklist",
    "/downloads/fleet-account-onboarding-checklist",
    "/downloads/fleet-account-onboarding-checklist/view",
    "/rocketlane-alternative",
    "/guidecx-alternative",
    // Industry / vertical pages
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

  const canonicalPaths = Array.from(new Set([...sitemapPublicPaths, ...additionalPublicPaths, ...allLpPaths]));

  return canonicalPaths.map((path) => {
    const isHome = path === "/";
    const isMoneyPage = path === "/client-onboarding-software";
    const isHighPriority = highPriorityPages.has(path);
    const isBlogPost = path.startsWith("/blog/");
    const isHighValueBlog = path === "/blog/best-client-onboarding-software";
    const isLpVertical = path.startsWith("/lp/") && path.split("/").length === 3;
    const isLpSubPage = path.startsWith("/lp/") && path.split("/").length === 4;
    const wasRecentlyUpdated = recentlyUpdatedPaths.has(path);

    return {
      url: absoluteUrl(path),
      lastModified: wasRecentlyUpdated ? recentDate : now,
      changeFrequency: isBlogPost || isLpVertical || isLpSubPage ? "monthly" : "weekly",
      priority: isHome
        ? 1
        : isMoneyPage
          ? 0.95
          : isHighPriority
            ? 0.9
            : isHighValueBlog
              ? 0.85
              : isLpVertical
                ? 0.8
                : isLpSubPage
                  ? 0.75
                  : isBlogPost
                    ? 0.72
                    : 0.85,
    } satisfies MetadataRoute.Sitemap[number];
  });
}
