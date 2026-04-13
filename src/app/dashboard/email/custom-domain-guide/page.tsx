"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";

// ─── Inline accordion for rich (ReactNode) content ────────────────────────────

function Accordion({ items }: { items: { heading: string; content: React.ReactNode }[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <div className="divide-y divide-[var(--color-border)]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.heading}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{item.heading}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] pb-4" : "max-h-0"}`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-xs font-bold text-[var(--color-accent)]">
      {n}
    </span>
  );
}

function CredTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-secondary)]">Field</th>
            <th className="px-4 py-2.5 text-left font-semibold text-[var(--color-text-secondary)]">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map(([field, value]) => (
            <tr key={field} className="bg-white">
              <td className="px-4 py-2.5 font-medium text-[var(--color-text-primary)] whitespace-nowrap">{field}</td>
              <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-xs font-mono text-[var(--color-text-primary)]">
      {children}
    </code>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomDomainGuidePage() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Back link ── */}
      <div>
        <Link
          href="/dashboard/email"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Email Settings
        </Link>
      </div>

      {/* ── 1. Introduction ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>
            Send onboarding emails from your own address
          </CardTitle>
          <CardDescription>
            By default, ClientEnforce sends client emails on your behalf. If you&apos;d prefer your clients to receive
            emails from your own company address — like <C>onboarding@yourcompany.com</C> — you can connect your own
            email provider using Custom SMTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            This takes about 10 minutes and works with Gmail (Google Workspace), Outlook / Microsoft 365, and most
            business email providers.
          </p>
        </CardContent>
      </Card>

      {/* ── 2. What you'll need ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>What you&apos;ll need</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <ul className="flex flex-col gap-2">
            {[
              <>A <strong>business email address</strong> on your own domain (e.g. <C>onboarding@yourcompany.com</C>)</>,
              <>Access to your email provider&apos;s <strong>SMTP settings</strong> (host, port, and credentials)</>,
              <>For Gmail: an <strong>App Password</strong> (not your regular Google password) — see the Gmail section below</>,
              <>For Outlook / Microsoft 365: <strong>App Password or SMTP AUTH credentials</strong> — see the Microsoft 365 section below</>,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <InfoBox>
            <strong>Note:</strong> Free Gmail accounts (<C>@gmail.com</C>) work but are not recommended for business
            use. Use Google Workspace for a branded address.
          </InfoBox>
        </CardContent>
      </Card>

      {/* ── 3. Step-by-step setup ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>How to connect your email</CardTitle>
          <CardDescription>
            Generic setup — provider-specific credential values are in the sections below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Step 1 */}
          <div className="flex gap-3">
            <StepNumber n={1} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Go to Settings → Email</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Navigate to <strong>Settings</strong> in the left sidebar, then click <strong>Email</strong>. Scroll to
                the <strong>Email Provider</strong> section.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3">
            <StepNumber n={2} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Select &ldquo;Custom SMTP&rdquo;</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Open the Provider dropdown and choose <strong>Custom SMTP</strong>. The SMTP credentials form will
                appear below.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <StepNumber n={3} />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Enter your SMTP credentials</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Fill in the following fields. Provider-specific values are in the sections below.
              </p>
              <CredTable
                rows={[
                  ["Host", <>Your provider&apos;s outgoing mail server (e.g. <C>smtp.gmail.com</C>)</>],
                  ["Port", <><C>587</C> for STARTTLS (recommended) or <C>465</C> for SSL/TLS</>],
                  ["Username", <>Your full email address (e.g. <C>you@yourcompany.com</C>)</>],
                  ["Password / App Password", "Your app password (see provider guides below)"],
                  ["From Email", <>The address clients will see — e.g. <C>onboarding@yourcompany.com</C></>],
                  ["From Name", "Your company or team name"],
                  ["Use TLS", <>Leave <strong>off</strong> for port 587 (STARTTLS). Turn <strong>on</strong> for port 465 (SSL).</>],
                ]}
              />
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <StepNumber n={4} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Save and test</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Click <strong>Save provider settings</strong>, then click <strong>Send test email</strong>. ClientEnforce
                will send a test message to your own account. Check that it arrives and that the From name and address
                look correct.
              </p>
            </div>
          </div>

          <InfoBox>
            If the test email doesn&apos;t arrive within 2 minutes, check your spam folder and verify your credentials.
            Common issues are listed in the troubleshooting section below.
          </InfoBox>
        </CardContent>
      </Card>

      {/* ── 4a. Gmail ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Setting up with Gmail or Google Workspace</CardTitle>
          <CardDescription>
            Google requires an <strong>App Password</strong> — a separate password generated specifically for
            third-party apps. You cannot use your regular Google account password here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex gap-3">
            <StepNumber n={1} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Enable 2-Step Verification</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                App Passwords only work if 2-Step Verification is turned on. Go to{" "}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                >
                  myaccount.google.com/security
                </a>{" "}
                and enable it if you haven&apos;t already.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <StepNumber n={2} />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">Generate an App Password</p>
              <ol className="flex flex-col gap-1.5 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">1.</span>
                  <span>
                    Go to{" "}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                    >
                      myaccount.google.com/apppasswords
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">2.</span>
                  <span>Under &ldquo;Select app&rdquo;, choose <strong>Mail</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">3.</span>
                  <span>Under &ldquo;Select device&rdquo;, choose <strong>Other (custom name)</strong> and type <C>ClientEnforce</C></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">4.</span>
                  <span>
                    Click <strong>Generate</strong> — Google will show a 16-character password. Copy it now (it
                    won&apos;t be shown again).
                  </span>
                </li>
              </ol>
            </div>
          </div>

          <div className="flex gap-3">
            <StepNumber n={3} />
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Enter your Gmail SMTP credentials in ClientEnforce
              </p>
              <CredTable
                rows={[
                  ["Host", <C>smtp.gmail.com</C>],
                  ["Port", <C>587</C>],
                  ["Username", "Your full Gmail address"],
                  ["Password / App Password", "The 16-character App Password from Step 2"],
                  ["From Email", "Your Gmail address"],
                  ["Use TLS", "Off (leave unchecked)"],
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4b. Microsoft 365 ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>
            Setting up with Outlook or Microsoft 365
          </CardTitle>
          <CardDescription>
            Microsoft 365 requires SMTP AUTH to be enabled on your account. Your IT admin may need to do this if
            it&apos;s a managed organisation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex gap-3">
            <StepNumber n={1} />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Enable SMTP AUTH for your account
              </p>
              <ol className="flex flex-col gap-1.5 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">1.</span>
                  <span>
                    Sign in to the{" "}
                    <a
                      href="https://admin.microsoft.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                    >
                      Microsoft 365 Admin Center
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">2.</span>
                  <span>Go to <strong>Users → Active Users</strong> and select your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">3.</span>
                  <span>Under the <strong>Mail</strong> tab, click <strong>Manage email apps</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 font-medium">4.</span>
                  <span>Make sure <strong>Authenticated SMTP</strong> is checked, then save</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="flex gap-3">
            <StepNumber n={2} />
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Enter your Microsoft 365 SMTP credentials in ClientEnforce
              </p>
              <CredTable
                rows={[
                  ["Host", <C>smtp.office365.com</C>],
                  ["Port", <C>587</C>],
                  ["Username", "Your full Microsoft 365 email address"],
                  ["Password / App Password", "Your Microsoft 365 password (or App Password if MFA is enabled)"],
                  ["From Email", "Your Microsoft 365 email address"],
                  ["Use TLS", "Off (leave unchecked — port 587 uses STARTTLS)"],
                ]}
              />
            </div>
          </div>

          <InfoBox>
            If your organisation uses MFA (multi-factor authentication), you may need to generate an App Password at{" "}
            <a
              href="https://account.microsoft.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
            >
              account.microsoft.com/security
            </a>{" "}
            instead of using your regular password.
          </InfoBox>
        </CardContent>
      </Card>

      {/* ── 4c. Other providers (accordion) ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Other email providers</CardTitle>
          <CardDescription>SMTP credentials for other common providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion
            items={[
              {
                heading: "Zoho Mail",
                content: (
                  <CredTable
                    rows={[
                      ["Host", <C>smtp.zoho.com</C>],
                      ["Port", <C>587</C>],
                      ["Username", "Your full Zoho email address"],
                      ["Password", "Your Zoho password or App-Specific password"],
                      ["Use TLS", "Off (STARTTLS on port 587)"],
                    ]}
                  />
                ),
              },
              {
                heading: "Custom / Hosted domain (cPanel, Namecheap, GoDaddy, etc.)",
                content: (
                  <div className="flex flex-col gap-3">
                    <CredTable
                      rows={[
                        ["Host", <>Check your hosting provider&apos;s email settings — usually <C>mail.yourdomain.com</C></>],
                        ["Port", <><C>587</C> (STARTTLS) or <C>465</C> (SSL)</>],
                        ["Username", "Your full email address"],
                        ["Password", "Your email account password (not your hosting login)"],
                        ["Use TLS", <>Off for port 587, On for port 465</>],
                      ]}
                    />
                  </div>
                ),
              },
              {
                heading: "ProtonMail (via ProtonMail Bridge)",
                content: (
                  <div className="flex flex-col gap-3">
                    <CredTable
                      rows={[
                        ["Host", <C>127.0.0.1</C>],
                        ["Port", <C>1025</C>],
                        ["Username", "Your ProtonMail address"],
                        ["Password", "Your Bridge password (shown in the Bridge app)"],
                        ["Use TLS", "Off"],
                      ]}
                    />
                    <InfoBox>
                      Requires the ProtonMail Bridge app running on a local server. Not recommended for shared hosting
                      environments.
                    </InfoBox>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── 5. Troubleshooting (accordion) ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>
            Test email not arriving? Common fixes.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            items={[
              {
                heading: '"Authentication failed" error',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Double-check your username and password. For Gmail, make sure you&apos;re using an App Password, not
                    your account password.
                  </p>
                ),
              },
              {
                heading: "Test email goes to spam",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Check that your <strong>From Email</strong> matches the account you authenticated. Mismatched
                    &ldquo;from&rdquo; addresses trigger spam filters.
                  </p>
                ),
              },
              {
                heading: '"Connection refused" or timeout',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Try switching ports — if <C>587</C> isn&apos;t working, try <C>465</C> with <strong>Use TLS</strong>{" "}
                    enabled.
                  </p>
                ),
              },
              {
                heading: "Gmail App Passwords not available",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Make sure 2-Step Verification is turned on in your Google account. App Passwords only appear after
                    this is enabled.
                  </p>
                ),
              },
              {
                heading: 'Microsoft 365 "SMTP AUTH disabled"',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Ask your IT admin to enable SMTP AUTH for your account in the Microsoft 365 Admin Center (see the
                    Microsoft 365 section above).
                  </p>
                ),
              },
              {
                heading: "Emails sending but showing wrong name",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Update the <strong>From Name</strong> field in the SMTP form to your preferred display name.
                  </p>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── 6. Bottom CTA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>All set? Send your first onboarding.</CardTitle>
          <CardDescription>
            Your clients will now receive emails from your own address. Head to Onboardings to send your first invite.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/onboardings">
            <Button className="rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] inline-flex items-center gap-1.5">
              Go to Onboardings
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/dashboard/email">
            <Button
              variant="secondary"
              className="rounded-full border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
            >
              Back to Email Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

    </div>
  );
}
