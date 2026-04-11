"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { RejectionBanner } from "@/components/ui/rejection-banner";

// ─── Email Template Types ─────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

// All supported requirement types, matching the DB enum + Zod schema.
type RequirementType =
  | "text"
  | "file"
  | "signature"
  | "multiple_choice"
  | "checkbox"   // Feature 6: completion checkbox
  | "heading";   // Feature 7: visual section heading

type Requirement = {
  type: RequirementType;
  label: string;
  is_required: boolean;
  sort_order: number;
  // file type: optional admin form template (upload or link mode)
  attachment_path?: string | null;
  // Feature 1: toggle between uploading a file or pasting a URL
  file_mode?: "upload" | "link";
  link_url?: string | null;
  // multiple_choice: selectable options
  options?: string[];
  // Feature 2: allow multiple selections (renders as checkboxes)
  allow_multi_select?: boolean;
  // Feature 3: include "Other" free-text option
  include_other?: boolean;
  // Feature 5: multi-line textarea instead of single-line input
  multiline?: boolean;
};

type TemplateRow = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type TemplateApiItem = {
  id?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  definition?: unknown;
};

type TemplateDetail = {
  id: string;
  name: string;
  definition: { requirements: Requirement[] };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// All valid requirement types for the type selector
const VALID_TYPES: RequirementType[] = [
  "text",
  "file",
  "signature",
  "multiple_choice",
  "checkbox",
  "heading",
];

function fileNameFromPath(path?: string | null) {
  if (!path) return null;
  const noBucket = path.includes(":") ? path.split(":").slice(1).join(":") : path;
  const parts = noBucket.split("/").filter(Boolean);
  return parts[parts.length - 1] || path;
}

// Normalizes any API/cache shape into a clean TemplateDetail.
function normalizeTemplateDetail(input: any): TemplateDetail {
  const requirements: Requirement[] = Array.isArray(input?.definition?.requirements)
    ? input.definition.requirements.map((r: any, i: number) => {
        const type: RequirementType = VALID_TYPES.includes(r?.type) ? r.type : "text";

        // Headings are never required — enforce here to prevent stale data.
        const is_required = type === "heading" ? false : Boolean(r?.is_required);

        const base: Requirement = {
          type,
          label: typeof r?.label === "string" ? r.label : "",
          is_required,
          sort_order: typeof r?.sort_order === "number" ? r.sort_order : i,
          attachment_path: r?.attachment_path ?? null,
        };

        // Type-specific config fields
        if (type === "file") {
          base.file_mode = r?.file_mode === "link" ? "link" : "upload";
          base.link_url = r?.link_url ?? null;
        }
        if (type === "multiple_choice") {
          base.options = Array.isArray(r?.options) ? r.options : ["", ""];
          base.allow_multi_select = Boolean(r?.allow_multi_select);
          base.include_other = Boolean(r?.include_other);
        }
        if (type === "text") {
          base.multiline = Boolean(r?.multiline);
        }

        return base;
      })
    : [];

  return {
    id: String(input?.id ?? ""),
    name: typeof input?.name === "string" ? input.name : "Untitled template",
    definition: { requirements },
  };
}

function defaultRequirements(): Requirement[] {
  return [
    { type: "text", label: "Full name", is_required: true, sort_order: 0 },
    { type: "file", label: "Upload document", is_required: true, sort_order: 1, file_mode: "upload" },
    { type: "signature", label: "Signature", is_required: true, sort_order: 2 },
  ];
}

// Human-readable label for each type shown in the dropdown.
const TYPE_LABELS: Record<RequirementType, string> = {
  text: "Text input",
  file: "File upload",
  signature: "Signature",
  multiple_choice: "Multiple choice",
  checkbox: "Completion checkbox",
  heading: "Section heading",
};

// ─── Email defaults ───────────────────────────────────────────────────────────

const DEFAULT_EMAIL: EmailSettings = {
  email_subject_template: "Action required: {{title}}",
  email_heading: "Complete your onboarding",
  email_body: "Please complete your onboarding in ClientEnforce so your team can continue the next step.",
  email_cta_label: "Open onboarding",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const { toast: notify } = useToast();

  const [items, setItems] = React.useState<TemplateRow[]>([]);
  const [selected, setSelected] = React.useState<TemplateDetail | null>(null);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [upgradeMessage, setUpgradeMessage] = React.useState<string | null>(null);
  const [detailCache, setDetailCache] = React.useState<Record<string, TemplateDetail>>({});
  const [creating, setCreating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [openingId, setOpeningId] = React.useState<string | null>(null);
  // Per-requirement upload state (keyed by array index)
  const [uploadingIdx, setUploadingIdx] = React.useState<Record<number, boolean>>({});

  // ── Email template state ─────────────────────────────────────────────────────
  const [emailSettings, setEmailSettings] = React.useState<EmailSettings>(DEFAULT_EMAIL);
  const [emailLoading, setEmailLoading] = React.useState(true);
  const [emailSaving, setEmailSaving] = React.useState(false);

  // ── SMTP provider state ───────────────────────────────────────────────────────
  const [smtpSettings, setSmtpSettings] = React.useState<SmtpSettings>(DEFAULT_SMTP);
  const [smtpLoading, setSmtpLoading] = React.useState(true);
  const [smtpSaving, setSmtpSaving] = React.useState(false);
  const [smtpTesting, setSmtpTesting] = React.useState(false);

  // ── Data loading ────────────────────────────────────────────────────────────

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      const rows = json.items || [];
      setItems(rows);
      setDetailCache((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          if (!next[row.id] && row?.name) {
            next[row.id] = normalizeTemplateDetail({
              id: row.id,
              name: row.name,
              definition: { requirements: [] },
            });
          }
        }
        return next;
      });
    } catch (e: any) {
      notify({ title: "Load failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

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

  // ── CRUD ────────────────────────────────────────────────────────────────────

  async function create() {
    if (!name.trim() || creating) {
      if (!name.trim()) notify({ title: "Name required", variant: "error" });
      return;
    }

    const templateName = name.trim();
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const previousSelected = selected;
    const optimisticDetail = normalizeTemplateDetail({
      id: tempId,
      name: templateName,
      definition: { requirements: defaultRequirements() },
    });

    setName("");
    setUpgradeMessage(null);
    setItems((prev) => [{ id: tempId, name: templateName, created_at: now, updated_at: now }, ...prev]);
    setDetailCache((prev) => ({ ...prev, [tempId]: optimisticDetail }));
    setSelected(optimisticDetail);
    setCreating(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: templateName, definition: { requirements: defaultRequirements() } }),
      });
      const json = await res.json();
      if (!res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== tempId));
        setDetailCache((prev) => { const next = { ...prev }; delete next[tempId]; return next; });
        setSelected(previousSelected ?? null);
        setName(templateName);

        if (res.status === 403) {
          const message = String(json?.error ?? "");
          const looksLikePlanLimit = /upgrade|current plan|allows|templates/i.test(message);
          if (looksLikePlanLimit) {
            setUpgradeMessage(message || "Your current subscription does not allow more templates.");
            notify({ title: "Upgrade required", description: message, variant: "error" });
            return;
          }
          notify({ title: "Permission required", description: "You do not have permission to create templates.", variant: "error" });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }

      const createdRaw = (json?.item ?? null) as TemplateApiItem | null;
      const created = createdRaw
        ? normalizeTemplateDetail({ ...createdRaw, definition: createdRaw?.definition ?? optimisticDetail.definition })
        : null;
      setUpgradeMessage(null);
      notify({ title: "Template created", variant: "success" });

      if (created?.id) {
        const createdRow = { id: created.id, name: created.name, created_at: createdRaw?.created_at ?? now, updated_at: createdRaw?.updated_at ?? now };
        setItems((prev) => [createdRow, ...prev.filter((x) => x.id !== tempId && x.id !== created.id)]);
        setDetailCache((prev) => { const next = { ...prev }; delete next[tempId]; next[created.id] = created; return next; });
        setSelected((prev) => (prev?.id === tempId ? created : prev));
      } else {
        setItems((prev) => prev.filter((x) => x.id !== tempId));
        setDetailCache((prev) => { const next = { ...prev }; delete next[tempId]; return next; });
        void load();
      }
    } catch (e: any) {
      setItems((prev) => prev.filter((x) => x.id !== tempId));
      setDetailCache((prev) => { const next = { ...prev }; delete next[tempId]; return next; });
      setSelected(previousSelected ?? null);
      setName(templateName);
      notify({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setCreating(false);
    }
  }

  async function openTemplate(id: string) {
    if (openingId === id) return;

    const cached = detailCache[id];
    if (cached) {
      setSelected(normalizeTemplateDetail(cached));
      if (cached.definition?.requirements?.length > 0) return;
    }

    const row = items.find((x) => x.id === id);
    if (row) {
      setSelected((prev) =>
        prev?.id === id
          ? normalizeTemplateDetail(prev)
          : normalizeTemplateDetail({ id: row.id, name: row.name, definition: cached?.definition ?? { requirements: [] } })
      );
    }

    setOpeningId(id);
    try {
      const res = await fetch(`/api/templates/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      const normalized = normalizeTemplateDetail(json.item);
      setSelected(normalized);
      setDetailCache((prev) => ({ ...prev, [id]: normalized }));
    } catch (e: any) {
      notify({ title: "Open failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setOpeningId(null);
    }
  }

  async function saveSelected() {
    if (!selected || saving) return;

    // Validate labels (headings and all other types need a non-empty label)
    for (let i = 0; i < selected.definition.requirements.length; i += 1) {
      const r = selected.definition.requirements[i];
      if (!r.label?.trim()) {
        notify({
          title: "Validation error",
          description: `Requirement ${i + 1} label is required.`,
          variant: "error",
        });
        return;
      }
    }

    // Validate multiple_choice: at least 2 non-empty, non-duplicate options
    for (let i = 0; i < selected.definition.requirements.length; i += 1) {
      const r = selected.definition.requirements[i];
      const reqLabel = r.label.trim() || `Requirement ${i + 1}`;
      if (r.type === "multiple_choice") {
        const validOptions = (r.options ?? []).filter((o) => o.trim().length > 0);
        if (validOptions.length < 2) {
          notify({ title: "Validation error", description: `"${reqLabel}" must have at least 2 options.`, variant: "error" });
          return;
        }
        const unique = new Set(validOptions.map((o) => o.trim().toLowerCase()));
        if (unique.size !== validOptions.length) {
          notify({ title: "Validation error", description: `"${reqLabel}" has duplicate options.`, variant: "error" });
          return;
        }
      }
      // Validate link mode: require a URL
      if (r.type === "file" && r.file_mode === "link" && !r.link_url?.trim()) {
        notify({ title: "Validation error", description: `"${reqLabel}" link mode requires a URL.`, variant: "error" });
        return;
      }
    }

    const safeSelected = normalizeTemplateDetail(selected);
    setSaving(true);
    try {
      const optimistic = {
        ...safeSelected,
        definition: {
          requirements: safeSelected.definition.requirements.map((r, i) => ({ ...r, sort_order: i })),
        },
      };

      const res = await fetch(`/api/templates/${safeSelected.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: optimistic.name, definition: optimistic.definition }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          notify({ title: "Permission required", description: "You do not have permission to edit templates.", variant: "error" });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }

      const saved = normalizeTemplateDetail(json?.item ?? optimistic);
      setSelected(saved);
      setDetailCache((prev) => ({ ...prev, [saved.id]: saved }));
      setItems((prev) =>
        prev.map((t) => (t.id === saved.id ? { ...t, name: saved.name, updated_at: new Date().toISOString() } : t))
      );
      notify({ title: "Saved", variant: "success" });
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelected() {
    if (!selected || deleting) return;
    const doomed = selected;
    const previousItems = items;
    const previousSelected = selected;
    const previousCache = detailCache;

    setItems((prev) => prev.filter((t) => t.id !== doomed.id));
    setDetailCache((prev) => { const next = { ...prev }; delete next[doomed.id]; return next; });
    setSelected((prev) => (prev?.id === doomed.id ? null : prev));
    setDeleting(true);
    try {
      const res = await fetch(`/api/templates/${doomed.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setItems(previousItems);
          setDetailCache(previousCache);
          setSelected(previousSelected);
          notify({ title: "Permission required", description: "You do not have permission to delete templates.", variant: "error" });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }
      notify({ title: "Deleted", variant: "success" });
    } catch (e: any) {
      setItems(previousItems);
      setDetailCache(previousCache);
      setSelected(previousSelected);
      notify({ title: "Delete failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setDeleting(false);
    }
  }

  async function uploadAttachment(idx: number, file: File) {
    setUploadingIdx((p) => ({ ...p, [idx]: true }));
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/templates/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      const { attachment_path } = json;
      setSelected((prev) => {
        if (!prev) return prev;
        const reqs = prev.definition.requirements.map((r, i) =>
          i === idx ? { ...r, attachment_path } : r
        );
        return { ...prev, definition: { requirements: reqs } };
      });
      notify({ title: "Attachment uploaded", variant: "success" });
    } catch (e: any) {
      notify({ title: "Upload failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setUploadingIdx((p) => ({ ...p, [idx]: false }));
    }
  }

  // Patch a single requirement at index idx with partial updates.
  function updateReq(idx: number, patch: Partial<Requirement>) {
    setSelected((prev) => {
      if (!prev) return prev;
      const reqs = prev.definition.requirements.map((r, i) => (i === idx ? { ...r, ...patch } : r));
      return { ...prev, definition: { requirements: reqs } };
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* ── Create template ── */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-display)" }}>Templates</CardTitle>
          <CardDescription>Define requirements that will be snapshotted into each onboarding.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">New template name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Standard onboarding" />
            </div>
            <Button
              onClick={create}
              disabled={creating}
              className="w-full sm:w-auto rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            {upgradeMessage ? (
              <RejectionBanner kind="plan" message={upgradeMessage} className="rounded-none border-x-0 border-t-0" />
            ) : null}
            <div className="border-b border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">
              {loading ? "Loading..." : `${items.length} templates`}
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <div className="space-y-2 p-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  {items.map((t) => (
                    <button
                      key={t.id}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                      onClick={() => openTemplate(t.id)}
                      disabled={openingId === t.id}
                    >
                      <div className="text-sm font-medium text-[var(--color-text-primary)]">{t.name}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {openingId === t.id ? "Opening..." : new Date(t.updated_at).toLocaleString()}
                      </div>
                    </button>
                  ))}
                  {!items.length ? (
                    <div className="px-4 py-4 text-sm text-[var(--color-text-secondary)]">No templates yet.</div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Edit template ── */}
      {selected ? (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-display)" }}>Edit template</CardTitle>
            <CardDescription>Owner/Admin only. Changes affect future onboardings only.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={selected.name}
                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
              />
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3">
              <div className="text-sm font-semibold">Requirements</div>
              <RequirementList
                requirements={selected.definition.requirements}
                uploadingIdx={uploadingIdx}
                onReorder={(reqs) => setSelected({ ...selected, definition: { requirements: reqs } })}
                onUpdate={(idx, patch) => updateReq(idx, patch)}
                onDelete={(idx) => {
                  const reqs = selected.definition.requirements
                    .filter((_, i) => i !== idx)
                    .map((x, i) => ({ ...x, sort_order: i }));
                  setSelected({ ...selected, definition: { requirements: reqs } });
                }}
                onUploadAttachment={(idx, file) => uploadAttachment(idx, file)}
              />

              {/* Add requirement button */}
              <button
                type="button"
                onClick={() => {
                  const reqs = (selected.definition?.requirements ?? []).slice();
                  reqs.push({ type: "text", label: "", is_required: true, sort_order: reqs.length });
                  setSelected({ ...selected, definition: { requirements: reqs } });
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
              >
                <span className="text-lg leading-none">+</span>
                Add requirement
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={saveSelected}
                disabled={saving || deleting}
                className="w-full sm:w-auto rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="secondary"
                onClick={deleteSelected}
                disabled={saving || deleting}
                className="w-full sm:w-auto rounded-full border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* ── Email template ── */}
      <EmailTemplateSection
        settings={emailSettings}
        loading={emailLoading}
        saving={emailSaving}
        onChange={setEmailSettings}
        onSave={saveEmailSettings}
      />

      {/* ── Email provider / SMTP ── */}
      <SmtpSettingsSection
        settings={smtpSettings}
        loading={smtpLoading}
        saving={smtpSaving}
        testing={smtpTesting}
        onChange={setSmtpSettings}
        onSave={saveSmtpSettings}
        onTest={testSmtpSettings}
      />
    </div>
  );
}

// ─── RequirementList ──────────────────────────────────────────────────────────
// Drag-and-drop list wrapper.

function RequirementList({
  requirements,
  uploadingIdx,
  onReorder,
  onUpdate,
  onDelete,
  onUploadAttachment,
}: {
  requirements: Requirement[];
  uploadingIdx: Record<number, boolean>;
  onReorder: (reqs: Requirement[]) => void;
  onUpdate: (idx: number, patch: Partial<Requirement>) => void;
  onDelete: (idx: number) => void;
  onUploadAttachment: (idx: number, file: File) => void;
}) {
  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [overIdx, setOverIdx] = React.useState<number | null>(null);

  const sorted = requirements.slice().sort((a, b) => a.sort_order - b.sort_order);

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const reqs = sorted.slice();
    const [moved] = reqs.splice(dragIdx, 1);
    reqs.splice(targetIdx, 0, moved);
    onReorder(reqs.map((x, i) => ({ ...x, sort_order: i })));
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {sorted.map((r, idx) => (
        <div
          key={idx}
          draggable
          onDragStart={(e) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
          onDragLeave={() => setOverIdx((prev) => (prev === idx ? null : prev))}
          onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
          className={`transition-opacity ${dragIdx === idx ? "opacity-40" : "opacity-100"} ${
            overIdx === idx && dragIdx !== idx ? "ring-2 ring-[var(--color-accent)] ring-offset-1 rounded-[var(--radius-md)]" : ""
          }`}
        >
          <RequirementEditor
            idx={idx}
            r={r}
            uploadingIdx={uploadingIdx}
            onUpdate={(patch) => onUpdate(idx, patch)}
            onDelete={() => onDelete(idx)}
            onUploadAttachment={(file) => onUploadAttachment(idx, file)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── RequirementEditor ────────────────────────────────────────────────────────

function RequirementEditor({
  idx,
  r,
  uploadingIdx,
  onUpdate,
  onDelete,
  onUploadAttachment,
}: {
  idx: number;
  r: Requirement;
  uploadingIdx: Record<number, boolean>;
  onUpdate: (patch: Partial<Requirement>) => void;
  onDelete: () => void;
  onUploadAttachment: (file: File) => void;
}) {
  const isHeading = r.type === "heading";

  // Shared small toggle class
  const toggleCls = "flex items-center gap-1.5 cursor-pointer select-none";
  const toggleLabelCls = "text-xs text-[var(--color-text-secondary)]";

  return (
    <div className={`rounded-[var(--radius-md)] border flex flex-col gap-0 overflow-hidden ${
      isHeading ? "border-[var(--color-border)] bg-[var(--color-bg-subtle)]" : "border-[var(--color-border)] bg-white"
    }`}>
      {/* ── Main row ── */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Drag handle */}
        <div
          title="Drag to reorder"
          className="flex shrink-0 cursor-grab items-center px-0.5 text-[var(--color-text-muted)] active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true">
            <circle cx="2.5" cy="2.5" r="1.5" /><circle cx="7.5" cy="2.5" r="1.5" />
            <circle cx="2.5" cy="8" r="1.5" /><circle cx="7.5" cy="8" r="1.5" />
            <circle cx="2.5" cy="13.5" r="1.5" /><circle cx="7.5" cy="13.5" r="1.5" />
          </svg>
        </div>

        {/* Type selector */}
        <select
          className="shrink-0 rounded border border-[var(--color-border)] bg-white px-2 py-1.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          style={{ minWidth: 148 }}
          value={r.type}
          onChange={(e) => {
            const type = e.target.value as RequirementType;
            const patch: Partial<Requirement> = { type };
            if (type !== "file") { patch.attachment_path = null; patch.file_mode = undefined; patch.link_url = null; }
            if (type !== "multiple_choice") { patch.options = undefined; patch.allow_multi_select = undefined; patch.include_other = undefined; }
            if (type !== "text") { patch.multiline = undefined; }
            if (type === "multiple_choice" && !r.options?.length) patch.options = ["", ""];
            if (type === "file") patch.file_mode = "upload";
            if (type === "heading") patch.is_required = false;
            onUpdate(patch);
          }}
        >
          {(Object.keys(TYPE_LABELS) as RequirementType[]).map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>

        {/* Label */}
        <Input
          value={r.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder={isHeading ? "Section heading text" : "Label"}
          className="flex-1 text-sm"
        />

        {/* Required toggle or heading hint */}
        {!isHeading ? (
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={r.is_required} onChange={(e) => onUpdate({ is_required: e.target.checked })} className="accent-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">Required</span>
          </label>
        ) : (
          <span className="shrink-0 text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">divider</span>
        )}

        {/* Delete */}
        <button type="button" onClick={onDelete}
          className="shrink-0 flex h-6 w-6 items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 text-sm">
          ✕
        </button>
      </div>

      {/* ── Sub-options (only when needed) ── */}
      {(r.type === "file" || r.type === "text" || r.type === "multiple_choice") ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 flex flex-col gap-2">

          {/* File: template mode toggle + input */}
          {r.type === "file" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--color-text-muted)]">Template:</span>
              <div className="flex items-center gap-1">
                {(["upload", "link"] as const).map((mode) => (
                  <button key={mode} type="button"
                    onClick={() => onUpdate(mode === "upload" ? { file_mode: "upload", link_url: null } : { file_mode: "link", attachment_path: null })}
                    className={`rounded border px-2.5 py-0.5 text-xs font-medium transition ${
                      (r.file_mode ?? "upload") === mode
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                    }`}
                  >{mode === "upload" ? "Upload file" : "Paste link"}</button>
                ))}
              </div>
              {r.file_mode === "link" ? (
                <Input value={r.link_url || ""} onChange={(e) => onUpdate({ link_url: e.target.value })}
                  placeholder="https://…" className="flex-1 text-xs" />
              ) : r.attachment_path ? (
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs text-[var(--color-text-secondary)] max-w-[180px]">{fileNameFromPath(r.attachment_path)}</span>
                  <button type="button" className="text-xs text-[var(--color-text-muted)] hover:text-red-600" onClick={() => onUpdate({ attachment_path: null })}>Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer rounded border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition">
                  {uploadingIdx[idx] ? "Uploading…" : "Attach file"}
                  <input type="file" className="sr-only" disabled={!!uploadingIdx[idx]} onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadAttachment(f); e.currentTarget.value = ""; }} />
                </label>
              )}
            </div>
          ) : null}

          {/* Text: multiline toggle */}
          {r.type === "text" ? (
            <label className={toggleCls}>
              <input type="checkbox" id={`multiline-${idx}`} checked={!!r.multiline} onChange={(e) => onUpdate({ multiline: e.target.checked })} className="accent-[var(--color-accent)]" />
              <span className={toggleLabelCls}>Multi-line textarea</span>
            </label>
          ) : null}

          {/* Multiple choice: options list + feature toggles */}
          {r.type === "multiple_choice" ? (
            <div className="flex flex-col gap-1.5">
              {(r.options ?? []).map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-1.5">
                  <Input value={opt} onChange={(e) => { const opts = [...(r.options ?? [])]; opts[optIdx] = e.target.value; onUpdate({ options: opts }); }}
                    placeholder={`Option ${optIdx + 1}`} className="flex-1 text-xs py-1" />
                  <button type="button" disabled={(r.options ?? []).length <= 2}
                    className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-red-600 disabled:opacity-30"
                    onClick={() => onUpdate({ options: (r.options ?? []).filter((_, i) => i !== optIdx) })}>✕</button>
                </div>
              ))}
              {(r.options ?? []).length < 20 ? (
                <button type="button" className="self-start text-xs text-[var(--color-accent)] hover:underline"
                  onClick={() => onUpdate({ options: [...(r.options ?? []), ""] })}>+ Add option</button>
              ) : null}
              <div className="flex flex-wrap gap-4 pt-1 border-t border-[var(--color-border)]">
                <label className={toggleCls}>
                  <input type="checkbox" checked={!!r.allow_multi_select} onChange={(e) => onUpdate({ allow_multi_select: e.target.checked })} className="accent-[var(--color-accent)]" />
                  <span className={toggleLabelCls}>Allow multiple selections</span>
                </label>
                <label className={toggleCls}>
                  <input type="checkbox" checked={!!r.include_other} onChange={(e) => onUpdate({ include_other: e.target.checked })} className="accent-[var(--color-accent)]" />
                  <span className={toggleLabelCls}>Include "Other" option</span>
                </label>
              </div>
            </div>
          ) : null}

        </div>
      ) : null}
    </div>
  );
}

// ─── EmailTemplateSection ─────────────────────────────────────────────────────

function EmailTemplateSection({
  settings,
  loading,
  saving,
  onChange,
  onSave,
}: {
  settings: EmailSettings;
  loading: boolean;
  saving: boolean;
  onChange: (s: EmailSettings) => void;
  onSave: () => void;
}) {
  const previewSubject = settings.email_subject_template.replace(/\{\{title\}\}/gi, "Your onboarding title");
  const previewBody = settings.email_body || "Please complete your onboarding in ClientEnforce so your team can continue the next step.";

  return (
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
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            {/* ── Fields ── */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Subject line</label>
                <Input
                  value={settings.email_subject_template}
                  onChange={(e) => onChange({ ...settings, email_subject_template: e.target.value })}
                  placeholder="Action required: {{title}}"
                />
                <p className="text-xs text-[var(--color-text-muted)]">
                  Use {"{{title}}"} to include the onboarding name.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Email heading</label>
                <Input
                  value={settings.email_heading}
                  onChange={(e) => onChange({ ...settings, email_heading: e.target.value })}
                  placeholder="Complete your onboarding"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Message body</label>
                <textarea
                  rows={3}
                  value={settings.email_body}
                  onChange={(e) => onChange({ ...settings, email_body: e.target.value })}
                  placeholder="Please complete your onboarding in ClientEnforce so your team can continue the next step."
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Button label</label>
                <Input
                  value={settings.email_cta_label}
                  onChange={(e) => onChange({ ...settings, email_cta_label: e.target.value })}
                  placeholder="Open onboarding"
                />
              </div>

              <Button
                onClick={onSave}
                disabled={saving}
                className="w-full sm:w-auto self-start rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
              >
                {saving ? "Saving..." : "Save email template"}
              </Button>
            </div>

            {/* ── Preview ── */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Preview</div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white overflow-hidden text-sm">
                {/* Subject */}
                <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
                  <span className="text-xs text-[var(--color-text-muted)]">Subject: </span>
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">{previewSubject || "—"}</span>
                </div>
                {/* Email body mock */}
                <div className="px-5 py-5 flex flex-col gap-3">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Client onboarding</div>
                  <div className="text-base font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    {settings.email_heading || "Complete your onboarding"}
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    Hi [Client name],
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {previewBody}
                  </div>
                  <div className="pt-1">
                    <div className="inline-block rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white">
                      {settings.email_cta_label || "Open onboarding"}
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
  );
}

// ─── SmtpSettingsSection ──────────────────────────────────────────────────────

function SmtpSettingsSection({
  settings,
  loading,
  saving,
  testing,
  onChange,
  onSave,
  onTest,
}: {
  settings: SmtpSettings;
  loading: boolean;
  saving: boolean;
  testing: boolean;
  onChange: (s: SmtpSettings) => void;
  onSave: () => void;
  onTest: () => void;
}) {
  const isSmtp = settings.email_provider === "smtp";

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-display)" }}>Email provider</CardTitle>
        <CardDescription>
          Choose how client-facing emails (onboarding dispatches and follow-up reminders) are sent.
          Internal emails such as team invites and password resets always use ClientEnforce.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full max-w-xs" />
            <Skeleton className="h-9 w-2/3" />
          </div>
        ) : (
          <>
            {/* Provider selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Provider</label>
              <select
                className="h-9 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                value={settings.email_provider}
                onChange={(e) =>
                  onChange({ ...settings, email_provider: e.target.value as "clientenforce" | "smtp" })
                }
              >
                <option value="clientenforce">ClientEnforce (default)</option>
                <option value="smtp">Custom SMTP</option>
              </select>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isSmtp
                  ? "Emails will be sent using your SMTP credentials below."
                  : 'Emails are sent by ClientEnforce from "ClientEnforce <info@clientenforce.com>".'}
              </p>
            </div>

            {/* SMTP fields — only visible when smtp is selected */}
            {isSmtp && (
              <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                  SMTP credentials
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Host</label>
                    <Input
                      value={settings.smtp_host}
                      onChange={(e) => onChange({ ...settings, smtp_host: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Port</label>
                    <Input
                      type="number"
                      value={settings.smtp_port}
                      onChange={(e) => onChange({ ...settings, smtp_port: e.target.value })}
                      placeholder="587"
                    />
                    <p className="text-xs text-[var(--color-text-muted)]">
                      587 (STARTTLS) · 465 (SSL/TLS) · 25 (unencrypted)
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      value={settings.smtp_username}
                      onChange={(e) => onChange({ ...settings, smtp_username: e.target.value })}
                      placeholder="you@gmail.com"
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Password / App password</label>
                    <Input
                      type="password"
                      value={settings.smtp_password}
                      onChange={(e) => onChange({ ...settings, smtp_password: e.target.value })}
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
                      value={settings.smtp_from_email}
                      onChange={(e) => onChange({ ...settings, smtp_from_email: e.target.value })}
                      placeholder="noreply@yourcompany.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">From name</label>
                    <Input
                      value={settings.smtp_from_name}
                      onChange={(e) => onChange({ ...settings, smtp_from_name: e.target.value })}
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-[var(--color-accent)]"
                    checked={settings.smtp_secure}
                    onChange={(e) => onChange({ ...settings, smtp_secure: e.target.checked })}
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Use TLS — enable for port 465, leave off for STARTTLS on 587
                  </span>
                </label>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={onSave}
                disabled={saving}
                className="rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
              >
                {saving ? "Saving..." : "Save provider settings"}
              </Button>
              <Button
                variant="secondary"
                onClick={onTest}
                disabled={testing}
                className="rounded-full border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
              >
                {testing ? "Sending..." : "Send test email"}
              </Button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              "Send test email" sends a test message to your own account email using the current settings.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
