import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer, PublicFooter, PublicHeader } from "@/components/marketing/public-shell";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | ClientEnforce",
  description:
    "How ClientEnforce collects, uses, shares, and protects personal data across our website and product. UK GDPR and EU GDPR compliant.",
  path: "/privacy",
  keywords: [
    "privacy policy",
    "UK GDPR",
    "EU GDPR",
    "client onboarding software privacy",
    "data protection",
  ],
  type: "website",
});

function PolicySection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] sm:p-8"
    >
      <h2
        className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
        {children}
      </div>
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
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Legal
              </p>
              <h1
                className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-secondary)]">
                This policy explains how ClientEnforce collects, uses, shares, and protects
                personal data when you visit our website, sign up for an account, or use the
                ClientEnforce product. It is written to comply with the UK GDPR, the Data
                Protection Act 2018, the EU GDPR, and the UK Privacy and Electronic
                Communications Regulations (PECR).
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Last updated: 24 April 2026
              </p>
            </div>
          </PageContainer>
        </section>

        <section>
          <PageContainer>
            <div className="space-y-4 py-10 sm:py-12">
              <PolicySection id="who-we-are" title="1. Who we are (data controller)">
                <p>
                  ClientEnforce Ltd (&ldquo;ClientEnforce&rdquo;, &ldquo;we&rdquo;,
                  &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a company registered in England and
                  Wales and is the data controller of the personal data described in this
                  policy, except where we act as a processor on behalf of our customers (see
                  &ldquo;Customer data processed on behalf of our customers&rdquo; below).
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Contact for privacy matters:{" "}
                    <a
                      href="mailto:thomas@clientenforce.com"
                      className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                    >
                      thomas@clientenforce.com
                    </a>
                  </li>
                  <li>General contact:{" "}
                    <a
                      href="mailto:info@clientenforce.com"
                      className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                    >
                      info@clientenforce.com
                    </a>
                  </li>
                  <li>Registered office: [to be confirmed &mdash; update before publishing]</li>
                  <li>Company number: [to be confirmed &mdash; update before publishing]</li>
                  <li>
                    ICO registration: [to be confirmed &mdash; update before publishing]
                  </li>
                </ul>
                <p>
                  We have appointed a data protection lead who can be reached at{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection id="scope" title="2. Scope of this policy">
                <p>This policy applies to:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Visitors to clientenforce.com and our subdomains (the
                    &ldquo;Website&rdquo;).
                  </li>
                  <li>
                    People who contact us, request a demo, download a resource, or subscribe to
                    marketing communications.
                  </li>
                  <li>
                    Customers and authorised users of the ClientEnforce product (the
                    &ldquo;Service&rdquo;).
                  </li>
                  <li>
                    End clients who are invited into a customer&rsquo;s onboarding workflow
                    (completing intake forms, uploading documents, signing agreements, etc.).
                  </li>
                </ul>
                <p>
                  When a ClientEnforce customer uses the Service to collect and process
                  information about their own clients, the customer is the controller of that
                  data and ClientEnforce acts as a processor. In that case, the customer&rsquo;s
                  privacy policy applies to the underlying end-client relationship, and our
                  Data Processing Addendum governs our handling of that data.
                </p>
              </PolicySection>

              <PolicySection id="data-we-collect" title="3. Personal data we collect">
                <p>
                  We collect the following categories of personal data, grouped by source:
                </p>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  a) Information you give us
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Account data: name, work email, password (hashed), company name, job title,
                    phone number (optional).
                  </li>
                  <li>
                    Billing data: billing contact, billing address, VAT/tax ID, and payment-card
                    metadata (card details themselves are processed directly by our payment
                    provider and not stored by us).
                  </li>
                  <li>
                    Marketing and sales data: form submissions, demo requests, downloaded
                    resources, survey responses, event registrations.
                  </li>
                  <li>
                    Support and communications: messages, screenshots, and attachments sent to
                    our support team.
                  </li>
                </ul>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  b) Information generated while you use the Service
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Usage data: pages viewed, features used, workflow and task activity,
                    timestamps, click events, performance metrics.
                  </li>
                  <li>
                    Device and connection data: IP address, browser type, operating system,
                    device identifiers, language, referring URLs.
                  </li>
                  <li>
                    Security and audit logs: sign-in events, password resets, permission
                    changes, audit trail entries.
                  </li>
                </ul>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  c) Customer data processed on behalf of our customers
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Client onboarding records: names, contact details, uploaded documents,
                    completed forms, signatures, notes, workflow history, and any other data our
                    customers choose to store in the Service.
                  </li>
                </ul>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  d) Information we receive from third parties
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Authentication and identity data from third-party sign-in providers (for
                    example Google) when you use them to log in.
                  </li>
                  <li>
                    Enrichment data from business-contact providers used for sales and marketing
                    (company size, industry, role) &mdash; where permitted by law.
                  </li>
                  <li>
                    Analytics and attribution data from advertising and analytics providers.
                  </li>
                </ul>
                <p>
                  We do not intentionally collect special-category personal data (such as data
                  about health, race, religion, or political opinions) through the Website or
                  Service, and we ask customers not to upload such data unless a lawful basis
                  and appropriate safeguards are in place.
                </p>
              </PolicySection>

              <PolicySection id="how-we-use" title="4. How we use personal data">
                <p>We use personal data for the following purposes:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Providing the Service: creating and managing accounts, running onboarding
                    workflows, storing documents, sending transactional notifications, and
                    enabling collaboration between users and their clients.
                  </li>
                  <li>
                    Securing the Service: authenticating users, detecting abuse or fraud,
                    maintaining audit logs, and responding to security incidents.
                  </li>
                  <li>
                    Supporting customers: answering questions, investigating issues, and
                    communicating product updates, outages, and maintenance windows.
                  </li>
                  <li>
                    Billing and finance: processing subscriptions, issuing invoices, collecting
                    payment, and meeting tax and accounting obligations.
                  </li>
                  <li>
                    Improving the Service: analysing usage patterns, diagnosing bugs, testing
                    new features, and measuring reliability and performance.
                  </li>
                  <li>
                    Marketing and sales: sending product announcements, newsletters, and
                    relevant offers to existing customers and to individuals who have opted in;
                    measuring the effectiveness of marketing campaigns.
                  </li>
                  <li>
                    Legal and compliance: complying with applicable law, responding to lawful
                    requests from public authorities, and enforcing our terms of service.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection id="legal-bases" title="5. Legal bases for processing">
                <p>
                  Under the UK GDPR and EU GDPR we rely on the following legal bases, depending
                  on the activity:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Performance of a contract (Art. 6(1)(b))
                    </span>{" "}
                    &mdash; to create your account, provide the Service, process payments, and
                    respond to support requests.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Legitimate interests (Art. 6(1)(f))
                    </span>{" "}
                    &mdash; to secure and improve the Service, keep audit logs, carry out
                    product analytics, prevent fraud and abuse, and conduct limited direct
                    marketing to existing business contacts. Where we rely on legitimate
                    interests, we balance those interests against your rights and freedoms.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Consent (Art. 6(1)(a))
                    </span>{" "}
                    &mdash; for optional marketing emails to non-customers, for non-essential
                    cookies and similar technologies, and where consent is required by PECR or
                    equivalent EU rules. You can withdraw consent at any time without affecting
                    the lawfulness of processing before withdrawal.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Legal obligation (Art. 6(1)(c))
                    </span>{" "}
                    &mdash; to keep tax and accounting records, respond to lawful requests, and
                    meet other statutory obligations.
                  </li>
                </ul>
                <p>
                  Where we process data as a processor on behalf of a customer, the customer is
                  responsible for identifying and documenting the lawful basis that applies.
                </p>
              </PolicySection>

              <PolicySection id="sharing" title="6. Who we share data with">
                <p>We share personal data only with the categories of recipients listed below:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Sub-processors and service providers
                    </span>{" "}
                    that help us run the Website and Service &mdash; including cloud hosting,
                    database and storage providers, email delivery, payment processing, customer
                    support tools, product analytics, error monitoring, and business-intelligence
                    tools. All sub-processors are contractually required to protect personal
                    data on terms consistent with this policy and applicable law.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Customer-authorised recipients
                    </span>{" "}
                    such as team members added by an account administrator, end clients invited
                    into an onboarding, and any integrations the customer chooses to enable.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Professional advisers
                    </span>{" "}
                    including accountants, auditors, lawyers, and insurers, bound by
                    professional duties of confidentiality.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Authorities and regulators
                    </span>{" "}
                    when we are required by law, court order, or binding request to disclose
                    information, and only to the minimum extent necessary.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Buyers or successors
                    </span>{" "}
                    in the event of a merger, acquisition, financing, or sale of all or part of
                    our business, subject to equivalent privacy protections.
                  </li>
                </ul>
                <p>
                  We do not sell personal data, and we do not share personal data for
                  cross-context behavioural advertising.
                </p>
                <p>
                  A current list of our sub-processors is available on request from{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection
                id="international-transfers"
                title="7. International data transfers"
              >
                <p>
                  ClientEnforce is based in the United Kingdom, and some of our sub-processors
                  operate in the European Economic Area, the United States, and other
                  jurisdictions. Where personal data is transferred outside the UK or EEA to a
                  country that is not the subject of an adequacy decision, we rely on
                  appropriate safeguards, which may include:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    the European Commission&rsquo;s Standard Contractual Clauses (SCCs), with the
                    UK International Data Transfer Addendum where the transfer is subject to UK
                    law; or
                  </li>
                  <li>
                    the UK International Data Transfer Agreement (IDTA); and
                  </li>
                  <li>
                    additional technical and organisational measures (such as encryption in
                    transit and at rest, access controls, and pseudonymisation) where our
                    transfer impact assessment indicates they are needed.
                  </li>
                </ul>
                <p>
                  You can request a copy of the relevant safeguards by contacting{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection id="retention" title="8. How long we keep data">
                <p>
                  We keep personal data only for as long as we need it for the purposes set out
                  in this policy, including any legal, accounting, or reporting requirements. In
                  general:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Account data is retained for the life of the account and for up to 12 months
                    after account closure, unless a longer period is required or requested.
                  </li>
                  <li>
                    Customer content (onboardings, documents, forms) is retained for the life of
                    the account and deleted or returned in accordance with our Data Processing
                    Addendum following termination.
                  </li>
                  <li>
                    Billing and tax records are kept for at least 6 years after the end of the
                    relevant financial year, in line with UK statutory requirements.
                  </li>
                  <li>
                    Security and audit logs are typically kept for up to 24 months.
                  </li>
                  <li>
                    Marketing contact data is kept until you unsubscribe or, for prospective
                    customers, no longer than 24 months after our last meaningful interaction.
                  </li>
                  <li>
                    Cookies and similar technologies are retained according to the retention
                    periods stated in our cookie notice.
                  </li>
                </ul>
                <p>
                  When personal data is no longer needed, we securely delete or anonymise it.
                </p>
              </PolicySection>

              <PolicySection id="security" title="9. How we protect data">
                <p>
                  We maintain a layered set of technical and organisational measures designed
                  to protect personal data, including:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Encryption of data in transit using TLS and encryption at rest for
                    production databases and file storage.
                  </li>
                  <li>
                    Role-based access control, least-privilege permissions, multi-factor
                    authentication for internal systems, and detailed audit logging.
                  </li>
                  <li>
                    Secure development practices, code review, dependency scanning, and
                    vulnerability management.
                  </li>
                  <li>
                    Regular backups, monitored uptime, and documented business continuity and
                    incident-response processes.
                  </li>
                  <li>
                    Staff confidentiality obligations and data-protection training.
                  </li>
                </ul>
                <p>
                  No online service can be guaranteed to be completely secure. If we become
                  aware of a personal-data breach that is likely to result in a risk to your
                  rights and freedoms, we will notify the UK Information Commissioner&rsquo;s
                  Office (and, where applicable, competent EU supervisory authorities) within
                  72 hours, and we will notify affected individuals and customers without undue
                  delay where required.
                </p>
              </PolicySection>

              <PolicySection id="your-rights" title="10. Your rights">
                <p>
                  Subject to applicable law and certain exemptions, you have the following
                  rights in relation to your personal data:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Right of access to the personal data we hold about you.</li>
                  <li>Right to rectification of inaccurate or incomplete data.</li>
                  <li>Right to erasure (the &ldquo;right to be forgotten&rdquo;).</li>
                  <li>Right to restrict processing in certain circumstances.</li>
                  <li>
                    Right to data portability for data you provided to us and that we process
                    by automated means on the basis of consent or contract.
                  </li>
                  <li>
                    Right to object to processing based on legitimate interests, including
                    profiling, and to object to direct marketing at any time.
                  </li>
                  <li>
                    Right to withdraw consent where processing is based on consent.
                  </li>
                  <li>
                    Right not to be subject to decisions based solely on automated processing
                    that produce legal or similarly significant effects. ClientEnforce does not
                    currently carry out this kind of automated decision-making.
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, email{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>
                  . If you are an end client of one of our customers, please contact that
                  customer in the first instance; we will support them in responding to your
                  request.
                </p>
                <p>
                  You also have the right to complain to a supervisory authority. In the UK that
                  is the Information Commissioner&rsquo;s Office (
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    ico.org.uk
                  </a>
                  ). In the EU, you may complain to the supervisory authority of your country of
                  residence, place of work, or the place of the alleged infringement.
                </p>
              </PolicySection>

              <PolicySection id="cookies" title="11. Cookies and similar technologies">
                <p>
                  We use cookies and similar technologies on our Website and within the Service
                  for the following purposes:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Strictly necessary
                    </span>{" "}
                    &mdash; required to authenticate users, maintain sessions, and protect
                    against fraud and abuse. These cannot be switched off.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Functional
                    </span>{" "}
                    &mdash; remember preferences such as language or layout.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Analytics
                    </span>{" "}
                    &mdash; measure how the Website and Service are used so that we can improve
                    them.
                  </li>
                  <li>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      Marketing and attribution
                    </span>{" "}
                    &mdash; measure the effectiveness of marketing campaigns and, where
                    applicable, support advertising on third-party platforms.
                  </li>
                </ul>
                <p>
                  Non-essential cookies are only set after you give consent via our cookie
                  banner, and you can change your preferences at any time through the banner or
                  your browser settings. A detailed list of cookies, providers, and retention
                  periods is available on our cookie notice and on request from{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>
                  .
                </p>
              </PolicySection>

              <PolicySection id="childrens-data" title="12. Children&rsquo;s data">
                <p>
                  The ClientEnforce Website and Service are intended for business users and are
                  not directed to children. We do not knowingly collect personal data from
                  children under 16. If you believe a child has provided us with personal data,
                  please contact{" "}
                  <a
                    href="mailto:thomas@clientenforce.com"
                    className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  >
                    thomas@clientenforce.com
                  </a>{" "}
                  and we will delete it promptly.
                </p>
              </PolicySection>

              <PolicySection id="changes" title="13. Changes to this policy">
                <p>
                  We may update this policy from time to time to reflect changes in our
                  practices, technology, legal requirements, or other factors. When we make
                  material changes, we will update the &ldquo;Last updated&rdquo; date above and,
                  where appropriate, notify customers by email or through the Service. Please
                  check this page periodically for the latest version.
                </p>
              </PolicySection>

              <PolicySection id="contact" title="14. How to contact us">
                <p>
                  For any privacy-related question or request, contact:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Email:{" "}
                    <a
                      href="mailto:thomas@clientenforce.com"
                      className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                    >
                      thomas@clientenforce.com
                    </a>
                  </li>
                  <li>
                    Postal address: [to be confirmed &mdash; update before publishing]
                  </li>
                  <li>
                    General enquiries:{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                    >
                      contact page
                    </Link>
                  </li>
                </ul>
                <p>
                  If you are in the EU and wish to contact a representative for GDPR purposes,
                  please email us and we will direct your request appropriately.
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
