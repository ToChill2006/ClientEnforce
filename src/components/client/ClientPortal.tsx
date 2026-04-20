"use client";

import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

// ─── Types ────────────────────────────────────────────────────────────────────

// Per-requirement config that is snapshotted from the template definition.
type RequirementMetadata = {
  file_mode?: "upload" | "link";   // Feature 1
  link_url?: string | null;        // Feature 1
  allow_multi_select?: boolean;    // Feature 2
  include_other?: boolean;         // Feature 3
  multiline?: boolean;             // Feature 5
  visible_if?: {
    depends_on_label: string;
    equals?: string;
    not_empty?: boolean;
  } | null;
} | null;

type Requirement = {
  id: string;
  type: "text" | "file" | "signature" | "multiple_choice" | "checkbox" | "heading";
  label: string;
  is_required: boolean;
  sort_order: number;
  completed_at: string | null;
  value_text: string | null;
  file_path: string | null;
  file_paths: string[] | null;     // Feature 4: multi-file uploads
  signature_path: string | null;
  attachment_path: string | null;
  options: string[] | null;
  metadata: RequirementMetadata;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prettyStoredName(path: string | null) {
  if (!path) return null;
  const afterColon = path.includes(":") ? path.split(":").slice(1).join(":") : path;
  const last = afterColon.split("/").filter(Boolean).pop();
  return last || path;
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

// Parses a multi-select value_text (JSON array string) back into an array.
// Falls back to a single-item array for legacy single-choice values.
function parseMultiSelectValue(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // Legacy: single string value
    return [value];
  }
  return [];
}

// ─── ClientPortal ─────────────────────────────────────────────────────────────

export function ClientPortal({
  token,
  onboardingTitle,
  locked,
  requirements,
}: {
  token: string;
  onboardingTitle: string;
  locked: boolean;
  requirements: Requirement[];
}) {
  const toast = useToast() as any;

  const notify = React.useCallback(
    (payload: { title: string; description?: string; variant?: string }) => {
      const fn =
        (typeof toast?.push === "function" && toast.push) ||
        (typeof toast?.toast === "function" && toast.toast) ||
        (typeof toast?.addToast === "function" && toast.addToast) ||
        (typeof toast === "function" && toast);
      if (typeof fn === "function") fn(payload);
    },
    [toast]
  );

  // Sort by sort_order, exclude headings from the interactive list
  const [reqs, setReqs] = React.useState(
    requirements.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [busyByReq, setBusyByReq] = React.useState<Record<string, boolean>>({});
  const sigRef = React.useRef<Record<string, SignatureCanvas | null>>({});

  const [progress, setProgress] = React.useState<{
    percent: number;
    required_total: number;
    required_completed: number;
  }>({ percent: 0, required_total: 0, required_completed: 0 });

  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [resumeDismissed, setResumeDismissed] = React.useState(false);
  const initialProgressSnapshot = React.useRef<{ completed: number; total: number } | null>(null);

  // Phase 5.3 — evaluate `visible_if` against current answers (label-keyed lookup).
  const isVisible = React.useCallback(
    (r: Requirement): boolean => {
      const cond = r.metadata?.visible_if;
      if (!cond || !cond.depends_on_label) return true;
      const src = reqs.find((x) => x.label === cond.depends_on_label);
      if (!src) return true; // dependency missing — don't hide
      const raw = src.value_text ?? "";
      // Multi-select answers are stored as JSON arrays. Flatten to compare.
      const answers = (() => {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.map(String);
        } catch {
          // fall through
        }
        return raw ? [raw] : [];
      })();
      if (cond.not_empty) {
        if (src.type === "checkbox") return raw === "true";
        return answers.length > 0 && answers.some((a) => a.trim() !== "");
      }
      if (typeof cond.equals === "string") {
        if (src.type === "checkbox") {
          return (raw === "true") === (cond.equals === "true");
        }
        return answers.includes(cond.equals);
      }
      return true;
    },
    [reqs]
  );

  // Section grouping: split flat requirements into sections using "heading" items as breaks.
  // Each section carries its own required-count progress for the segmented stepper.
  const sections = React.useMemo(() => {
    const out: Array<{ title: string | null; items: Requirement[] }> = [];
    let current: { title: string | null; items: Requirement[] } = { title: null, items: [] };
    for (const r of reqs) {
      if (r.type === "heading") {
        if (current.items.length > 0 || current.title !== null) out.push(current);
        current = { title: r.label, items: [] };
      } else {
        if (isVisible(r)) current.items.push(r);
      }
    }
    if (current.items.length > 0 || current.title !== null) out.push(current);
    return out;
  }, [reqs, isVisible]);

  const sectionStats = React.useMemo(
    () =>
      sections.map((s) => {
        const required = s.items.filter((i) => i.is_required);
        const requiredDone = required.filter((i) => !!i.completed_at).length;
        const requiredTotal = required.length;
        return {
          title: s.title,
          requiredTotal,
          requiredDone,
          fraction: requiredTotal === 0 ? (s.items.length > 0 && s.items.every((i) => !!i.completed_at) ? 1 : 0) : requiredDone / requiredTotal,
        };
      }),
    [sections]
  );

  // Flat list of non-heading requirements in display order — used for review modal and scroll-to-first-incomplete.
  const flatItems = React.useMemo(
    () => reqs.filter((r) => r.type !== "heading" && isVisible(r)),
    [reqs, isVisible]
  );

  async function refreshProgress() {
    try {
      const res = await fetch(`/api/onboardings/client/progress?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok && json) {
        setProgress({ percent: json.percent, required_total: json.required_total, required_completed: json.required_completed });
        // Capture the very first progress snapshot for the resume banner decision.
        if (initialProgressSnapshot.current === null) {
          initialProgressSnapshot.current = {
            completed: Number(json.required_completed) || 0,
            total: Number(json.required_total) || 0,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  React.useEffect(() => { refreshProgress(); }, []);

  // ── Answer saving ────────────────────────────────────────────────────────────

  async function saveText(requirement_id: string, value_text: string) {
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const res = await fetch("/api/onboardings/client/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id, value_text }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || (json && json.ok === false)) throw new Error(json?.error || `Failed (${res.status})`);
      setReqs((prev) =>
        prev.map((r) =>
          r.id === requirement_id
            ? {
                ...r,
                value_text,
                completed_at:
                  (json?.requirement?.completed_at as string | undefined) ||
                  (json?.requirement?.completed_at === null ? null : new Date().toISOString()),
              }
            : r
        )
      );
      refreshProgress();
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
      throw e;
    } finally {
      setBusyByReq((p) => ({ ...p, [requirement_id]: false }));
    }
  }

  // ── File upload (Feature 4: appends to file_paths array) ────────────────────

  async function uploadFile(requirement_id: string, file: File) {
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const fd = new FormData();
      fd.set("token", token);
      fd.set("requirement_id", requirement_id);
      fd.set("file", file);
      const res = await fetch("/api/onboardings/client/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      notify({ title: "Uploaded", variant: "success" });
      setReqs((prev) =>
        prev.map((r) => {
          if (r.id !== requirement_id) return r;
          // Append the new path to the existing file_paths array
          const existingPaths = r.file_paths ?? (r.file_path ? [r.file_path] : []);
          const newPath: string = json.file_path ?? "";
          const updatedPaths = newPath ? [...existingPaths.filter((p) => p !== newPath), newPath] : existingPaths;
          return {
            ...r,
            file_paths: updatedPaths,
            file_path: newPath || r.file_path,
            completed_at: new Date().toISOString(),
          };
        })
      );
      refreshProgress();
    } catch (e: any) {
      notify({ title: "Upload failed", description: e?.message ?? "Unknown error", variant: "error" });
      throw e;
    } finally {
      setBusyByReq((p) => ({ ...p, [requirement_id]: false }));
    }
  }

  // ── File removal (Feature 4: removes one path from file_paths) ───────────────

  async function removeFile(requirement_id: string, file_path_to_remove: string) {
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const res = await fetch("/api/onboardings/client/remove-file", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id, file_path: file_path_to_remove }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Remove failed");
      setReqs((prev) =>
        prev.map((r) => {
          if (r.id !== requirement_id) return r;
          const remaining = (r.file_paths ?? []).filter((p) => p !== file_path_to_remove);
          return {
            ...r,
            file_paths: remaining,
            file_path: remaining[remaining.length - 1] ?? null,
            completed_at: remaining.length > 0 ? r.completed_at : null,
          };
        })
      );
      refreshProgress();
    } catch (e: any) {
      notify({ title: "Remove failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setBusyByReq((p) => ({ ...p, [requirement_id]: false }));
    }
  }

  // ── Signature saving ─────────────────────────────────────────────────────────

  async function saveSignature(requirement_id: string) {
    const canvas = sigRef.current[requirement_id];
    if (!canvas) return;
    if (canvas.isEmpty()) {
      notify({ title: "Signature required", description: "Please sign before saving.", variant: "error" });
      return;
    }
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const data_url = canvas.getTrimmedCanvas().toDataURL("image/png");
      const res = await fetch("/api/onboardings/client/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id, data_url }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Signature save failed");
      notify({ title: "Signature saved", variant: "success" });
      setReqs((prev) =>
        prev.map((r) =>
          r.id === requirement_id ? { ...r, signature_path: json.signature_path, completed_at: new Date().toISOString() } : r
        )
      );
      refreshProgress();
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
      throw e;
    } finally {
      setBusyByReq((p) => ({ ...p, [requirement_id]: false }));
    }
  }

  const anyBusy = React.useMemo(() => Object.values(busyByReq).some(Boolean), [busyByReq]);
  const isLocked = locked;

  async function submit() {
    if (isLocked || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboardings/client/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Submit failed");
      notify({ title: "Submitted", description: "Your onboarding is complete.", variant: "success" });
      window.location.reload();
    } catch (e: any) {
      notify({ title: "Submit failed", description: e?.message ?? "Unknown error", variant: "error" });
      setSubmitting(false);
    }
  }

  const allRequiredDone = progress.required_total > 0 && progress.required_completed >= progress.required_total;

  const showResumeBanner =
    !isLocked &&
    !resumeDismissed &&
    initialProgressSnapshot.current !== null &&
    initialProgressSnapshot.current.completed > 0 &&
    initialProgressSnapshot.current.total > 0 &&
    initialProgressSnapshot.current.completed < initialProgressSnapshot.current.total;

  function scrollToFirstIncomplete() {
    const first = flatItems.find((r) => r.is_required && !r.completed_at) ?? flatItems.find((r) => !r.completed_at);
    if (!first) return;
    const el = document.getElementById(`req-${first.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Brief focus ring via data attribute
      el.setAttribute("data-focus-flash", "1");
      window.setTimeout(() => el.removeAttribute("data-focus-flash"), 1600);
    }
  }

  function renderReviewValue(r: Requirement): React.ReactNode {
    if (!r.completed_at) {
      return <span className="text-[var(--color-text-muted)] italic">Not answered</span>;
    }
    if (r.type === "text") {
      const v = r.value_text || "";
      const truncated = v.length > 120 ? v.slice(0, 120) + "…" : v;
      return <span className="whitespace-pre-wrap break-words">{truncated || "—"}</span>;
    }
    if (r.type === "file") {
      const count = (r.file_paths ?? (r.file_path ? [r.file_path] : [])).length;
      return <span>{count} file{count === 1 ? "" : "s"}</span>;
    }
    if (r.type === "signature") {
      return <span className="text-[var(--color-success)]">Signed ✓</span>;
    }
    if (r.type === "multiple_choice") {
      const arr = parseMultiSelectValue(r.value_text);
      if (arr.length === 0) return <span className="text-[var(--color-text-muted)] italic">—</span>;
      return <span className="break-words">{arr.join(", ")}</span>;
    }
    if (r.type === "checkbox") {
      return <span>{r.value_text === "true" ? "Confirmed" : "Not confirmed"}</span>;
    }
    return <span>—</span>;
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10">
      {/* Resume banner (initial mount, dismissible) */}
      {showResumeBanner ? (
        <div
          className="flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-sm shadow-[var(--shadow-sm)]"
          style={{
            background: "var(--color-accent-subtle)",
            borderColor: "color-mix(in oklab, var(--color-accent) 25%, transparent)",
          }}
        >
          <div className="mt-0.5 shrink-0 text-[var(--color-accent)]" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M8 4.5V8l2.2 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[var(--color-text-primary)]">Welcome back</div>
            <div className="mt-0.5 text-[var(--color-text-secondary)]">
              You&apos;ve completed {initialProgressSnapshot.current!.completed} of {initialProgressSnapshot.current!.total} steps.{" "}
              <button
                type="button"
                onClick={scrollToFirstIncomplete}
                className="font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
              >
                Pick up where you left off →
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setResumeDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-panel)]/50 hover:text-[var(--color-text-primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : null}

      {/* Progress header */}
      <div className="sticky top-0 z-10 pb-2 pt-1" style={{ background: "var(--color-bg-subtle)" }}>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{onboardingTitle}</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                {progress.required_completed} of {progress.required_total} required steps completed
              </div>
            </div>
            <div
              className="shrink-0 text-2xl font-bold tabular-nums"
              style={{ color: allRequiredDone ? "var(--color-success)" : "var(--color-accent)" }}
            >
              {progress.percent}%
            </div>
          </div>
          <div className="mt-3">
            {sectionStats.length >= 2 ? (
              <div className="flex items-stretch gap-1.5" role="list" aria-label="Section progress">
                {sectionStats.map((s, i) => {
                  const pct = Math.round(Math.min(1, Math.max(0, s.fraction)) * 100);
                  const done = pct >= 100;
                  return (
                    <div
                      key={i}
                      role="listitem"
                      title={s.title ? `${s.title}: ${s.requiredDone}/${s.requiredTotal}` : `Section ${i + 1}: ${s.requiredDone}/${s.requiredTotal}`}
                      className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: done ? "var(--color-success)" : "var(--color-accent)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.percent}%`,
                    background: allRequiredDone ? "var(--color-success)" : "var(--color-accent)",
                  }}
                />
              </div>
            )}
          </div>
          {isLocked ? (
            <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
                <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Submission locked — no further changes can be made.
            </div>
          ) : null}
        </div>
      </div>

      {/* Requirement cards */}
      {reqs.map((r) => {
        // Feature 7: section headings render as a visual separator, not an interactive card
        if (r.type === "heading") {
          // fallthrough
        } else if (!isVisible(r)) {
          return null;
        }
        if (r.type === "heading") {
          return (
            <div key={r.id} className="mt-2 rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-2.5 text-center">
              <span
                className="text-sm font-semibold tracking-tight text-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {r.label}
              </span>
            </div>
          );
        }

        const completed = !!r.completed_at;

        return (
          <div
            key={r.id}
            id={`req-${r.id}`}
            className="rounded-[var(--radius-lg)] border bg-[var(--color-panel)] shadow-[var(--shadow-sm)] overflow-hidden transition-colors data-[focus-flash=1]:ring-2 data-[focus-flash=1]:ring-[var(--color-accent)]"
            style={{ borderColor: completed ? "var(--color-success, #16a34a)" : "var(--color-border)" }}
          >
            {/* Card header */}
            <div
              className="flex items-start justify-between gap-3 px-5 py-4"
              style={{
                borderBottom: "1px solid var(--color-border)",
                background: completed ? "var(--color-success-subtle, #f0fdf4)" : "var(--color-bg-subtle)",
              }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">{r.label}</span>
                  {r.is_required ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-500 border border-red-100">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      Optional
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                {completed ? (
                  <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "var(--color-success-subtle, #f0fdf4)", color: "var(--color-success, #16a34a)", border: "1px solid var(--color-success, #16a34a)22" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Done
                  </span>
                ) : (
                  <span className="rounded-full px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]" style={{ background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)" }}>
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              {/* Feature 5: text with optional multiline */}
              {r.type === "text" ? (
                <TextRequirement
                  disabled={isLocked}
                  busy={!!busyByReq[r.id]}
                  initialValue={r.value_text || ""}
                  onSave={(val) => saveText(r.id, val)}
                  multiline={!!r.metadata?.multiline}
                />
              ) : null}

              {/* Feature 1 + 4: file with link mode + multi-file */}
              {r.type === "file" ? (
                <FileRequirement
                  disabled={isLocked}
                  busy={!!busyByReq[r.id]}
                  filePaths={r.file_paths ?? (r.file_path ? [r.file_path] : [])}
                  attachmentPath={r.attachment_path}
                  fileMode={r.metadata?.file_mode ?? "upload"}
                  linkUrl={r.metadata?.link_url ?? null}
                  requirementId={r.id}
                  token={token}
                  onUpload={(file) => uploadFile(r.id, file)}
                  onRemove={(path) => removeFile(r.id, path)}
                />
              ) : null}

              {r.type === "signature" ? (
                <SignatureRequirement
                  disabled={isLocked}
                  busy={!!busyByReq[r.id]}
                  signaturePath={r.signature_path}
                  canvasRef={(c) => { sigRef.current[r.id] = c; }}
                  onSave={() => saveSignature(r.id)}
                />
              ) : null}

              {/* Feature 2 + 3: multi-select and "Other" option */}
              {r.type === "multiple_choice" ? (
                <MultipleChoiceRequirement
                  disabled={isLocked}
                  busy={!!busyByReq[r.id]}
                  options={r.options ?? []}
                  selectedValue={r.value_text}
                  allowMultiSelect={!!r.metadata?.allow_multi_select}
                  includeOther={!!r.metadata?.include_other}
                  onSelect={(val) => saveText(r.id, val)}
                />
              ) : null}

              {/* Feature 6: completion checkbox */}
              {r.type === "checkbox" ? (
                <CheckboxRequirement
                  disabled={isLocked}
                  busy={!!busyByReq[r.id]}
                  checked={r.value_text === "true"}
                  label={r.label}
                  onToggle={(checked) => saveText(r.id, checked ? "true" : "false")}
                />
              ) : null}
            </div>
          </div>
        );
      })}

      {/* Submit */}
      <div className="pt-2">
        {isLocked ? (
          <div className="flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-4 text-sm text-[var(--color-text-muted)] shadow-[var(--shadow-sm)]">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            This submission has been locked by the team.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (submitting || anyBusy) return;
              if (allRequiredDone) setReviewOpen(true);
            }}
            disabled={submitting || anyBusy || !allRequiredDone}
            className="w-full rounded-[var(--radius-lg)] px-6 py-4 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "var(--color-accent)", minHeight: "52px" }}
          >
            {submitting ? "Submitting…" : anyBusy ? "Saving…" : allRequiredDone ? "Review and submit →" : "Submit onboarding"}
          </button>
        )}
      </div>

      {/* Review-before-submit modal */}
      <Modal
        open={reviewOpen}
        onClose={() => { if (!submitting) setReviewOpen(false); }}
        size="xl"
        title="Review your answers"
        description="Take one last look before sending — you won't be able to edit after submitting."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReviewOpen(false)} disabled={submitting}>
              Back to edit
            </Button>
            <Button
              variant="primary"
              onClick={() => { void submit(); }}
              loading={submitting}
            >
              Confirm submission
            </Button>
          </>
        }
      >
        <ul className="flex max-h-[60vh] flex-col divide-y divide-[var(--color-border)] overflow-y-auto">
          {flatItems.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
              <div className="shrink-0 sm:w-1/3">
                <div className="text-xs font-semibold text-[var(--color-text-primary)]">{r.label}</div>
                {r.is_required ? (
                  <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Required</div>
                ) : null}
              </div>
              <div className="min-w-0 flex-1 text-sm text-[var(--color-text-secondary)]">
                {renderReviewValue(r)}
              </div>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}

// ─── TextRequirement ──────────────────────────────────────────────────────────
// Feature 5: multiline prop switches between <Input> and <textarea>.

function TextRequirement({
  initialValue,
  onSave,
  disabled,
  busy,
  multiline,
}: {
  initialValue: string;
  onSave: (v: string) => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
  multiline: boolean;
}) {
  const [value, setValue] = React.useState(initialValue);
  const [lastSaved, setLastSaved] = React.useState(initialValue);
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const mountedRef = React.useRef(false);
  const saveSeqRef = React.useRef(0);

  React.useEffect(() => {
    setValue(initialValue);
    setLastSaved(initialValue);
    setStatus("idle");
  }, [initialValue]);

  async function doSave(v: string) {
    if (disabled) return;
    if (v === lastSaved) return;
    const seq = ++saveSeqRef.current;
    try {
      setStatus("saving");
      await onSave(v);
      if (saveSeqRef.current !== seq) return;
      setLastSaved(v);
      setStatus("saved");
      window.setTimeout(() => { setStatus((s) => (s === "saved" ? "idle" : s)); }, 1200);
    } catch {
      if (saveSeqRef.current !== seq) return;
      setStatus("error");
      window.setTimeout(() => { setStatus((s) => (s === "error" ? "idle" : s)); }, 2000);
    }
  }

  // Auto-save on debounce
  React.useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (disabled) return;
    const t = window.setTimeout(() => { void doSave(value); }, 650);
    return () => window.clearTimeout(t);
  }, [value, disabled]);

  const statusText = disabled ? "Locked" : status === "saving" || busy ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : "";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Answer</Label>
        <div className="text-xs text-[var(--color-text-muted)]">{statusText}</div>
      </div>
      {multiline ? (
        // Feature 5: multi-line textarea with auto-height and preserved line breaks
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => void doSave(value)}
          disabled={disabled}
          rows={4}
          className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-base leading-6 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] focus:outline-none disabled:opacity-50"
          style={{ fontSize: "16px", minHeight: "100px" }}
          placeholder="Type your answer…"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => void doSave(value)}
          disabled={disabled}
          className="w-full text-base"
          style={{ fontSize: "16px" }}
        />
      )}
    </div>
  );
}

// ─── FileRequirement ──────────────────────────────────────────────────────────
// Feature 1: link mode shows a clickable link instead of a download button.
// Feature 4: supports multiple uploaded files, each with its own remove button.

function FileRequirement({
  filePaths,
  attachmentPath,
  fileMode,
  linkUrl,
  requirementId,
  token,
  onUpload,
  onRemove,
  disabled,
  busy,
}: {
  filePaths: string[];
  attachmentPath: string | null;
  fileMode: "upload" | "link";
  linkUrl: string | null;
  requirementId: string;
  token: string;
  onUpload: (f: File) => void;
  onRemove: (path: string) => void;
  disabled: boolean;
  busy: boolean;
}) {
  const [downloading, setDownloading] = React.useState(false);

  async function downloadAttachment() {
    setDownloading(true);
    try {
      const url = `/api/onboardings/client/download?token=${encodeURIComponent(token)}&requirement_id=${encodeURIComponent(requirementId)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const cd = res.headers.get("content-disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] || "form-template";
      triggerBrowserDownload(objUrl, filename);
      URL.revokeObjectURL(objUrl);
    } catch {
      // Silent — user can retry
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Feature 1: show either an upload download button or a clickable link */}
      {(attachmentPath || (fileMode === "link" && linkUrl)) ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {fileMode === "link" ? "Template link provided" : "Form template provided"}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {fileMode === "link"
                ? "Open the link, complete the form, then upload your response below."
                : "Download, fill it out, then upload your completed version below."}
            </span>
          </div>
          {fileMode === "link" && linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] bg-[var(--color-panel)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
            >
              Open link ↗
            </a>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={downloadAttachment}
              disabled={downloading}
              className="shrink-0 min-h-[40px]"
            >
              {downloading ? "Downloading…" : "Download form"}
            </Button>
          )}
        </div>
      ) : null}

      {/* Feature 4: list of already-uploaded files */}
      {filePaths.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Uploaded file{filePaths.length > 1 ? "s" : ""}
          </span>
          <ul className="flex flex-col gap-1.5">
            {filePaths.map((path) => (
              <li
                key={path}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2"
              >
                <span className="text-sm text-[var(--color-text-primary)] truncate" title={prettyStoredName(path) ?? path}>
                  {prettyStoredName(path)}
                </span>
                {!disabled ? (
                  <button
                    type="button"
                    onClick={() => onRemove(path)}
                    disabled={busy}
                    className="shrink-0 text-xs text-[var(--color-text-muted)] hover:text-red-600 disabled:opacity-40 transition"
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Upload area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-[var(--color-text-secondary)]">
            {filePaths.length > 0 ? "Add another file" : "Upload your file"}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">{disabled ? "Locked" : busy ? "Uploading…" : ""}</div>
        </div>
        <label className="flex w-full cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] min-h-[48px] px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition">
          <span>{busy ? "Uploading…" : "Choose file"}</span>
          <input
            type="file"
            className="sr-only"
            disabled={disabled || busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}

// ─── MultipleChoiceRequirement ────────────────────────────────────────────────
// Feature 2: allowMultiSelect renders checkboxes instead of radio buttons.
// Feature 3: includeOther adds an "Other" option with inline free-text input.

function MultipleChoiceRequirement({
  options,
  selectedValue,
  allowMultiSelect,
  includeOther,
  onSelect,
  disabled,
  busy,
}: {
  options: string[];
  selectedValue: string | null;
  allowMultiSelect: boolean;
  includeOther: boolean;
  onSelect: (v: string) => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
}) {
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");

  // For multi-select: parse the stored JSON array
  const selectedArray = React.useMemo(
    () => (allowMultiSelect ? parseMultiSelectValue(selectedValue) : []),
    [allowMultiSelect, selectedValue]
  );

  // For "Other" detection: if stored value isn't in options, it's an "Other" entry
  const otherText = React.useMemo(() => {
    if (!includeOther) return "";
    if (allowMultiSelect) {
      // Find the first item in selectedArray that isn't a predefined option
      return selectedArray.find((v) => !options.includes(v)) ?? "";
    }
    // Single select: if value isn't in options, it's the "Other" text
    return selectedValue && !options.includes(selectedValue) ? selectedValue : "";
  }, [includeOther, allowMultiSelect, selectedArray, options, selectedValue]);

  const [otherInput, setOtherInput] = React.useState(otherText);
  const [otherSelected, setOtherSelected] = React.useState(otherText.length > 0);

  // Keep otherInput in sync when the stored value changes (e.g. initial load)
  React.useEffect(() => {
    setOtherInput(otherText);
    setOtherSelected(otherText.length > 0);
  }, [otherText]);

  async function handleSave(value: string) {
    setStatus("saving");
    try {
      await onSelect(value);
      setStatus("saved");
      window.setTimeout(() => { setStatus((s) => (s === "saved" ? "idle" : s)); }, 1200);
    } catch {
      setStatus("error");
      window.setTimeout(() => { setStatus((s) => (s === "error" ? "idle" : s)); }, 2000);
    }
  }

  // ── Single-select ────────────────────────────────────────────────────────────

  if (!allowMultiSelect) {
    const useDropdown = options.length > 5 && !includeOther;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label>Select an option</Label>
          <div className="text-xs text-[var(--color-text-muted)]">
            {disabled ? "Locked" : status === "saving" || busy ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : ""}
          </div>
        </div>

        {useDropdown ? (
          <select
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-base focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] disabled:opacity-50"
            style={{ fontSize: "16px" }}
            value={selectedValue ?? ""}
            disabled={disabled || busy}
            onChange={(e) => { if (e.target.value) void handleSave(e.target.value); }}
          >
            <option value="" disabled>Choose an option…</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="flex flex-col gap-2">
            {options.map((opt, i) => {
              const isSelected = selectedValue === opt;
              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 cursor-pointer transition min-h-[48px] ${
                    isSelected ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-bg-subtle)]"
                  } ${disabled || busy ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name={`mcq-single-${i}`}
                    value={opt}
                    checked={isSelected}
                    disabled={disabled || busy}
                    onChange={() => { setOtherSelected(false); void handleSave(opt); }}
                    className="accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
                </label>
              );
            })}

            {/* Feature 3: "Other" option for single-select */}
            {includeOther ? (
              <div className="flex flex-col gap-2">
                <label
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 cursor-pointer transition min-h-[48px] ${
                    otherSelected ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-bg-subtle)]"
                  } ${disabled || busy ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name={`mcq-single-other`}
                    checked={otherSelected}
                    disabled={disabled || busy}
                    onChange={() => { setOtherSelected(true); }}
                    className="accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-primary)]">Other</span>
                </label>
                {otherSelected ? (
                  <Input
                    value={otherInput}
                    onChange={(e) => setOtherInput(e.target.value)}
                    onBlur={() => { if (otherInput.trim()) void handleSave(otherInput.trim()); }}
                    disabled={disabled || busy}
                    placeholder="Describe your answer…"
                    className="text-sm"
                    style={{ fontSize: "16px" }}
                    autoFocus
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // ── Multi-select (Feature 2) ──────────────────────────────────────────────────

  function toggleOption(opt: string) {
    if (disabled || busy) return;
    const current = parseMultiSelectValue(selectedValue);
    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt];
    void handleSave(JSON.stringify(next));
  }

  function toggleOtherMulti(checked: boolean) {
    if (disabled || busy) return;
    if (!checked) {
      // Remove any "other" text from the selection
      const current = parseMultiSelectValue(selectedValue);
      const next = current.filter((v) => options.includes(v));
      setOtherSelected(false);
      setOtherInput("");
      void handleSave(JSON.stringify(next));
    } else {
      setOtherSelected(true);
    }
  }

  function commitOtherText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = parseMultiSelectValue(selectedValue).filter((v) => options.includes(v));
    void handleSave(JSON.stringify([...current, trimmed]));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Select all that apply</Label>
        <div className="text-xs text-[var(--color-text-muted)]">
          {disabled ? "Locked" : status === "saving" || busy ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : ""}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isChecked = selectedArray.includes(opt);
          return (
            <label
              key={i}
              className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 cursor-pointer transition min-h-[48px] ${
                isChecked ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-bg-subtle)]"
              } ${disabled || busy ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={disabled || busy}
                onChange={() => toggleOption(opt)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
            </label>
          );
        })}

        {/* Feature 3 + Feature 2: "Other" checkbox for multi-select */}
        {includeOther ? (
          <div className="flex flex-col gap-2">
            <label
              className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 cursor-pointer transition min-h-[48px] ${
                otherSelected ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-panel)] hover:bg-[var(--color-bg-subtle)]"
              } ${disabled || busy ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="checkbox"
                checked={otherSelected}
                disabled={disabled || busy}
                onChange={(e) => toggleOtherMulti(e.target.checked)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--color-text-primary)]">Other</span>
            </label>
            {otherSelected ? (
              <Input
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                onBlur={() => commitOtherText(otherInput)}
                disabled={disabled || busy}
                placeholder="Describe your answer…"
                className="text-sm"
                style={{ fontSize: "16px" }}
                autoFocus
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── CheckboxRequirement ──────────────────────────────────────────────────────
// Feature 6: completion checkbox — visually denotes completion when checked.

function CheckboxRequirement({
  checked,
  onToggle,
  disabled,
  busy,
}: {
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
}) {
  const [status, setStatus] = React.useState<"idle" | "saving" | "error">("idle");

  async function handleToggle() {
    if (disabled || busy) return;
    setStatus("saving");
    try {
      await onToggle(!checked);
      setStatus("idle");
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <label className={`flex items-center gap-3 ${disabled || busy ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <div className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition ${
        checked ? "border-[var(--color-success,#16a34a)] bg-[var(--color-success,#16a34a)]" : "border-[var(--color-border-strong,#d1d5db)] bg-[var(--color-panel)]"
      }`}>
        {checked ? (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
        <input type="checkbox" className="sr-only" checked={checked} disabled={disabled || busy} onChange={handleToggle} />
      </div>
      <span className={`text-sm transition ${checked ? "text-[var(--color-success,#16a34a)] line-through" : "text-[var(--color-text-secondary)]"}`}>
        {checked ? "Confirmed" : "Click to confirm"}
      </span>
      <span className="ml-auto text-xs text-[var(--color-text-muted)]">
        {disabled ? "Locked" : status === "saving" || busy ? "Saving…" : status === "error" ? "Save failed" : ""}
      </span>
    </label>
  );
}

// ─── SignatureRequirement ─────────────────────────────────────────────────────
// Unchanged from original.

function SignatureRequirement({
  signaturePath,
  onSave,
  disabled,
  busy,
  canvasRef,
}: {
  signaturePath: string | null;
  onSave: () => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
  canvasRef: (c: SignatureCanvas | null) => void;
}) {
  const localRef = React.useRef<SignatureCanvas | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (disabled) return;
    const resize = () => {
      const sig = localRef.current;
      const el = containerRef.current;
      if (!sig || !el) return;
      const canvas = sig.getCanvas();
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = Math.max(1, el.clientWidth);
      const cssHeight = 200;
      const hadInk = !sig.isEmpty();
      const dataUrl = hadInk ? sig.getTrimmedCanvas().toDataURL("image/png") : null;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sig.clear();
      if (dataUrl) sig.fromDataURL(dataUrl);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [disabled]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-[var(--color-text-secondary)]">
          {signaturePath ? `Saved: ${prettyStoredName(signaturePath)}` : "Sign below"}
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">{disabled ? "Locked" : busy ? "Saving…" : ""}</div>
      </div>

      <div ref={containerRef} className="w-full min-h-[200px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-2">
        <SignatureCanvas
          penColor="black"
          minWidth={1.6}
          maxWidth={3.2}
          velocityFilterWeight={0.7}
          throttle={16}
          minDistance={0}
          canvasProps={{ height: 200, className: "w-full block" }}
          onEnd={() => { if (disabled) return; setDirty(true); }}
          ref={(c) => { localRef.current = c; canvasRef(c); }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => { localRef.current?.clear(); setDirty(false); }}
          disabled={disabled || busy}
          className="w-full min-h-[48px]"
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={async () => { await onSave(); setDirty(false); }}
          disabled={disabled || busy || !dirty}
          className="w-full min-h-[48px]"
        >
          Save signature
        </Button>
      </div>
    </div>
  );
}
