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
      // SEO cannibalisation consolidation — see 04_SEO_Action_Plan v1.0 (May 2026).
      // Each cluster keeps one canonical page; siblings 301 to it. All chains resolve
      // in a single hop — Google does not always follow 301 chains cleanly.

      // === Cluster A — head term: "client onboarding software" ===
      // Canonical: /client-onboarding-software (LP)
      { source: "/client-onboarding-platform", destination: "/client-onboarding-software", permanent: true },
      { source: "/client-intake-and-onboarding-software", destination: "/client-onboarding-software", permanent: true },
      { source: "/onboarding-workflow-software", destination: "/client-onboarding-software", permanent: true },

      // Best-of cluster — Canonical: /best-client-onboarding-software (LP)
      { source: "/client-onboarding-tools", destination: "/best-client-onboarding-software", permanent: true },
      { source: "/blog/best-client-onboarding-software-2026", destination: "/best-client-onboarding-software", permanent: true },
      { source: "/blog/best-client-onboarding-software", destination: "/best-client-onboarding-software", permanent: true },

      // === Cluster C — "client onboarding process" ===
      // Canonical: /client-onboarding-process (LP)
      { source: "/blog/client-onboarding-process", destination: "/client-onboarding-process", permanent: true },
      { source: "/blog/onboarding-process-steps", destination: "/client-onboarding-process", permanent: true },

      // === Cluster D — "client onboarding automation" ===
      // Canonical: /client-onboarding-automation (LP)
      { source: "/blog/client-onboarding-automation", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/automate-client-onboarding", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/how-to-automate-client-onboarding", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/automated-onboarding-workflows", destination: "/client-onboarding-automation", permanent: true },
      { source: "/blog/onboarding-automation-guide", destination: "/client-onboarding-automation", permanent: true },

      // === Cluster E — "client onboarding checklist" ===
      // Canonical: /blog/client-onboarding-checklist-template (template-intent listicle)
      { source: "/blog/client-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/onboarding-new-clients-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/customer-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },
      { source: "/blog/agency-client-onboarding-checklist", destination: "/blog/client-onboarding-checklist-template", permanent: true },

      // === Cluster F — vertical "accountants" ===
      { source: "/onboarding-for-accountants", destination: "/accountants", permanent: true },

      // === Cluster G — vertical "consultants" ===
      { source: "/onboarding-for-consultants", destination: "/consultants", permanent: true },

      // === Cluster H — vertical "agencies" ===
      // Canonical: /client-onboarding-software-for-agencies (LP)
      { source: "/onboarding-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
      { source: "/blog/client-onboarding-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },
      { source: "/blog/onboarding-process-for-agencies", destination: "/client-onboarding-software-for-agencies", permanent: true },

      // === Cluster I — vertical "fleet" ===
      // Canonical: /fleet-account-onboarding (LP)
      { source: "/blog/fleet-account-onboarding", destination: "/fleet-account-onboarding", permanent: true },

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
