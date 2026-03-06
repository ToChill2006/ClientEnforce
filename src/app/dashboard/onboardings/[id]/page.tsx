"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

type Requirement = {
  id: string;
  onboarding_id?: string | null;

  // DB uses `type`; older code used `kind`
  type?: string | null;
  kind?: string | null;

  label?: string | null;
  // Optional: some templates store a prompt/description
  prompt?: string | null;
  description?: string | null;

  // DB uses `is_required`; older code used `required`
  is_required?: boolean | null;
  required?: boolean | null;

  // Values
  value_text?: string | null;
  value_json?: any;
  file_path?: string | null;
  signature_path?: string | null;

  // Completion
  completed_at?: string | null;
  completed_by?: string | null;
  completed?: boolean | null;

  // Ordering/audit
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
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

    is_required: typeof r.is_required === "boolean" ? r.is_required : (r.isRequired ?? null),
    required: typeof r.required === "boolean" ? r.required : null,

    value_text: r.value_text ?? r.valueText ?? null,
    value_json: r.value_json ?? r.valueJson ?? null,
    file_path: r.file_path ?? r.filePath ?? null,
    signature_path: r.signature_path ?? r.signaturePath ?? null,

    completed_at: r.completed_at ?? r.completedAt ?? null,
    completed_by: r.completed_by ?? r.completedBy ?? null,
    completed: typeof r.completed === "boolean" ? r.completed : null,

    sort_order: typeof r.sort_order === "number" ? r.sort_order : (r.sortOrder ?? null),
    created_at: r.created_at ?? r.createdAt ?? null,
    updated_at: r.updated_at ?? r.updatedAt ?? null,
  };
}


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
    created_at: string | null;
    updated_at: string | null;
  };
  requirements: Requirement[];
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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

function StatusPill({ status }: { status?: string | null }) {
  const s = (status || "draft").toLowerCase();
  const styles =
    s === "submitted"
      ? "bg-zinc-900 text-white border-zinc-900"
      : s === "locked"
      ? "bg-white text-zinc-700 border-zinc-300"
      : s === "in_progress" || s === "in progress"
      ? "bg-white text-zinc-900 border-zinc-300"
      : s === "sent"
      ? "bg-zinc-50 text-zinc-900 border-zinc-200"
      : "bg-white text-zinc-700 border-zinc-200";

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", styles)}>
      {status || "Draft"}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-48 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full bg-zinc-900" style={{ width: `${v}%` }} />
      </div>
      <div className="w-10 text-right text-sm tabular-nums text-zinc-600">{v}%</div>
    </div>
  );
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
  return kind as string;
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
    // Support refs like "bucket:folder/file.pdf"
    const noBucket = path.includes(":") ? path.split(":").slice(1).join(":") : path;
    const clean = noBucket.split("?")[0];
    const parts = clean.split("/");
    const last = parts[parts.length - 1] || "file";
    return decodeURIComponent(last);
  } catch {
    const parts = String(path).split("/");
    return parts[parts.length - 1] || "file";
  }
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
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

async function previewRef(ref: string, defaultBucket: string) {
  const raw = (ref || "").trim();
  if (!raw) throw new Error("Missing file reference");

  // If already a public URL, just open it.
  if (isHttpUrl(raw)) {
    window.open(raw, "_blank", "noopener,noreferrer");
    return;
  }

  const { bucket, path } = parseStorageRef(raw, defaultBucket);
  if (!path) throw new Error("Missing storage path");

  const url = `/api/storage/preview?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

async function downloadRef(ref: string, defaultBucket: string) {
  const raw = (ref || "").trim();
  if (!raw) throw new Error("Missing file reference");

  // If already a public URL, navigate to it (browser download behaviour depends on headers)
  if (isHttpUrl(raw)) {
    window.location.href = raw;
    return;
  }

  const { bucket, path } = parseStorageRef(raw, defaultBucket);
  if (!path) throw new Error("Missing storage path");

  const url = `/api/storage/download?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
  window.location.href = url;
}

