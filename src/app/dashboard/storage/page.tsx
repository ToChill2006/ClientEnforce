"use client";
import * as React from "react";
import Link from "next/link";
import { RefreshCw, Eye, Download, Trash2, ChevronRight, FileText, PenLine, FolderOpen, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/status-badge";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type Item = {
  id: string;
  onboarding_id?: string | null;
  onboarding_title?: string | null;
  event_id?: string | null;
  event_name?: string | null;
  type?: string | null;
  bucket?: string | null;
  path?: string | null;
  name?: string | null;
  file_path?: string | null;
  signature_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function itemPath(it: Item): string | null {
  return (it.path ?? it.file_path ?? it.signature_path) || null;
}

function itemKind(it: Item): "file" | "signature" {
  const typeRaw = (it.type ?? "").toLowerCase();
  return typeRaw === "signature" || (!!it.signature_path && !it.file_path) ? "signature" : "file";
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

function inferName(it: Item, path: string | null): string {
  const candidate = it.name ?? null;
  const fromPath = baseName(path);
  if (looksLikeISODate(candidate)) return fromPath;
  return candidate && candidate.trim().length > 0 ? candidate : fromPath;
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function normalizeItem(raw: any): Item {
  return {
    ...raw,
    onboarding_title: raw?.onboarding_title ?? null,
    onboarding_id: raw?.onboarding_id ?? null,
    event_id: raw?.event_id ?? null,
    event_name: raw?.event_name ?? null,
    created_at: raw?.created_at ?? null,
    updated_at: raw?.updated_at ?? null,
    file_path: raw?.file_path ?? null,
    signature_path: raw?.signature_path ?? null,
    path: raw?.path ?? null,
    name: raw?.name ?? null,
    type: raw?.type ?? null,
    bucket: raw?.bucket ?? null,
  };
}

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  it,
  onPreview,
  onDownload,
  onDelete,
  previewingPath,
  downloadingPath,
  deletingId,
}: {
  it: Item;
  onPreview: (path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
  onDelete: (it: Item) => void;
  previewingPath: string | null;
  downloadingPath: string | null;
  deletingId: string | null;
}) {
  const path = itemPath(it);
  const name = inferName(it, path);
  const kind = itemKind(it);
  const busy = previewingPath === path || downloadingPath === path || deletingId === it.id;
  const date = formatDate(it.updated_at ?? it.created_at);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-bg-hover)] transition-colors group">
      <span className="shrink-0 text-[var(--color-text-muted)]">
        {kind === "signature" ? <PenLine className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <span className="truncate text-sm text-[var(--color-text-primary)]">{name}</span>
        {date && <span className="ml-2 text-xs text-[var(--color-text-muted)]">{date}</span>}
      </div>
      <Tag tone={kind === "signature" ? "accent" : "info"} className="shrink-0">
        {kind === "signature" ? "Signature" : "File"}
      </Tag>
      <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {path && (
          <>
            <Button size="xs" variant="ghost" onClick={() => onPreview(path, name)} disabled={busy} title="Preview">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button size="xs" variant="ghost" onClick={() => onDownload(path, name)} disabled={busy} title="Download">
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => onDelete(it)}
              disabled={busy}
              title="Delete"
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Onboarding accordion ──────────────────────────────────────────────────────

function OnboardingSection({
  onboardingId,
  title,
  files,
  onPreview,
  onDownload,
  onDelete,
  previewingPath,
  downloadingPath,
  deletingId,
}: {
  onboardingId: string;
  title: string;
  files: Item[];
  onPreview: (path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
  onDelete: (it: Item) => void;
  previewingPath: string | null;
  downloadingPath: string | null;
  deletingId: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <ChevronRight
          className={cn("h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] transition-transform", open && "rotate-90")}
        />
        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        <span className="flex-1 truncate text-sm font-medium text-[var(--color-text-primary)]">{title}</span>
        <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{files.length} file{files.length !== 1 ? "s" : ""}</span>
        <Link
          href={`/dashboard/onboardings/${onboardingId}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-xs text-[var(--color-accent)] hover:underline ml-1"
        >
          View →
        </Link>
      </button>
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] pl-8">
          {files.map((it) => (
            <FileRow
              key={it.id}
              it={it}
              onPreview={onPreview}
              onDownload={onDownload}
              onDelete={onDelete}
              previewingPath={previewingPath}
              downloadingPath={downloadingPath}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event accordion ───────────────────────────────────────────────────────────

function EventSection({
  eventName,
  onboardings,
  onPreview,
  onDownload,
  onDelete,
  previewingPath,
  downloadingPath,
  deletingId,
}: {
  eventName: string;
  onboardings: { id: string; title: string; files: Item[] }[];
  onPreview: (path: string, name: string) => void;
  onDownload: (path: string, name: string) => void;
  onDelete: (it: Item) => void;
  previewingPath: string | null;
  downloadingPath: string | null;
  deletingId: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const totalFiles = onboardings.reduce((s, o) => s + o.files.length, 0);

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 bg-[var(--color-bg-subtle)] px-4 py-3 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <ChevronRight
          className={cn("h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform", open && "rotate-90")}
        />
        <CalendarDays className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
        <span className="flex-1 truncate text-sm font-semibold text-[var(--color-text-primary)]">{eventName}</span>
        <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
          {onboardings.length} exhibitor{onboardings.length !== 1 ? "s" : ""} · {totalFiles} file{totalFiles !== 1 ? "s" : ""}
        </span>
      </button>
      {open && (
        <div className="divide-y divide-[var(--color-border)]">
          {onboardings.map((ob) => (
            <OnboardingSection
              key={ob.id}
              onboardingId={ob.id}
              title={ob.title}
              files={ob.files}
              onPreview={onPreview}
              onDownload={onDownload}
              onDelete={onDelete}
              previewingPath={previewingPath}
              downloadingPath={downloadingPath}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function StoragePage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [isEnterprise, setIsEnterprise] = React.useState(false);
  const [mode, setMode] = React.useState<"events" | "solo">("solo");

  const [previewingPath, setPreviewingPath] = React.useState<string | null>(null);
  const [downloadingPath, setDownloadingPath] = React.useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Item | null>(null);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [previewName, setPreviewName] = React.useState("File preview");
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
      setItems((json.items ?? []).map(normalizeItem));
    } catch (e: any) {
      setErr(e?.message || "Failed to load storage");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    fetch("/api/events", { cache: "no-store" })
      .then((r) => { if (r.ok) { setIsEnterprise(true); setMode("events"); } })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  function closePreview() {
    setPreviewOpen(false);
    setPreviewLoading(false);
    setPreviewError(null);
    setPreviewIsImage(false);
    setPreviewImageReady(false);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  }

  async function openPreview(path: string, name: string) {
    setPreviewingPath(path);
    setPreviewName(name || "File preview");
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewImageReady(false);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    try {
      const res = await fetch(`/api/storage/preview?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Preview failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewIsImage(blob.type.startsWith("image/"));
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
    setDeletingItemId(it.id);
    try {
      const res = await fetch("/api/storage/delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path, bucket: it.bucket ?? undefined, type: itemKind(it) }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      setItems((prev) => prev.filter((r) => r.id !== it.id));
      toast({ title: `${itemKind(it) === "signature" ? "Signature" : "File"} deleted`, variant: "success" });
      if (previewOpen) closePreview();
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "error" });
    } finally {
      setDeletingItemId(null);
      setConfirmDelete(null);
    }
  }

  // ── Build tree structures ──────────────────────────────────────────────────

  const eventItems = items.filter((it) => it.event_id);
  const soloItems = items.filter((it) => !it.event_id);

  // Events → onboardings → files
  const eventGroups = React.useMemo(() => {
    const byEvent = new Map<string, { name: string; onboardings: Map<string, { title: string; files: Item[] }> }>();
    for (const it of eventItems) {
      const evId = it.event_id!;
      const evName = it.event_name ?? evId;
      if (!byEvent.has(evId)) byEvent.set(evId, { name: evName, onboardings: new Map() });
      const ev = byEvent.get(evId)!;
      const obId = it.onboarding_id ?? "unknown";
      const obTitle = it.onboarding_title ?? "Untitled";
      if (!ev.onboardings.has(obId)) ev.onboardings.set(obId, { title: obTitle, files: [] });
      ev.onboardings.get(obId)!.files.push(it);
    }
    return Array.from(byEvent.entries()).map(([id, ev]) => ({
      id,
      name: ev.name,
      onboardings: Array.from(ev.onboardings.entries()).map(([obId, ob]) => ({ id: obId, title: ob.title, files: ob.files })),
    }));
  }, [eventItems]);

  // Solo onboardings → files
  const soloGroups = React.useMemo(() => {
    const byOb = new Map<string, { title: string; files: Item[] }>();
    for (const it of soloItems) {
      const obId = it.onboarding_id ?? "unknown";
      const obTitle = it.onboarding_title ?? "Untitled";
      if (!byOb.has(obId)) byOb.set(obId, { title: obTitle, files: [] });
      byOb.get(obId)!.files.push(it);
    }
    return Array.from(byOb.entries()).map(([id, ob]) => ({ id, title: ob.title, files: ob.files }));
  }, [soloItems]);

  const sharedProps = { onPreview: openPreview, onDownload: downloadFile, onDelete: setConfirmDelete, previewingPath, downloadingPath, deletingId: deletingItemId };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & Signatures"
        description="Browse uploaded files and signatures by event or onboarding."
        actions={
          <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={load} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {err && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {err}
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {(["events", "solo"] as const).filter((m) => m === "solo" || isEnterprise).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              mode === m
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {m === "events" ? (
              <><CalendarDays className="h-3.5 w-3.5" /> Bulk Onboardings (Events)</>
            ) : (
              "Solo Onboardings"
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : mode === "events" ? (
        <div className="space-y-3">
          {eventGroups.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">No event files yet.</div>
          ) : (
            eventGroups.map((ev) => (
              <EventSection key={ev.id} eventName={ev.name} onboardings={ev.onboardings} {...sharedProps} />
            ))
          )}
        </div>
      ) : (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border)]">
          {soloGroups.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">No solo onboarding files yet.</div>
          ) : (
            soloGroups.map((ob) => (
              <OnboardingSection key={ob.id} onboardingId={ob.id} title={ob.title} files={ob.files} {...sharedProps} />
            ))
          )}
        </div>
      )}

      {/* Preview modal */}
      <Modal open={previewOpen} onClose={closePreview} title={previewName} size="xl" footer={<Button variant="secondary" onClick={closePreview}>Close</Button>}>
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
                <img src={previewUrl} alt={previewName} onLoad={() => setPreviewImageReady(true)} className={`max-h-[65vh] w-full object-contain transition-opacity ${previewImageReady ? "opacity-100" : "opacity-0"}`} />
              </div>
            ) : (
              <iframe src={previewUrl} title={previewName} className="h-[65vh] w-full rounded-[var(--radius-md)] border border-[var(--color-border)]" />
            )
          ) : (
            <div className="text-sm text-[var(--color-text-secondary)]">No preview available.</div>
          )}
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => { if (confirmDelete) await deleteItem(confirmDelete); }}
        title={`Delete ${confirmDelete ? itemKind(confirmDelete) : "item"}?`}
        description={confirmDelete ? <>This permanently deletes <b>{inferName(confirmDelete, itemPath(confirmDelete))}</b> and cannot be undone.</> : null}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
