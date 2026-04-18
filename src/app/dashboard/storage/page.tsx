"use client";
import * as React from "react";
import Link from "next/link";
import { RefreshCw, Search, Eye, Download, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

type Item = {
  id: string;
  onboarding_id?: string | null;
  onboarding_title?: string | null;
  type?: string | null;
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
  const t = it?.onboarding_title ?? it?.onboardingTitle ?? it?.onboarding?.title ?? null;
  return typeof t === "string" && t.trim().length > 0 ? t : null;
}

function normalizeItem(raw: any): Item {
  return {
    ...raw,
    onboarding_title: getOnboardingTitle(raw),
    onboarding_id:
      raw?.onboarding_id ??
      raw?.onboardingId ??
      raw?.onboarding?.id ??
      raw?.onboarding?.onboarding_id ??
      null,
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
  for (let i = parts.length - 1; i >= 0; i--) {
    const seg = parts[i];
    if (!/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(seg)) return seg;
  }
  return parts[parts.length - 1] || p;
}

function looksLikeISODate(s?: string | null) {
  return !!s && /^\d{4}-\d{2}-\d{2}/.test(s);
}

function pickCreatedAt(it: Item): string | null {
  return (it.created_at ?? it.created ?? it.uploaded_at) || null;
}

function formatCreated(it: Item): string {
  const createdAt = pickCreatedAt(it);
  if (!createdAt) return "—";
  if (looksLikeISODate(createdAt) && createdAt.length <= 10) return createdAt.slice(0, 10);
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? String(createdAt) : d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function inferName(it: Item, path: string | null): string {
  const candidate = it.name ?? null;
  const fromPath = baseName(path);
  if (looksLikeISODate(candidate)) return fromPath;
  return candidate && candidate.trim().length > 0 ? candidate : fromPath;
}

function itemPath(it: Item): string | null {
  return (it.path ?? it.file_path ?? it.signature_path) || null;
}

function itemKind(it: Item): "file" | "signature" {
  const typeRaw = (it.type ?? "").toLowerCase();
  return typeRaw === "signature" || (!!it.signature_path && !it.file_path) ? "signature" : "file";
}

export default function StoragePage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "file" | "signature">("all");
  const [previewingPath, setPreviewingPath] = React.useState<string | null>(null);
  const [downloadingPath, setDownloadingPath] = React.useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Item | null>(null);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewName, setPreviewName] = React.useState<string>("File preview");
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [previewIsImage, setPreviewIsImage] = React.useState(false);
  const [previewImageReady, setPreviewImageReady] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

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

  React.useEffect(() => {
    load();
  }, []);

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
      toast({ title: "Download failed", description: e?.message, variant: "error" });
    } finally {
      setDownloadingPath(null);
    }
  }

  async function deleteItem(it: Item) {
    const path = itemPath(it);
    if (!path) return;

    const kind = itemKind(it);
    setDeletingItemId(it.id);

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
      toast({ title: `${kind === "signature" ? "Signature" : "File"} deleted`, variant: "success" });
      if (previewOpen) closePreview();
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "error" });
    } finally {
      setDeletingItemId(null);
      setConfirmDelete(null);
    }
  }

  const filteredItems = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return items.filter((it) => {
      const kind = itemKind(it);
      if (typeFilter !== "all" && kind !== typeFilter) return false;
      if (!q) return true;
      const path = itemPath(it) || "";
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
  }, [items, debouncedQuery, typeFilter]);

  const columns: Column<Item>[] = [
    {
      key: "type",
      header: "Type",
      width: "100px",
      sortValue: (r) => itemKind(r),
      render: (r) => {
        const kind = itemKind(r);
        return <Tag tone={kind === "signature" ? "accent" : "info"}>{kind === "signature" ? "Signature" : "File"}</Tag>;
      },
    },
    {
      key: "name",
      header: "Name",
      sortValue: (r) => inferName(r, itemPath(r)).toLowerCase(),
      render: (r) => {
        const path = itemPath(r);
        const name = inferName(r, path);
        const title = getOnboardingTitle(r);
        return (
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{name}</div>
            {title && <div className="truncate text-xs text-[var(--color-text-muted)]">{title}</div>}
          </div>
        );
      },
    },
    {
      key: "onboarding",
      header: "Onboarding",
      hideOnMobile: true,
      render: (r) => {
        const title = getOnboardingTitle(r);
        if (!r.onboarding_id) return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
        return (
          <Link
            href={`/dashboard/onboardings/${r.onboarding_id}`}
            className="truncate text-sm text-[var(--color-accent)] hover:underline"
            title={title ?? r.onboarding_id}
            onClick={(e) => e.stopPropagation()}
          >
            {title ? title : "View onboarding"}
          </Link>
        );
      },
    },
    {
      key: "created",
      header: "Created",
      hideOnMobile: true,
      width: "130px",
      align: "right",
      sortValue: (r) => {
        const v = pickCreatedAt(r);
        return v ? new Date(v).getTime() : 0;
      },
      render: (r) => (
        <span className="text-xs tabular-nums text-[var(--color-text-muted)]">{formatCreated(r)}</span>
      ),
    },
  ];

  const rowActions = (it: Item) => {
    const path = itemPath(it);
    if (!path) return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
    const name = inferName(it, path);
    const previewBusy = previewingPath === path;
    const downloadBusy = downloadingPath === path;
    const deleteBusy = deletingItemId === it.id;
    const busy = previewBusy || downloadBusy || deleteBusy;
    return (
      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => openPreview(path, name)}
          disabled={busy}
          title="Preview"
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => downloadFile(path, name)}
          disabled={busy}
          title="Download"
        >
          <Download className="h-3 w-3" />
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setConfirmDelete(it)}
          disabled={busy}
          title="Delete"
          className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files, signatures, onboardings…"
          className="pl-9"
        />
      </div>
      <Select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value as any)}
        className="sm:w-40"
      >
        <option value="all">All types</option>
        <option value="file">Files</option>
        <option value="signature">Signatures</option>
      </Select>
      <div className="text-xs text-[var(--color-text-muted)] sm:ml-2">
        {loading ? "Loading…" : `${filteredItems.length} item${filteredItems.length === 1 ? "" : "s"}`}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & signatures"
        description="A library of uploaded files and saved signatures."
        actions={
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={load}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      {err && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {err}
        </div>
      )}

      <DataTable<Item>
        columns={columns}
        data={filteredItems}
        getRowId={(r) => `${r.id}-${itemPath(r) ?? ""}`}
        loading={loading}
        toolbar={toolbar}
        rowActions={rowActions}
        defaultSort={{ key: "created", dir: "desc" }}
        empty={
          <div className="py-12 text-center">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">
              {items.length === 0 ? "No files yet" : "No matches"}
            </div>
            <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {items.length === 0
                ? "Uploads and signatures will appear here automatically."
                : "Try a different search term."}
            </div>
          </div>
        }
      />

      <Modal
        open={previewOpen}
        onClose={closePreview}
        title={previewName}
        size="xl"
        footer={
          <Button variant="secondary" onClick={closePreview}>
            Close
          </Button>
        }
      >
        <div className="max-h-[70vh] overflow-auto">
          {previewLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : previewError ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text-secondary)]">
              {previewError}
            </div>
          ) : previewUrl ? (
            previewIsImage ? (
              <div className="relative min-h-[320px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                {!previewImageReady && <Skeleton className="absolute inset-0 h-full w-full" />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={previewName}
                  onLoad={() => setPreviewImageReady(true)}
                  className={`max-h-[65vh] w-full object-contain transition-opacity ${
                    previewImageReady ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            ) : (
              <iframe
                src={previewUrl}
                title={previewName}
                className="h-[65vh] w-full rounded-[var(--radius-md)] border border-[var(--color-border)]"
              />
            )
          ) : (
            <div className="text-sm text-[var(--color-text-secondary)]">No preview available.</div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteItem(confirmDelete);
        }}
        title={`Delete ${confirmDelete ? itemKind(confirmDelete) : "item"}?`}
        description={
          confirmDelete ? (
            <>
              This permanently deletes <b>{inferName(confirmDelete, itemPath(confirmDelete))}</b> and cannot be
              undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