async function fetchRequirementsDirect(onboardingId: string): Promise<Requirement[]> {
  const sb = supabaseBrowser();

  // Pull the columns we actually render/compute against.
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
        "completed_at",
        "completed_by",
        "value_text",
        "file_path",
        "signature_path",
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

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [payload, setPayload] = React.useState<DetailPayload | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [locking, setLocking] = React.useState(false);
  const [downloadingPdf, setDownloadingPdf] = React.useState(false);
  const [banner, setBanner] = React.useState<{ kind: "success" | "error"; msg: string } | null>(null);

  async function loadDetail() {
    try {
      setLoading(true);
      setError(null);

      // Fetch onboarding without requirements (avoid legacy include)
      const res = await fetch(`/api/onboardings?id=${encodeURIComponent(params.id)}`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load onboarding (${res.status})`);
      }

      const json = await res.json();

      // Helper: fetch progress+requirements and merge into payload
      const fetchProgressAndRequirements = async (): Promise<{ pct: number; reqs: Requirement[] }> => {
        const r = await fetch(
          `/api/onboardings/progress?ids=${encodeURIComponent(params.id)}&include=requirements`,
          { cache: "no-store" }
        );
        if (!r.ok) return { pct: 0, reqs: [] };
        const j = await r.json().catch(() => null);

        const pct =
          j?.progress?.[params.id]?.percent ??
          j?.[params.id]?.percent ??
          j?.[params.id] ??
          0;

        const reqListRaw = j?.requirements?.[params.id];
        const reqs = Array.isArray(reqListRaw)
          ? reqListRaw.map(normalizeRequirement).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          : [];

        return { pct: typeof pct === "number" ? pct : 0, reqs };
      };

      const attachFallbackRequirements = async (nextPayload: DetailPayload) => {
        // Primary: requirements come from /api/onboardings/progress?include=requirements
        const pr = await fetchProgressAndRequirements();
        if (pr.reqs.length > 0) {
          setProgress(pr.pct);
          return {
            ...nextPayload,
            requirements: pr.reqs,
          } as DetailPayload;
        }

        // Fallback: direct query
        const direct = await fetchRequirementsDirect(params.id);
        setProgress(pr.pct);
        return {
          ...nextPayload,
          requirements: direct.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload;
      };

      // Shape A: { onboarding, requirements }
      if (json?.onboarding && Array.isArray(json?.requirements)) {
        const next = {
          onboarding: json.onboarding,
          requirements: json.requirements
            .map(normalizeRequirement)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload;
        setPayload(await attachFallbackRequirements(next));
        return;
      }

      // Shape B: { onboarding, onboarding_requirements }
      if (json?.onboarding && Array.isArray(json?.onboarding_requirements)) {
        const next = {
          onboarding: json.onboarding,
          requirements: json.onboarding_requirements
            .map(normalizeRequirement)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload;
        setPayload(await attachFallbackRequirements(next));
        return;
      }

      // Shape C: { onboarding, rows: [...] }
      if (json?.onboarding && Array.isArray(json?.rows)) {
        const next = {
          onboarding: json.onboarding,
          requirements: json.rows
            .map(normalizeRequirement)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        } as DetailPayload;
        setPayload(await attachFallbackRequirements(next));
        return;
      }

      if (Array.isArray(json?.onboardings)) {
        const row = json.onboardings.find((r: any) => r.id === params.id);
        if (!row) throw new Error("Onboarding not found.");
        const next = { onboarding: row, requirements: [] } as DetailPayload;
        setPayload(await attachFallbackRequirements(next));
        return;
      }

      throw new Error("Unexpected response shape from /api/onboardings?id=...");
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

      const pct =
        json?.progress?.[params.id]?.percent ??
        json?.[params.id]?.percent ??
        json?.[params.id] ??
        0;

      setProgress(typeof pct === "number" ? pct : 0);

      // Also refresh requirements/answers if provided by the endpoint.
      const reqListRaw = json?.requirements?.[params.id];
      if (Array.isArray(reqListRaw) && reqListRaw.length > 0) {
        const nextReqs = reqListRaw
          .map(normalizeRequirement)
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        setPayload((prev) => {
          if (!prev) return prev;
          return { ...prev, requirements: nextReqs };
        });
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
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Lock failed (${res.status})`);
      }
      await res.json().catch(() => null);
      setBanner({ kind: "success", msg: "Submission locked." });
      await loadDetail();
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Failed to lock onboarding." });
    } finally {
      setLocking(false);
    }
  }

  async function downloadPdf() {
    try {
      if (!params?.id) return;
      setDownloadingPdf(true);
      setBanner(null);

      const filenameBase = (payload?.onboarding?.title || "onboarding").trim() || "onboarding";
      const safeName = filenameBase
        .replace(/[^a-z0-9\-_ ]/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);

      // Expect a server route that returns application/pdf.
      // If you haven't created it yet, create: /api/onboardings/pdf?onboarding_id=<id>
      const url = `/api/onboardings/pdf?onboarding_id=${encodeURIComponent(String(params.id))}`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `PDF export failed (${res.status})`);
      }

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

      setBanner({ kind: "success", msg: "PDF downloaded." });
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Failed to download PDF." });
    } finally {
      setDownloadingPdf(false);
    }
  }

  React.useEffect(() => {
    loadDetail();
    loadProgress();
    const t = window.setInterval(() => loadProgress(), 20_000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const ob = payload?.onboarding;
  const reqs = payload?.requirements ?? [];

  const answered = reqs.filter((r) => valuePreview(r).type !== "empty").length;
  const required = reqs.filter((r) => !!(r.is_required ?? r.required)).length;
  const requiredCompleted = reqs.filter((r) => {
    if (!(r.is_required ?? r.required)) return false;
    return valuePreview(r).type !== "empty" || !!r.completed_at || !!r.completed;
  }).length;
  const computedProgress = required ? Math.round((requiredCompleted / required) * 100) : 0;
  const effectiveProgress = Math.max(progress, computedProgress);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-56 rounded bg-zinc-100" />
        <div className="h-4 w-72 rounded bg-zinc-100" />
        <div className="h-24 rounded-xl border border-zinc-200 bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="text-sm font-medium text-zinc-900">Error</div>
        <div className="mt-1 whitespace-pre-wrap text-sm text-zinc-500">{error}</div>
        <button onClick={() => router.back()} className="mt-4 text-sm text-zinc-900 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {banner ? (
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div>{banner.msg}</div>
            <button
              type="button"
              onClick={() => setBanner(null)}
              className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{ob?.title || "Onboarding"}</h1>
            <StatusPill status={ob?.status} />
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            <span className="font-medium text-zinc-700">Client:</span> {ob?.client_name || "—"}
            <span className="mx-2">•</span>
            <span>{ob?.client_email || "—"}</span>
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            Updated {formatDate(ob?.updated_at)}
            <span className="mx-2">•</span>
            Created {formatDate(ob?.created_at)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            Back
          </button>

          {ob?.client_link ? (
            <button
              onClick={async () => {
                try {
                  await copyToClipboard(ob.client_link!);
                  setBanner({ kind: "success", msg: "Client link copied." });
                } catch {
                  setBanner({ kind: "error", msg: "Could not copy client link." });
                }
              }}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Copy client link
            </button>
          ) : null}

          <button
            onClick={downloadPdf}
            disabled={downloadingPdf}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50"
          >
            {downloadingPdf ? "Preparing PDF…" : "Download PDF"}
          </button>

          {ob?.status === "submitted" ? (
            <button
              onClick={lock}
              disabled={locking}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:opacity-50"
            >
              {locking ? "Locking…" : "Lock submission"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Progress</div>
                <div className="mt-1 text-sm text-zinc-500">Completion across required items.</div>
              </div>
              <div className="text-sm text-zinc-500">
                {answered}/{reqs.length} answered{required ? <span className="ml-2">• {required} required</span> : null}
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={effectiveProgress} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Details</div>
            <div className="mt-3 space-y-2 text-sm text-zinc-600">
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">Template</span>
                <span className="font-medium text-zinc-900">{ob?.template_name || "Default"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-zinc-500">Onboarding ID</span>
                <button
                  onClick={async () => {
                    try {
                      await copyToClipboard(ob?.id || "");
                      setBanner({ kind: "success", msg: "ID copied." });
                    } catch {
                      setBanner({ kind: "error", msg: "Could not copy ID." });
                    }
                  }}
                  className="truncate font-medium text-zinc-900 hover:underline"
                  title={ob?.id || ""}
                >
                  {ob?.id}
                </button>
              </div>
              {ob?.token ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">Client token</span>
                  <span className="font-medium text-zinc-900">{ob.token}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-sm font-semibold text-zinc-900">Responses</div>
          <div className="mt-0.5 text-sm text-zinc-500">Admin view of what the client submitted.</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Field</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Type</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Response</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10">
                    <div className="text-sm font-medium text-zinc-900">No requirements loaded</div>
                    <div className="mt-1 text-sm text-zinc-500">This onboarding has no requirements snapshot, or the API select does not match your schema.</div>
                  </td>
                </tr>
              ) : (
                reqs.map((r) => {
                  const preview = valuePreview(r);
                  const completed = !!r.completed_at || !!r.completed || valuePreview(r).type !== "empty";

                  return (
                    <tr key={r.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm font-medium text-zinc-900">
                          {r.label || "Untitled field"}
                          {(r.is_required ?? r.required) ? <span className="ml-2 text-xs text-zinc-500">Required</span> : null}
                        </div>
                        {r.prompt ? <div className="mt-1 max-w-[520px] text-sm text-zinc-500">{r.prompt}</div> : null}
                      </td>

                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700">
                          {reqKindLabel(r.kind ?? r.type)}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-top">
                        {preview.type === "empty" ? (
                          <div className="text-sm text-zinc-500">—</div>
                        ) : preview.type === "text" ? (
                          <div className="whitespace-pre-wrap text-sm text-zinc-900">{String(preview.v)}</div>
                        ) : preview.type === "json" ? (
                          <pre className="max-w-[680px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-800">{JSON.stringify(preview.v, null, 2)}</pre>
                        ) : preview.type === "file" ? (
                          <div className="flex w-full items-center gap-3">
                            <span className="min-w-0 flex-1 truncate text-sm text-zinc-900" title={fileNameFromPath(String(preview.v))}>
                              {fileNameFromPath(String(preview.v))}
                            </span>
                            <div className="ml-auto flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    await previewRef(String(preview.v), "clientenforce-uploads");
                                  } catch (e: any) {
                                    setBanner({ kind: "error", msg: e?.message || "Could not preview file." });
                                  }
                                }}
                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              >
                                Preview
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await downloadRef(String(preview.v), "clientenforce-uploads");
                                    setBanner({ kind: "success", msg: "Download started." });
                                  } catch (e: any) {
                                    setBanner({ kind: "error", msg: e?.message || "Could not download file." });
                                  }
                                }}
                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-full items-center gap-3">
                            <span className="min-w-0 flex-1 truncate text-sm text-zinc-900" title={fileNameFromPath(String(preview.v))}>
                              {fileNameFromPath(String(preview.v))}
                            </span>
                            <div className="ml-auto flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    await previewRef(String(preview.v), "clientenforce-signatures");
                                  } catch (e: any) {
                                    setBanner({ kind: "error", msg: e?.message || "Could not preview signature." });
                                  }
                                }}
                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              >
                                Preview
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await downloadRef(String(preview.v), "clientenforce-signatures");
                                    setBanner({ kind: "success", msg: "Download started." });
                                  } catch (e: any) {
                                    setBanner({ kind: "error", msg: e?.message || "Could not download signature." });
                                  }
                                }}
                                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 align-top text-right">
                        <span
                          className={cx(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            completed ? "border-zinc-200 bg-zinc-50 text-zinc-900" : "border-zinc-200 bg-white text-zinc-500"
                          )}
                        >
                          {completed ? "Completed" : "Pending"}
                        </span>
                        <div className="mt-1 text-xs text-zinc-500">{completed ? formatDate(r.completed_at || r.updated_at) : ""}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}