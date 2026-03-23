import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | ClientEnforce",
  description: "ClientEnforce privacy policy - how we collect, store, and use your data. GDPR compliant.",
  path: "/privacy",
  keywords: ["privacy policy", "GDPR", "client onboarding software privacy"],
  type: "website",
});

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-text-primary)]">
      <PublicHeader />

      <main>
        <section className="border-b border-[var(--color-border)] bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">Legal</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                This policy explains how ClientEnforce collects, uses, and protects personal data across our public website and product.
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: March 15, 2026</p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-4 py-10 sm:py-12">
              <PolicySection title="1. Who we are">
                <p>
                  ClientEnforce is a UK-based software company. Registered address: [CONFIRM WITH LEGAL]. Company number: [CONFIRM WITH LEGAL]. ICO registration number: [CONFIRM WITH LEGAL].
                </p>
              </PolicySection>

              <PolicySection title="2. What data we collect">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Contact data from forms: name, email, and company details.</li>
                  <li>Account and usage data needed to provide the service.</li>
                  <li>Client onboarding records uploaded by customers (documents, forms, signatures, workflow history).</li>
                  <li>Cookie and analytics data used to measure website usage.</li>
                </ul>
              </PolicySection>

              <PolicySection title="3. How we use data">
                <ul className="list-disc space-y-1 pl-5">
                  <li>To provide and secure the ClientEnforce service.</li>
                  <li>To deliver support, product updates, and operational notifications.</li>
                  <li>To improve product reliability, usability, and performance.</li>
                  <li>To process subscriptions and billing.</li>
                </ul>
              </PolicySection>

              <PolicySection title="4. Legal basis for processing">
                <p>Under UK GDPR, we rely on one or more of the following bases:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Contract: processing needed to deliver the service you requested.</li>
                  <li>Legitimate interests: operating, securing, and improving the service.</li>
                  <li>Consent: for optional marketing communications and some cookies.</li>
                  <li>Legal obligation: where law or regulation requires processing.</li>
                </ul>
              </PolicySection>

              <PolicySection title="5. Data retention">
                <p>
                  We keep data only as long as needed for service delivery, legal compliance, and dispute resolution. Exact retention schedules: [CONFIRM WITH LEGAL].
                </p>
              </PolicySection>

              <PolicySection title="6. Your rights">
                <p>Depending on your location, you may request:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Access to your personal data.</li>
                  <li>Correction of inaccurate data.</li>
                  <li>Deletion (erasure), subject to legal limits.</li>
                  <li>Portability of your data.</li>
                  <li>Restriction or objection to processing.</li>
                </ul>
              </PolicySection>

              <PolicySection title="7. Cookies">
                <p>
                  We use cookies for authentication, security, and analytics. You can manage cookies in your browser settings. Cookie categories and providers: [CONFIRM WITH LEGAL].
                </p>
              </PolicySection>

              <PolicySection title="8. Contact for data requests">
                <p>
                  For privacy requests, contact: [CONFIRM WITH LEGAL - DPO EMAIL]. You can also reach us via the
                  {" "}
                  <Link href="/contact" className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
                    contact page
                  </Link>
                  .
                </p>
              </PolicySection>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
