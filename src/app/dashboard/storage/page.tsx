"use client";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Item = {
  id: string;
  onboarding_id?: string | null;
  onboarding_title?: string | null;
  // API may return either a normalized `type`/`path`/`name` shape,
  // or the legacy `file_path`/`signature_path` shape.
  type?: string | null; // e.g. "file" | "signature"
  bucket?: string | null;
  path?: string | null;
  name?: string | null;
  file_path?: string | null;
  signature_path?: string | null;
  created_at?: string | null;
  created?: string | null;
  uploaded_at?: string | null;
};

function getOnboardingTitle(it: any): string | null {
  // Support multiple API shapes: onboarding_title, onboardingTitle, onboarding: { title }
  const t = it?.onboarding_title ?? it?.onboardingTitle ?? it?.onboarding?.title ?? null;
  return typeof t === "string" && t.trim().length > 0 ? t : null;
}

function normalizeItem(raw: any): Item {
  return {
    ...raw,
    onboarding_title: getOnboardingTitle(raw),
    onboarding_id: raw?.onboarding_id ?? raw?.onboardingId ?? raw?.onboarding?.id ?? raw?.onboarding?.onboarding_id ?? null,
    created_at: raw?.created_at ?? raw?.createdAt ?? null,
    uploaded_at: raw?.uploaded_at ?? raw?.uploadedAt ?? null,
    file_path: raw?.file_path ?? raw?.filePath ?? null,
    signature_path: raw?.signature_path ?? raw?.signaturePath ?? null,
    path: raw?.path ?? null,
    name: raw?.name ?? null,
    type: raw?.type ?? null,
    bucket: raw?.bucket ?? null,
  };
}

function baseName(path?: string | null) {
  if (!path) return "—";
  const p = path.split("?")[0];
  const parts = p.split("/").filter(Boolean);
  // Prefer the last segment that does NOT look like a date (sometimes folders are YYYY-MM-DD)
  for (let i = parts.length - 1; i >= 0; i--) {
    const seg = parts[i];
    if (!/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(seg)) return seg;
  }
  // Fallback to the last segment
  return parts[parts.length - 1] || p;
}

function looksLikeISODate(s?: string | null) {
  return !!s && /^\d{4}-\d{2}-\d{2}/.test(s);
}

function pickCreatedAt(it: Item): string | null {
  // Prefer explicit timestamps.
  return (it.created_at ?? it.created ?? it.uploaded_at) || null;
}

function formatCreated(it: Item): string {
  const createdAt = pickCreatedAt(it);
  if (!createdAt) return "—";
  // If it's just a date (YYYY-MM-DD), show it as-is.
  if (looksLikeISODate(createdAt) && createdAt.length <= 10) return createdAt.slice(0, 10);
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? String(createdAt) : d.toLocaleString();
}

function inferName(it: Item, path: string | null): string {
  // The API sometimes accidentally returns a date string in `name`.
  // If so, prefer the filename inferred from the storage path.
  const candidate = it.name ?? null;
  const fromPath = baseName(path);

  // If name looks like a date, always try to derive a real filename from the path.
  if (looksLikeISODate(candidate)) {
    return fromPath;
  }

  // Otherwise, prefer explicit name, falling back to path-derived.
  return (candidate && candidate.trim().length > 0) ? candidate : fromPath;
}

