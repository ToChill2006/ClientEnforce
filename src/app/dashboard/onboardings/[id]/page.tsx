"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Download,
  Lock,
  FileText,
  Eye,
  Send,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, Tag } from "@/components/ui/status-badge";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { normalizeStatus, type OnboardingStatus } from "@/lib/status";
import { cn } from "@/lib/cn";

type Requirement = {
  id: string;
  onboarding_id?: string | null;
  type?: string | null;
  kind?: string | null;
  label?: string | null;
  prompt?: string | null;
  description?: string | null;
  is_required?: boolean | null;
  required?: boolean | null;
  value_text?: string | null;
  value_json?: any;
  file_path?: string | null;
  file_paths?: string[] | null;
  signature_path?: string | null;
  attachment_path?: string | null;
  options?: string[] | null;
  completed_at?: string | null;
  completed_by?: string | null;
  completed?: boolean | null;
  phase_number?: number | null;
  review_status?: string | null;
  reviewer_comment?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DetailPayload = {
  onboarding: {
    id: string;
    title: string | null;
    status: string | null;
    token: string | null;
    client_link: string | null;
    client_email: string | null;
    client_name: string | null;
    template_name: string | null;
    owner_id: string | null;
    owner_name: string | null;
    created_at: string | null;
    updated_at: string | null;
    metadata?: any;
  };
  requirements: Requirement[];
};

type ReminderOverride = {
  enabled: boolean;
  days_between?: number;
  max_reminders?: number;
};

type OrgFollowupSettings = {
  followup_delay_days: number;
  followup_max_count: number;
};

function normalizeRequirement(raw: any): Requirement {
  const r = raw || {};
  return {
    id: String(r.id),
    onboarding_id: r.onboarding_id ?? r.onboardingId ?? null,
    type: r.type ?? null,
    kind: r.kind ?? r.type ?? null,
    label: r.label ?? null,
    prompt: r.prompt ?? r.description ?? null,
    description: r.description ?? null,
    is_required: typeof r.is_required === "boolean" ? r.is_required : r.isRequired ?? null,
    required: typeof r.required === "boolean" ? r.required : null,
    value_text: r.value_text ?? r.valueText ?? null,
    value_json: r.value_json ?? r.valueJson ?? null,
    file_path: r.file_path ?? r.filePath ?? null,
    file_paths: Array.isArray(r.file_paths) ? r.file_paths : null,
    signature_path: r.signature_path ?? r.signaturePath ?? null,
    attachment_path: r.attachment_path ?? null,
    options: Array.isArray(r.options) ? r.options : null,
    completed_at: r.completed_at ?? r.completedAt ?? null,
    completed_by: r.completed_by ?? r.completedBy ?? null,
    completed: typeof r.completed === "boolean" ? r.completed : null,
    phase_number: typeof r.phase_number === "number" ? r.phase_number : null,
    review_status: r.review_status ?? null,
    reviewer_comment: r.reviewer_comment ?? null,
    sort_order: typeof r.sort_order === "number" ? r.sort_order : r.sortOrder ?? null,
    created_at: r.created_at ?? r.createdAt ?? null,
    updated_at: r.updated_at ?? r.updatedAt ?? null,
  };
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function reqKindLabel(kind?: string | null) {
  const k = (kind || "").toLowerCase();
  if (!k) return "Field";
  if (k === "text" || k === "short_text") return "Text";
  if (k === "long_text" || k === "textarea") return "Long text";
  if (k === "file" || k === "upload") return "File";
  if (k === "signature") return "Signature";
  if (k === "checkbox") return "Checkbox";
  if (k === "select") return "Select";
  if (k === "date") return "Date";
  if (k === "multiple_choice") return "Multiple choice";
  if (k === "heading") return "Section";
  return kind as string;
}

function parseMultiSelect(
  vt: string | null | undefined,
  knownOptions?: string[] | null
): Array<{ label: string; isOther: boolean }> | null {
  if (!vt) return null;
  const s = vt.trim();
  if (!s.startsWith("[")) return null;
  try {
    const parsed = JSON.parse(s);
    if (!Array.isArray(parsed)) return null;
    const items = parsed.map(String).filter(Boolean);
    if (items.length === 0) return null;
    return items.map((item) => {
      const isOther = !!(knownOptions && knownOptions.length > 0 && !knownOptions.includes(item));
      return { label: isOther ? `Other: ${item}` : item, isOther };
    });
  } catch {
    return null;
  }
}

function valuePreview(r: Requirement): { type: "text" | "json" | "file" | "signature" | "empty"; v?: any } {
  const sig = (r.signature_path || "").trim();
  const fp = (r.file_path || "").trim();
  const vt = typeof r.value_text === "string" ? r.value_text : null;
  if (sig) return { type: "signature", v: sig };
  if (fp) return { type: "file", v: fp };
  if (vt != null && vt.trim() !== "") return { type: "text", v: vt };
  if (r.value_json != null) return { type: "json", v: r.value_json };
  return { type: "empty" };
}

function fileNameFromPath(path?: string | null) {
  if (!path) return "file";
  try {
    const noBucket = path.includes(":") ? path.split(":").slice(1).join(":") : path;
    const clean = noBucket.split("?")[0];
    const parts = clean.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "file");
  } catch {
    const parts = String(path).split("/");
    return parts[parts.length - 1] || "file";
  }
}

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v);
}

