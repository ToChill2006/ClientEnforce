import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions | ClientEnforce",
  description:
    "Review ClientEnforce Terms & Conditions covering account use, subscriptions, acceptable use, customer content, and service limitations.",
  path: "/terms",
  keywords: ["terms and conditions", "saas terms", "ClientEnforce terms"],
  type: "website",
});

function TermsSection({
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicHeader />

      <main>
        <section className="border-b border-zinc-200 bg-white">
          <PageContainer>
            <div className="py-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Legal</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
                Terms & Conditions
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
                These Terms & Conditions govern your access to and use of ClientEnforce, a B2B SaaS
                platform for client onboarding workflows, document collection, signatures, and progress tracking.
              </p>
              <p className="mt-2 text-sm text-zinc-600">Last updated: March 9, 2026</p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-4 py-10 sm:py-12">
              <TermsSection title="Acceptance of terms">
                <p>
                  By accessing or using ClientEnforce, you agree to these Terms & Conditions. If you do
                  not agree, do not use the service.
                </p>
              </TermsSection>

              <TermsSection title="Use of the service">
                <p>
                  ClientEnforce may be used only for lawful business purposes and in accordance with
                  these terms. You are responsible for ensuring your use complies with applicable laws
                  and regulations.
                </p>
              </TermsSection>

              <TermsSection title="Accounts">
                <p>
                  You are responsible for safeguarding account credentials and for all activity conducted
                  through your account. You must provide accurate account information and update it when
                  changes occur.
                </p>
              </TermsSection>

              <TermsSection title="Subscription and billing">
                <p>
                  ClientEnforce may offer multiple subscription tiers, including free and paid plans with
                  different limits and features. Paid plans are billed on a recurring basis unless canceled.
                </p>
                <p>
                  You are responsible for any applicable taxes, payment method validity, and timely
                  payment of subscription charges.
                </p>
              </TermsSection>

              <TermsSection title="Acceptable use">
                <p>You agree not to:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Use the service for unlawful, fraudulent, or harmful activity.</li>
                  <li>Attempt unauthorized access to systems, accounts, or data.</li>
                  <li>Upload malicious code or content designed to disrupt the platform.</li>
                  <li>Interfere with service operations, security, or availability.</li>
                </ul>
              </TermsSection>

              <TermsSection title="Data and customer content">
                <p>
                  You retain ownership of data and content you submit, including client onboarding
                  documents, signatures, and related information. You grant ClientEnforce the rights
                  necessary to host, process, and transmit that content to provide the service.
                </p>
                <p>
                  You are responsible for the legality, accuracy, and rights associated with the content
                  you upload.
                </p>
              </TermsSection>

              <TermsSection title="Intellectual property">
                <p>
                  ClientEnforce and its software, branding, and platform materials are protected by
                  intellectual property laws. Except as expressly permitted, you may not copy, modify,
                  reverse engineer, or redistribute platform components.
                </p>
              </TermsSection>

              <TermsSection title="Service availability">
                <p>
                  We aim to provide a reliable service, but we do not guarantee uninterrupted or error-free
                  availability. Planned maintenance, updates, or third-party dependencies may affect uptime.
                </p>
              </TermsSection>

              <TermsSection title="Termination">
                <p>
                  You may stop using ClientEnforce at any time. We may suspend or terminate access where
                  there is a violation of these terms, legal requirements, non-payment, or security risk.
                </p>
              </TermsSection>

              <TermsSection title="Limitation of liability">
                <p>
                  To the maximum extent permitted by law, ClientEnforce is not liable for indirect,
                  incidental, special, consequential, or punitive damages, or for lost profits, revenues,
                  data, or business opportunities arising from use of the service.
                </p>
              </TermsSection>

              <TermsSection title="Changes to terms">
                <p>
                  We may update these Terms & Conditions from time to time. Material updates will be
                  reflected by a revised effective date. Continued use of the service after updates means
                  you accept the revised terms.
                </p>
              </TermsSection>

              <TermsSection title="Contact">
                <p>
                  If you have questions about these terms, contact
                  {" "}
                  <a href="mailto:support@clientenforce.com" className="font-medium text-zinc-900 underline underline-offset-4">
                    support@clientenforce.com
                  </a>
                  .
                </p>
                <p>
                  For formal legal correspondence details, request the appropriate contact information by
                  email and our team will route it correctly.
                </p>
                <p>
                  For general inquiries, visit our
                  {" "}
                  <Link href="/contact" className="font-medium text-zinc-900 underline underline-offset-4">
                    Contact page
                  </Link>
                  .
                </p>
              </TermsSection>
            </div>
          </PageContainer>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
