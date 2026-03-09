import type { Metadata } from "next";

import { appOrigin } from "@/lib/app-url";

const SITE_NAME = "ClientEnforce";

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function siteUrl() {
  return appOrigin().replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const base = siteUrl();
  const normalizedPath = normalizePath(path);
  if (normalizedPath === "/") return base;
  return `${base}${normalizedPath}`;
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function buildPageMetadata(input: BuildMetadataInput): Metadata {
  const url = absoluteUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: input.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildSoftwareApplicationSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ClientEnforce",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "ClientEnforce is client onboarding software for document collection, signatures, follow-ups, progress tracking, templates, and a secure client portal.",
    url: absoluteUrl(path),
    brand: {
      "@type": "Brand",
      name: "ClientEnforce",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      category: "Client onboarding software",
      url: absoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
  };
}

type BlogPostingSchemaInput = {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime: string;
  keywords?: string[];
};

export function buildBlogPostingSchema(input: BlogPostingSchemaInput) {
  const url = absoluteUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime,
    inLanguage: "en",
    keywords: input.keywords,
    author: {
      "@type": "Organization",
      name: "ClientEnforce",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "ClientEnforce",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/apple-touch-icon.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function jsonLdString(data: Record<string, unknown>) {
  return JSON.stringify(data);
}
