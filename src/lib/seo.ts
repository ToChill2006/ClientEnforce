import type { Metadata } from "next";

import { canonicalSiteOrigin } from "@/lib/app-url";

const SITE_NAME = "ClientEnforce";
const ORGANIZATION_ID = "/#organization";

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function siteUrl() {
  return canonicalSiteOrigin().replace(/\/$/, "");
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

type BuildSoftwareApplicationSchemaInput = {
  path: string;
  description?: string;
  name?: string;
};

export function buildSoftwareApplicationSchema(input: BuildSoftwareApplicationSchemaInput) {
  const name = input.name ?? SITE_NAME;
  const description =
    input.description ??
    "Client onboarding software that automates client intake, forms, workflows, and onboarding tasks for agencies and service businesses.";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": absoluteUrl(`${input.path}#softwareapplication`),
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: absoluteUrl(input.path),
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
