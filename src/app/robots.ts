import { MetadataRoute } from "next";

import { appOrigin } from "@/lib/app-url";

const PRIVATE_PATHS = [
  "/api/",
  "/auth/",
  "/c/",
  "/dashboard/",
  "/forgot-password",
  "/invite/",
  "/reset-password",
] as const;

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "CCBot",
  "PerplexityBot",
  "ClaudeBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  const origin = appOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_PATHS],
      },
      {
        userAgent: [...AI_CRAWLERS],
        allow: "/",
        disallow: [...PRIVATE_PATHS],
      },
    ],
    host: origin,
    sitemap: `${origin}/sitemap.xml`,
  };
}
