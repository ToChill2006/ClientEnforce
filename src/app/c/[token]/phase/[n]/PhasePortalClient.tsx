"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { ChatBubble } from "@/components/ui/chat-bubble";

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
  file_path: string | null;
  file_paths: string[] | null;
  signature_path: string | null;
  options: string[] | null;
  phase_number: number | null;
  review_status: string | null;
  reviewer_comment: string | null;
  sort_order: number | null;
  payment_amount?: number | null;
  payment_currency?: string | null;
  payment_description?: string | null;
  payment_status?: string | null;
  payment_paid_at?: string | null;
  payment_stripe_payment_intent_id?: string | null;
  metadata?: { allow_multi_select?: boolean; include_other?: boolean } | null;
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
  companyName: string | null;
  eventName: string | null;
  eventDeadline: string | null;
  phases: Phase[];
  currentPhase: Phase;
  requirements: Requirement[];
  whiteLabel: WhiteLabel;
  guideUrl?: string | null;
  guideTitle?: string | null;
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PhasePortalClient({
  token,
  onboardingId,
  clientName,
  companyName,
  eventName,
  eventDeadline,
  phases,
  currentPhase,
  requirements,
  whiteLabel,
  guideUrl,
  guideTitle,
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

  const [answers, setAnswers] = React.useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const r of requirements) {
      if (r.value_text) m[r.id] = r.value_text;
    }
    return m;
  });

  const [saving, setSaving] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [busyByReq, setBusyByReq] = React.useState<Record<string, boolean>>({});
  const [otherOpen, setOtherOpen] = React.useState<Record<string, boolean>>({});
  const [replacedReqs, setReplacedReqs] = React.useState<Record<string, string>>({});
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

  const [paymentStatuses, setPaymentStatuses] = React.useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const r of requirements) {
      if (r.payment_status) m[r.id] = r.payment_status;
    }
    return m;
  });
  const [paymentBusy, setPaymentBusy] = React.useState<Record<string, boolean>>({});
  const [paymentToast, setPaymentToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paidReqId = params.get("paid");
    const cancelledReqId = params.get("payment_cancelled");

    const url = new URL(window.location.href);

    if (paidReqId) {
      setPaymentStatuses((prev) => ({ ...prev, [paidReqId]: "paid" }));
      setPaymentToast("Payment received — thank you!");
      url.searchParams.delete("paid");
      window.history.replaceState({}, "", url.toString());
      setTimeout(() => setPaymentToast(null), 4000);
      // Confirm with server so DB reflects paid status regardless of webhook timing
      fetch(`/api/c/${token}/requirements/${paidReqId}/confirm`, { method: "POST" }).catch(() => {});
    }

    if (cancelledReqId) {
      // Reset local state immediately so the pay button is available again
      setPaymentStatuses((prev) => ({ ...prev, [cancelledReqId]: "not_paid" }));
      url.searchParams.delete("payment_cancelled");
      window.history.replaceState({}, "", url.toString());
      // Also reset in DB so it isn't stuck as "pending"
      fetch(`/api/c/${token}/requirements/${cancelledReqId}/cancel`, { method: "POST" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initiatePayment(reqId: string) {
    setPaymentBusy((p) => ({ ...p, [reqId]: true }));
    try {
      const res = await fetch(`/api/c/${token}/requirements/${reqId}/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Could not start checkout");
      if (json?.url) {
        window.location.href = json.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: any) {
      setPaymentBusy((p) => ({ ...p, [reqId]: false }));
      setPaymentToast(`Payment error: ${e?.message || "Something went wrong. Please try again."}`);
      setTimeout(() => setPaymentToast(null), 6000);
    }
  }

  async function saveAnswer(reqId: string, value: string) {
    setSaving(reqId);
    try {
      const res = await fetch("/api/onboardings/client/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id: reqId, value_text: value }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error("saveAnswer failed", res.status, err?.error);
      }
    } catch (e) {
      console.error("saveAnswer error", e);
    } finally {
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
        setFilePaths((p) => ({ ...p, [reqId]: isRevision ? [newPath] : [...(p[reqId] ?? []).filter((x) => x !== newPath), newPath] }));
        if (isRevision) setReplacedReqs((p) => ({ ...p, [reqId]: newPath }));
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
  const interactiveReqs = requirements.filter((r) => r.type !== "heading" && r.type !== "info");

  function isReqFilled(r: Requirement) {
    if (r.type === "payment") return (paymentStatuses[r.id] ?? r.payment_status) === "paid";
    return !!(answers[r.id] || r.value_text || (filePaths[r.id]?.length ?? 0) > 0 || r.file_path || sigPaths[r.id] || r.signature_path);
  }

  const allRequiredFilled = interactiveReqs.filter((r) => r.is_required).every(isReqFilled);
  const filledCount = interactiveReqs.filter(isReqFilled).length;
  const fillPct = interactiveReqs.length > 0 ? Math.round((filledCount / interactiveReqs.length) * 100) : 0;

  const effectiveStatus = submitted ? "awaiting_review" : currentPhase.status;
  const flaggedCount = requirements.filter((r) => r.review_status === "needs_revision").length;

  // Derived accent values
  const accent = accentColor ?? "#6366f1";
  const heading = headingColor ?? accentColor ?? "#111827";
  const accentSubtle = `${accent}18`;

  const style: React.CSSProperties = {
    ...(accentColor ? { ["--color-accent" as any]: accentColor } : {}),
    ...(headingColor ? { ["--color-heading" as any]: headingColor } : {}),
  };

  // Pre-compute requirement groups so phase title card can absorb the first one
  type ReqGroup = { heading: Requirement | null; infos: Requirement[] };
  type GroupItem = { type: "group"; data: ReqGroup } | { type: "field"; data: Requirement };
  const allGroups: GroupItem[] = [];
  {
    let cur: ReqGroup | null = null;
    for (const req of requirements) {
      if (req.type === "heading") {
        if (cur) allGroups.push({ type: "group", data: cur });
        cur = { heading: req, infos: [] };
      } else if (req.type === "info") {
        if (!cur) cur = { heading: null, infos: [] };
        cur.infos.push(req);
      } else {
        if (cur) { allGroups.push({ type: "group", data: cur }); cur = null; }
        allGroups.push({ type: "field", data: req });
      }
    }
    if (cur) allGroups.push({ type: "group", data: cur });
  }
  // If the first group is heading/info only, it gets merged into the phase title card
  const firstIsGroup = allGroups[0]?.type === "group";
  const titleInlineGroup = firstIsGroup ? (allGroups[0] as { type: "group"; data: ReqGroup }).data : null;
  const bodyGroups = firstIsGroup ? allGroups.slice(1) : allGroups;

  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={style}>

      {/* Brand accent strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-8 w-auto max-w-[100px] shrink-0 object-contain sm:h-10 sm:max-w-[120px]" />
            ) : (
              <div
                className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl text-white text-base sm:text-lg font-bold shadow-sm"
                style={{ backgroundColor: accent }}
              >
                {brandName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold leading-tight truncate" style={{ color: heading }}>
                {brandName}
                {eventName && (
                  <span className="hidden sm:inline ml-2 text-sm font-normal text-gray-400">· {eventName}</span>
                )}
              </div>
              {eventName && (
                <div className="sm:hidden text-[11px] text-gray-400 truncate">{eventName}</div>
              )}
              {tagline && (
                <div className="hidden sm:block mt-0.5 text-xs text-gray-400 truncate">{tagline}</div>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-medium text-gray-700 hidden sm:block">{clientName}</div>
            {companyName && (
              <div className="text-xs text-gray-400 hidden sm:block truncate max-w-[180px]">{companyName}</div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile phase strip */}
      <div className="lg:hidden bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none">
          {phases.map((ph) => {
            const isActive = ph.phase_number === currentPhase.phase_number;
            const isDone = ph.status === "approved";
            const mobDeadline = ph.deadline || eventDeadline;
            const mobDays = mobDeadline ? Math.ceil((new Date(mobDeadline).setHours(23,59,59,999) - Date.now()) / 86400000) : null;
            return (
              <button
                key={ph.id}
                onClick={() => router.push(`/c/${token}/phase/${ph.phase_number}`)}
                className="flex shrink-0 flex-col items-start rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
                style={
                  isActive
                    ? { color: heading, outline: `2.5px solid ${accent}`, outlineOffset: "1px" }
                    : { color: heading }
                }
              >
                <span className="flex items-center gap-1.5">
                  {isDone && <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7"/></svg>}
                  {ph.name}
                </span>
                {mobDays !== null && (
                  <span className={cn(
                    "mt-0.5 text-[9px] font-normal",
                    mobDays < 0 ? "text-red-400" : mobDays <= 3 ? "text-amber-400" : "text-gray-400"
                  )}>
                    {mobDays < 0 ? `Overdue` : mobDays === 0 ? "Due today" : new Date(mobDeadline!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="px-4 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: accent }} />
            </div>
            <span className="text-[11px] font-medium text-gray-400 shrink-0">{approvedCount}/{totalPhases} approved</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-6 lg:flex lg:gap-7 lg:py-8">

        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-56 lg:shrink-0">
          <div className="sticky top-6 rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden">
            {/* Progress header */}
            <div className="px-4 py-4 border-b border-gray-50" style={{ backgroundColor: accentSubtle }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: heading }}>
                Your Progress
              </p>
              <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, backgroundColor: accent }}
                />
              </div>
              <p className="mt-2 text-xs font-medium" style={{ color: heading }}>
                {approvedCount} of {totalPhases} phases approved
              </p>
            </div>

            {/* Phase list */}
            <nav className="p-2 space-y-0.5">
              {phases.map((ph) => {
                const isActive = ph.phase_number === currentPhase.phase_number;
                const phDeadline = ph.deadline || eventDeadline;
                const phDays = phDeadline ? Math.ceil((new Date(phDeadline).setHours(23,59,59,999) - Date.now()) / 86400000) : null;
                return (
                  <button
                    key={ph.id}
                    onClick={() => router.push(`/c/${token}/phase/${ph.phase_number}`)}
                    className="w-full flex flex-col gap-0.5 rounded-xl px-3 py-2 text-left transition-all"
                    style={
                      isActive
                        ? { color: heading, outline: `2.5px solid ${accent}`, outlineOffset: "1px" }
                        : { color: heading }
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{ph.name}</span>
                      <span className="shrink-0 opacity-70">
                        {ph.status === "approved" && (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7"/></svg>
                        )}
                        {ph.status === "awaiting_review" && (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                        )}
                        {ph.status === "rejected" && (
                          <span className="text-[11px] font-bold">!</span>
                        )}
                      </span>
                    </div>
                    {phDays !== null && (
                      <span className={cn(
                        "text-[10px] font-medium",
                        phDays < 0 ? "text-red-500" : phDays <= 3 ? "text-amber-500" : "text-gray-400"
                      )}>
                        {phDays < 0 ? `Overdue ${Math.abs(phDays)}d` : phDays === 0 ? "Due today" : `Due ${new Date(phDeadline!).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-3 sm:space-y-4 pb-4 sm:pb-0">

          {/* Exhibitor guide banner */}
          {guideUrl && (
            <a
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow no-underline"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: accent + "22" }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: accent }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Exhibitor Guide</p>
                <p className="truncate text-sm font-medium text-gray-800">{guideTitle || "View exhibitor guide"}</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}

          {/* Phase title card — optionally absorbs first heading/info group */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: accent }} />
            <div className="px-4 py-4 sm:px-6 sm:py-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Phase {currentPhase.phase_number} of {totalPhases}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold leading-tight" style={{ color: heading }}>
                  {currentPhase.name}
                </h1>
                {(() => {
                  const deadline = currentPhase.deadline || eventDeadline;
                  if (!deadline) return null;
                  const days = Math.ceil((new Date(deadline).setHours(23,59,59,999) - Date.now()) / 86400000);
                  const label = days < 0
                    ? `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`
                    : days === 0
                    ? "Due today"
                    : `Due ${new Date(deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${days} day${days === 1 ? "" : "s"} left`;
                  const bg = days <= 0 ? "bg-red-50 border-red-200" : days <= 3 ? "bg-amber-50 border-amber-200" : days <= 7 ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200";
                  const text = days <= 0 ? "text-red-700 font-semibold" : days <= 3 ? "text-amber-700 font-semibold" : days <= 7 ? "text-yellow-700" : "text-blue-700";
                  return (
                    <div className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs", bg, text)}>
                      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      {label}
                    </div>
                  );
                })()}
              </div>
              <div className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap",
                effectiveStatus === "approved" ? "bg-green-100 text-green-700" :
                effectiveStatus === "awaiting_review" ? "bg-amber-100 text-amber-700" :
                effectiveStatus === "rejected" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-500"
              )}>
                {effectiveStatus === "approved" ? "Approved" :
                 effectiveStatus === "awaiting_review" ? "Reviewing" :
                 effectiveStatus === "rejected" ? "Changes needed" :
                 effectiveStatus === "in_progress" ? "In Progress" : "Locked"}
              </div>
            </div>
            {titleInlineGroup && (
              <div className="border-t border-gray-100">
                {titleInlineGroup.heading && (
                  <div className="px-4 sm:px-6 py-3 border-b border-gray-100" style={{ borderLeft: `4px solid ${accent}` }}>
                    <h3 className="text-sm font-bold" style={{ color: heading }}>
                      {titleInlineGroup.heading.label}
                    </h3>
                  </div>
                )}
                {titleInlineGroup.infos.map((info) => (
                  <div key={info.id} className="px-4 sm:px-6 py-4 border-b border-gray-50 last:border-b-0">
                    {info.label && (
                      <p className="text-sm font-semibold text-gray-700 mb-1">{info.label}</p>
                    )}
                    {info.value_text && (
                      <p className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">{info.value_text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status banners */}
          {effectiveStatus === "awaiting_review" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
              <div>
                <p className="font-semibold text-amber-800">Submitted — awaiting review</p>
                <p className="text-sm text-amber-700 mt-0.5">Your submission has been received. We'll be in touch soon.</p>
              </div>
            </div>
          )}

          {effectiveStatus === "approved" && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7"/></svg>
              </div>
              <div>
                <p className="font-semibold text-green-800">Phase approved</p>
                <p className="text-sm text-green-700 mt-0.5">
                  {nextPhase ? "You can now proceed to the next phase." : "All phases complete — your onboarding is done!"}
                </p>
              </div>
            </div>
          )}

          {effectiveStatus === "rejected" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 4l8 8M12 4l-8 8"/></svg>
              </div>
              <div>
                <p className="font-semibold text-red-800">Changes requested</p>
                {currentPhase.reviewer_note && (
                  <p className="text-sm text-red-700 mt-1 rounded-lg bg-white/60 px-3 py-2 border border-red-100">
                    {currentPhase.reviewer_note}
                  </p>
                )}
                {flaggedCount > 0 && (
                  <p className="text-sm text-red-700 mt-1">
                    {flaggedCount} field{flaggedCount === 1 ? "" : "s"} flagged below — please update and resubmit.
                  </p>
                )}
              </div>
            </div>
          )}

          {paymentToast && (
            <div className={cn(
              "rounded-2xl border px-5 py-4 flex items-center gap-3",
              paymentToast.startsWith("Payment error")
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            )}>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                paymentToast.startsWith("Payment error") ? "bg-red-100" : "bg-green-100"
              )}>
                {paymentToast.startsWith("Payment error")
                  ? <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M4 4l8 8M12 4l-8 8"/></svg>
                  : <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7"/></svg>
                }
              </div>
              <p className={cn("font-semibold", paymentToast.startsWith("Payment error") ? "text-red-800" : "text-green-800")}>{paymentToast}</p>
            </div>
          )}

          <>
              {/* Requirements — first heading/info group already absorbed into title card */}
              {(() => {
                return (
                  <div className="space-y-3">
                    {bodyGroups.map((item, gi) => {
                      // ── Heading + info group card ──────────────────────────
                      if (item.type === "group") {
                        const { heading: hReq, infos } = item.data;
                        return (
                          <div key={hReq?.id ?? `group-${gi}`} className="rounded-2xl bg-white border border-gray-200 shadow-md overflow-hidden">
                            {hReq && (
                              <div className="px-4 sm:px-5 py-3 border-b border-gray-100" style={{ borderLeft: `4px solid ${accent}`, backgroundColor: `${accent}10` }}>
                                <h3 className="text-sm font-bold" style={{ color: heading }}>
                                  {hReq.label}
                                </h3>
                              </div>
                            )}
                            {infos.map((info) => (
                              <div key={info.id} className="px-4 sm:px-5 py-4">
                                {info.label && (
                                  <p className="text-sm font-semibold text-gray-700 mb-1">{info.label}</p>
                                )}
                                {info.value_text && (
                                  <p className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">{info.value_text}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      // ── Interactive field card ────────────────────────────
                      const req = item.data;
                      const needsRevision = req.review_status === "needs_revision";

                  // ── Payment ─────────────────────────────────────────────
                  if (req.type === "payment") {
                    const payStatus = paymentStatuses[req.id] ?? req.payment_status ?? "not_paid";
                    const amount = req.payment_amount;
                    const currency = (req.payment_currency ?? "GBP").toUpperCase();
                    const fmtAmount = amount != null ? `${currency} ${Number(amount).toFixed(2)}` : currency;
                    const isBusy = paymentBusy[req.id] ?? false;

                    if (payStatus === "paid") {
                      const paidDate = req.payment_paid_at
                        ? new Date(req.payment_paid_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })
                        : null;
                      return (
                        <div key={req.id} className="rounded-2xl bg-white border border-gray-200 shadow-md px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5 6.5-7"/></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-700">Paid {fmtAmount}{paidDate ? ` on ${paidDate}` : ""}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Receipt sent to your email.</p>
                          </div>
                        </div>
                      );
                    }

                    if (payStatus === "pending") {
                      return (
                        <div key={req.id} className="rounded-2xl bg-white border border-gray-200 shadow-md px-4 sm:px-6 py-4 sm:py-5">
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <label className="text-sm font-semibold text-gray-800">{req.label}</label>
                            {req.is_required && <span className="text-xs font-semibold" style={{ color: accent }}>*</span>}
                          </div>
                          {req.payment_description && (
                            <p className="text-sm text-gray-500 mb-3">{req.payment_description}</p>
                          )}
                          <p className="text-xs text-amber-600 mb-3">Your previous session was not completed. Click below to try again.</p>
                          {!isReadOnly && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => initiatePayment(req.id)}
                              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition"
                              style={{ backgroundColor: accent }}
                            >
                              {isBusy ? "Redirecting…" : `Pay ${fmtAmount} →`}
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={req.id} className="rounded-2xl bg-white border border-gray-200 shadow-md px-4 sm:px-6 py-4 sm:py-5">
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <label className="text-sm font-semibold text-gray-800">{req.label}</label>
                          {req.is_required && <span className="text-xs font-semibold" style={{ color: accent }}>*</span>}
                        </div>
                        {req.payment_description && (
                          <p className="text-sm text-gray-500 mb-3">{req.payment_description}</p>
                        )}
                        {payStatus === "failed" && (
                          <p className="text-sm text-red-600 mb-3">Payment failed — please try again.</p>
                        )}
                        {!isReadOnly && (
                          <div>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => initiatePayment(req.id)}
                              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition"
                              style={{ backgroundColor: accent }}
                            >
                              {isBusy ? "Redirecting…" : `Pay ${fmtAmount} →`}
                            </button>
                            <p className="mt-2 text-xs text-gray-400">Secure payment via Stripe.</p>
                          </div>
                        )}
                        {isReadOnly && <p className="text-sm text-gray-400">Payment not yet completed.</p>}
                      </div>
                    );
                  }

                  // ── Standard fields ─────────────────────────────────────
                  return (
                    <div
                      key={req.id}
                      className={cn(
                        "rounded-2xl bg-white border shadow-md overflow-hidden transition",
                        needsRevision ? "border-red-200" : "border-gray-200"
                      )}
                      style={needsRevision ? { borderLeft: "3px solid #ef4444" } : undefined}
                    >
                      {/* Label header strip */}
                      <div className={cn(
                        "flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b",
                        needsRevision ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-200"
                      )}>
                        <label className={cn("text-sm font-semibold", needsRevision ? "text-red-700" : "text-gray-800")}>
                          {req.label}
                        </label>
                        {req.is_required && (
                          <span className="text-xs font-bold" style={{ color: needsRevision ? "#ef4444" : accent }}>*</span>
                        )}
                        {needsRevision && (
                          <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Needs revision
                          </span>
                        )}
                      </div>

                      {/* Field body */}
                      <div className="px-4 sm:px-5 py-4">

                      {/* Reviewer feedback */}
                      {needsRevision && (
                        <div className="mb-3 rounded-xl border border-red-200 bg-white px-4 py-3">
                          <p className="text-xs font-bold text-red-600 mb-0.5">Reviewer feedback</p>
                          <p className="text-sm text-gray-700">
                            {req.reviewer_comment || "Please update this field and resubmit."}
                          </p>
                        </div>
                      )}

                      {/* File upload */}
                      {req.type === "file" ? (
                        <div className="space-y-2">
                          {needsRevision ? (
                            <>
                              {replacedReqs[req.id] ? (
                                <>
                                  <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                                    <span className="text-green-600">✓</span>
                                    <span className="flex-1 truncate text-sm text-gray-700">{replacedReqs[req.id].split("/").pop()}</span>
                                    <span className="text-xs font-semibold text-green-600">Uploaded</span>
                                  </div>
                                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 hover:border-gray-300 transition">
                                    {busyByReq[req.id] ? "Uploading…" : "Upload a different file"}
                                    <input type="file" className="sr-only" disabled={busyByReq[req.id]} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(req.id, f); e.currentTarget.value = ""; }} />
                                  </label>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-red-600">Please upload a replacement file.</p>
                                  {(filePaths[req.id]?.length ?? 0) > 0 && filePaths[req.id].map((path) => (
                                    <div key={path} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 opacity-60">
                                      <span className="flex-1 truncate text-sm text-gray-500 line-through">{path.split("/").pop()}</span>
                                      <span className="text-xs text-red-500">will be replaced</span>
                                    </div>
                                  ))}
                                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-red-300 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
                                    {busyByReq[req.id] ? "Uploading…" : "Choose replacement file"}
                                    <input type="file" className="sr-only" disabled={busyByReq[req.id]} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(req.id, f); e.currentTarget.value = ""; }} />
                                  </label>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {(filePaths[req.id] ?? (req.file_path ? [req.file_path] : [])).map((path) => (
                                <div key={path} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                                  <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" d="M3 2h7l3 3v9H3V2zM10 2v3h3"/></svg>
                                  <span className="flex-1 truncate text-sm text-gray-700">{path.split("/").pop()}</span>
                                  {!isReadOnly && (
                                    <button onClick={() => removeFile(req.id, path)} className="text-xs text-gray-300 hover:text-red-500 transition font-medium">
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              {!isReadOnly && (
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm transition hover:bg-gray-100">
                                  <span className="font-semibold text-gray-600">
                                    {busyByReq[req.id] ? "Uploading…" : "Choose file"}
                                  </span>
                                  <input type="file" className="sr-only" disabled={busyByReq[req.id]} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(req.id, f); e.currentTarget.value = ""; }} />
                                </label>
                              )}
                              {isReadOnly && (filePaths[req.id]?.length ?? 0) === 0 && !req.file_path && (
                                <p className="text-sm text-gray-400">No file uploaded.</p>
                              )}
                            </>
                          )}
                        </div>

                      ) : req.type === "signature" ? (
                        <div className="space-y-2">
                          {(sigPaths[req.id] ?? req.signature_path) && (
                            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                              <span className="text-green-600">✓</span>
                              <span className="text-sm font-medium text-green-700">Signature saved</span>
                            </div>
                          )}
                          {!isReadOnly && (
                            <>
                              <p className="text-xs text-gray-400 mb-1">Draw your signature in the box below</p>
                              <SignatureCanvasPad onRef={(c) => { sigRefs.current[req.id] = c; }} />
                              <div className="flex gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => sigRefs.current[req.id]?.clear()}
                                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                  Clear
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveSignature(req.id)}
                                  disabled={busyByReq[req.id]}
                                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition"
                                  style={{ backgroundColor: accent }}
                                >
                                  {busyByReq[req.id] ? "Saving…" : "Save signature"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                      ) : req.type === "multiple_choice" && req.options ? (
                        <MultiChoiceField
                          req={req}
                          answers={answers}
                          setAnswers={setAnswers}
                          saveAnswer={saveAnswer}
                          isReadOnly={isReadOnly}
                          accent={accent}
                          accentSubtle={accentSubtle}
                          heading={heading}
                          otherOpen={otherOpen}
                          setOtherOpen={setOtherOpen}
                        />

                      ) : req.type === "checkbox" ? (
                        <label className={cn(
                          "flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition",
                          Boolean(answers[req.id] ?? req.value_text) ? "border-transparent shadow-sm" : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                          isReadOnly && "cursor-default"
                        )}
                          style={Boolean(answers[req.id] ?? req.value_text) ? { backgroundColor: accentSubtle, borderColor: accent } : undefined}
                        >
                          <div
                            className="h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition"
                            style={Boolean(answers[req.id] ?? req.value_text) ? { borderColor: accent, backgroundColor: accent } : { borderColor: "#d1d5db" }}
                          >
                            {Boolean(answers[req.id] ?? req.value_text) && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
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
                            className="sr-only"
                          />
                          <span className="text-sm font-medium text-gray-700">I confirm</span>
                        </label>

                      ) : req.type === "textarea" ? (
                        <textarea
                          rows={4}
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition disabled:opacity-50 resize-none"
                          onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.backgroundColor = "#fff"; }}
                          onBlurCapture={(e) => { e.target.style.borderColor = ""; e.target.style.backgroundColor = ""; }}
                        />
                      ) : (
                        <input
                          type="text"
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 outline-none transition disabled:opacity-50"
                          onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.backgroundColor = "#fff"; }}
                          onBlurCapture={(e) => { e.target.style.borderColor = ""; e.target.style.backgroundColor = ""; }}
                        />
                      )}

                      {saving === req.id && (
                        <p className="mt-1 text-[11px] text-gray-400">Saving…</p>
                      )}
                      </div>{/* end field body */}
                    </div>
                  );
                    })}
                  </div>
                );
              })()}

              {/* Submit / action bar */}
              <div className="rounded-2xl bg-white border border-gray-200 shadow-md px-4 sm:px-6 py-4 sm:py-5">
                {effectiveStatus === "awaiting_review" ? (
                  <p className="text-sm text-gray-500 text-center">Your submission is under review — we'll be in touch.</p>
                ) : effectiveStatus === "approved" ? (
                  <div className="text-center">
                    {nextPhase && nextPhase.status !== "locked" ? (
                      <button
                        onClick={() => router.push(`/c/${token}/phase/${nextPhase.phase_number}`)}
                        className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
                        style={{ backgroundColor: accent }}
                      >
                        Proceed to {nextPhase.name} →
                      </button>
                    ) : !nextPhase ? (
                      <div>
                        <p className="text-lg font-bold" style={{ color: heading }}>All done — thank you!</p>
                        <p className="mt-1 text-sm text-gray-400">Your onboarding is complete.</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${fillPct}%`, backgroundColor: accent }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {allRequiredFilled ? "Ready to submit" : "Fill in required fields (*)"}
                      </span>
                    </div>
                    <button
                      disabled={!allRequiredFilled || submitting}
                      onClick={handleSubmit}
                      className="w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90 disabled:opacity-40 transition"
                      style={{ backgroundColor: accent }}
                    >
                      {submitting ? "Submitting…" : `Submit Phase ${currentPhase.phase_number} for Review →`}
                    </button>
                    {submitError && (
                      <p className="text-sm text-red-600 text-center">{submitError}</p>
                    )}
                  </div>
                )}
              </div>
            </>
        </main>
      </div>

      {/* Chat bubble */}
      <ChatBubble
        messagesUrl={`/api/c/${token}/messages`}
        postUrl={`/api/c/${token}/messages`}
        currentSide="client"
        accentColor={accent}
        title="Message the team"
        placeholder="Ask a question or flag an issue…"
      />
    </div>
  );
}

function MultiChoiceField({
  req, answers, setAnswers, saveAnswer, isReadOnly,
  accent, accentSubtle, heading, otherOpen, setOtherOpen,
}: {
  req: { id: string; options: string[] | null; metadata?: { allow_multi_select?: boolean; include_other?: boolean } | null; value_text: string | null };
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  saveAnswer: (reqId: string, value: string) => void;
  isReadOnly: boolean;
  accent: string;
  accentSubtle: string;
  heading: string;
  otherOpen: Record<string, boolean>;
  setOtherOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const allowMulti = Boolean(req.metadata?.allow_multi_select);
  const includeOther = Boolean(req.metadata?.include_other);
  const raw = answers[req.id] ?? req.value_text ?? "";

  // Parse current selected set (for multi) or single value
  const selectedSet: Set<string> = React.useMemo(() => {
    if (!allowMulti) return new Set<string>();
    try { const p = JSON.parse(raw); if (Array.isArray(p)) return new Set<string>(p as string[]); } catch {}
    return raw ? new Set<string>([raw]) : new Set<string>();
  }, [raw, allowMulti]);

  // Extract any "other" text value (a value that isn't in the options list)
  const otherText: string = React.useMemo(() => {
    if (!includeOther) return "";
    if (allowMulti) {
      try { const p = JSON.parse(raw); if (Array.isArray(p)) { const v = (p as string[]).find((x) => !(req.options ?? []).includes(x)); return v ?? ""; } } catch {}
    } else {
      return (req.options ?? []).includes(raw) ? "" : raw;
    }
    return "";
  }, [raw, allowMulti, includeOther, req.options]);

  const isOtherVisible = otherOpen[req.id] ?? otherText !== "";

  function commitMulti(nextSet: Set<string>, nextOtherText: string) {
    const arr = Array.from(nextSet).filter((v) => (req.options ?? []).includes(v));
    if (nextOtherText) arr.push(nextOtherText);
    const v = JSON.stringify(arr);
    setAnswers((p) => ({ ...p, [req.id]: v }));
    saveAnswer(req.id, v);
  }

  function toggleOpt(opt: string) {
    if (isReadOnly) return;
    if (allowMulti) {
      const next = new Set(selectedSet);
      selectedSet.has(opt) ? next.delete(opt) : next.add(opt);
      commitMulti(next, otherText);
    } else {
      setAnswers((p) => ({ ...p, [req.id]: opt }));
      saveAnswer(req.id, opt);
    }
  }

  function toggleOther() {
    if (isReadOnly) return;
    const opening = !isOtherVisible;
    setOtherOpen((p) => ({ ...p, [req.id]: opening }));
    if (!opening && otherText) {
      // Clear the other value
      if (allowMulti) {
        commitMulti(selectedSet, "");
      } else {
        setAnswers((p) => ({ ...p, [req.id]: "" }));
        saveAnswer(req.id, "");
      }
    }
  }

  const allOpts = [...(req.options ?? []), ...(includeOther ? ["__other__"] : [])];

  return (
    <div className="space-y-2">
      {allOpts.map((opt) => {
        const isOtherOpt = opt === "__other__";
        const isSelected = isOtherOpt
          ? isOtherVisible
          : allowMulti ? selectedSet.has(opt) : raw === opt;

        return (
          <div key={opt}>
            <button
              type="button"
              disabled={isReadOnly}
              onClick={() => isOtherOpt ? toggleOther() : toggleOpt(opt)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                isSelected ? "border-transparent shadow-sm" : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                isReadOnly && "cursor-default opacity-80"
              )}
              style={isSelected ? { backgroundColor: accentSubtle, borderColor: accent } : undefined}
            >
              {allowMulti ? (
                <div className="h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition"
                  style={isSelected ? { borderColor: accent, backgroundColor: accent } : { borderColor: "#d1d5db" }}>
                  {isSelected && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition"
                  style={isSelected ? { borderColor: accent, backgroundColor: accent } : { borderColor: "#d1d5db" }}>
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              )}
              <span className="text-sm font-medium" style={isSelected ? { color: heading } : { color: "#374151" }}>
                {isOtherOpt ? "Other…" : opt}
              </span>
            </button>

            {isOtherOpt && isOtherVisible && (
              <input
                type="text"
                placeholder="Please specify…"
                autoFocus
                value={otherText}
                disabled={isReadOnly}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 outline-none"
                onChange={(e) => {
                  if (isReadOnly) return;
                  const v = e.target.value;
                  if (allowMulti) {
                    commitMulti(selectedSet, v);
                  } else {
                    setAnswers((p) => ({ ...p, [req.id]: v }));
                  }
                }}
                onBlur={(e) => {
                  if (!isReadOnly) saveAnswer(req.id, answers[req.id] ?? "");
                }}
                onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.backgroundColor = "#fff"; }}
                onBlurCapture={(e) => { e.target.style.borderColor = ""; e.target.style.backgroundColor = ""; }}
              />
            )}
          </div>
        );
      })}
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
    <div ref={containerRef} className="w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden" style={{ minHeight: 200 }}>
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
