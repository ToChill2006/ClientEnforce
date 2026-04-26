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
      // SEO consolidation — kill keyword cannibalization (April 2026)
      // Each cluster keeps one canonical page; siblings 301 to it.

      // Checklist cluster — canonical: /blog/client-onboarding-checklist-template
      { source: "/blog/client-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/onboarding-new-clients-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/customer-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/agency-client-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },

      // Automation cluster — canonical: /blog/client-onboarding-automation
      { source: "/blog/automate-client-onboarding", destination: "/blog/client-onboarding-automation", permanent: true },
      { source: "/blog/how-to-automate-client-onboarding", destination: "/blog/client-onboarding-automation", permanent: true },
      { source: "/blog/automated-onboarding-workflows", destination: "/blog/client-onboarding-automation", permanent: true },
      { source: "/blog/onboarding-automation-guide", destination: "/blog/client-onboarding-automation", permanent: true },

      // Process cluster — canonical: /blog/client-onboarding-process
      { source: "/blog/onboarding-process-steps", destination: "/blog/client-onboarding-process", permanent: true },

      // Agencies cluster — canonical: /client-onboarding-software-for-agencies
      { source: "/onboarding-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
      { source: "/blog/client-onboarding-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
      { source: "/blog/onboarding-process-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },

      // Best-of cluster — canonical: /blog/best-client-onboarding-software-2026
      { source: "/blog/best-client-onboarding-software", destination: "/blog/best-client-onboarding-software-2026", permanent: true },

      {
        source: "/:path*",
        has: [{ type: "host", value: "www.clientenforce.com" }],
        destination: "https://clientenforce.com/:path*",
        permanent: true,
      },
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