export default function StoragePage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [previewingPath, setPreviewingPath] = React.useState<string | null>(null);
  const [downloadingPath, setDownloadingPath] = React.useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewName, setPreviewName] = React.useState<string>("File preview");
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [previewIsImage, setPreviewIsImage] = React.useState(false);
  const [previewImageReady, setPreviewImageReady] = React.useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/storage/index", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const next: Item[] = (json.items ?? []).map(normalizeItem);
      setItems(next);
    } catch (e: any) {
      setErr(e?.message || "Failed to load storage");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function closePreview() {
    setPreviewOpen(false);
    setPreviewLoading(false);
    setPreviewError(null);
    setPreviewIsImage(false);
    setPreviewImageReady(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }

  async function openPreview(path: string, name: string) {
    setPreviewingPath(path);
    setPreviewName(name || "File preview");
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewImageReady(false);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const res = await fetch(`/api/storage/preview?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const contentType = blob.type || "";
      setPreviewIsImage(contentType.startsWith("image/"));
      setPreviewUrl(url);
    } catch (e: any) {
      setPreviewError(e?.message || "Preview failed.");
    } finally {
      setPreviewingPath(null);
      setPreviewLoading(false);
    }
  }

  async function downloadFile(path: string, name: string) {
    setDownloadingPath(path);
    setErr(null);
    try {
      const res = await fetch(`/api/storage/download?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setErr(e?.message || "Download failed");
    } finally {
      setDownloadingPath(null);
    }
  }

  async function deleteItem(it: Item) {
    const path = (it.path ?? it.file_path ?? it.signature_path) || null;
    if (!path) return;

    const typeRaw = (it.type ?? "").toLowerCase();
    const isSignature = typeRaw === "signature" || (!!it.signature_path && !it.file_path);
    const kind = isSignature ? "signature" : "file";
    const name = inferName(it, path);

    const confirmed = window.confirm(`Delete this ${kind}?\n\n${name}\n\nThis cannot be undone.`);
    if (!confirmed) return;

    setDeletingItemId(it.id);
    setErr(null);

    try {
      const res = await fetch("/api/storage/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          path,
          bucket: it.bucket ?? undefined,
          type: kind,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");

      setItems((prev) => prev.filter((row) => row.id !== it.id));
      if (previewOpen) {
        closePreview();
      }
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    } finally {
      setDeletingItemId(null);
    }
  }

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const path = (it.path ?? it.file_path ?? it.signature_path) || "";
      const typeRaw = (it.type ?? "").toLowerCase();
      const isSignature = typeRaw === "signature" || (!!it.signature_path && !it.file_path);
      const kind = isSignature ? "signature" : "file";

      const title = (getOnboardingTitle(it) ?? "").toLowerCase();
      const name = inferName(it, path).toLowerCase();
      const onboardingId = (it.onboarding_id ?? "").toLowerCase();
      const filename = baseName(path).toLowerCase();

      return (
        name.includes(q) ||
        filename.includes(q) ||
        title.includes(q) ||
        onboardingId.includes(q) ||
        kind.includes(q)
      );
    });
  }, [items, query]);

  return (
    <div className="space-y-5 px-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Files & signatures</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">A library of uploaded files and saved signatures.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, signatures, onboarding…"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                aria-label="Clear search"
                title="Clear"
              >
                ×
              </button>
            ) : null}
          </div>

          <button
            onClick={load}
            className="w-full rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60 sm:w-auto"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {err ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
          <div className="text-sm font-medium text-[var(--color-text-primary)]">Could not load</div>
          <div className="mt-1 text-sm text-[var(--color-text-muted)]">{err}</div>
        </div>
      ) : null}

      {/* Mobile card list — visible below sm */}
      <div className="flex flex-col gap-3 sm:hidden">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
            {items.length === 0 ? (
              <>
                <div className="text-sm font-medium text-[var(--color-text-primary)]">No files yet</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Uploads and signatures will appear here automatically.</div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-[var(--color-text-primary)]">No matches</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Try a different search term.</div>
              </>
            )}
          </div>
        ) : (
          filteredItems.map((it, idx) => {
            const path = (it.path ?? it.file_path ?? it.signature_path) || null;
            const typeRaw = (it.type ?? "").toLowerCase();
            const isSignature = typeRaw === "signature" || (!!it.signature_path && !it.file_path);
            const kind = isSignature ? "Signature" : "File";
            const name = inferName(it, path);
            const created = formatCreated(it);
            const rowKey = `${it.id || ""}|${path ?? ""}|${it.onboarding_id ?? ""}|${pickCreatedAt(it) ?? ""}|${idx}`;
            const previewBusy = !!path && previewingPath === path;
            const downloadBusy = !!path && downloadingPath === path;
            const deleteBusy = deletingItemId === it.id;

            return (
              <div key={rowKey} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{name}</div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">{created}</div>
                  </div>
                  <span className="shrink-0 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                    {kind}
                  </span>
                </div>
                {path ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-2 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                      onClick={() => openPreview(path, name)}
                      disabled={previewBusy || downloadBusy || deleteBusy}
                    >
                      {previewBusy ? "Previewing..." : "Preview"}
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-2 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                      onClick={() => downloadFile(path, name)}
                      disabled={previewBusy || downloadBusy || deleteBusy}
                    >
                      {downloadBusy ? "Downloading..." : "Download"}
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-[var(--radius-md)] border border-red-200 bg-white py-2 text-xs font-medium text-red-600 shadow-[var(--shadow-sm)] hover:bg-red-50 disabled:opacity-60"
                      onClick={() => void deleteItem(it)}
                      disabled={previewBusy || downloadBusy || deleteBusy}
                    >
                      {deleteBusy ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table — hidden below sm */}
      <div className="hidden sm:block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-[var(--color-bg-subtle)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Name</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Onboarding</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Created</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid grid-cols-12 gap-3">
                        <Skeleton className="col-span-1 h-4 w-full" />
                        <Skeleton className="col-span-4 h-4 w-full" />
                        <Skeleton className="col-span-3 h-4 w-full" />
                        <Skeleton className="col-span-2 h-4 w-full" />
                        <Skeleton className="col-span-2 h-4 w-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    {items.length === 0 ? (
                      <>
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">No files yet</div>
                        <div className="mt-1 text-sm text-[var(--color-text-muted)]">Uploads and signatures will appear here automatically.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">No matches</div>
                        <div className="mt-1 text-sm text-[var(--color-text-muted)]">Try a different search term.</div>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filteredItems.map((it, idx) => {
                  const path = (it.path ?? it.file_path ?? it.signature_path) || null;

                  const typeRaw = (it.type ?? "").toLowerCase();
                  const isSignature =
                    typeRaw === "signature" || (!!it.signature_path && !it.file_path);
                  const kind = isSignature ? "Signature" : "File";

                  const onboardingTitle = getOnboardingTitle(it);
                  const name = inferName(it, path);
                  const created = formatCreated(it);

                  // Use stable unique key when possible.
                  const rowKey = `${it.id || ""}|${path ?? ""}|${it.onboarding_id ?? ""}|${pickCreatedAt(it) ?? ""}|${idx}`;
                  const previewBusy = !!path && previewingPath === path;
                  const downloadBusy = !!path && downloadingPath === path;
                  const deleteBusy = deletingItemId === it.id;

                  return (
                    <tr key={rowKey} className="transition-colors duration-150 hover:bg-[var(--color-bg-subtle)]">
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{kind}</td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                        <div className="flex flex-col">
                          <span className="font-medium">{name}</span>
                          {onboardingTitle ? (
                            <span className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{onboardingTitle}</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {it.onboarding_id ? (
                          <div className="flex flex-col">
                            <a
                              className="underline underline-offset-2"
                              href={`/dashboard/onboardings/${it.onboarding_id}`}
                              title={onboardingTitle ?? it.onboarding_id}
                            >
                              {onboardingTitle ? onboardingTitle : "View onboarding"}
                            </a>
                            <span className="mt-0.5 text-[11px] text-[var(--color-text-muted)] tabular-nums">
                              {it.onboarding_id}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[var(--color-text-muted)] tabular-nums">{created}</td>
                      <td className="px-4 py-3 text-right">
                        {path ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                              onClick={() => openPreview(path, name)}
                              disabled={previewBusy || downloadBusy || deleteBusy}
                            >
                              {previewBusy ? "Previewing..." : "Preview"}
                            </button>
                            <button
                              type="button"
                              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                              onClick={() => downloadFile(path, name)}
                              disabled={previewBusy || downloadBusy || deleteBusy}
                            >
                              {downloadBusy ? "Downloading..." : "Download"}
                            </button>
                            <button
                              type="button"
                              className="rounded-[var(--radius-md)] border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 shadow-[var(--shadow-sm)] hover:bg-red-50 disabled:opacity-60"
                              onClick={() => void deleteItem(it)}
                              disabled={previewBusy || downloadBusy || deleteBusy}
                            >
                              {deleteBusy ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
              <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{previewName}</div>
              <button
                type="button"
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2 py-1 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                onClick={closePreview}
              >
                Close
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto p-4">
              {previewLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : previewError ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text-secondary)]">
                  {previewError}
                </div>
              ) : previewUrl ? (
                previewIsImage ? (
                  <div className="relative min-h-[320px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                    {!previewImageReady ? <Skeleton className="absolute inset-0 h-full w-full" /> : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={previewName}
                      onLoad={() => setPreviewImageReady(true)}
                      className={`max-h-[70vh] w-full object-contain transition-opacity ${previewImageReady ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                ) : (
                  <iframe src={previewUrl} title={previewName} className="h-[70vh] w-full rounded-[var(--radius-md)] border border-[var(--color-border)]" />
                )
              ) : (
                <div className="text-sm text-[var(--color-text-secondary)]">No preview available.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
