"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmailSettings = {
  email_subject_template: string;
  email_heading: string;
  email_body: string;
  email_cta_label: string;
};

type SmtpSettings = {
  email_provider: "clientenforce" | "smtp";
  smtp_host: string;
  smtp_port: string;
  smtp_secure: boolean;
  smtp_username: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_EMAIL: EmailSettings = {
  email_subject_template: "Action required: {{title}}",
  email_heading: "Complete your onboarding",
  email_body: "Please complete your onboarding in ClientEnforce so your team can continue the next step.",
  email_cta_label: "Open onboarding",
};

const DEFAULT_SMTP: SmtpSettings = {
  email_provider: "clientenforce",
  smtp_host: "",
  smtp_port: "587",
  smtp_secure: false,
  smtp_username: "",
  smtp_password: "",
  smtp_from_email: "",
  smtp_from_name: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailPage() {
  const { toast: notify } = useToast();

  const [emailSettings, setEmailSettings] = React.useState<EmailSettings>(DEFAULT_EMAIL);
  const [emailLoading, setEmailLoading] = React.useState(true);
  const [emailSaving, setEmailSaving] = React.useState(false);

  const [smtpSettings, setSmtpSettings] = React.useState<SmtpSettings>(DEFAULT_SMTP);
  const [smtpLoading, setSmtpLoading] = React.useState(true);
  const [smtpSaving, setSmtpSaving] = React.useState(false);
  const [smtpTesting, setSmtpTesting] = React.useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    async function loadEmailSettings() {
      setEmailLoading(true);
      try {
        const res = await fetch("/api/email-settings");
        const json = await res.json();
        if (res.ok && json.settings) {
          setEmailSettings({
            email_subject_template: json.settings.email_subject_template ?? DEFAULT_EMAIL.email_subject_template,
            email_heading: json.settings.email_heading ?? DEFAULT_EMAIL.email_heading,
            email_body: json.settings.email_body ?? DEFAULT_EMAIL.email_body,
            email_cta_label: json.settings.email_cta_label ?? DEFAULT_EMAIL.email_cta_label,
          });
        }
      } catch {
        // Non-fatal — keep defaults
      } finally {
        setEmailLoading(false);
      }
    }
    void loadEmailSettings();
  }, []);

  React.useEffect(() => {
    async function loadSmtpSettings() {
      try {
        const res = await fetch("/api/email-settings/smtp");
        if (!res.ok) return;
        const json = await res.json();
        if (json?.settings) {
          const s = json.settings;
          setSmtpSettings({
            email_provider: s.email_provider ?? "clientenforce",
            smtp_host: s.smtp_host ?? "",
            smtp_port: String(s.smtp_port ?? "587"),
            smtp_secure: s.smtp_secure ?? false,
            smtp_username: s.smtp_username ?? "",
            smtp_password: s.smtp_password ?? "",
            smtp_from_email: s.smtp_from_email ?? "",
            smtp_from_name: s.smtp_from_name ?? "",
          });
        }
      } catch {
        // Non-fatal — keep defaults
      } finally {
        setSmtpLoading(false);
      }
    }
    void loadSmtpSettings();
  }, []);

  // ── Save / test ───────────────────────────────────────────────────────────

  async function saveEmailSettings() {
    if (emailSaving) return;
    setEmailSaving(true);
    try {
      const res = await fetch("/api/email-settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(emailSettings),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      notify({ title: "Email template saved", variant: "success" });
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setEmailSaving(false);
    }
  }

  async function saveSmtpSettings() {
    if (smtpSaving) return;
    setSmtpSaving(true);
    try {
      const portNum = parseInt(smtpSettings.smtp_port, 10);
      const res = await fetch("/api/email-settings/smtp", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email_provider: smtpSettings.email_provider,
          smtp_host: smtpSettings.smtp_host || null,
          smtp_port: isNaN(portNum) ? null : portNum,
          smtp_secure: smtpSettings.smtp_secure,
          smtp_username: smtpSettings.smtp_username || null,
          smtp_password: smtpSettings.smtp_password || null,
          smtp_from_email: smtpSettings.smtp_from_email || null,
          smtp_from_name: smtpSettings.smtp_from_name || null,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Failed to save");
      notify({ title: "Email provider saved", variant: "success" });
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setSmtpSaving(false);
    }
  }

  async function testSmtpSettings() {
    if (smtpTesting) return;
    setSmtpTesting(true);
    try {
      const res = await fetch("/api/email-settings/test", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Test failed");
      notify({ title: "Test email sent", description: `Sent to ${json?.to ?? "your email"}`, variant: "success" });
    } catch (e: any) {
      notify({ title: "Test failed", description: e?.message ?? "Could not send test email", variant: "error" });
    } finally {
      setSmtpTesting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* ── Email template ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Email template</CardTitle>
          <CardDescription>
            Customise the email sent to clients when an onboarding is dispatched. Use{" "}
            <code className="rounded bg-[var(--color-bg-subtle)] px-1 py-0.5 text-xs font-mono">{"{{title}}"}</code>{" "}
            in the subject line to insert the onboarding name.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {emailLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
              {/* Fields */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Subject line</label>
                  <Input
                    value={emailSettings.email_subject_template}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_subject_template: e.target.value })}
                    placeholder="Action required: {{title}}"
                  />
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Use {"{{title}}"} to include the onboarding name.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Email heading</label>
                  <Input
                    value={emailSettings.email_heading}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_heading: e.target.value })}
                    placeholder="Complete your onboarding"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Message body</label>
                  <textarea
                    rows={3}
                    value={emailSettings.email_body}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_body: e.target.value })}
                    placeholder="Please complete your onboarding in ClientEnforce so your team can continue the next step."
                    className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Button label</label>
                  <Input
                    value={emailSettings.email_cta_label}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_cta_label: e.target.value })}
                    placeholder="Open onboarding"
                  />
                </div>

                <Button
                  onClick={saveEmailSettings}
                  disabled={emailSaving}
                  className="w-full sm:w-auto self-start rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                >
                  {emailSaving ? "Saving..." : "Save email template"}
                </Button>
              </div>

              {/* Preview */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Preview</div>
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white overflow-hidden text-sm">
                  <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
                    <span className="text-xs text-[var(--color-text-muted)]">Subject: </span>
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">
                      {emailSettings.email_subject_template.replace(/\{\{title\}\}/gi, "Your onboarding title") || "—"}
                    </span>
                  </div>
                  <div className="px-5 py-5 flex flex-col gap-3">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Client onboarding</div>
                    <div className="text-base font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                      {emailSettings.email_heading || "Complete your onboarding"}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Hi [Client name],</div>
                    <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {emailSettings.email_body || "Please complete your onboarding in ClientEnforce so your team can continue the next step."}
                    </div>
                    <div className="pt-1">
                      <div className="inline-block rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white">
                        {emailSettings.email_cta_label || "Open onboarding"}
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] text-[var(--color-text-muted)]">
                      This is a transactional email from ClientEnforce.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Email provider ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Email provider</CardTitle>
          <CardDescription>
            Choose how client-facing emails (onboarding dispatches and follow-up reminders) are sent.
            Internal emails such as team invites and password resets always use ClientEnforce.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {smtpLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full max-w-xs" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Provider</label>
                <select
                  className="h-9 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                  value={smtpSettings.email_provider}
                  onChange={(e) =>
                    setSmtpSettings({ ...smtpSettings, email_provider: e.target.value as "clientenforce" | "smtp" })
                  }
                >
                  <option value="clientenforce">ClientEnforce (default)</option>
                  <option value="smtp">Custom SMTP</option>
                </select>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {smtpSettings.email_provider === "smtp"
                    ? "Emails will be sent using your SMTP credentials below."
                    : 'Emails are sent by ClientEnforce from "ClientEnforce <info@clientenforce.com>".'}
                </p>
              </div>

              {smtpSettings.email_provider === "smtp" && (
                <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    SMTP credentials
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Host</label>
                      <Input
                        value={smtpSettings.smtp_host}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Port</label>
                      <Input
                        type="number"
                        value={smtpSettings.smtp_port}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })}
                        placeholder="587"
                      />
                      <p className="text-xs text-[var(--color-text-muted)]">
                        587 (STARTTLS) · 465 (SSL/TLS) · 25 (unencrypted)
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Username</label>
                      <Input
                        value={smtpSettings.smtp_username}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_username: e.target.value })}
                        placeholder="you@gmail.com"
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">Password / App password</label>
                      <Input
                        type="password"
                        value={smtpSettings.smtp_password}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_password: e.target.value })}
                        placeholder="Leave blank to keep existing"
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Gmail: use an App Password, not your Google account password.
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">From email</label>
                      <Input
                        type="email"
                        value={smtpSettings.smtp_from_email}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_email: e.target.value })}
                        placeholder="noreply@yourcompany.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium">From name</label>
                      <Input
                        value={smtpSettings.smtp_from_name}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_name: e.target.value })}
                        placeholder="Your Company"
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded accent-[var(--color-accent)]"
                      checked={smtpSettings.smtp_secure}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_secure: e.target.checked })}
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Use TLS — enable for port 465, leave off for STARTTLS on 587
                    </span>
                  </label>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={saveSmtpSettings}
                  disabled={smtpSaving}
                  className="rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                >
                  {smtpSaving ? "Saving..." : "Save provider settings"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={testSmtpSettings}
                  disabled={smtpTesting}
                  className="rounded-full border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
                >
                  {smtpTesting ? "Sending..." : "Send test email"}
                </Button>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                "Send test email" sends a test message to your own account email using the current settings.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
