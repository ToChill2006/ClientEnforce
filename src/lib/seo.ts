import type { Metadata } from "next";

import { appOrigin } from "@/lib/app-url";

const SITE_NAME = "ClientEnforce";
const ORGANIZATION_ID = "/#organization";

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

type BuildNoindexMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildNoindexMetadata(input: BuildNoindexMetadataInput): Metadata {
  const url = absoluteUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
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

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl(ORGANIZATION_ID),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "ClientEnforce is client onboarding software for document collection, signatures, follow-ups, templates, and progress tracking.",
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/apple-touch-icon.png"),
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "ClientEnforce helps service teams automate client onboarding workflows with one secure portal.",
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl(ORGANIZATION_ID),
    },
    inLanguage: "en",
  };
}

export function buildSoftwareApplicationSchema(path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(`${path}#softwareapplication`),
    name: "ClientEnforce",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    description:
      "ClientEnforce is client onboarding software for document collection, signatures, follow-ups, progress tracking, templates, and a secure client portal.",
    url: absoluteUrl(path),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl(ORGANIZATION_ID),
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    isAccessibleForFree: true,
    featureList: [
      "Client onboarding workflow templates",
      "Document collection and file uploads",
      "E-signatures and approval capture",
      "Automated reminders and follow-ups",
      "Progress tracking and audit timeline",
    ],
    offers: {
      "@type": "Offer",
      url: absoluteUrl("/pricing"),
      price: "0",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
  };
}

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

export function buildFaqPageSchema(items: FaqSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
    keywords: input.keywords?.join(", "),
    author: {
      "@type": "Organization",
      "@id": absoluteUrl(ORGANIZATION_ID),
    },
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl(ORGANIZATION_ID),
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

export function jsonLdString(data: unknown) {
  return JSON.stringify(data);
}
