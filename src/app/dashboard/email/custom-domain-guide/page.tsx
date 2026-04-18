"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft, ArrowRight } from "lucide-react";

// ─── Accordion ────────────────────────────────────────────────────────────────

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
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] pb-4" : "max-h-0"}`}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-xs font-bold text-[var(--color-accent)]">
                {i + 1}
              </span>
              {!isLast && <div className="mt-1 w-px flex-1 bg-[var(--color-border)]" />}
            </div>
            <div className={`flex flex-col gap-2 min-w-0 flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-7">{item.title}</p>
              <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-xs font-mono text-[var(--color-text-primary)]">
      {children}
    </code>
  );
}

function CredTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map(([field, value]) => (
            <tr key={field} className="bg-[var(--color-panel)]">
              <td className="w-44 px-4 py-2.5 font-medium text-[var(--color-text-primary)] whitespace-nowrap align-top">
                {field}
              </td>
              <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

      {/* Back link */}
      <Link
        href="/dashboard/email"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Email settings
      </Link>

      {/* ── Intro + requirements ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>
            Send emails from your own address
          </CardTitle>
          <CardDescription>
            By default, ClientEnforce sends client emails from <C>info@clientenforce.com</C>. Switch to Custom SMTP
            to send from your own address — like <C>onboarding@yourcompany.com</C>. Works with Gmail, Google Workspace,
            Outlook, Microsoft 365, and most business email providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            You&apos;ll need
          </p>
          <ul className="flex flex-col gap-2">
            {[
              <>A business email address on your own domain — e.g. <C>onboarding@yourcompany.com</C></>,
              <>Your email provider&apos;s SMTP host, port, and login credentials</>,
              <>Gmail: an App Password (not your regular Google password)</>,
              <>Microsoft 365: SMTP AUTH enabled on your account</>,
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── Setup steps ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>How to set it up</CardTitle>
        </CardHeader>
        <CardContent>
          <Steps
            items={[
              {
                title: "Open Email settings",
                body: (
                  <>
                    Click <strong>Email</strong> in the left sidebar. Scroll down to the{" "}
                    <strong>Email provider</strong> card.
                  </>
                ),
              },
              {
                title: 'Select "Custom SMTP"',
                body: (
                  <>
                    Open the <strong>Provider</strong> dropdown and choose <strong>Custom SMTP</strong>. The credentials
                    form will expand below.
                  </>
                ),
              },
              {
                title: "Fill in your SMTP credentials",
                body: (
                  <>
                    Enter your <strong>Host</strong>, <strong>Port</strong>, <strong>Username</strong>,{" "}
                    <strong>Password</strong>, <strong>From Email</strong>, and <strong>From Name</strong>. Use the values
                    from your provider&apos;s section below.
                  </>
                ),
              },
              {
                title: "Save and send a test",
                body: (
                  <>
                    Click <strong>Save provider settings</strong>, then <strong>Send test email</strong>. A test message
                    will be sent to your own account — confirm the sender name and address look correct. If it doesn&apos;t
                    arrive within 2 minutes, check your spam folder or see Troubleshooting below.
                  </>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── Gmail ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Gmail / Google Workspace</CardTitle>
          <CardDescription>
            Google requires an <strong>App Password</strong> — your regular Google account password won&apos;t work.
            2-Step Verification must be enabled first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Steps
            items={[
              {
                title: "Enable 2-Step Verification",
                body: (
                  <>
                    Go to{" "}
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                    >
                      myaccount.google.com/security
                    </a>{" "}
                    and turn on 2-Step Verification if it&apos;s not already active.
                  </>
                ),
              },
              {
                title: "Create an App Password",
                body: (
                  <>
                    Go to{" "}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                    >
                      myaccount.google.com/apppasswords
                    </a>
                    , type a name (e.g. <C>ClientEnforce</C>), and click <strong>Create</strong>. Copy the
                    16-character password — it won&apos;t be shown again.
                  </>
                ),
              },
              {
                title: "Enter these credentials in ClientEnforce",
                body: (
                  <CredTable
                    rows={[
                      ["Host", <C>smtp.gmail.com</C>],
                      ["Port", <C>587</C>],
                      ["Username", "Your full Gmail address"],
                      ["Password", "The 16-character App Password"],
                      ["From Email", "Your Gmail address"],
                      ["Use TLS", "Off"],
                    ]}
                  />
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── Microsoft 365 ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Outlook / Microsoft 365</CardTitle>
          <CardDescription>
            Microsoft 365 requires <strong>SMTP AUTH</strong> to be enabled on your account. Your IT admin may need to
            action this for managed organisations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Steps
            items={[
              {
                title: "Enable SMTP AUTH",
                body: (
                  <ol className="flex flex-col gap-2">
                    {[
                      <>
                        Sign in to the{" "}
                        <a
                          href="https://admin.microsoft.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
                        >
                          Microsoft 365 Admin Center
                        </a>
                      </>,
                      <>Go to <strong>Users → Active Users</strong> and open your account</>,
                      <>Under the <strong>Mail</strong> tab, click <strong>Manage email apps</strong></>,
                      <>Tick <strong>Authenticated SMTP</strong> and save</>,
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="shrink-0 font-medium text-[var(--color-text-muted)]">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ),
              },
              {
                title: "Enter these credentials in ClientEnforce",
                body: (
                  <CredTable
                    rows={[
                      ["Host", <C>smtp.office365.com</C>],
                      ["Port", <C>587</C>],
                      ["Username", "Your full Microsoft 365 email address"],
                      ["Password", "Your password, or an App Password if MFA is enabled"],
                      ["From Email", "Your Microsoft 365 email address"],
                      ["Use TLS", "Off (port 587 uses STARTTLS)"],
                    ]}
                  />
                ),
              },
            ]}
          />
          <InfoBox>
            If your organisation uses MFA, generate an App Password at{" "}
            <a
              href="https://account.microsoft.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)]"
            >
              account.microsoft.com/security
            </a>{" "}
            and use that instead of your regular password.
          </InfoBox>
        </CardContent>
      </Card>

      {/* ── Other providers ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Other providers</CardTitle>
          <CardDescription>SMTP credentials for other common email services.</CardDescription>
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
                heading: "cPanel / Namecheap / GoDaddy",
                content: (
                  <CredTable
                    rows={[
                      ["Host", <>Usually <C>mail.yourdomain.com</C> — check your hosting control panel</>],
                      ["Port", <><C>587</C> (STARTTLS) or <C>465</C> (SSL)</>],
                      ["Username", "Your full email address"],
                      ["Password", "Your email account password (not your hosting login)"],
                      ["Use TLS", <>Off for port 587 · On for port 465</>],
                    ]}
                  />
                ),
              },
              {
                heading: "ProtonMail (via Bridge)",
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
                      Requires the ProtonMail Bridge app running locally. Not suitable for shared hosting environments.
                    </InfoBox>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── Troubleshooting ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            items={[
              {
                heading: '"Authentication failed"',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Check your username and password. For Gmail, make sure you&apos;re using an App Password — not your
                    regular account password.
                  </p>
                ),
              },
              {
                heading: "Test email goes to spam",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Make sure <strong>From Email</strong> matches the address you authenticated with. Mismatched sender
                    addresses are a common spam trigger.
                  </p>
                ),
              },
              {
                heading: '"Connection refused" or timeout',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Try switching ports — use <C>465</C> with <strong>Use TLS</strong> enabled instead of <C>587</C>.
                  </p>
                ),
              },
              {
                heading: "Gmail App Passwords not showing",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    App Passwords only appear once 2-Step Verification is turned on in your Google account.
                  </p>
                ),
              },
              {
                heading: 'Microsoft 365 "SMTP AUTH disabled"',
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Ask your IT admin to enable Authenticated SMTP for your account in the Microsoft 365 Admin Center.
                  </p>
                ),
              },
              {
                heading: "Emails show the wrong sender name",
                content: (
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Update <strong>From Name</strong> in the Email provider form and save again.
                  </p>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ── CTA ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Ready to go</CardTitle>
          <CardDescription>
            Your clients will now receive emails from your own address.
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
              Back to Email settings
            </Button>
          </Link>
        </CardContent>
      </Card>

    </div>
  );
}
