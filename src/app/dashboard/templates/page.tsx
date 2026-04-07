"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { RejectionBanner } from "@/components/ui/rejection-banner";

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
    { type: "text", label: "", is_required: true, sort_order: 0 },
    { type: "file", label: "", is_required: true, sort_order: 1, file_mode: "upload" },
    { type: "signature", label: "", is_required: true, sort_order: 2 },
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const toastApi = useToast() as any;
  const notify: (t: any) => void =
    typeof toastApi?.notify === "function"
      ? toastApi.notify
      : typeof toastApi?.push === "function"
      ? toastApi.push
      : () => {};

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
              <div className="mt-3 flex flex-col gap-4">
                {(selected.definition?.requirements ?? [])
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((r, idx) => (
                    <RequirementEditor
                      key={idx}
                      idx={idx}
                      r={r}
                      uploadingIdx={uploadingIdx}
                      onUpdate={(patch) => updateReq(idx, patch)}
                      onDelete={() => {
                        const reqs = selected.definition.requirements
                          .filter((_, i) => i !== idx)
                          .map((x, i) => ({ ...x, sort_order: i }));
                        setSelected({ ...selected, definition: { requirements: reqs } });
                      }}
                      onUploadAttachment={(file) => uploadAttachment(idx, file)}
                    />
                  ))}

                {/* Add requirement button */}
                <button
                  type="button"
                  onClick={() => {
                    const reqs = (selected.definition?.requirements ?? []).slice();
                    reqs.push({ type: "text", label: "", is_required: true, sort_order: reqs.length });
                    setSelected({ ...selected, definition: { requirements: reqs } });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
                >
                  <span className="text-lg leading-none">+</span>
                  Add requirement
                </button>
              </div>
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
    </div>
  );
}

