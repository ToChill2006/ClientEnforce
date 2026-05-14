"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { RejectionBanner } from "@/components/ui/rejection-banner";
import { PageHeader } from "@/components/ui/page-header";
import { Plus } from "lucide-react";


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
  phase_number?: number;
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
  // Conditional visibility. Hidden when condition not met.
  visible_if?: {
    depends_on_label: string;
    equals?: string;
    not_empty?: boolean;
  } | null;
};

type PhaseDef = {
  number: number;
  name: string;
  default_deadline_offset_days?: number;
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
  definition: { requirements: Requirement[]; phases?: PhaseDef[] };
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

        // Phase assignment
        if (typeof r?.phase_number === "number") {
          base.phase_number = r.phase_number;
        }

        // Conditional visibility (opt-in)
        if (r?.visible_if && typeof r.visible_if.depends_on_label === "string" && r.visible_if.depends_on_label) {
          base.visible_if = {
            depends_on_label: String(r.visible_if.depends_on_label),
            equals: typeof r.visible_if.equals === "string" ? r.visible_if.equals : undefined,
            not_empty: r.visible_if.not_empty === true ? true : undefined,
          };
        }

        return base;
      })
    : [];

  const phases: PhaseDef[] = Array.isArray(input?.definition?.phases)
    ? input.definition.phases
        .filter((p: any) => typeof p?.number === "number")
        .map((p: any) => ({
          number: p.number,
          name: typeof p.name === "string" ? p.name : `Phase ${p.number}`,
          default_deadline_offset_days: typeof p.default_deadline_offset_days === "number" ? p.default_deadline_offset_days : undefined,
        }))
    : [];

  return {
    id: String(input?.id ?? ""),
    name: typeof input?.name === "string" ? input.name : "Untitled template",
    definition: { requirements, phases },
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
  const [activePhase, setActivePhase] = React.useState(1);
  const [hasEnterpriseFlag, setHasEnterpriseFlag] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/events").then((r) => { if (r.ok) setHasEnterpriseFlag(true); }).catch(() => {});
  }, []);

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
      setActivePhase(normalized.definition.phases?.[0]?.number ?? 1);
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
          phases: safeSelected.definition.phases ?? [],
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
        return { ...prev, definition: { ...prev.definition, requirements: reqs } };
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
      return { ...prev, definition: { ...prev.definition, requirements: reqs } };
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Define requirements that will be snapshotted into each onboarding."
      />

      {upgradeMessage && <RejectionBanner kind="plan" message={upgradeMessage} />}

      {/* ── Create template ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>New template</CardTitle>
            <CardDescription>Start a new template from scratch.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <FormField label="Template name" className="flex-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Standard onboarding"
              />
            </FormField>
            <Button
              onClick={create}
              loading={creating}
              disabled={creating}
              iconLeft={<Plus className="h-3.5 w-3.5" />}
            >
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Template list ── */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              {loading ? "Loading…" : `${items.length} template${items.length === 1 ? "" : "s"}`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border)]">
            {loading ? (
              <div className="space-y-2 p-5">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[var(--color-text-secondary)]">
                No templates yet.
              </div>
            ) : (
              items.map((t) => (
                <button
                  key={t.id}
                  className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                  onClick={() => openTemplate(t.id)}
                  disabled={openingId === t.id}
                >
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{t.name}</div>
                  <div className="text-xs tabular-nums text-[var(--color-text-muted)]">
                    {openingId === t.id
                      ? "Opening…"
                      : new Date(t.updated_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Edit template ── */}
      {selected ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Edit template</CardTitle>
              <CardDescription>Owner/Admin only. Changes affect future onboardings only.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Name">
              <Input
                value={selected.name}
                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
              />
            </FormField>

            <PhaseAwareRequirements
              selected={selected}
              activePhase={activePhase}
              uploadingIdx={uploadingIdx}
              setActivePhase={setActivePhase}
              setSelected={setSelected}
              updateReq={updateReq}
              uploadAttachment={uploadAttachment}
              hasEnterpriseFlag={hasEnterpriseFlag}
            />

            <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
              <Button onClick={saveSelected} loading={saving} disabled={saving || deleting}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={deleteSelected}
                loading={deleting}
                disabled={saving || deleting}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

    </div>
  );
}

// ─── PhaseAwareRequirements ───────────────────────────────────────────────────

function PhaseAwareRequirements({
  selected,
  activePhase,
  uploadingIdx,
  setActivePhase,
  setSelected,
  updateReq,
  uploadAttachment,
  hasEnterpriseFlag,
}: {
  selected: TemplateDetail;
  activePhase: number;
  uploadingIdx: Record<number, boolean>;
  setActivePhase: (n: number) => void;
  setSelected: React.Dispatch<React.SetStateAction<TemplateDetail | null>>;
  updateReq: (idx: number, patch: Partial<Requirement>) => void;
  uploadAttachment: (idx: number, file: File) => void;
  hasEnterpriseFlag: boolean;
}) {
  const allReqs = selected.definition.requirements;
  const phases = selected.definition.phases ?? [];
  const phasedMode = phases.length > 0;

  // Requirements for the active phase (sorted), with their index in allReqs
  const viewEntries = React.useMemo(() => {
    const sorted = allReqs
      .map((r, i) => ({ r, i }))
      .sort((a, b) => a.r.sort_order - b.r.sort_order);
    return phasedMode ? sorted.filter(({ r }) => r.phase_number === activePhase) : sorted;
  }, [allReqs, phasedMode, activePhase]);

  const viewReqs = viewEntries.map(({ r }) => r);
  const currentPhaseObj = phases.find((p) => p.number === activePhase);

  function handleReorder(newViewReqs: Requirement[]) {
    if (!phasedMode) {
      setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, requirements: newViewReqs } });
      return;
    }
    const otherReqs = allReqs.filter((r) => r.phase_number !== activePhase);
    const reordered = newViewReqs.map((r, i) => ({ ...r, sort_order: i }));
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, requirements: [...otherReqs, ...reordered] } });
  }

  function handleUpdate(viewIdx: number, patch: Partial<Requirement>) {
    const globalIdx = viewEntries[viewIdx]?.i ?? -1;
    if (globalIdx === -1) return;
    updateReq(globalIdx, patch);
  }

  function handleDelete(viewIdx: number) {
    const globalIdx = viewEntries[viewIdx]?.i ?? -1;
    if (globalIdx === -1) return;
    const reqs = allReqs.filter((_, i) => i !== globalIdx).map((x, i) => ({ ...x, sort_order: i }));
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, requirements: reqs } });
  }

  function handleUpload(viewIdx: number, file: File) {
    const globalIdx = viewEntries[viewIdx]?.i ?? -1;
    if (globalIdx === -1) return;
    uploadAttachment(globalIdx, file);
  }

  function addRequirement() {
    const newReq: Requirement = {
      type: "text",
      label: "",
      is_required: true,
      sort_order: allReqs.length,
      ...(phasedMode ? { phase_number: activePhase } : {}),
    };
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, requirements: [...allReqs, newReq] } });
  }

  function addPhase() {
    const nextNum = phases.length === 0 ? 2 : Math.max(...phases.map((p) => p.number)) + 1;
    let newReqs = allReqs;
    let newPhases: PhaseDef[];
    if (phases.length === 0) {
      // First "Add phase" click: assign all existing reqs to phase 1, create phases 1 & 2
      newReqs = allReqs.map((r) => ({ ...r, phase_number: 1 }));
      newPhases = [
        { number: 1, name: "Phase 1", default_deadline_offset_days: -60 },
        { number: 2, name: "Phase 2", default_deadline_offset_days: -30 },
      ];
      setActivePhase(1);
    } else {
      newPhases = [...phases, { number: nextNum, name: `Phase ${nextNum}`, default_deadline_offset_days: -14 }];
      setActivePhase(nextNum);
    }
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, phases: newPhases, requirements: newReqs } });
  }

  function deletePhase(phaseNum: number) {
    const newPhases = phases.filter((p) => p.number !== phaseNum);
    const newReqs = allReqs.filter((r) => r.phase_number !== phaseNum);
    if (activePhase === phaseNum) setActivePhase(newPhases[0]?.number ?? 1);
    // If removing the last phase, strip phase_number from remaining reqs
    const finalReqs = newPhases.length === 0 ? newReqs.map(({ phase_number: _, ...r }) => r) : newReqs;
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, phases: newPhases, requirements: finalReqs } });
  }

  function updatePhase(phaseNum: number, patch: Partial<PhaseDef>) {
    const newPhases = phases.map((p) => (p.number === phaseNum ? { ...p, ...patch } : p));
    setSelected((prev) => prev && { ...prev, definition: { ...prev.definition, phases: newPhases } });
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3">
      {/* Phase tab bar */}
      <div className="mb-3 flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] pb-2">
        {phases.map((phase) => (
          <div key={phase.number} className="flex items-center">
            <button
              type="button"
              onClick={() => setActivePhase(phase.number)}
              className={`rounded-l px-3 py-1.5 text-xs font-medium transition ${
                activePhase === phase.number
                  ? "bg-[var(--color-accent)] text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
              }`}
            >
              {phase.name}
            </button>
            <button
              type="button"
              onClick={() => deletePhase(phase.number)}
              title="Remove phase"
              className={`rounded-r border-y border-r px-1.5 py-1.5 text-[10px] transition hover:text-red-500 ${
                activePhase === phase.number
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white hover:bg-red-500 hover:border-red-500"
                  : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-muted)]"
              }`}
            >
              ✕
            </button>
          </div>
        ))}
        {hasEnterpriseFlag && (
          <button
            type="button"
            onClick={addPhase}
            className="rounded border border-dashed border-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] transition"
          >
            + Add phase
          </button>
        )}
        {hasEnterpriseFlag && !phasedMode && (
          <span className="ml-1 text-xs text-[var(--color-text-muted)]">
            Add a phase to split requirements across separate pages
          </span>
        )}
      </div>

      {/* Phase metadata editor */}
      {phasedMode && currentPhaseObj && (
        <div className="mb-3 flex flex-wrap items-end gap-3 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] px-3 py-2">
          <FormField label="Phase name" className="min-w-[160px] flex-1">
            <Input
              value={currentPhaseObj.name}
              onChange={(e) => updatePhase(activePhase, { name: e.target.value })}
              className="text-sm"
            />
          </FormField>
          <FormField label="Days before event end (negative)" className="w-44">
            <Input
              type="number"
              value={currentPhaseObj.default_deadline_offset_days ?? ""}
              onChange={(e) =>
                updatePhase(activePhase, {
                  default_deadline_offset_days: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              placeholder="e.g. -30"
              className="text-sm"
            />
          </FormField>
          <div className="self-end pb-0.5 text-xs text-[var(--color-text-muted)]">
            {viewReqs.length} requirement{viewReqs.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Requirements list */}
      <RequirementList
        requirements={viewReqs}
        uploadingIdx={uploadingIdx}
        onReorder={handleReorder}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onUploadAttachment={handleUpload}
      />

      {/* Add requirement */}
      <button
        type="button"
        onClick={addRequirement}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
      >
        <span className="text-lg leading-none">+</span>
        Add requirement{phasedMode && currentPhaseObj ? ` to ${currentPhaseObj.name}` : ""}
      </button>
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
  const rafRef = React.useRef<number | null>(null);

  const sorted = requirements.slice().sort((a, b) => a.sort_order - b.sort_order);

  // Auto-scroll while dragging near the viewport edges.
  React.useEffect(() => {
    if (dragIdx === null) return;

    function onDocDragOver(e: DragEvent) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const ZONE = 80;
      const y = e.clientY;
      const vh = window.innerHeight;
      if (y < ZONE) {
        const speed = ((ZONE - y) / ZONE) * 14;
        const tick = () => { window.scrollBy(0, -speed); rafRef.current = requestAnimationFrame(tick); };
        rafRef.current = requestAnimationFrame(tick);
      } else if (y > vh - ZONE) {
        const speed = ((y - (vh - ZONE)) / ZONE) * 14;
        const tick = () => { window.scrollBy(0, speed); rafRef.current = requestAnimationFrame(tick); };
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    document.addEventListener("dragover", onDocDragOver);
    return () => {
      document.removeEventListener("dragover", onDocDragOver);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragIdx]);

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
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); if (rafRef.current) cancelAnimationFrame(rafRef.current); }}
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
            priorReqs={sorted.slice(0, idx)}
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
  priorReqs,
  uploadingIdx,
  onUpdate,
  onDelete,
  onUploadAttachment,
}: {
  idx: number;
  r: Requirement;
  priorReqs: Requirement[];
  uploadingIdx: Record<number, boolean>;
  onUpdate: (patch: Partial<Requirement>) => void;
  onDelete: () => void;
  onUploadAttachment: (file: File) => void;
}) {
  const isHeading = r.type === "heading";
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const priorCandidates = priorReqs.filter(
    (p) => p.type !== "heading" && p.label && p.label.trim()
  );

  // Shared small toggle class
  const toggleCls = "flex items-center gap-1.5 cursor-pointer select-none";
  const toggleLabelCls = "text-xs text-[var(--color-text-secondary)]";

  return (
    <div className={`rounded-[var(--radius-md)] border flex flex-col gap-0 overflow-hidden ${
      isHeading ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-panel)]"
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
          className="shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
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
          className={`flex-1 text-sm ${isHeading ? "font-semibold" : ""}`}
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
                        : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
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

      {/* ── Advanced: conditional visibility ── */}
      {!isHeading && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            {showAdvanced ? "▾" : "▸"} Advanced {r.visible_if ? "(conditional)" : ""}
          </button>
          {showAdvanced && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Only show if:</span>
                <select
                  className="rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1 text-xs"
                  value={r.visible_if?.depends_on_label ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) onUpdate({ visible_if: null });
                    else
                      onUpdate({
                        visible_if: {
                          depends_on_label: v,
                          equals: r.visible_if?.equals,
                          not_empty: r.visible_if?.not_empty,
                        },
                      });
                  }}
                  disabled={priorCandidates.length === 0}
                >
                  <option value="">— Always show —</option>
                  {priorCandidates.map((p, i) => (
                    <option key={i} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {r.visible_if?.depends_on_label && (
                  <>
                    <select
                      className="rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1 text-xs"
                      value={r.visible_if.not_empty ? "not_empty" : "equals"}
                      onChange={(e) => {
                        const cond = e.target.value;
                        if (cond === "not_empty") {
                          onUpdate({
                            visible_if: {
                              depends_on_label: r.visible_if!.depends_on_label,
                              not_empty: true,
                            },
                          });
                        } else {
                          onUpdate({
                            visible_if: {
                              depends_on_label: r.visible_if!.depends_on_label,
                              equals: r.visible_if?.equals ?? "",
                            },
                          });
                        }
                      }}
                    >
                      <option value="equals">equals</option>
                      <option value="not_empty">has any answer</option>
                    </select>
                    {!r.visible_if.not_empty && (
                      <Input
                        value={r.visible_if.equals ?? ""}
                        onChange={(e) =>
                          onUpdate({
                            visible_if: {
                              depends_on_label: r.visible_if!.depends_on_label,
                              equals: e.target.value,
                            },
                          })
                        }
                        placeholder="Expected value"
                        className="flex-1 text-xs py-1"
                      />
                    )}
                  </>
                )}
              </div>
              {priorCandidates.length === 0 && (
                <div className="text-[10px] text-[var(--color-text-muted)]">
                  Add a requirement above this one to use as a condition.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

