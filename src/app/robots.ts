import { MetadataRoute } from "next";

import { appOrigin } from "@/lib/app-url";

const PRIVATE_PATHS = [
  "/api",
  "/auth",
  "/c",
  "/dashboard",
  "/forgot-password",
  "/invite",
  "/login",
  "/reset-password",
  "/signup",
] as const;

const PUBLIC_INDEXABLE_PATHS = [
  "/",
  "/blog",
  "/client-onboarding-software",
  "/client-onboarding-tools",
  "/client-onboarding-checklist",
  "/client-onboarding-automation",
  "/dubsado-alternative",
  "/honeybook-alternative",
  "/client-onboarding-software-for-agencies",
  "/pricing",
  "/features",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
] as const;

export default function robots(): MetadataRoute.Robots {
  const origin = appOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [...PUBLIC_INDEXABLE_PATHS],
        disallow: [...PRIVATE_PATHS],
      },
    ],
    host: origin,
    sitemap: `${origin}/sitemap.xml`,
  };
}
