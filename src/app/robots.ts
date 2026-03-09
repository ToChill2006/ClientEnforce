import { MetadataRoute } from "next";

import { appOrigin } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const origin = appOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard",
          "/api",
          "/auth",
          "/c",
          "/invite",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
