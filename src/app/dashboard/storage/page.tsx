"use client";
import * as React from "react";

type Item = {
  id: string;
  onboarding_id?: string | null;
  onboarding_title?: string | null;
  // API may return either a normalized `type`/`path`/`name` shape,
  // or the legacy `file_path`/`signature_path` shape.
  type?: string | null; // e.g. "file" | "signature"
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Files & signatures</h1>
          <p className="mt-1 text-sm text-zinc-500">A library of uploaded files and saved signatures.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, signatures, onboarding…"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-zinc-500 hover:text-zinc-700"
                aria-label="Clear search"
                title="Clear"
              >
                ×
              </button>
            ) : null}
          </div>

          <button
            onClick={load}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {err ? (
          <div className="p-4">
            <div className="text-sm font-medium text-zinc-900">Could not load</div>
            <div className="mt-1 text-sm text-zinc-500">{err}</div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Type</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Name</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Onboarding</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Created</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 rounded bg-zinc-100" /></td></tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    {items.length === 0 ? (
                      <>
                        <div className="text-sm font-medium text-zinc-900">No files yet</div>
                        <div className="mt-1 text-sm text-zinc-500">Uploads and signatures will appear here automatically.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-zinc-900">No matches</div>
                        <div className="mt-1 text-sm text-zinc-500">Try a different search term.</div>
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

                  return (
                    <tr key={rowKey} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-sm text-zinc-700">{kind}</td>
                      <td className="px-4 py-3 text-sm text-zinc-900">
                        <div className="flex flex-col">
                          <span className="font-medium">{name}</span>
                          {onboardingTitle ? (
                            <span className="mt-0.5 text-[11px] text-zinc-500">{onboardingTitle}</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700">
                        {it.onboarding_id ? (
                          <div className="flex flex-col">
                            <a
                              className="underline underline-offset-2"
                              href={`/dashboard/onboardings/${it.onboarding_id}`}
                              title={onboardingTitle ?? it.onboarding_id}
                            >
                              {onboardingTitle ? onboardingTitle : "View onboarding"}
                            </a>
                            <span className="mt-0.5 text-[11px] text-zinc-400 tabular-nums">
                              {it.onboarding_id}
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-500 tabular-nums">{created}</td>
                      <td className="px-4 py-3 text-right">
                        {path ? (
                          <div className="inline-flex items-center gap-2">
                            <a
                              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              href={`/api/storage/preview?path=${encodeURIComponent(path)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Preview
                            </a>
                            <a
                              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
                              href={`/api/storage/download?path=${encodeURIComponent(path)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
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
    </div>
  );
}