import { MetadataRoute } from "next";
import { sitemapPublicPaths } from "@/lib/content/seo-content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return sitemapPublicPaths.map((path) => {
    const isHome = path === "/";
    const isMoneyPage = path === "/client-onboarding-software";
    const isBlogPost = path.startsWith("/blog/");

    return {
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: isBlogPost ? "monthly" : "weekly",
      priority: isHome ? 1 : isMoneyPage ? 0.95 : isBlogPost ? 0.72 : 0.85,
    } satisfies MetadataRoute.Sitemap[number];
  });
}
