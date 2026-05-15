"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

type Phase = {
  id: string;
  phase_number: number;
  name: string;
  deadline: string | null;
  status: "locked" | "in_progress" | "awaiting_review" | "approved" | "rejected";
  reviewer_note: string | null;
};

type Requirement = {
  id: string;
  type: string | null;
  label: string | null;
  is_required: boolean | null;
  value_text: string | null;
  value_json: any;
  file_path: string | null;
  file_paths: string[] | null;
  signature_path: string | null;
  options: string[] | null;
  phase_number: number | null;
  review_status: string | null;
  reviewer_comment: string | null;
  sort_order: number | null;
};

type WhiteLabel = {
  brand_name?: string | null;
  logo_url?: string | null;
  accent_color?: string | null;
  heading_color?: string | null;
  portal_tagline?: string | null;
} | null;

interface Props {
  token: string;
  onboardingId: string;
  clientName: string;
  eventName: string | null;
  phases: Phase[];
  currentPhase: Phase;
  requirements: Requirement[];
  whiteLabel: WhiteLabel;
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function StatusBanner({ phase, flaggedCount }: { phase: Phase; flaggedCount?: number }) {
  if (phase.status === "awaiting_review") {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm text-[var(--color-accent)]">
        <strong>Awaiting review.</strong> Your submission has been received and is being reviewed.
      </div>
    );
  }
  if (phase.status === "approved") {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-success-subtle)] px-4 py-3 text-sm text-[var(--color-success)]">
        <strong>Approved.</strong> You can proceed to the next phase below.
      </div>
    );
  }
  if (phase.status === "rejected") {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
        <strong>Changes requested.</strong>
        {phase.reviewer_note && (
          <p className="mt-1.5 rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)]">
            {phase.reviewer_note}
          </p>
        )}
        {flaggedCount != null && flaggedCount > 0 && (
          <p className="mt-1.5">
            {flaggedCount} field{flaggedCount === 1 ? "" : "s"} highlighted below — please update and resubmit.
          </p>
        )}
        {(!flaggedCount || flaggedCount === 0) && (
          <p className="mt-1">Please review the highlighted items below and resubmit.</p>
        )}
      </div>
    );
  }
  return null;
}

