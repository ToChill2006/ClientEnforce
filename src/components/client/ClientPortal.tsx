"use client";

import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Requirement = {
  id: string;
  type: "text" | "file" | "signature" | "multiple_choice";
  label: string;
  is_required: boolean;
  sort_order: number;
  completed_at: string | null;
  value_text: string | null;
  file_path: string | null;
  signature_path: string | null;
  attachment_path: string | null;
  options: string[] | null;
};

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

  const [reqs, setReqs] = React.useState(requirements.slice().sort((a, b) => a.sort_order - b.sort_order));
  const [submitting, setSubmitting] = React.useState(false);
  const [busyByReq, setBusyByReq] = React.useState<Record<string, boolean>>({});
  const sigRef = React.useRef<Record<string, SignatureCanvas | null>>({});

  const [progress, setProgress] = React.useState<{ percent: number; required_total: number; required_completed: number }>({
    percent: 0,
    required_total: 0,
    required_completed: 0,
  });

  async function refreshProgress() {
    try {
      const res = await fetch(`/api/onboardings/client/progress?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok && json) {
        setProgress({ percent: json.percent, required_total: json.required_total, required_completed: json.required_completed });
      }
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    refreshProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveText(requirement_id: string, value_text: string) {
    const trimmed = value_text;
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const res = await fetch("/api/onboardings/client/answer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, requirement_id, value_text: trimmed }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || (json && json.ok === false)) throw new Error(json?.error || `Failed (${res.status})`);
      setReqs((prev) =>
        prev.map((r) =>
          r.id === requirement_id
            ? { ...r, value_text: trimmed, completed_at: (json?.requirement?.completed_at as string | undefined) || new Date().toISOString() }
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
        prev.map((r) =>
          r.id === requirement_id ? { ...r, file_path: json.file_path, completed_at: new Date().toISOString() } : r
        )
      );
      refreshProgress();
    } catch (e: any) {
      notify({ title: "Upload failed", description: e?.message ?? "Unknown error", variant: "error" });
      throw e;
    } finally {
      setBusyByReq((p) => ({ ...p, [requirement_id]: false }));
    }
  }

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

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-12">
      <div className="sticky top-0 z-10 bg-[var(--color-bg-subtle)] py-3">
        <Card>
          <CardHeader>
            <CardTitle>{onboardingTitle}</CardTitle>
            <CardDescription>
              Required completed: {progress.required_completed}/{progress.required_total} —{" "}
              <span className="font-semibold text-[var(--color-text-primary)]">{progress.percent}%</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress.percent} />
            {isLocked ? (
              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text-secondary)]">
                This onboarding is locked. No further changes can be made.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {reqs.map((r) => (
        <Card key={r.id} className="w-full rounded-[var(--radius-md)]">
          <CardHeader>
            <CardTitle className="text-base">
              {r.label} {r.is_required ? <span className="text-red-600">*</span> : null}
            </CardTitle>
            <CardDescription>
              Type: {r.type} — {r.completed_at ? "Completed" : "Incomplete"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {r.type === "text" ? (
              <TextRequirement
                disabled={isLocked}
                busy={!!busyByReq[r.id]}
                initialValue={r.value_text || ""}
                onSave={(val) => saveText(r.id, val)}
              />
            ) : null}

            {r.type === "file" ? (
              <FileRequirement
                disabled={isLocked}
                busy={!!busyByReq[r.id]}
                filePath={r.file_path}
                attachmentPath={r.attachment_path}
                requirementId={r.id}
                token={token}
                onUpload={(file) => uploadFile(r.id, file)}
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

            {r.type === "multiple_choice" ? (
              <MultipleChoiceRequirement
                disabled={isLocked}
                busy={!!busyByReq[r.id]}
                options={r.options ?? []}
                selectedValue={r.value_text}
                onSelect={(val) => saveText(r.id, val)}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={submit}
          disabled={isLocked || submitting || anyBusy}
          className="w-full min-h-[48px]"
        >
          {submitting ? "Submitting..." : anyBusy ? "Saving..." : "Submit onboarding"}
        </Button>
      </div>
    </div>
  );
}

function TextRequirement({
  initialValue,
  onSave,
  disabled,
  busy,
}: {
  initialValue: string;
  onSave: (v: string) => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
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

  React.useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    if (disabled) return;
    const t = window.setTimeout(() => { void doSave(value); }, 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Answer</Label>
        <div className="text-xs text-[var(--color-text-muted)]">
          {disabled ? "Locked" : status === "saving" || busy ? "Saving…" : status === "saved" ? "Saved" : status === "error" ? "Save failed" : ""}
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => void doSave(value)}
        disabled={disabled}
        className="w-full text-base"
        style={{ fontSize: "16px" }}
      />
    </div>
  );
}

function FileRequirement({
  filePath,
  attachmentPath,
  requirementId,
  token,
  onUpload,
  disabled,
  busy,
}: {
  filePath: string | null;
  attachmentPath: string | null;
  requirementId: string;
  token: string;
  onUpload: (f: File) => void;
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
      {attachmentPath ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Form template provided</span>
            <span className="text-xs text-[var(--color-text-secondary)]">Download, fill it out, then upload your completed version below.</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={downloadAttachment}
            disabled={downloading}
            className="shrink-0 min-h-[40px]"
          >
            {downloading ? "Downloading…" : "Download form"}
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-[var(--color-text-secondary)]">
            {filePath ? `Uploaded: ${prettyStoredName(filePath)}` : "Upload your file"}
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

function MultipleChoiceRequirement({
  options,
  selectedValue,
  onSelect,
  disabled,
  busy,
}: {
  options: string[];
  selectedValue: string | null;
  onSelect: (v: string) => Promise<void> | void;
  disabled: boolean;
  busy: boolean;
}) {
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const useDropdown = options.length > 5;

  async function handleSelect(val: string) {
    if (disabled || val === selectedValue) return;
    setStatus("saving");
    try {
      await onSelect(val);
      setStatus("saved");
      window.setTimeout(() => { setStatus((s) => (s === "saved" ? "idle" : s)); }, 1200);
    } catch {
      setStatus("error");
      window.setTimeout(() => { setStatus((s) => (s === "error" ? "idle" : s)); }, 2000);
    }
  }

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
          onChange={(e) => { if (e.target.value) void handleSelect(e.target.value); }}
        >
          <option value="" disabled>Choose an option…</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 cursor-pointer transition min-h-[48px] ${
                selectedValue === opt
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]"
                  : "border-[var(--color-border)] bg-white hover:bg-[var(--color-bg-subtle)]"
              } ${disabled || busy ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name={`mcq-${i}`}
                value={opt}
                checked={selectedValue === opt}
                disabled={disabled || busy}
                onChange={() => void handleSelect(opt)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--color-text-primary)]">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

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

      <div ref={containerRef} className="w-full min-h-[200px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-2">
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
