"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Checkbox } from "@/components/ui/input";
import { FormField, FormGrid } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/ui/page-header";

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

// ─── Phase email templates ───────────────────────────────────────────────────

type PhaseTemplate = { subject: string; body: string };
type PhaseTemplates = {
  phase_approved_next: PhaseTemplate;
  phase_approved_final: PhaseTemplate;
  phase_rejected: PhaseTemplate;
};

const PHASE_TEMPLATE_DEFAULTS: PhaseTemplates = {
  phase_approved_next: {
    subject: "Phase {{phase_name}} approved — please complete {{next_phase_name}}",
    body: "Hi {{client.name}},\n\nGreat news! {{phase_name}} for {{event_name}} has been approved.\n\nYour next step is {{next_phase_name}}. Please log in to continue.\n\n{{link}}",
  },
  phase_approved_final: {
    subject: "Onboarding complete for {{event_name}}",
    body: "Hi {{client.name}},\n\nCongratulations! Your onboarding for {{event_name}} is now fully complete. We look forward to seeing you at the event.\n\n{{link}}",
  },
  phase_rejected: {
    subject: "{{phase_name}} needs updates for {{event_name}}",
    body: "Hi {{client.name}},\n\n{{phase_name}} for {{event_name}} has been sent back for revisions.\n\nReviewer note: {{reviewer_note}}\n\nPlease log in and re-submit once you have made the required changes.\n\n{{link}}",
  },
};

const PHASE_TEMPLATE_LABELS: Record<keyof PhaseTemplates, string> = {
  phase_approved_next: "Phase approved — next phase unlocked",
  phase_approved_final: "Final phase approved (onboarding complete)",
  phase_rejected: "Phase rejected / sent back for revision",
};

const PHASE_TEMPLATE_HINTS: Record<keyof PhaseTemplates, string> = {
  phase_approved_next: "Sent when a phase is approved and the next phase is unlocked.",
  phase_approved_final: "Sent when the final phase is approved and onboarding is complete.",
  phase_rejected: "Sent when a phase is rejected. Use {{reviewer_note}} for the reviewer's feedback.",
};

const PHASE_TAGS: Record<string, string> = {
  "client.name": "Jane Doe",
  "event_name": "DreamHack Dallas 2026",
  "phase_name": "Phase 1 — Company Details",
  "next_phase_name": "Phase 2 — Booth Setup",
  "reviewer_note": "Please update your insurance certificate.",
  "link": "https://app.clientenforce.com/c/sample-token",
};

