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
  Pencil,
  X as XIcon,
  Plus,
  CalendarDays,
  MoreHorizontal,
  CheckCheck,
  Clock,
  Ban,
  Minus,
} from "lucide-react";
import { Menu, MenuItem, MenuDivider } from "@/components/ui/menu";
import { DeadlineBadge, DeadlinePill } from "@/components/ui/deadline-badge";
import { supabaseBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, Tag } from "@/components/ui/status-badge";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { computeDisplayStatus, type OnboardingStatus } from "@/lib/status";
import { cn } from "@/lib/cn";
import { ChatBubble } from "@/components/ui/chat-bubble";

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
  is_ad_hoc?: boolean | null;
  created_by?: string | null;
  // Payment type fields
  payment_amount?: number | null;
  payment_currency?: string | null;
  payment_description?: string | null;
  payment_status?: string | null;
  payment_paid_at?: string | null;
  payment_stripe_payment_intent_id?: string | null;
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
    company_name?: string | null;
    template_name: string | null;
    template_id: string | null;
    owner_id: string | null;
    owner_name: string | null;
    created_at: string | null;
    updated_at: string | null;
    metadata?: any;
    deadline?: string | null;
  };
  requirements: Requirement[];
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
    is_ad_hoc: typeof r.is_ad_hoc === "boolean" ? r.is_ad_hoc : null,
    created_by: r.created_by ?? null,
    payment_amount: r.payment_amount ?? null,
    payment_currency: r.payment_currency ?? null,
    payment_description: r.payment_description ?? null,
    payment_status: r.payment_status ?? null,
    payment_paid_at: r.payment_paid_at ?? null,
    payment_stripe_payment_intent_id: r.payment_stripe_payment_intent_id ?? null,
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
  if (k === "payment") return "Payment";
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
        "is_ad_hoc",
        "created_by",
        "payment_amount",
        "payment_currency",
        "payment_description",
        "payment_status",
        "payment_paid_at",
        "payment_stripe_payment_intent_id",
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
  const [sending, setSending] = React.useState(false);
  const [confirmLock, setConfirmLock] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteFileCount, setDeleteFileCount] = React.useState<number | null>(null);

  // Phase strip + review panel state
  const [phases, setPhases] = React.useState<any[]>([]);
  const [reviewPhaseNumber, setReviewPhaseNumber] = React.useState<number | null>(null);
  const [reviewItems, setReviewItems] = React.useState<Array<{ id: string; label: string; value: string; flagged: boolean; comment: string; file_path?: string | null; file_paths?: string[] | null; file_flags?: boolean[]; signature_path?: string | null }>>([]);
  const [reviewNote, setReviewNote] = React.useState("");
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [reviewPanelOpen, setReviewPanelOpen] = React.useState(false);

  // Reminder override state

  // Owner assign state
  const [teamMembers, setTeamMembers] = React.useState<{ user_id: string; full_name: string | null; email: string | null }[]>([]);
  const [ownerSelectOpen, setOwnerSelectOpen] = React.useState(false);
  const [ownerSelectId, setOwnerSelectId] = React.useState("");
  const [ownerSaving, setOwnerSaving] = React.useState(false);

  // Template assign state
  const [orgTemplates, setOrgTemplates] = React.useState<{ id: string; name: string }[]>([]);
  const [templateSelectId, setTemplateSelectId] = React.useState("");
  const [templateSaving, setTemplateSaving] = React.useState(false);
  const [templateSelectOpen, setTemplateSelectOpen] = React.useState(false);

  // Deadline state
  const [deadlineEditing, setDeadlineEditing] = React.useState(false);
  const [deadlineValue, setDeadlineValue] = React.useState("");
  const [deadlineSaving, setDeadlineSaving] = React.useState(false);
  const [phaseDeadlineEditing, setPhaseDeadlineEditing] = React.useState<number | null>(null);
  const [phaseDeadlineValue, setPhaseDeadlineValue] = React.useState("");
  const [phaseDeadlineSaving, setPhaseDeadlineSaving] = React.useState(false);

  // Response phase tab state
  const [activeResponsePhase, setActiveResponsePhase] = React.useState<number | null>(null);

  // Ad-hoc requirements state
  const [canReview, setCanReview] = React.useState(false);
  const [adHocModal, setAdHocModal] = React.useState<{
    open: boolean;
    phaseNumber: number;
    editingReq: Requirement | null;
  }>({ open: false, phaseNumber: 1, editingReq: null });
  const [adHocSaving, setAdHocSaving] = React.useState(false);
  const [confirmRemoveReq, setConfirmRemoveReq] = React.useState<Requirement | null>(null);
  const [removingReq, setRemovingReq] = React.useState(false);

  // Activity feed state
  const [activityEvents, setActivityEvents] = React.useState<any[]>([]);
  const [activityLoading, setActivityLoading] = React.useState(false);
  const [activityLoaded, setActivityLoaded] = React.useState(false);
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [activityError, setActivityError] = React.useState<string | null>(null);

  async function loadActivity(onboardingId: string) {
    if (activityLoading) return;
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await fetch(`/api/audit?onboarding_id=${onboardingId}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setActivityError(json?.error || "Could not load activity.");
        return;
      }
      setActivityEvents(json?.events ?? []);
      setActivityLoaded(true);
    } catch { setActivityError("Could not load activity."); } finally { setActivityLoading(false); }
  }

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
      (r) => (r.phase_number ?? 1) === phaseNumber && !["heading", "info"].includes((r.type ?? r.kind ?? "").toLowerCase())
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
    // Fetch org templates for the template picker
    fetch("/api/templates", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (Array.isArray(j?.items)) setOrgTemplates(j.items); })
      .catch(() => {});
    // Fetch team members for owner picker
    fetch("/api/team/members", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (Array.isArray(j?.members)) setTeamMembers(j.members); })
      .catch(() => {});
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Check current user's permission for ad-hoc controls via Supabase browser client
  React.useEffect(() => {
    (async () => {
      try {
        const sb = supabaseBrowser();
        const { data: { user } } = await sb.auth.getUser();
        if (!user) return;
        const { data: profile } = await sb
          .from("profiles")
          .select("org_id")
          .eq("user_id", user.id)
          .single();
        if (!profile?.org_id) return;
        const { data: membership } = await sb
          .from("memberships")
          .select("role")
          .eq("user_id", user.id)
          .eq("org_id", profile.org_id)
          .single();
        const role: string = (membership as any)?.role ?? "";
        setCanReview(role === "owner" || role === "admin" || role === "reviewer");
      } catch {
        // non-fatal — feature is hidden when uncertain
      }
    })();
  }, []);

  async function assignOwner() {
    setOwnerSaving(true);
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ owner_id: ownerSelectId || null }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Save failed");
      const member = teamMembers.find((m) => m.user_id === ownerSelectId);
      const name = member ? (member.full_name || member.email || "Unknown") : null;
      setPayload((prev) => prev ? { ...prev, onboarding: { ...prev.onboarding, owner_id: ownerSelectId || null, owner_name: name } } : prev);
      setOwnerSelectOpen(false);
      toast({ title: "Owner updated", variant: "success" });
    } catch (e: any) {
      toast({ title: "Failed to update owner", description: e?.message, variant: "error" });
    } finally {
      setOwnerSaving(false);
    }
  }

  async function assignTemplate() {
    if (!templateSelectId) return;
    setTemplateSaving(true);
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ template_id: templateSelectId }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Save failed");
      toast({ title: "Template applied", variant: "success" });
      setTemplateSelectOpen(false);
      setTemplateSelectId("");
      // Reload everything — requirements and phases just got replaced
      await loadDetail();
      await loadPhases();
    } catch (e: any) {
      toast({ title: "Failed to apply template", description: e?.message, variant: "error" });
    } finally {
      setTemplateSaving(false);
    }
  }

  async function saveOverallDeadline() {
    setDeadlineSaving(true);
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deadline: deadlineValue || null }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Save failed");
      setPayload((prev) => prev ? { ...prev, onboarding: { ...prev.onboarding, deadline: deadlineValue || null } } : prev);
      setDeadlineEditing(false);
      toast({ title: "Deadline saved", variant: "success" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, variant: "error" });
    } finally {
      setDeadlineSaving(false);
    }
  }

  async function savePhaseDeadline(phaseNumber: number) {
    setPhaseDeadlineSaving(true);
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(params.id)}/phases/${phaseNumber}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deadline: phaseDeadlineValue || null }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Save failed");
      setPhases((prev) => prev.map((ph) => ph.phase_number === phaseNumber ? { ...ph, deadline: phaseDeadlineValue || null } : ph));
      setPhaseDeadlineEditing(null);
      toast({ title: `Phase ${phaseNumber} deadline saved`, variant: "success" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, variant: "error" });
    } finally {
      setPhaseDeadlineSaving(false);
    }
  }

  function openAddReq(phaseNumber: number) {
    setAdHocModal({ open: true, phaseNumber, editingReq: null });
  }

  function openEditReq(req: Requirement) {
    setAdHocModal({ open: true, phaseNumber: req.phase_number ?? 1, editingReq: req });
  }

  async function saveAdHocReq(
    phaseNumber: number,
    fields: AdHocFields,
    editingReqId?: string
  ) {
    setAdHocSaving(true);
    try {
      const url = editingReqId
        ? `/api/onboardings/${params.id}/requirements/${editingReqId}`
        : `/api/onboardings/${params.id}/requirements`;
      const method = editingReqId ? "PATCH" : "POST";
      const body = editingReqId
        ? { label: fields.label, is_required: fields.is_required, options: fields.options, allow_multi_select: fields.allow_multi_select, include_other: fields.include_other }
        : { phase_number: phaseNumber, ...fields };

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Save failed");

      const saved = normalizeRequirement(json.requirement);
      setPayload((prev) => {
        if (!prev) return prev;
        const existing = prev.requirements.find((r) => r.id === saved.id);
        const nextReqs = existing
          ? prev.requirements.map((r) => (r.id === saved.id ? saved : r))
          : [...prev.requirements, saved].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        return { ...prev, requirements: nextReqs };
      });
      toast({ title: editingReqId ? "Requirement updated" : "Requirement added", variant: "success" });
      setAdHocModal({ open: false, phaseNumber: 1, editingReq: null });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setAdHocSaving(false);
    }
  }

  async function removeAdHocReq(req: Requirement) {
    setRemovingReq(true);
    try {
      const res = await fetch(`/api/onboardings/${params.id}/requirements/${req.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      setPayload((prev) =>
        prev ? { ...prev, requirements: prev.requirements.filter((r) => r.id !== req.id) } : prev
      );
      toast({ title: "Requirement removed", variant: "success" });
      setConfirmRemoveReq(null);
    } catch (e: any) {
      toast({ title: e?.message || "Remove failed", variant: "error" });
    } finally {
      setRemovingReq(false);
    }
  }

  const ob = payload?.onboarding;
  const reqs = payload?.requirements ?? [];
  const statusKey = computeDisplayStatus(ob?.status, phases) as OnboardingStatus;

  const NON_INTERACTIVE = ["heading", "info"];
  const interactiveReqs = reqs.filter((r) => !NON_INTERACTIVE.includes((r.type ?? r.kind ?? "").toLowerCase()));
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
      {ob?.status === "draft" && (
        <div className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-warning-subtle)] bg-[var(--color-warning-subtle)] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Pencil className="h-4 w-4 shrink-0 text-[var(--color-warning)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-warning)]">Draft — not yet sent</p>
              <p className="text-xs text-[var(--color-warning)] opacity-80 mt-0.5">Add or remove requirements, then send invite when ready.</p>
            </div>
          </div>
          <Button size="sm" iconLeft={<Send className="h-3.5 w-3.5" />} loading={sending} onClick={sendEmail}>
            Send invite
          </Button>
        </div>
      )}
      <PageHeader
        breadcrumbs={[
          { label: "Onboardings", href: "/dashboard/onboardings" },
          { label: ob?.company_name || ob?.title || "Detail" },
        ]}
        title={
          <div className="flex items-center gap-3">
            <span className="truncate">{ob?.company_name || ob?.title || "Onboarding"}</span>
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
            <span>•</span>
            {deadlineEditing ? (
              <span className="inline-flex items-center gap-1.5">
                <input
                  type="date"
                  value={deadlineValue}
                  onChange={(e) => setDeadlineValue(e.target.value)}
                  className="rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-xs text-[var(--color-text-primary)]"
                  autoFocus
                />
                <button onClick={saveOverallDeadline} disabled={deadlineSaving} className="text-xs font-medium text-[var(--color-accent)] hover:underline disabled:opacity-50">
                  {deadlineSaving ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setDeadlineEditing(false)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">Cancel</button>
              </span>
            ) : (
              <button
                onClick={() => { setDeadlineValue(ob?.deadline ?? ""); setDeadlineEditing(true); }}
                className="inline-flex items-center gap-1 text-xs hover:text-[var(--color-accent)] transition-colors"
                title="Set overall deadline"
              >
                <CalendarDays className="h-3 w-3" />
                {ob?.deadline ? (
                  <DeadlineBadge deadline={ob.deadline} showLabel />
                ) : (
                  <span className="text-[var(--color-text-muted)]">Set deadline</span>
                )}
              </button>
            )}
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
              <Button
                variant={ob?.status === "draft" ? "primary" : "outline"}
                size="sm"
                iconLeft={<Send className="h-3.5 w-3.5" />}
                loading={sending}
                onClick={sendEmail}
              >
                {ob?.status === "draft" ? "Send invite" : "Send"}
              </Button>
            )}
            {statusKey === "submitted" && (
              <Button size="sm" iconLeft={<Lock className="h-3.5 w-3.5" />} onClick={() => setConfirmLock(true)}>
                Lock
              </Button>
            )}
            <Menu
              align="end"
              trigger={
                <Button variant="outline" size="sm" iconLeft={<MoreHorizontal className="h-3.5 w-3.5" />}>
                  More
                </Button>
              }
            >
              <MenuItem
                iconLeft={<Download className="h-3.5 w-3.5" />}
                onSelect={() => { window.location.href = `/api/onboardings/${params.id}/export`; }}
              >
                Export CSV
              </MenuItem>
              <MenuDivider />
              <MenuItem
                iconLeft={<Trash2 className="h-3.5 w-3.5" />}
                onSelect={async () => {
                  setDeleteFileCount(null);
                  setConfirmDelete(true);
                  try {
                    const r = await fetch("/api/storage/index", { cache: "no-store" });
                    if (r.ok) {
                      const j = await r.json().catch(() => null);
                      const count = (j?.items ?? []).filter((it: any) => it.onboarding_id === ob?.id).length;
                      setDeleteFileCount(count);
                    }
                  } catch { /* ignore */ }
                }}
                destructive
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        }
      />

      {/* Phase progress strip — only when phases exist */}
      {phases.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Phases</span>
            {(ob?.client_link || ob?.token || (ob as any)?.client_token) && (
              <a href={ob?.client_link || `/c/${(ob as any)?.client_token || ob?.token}`} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-accent)] hover:underline">
                View exhibitor portal ↗
              </a>
            )}
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
              const statusLabel: Record<string, string> = { locked: "Locked", in_progress: "In progress", awaiting_review: "In review", approved: "Approved", rejected: "Rejected" };
              const statusIconMap: Record<string, React.ComponentType<{ className?: string }>> = { approved: CheckCheck, locked: Lock, awaiting_review: Clock, rejected: Ban, in_progress: Minus };
              const StatusIcon = statusIconMap[ph.status] ?? Minus;
              return (
                <React.Fragment key={ph.id}>
                  {idx > 0 && <span className="mt-3 text-[var(--color-text-muted)]">→</span>}
                  <div className={`inline-flex flex-col items-start gap-1 rounded-[var(--radius-md)] border px-3 py-2 text-xs font-medium ${statusColors[ph.status] ?? statusColors.locked}`}>
                    <span className="flex items-center gap-1.5 font-semibold"><StatusIcon className="h-3 w-3 shrink-0" />{ph.name}</span>
                    <span className="opacity-70">{statusLabel[ph.status] ?? ph.status}</span>
                    {/* Phase deadline */}
                    {phaseDeadlineEditing === ph.phase_number ? (
                      <span className="inline-flex items-center gap-1 mt-0.5">
                        <input
                          type="date"
                          value={phaseDeadlineValue}
                          onChange={(e) => setPhaseDeadlineValue(e.target.value)}
                          className="rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-primary)]"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); savePhaseDeadline(ph.phase_number); }}
                          disabled={phaseDeadlineSaving}
                          className="text-[10px] font-semibold text-[var(--color-accent)] hover:underline disabled:opacity-50"
                        >
                          {phaseDeadlineSaving ? "…" : "Save"}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPhaseDeadlineEditing(null); }}
                          className="text-[10px] text-[var(--color-text-muted)]"
                        >✕</button>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setPhaseDeadlineValue(ph.deadline ?? ""); setPhaseDeadlineEditing(ph.phase_number); }}
                        className="mt-0.5 inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
                        title="Set phase deadline"
                      >
                        <CalendarDays className="h-3 w-3" />
                        {ph.deadline ? (
                          <DeadlinePill deadline={ph.deadline} />
                        ) : (
                          <span className="text-[10px] text-[var(--color-text-muted)]">Set deadline</span>
                        )}
                      </button>
                    )}
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
                const hasFiles = item.file_paths && item.file_paths.length > 0;
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
                        {/* Text / signature value */}
                        {!hasFiles && (
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <span className="break-words">{item.value}</span>
                            {item.signature_path && (
                              <button
                                onClick={() => openPreview(item.signature_path!, "clientenforce-signatures", fileNameFromPath(item.signature_path))}
                                className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] hover:bg-[var(--color-bg-hover)]"
                              >View signature</button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* OK / Needs revision — always whole-requirement */}
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
                    </div>

                    {/* Files — read-only list with View buttons */}
                    {hasFiles && (
                      <div className="mt-2 space-y-1">
                        {item.file_paths!.map((fp, fi) => (
                          <div key={fi} className="flex items-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs">
                            <span className="min-w-0 flex-1 truncate text-[var(--color-text-secondary)]" title={fileNameFromPath(fp)}>{fileNameFromPath(fp)}</span>
                            <button
                              onClick={() => openPreview(fp, "clientenforce-uploads", fileNameFromPath(fp))}
                              className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 hover:bg-[var(--color-bg-hover)]"
                            >View</button>
                          </div>
                        ))}
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
            <DetailRow
              label="Owner"
              value={
                ownerSelectOpen ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      className="h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2 text-xs"
                      value={ownerSelectId}
                      onChange={(e) => setOwnerSelectId(e.target.value)}
                      autoFocus
                    >
                      <option value="">Unassigned</option>
                      {teamMembers.map((m) => (
                        <option key={m.user_id} value={m.user_id}>
                          {m.full_name || m.email || m.user_id}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={assignOwner}
                      disabled={ownerSaving}
                      className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-2 py-0.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {ownerSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => setOwnerSelectOpen(false)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setOwnerSelectId(ob?.owner_id || ""); setOwnerSelectOpen(true); }}
                    className="flex items-center gap-1 text-[var(--color-text-primary)] hover:underline"
                  >
                    {ob?.owner_name || <span className="text-[var(--color-text-muted)]">Unassigned</span>}
                    <span className="ml-1 text-[0.65rem] text-[var(--color-text-muted)]">✎</span>
                  </button>
                )
              }
            />
            <DetailRow
              label="Template"
              value={
                ob?.template_id ? (
                  <span>{ob.template_name || "Default"}</span>
                ) : templateSelectOpen ? (
                  <div className="flex items-center gap-1.5">
                    <select
                      className="h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2 text-xs"
                      value={templateSelectId}
                      onChange={(e) => setTemplateSelectId(e.target.value)}
                      autoFocus
                    >
                      <option value="">Select template…</option>
                      {orgTemplates.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={assignTemplate}
                      disabled={!templateSelectId || templateSaving}
                      className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-2 py-0.5 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {templateSaving ? "Saving…" : "Apply"}
                    </button>
                    <button
                      onClick={() => { setTemplateSelectOpen(false); setTemplateSelectId(""); }}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTemplateSelectOpen(true)}
                    className="flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline"
                  >
                    <span className="text-base leading-none">+</span> Add template
                  </button>
                )
              }
            />
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
          {reqs.length === 0 && phases.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">No requirements loaded</div>
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                This onboarding has no requirements snapshot yet.
              </div>
            </div>
          ) : phases.length > 0 ? (
            // Render by phase with per-phase "Add requirement" button
            <>
              {phases
                .filter((ph: any) =>
                  activeResponsePhase === null ? true : ph.phase_number === activeResponsePhase
                )
                .map((ph: any) => {
                  const phaseReqs = reqs.filter((r) => (r.phase_number ?? 1) === ph.phase_number);
                  const phaseStatus: string = ph.status ?? "locked";
                  const isDraftOnboarding = ob?.status === "draft";
                  const canAdd = isDraftOnboarding
                    ? phaseStatus !== "awaiting_review" && phaseStatus !== "approved"
                    : canReview && phaseStatus === "in_progress";
                  const isLocked = phaseStatus === "awaiting_review" || phaseStatus === "approved";
                  return (
                    <div key={ph.phase_number}>
                      {activeResponsePhase === null && (
                        <div className="border-b border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-5 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                            {ph.name ?? `Phase ${ph.phase_number}`}
                          </span>
                        </div>
                      )}
                      <ul className="divide-y divide-[var(--color-border)]">
                        {phaseReqs.map((r) => (
                          <ResponseItem
                            key={r.id}
                            r={r}
                            onPreview={openPreview}
                            onDownloadFailure={(msg) => toast({ title: "Download failed", description: msg, variant: "error" })}
                            canReview={canReview || isDraftOnboarding}
                            phaseEditable={canAdd}
                            draftMode={isDraftOnboarding}
                            onEdit={openEditReq}
                            onRemove={(req) => setConfirmRemoveReq(req)}
                          />
                        ))}
                      </ul>
                      {(canReview || isDraftOnboarding) && !isLocked && (
                        <div className="px-5 py-3">
                          <button
                            onClick={() => openAddReq(ph.phase_number)}
                            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add requirement
                          </button>
                        </div>
                      )}
                      {canReview && isLocked && phaseStatus === "awaiting_review" && (
                        <div className="px-5 py-3">
                          <button
                            disabled
                            title="Phase is under review. Reject the phase first to add new requirements."
                            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add requirement
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {reqs.map((r) => (
                <ResponseItem
                  key={r.id}
                  r={r}
                  onPreview={openPreview}
                  onDownloadFailure={(msg) => toast({ title: "Download failed", description: msg, variant: "error" })}
                  canReview={canReview}
                  phaseEditable={false}
                  onEdit={openEditReq}
                  onRemove={(req) => setConfirmRemoveReq(req)}
                />
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Activity section */}
      <Card>
        <button
          onClick={() => {
            const nowOpen = !activityOpen;
            setActivityOpen(nowOpen);
            if (nowOpen && !activityLoaded && ob?.id) loadActivity(ob.id);
          }}
          className="w-full"
        >
          <CardHeader className="cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors rounded-t-[var(--radius-lg)]">
            <div className="flex items-center justify-between w-full">
              <CardTitle>Activity &amp; Timeline</CardTitle>
              <span className="text-xs text-[var(--color-text-muted)]">{activityOpen ? "▲ Hide" : "▼ Show"}</span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">All actions and phase changes for this onboarding.</p>
          </CardHeader>
        </button>
        {activityOpen && (
          <CardContent className="pt-0">
            {activityLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Clock className="h-4 w-4 animate-spin text-[var(--color-text-muted)]" />
              </div>
            ) : activityError ? (
              <p className="py-6 text-center text-xs text-[var(--color-text-muted)]">{activityError}</p>
            ) : activityEvents.length === 0 ? (
              <p className="py-6 text-center text-xs text-[var(--color-text-muted)]">No activity recorded yet.</p>
            ) : (
              <ol className="relative mt-2 space-y-0 border-l border-[var(--color-border)] ml-3">
                {activityEvents.map((ev: any) => {
                  const actor = ev.actor || ev.actor_email || "System";
                  const meta = ev.metadata ?? {};
                  const phaseNum = meta.phase_number ?? meta.phase ?? ev.phase_number ?? null;
                  const note = meta.note ?? meta.reviewer_note ?? null;
                  const time = new Date(ev.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  return (
                    <li key={ev.id} className="relative pl-5 pb-4">
                      <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-[var(--color-panel)] bg-[var(--color-accent)]" />
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="text-xs font-medium text-[var(--color-text-primary)]">{actor}</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">{ev.action?.replace(/[._]/g, " ") ?? "performed an action"}</span>
                        {phaseNum != null && (
                          <span className="text-[10px] rounded-full bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-[var(--color-text-muted)]">Phase {phaseNum}</span>
                        )}
                      </div>
                      {note && (
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)] italic">"{note}"</p>
                      )}
                      <time className="mt-0.5 block text-[10px] text-[var(--color-text-muted)]">{time}</time>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        )}
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
        description={
          deleteFileCount === null
            ? "This permanently removes the onboarding and all uploaded files. It cannot be undone."
            : deleteFileCount > 0
              ? `This will permanently delete the onboarding and ${deleteFileCount} uploaded file${deleteFileCount !== 1 ? "s" : ""} from storage. This cannot be undone.`
              : "This permanently removes the onboarding record. No uploaded files were found. It cannot be undone."
        }
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        destructive
      />

      {/* Add / Edit ad-hoc requirement modal */}
      <AdHocRequirementModal
        open={adHocModal.open}
        phaseNumber={adHocModal.phaseNumber}
        templateId={ob?.template_id ?? null}
        existingReqs={reqs}
        editingReq={adHocModal.editingReq}
        saving={adHocSaving}
        onClose={() => setAdHocModal({ open: false, phaseNumber: 1, editingReq: null })}
        onSave={(phaseNumber, fields) =>
          saveAdHocReq(phaseNumber, fields, adHocModal.editingReq?.id)
        }
      />

      {/* Confirm remove ad-hoc requirement */}
      <ConfirmModal
        open={!!confirmRemoveReq}
        onClose={() => (removingReq ? null : setConfirmRemoveReq(null))}
        onConfirm={() => { if (confirmRemoveReq) removeAdHocReq(confirmRemoveReq); }}
        title="Remove requirement?"
        description={`Remove "${confirmRemoveReq?.label ?? "this requirement"}"? This cannot be undone.`}
        confirmLabel={removingReq ? "Removing…" : "Remove"}
        destructive
      />

      {/* Chat bubble — only when onboarding is loaded */}
      {ob?.id && (
        <ChatBubble
          messagesUrl={`/api/onboardings/${ob.id}/messages`}
          postUrl={`/api/onboardings/${ob.id}/messages`}
          currentSide="admin"
          title={`Chat with ${ob.client_name || "client"}`}
          placeholder="Send a message to the exhibitor…"
        />
      )}
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
  canReview = false,
  phaseEditable = false,
  draftMode = false,
  onEdit,
  onRemove,
}: {
  r: Requirement;
  onPreview: (ref: string, bucket: string, name: string) => void;
  onDownloadFailure: (msg: string) => void;
  canReview?: boolean;
  phaseEditable?: boolean;
  draftMode?: boolean;
  onEdit?: (req: Requirement) => void;
  onRemove?: (req: Requirement) => void;
}) {
  const rType = (r.type ?? r.kind ?? "").toLowerCase();
  const preview = valuePreview(r);
  const completed = !!r.completed_at || !!r.completed || preview.type !== "empty";

  if (rType === "heading") {
    return (
      <li className="px-5 py-2 bg-[var(--color-bg-subtle)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {r.label || "Section"}
            </span>
            <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Heading
            </span>
          </div>
          {draftMode && phaseEditable && (
            <button
              onClick={() => onRemove?.(r)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-danger-subtle)] px-2 py-0.5 text-[10px] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-colors"
            >
              <XIcon className="h-3 w-3" />
              Remove
            </button>
          )}
        </div>
      </li>
    );
  }

  if (rType === "info") {
    return (
      <li className="bg-[var(--color-bg-subtle)] px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 text-sm leading-none text-[var(--color-text-muted)]">ℹ</span>
            <div className="min-w-0">
              {r.label && <p className="text-xs font-semibold text-[var(--color-text-primary)]">{r.label}</p>}
              {r.prompt && <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{r.prompt}</p>}
              <span className="mt-1 inline-block rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                Info only
              </span>
            </div>
          </div>
          {draftMode && phaseEditable && (
            <button
              onClick={() => onRemove?.(r)}
              className="inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-danger-subtle)] px-2 py-1 text-[10px] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-colors"
            >
              <XIcon className="h-3 w-3" />
              Remove
            </button>
          )}
        </div>
      </li>
    );
  }

  if (rType === "payment") {
    const payStatus = (r as any).payment_status ?? "not_paid";
    const payAmount = (r as any).payment_amount;
    const payCurrency = ((r as any).payment_currency ?? "GBP").toUpperCase();
    const payPaidAt = (r as any).payment_paid_at;
    const fmtAmount = payAmount != null ? `${payCurrency} ${Number(payAmount).toFixed(2)}` : payCurrency;

    const statusTone =
      payStatus === "paid" ? "success" :
      payStatus === "pending" ? "info" :
      payStatus === "failed" ? "danger" :
      "neutral";

    const statusLabel =
      payStatus === "paid" ? "Paid ✓" :
      payStatus === "pending" ? "Pending" :
      payStatus === "failed" ? "Failed" :
      "Not paid";

    return (
      <li className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {r.label || "Payment"}
              </span>
              <Tag tone="neutral">Payment</Tag>
              {(r.is_required ?? r.required) && <Tag tone="info">Required</Tag>}
            </div>
            {(r as any).payment_description && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{(r as any).payment_description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Tag tone={statusTone}>{statusLabel}</Tag>
              {payAmount != null && (
                <span className="text-xs text-[var(--color-text-secondary)]">{fmtAmount}</span>
              )}
              {payStatus === "paid" && payPaidAt && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  on {new Date(payPaidAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })}
                </span>
              )}
            </div>
          </div>
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
            {r.is_ad_hoc && canReview && (
              <Tag tone="neutral">Ad-hoc</Tag>
            )}
          </div>
          {r.prompt && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{r.prompt}</p>}
          <div className="mt-2">{body}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {(r.is_ad_hoc || draftMode) && canReview && phaseEditable && (
            <>
              {r.is_ad_hoc && (
                <button
                  onClick={() => onEdit?.(r)}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-[10px] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                  title="Edit this requirement"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
              <button
                onClick={() => onRemove?.(r)}
                className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-[var(--color-danger-subtle)] px-2 py-1 text-[10px] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-colors"
                title="Remove this requirement"
              >
                <XIcon className="h-3 w-3" />
                Remove
              </button>
            </>
          )}
          <Tag tone={completed ? "success" : "neutral"}>{completed ? "Complete" : "Pending"}</Tag>
        </div>
      </div>
    </li>
  );
}

type AdHocFields = {
  type: string;
  label: string;
  is_required: boolean;
  options?: string[];
  allow_multi_select?: boolean;
  include_other?: boolean;
};

function typeIcon(type: string) {
  const t = type?.toLowerCase() ?? "";
  if (t === "file") return "📎";
  if (t === "signature") return "✍";
  if (t === "multiple_choice") return "☑";
  if (t === "select") return "▾";
  if (t === "checkbox") return "✓";
  if (t === "date") return "📅";
  if (t === "textarea") return "¶";
  if (t === "heading") return "§";
  if (t === "info") return "ℹ";
  if (t === "payment") return "💳";
  return "T";
}

const FIELD_TYPES = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "file", label: "File upload" },
  { value: "signature", label: "Signature" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "select", label: "Dropdown select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "heading", label: "Heading / section" },
  { value: "info", label: "Info block" },
] as const;

function AdHocRequirementModal({
  open,
  phaseNumber,
  editingReq,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  phaseNumber: number;
  templateId: string | null;
  existingReqs: Requirement[];
  editingReq: Requirement | null;
  saving: boolean;
  onClose: () => void;
  onSave: (phaseNumber: number, fields: AdHocFields) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<string>("text");
  const [isRequired, setIsRequired] = React.useState(true);
  const [options, setOptions] = React.useState<string[]>([""]);
  const [allowMultiSelect, setAllowMultiSelect] = React.useState(false);
  const [includeOther, setIncludeOther] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (editingReq) {
      setLabel(editingReq.label ?? "");
      setType(editingReq.type ?? "text");
      setIsRequired(!!(editingReq.is_required ?? editingReq.required));
      setOptions(editingReq.options?.length ? editingReq.options : [""]);
      setAllowMultiSelect(!!(editingReq as any).metadata?.allow_multi_select);
      setIncludeOther(!!(editingReq as any).metadata?.include_other);
    } else {
      setLabel("");
      setType("text");
      setIsRequired(true);
      setOptions([""]);
      setAllowMultiSelect(false);
      setIncludeOther(false);
    }
  }, [open, editingReq]);

  const hasOptions = type === "multiple_choice" || type === "select";
  const isDisplay = type === "heading" || type === "info";
  const canSave = label.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const cleanOptions = hasOptions ? options.map((o) => o.trim()).filter(Boolean) : undefined;
    onSave(editingReq ? (editingReq.phase_number ?? phaseNumber) : phaseNumber, {
      type,
      label: label.trim(),
      is_required: isDisplay ? false : isRequired,
      options: cleanOptions,
      allow_multi_select: type === "multiple_choice" ? allowMultiSelect : undefined,
      include_other: type === "multiple_choice" ? includeOther : undefined,
    });
  }

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingReq ? "Edit requirement" : `Add requirement — Phase ${phaseNumber}`}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} loading={saving} disabled={!canSave}>
            {editingReq ? "Save" : "Add"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Label */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
            placeholder="e.g. Company registration number"
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">Field type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Required toggle */}
        {!isDisplay && (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
            <span className="text-[var(--color-text-secondary)]">Required field</span>
          </label>
        )}

        {/* Options for multiple_choice / select */}
        {hasOptions && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">Options</label>
            <div className="space-y-1.5">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = e.target.value;
                      setOptions(next);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setOptions(options.filter((_, j) => j !== i))}
                      className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors px-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOptions([...options, ""])}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                + Add option
              </button>
            </div>
            {type === "multiple_choice" && (
              <div className="mt-3 space-y-2">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={allowMultiSelect} onChange={(e) => setAllowMultiSelect(e.target.checked)} className="accent-[var(--color-accent)]" />
                  <span className="text-[var(--color-text-secondary)]">Allow multiple selections</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={includeOther} onChange={(e) => setIncludeOther(e.target.checked)} className="accent-[var(--color-accent)]" />
                  <span className="text-[var(--color-text-secondary)]">Include "Other" option</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
