import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | ClientEnforce",
  description:
    "Read the ClientEnforce privacy policy for details on data collection, document handling, cookies, retention, security, and your privacy rights.",
  path: "/privacy",
  keywords: ["privacy policy", "client onboarding software privacy", "ClientEnforce privacy"],
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
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-700 sm:text-base">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Legal</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                This Privacy Policy explains how ClientEnforce collects, uses, stores, and protects
                personal information when you use our client onboarding software.
              </p>
              <p className="mt-2 text-sm text-zinc-600">Last updated: March 9, 2026</p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-4 py-10 sm:py-12">
              <PolicySection title="Introduction">
                <p>
                  ClientEnforce helps businesses run structured client onboarding workflows. This policy
                  applies to our website, product pages, and platform experiences where we process
                  onboarding-related information.
                </p>
                <p>
                  By using ClientEnforce, you agree to the practices described in this Privacy Policy.
                </p>
              </PolicySection>

              <PolicySection title="Information we collect">
                <p>We may collect the following categories of information:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Account details such as name, email, and organization information.</li>
                  <li>Billing and subscription information needed to provide paid plans.</li>
                  <li>Usage and diagnostic data related to product performance and reliability.</li>
                  <li>
                    Customer and client onboarding data submitted through the platform, including
                    documents, signatures, form responses, and workflow status details.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection title="How we use information">
                <p>We use information to operate and improve ClientEnforce, including to:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Provide and maintain the client onboarding service.</li>
                  <li>Authenticate users, manage permissions, and secure accounts.</li>
                  <li>Process subscriptions, invoices, and support requests.</li>
                  <li>Improve product quality, performance, and user experience.</li>
                  <li>Communicate product updates, operational notices, and service announcements.</li>
                </ul>
              </PolicySection>

              <PolicySection title="Client files and uploaded content">
                <p>
                  ClientEnforce is designed to store onboarding materials submitted by users and their
                  clients. This can include uploaded documents, signatures, and onboarding-related
                  information required to complete onboarding workflows.
                </p>
                <p>
                  Customers are responsible for ensuring they have a lawful basis to collect and process
                  information they upload to ClientEnforce.
                </p>
              </PolicySection>

              <PolicySection title="Cookies and analytics">
                <p>
                  We may use cookies and similar technologies for authentication, session management,
                  security, and analytics. These technologies help us understand usage patterns and
                  improve service quality.
                </p>
                <p>
                  You can manage cookie preferences through your browser settings, but some platform
                  functionality may be affected.
                </p>
              </PolicySection>

              <PolicySection title="Data sharing">
                <p>
                  We do not sell personal information. We may share data with trusted service providers
                  that support core operations such as infrastructure hosting, payment processing, email
                  delivery, analytics, and customer support.
                </p>
                <p>
                  We may also disclose information where required by law or to protect the rights,
                  safety, and security of ClientEnforce, our users, or others.
                </p>
              </PolicySection>

              <PolicySection title="Data retention">
                <p>
                  We retain personal information for as long as necessary to provide the service,
                  comply with legal obligations, resolve disputes, and enforce agreements.
                </p>
                <p>
                  Retention periods may vary based on account status, contractual requirements, and the
                  type of onboarding data involved.
                </p>
              </PolicySection>

              <PolicySection title="Security">
                <p>
                  We implement reasonable technical and organizational safeguards designed to protect
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>
                  No method of transmission or storage is completely secure. Customers should also use
                  strong account security practices, including password hygiene and access control.
                </p>
              </PolicySection>

              <PolicySection title="International transfers">
                <p>
                  Depending on where you access the service, information may be transferred to and
                  processed in countries other than your own. Where required, we use appropriate
                  safeguards for cross-border data transfers.
                </p>
              </PolicySection>

              <PolicySection title="Your rights">
                <p>
                  Depending on your jurisdiction, you may have rights related to access, correction,
                  deletion, restriction, portability, or objection to processing of personal data.
                </p>
                <p>
                  To request assistance with privacy rights, contact us at
                  {" "}
                  <a href="mailto:support@clientenforce.com" className="font-medium text-zinc-900 underline underline-offset-4">
                    support@clientenforce.com
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection title="Customer responsibilities and data handling expectations">
                <p>
                  ClientEnforce is used by businesses that collect onboarding data from their own clients.
                  Customers are responsible for defining lawful collection practices, configuring onboarding
                  requirements appropriately, and limiting access to authorized internal users.
                </p>
                <p>
                  When building onboarding workflows, customers should request only the information needed
                  for service delivery and compliance. Teams should also review retention settings regularly
                  and remove outdated data according to legal and contractual requirements.
                </p>
                <p>
                  For implementation guidance, visit our
                  {" "}
                  <Link href="/client-onboarding-checklist" className="font-medium text-zinc-900 underline underline-offset-4">
                    client onboarding checklist
                  </Link>
                  {" "}
                  and
                  {" "}
                  <Link href="/blog/onboarding-documents-for-clients" className="font-medium text-zinc-900 underline underline-offset-4">
                    onboarding documents guide
                  </Link>
                  {" "}
                  to design workflows that are both efficient and privacy-aware.
                </p>
              </PolicySection>

              <PolicySection title="Contact information">
                <p>
                  For privacy questions, requests, or complaints, contact
                  {" "}
                  <a href="mailto:support@clientenforce.com" className="font-medium text-zinc-900 underline underline-offset-4">
                    support@clientenforce.com
                  </a>
                  .
                </p>
                <p>
                  If you need postal contact details for legal or compliance matters, request them by email
                  and we will provide the appropriate point of contact.
                </p>
                <p>
                  You can also visit our
                  {" "}
                  <Link href="/contact" className="font-medium text-zinc-900 underline underline-offset-4">
                    Contact page
                  </Link>
                  {" "}
                  for general inquiries.
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