function PhaseEmailTemplates() {
  const { toast: notify } = useToast();
  const [templates, setTemplates] = React.useState<PhaseTemplates>(PHASE_TEMPLATE_DEFAULTS);
  const [saving, setSaving] = React.useState<keyof PhaseTemplates | null>(null);
  const [activeKey, setActiveKey] = React.useState<keyof PhaseTemplates>("phase_approved_next");
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/email-settings?key=phase_templates");
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (json?.settings?.phase_templates) {
          setTemplates((prev) => ({ ...prev, ...json.settings.phase_templates }));
        }
      } catch { /* keep defaults */ } finally { setLoaded(true); }
    })();
  }, []);

  async function save(key: keyof PhaseTemplates) {
    setSaving(key);
    try {
      const res = await fetch("/api/email-settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phase_templates: { [key]: templates[key] } }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      notify({ title: "Template saved", variant: "success" });
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message, variant: "error" });
    } finally { setSaving(null); }
  }

  const tpl = templates[activeKey];

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Enterprise phase emails</CardTitle>
          <CardDescription>
            Customise the emails sent during phase-based onboarding. Available when Enterprise Onboarding is enabled.
            Use <code className="rounded bg-[var(--color-bg-subtle)] px-1 py-0.5 text-xs font-mono">{"{{client.name}}"}</code>,{" "}
            <code className="rounded bg-[var(--color-bg-subtle)] px-1 py-0.5 text-xs font-mono">{"{{event_name}}"}</code>,{" "}
            <code className="rounded bg-[var(--color-bg-subtle)] px-1 py-0.5 text-xs font-mono">{"{{phase_name}}"}</code>, etc.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Template selector */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(Object.keys(PHASE_TEMPLATE_LABELS) as (keyof PhaseTemplates)[]).map((k) => (
            <button key={k} onClick={() => setActiveKey(k)}
              className={`rounded-[var(--radius-md)] border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeKey === k
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {PHASE_TEMPLATE_LABELS[k]}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs text-[var(--color-text-muted)]">{PHASE_TEMPLATE_HINTS[activeKey]}</p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-4">
            <FormField label="Subject line">
              <Input
                value={tpl.subject}
                onChange={(e) => setTemplates((p) => ({ ...p, [activeKey]: { ...tpl, subject: e.target.value } }))}
              />
            </FormField>
            <FormField label="Body">
              <Textarea
                rows={6}
                value={tpl.body}
                onChange={(e) => setTemplates((p) => ({ ...p, [activeKey]: { ...tpl, body: e.target.value } }))}
              />
            </FormField>
            <div>
              <Button onClick={() => save(activeKey)} loading={saving === activeKey}>Save template</Button>
            </div>
          </div>

          {/* Preview */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Preview</div>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)]">
              <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2">
                <span className="text-xs text-[var(--color-text-muted)]">Subject: </span>
                <span className="text-xs font-medium text-[var(--color-text-primary)]">{renderMergeTags(tpl.subject, PHASE_TAGS)}</span>
              </div>
              <div className="whitespace-pre-wrap px-4 py-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {renderMergeTags(tpl.body, PHASE_TAGS)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Merge-tag rendering helpers
const KNOWN_TAGS: Record<string, string> = {
  "client.name": "Jane Doe",
  "client.email": "jane@acmecorp.com",
  "onboarding.title": "Acme Corp kickoff",
  "title": "Acme Corp kickoff",
  "link": "https://app.clientenforce.com/c/sample-token",
  "org.name": "Your Agency",
};

function renderMergeTags(src: string, sample: Record<string, string>): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) parts.push(<span key={`t${i++}`}>{src.slice(last, m.index)}</span>);
    const key = m[1];
    const val = sample[key];
    if (val !== undefined) {
      parts.push(
        <span key={`v${i++}`} className="rounded bg-[var(--color-accent-subtle)] px-1 text-[var(--color-accent)]">
          {val}
        </span>
      );
    } else {
      parts.push(
        <span key={`u${i++}`} className="rounded bg-[var(--color-danger-subtle)] px-1 font-mono text-[var(--color-danger)]" title={`Unresolved tag: ${m[0]}`}>
          {m[0]}
        </span>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) parts.push(<span key={`t${i++}`}>{src.slice(last)}</span>);
  return parts;
}

export default function EmailPage() {
  const { toast: notify } = useToast();
  const [previewTab, setPreviewTab] = React.useState<"edit" | "preview">("edit");
  const [sampleData, setSampleData] = React.useState<Record<string, string>>(KNOWN_TAGS);

  // Try to fetch a sample onboarding for more realistic preview
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/onboardings?limit=1", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json().catch(() => null);
        const row = Array.isArray(j?.onboardings) ? j.onboardings[0] : Array.isArray(j?.rows) ? j.rows[0] : null;
        if (row) {
          setSampleData((prev) => ({
            ...prev,
            "client.name": row.client_name || prev["client.name"],
            "client.email": row.client_email || prev["client.email"],
            "onboarding.title": row.title || prev["onboarding.title"],
            "title": row.title || prev["title"],
            "link": row.client_link || prev["link"],
          }));
        }
      } catch {
        // non-fatal, keep defaults
      }
    })();
  }, []);

  const [emailSettings, setEmailSettings] = React.useState<EmailSettings>(DEFAULT_EMAIL);
  const [emailLoading, setEmailLoading] = React.useState(true);
  const [emailSaving, setEmailSaving] = React.useState(false);

  const [smtpSettings, setSmtpSettings] = React.useState<SmtpSettings>(DEFAULT_SMTP);
  const [smtpLoading, setSmtpLoading] = React.useState(true);
  const [smtpSaving, setSmtpSaving] = React.useState(false);
  const [smtpTesting, setSmtpTesting] = React.useState(false);
  const [hasExistingPassword, setHasExistingPassword] = React.useState(false);

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
          setHasExistingPassword(!!s.smtp_password);
          setSmtpSettings({
            email_provider: s.email_provider ?? "clientenforce",
            smtp_host: s.smtp_host ?? "",
            smtp_port: String(s.smtp_port ?? "587"),
            smtp_secure: s.smtp_secure ?? false,
            smtp_username: s.smtp_username ?? "",
            smtp_password: "",
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
      if (smtpSettings.smtp_password) {
        setHasExistingPassword(true);
        setSmtpSettings((s) => ({ ...s, smtp_password: "" }));
      }
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
    <div className="space-y-6">
      <PageHeader
        title="Email"
        description="Customise client-facing email templates and configure your email provider."
      />

      {/* ── Email template ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Email template</CardTitle>
            <CardDescription>
              Customise the email sent to clients when an onboarding is dispatched. Use{" "}
              <code className="rounded bg-[var(--color-bg-subtle)] px-1 py-0.5 text-xs font-mono">{"{{title}}"}</code>{" "}
              in the subject line to insert the onboarding name.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {emailLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => setPreviewTab("edit")}
                  className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium ${previewTab === "edit" ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("preview")}
                  className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium ${previewTab === "preview" ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}`}
                >
                  Preview
                </button>
              </div>
              <div className={`flex flex-1 flex-col gap-4 ${previewTab === "preview" ? "hidden lg:flex" : "flex"}`}>
                <FormField label="Subject line" hint={`Use {{title}} to include the onboarding name.`}>
                  <Input
                    value={emailSettings.email_subject_template}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_subject_template: e.target.value })}
                    placeholder="Action required: {{title}}"
                  />
                </FormField>

                <FormField label="Email heading">
                  <Input
                    value={emailSettings.email_heading}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_heading: e.target.value })}
                    placeholder="Complete your onboarding"
                  />
                </FormField>

                <FormField label="Message body">
                  <Textarea
                    rows={3}
                    value={emailSettings.email_body}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_body: e.target.value })}
                    placeholder="Please complete your onboarding in ClientEnforce so your team can continue the next step."
                  />
                </FormField>

                <FormField label="Button label">
                  <Input
                    value={emailSettings.email_cta_label}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email_cta_label: e.target.value })}
                    placeholder="Open onboarding"
                  />
                </FormField>

                <div>
                  <Button onClick={saveEmailSettings} loading={emailSaving} disabled={emailSaving}>
                    Save email template
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className={`w-full lg:w-80 shrink-0 ${previewTab === "edit" ? "hidden lg:block" : "block"}`}>
                <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Preview</div>
                <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)]">
                  <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
                    <span className="text-xs text-[var(--color-text-muted)]">Subject: </span>
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">
                      {renderMergeTags(emailSettings.email_subject_template || "—", sampleData)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 px-5 py-5">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Client onboarding</div>
                    <div className="text-base font-semibold text-[var(--color-text-primary)]">
                      {renderMergeTags(emailSettings.email_heading || "Complete your onboarding", sampleData)}
                    </div>
                    <div className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      Hi {renderMergeTags("{{client.name}}", sampleData)},
                    </div>
                    <div className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {renderMergeTags(emailSettings.email_body || DEFAULT_EMAIL.email_body, sampleData)}
                    </div>
                    <div className="pt-1">
                      <div className="inline-block rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white">
                        {renderMergeTags(emailSettings.email_cta_label || "Open onboarding", sampleData)}
                      </div>
                    </div>
                    <div className="pt-2 text-[10px] text-[var(--color-text-muted)]">
                      This is a transactional email from ClientEnforce.
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                  Merge tags highlighted in <span className="text-[var(--color-accent)]">blue</span>. Unresolved tags show in <span className="text-[var(--color-danger)]">red</span>. Available: {"{{client.name}}"}, {"{{onboarding.title}}"}, {"{{title}}"}, {"{{link}}"}, {"{{org.name}}"}.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Enterprise phase email templates ── */}
      <PhaseEmailTemplates />

      {/* ── Email provider ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Email provider</CardTitle>
            <CardDescription>
              Choose how client-facing emails (onboarding dispatches and follow-up reminders) are sent.
              Internal emails such as team invites and password resets always use ClientEnforce.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {smtpLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-9 w-full max-w-xs" />
              <Skeleton className="h-9 w-2/3" />
            </div>
          ) : (
            <div className="space-y-5">
              <FormField
                label="Provider"
                description={
                  smtpSettings.email_provider === "smtp"
                    ? "Emails will be sent using your SMTP credentials below."
                    : 'Emails are sent by ClientEnforce from "ClientEnforce <info@clientenforce.com>".'
                }
              >
                <Select
                  className="max-w-xs"
                  value={smtpSettings.email_provider}
                  onChange={(e) =>
                    setSmtpSettings({ ...smtpSettings, email_provider: e.target.value as "clientenforce" | "smtp" })
                  }
                >
                  <option value="clientenforce">ClientEnforce (default)</option>
                  <option value="smtp">Custom SMTP</option>
                </Select>
              </FormField>

              <Link
                href="/dashboard/email/custom-domain-guide"
                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
              >
                How do I set this up? →
              </Link>

              {smtpSettings.email_provider === "smtp" && (
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                  <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    SMTP credentials
                  </div>
                  <div className="space-y-4">
                    <FormGrid>
                      <FormField label="Host">
                        <Input
                          value={smtpSettings.smtp_host}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_host: e.target.value })}
                          placeholder="smtp.gmail.com"
                        />
                      </FormField>
                      <FormField label="Port" hint="587 (STARTTLS) · 465 (SSL/TLS) · 25 (unencrypted)">
                        <Input
                          type="number"
                          value={smtpSettings.smtp_port}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_port: e.target.value })}
                          placeholder="587"
                        />
                      </FormField>
                      <FormField label="Username">
                        <Input
                          value={smtpSettings.smtp_username}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_username: e.target.value })}
                          placeholder="you@gmail.com"
                          autoComplete="off"
                        />
                      </FormField>
                      <FormField
                        label="Password / App password"
                        hint={
                          hasExistingPassword && !smtpSettings.smtp_password
                            ? "Saved — leave blank to keep existing. Gmail: use an App Password."
                            : "Gmail: use an App Password, not your Google account password."
                        }
                      >
                        <Input
                          type="password"
                          value={smtpSettings.smtp_password}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_password: e.target.value })}
                          placeholder={hasExistingPassword ? "Leave blank to keep existing" : "Password"}
                          autoComplete="new-password"
                        />
                      </FormField>
                      <FormField label="From email">
                        <Input
                          type="email"
                          value={smtpSettings.smtp_from_email}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_email: e.target.value })}
                          placeholder="noreply@yourcompany.com"
                        />
                      </FormField>
                      <FormField label="From name">
                        <Input
                          value={smtpSettings.smtp_from_name}
                          onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_from_name: e.target.value })}
                          placeholder="Your Company"
                        />
                      </FormField>
                    </FormGrid>

                    <label className="flex cursor-pointer items-center gap-2">
                      <Checkbox
                        checked={smtpSettings.smtp_secure}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, smtp_secure: e.target.checked })}
                      />
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        Use TLS — enable for port 465, leave off for STARTTLS on 587
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={saveSmtpSettings} loading={smtpSaving} disabled={smtpSaving}>
                  Save provider settings
                </Button>
                <Button variant="secondary" onClick={testSmtpSettings} loading={smtpTesting} disabled={smtpTesting}>
                  Send test email
                </Button>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                &quot;Send test email&quot; sends a test message to your own account email using the current settings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
