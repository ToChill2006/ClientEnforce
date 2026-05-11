import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // SEO consolidation — May 2026 canonical map

      // Process cluster — commercial intent wins; blog pages 301 to LP
      { source: "/client-onboarding-process", destination: "/client-onboarding-software", permanent: true },
      { source: "/blog/client-onboarding-process", destination: "/client-onboarding-software", permanent: true },
      { source: "/blog/onboarding-process-steps", destination: "/client-onboarding-software", permanent: true },

      // Platform / tools cluster — /best-client-onboarding-software is the canonical LP
      { source: "/client-onboarding-tools", destination: "/best-client-onboarding-software", permanent: true },
      { source: "/client-onboarding-platform", destination: "/client-onboarding-software", permanent: true },
      { source: "/onboarding-workflow-software", destination: "/client-onboarding-software", permanent: true },
      { source: "/blog/best-client-onboarding-software-2026", destination: "/best-client-onboarding-software", permanent: true },
      { source: "/blog/best-client-onboarding-software", destination: "/best-client-onboarding-software", permanent: true },

      // Checklist cluster — money page wins
      { source: "/blog/client-onboarding-checklist-template", destination: "/client-onboarding-checklist", permanent: true },
      { source: "/blog/client-onboarding-checklist", destination: "/client-onboarding-checklist", permanent: true },
      { source: "/blog/onboarding-new-clients-checklist", destination: "/client-onboarding-checklist", permanent: true },
      { source: "/blog/customer-onboarding-checklist", destination: "/client-onboarding-checklist", permanent: true },
      { source: "/blog/agency-client-onboarding-checklist", destination: "/client-onboarding-checklist", permanent: true },

      // HoneyBook comparison — single canonical
      { source: "/blog/honeybook-alternatives", destination: "/honeybook-alternative", permanent: true },

      // Vertical consolidation
      { source: "/onboarding-for-consultants", destination: "/consultants", permanent: true },
      { source: "/onboarding-for-accountants", destination: "/accountants", permanent: true },
      { source: "/onboarding-for-agencies", destination: "/agencies", permanent: true },

      // Intake consolidation
      { source: "/client-intake-and-onboarding-software", destination: "/client-intake-software", permanent: true },

      // Automation cluster
      { source: "/blog/client-onboarding-automation", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/automate-client-onboarding", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/how-to-automate-client-onboarding", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/automated-onboarding-workflows", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/onboarding-automation-guide", destination: "/client-onboarding-automation", permanent: true },

      // www → apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.clientenforce.com" }],
        destination: "https://clientenforce.com/:path*",
        permanent: true,
      },

      { source: "/blog/client-onboarding-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
      { source: "/blog/onboarding-process-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
