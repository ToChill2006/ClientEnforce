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
  type: "text" | "file" | "signature";
  label: string;
  is_required: boolean;
  sort_order: number;
  completed_at: string | null;
  value_text: string | null;
  file_path: string | null;
  signature_path: string | null;
};

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
      // Support multiple toast hook shapes (push/toast/add).
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
      const res = await fetch(`/api/onboardings/client/progress?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json) {
        setProgress({
          percent: json.percent,
          required_total: json.required_total,
          required_completed: json.required_completed,
        });
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

      // Treat API success as: HTTP 2xx AND (no json OR json.ok !== false)
      if (!res.ok || (json && json.ok === false)) {
        throw new Error(json?.error || `Failed (${res.status})`);
      }

      // Do not toast on every keystroke autosave; the UI shows inline status.
      setReqs((prev) =>
        prev.map((r) =>
          r.id === requirement_id
            ? {
                ...r,
                value_text: trimmed,
                completed_at: (json?.requirement?.completed_at as string | undefined) || new Date().toISOString(),
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

  async function uploadFile(requirement_id: string, file: File) {
    try {
      setBusyByReq((p) => ({ ...p, [requirement_id]: true }));
      const fd = new FormData();
      fd.set("token", token);
      fd.set("requirement_id", requirement_id);
      fd.set("file", file);

      const res = await fetch("/api/onboardings/client/upload", {
        method: "POST",
        body: fd,
      });
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
          r.id === requirement_id
            ? { ...r, signature_path: json.signature_path, completed_at: new Date().toISOString() }
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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{onboardingTitle}</CardTitle>
          <CardDescription>
            Required completed: {progress.required_completed}/{progress.required_total} —{" "}
            <span className="font-semibold text-zinc-900">{progress.percent}%</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress.percent} />
          {isLocked ? (
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
              This onboarding is locked. No further changes can be made.
            </div>
          ) : null}
        </CardContent>
      </Card>

      {reqs.map((r) => (
        <Card key={r.id}>
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
                onUpload={(file) => uploadFile(r.id, file)}
              />
            ) : null}

            {r.type === "signature" ? (
              <SignatureRequirement
                disabled={isLocked}
                busy={!!busyByReq[r.id]}
                signaturePath={r.signature_path}
                canvasRef={(c) => {
                  sigRef.current[r.id] = c;
                }}
                onSave={() => saveSignature(r.id)}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button type="button" onClick={submit} disabled={isLocked || submitting || anyBusy}>
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

    // Sequence number prevents stale responses from flipping the UI back to error.
    const seq = ++saveSeqRef.current;

    try {
      setStatus("saving");
      await onSave(v);

      // Ignore if a newer save started while this one was in-flight.
      if (saveSeqRef.current !== seq) return;

      setLastSaved(v);
      setStatus("saved");
      window.setTimeout(() => {
        setStatus((s) => (s === "saved" ? "idle" : s));
      }, 1200);
    } catch {
      if (saveSeqRef.current !== seq) return;

      setStatus("error");
      window.setTimeout(() => {
        setStatus((s) => (s === "error" ? "idle" : s));
      }, 2000);
    }
  }

  // Debounced auto-save
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (disabled) return;
    const t = window.setTimeout(() => {
      void doSave(value);
    }, 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label>Answer</Label>
        <div className="text-xs text-zinc-500">
          {disabled
            ? "Locked"
            : status === "saving" || busy
              ? "Saving…"
              : status === "saved"
                ? "Saved"
                : status === "error"
                  ? "Save failed"
                  : ""}
        </div>
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => void doSave(value)}
        disabled={disabled}
      />
    </div>
  );
}

function FileRequirement({
  filePath,
  onUpload,
  disabled,
  busy,
}: {
  filePath: string | null;
  onUpload: (f: File) => void;
  disabled: boolean;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-700">{filePath ? `Uploaded: ${filePath}` : "Upload a file"}</div>
        <div className="text-xs text-zinc-500">{disabled ? "Locked" : busy ? "Uploading…" : ""}</div>
      </div>
      <input
        type="file"
        disabled={disabled || busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.currentTarget.value = "";
        }}
      />
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
  onSave: () => void;
  disabled: boolean;
  busy: boolean;
  canvasRef: (c: SignatureCanvas | null) => void;
}) {
  const localRef = React.useRef<SignatureCanvas | null>(null);
  const saveTimer = React.useRef<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-700">{signaturePath ? `Saved: ${signaturePath}` : "Sign below"}</div>
        <div className="text-xs text-zinc-500">{disabled ? "Locked" : busy ? "Saving…" : ""}</div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-2">
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 640, height: 180, className: "w-full" }}
          onEnd={() => {
            if (disabled) return;
            if (saveTimer.current) window.clearTimeout(saveTimer.current);
            saveTimer.current = window.setTimeout(() => {
              onSave();
            }, 500);
          }}
          ref={(c) => {
            localRef.current = c;
            canvasRef(c);
          }}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={() => localRef.current?.clear()} disabled={disabled || busy}>
          Clear
        </Button>
        <Button type="button" variant="secondary" onClick={onSave} disabled={disabled || busy}>
          Save signature
        </Button>
      </div>
    </div>
  );
}