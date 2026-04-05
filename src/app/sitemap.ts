import { MetadataRoute } from "next";
import { sitemapPublicPaths } from "@/lib/content/seo-content";
import { absoluteUrl } from "@/lib/seo";

// Pages recently updated (April 2026) — signal freshness to search engines
const recentlyUpdatedPaths = new Set([
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/client-onboarding-software-for-agencies",
  "/blog/best-client-onboarding-software",
]);

// High-priority comparison and landing pages beyond the main money page
const highPriorityPages = new Set([
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/client-onboarding-software-for-agencies",
  "/client-onboarding-automation",
  "/client-onboarding-checklist",
  "/client-onboarding-tools",
  "/onboarding-for-agencies",
  "/onboarding-for-accountants",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const recentDate = new Date("2026-04-05");

  const additionalPublicPaths = [
    "/onboarding-for-agencies",
    "/onboarding-for-accountants",
    "/onboarding-for-consultants",
    "/dubsado-vs-honeybook",
    "/downloads/client-onboarding-checklist",
    "/blog/why-client-onboarding-fails",
    "/blog/client-onboarding-checklist-template",
    "/blog/best-client-onboarding-software-2026",
  ] as const;

  const canonicalPaths = Array.from(new Set([...sitemapPublicPaths, ...additionalPublicPaths]));

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