export default function PhasePortalClient({
  token,
  onboardingId,
  clientName,
  eventName,
  phases,
  currentPhase,
  requirements,
  whiteLabel,
}: Props) {
  const router = useRouter();

  const brandName = whiteLabel?.brand_name?.trim() || "ClientEnforce";
  const logoUrl = whiteLabel?.logo_url?.trim() || null;
  const accentColor = whiteLabel?.accent_color?.trim() || null;
  const headingColor = whiteLabel?.heading_color?.trim() || accentColor || null;
  const tagline = whiteLabel?.portal_tagline?.trim() || null;

  const totalPhases = phases.length;
  const approvedCount = phases.filter((p) => p.status === "approved").length;
  const progressPct = totalPhases > 0 ? Math.round((approvedCount / totalPhases) * 100) : 0;

  const isReadOnly = currentPhase.status === "awaiting_review" || currentPhase.status === "approved";
  const isLocked = currentPhase.status === "locked";

  // Form state: map of requirement id → answer text
  const [answers, setAnswers] = React.useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const r of requirements) {
      if (r.value_text) m[r.id] = r.value_text;
    }
    return m;
  });

  const [saving, setSaving] = React.useState<string | null>(null); // requirement id being saved
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [busyByReq, setBusyByReq] = React.useState<Record<string, boolean>>({});
  const [filePaths, setFilePaths] = React.useState<Record<string, string[]>>(() => {
    const m: Record<string, string[]> = {};
    for (const r of requirements) {
      if (Array.isArray(r.file_paths) && r.file_paths.length > 0) {
        m[r.id] = r.file_paths;
      } else if (r.file_path) {
        m[r.id] = [r.file_path];
      }
    }
    return m;
  });
  const [sigPaths, setSigPaths] = React.useState<Record<string, string | null>>(() => {
    const m: Record<string, string | null> = {};
    for (const r of requirements) {
      if (r.signature_path) m[r.id] = r.signature_path;
    }
    return m;
  });
  const sigRefs = React.useRef<Record<string, SignatureCanvas | null>>({});

  async function saveAnswer(reqId: string, value: string) {
    setSaving(reqId);
    try {
      await fetch("/api/onboardings/client/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id: reqId, value_text: value }),
      });
    } catch { /* silent */ } finally {
      setSaving(null);
    }
  }

  async function uploadFile(reqId: string, file: File) {
    const req = requirements.find((r) => r.id === reqId);
    const isRevision = req?.review_status === "needs_revision";
    setBusyByReq((p) => ({ ...p, [reqId]: true }));
    try {
      const fd = new FormData();
      fd.set("token", token);
      fd.set("requirement_id", reqId);
      fd.set("file", file);
      const res = await fetch("/api/onboardings/client/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      const newPath: string = json.file_path ?? "";
      if (newPath) {
        // On revision, replace all old files with just the new one
        setFilePaths((p) => ({ ...p, [reqId]: isRevision ? [newPath] : [...(p[reqId] ?? []).filter((x) => x !== newPath), newPath] }));
      }
    } catch { /* silent */ } finally {
      setBusyByReq((p) => ({ ...p, [reqId]: false }));
    }
  }

  async function removeFile(reqId: string, path: string) {
    setBusyByReq((p) => ({ ...p, [reqId]: true }));
    try {
      await fetch("/api/onboardings/client/remove-file", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id: reqId, file_path: path }),
      });
      setFilePaths((p) => ({ ...p, [reqId]: (p[reqId] ?? []).filter((x) => x !== path) }));
    } catch { /* silent */ } finally {
      setBusyByReq((p) => ({ ...p, [reqId]: false }));
    }
  }

  async function saveSignature(reqId: string) {
    const canvas = sigRefs.current[reqId];
    if (!canvas || canvas.isEmpty()) return;
    setBusyByReq((p) => ({ ...p, [reqId]: true }));
    try {
      const data_url = canvas.getTrimmedCanvas().toDataURL("image/png");
      const res = await fetch("/api/onboardings/client/signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id: reqId, data_url }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Signature save failed");
      setSigPaths((p) => ({ ...p, [reqId]: json.signature_path ?? null }));
    } catch { /* silent */ } finally {
      setBusyByReq((p) => ({ ...p, [reqId]: false }));
    }
  }

  async function handleSubmit() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      // Flush any unsaved text answers (saves on blur may have been skipped if user clicked Submit directly)
      await Promise.all(
        Object.entries(answers).map(([reqId, value]) =>
          fetch("/api/onboardings/client/answer", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token, requirement_id: reqId, value_text: value }),
          }).catch(() => null)
        )
      );

      const res = await fetch(`/api/onboardings/${onboardingId}/phases/${currentPhase.phase_number}/submit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ client_token: token }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Submit failed");
      setSubmitted(true);
      router.refresh();
    } catch (e: any) {
      setSubmitError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const nextPhase = phases.find((p) => p.phase_number === currentPhase.phase_number + 1);
  const allRequiredFilled = requirements
    .filter((r) => r.is_required && r.type !== "heading")
    .every((r) =>
      answers[r.id] ||
      r.value_text ||
      (filePaths[r.id]?.length ?? 0) > 0 ||
      r.file_path ||
      sigPaths[r.id] ||
      r.signature_path
    );

  const style: React.CSSProperties = {
    ...(accentColor ? { ["--color-accent" as any]: accentColor } : {}),
    ...(headingColor ? { ["--color-heading" as any]: headingColor } : {}),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]" style={style}>
      {/* Top bar */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl && (
              <img src={logoUrl} alt={brandName} className="h-10 w-auto max-w-[120px] shrink-0 object-contain" />
            )}
            <div className="min-w-0">
              <div
                className="text-sm font-semibold leading-tight"
                style={headingColor ? { color: headingColor } : undefined}
              >
                {brandName}
                {eventName && <span className="ml-2 font-normal text-[var(--color-text-muted)]">· {eventName}</span>}
              </div>
              {tagline && (
                <div className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">{tagline}</div>
              )}
            </div>
          </div>
          <div className="shrink-0 text-xs text-[var(--color-text-muted)]">
            Hi, {clientName}
          </div>
        </div>
      </header>

      {/* Mobile phase strip — horizontal scrollable, hidden on lg+ */}
      <div className="lg:hidden border-b border-[var(--color-border)] bg-[var(--color-panel)]">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-none">
          {phases.map((ph) => {
            const isActive = ph.phase_number === currentPhase.phase_number;
            const isAccessible = ph.status !== "locked";
            const statusDot =
              ph.status === "approved" ? "bg-[var(--color-success)]" :
              ph.status === "awaiting_review" ? "bg-yellow-400" :
              ph.status === "rejected" ? "bg-[var(--color-danger)]" :
              ph.status === "locked" ? "bg-[var(--color-border)]" :
              "bg-[var(--color-accent)]";
            return (
              <button
                key={ph.id}
                onClick={() => isAccessible && router.push(`/c/${token}/phase/${ph.phase_number}`)}
                disabled={!isAccessible}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : isAccessible
                    ? "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isActive ? "bg-white" : statusDot)} />
                {ph.name}
              </button>
            );
          })}
        </div>
        {/* Progress bar on mobile */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
              <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">{approvedCount}/{totalPhases} approved</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:flex lg:gap-8 lg:py-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block lg:w-52 lg:shrink-0">
          <div className="sticky top-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Phases</p>
            <nav className="space-y-1">
              {phases.map((ph) => {
                const isActive = ph.phase_number === currentPhase.phase_number;
                const isAccessible = ph.status !== "locked";
                const icon = ph.status === "approved" ? "✓" : ph.status === "locked" ? "🔒" : ph.status === "awaiting_review" ? "⏳" : ph.status === "rejected" ? "!" : "→";
                return (
                  <button
                    key={ph.id}
                    onClick={() => isAccessible && router.push(`/c/${token}/phase/${ph.phase_number}`)}
                    disabled={!isAccessible}
                    className={cn(
                      "w-full rounded-[var(--radius-md)] px-3 py-2 text-left text-xs font-medium transition-colors",
                      isActive ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]" : "",
                      !isActive && isAccessible ? "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]" : "",
                      !isAccessible ? "cursor-not-allowed text-[var(--color-text-muted)] opacity-50" : ""
                    )}
                  >
                    {icon} {ph.name}
                  </button>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-[var(--color-border)] pt-3">
              <p className="mb-1 px-2 text-[10px] text-[var(--color-text-muted)]">Overall progress</p>
              <div className="mx-2 h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="mt-1 px-2 text-[10px] text-[var(--color-text-muted)]">{approvedCount}/{totalPhases} phases approved</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-6">
          <div>
            <h1
              className="text-xl font-semibold"
              style={headingColor ? { color: headingColor } : { color: "var(--color-text-primary)" }}
            >{currentPhase.name}</h1>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Phase {currentPhase.phase_number} of {totalPhases}
              {currentPhase.deadline && ` · Deadline: ${currentPhase.deadline}`}
            </p>
          </div>

          {isLocked ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-8 text-center">
              <div className="text-4xl">🔒</div>
              <p className="mt-3 text-sm font-medium text-[var(--color-text-primary)]">
                This phase is locked
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                It will unlock after Phase {currentPhase.phase_number - 1} is approved.
              </p>
              <button
                onClick={() => router.push(`/c/${token}/phase/${currentPhase.phase_number - 1}`)}
                className="mt-4 text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                ← Go to Phase {currentPhase.phase_number - 1}
              </button>
            </div>
          ) : (
            <>
              <StatusBanner
                phase={submitted ? { ...currentPhase, status: "awaiting_review" } : currentPhase}
                flaggedCount={requirements.filter((r) => r.review_status === "needs_revision").length}
              />

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] divide-y divide-[var(--color-border)]">
                {requirements.map((req) => {
                  const isHeading = req.type === "heading";
                  const needsRevision = req.review_status === "needs_revision";

                  if (isHeading) {
                    return (
                      <div key={req.id} className="px-5 py-4 bg-[var(--color-bg-subtle)]">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{req.label}</h3>
                      </div>
                    );
                  }

                  return (
                    <div key={req.id} className={cn("px-5 py-4", needsRevision && "border-l-4 border-[var(--color-danger)] bg-[var(--color-danger-subtle)]")}>
                      <div className="flex items-baseline gap-1.5">
                        <label className={cn("block text-sm font-medium", needsRevision ? "text-[var(--color-danger)]" : "text-[var(--color-text-primary)]")}>
                          {needsRevision && <span className="mr-1">⚑</span>}{req.label}
                        </label>
                        {req.is_required && <span className="text-xs text-[var(--color-danger)]">*</span>}
                        {needsRevision && (
                          <span className="rounded-full bg-[var(--color-danger)] px-2 py-0.5 text-[10px] font-semibold text-white">Needs revision</span>
                        )}
                      </div>

                      {needsRevision && (
                        <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-bg)] px-3 py-2">
                          <p className="text-xs font-semibold text-[var(--color-danger)]">Reviewer feedback</p>
                          <p className="mt-0.5 text-xs text-[var(--color-text-primary)]">
                            {req.reviewer_comment || "Please update this field and resubmit."}
                          </p>
                        </div>
                      )}

                      {req.type === "file" ? (
                        <div className="mt-2 flex flex-col gap-2">
                          {needsRevision ? (
                            /* Revision mode — clear slate, upload fresh */
                            <>
                              <p className="text-xs text-[var(--color-danger)]">Please upload a replacement — all previous files will be replaced.</p>
                              {(filePaths[req.id]?.length ?? 0) > 0 ? (
                                filePaths[req.id].map((path) => (
                                  <div key={path} className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-3 py-2 opacity-60">
                                    <span className="min-w-0 flex-1 truncate text-xs text-[var(--color-text-secondary)] line-through">{path.split("/").pop()}</span>
                                    <span className="shrink-0 text-[10px] text-[var(--color-danger)]">will be replaced</span>
                                  </div>
                                ))
                              ) : null}
                              <label className="flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-danger)] hover:opacity-80 transition">
                                <span>{busyByReq[req.id] ? "Uploading…" : "Upload replacement file"}</span>
                                <input type="file" className="sr-only" disabled={busyByReq[req.id]} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(req.id, f); e.currentTarget.value = ""; }} />
                              </label>
                            </>
                          ) : (
                            /* Normal mode */
                            <>
                              {(filePaths[req.id] ?? (req.file_path ? [req.file_path] : [])).map((path) => (
                                <div key={path} className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2">
                                  <span className="truncate text-xs text-[var(--color-text-primary)]">{path.split("/").pop()}</span>
                                  {!isReadOnly && (
                                    <button onClick={() => removeFile(req.id, path)} className="text-xs text-[var(--color-text-muted)] hover:text-red-500">Remove</button>
                                  )}
                                </div>
                              ))}
                              {!isReadOnly && (
                                <label className="flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition">
                                  <span>{busyByReq[req.id] ? "Uploading…" : "Choose file"}</span>
                                  <input type="file" className="sr-only" disabled={busyByReq[req.id]} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(req.id, f); e.currentTarget.value = ""; }} />
                                </label>
                              )}
                              {isReadOnly && (filePaths[req.id]?.length ?? 0) === 0 && !req.file_path && (
                                <span className="text-xs text-[var(--color-text-muted)]">No file uploaded</span>
                              )}
                            </>
                          )}
                        </div>
                      ) : req.type === "signature" ? (
                        <div className="mt-2 flex flex-col gap-2">
                          {(sigPaths[req.id] ?? req.signature_path) ? (
                            <span className="text-xs text-[var(--color-success)]">✓ Signature saved</span>
                          ) : null}
                          {!isReadOnly && (
                            <>
                              <SignatureCanvasPad
                                onRef={(c) => { sigRefs.current[req.id] = c; }}
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => sigRefs.current[req.id]?.clear()}
                                  className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                                >
                                  Clear
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveSignature(req.id)}
                                  disabled={busyByReq[req.id]}
                                  className="flex-1 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                                >
                                  {busyByReq[req.id] ? "Saving…" : "Save signature"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : req.type === "multiple_choice" && req.options ? (
                        <div className="mt-2 space-y-1">
                          {req.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={req.id}
                                value={opt}
                                checked={(answers[req.id] ?? req.value_text) === opt}
                                disabled={isReadOnly}
                                onChange={() => {
                                  if (isReadOnly) return;
                                  setAnswers((p) => ({ ...p, [req.id]: opt }));
                                  saveAnswer(req.id, opt);
                                }}
                                className="accent-[var(--color-accent)]"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      ) : req.type === "checkbox" ? (
                        <label className="mt-2 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={Boolean(answers[req.id] ?? req.value_text)}
                            disabled={isReadOnly}
                            onChange={(e) => {
                              if (isReadOnly) return;
                              const v = e.target.checked ? "true" : "";
                              setAnswers((p) => ({ ...p, [req.id]: v }));
                              saveAnswer(req.id, v);
                            }}
                            className="h-4 w-4 accent-[var(--color-accent)]"
                          />
                          I confirm
                        </label>
                      ) : (
                        <textarea
                          className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] disabled:opacity-60"
                          rows={3}
                          disabled={isReadOnly}
                          placeholder={isReadOnly ? "—" : `Enter ${req.label?.toLowerCase() ?? "your answer"}…`}
                          value={answers[req.id] ?? req.value_text ?? ""}
                          onChange={(e) => {
                            if (isReadOnly) return;
                            setAnswers((p) => ({ ...p, [req.id]: e.target.value }));
                          }}
                          onBlur={(e) => {
                            if (!isReadOnly) saveAnswer(req.id, e.target.value);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom action bar */}
              <div className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-4">
                {currentPhase.status === "awaiting_review" || submitted ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    ⏳ Your submission is being reviewed.
                  </p>
                ) : currentPhase.status === "approved" ? (
                  nextPhase && nextPhase.status !== "locked" ? (
                    <button
                      onClick={() => router.push(`/c/${token}/phase/${nextPhase.phase_number}`)}
                      className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Proceed to {nextPhase.name} →
                    </button>
                  ) : !nextPhase ? (
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-success)]">🎉 All done — thank you!</p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">Your onboarding is complete.</p>
                    </div>
                  ) : null
                ) : (
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {allRequiredFilled ? "All required fields filled." : "Please fill in all required fields (*) to submit."}
                    </div>
                    <button
                      disabled={!allRequiredFilled || submitting}
                      onClick={handleSubmit}
                      className="rounded-[var(--radius-md)] bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                    >
                      {submitting ? "Submitting…" : `Submit Phase ${currentPhase.phase_number} for Review`}
                    </button>
                  </div>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-[var(--color-danger)]">{submitError}</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function SignatureCanvasPad({ onRef }: { onRef: (c: SignatureCanvas | null) => void }) {
  const localRef = React.useRef<SignatureCanvas | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const resize = () => {
      const sig = localRef.current;
      const el = containerRef.current;
      if (!sig || !el) return;
      const canvas = sig.getCanvas();
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = Math.max(1, el.clientWidth);
      const hadInk = !sig.isEmpty();
      const dataUrl = hadInk ? sig.getTrimmedCanvas().toDataURL("image/png") : null;
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(200 * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = "200px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sig.clear();
      if (dataUrl) sig.fromDataURL(dataUrl);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div ref={containerRef} className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)]" style={{ minHeight: 200 }}>
      <SignatureCanvas
        penColor="black"
        minWidth={1.6}
        maxWidth={3.2}
        velocityFilterWeight={0.7}
        throttle={16}
        minDistance={0}
        canvasProps={{ height: 200, className: "w-full block" }}
        ref={(c) => { localRef.current = c; onRef(c); }}
      />
    </div>
  );
}