// ─── RequirementEditor ────────────────────────────────────────────────────────
// Extracted sub-component to keep the main page readable.

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

  return (
    <div
      className={`rounded-[var(--radius-md)] border p-3 flex flex-col gap-2 ${
        isHeading
          ? "border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
          : "border-[var(--color-border)] bg-white"
      }`}
    >
      {/* ── Row 1: type selector, label, required checkbox, delete ── */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
        {/* Type selector */}
        <div className="md:col-span-3">
          <select
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            value={r.type}
            onChange={(e) => {
              const type = e.target.value as RequirementType;
              const patch: Partial<Requirement> = { type };

              // Clear stale type-specific fields when switching
              if (type !== "file") { patch.attachment_path = null; patch.file_mode = undefined; patch.link_url = null; }
              if (type !== "multiple_choice") { patch.options = undefined; patch.allow_multi_select = undefined; patch.include_other = undefined; }
              if (type !== "text") { patch.multiline = undefined; }

              // Defaults for new type
              if (type === "multiple_choice" && !r.options?.length) patch.options = ["", ""];
              if (type === "file") patch.file_mode = "upload";
              // Headings are never required
              if (type === "heading") patch.is_required = false;

              onUpdate(patch);
            }}
          >
            {(Object.keys(TYPE_LABELS) as RequirementType[]).map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Label input */}
        <div className="md:col-span-6">
          <Input
            value={r.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder={isHeading ? "Heading text" : "Requirement label"}
          />
        </div>

        {/* Required checkbox — hidden for headings */}
        <div className="md:col-span-2 flex items-center gap-2">
          {!isHeading ? (
            <>
              <input
                type="checkbox"
                checked={r.is_required}
                onChange={(e) => onUpdate({ is_required: e.target.checked })}
              />
              <span className="text-sm text-[var(--color-text-secondary)]">Required</span>
            </>
          ) : (
            <span className="text-xs text-[var(--color-text-muted)] italic">Section divider</span>
          )}
        </div>

        {/* Delete button */}
        <div className="md:col-span-1">
          <Button
            variant="secondary"
            className="rounded-full border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
            onClick={onDelete}
          >
            ✕
          </Button>
        </div>
      </div>

      {/* ── File type options (Feature 1: upload vs link mode) ── */}
      {r.type === "file" ? (
        <div className="flex flex-col gap-3 pl-1 pt-1">
          {/* Mode toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)]">Form template for client:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdate({ file_mode: "upload", link_url: null })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  !r.file_mode || r.file_mode === "upload"
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
                }`}
              >
                Upload file
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ file_mode: "link", attachment_path: null })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  r.file_mode === "link"
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]"
                }`}
              >
                Paste link
              </button>
            </div>
          </div>

          {/* Upload mode — existing attachment UI */}
          {(!r.file_mode || r.file_mode === "upload") ? (
            <div className="flex flex-wrap items-center gap-3">
              {r.attachment_path ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[200px]" title={fileNameFromPath(r.attachment_path) ?? ""}>
                    {fileNameFromPath(r.attachment_path)}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-[var(--color-text-muted)] hover:text-red-600"
                    onClick={() => onUpdate({ attachment_path: null })}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white">
                  {uploadingIdx[idx] ? "Uploading…" : "Attach form template"}
                  <input
                    type="file"
                    className="sr-only"
                    disabled={!!uploadingIdx[idx]}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onUploadAttachment(f);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          ) : null}

          {/* Link mode — URL input (Feature 1) */}
          {r.file_mode === "link" ? (
            <div className="flex items-center gap-2">
              <Input
                value={r.link_url || ""}
                onChange={(e) => onUpdate({ link_url: e.target.value })}
                placeholder="https://… (link shown to client as a button)"
                className="text-sm"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Text type options (Feature 5: multiline toggle) ── */}
      {r.type === "text" ? (
        <div className="flex items-center gap-2 pl-1 pt-1">
          <input
            type="checkbox"
            id={`multiline-${idx}`}
            checked={!!r.multiline}
            onChange={(e) => onUpdate({ multiline: e.target.checked })}
          />
          <label htmlFor={`multiline-${idx}`} className="text-xs text-[var(--color-text-secondary)] cursor-pointer select-none">
            Multi-line input (textarea)
          </label>
        </div>
      ) : null}

      {/* ── Multiple choice options (existing + Feature 2 + Feature 3) ── */}
      {r.type === "multiple_choice" ? (
        <div className="flex flex-col gap-2 pl-1 pt-1">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Options (min 2)</span>
          {(r.options ?? []).map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const opts = [...(r.options ?? [])];
                  opts[optIdx] = e.target.value;
                  onUpdate({ options: opts });
                }}
                placeholder={`Option ${optIdx + 1}`}
                className="text-sm"
              />
              <button
                type="button"
                className="shrink-0 text-sm text-[var(--color-text-muted)] hover:text-red-600 disabled:opacity-40"
                disabled={(r.options ?? []).length <= 2}
                onClick={() => {
                  const opts = (r.options ?? []).filter((_, i) => i !== optIdx);
                  onUpdate({ options: opts });
                }}
              >
                ✕
              </button>
            </div>
          ))}
          {(r.options ?? []).length < 20 ? (
            <button
              type="button"
              className="self-start text-xs text-[var(--color-accent)] hover:underline"
              onClick={() => onUpdate({ options: [...(r.options ?? []), ""] })}
            >
              + Add option
            </button>
          ) : null}

          {/* Feature 2: allow multiple selections */}
          <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-border)]">
            <input
              type="checkbox"
              id={`multi-select-${idx}`}
              checked={!!r.allow_multi_select}
              onChange={(e) => onUpdate({ allow_multi_select: e.target.checked })}
            />
            <label htmlFor={`multi-select-${idx}`} className="text-xs text-[var(--color-text-secondary)] cursor-pointer select-none">
              Allow multiple selections (renders as checkboxes)
            </label>
          </div>

          {/* Feature 3: include "Other" option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`include-other-${idx}`}
              checked={!!r.include_other}
              onChange={(e) => onUpdate({ include_other: e.target.checked })}
            />
            <label htmlFor={`include-other-${idx}`} className="text-xs text-[var(--color-text-secondary)] cursor-pointer select-none">
              Include "Other" option with free-text input
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