function parseStorageRef(ref: string, defaultBucket: string) {
  const raw = (ref || "").trim();
  if (!raw) return { bucket: defaultBucket, path: "" };
  if (raw.includes(":")) {
    const [bucket, ...rest] = raw.split(":");
    return { bucket, path: rest.join(":").replace(/^\/+/, "") };
  }
  return { bucket: defaultBucket, path: raw.replace(/^\/+/, "") };
}

function previewRef(ref: string, defaultBucket: string) {
  const raw = (ref || "").trim();
  if (!raw) throw new Error("Missing file reference");
  if (isHttpUrl(raw)) return raw;
  const { bucket, path } = parseStorageRef(raw, defaultBucket);
  if (!path) throw new Error("Missing storage path");
  return `/api/storage/preview?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
}

function triggerBrowserDownload(url: string, filename?: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener noreferrer";
  a.target = "_blank";
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadRef(ref: string, defaultBucket: string, filename?: string) {
  const raw = (ref || "").trim();
  if (!raw) throw new Error("Missing file reference");
  if (isHttpUrl(raw)) {
    triggerBrowserDownload(raw, filename);
    return;
  }
  const { bucket, path } = parseStorageRef(raw, defaultBucket);
  if (!path) throw new Error("Missing storage path");
  triggerBrowserDownload(
    `/api/storage/download?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`,
    filename
  );
}

async function fetchRequirementsDirect(onboardingId: string): Promise<Requirement[]> {
  const sb = supabaseBrowser();
  const { data, error } = await sb
    .from("onboarding_requirements")
    .select(
      [
        "id",
        "onboarding_id",
        "type",
        "label",
        "is_required",
        "sort_order",
        "phase_number",
        "review_status",
        "reviewer_comment",
        "completed_at",
        "completed_by",
        "value_text",
        "file_path",
        "file_paths",
        "signature_path",
        "attachment_path",
        "options",
        "created_at",
        "updated_at",
      ].join(",")
    )
    .eq("onboarding_id", onboardingId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeRequirement);
}

export default function OnboardingDetailAdminPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [payload, setPayload] = React.useState<DetailPayload | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [locking, setLocking] = React.useState(false);
  const [downloadingPdf, setDownloadingPdf] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [confirmLock, setConfirmLock] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  // Phase strip + review panel state
  const [phases, setPhases] = React.useState<any[]>([]);
  const [reviewPhaseNumber, setReviewPhaseNumber] = React.useState<number | null>(null);
  const [reviewItems, setReviewItems] = React.useState<Array<{ id: string; label: string; value: string; flagged: boolean; comment: string; file_path?: string | null; file_paths?: string[] | null; file_flags?: boolean[]; signature_path?: string | null }>>([]);
  const [reviewNote, setReviewNote] = React.useState("");
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [reviewPanelOpen, setReviewPanelOpen] = React.useState(false);

  // Reminder override state
  const [orgReminders, setOrgReminders] = React.useState<OrgFollowupSettings | null>(null);
  const [reminderOverride, setReminderOverride] = React.useState<ReminderOverride | null>(null);
  const [remindersSaving, setRemindersSaving] = React.useState(false);

  // Response phase tab state
  const [activeResponsePhase, setActiveResponsePhase] = React.useState<number | null>(null);

  // Preview state
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewName, setPreviewName] = React.useState("");
  const [previewApiUrl, setPreviewApiUrl] = React.useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = React.useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [previewIsImage, setPreviewIsImage] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  function closePreview() {
    setPreviewOpen(false);
    setPreviewLoading(false);
    setPreviewError(null);
    setPreviewIsImage(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  }

  async function openPreview(ref: string, defaultBucket: string, name: string) {
    const apiUrl = previewRef(ref, defaultBucket);
    setPreviewApiUrl(apiUrl);
    setPreviewName(name);
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewIsImage(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Preview failed (${res.status})`);
      const blob = await res.blob();
      setPreviewIsImage(blob.type.startsWith("image/"));
      setPreviewBlobUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setPreviewError(e?.message || "Could not load preview.");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function loadPhases() {
    try {
      const res = await fetch(`/api/onboardings/${params.id}/phases`, { cache: "no-store" });
      if (!res.ok) { setPhases([]); return; }
      const json = await res.json();
      setPhases(json.phases ?? []);
    } catch { /* best-effort */ }
  }

  function openReviewPanel(phaseNumber: number) {
    const allReqs = payload?.requirements ?? [];
    const phaseReqs = allReqs.filter(
      (r) => (r.phase_number ?? 1) === phaseNumber && (r.type ?? r.kind ?? "").toLowerCase() !== "heading"
    );

    setReviewItems(phaseReqs.map((r) => {
      const filePaths = Array.isArray(r.file_paths) && r.file_paths.length > 0
        ? r.file_paths
        : r.file_path ? [r.file_path] : [];
      return {
        id: r.id,
        label: r.label ?? "Field",
        value: r.value_text ?? (filePaths.length > 0 ? `📎 ${filePaths.length} file${filePaths.length > 1 ? "s" : ""} uploaded` : r.signature_path ? "✍ Signature" : "—"),
        flagged: r.review_status === "needs_revision",
        comment: r.reviewer_comment ?? "",
        file_path: r.file_path ?? null,
        file_paths: filePaths.length > 0 ? filePaths : null,
        signature_path: r.signature_path ?? null,
      };
    }));
    setReviewNote("");
    setReviewPhaseNumber(phaseNumber);
    setReviewPanelOpen(true);
  }

  async function submitApprove() {
    if (!reviewPhaseNumber) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/onboardings/${params.id}/phases/${reviewPhaseNumber}/approve`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Approve failed");
      toast({ title: "Phase approved", variant: "success" });
      setReviewPanelOpen(false);
      await loadPhases();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setSubmittingReview(false);
    }
  }

  async function submitReject() {
    if (!reviewPhaseNumber) return;
    const flagged = reviewItems.filter((i) => i.flagged);
    if (flagged.length === 0 && !reviewNote.trim()) {
      toast({ title: "Add a note or flag at least one item", variant: "error" });
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/onboardings/${params.id}/phases/${reviewPhaseNumber}/reject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reviewer_note: reviewNote.trim() || null,
          per_item_flags: flagged.map((i) => ({ requirement_id: i.id, comment: i.comment || null })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Reject failed");
      toast({ title: "Sent back for revision", variant: "success" });
      setReviewPanelOpen(false);
      await loadPhases();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setSubmittingReview(false);
    }
  }

  async function overridePhaseStatus(phaseNumber: number, status: string) {
    try {
      const res = await fetch(`/api/onboardings/${params.id}/phases`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phase_number: phaseNumber, status }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Failed");
      toast({ title: `Phase ${phaseNumber} updated`, variant: "success" });
      await loadPhases();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    }
  }

  async function loadDetail() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/onboardings?id=${encodeURIComponent(params.id)}`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load onboarding (${res.status})`);
      }
      const json = await res.json();

      const fetchProgressAndRequirements = async (): Promise<{ pct: number; reqs: Requirement[] }> => {
        const r = await fetch(
          `/api/onboardings/progress?ids=${encodeURIComponent(params.id)}&include=requirements`,
          { cache: "no-store" }
        );
        if (!r.ok) return { pct: 0, reqs: [] };
        const j = await r.json().catch(() => null);
        const pct = j?.progress?.[params.id]?.percent ?? j?.[params.id]?.percent ?? j?.[params.id] ?? 0;
        const reqListRaw = j?.requirements?.[params.id];
        const reqs = Array.isArray(reqListRaw)
          ? reqListRaw
              .map(normalizeRequirement)
              .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          : [];
        return { pct: typeof pct === "number" ? pct : 0, reqs };
      };

      const attachFallback = async (nextPayload: DetailPayload) => {
        const pr = await fetchProgressAndRequirements();
        if (pr.reqs.length > 0) {
          setProgress(pr.pct);
          return { ...nextPayload, requirements: pr.reqs } as DetailPayload;
        }
        const direct = await fetchRequirementsDirect(params.id);
        setProgress(pr.pct);
        return {
          ...nextPayload,
          requirements: direct.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload;
      };

      const shapeNext = (obRaw: any, reqsRaw: any[]) =>
        ({
          onboarding: obRaw,
          requirements: reqsRaw
            .map(normalizeRequirement)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload);

      if (json?.onboarding && Array.isArray(json?.requirements)) {
        setPayload(await attachFallback(shapeNext(json.onboarding, json.requirements)));
        return;
      }
      if (json?.onboarding && Array.isArray(json?.onboarding_requirements)) {
        setPayload(await attachFallback(shapeNext(json.onboarding, json.onboarding_requirements)));
        return;
      }
      if (json?.onboarding && Array.isArray(json?.rows)) {
        setPayload(await attachFallback(shapeNext(json.onboarding, json.rows)));
        return;
      }
      if (Array.isArray(json?.onboardings)) {
        const row = json.onboardings.find((r: any) => r.id === params.id);
        if (!row) throw new Error("Onboarding not found.");
        setPayload(await attachFallback({ onboarding: row, requirements: [] } as DetailPayload));
        return;
      }
      throw new Error("Unexpected response shape from /api/onboardings?id=…");
    } catch (e: any) {
      setError(e?.message || "Failed to load onboarding.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress() {
    try {
      const res = await fetch(
        `/api/onboardings/progress?ids=${encodeURIComponent(params.id)}&include=requirements`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      const pct = json?.progress?.[params.id]?.percent ?? json?.[params.id]?.percent ?? json?.[params.id] ?? 0;
      setProgress(typeof pct === "number" ? pct : 0);
      const reqListRaw = json?.requirements?.[params.id];
      if (Array.isArray(reqListRaw) && reqListRaw.length > 0) {
        const nextReqs = reqListRaw
          .map(normalizeRequirement)
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setPayload((prev) => (prev ? { ...prev, requirements: nextReqs } : prev));
      }
    } catch {
      // ignore
    }
  }

  async function lock() {
    try {
      setLocking(true);
      const res = await fetch("/api/onboardings/lock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Lock failed");
      toast({ title: "Submission locked", variant: "success" });
      setConfirmLock(false);
      await loadDetail();
      await loadPhases();
    } catch (e: any) {
      toast({ title: "Lock failed", description: e?.message, variant: "error" });
    } finally {
      setLocking(false);
    }
  }

  async function sendEmail() {
    try {
      setSending(true);
      const res = await fetch("/api/onboardings/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ onboarding_id: params.id, id: params.id }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Send failed");
      toast({ title: "Email sent", variant: "success" });
      await loadDetail();
    } catch (e: any) {
      toast({ title: "Send failed", description: e?.message, variant: "error" });
    } finally {
      setSending(false);
    }
  }

  async function deleteOnboarding() {
    try {
      setDeleting(true);
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Delete failed");
      toast({ title: "Onboarding deleted", variant: "success" });
      router.push("/dashboard/onboardings");
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "error" });
      setDeleting(false);
    }
  }

  async function downloadPdf() {
    try {
      if (!params?.id) return;
      setDownloadingPdf(true);
      const filenameBase = (payload?.onboarding?.title || "onboarding").trim() || "onboarding";
      const safeName = filenameBase.replace(/[^a-z0-9\-_ ]/gi, "").replace(/\s+/g, " ").trim().slice(0, 80);
      const url = `/api/onboardings/pdf?onboarding_id=${encodeURIComponent(String(params.id))}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || `PDF export failed (${res.status})`);
      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Empty PDF response");
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `${safeName || "onboarding"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
      toast({ title: "PDF downloaded", variant: "success" });
    } catch (e: any) {
      toast({ title: "PDF failed", description: e?.message, variant: "error" });
    } finally {
      setDownloadingPdf(false);
    }
  }

  async function copyClientLink() {
    if (!payload?.onboarding?.client_link) {
      toast({ title: "No client link", variant: "error" });
      return;
    }
    try {
      await navigator.clipboard.writeText(payload.onboarding.client_link);
      toast({ title: "Link copied", variant: "success" });
    } catch {
      toast({ title: "Copy failed", variant: "error" });
    }
  }

  React.useEffect(() => {
    loadDetail();
    loadProgress();
    loadPhases();
    const t = window.setInterval(() => loadProgress(), 20_000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Load org-level follow-up schedule (non-fatal if forbidden).
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cron/followups/settings", { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        if (j?.settings) {
          setOrgReminders({
            followup_delay_days: j.settings.followup_delay_days,
            followup_max_count: j.settings.followup_max_count,
          });
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Hydrate override from onboarding metadata when loaded.
  React.useEffect(() => {
    const meta = payload?.onboarding?.metadata;
    const r = meta && typeof meta === "object" ? (meta as any).reminders : null;
    if (r && typeof r === "object") {
      setReminderOverride({
        enabled: !!r.enabled,
        days_between: typeof r.days_between === "number" ? r.days_between : undefined,
        max_reminders: typeof r.max_reminders === "number" ? r.max_reminders : undefined,
      });
    }
  }, [payload]);

  async function saveReminderOverride(next: ReminderOverride | null) {
    try {
      setRemindersSaving(true);
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reminder_override: next }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Save failed");
      setReminderOverride(next);
      toast({ title: "Reminder schedule saved", variant: "success" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, variant: "error" });
    } finally {
      setRemindersSaving(false);
    }
  }

  const ob = payload?.onboarding;
  const reqs = payload?.requirements ?? [];
  const statusKey = normalizeStatus(ob?.status) as OnboardingStatus;

  const interactiveReqs = reqs.filter((r) => (r.type ?? r.kind ?? "").toLowerCase() !== "heading");
  const answered = interactiveReqs.filter((r) => valuePreview(r).type !== "empty").length;
  const required = interactiveReqs.filter((r) => !!(r.is_required ?? r.required)).length;
  const requiredCompleted = interactiveReqs.filter((r) => {
    if (!(r.is_required ?? r.required)) return false;
    return valuePreview(r).type !== "empty" || !!r.completed_at || !!r.completed;
  }).length;
  const computedProgress = required ? Math.round((requiredCompleted / required) * 100) : 0;
  const effectiveProgress = Math.max(progress, computedProgress);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Card>
          <CardContent>
            <SkeletonText lines={4} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </div>
        <Button variant="outline" onClick={() => router.back()} iconLeft={<ArrowLeft className="h-3.5 w-3.5" />}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Onboardings", href: "/dashboard/onboardings" },
          { label: ob?.title || "Detail" },
        ]}
        title={
          <div className="flex items-center gap-3">
            <span className="truncate">{ob?.title || "Onboarding"}</span>
            <StatusBadge status={statusKey} />
          </div>
        }
        meta={
          <>
            <span>
              <span className="text-[var(--color-text-muted)]">Client:</span>{" "}
              <span className="text-[var(--color-text-primary)]">{ob?.client_name || "—"}</span>
            </span>
            <span>•</span>
            <span>{ob?.client_email || "—"}</span>
            <span>•</span>
            <span>Updated {formatDate(ob?.updated_at)}</span>
          </>
        }
        actions={
          <>
            {ob?.client_link && (
              <Button variant="outline" size="sm" iconLeft={<Copy className="h-3.5 w-3.5" />} onClick={copyClientLink}>
                Copy link
              </Button>
            )}
            {statusKey !== "submitted" && statusKey !== "locked" && (
              <Button variant="outline" size="sm" iconLeft={<Send className="h-3.5 w-3.5" />} loading={sending} onClick={sendEmail}>
                Send
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              iconLeft={<Download className="h-3.5 w-3.5" />}
              loading={downloadingPdf}
              onClick={downloadPdf}
            >
              PDF
            </Button>
            {statusKey === "submitted" && (
              <Button size="sm" iconLeft={<Lock className="h-3.5 w-3.5" />} onClick={() => setConfirmLock(true)}>
                Lock
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
              onClick={() => setConfirmDelete(true)}
              iconLeft={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </Button>
          </>
        }
      />

      {/* Phase progress strip — only when phases exist */}
      {phases.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Phases</span>
            <a href={`/c/${payload?.onboarding?.token}`} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
              View exhibitor portal ↗
            </a>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            {phases.map((ph: any, idx: number) => {
              const statusColors: Record<string, string> = {
                locked: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]",
                in_progress: "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]",
                awaiting_review: "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[var(--color-warning)]",
                approved: "bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[var(--color-success)]",
                rejected: "bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border-[var(--color-danger)]",
              };
              const statusLabel: Record<string, string> = { locked: "Locked", in_progress: "In Progress", awaiting_review: "Awaiting Review", approved: "Approved", rejected: "Rejected" };
              const statusIcon: Record<string, string> = { approved: "✓", locked: "🔒", awaiting_review: "⏳", rejected: "✗", in_progress: "●" };
              return (
                <React.Fragment key={ph.id}>
                  {idx > 0 && <span className="mt-3 text-[var(--color-text-muted)]">→</span>}
                  <div className={`inline-flex flex-col items-start gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-xs font-medium ${statusColors[ph.status] ?? statusColors.locked}`}>
                    <span className="font-semibold">{statusIcon[ph.status] ?? ""} {ph.name}</span>
                    <span className="opacity-70">{statusLabel[ph.status] ?? ph.status}</span>
                    {ph.deadline && <span className="opacity-60">Due {ph.deadline}</span>}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ph.status === "awaiting_review" && (
                        <button
                          className="rounded bg-[var(--color-warning)] px-2 py-0.5 text-[10px] font-semibold text-white hover:opacity-90"
                          onClick={() => openReviewPanel(ph.phase_number)}
                        >
                          Review →
                        </button>
                      )}
                      {ph.status === "locked" && (
                        <button
                          className="rounded border border-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]"
                          onClick={() => overridePhaseStatus(ph.phase_number, "in_progress")}
                        >
                          Unlock
                        </button>
                      )}
                      {ph.status === "in_progress" && (
                        <button
                          className="rounded border border-[var(--color-warning)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-warning)] hover:bg-[var(--color-warning-subtle)]"
                          onClick={() => openReviewPanel(ph.phase_number)}
                        >
                          Review →
                        </button>
                      )}
                      {(ph.status === "approved" || ph.status === "rejected") && (
                        <button
                          className="rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                          onClick={() => openReviewPanel(ph.phase_number)}
                        >
                          Re-review
                        </button>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Review panel modal */}
      {reviewPanelOpen && reviewPhaseNumber !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]" onClick={() => setReviewPanelOpen(false)}>
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-[var(--shadow-xl)]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Review Phase {reviewPhaseNumber}</h2>
              <button onClick={() => setReviewPanelOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">✕</button>
            </div>

            <div className="space-y-2">
              {reviewItems.map((item, i) => {
                const multiFiles = item.file_paths && item.file_paths.length > 1;
                const singleFile = item.file_paths && item.file_paths.length === 1 ? item.file_paths[0] : null;
                return (
                  <div
                    key={item.id}
                    className={`rounded-[var(--radius-md)] border px-4 py-3 transition-colors ${
                      item.flagged
                        ? "border-[var(--color-danger)] bg-[var(--color-danger-subtle)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-medium ${item.flagged ? "text-[var(--color-danger)]" : "text-[var(--color-text-primary)]"}`}>
                          {item.flagged && <span className="mr-1.5">⚑</span>}{item.label}
                        </div>
                        {/* Single file or signature value row */}
                        {!multiFiles && (
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <span className="break-words">{item.value}</span>
                            {singleFile && (
                              <button
                                onClick={() => openPreview(singleFile, "clientenforce-uploads", fileNameFromPath(singleFile))}
                                className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] hover:bg-[var(--color-bg-hover)]"
                              >View</button>
                            )}
                            {item.signature_path && !singleFile && (
                              <button
                                onClick={() => openPreview(item.signature_path!, "clientenforce-signatures", fileNameFromPath(item.signature_path))}
                                className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] hover:bg-[var(--color-bg-hover)]"
                              >View signature</button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* OK / Needs revision only shown for non-multi-file items */}
                      {!multiFiles && (
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => setReviewItems((prev) => prev.map((x, j) => j === i ? { ...x, flagged: false, comment: "" } : x))}
                            className={`rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors ${
                              !item.flagged
                                ? "bg-[var(--color-success)] text-white"
                                : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                          >✓ OK</button>
                          <button
                            onClick={() => setReviewItems((prev) => prev.map((x, j) => j === i ? { ...x, flagged: true } : x))}
                            className={`rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors ${
                              item.flagged
                                ? "bg-[var(--color-danger)] text-white"
                                : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                          >✗ Needs revision</button>
                        </div>
                      )}
                    </div>

                    {/* Multi-file: per-file rows */}
                    {multiFiles && (
                      <div className="mt-2 space-y-1.5">
                        {item.file_paths!.map((fp, fi) => {
                          const fileFlag = Array.isArray(item.file_flags) ? (item as any).file_flags[fi] : false;
                          return (
                            <div key={fi} className={`flex items-center gap-2 rounded border px-3 py-1.5 text-xs ${fileFlag ? "border-[var(--color-danger)] bg-[var(--color-danger-subtle)]" : "border-[var(--color-border)] bg-[var(--color-bg)]"}`}>
                              <span className="min-w-0 flex-1 truncate text-[var(--color-text-secondary)]" title={fileNameFromPath(fp)}>{fileNameFromPath(fp)}</span>
                              <button
                                onClick={() => openPreview(fp, "clientenforce-uploads", fileNameFromPath(fp))}
                                className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 hover:bg-[var(--color-bg-hover)]"
                              >View</button>
                              <button
                                onClick={() => setReviewItems((prev) => prev.map((x, j) => {
                                  if (j !== i) return x;
                                  const flags: boolean[] = Array.isArray((x as any).file_flags) ? [...(x as any).file_flags] : x.file_paths!.map(() => false);
                                  flags[fi] = false;
                                  return { ...x, file_flags: flags, flagged: flags.some(Boolean) };
                                }))}
                                className={`shrink-0 rounded px-2 py-0.5 font-medium transition-colors ${!fileFlag ? "bg-[var(--color-success)] text-white" : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"}`}
                              >✓ OK</button>
                              <button
                                onClick={() => setReviewItems((prev) => prev.map((x, j) => {
                                  if (j !== i) return x;
                                  const flags: boolean[] = Array.isArray((x as any).file_flags) ? [...(x as any).file_flags] : x.file_paths!.map(() => false);
                                  flags[fi] = true;
                                  return { ...x, file_flags: flags, flagged: true };
                                }))}
                                className={`shrink-0 rounded px-2 py-0.5 font-medium transition-colors ${fileFlag ? "bg-[var(--color-danger)] text-white" : "border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"}`}
                              >✗ Revise</button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {item.flagged && (
                      <textarea
                        className="mt-3 w-full rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-bg)] px-3 py-2 text-xs placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-danger)]"
                        placeholder="Tell the exhibitor what needs to change (optional)"
                        rows={2}
                        value={item.comment}
                        onChange={(e) => setReviewItems((prev) => prev.map((x, j) => j === i ? { ...x, comment: e.target.value } : x))}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">Overall note (sent to exhibitor)</label>
              <textarea
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)]"
                rows={3}
                placeholder="Optional message to the exhibitor…"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setReviewPanelOpen(false)}>Cancel</Button>
              <Button
                variant="outline"
                className="text-[var(--color-danger)] border-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
                onClick={submitReject}
                loading={submittingReview}
                disabled={reviewItems.filter((i) => i.flagged).length === 0 && !reviewNote.trim()}
              >
                Send Back for Revision
              </Button>
              <Button
                onClick={submitApprove}
                loading={submittingReview}
                disabled={reviewItems.some((i) => i.flagged)}
              >
                Approve Phase
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress + details */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Progress</CardTitle>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {answered}/{interactiveReqs.length} answered
                  {required > 0 && ` · ${requiredCompleted}/${required} required complete`}
                </p>
              </div>
              <div className="text-2xl font-semibold tabular-nums text-[var(--color-text-primary)]">
                {effectiveProgress}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={effectiveProgress} size="md" tone={effectiveProgress >= 100 ? "success" : "accent"} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <DetailRow label="Owner" value={ob?.owner_name || "Unassigned"} />
            <DetailRow label="Template" value={ob?.template_name || "Default"} />
            <DetailRow label="Created" value={formatDate(ob?.created_at)} />
            <DetailRow
              label="ID"
              value={
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(ob?.id || "");
                    toast({ title: "ID copied", variant: "success" });
                  }}
                  className="truncate font-mono text-xs text-[var(--color-text-primary)] hover:underline"
                  title={ob?.id || ""}
                >
                  {ob?.id?.slice(0, 8)}…
                </button>
              }
            />
            {ob?.token && <DetailRow label="Token" value={<span className="font-mono text-xs">{ob.token}</span>} />}
          </CardContent>
        </Card>
      </div>

      {/* Reminder schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Reminders</CardTitle>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {orgReminders
                  ? `Default: remind every ${orgReminders.followup_delay_days} day${orgReminders.followup_delay_days === 1 ? "" : "s"}, up to ${orgReminders.followup_max_count} time${orgReminders.followup_max_count === 1 ? "" : "s"}.`
                  : "Org default follow-up schedule applies."}
              </p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="accent-[var(--color-accent)]"
                checked={!!reminderOverride?.enabled}
                disabled={remindersSaving}
                onChange={(e) => {
                  if (e.target.checked) {
                    const next: ReminderOverride = {
                      enabled: true,
                      days_between: reminderOverride?.days_between ?? orgReminders?.followup_delay_days ?? 3,
                      max_reminders: reminderOverride?.max_reminders ?? orgReminders?.followup_max_count ?? 3,
                    };
                    setReminderOverride(next);
                  } else {
                    void saveReminderOverride(null);
                  }
                }}
              />
              <span className="text-xs text-[var(--color-text-secondary)]">Override for this onboarding</span>
            </label>
          </div>
        </CardHeader>
        {reminderOverride?.enabled && (
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-[var(--color-text-muted)]">Days between reminders</span>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={reminderOverride.days_between ?? 3}
                  onChange={(e) =>
                    setReminderOverride({
                      ...reminderOverride,
                      days_between: Math.max(1, Math.min(90, parseInt(e.target.value || "1", 10) || 1)),
                    })
                  }
                  className="h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="text-[var(--color-text-muted)]">Max reminders</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={reminderOverride.max_reminders ?? 3}
                  onChange={(e) =>
                    setReminderOverride({
                      ...reminderOverride,
                      max_reminders: Math.max(0, Math.min(20, parseInt(e.target.value || "0", 10) || 0)),
                    })
                  }
                  className="h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" loading={remindersSaving} onClick={() => saveReminderOverride(reminderOverride)}>
                Save schedule
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">What the client has submitted so far.</p>
        </CardHeader>
        {phases.length > 0 && (
          <div className="flex gap-1 border-b border-[var(--color-border)] px-5 pt-3 pb-0">
            <button
              onClick={() => setActiveResponsePhase(null)}
              className={[
                "pb-2 px-3 text-xs font-medium border-b-2 transition-colors",
                activeResponsePhase === null
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              All
            </button>
            {phases.map((ph: any) => (
              <button
                key={ph.phase_number}
                onClick={() => setActiveResponsePhase(ph.phase_number)}
                className={[
                  "pb-2 px-3 text-xs font-medium border-b-2 transition-colors",
                  activeResponsePhase === ph.phase_number
                    ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                ].join(" ")}
              >
                {ph.name ?? `Phase ${ph.phase_number}`}
              </button>
            ))}
          </div>
        )}
        <div className="border-t border-[var(--color-border)]">
          {reqs.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">No requirements loaded</div>
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                This onboarding has no requirements snapshot yet.
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {reqs
                .filter((r) =>
                  activeResponsePhase === null
                    ? true
                    : (r.phase_number ?? 1) === activeResponsePhase
                )
                .map((r) => (
                  <ResponseItem
                    key={r.id}
                    r={r}
                    onPreview={openPreview}
                    onDownloadFailure={(msg) => toast({ title: "Download failed", description: msg, variant: "error" })}
                  />
                ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Preview modal */}
      <Modal open={previewOpen} onClose={closePreview} size="xl" title={previewName} hideClose={false}>
        <div className="min-h-[50vh]">
          {previewLoading ? (
            <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-muted)]">
              Loading preview…
            </div>
          ) : previewError ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] p-4 text-sm text-[var(--color-danger)]">
              {previewError}
            </div>
          ) : previewBlobUrl ? (
            previewIsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewBlobUrl} alt={previewName} className="mx-auto max-h-[70vh] object-contain" />
            ) : (
              <iframe
                src={previewBlobUrl}
                title={previewName}
                className="h-[70vh] w-full rounded-[var(--radius-md)] border border-[var(--color-border)]"
              />
            )
          ) : null}
        </div>
        {previewApiUrl && (
          <div className="mt-3 flex justify-end">
            <a
              href={previewApiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
            >
              Open in new tab
            </a>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={confirmLock}
        onClose={() => setConfirmLock(false)}
        onConfirm={lock}
        title="Lock submission?"
        description="Once locked, the client can no longer edit their responses."
        confirmLabel={locking ? "Locking…" : "Lock"}
      />

      <ConfirmModal
        open={confirmDelete}
        onClose={() => (deleting ? null : setConfirmDelete(false))}
        onConfirm={deleteOnboarding}
        title="Delete onboarding?"
        description="This permanently removes the onboarding and all uploaded responses. It cannot be undone."
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      <span className="text-sm text-[var(--color-text-primary)]">{value}</span>
    </div>
  );
}

function ResponseItem({
  r,
  onPreview,
  onDownloadFailure,
}: {
  r: Requirement;
  onPreview: (ref: string, bucket: string, name: string) => void;
  onDownloadFailure: (msg: string) => void;
}) {
  const rType = (r.type ?? r.kind ?? "").toLowerCase();
  const preview = valuePreview(r);
  const completed = !!r.completed_at || !!r.completed || preview.type !== "empty";

  if (rType === "heading") {
    return (
      <li className="bg-[var(--color-bg-subtle)] px-5 py-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {r.label || "Section"}
        </div>
      </li>
    );
  }

  let body: React.ReactNode;

  if (rType === "checkbox") {
    const checked = (r.value_text ?? "").toLowerCase() === "true";
    body = (
      <div className="flex items-center gap-2 text-sm">
        {checked ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
        ) : (
          <Circle className="h-4 w-4 text-[var(--color-text-muted)]" />
        )}
        <span className={cn(checked ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]")}>
          {checked ? "Confirmed" : "Not confirmed"}
        </span>
      </div>
    );
  } else if (rType === "multiple_choice" && preview.type === "text") {
    const items = parseMultiSelect(r.value_text, r.options);
    if (items) {
      body = (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <Tag key={i} tone={it.isOther ? "warning" : "neutral"}>
              {it.label}
            </Tag>
          ))}
        </div>
      );
    } else {
      body = <div className="text-sm text-[var(--color-text-primary)]">{String(preview.v)}</div>;
    }
  } else if (preview.type === "empty") {
    body = <div className="text-sm text-[var(--color-text-muted)]">—</div>;
  } else if (preview.type === "text") {
    body = <div className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)]">{String(preview.v)}</div>;
  } else if (preview.type === "json") {
    body = (
      <pre className="max-w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-xs text-[var(--color-text-primary)]">
        {JSON.stringify(preview.v, null, 2)}
      </pre>
    );
  } else if (preview.type === "file") {
    const allFiles: string[] =
      r.file_paths && r.file_paths.length > 0
        ? r.file_paths
        : r.file_path
        ? [r.file_path]
        : [String(preview.v)];
    body = (
      <div className="flex flex-col gap-1.5">
        {allFiles.map((fp, fi) => (
          <div key={fi} className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
            <span className="truncate text-xs text-[var(--color-text-secondary)]" title={fileNameFromPath(fp)}>
              {fileNameFromPath(fp)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button
                size="xs"
                variant="ghost"
                iconLeft={<Eye className="h-3 w-3" />}
                onClick={() => onPreview(fp, "clientenforce-uploads", fileNameFromPath(fp))}
              >
                Preview
              </Button>
              <Button
                size="xs"
                variant="ghost"
                iconLeft={<Download className="h-3 w-3" />}
                onClick={() => {
                  try {
                    downloadRef(fp, "clientenforce-uploads", fileNameFromPath(fp));
                  } catch (e: any) {
                    onDownloadFailure(e?.message || "Could not download");
                  }
                }}
              >
                Download
              </Button>
            </div>
          </div>
        ))}
        {r.attachment_path && (
          <Button
            size="xs"
            variant="outline"
            className="self-start"
            iconLeft={<Download className="h-3 w-3" />}
            onClick={() => {
              try {
                downloadRef(r.attachment_path!, "clientenforce-uploads", fileNameFromPath(r.attachment_path));
              } catch (e: any) {
                onDownloadFailure(e?.message || "Could not download template");
              }
            }}
          >
            Form template
          </Button>
        )}
      </div>
    );
  } else {
    body = (
      <div className="flex items-center gap-1.5">
        <Button
          size="xs"
          variant="ghost"
          iconLeft={<Eye className="h-3 w-3" />}
          onClick={() =>
            onPreview(String(preview.v), "clientenforce-signatures", fileNameFromPath(String(preview.v)))
          }
        >
          View signature
        </Button>
        <Button
          size="xs"
          variant="ghost"
          iconLeft={<Download className="h-3 w-3" />}
          onClick={() => {
            try {
              downloadRef(
                String(preview.v),
                "clientenforce-signatures",
                fileNameFromPath(String(preview.v))
              );
            } catch (e: any) {
              onDownloadFailure(e?.message || "Could not download");
            }
          }}
        >
          Download
        </Button>
      </div>
    );
  }

  return (
    <li className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {r.label || "Untitled field"}
            </span>
            <Tag tone="neutral">{reqKindLabel(r.kind ?? r.type)}</Tag>
            {(r.is_required ?? r.required) && <Tag tone="info">Required</Tag>}
          </div>
          {r.prompt && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{r.prompt}</p>}
          <div className="mt-2">{body}</div>
        </div>
        <Tag tone={completed ? "success" : "neutral"}>{completed ? "Complete" : "Pending"}</Tag>
      </div>
    </li>
  );
}
