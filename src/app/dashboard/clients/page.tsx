"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-bg-muted)]/70 ${className}`} />;
}

type Client = {
  id: string;
  email: string;
  full_name?: string | null;
  name?: string | null;
  created_at?: string;
  updated_at?: string;
};

function displayName(c: Client) {
  const n = (c.full_name ?? c.name ?? "").trim();
  return n.length ? n : "Unnamed";
}

function formatDate(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function isValidEmail(email: string) {
  // pragmatic client-side check (server should still validate)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);

  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [creatingClient, setCreatingClient] = React.useState(false);
  const [savingClientId, setSavingClientId] = React.useState<string | null>(null);
  const [deletingClientId, setDeletingClientId] = React.useState<string | null>(null);
  const [copyingEmail, setCopyingEmail] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const n = displayName(c).toLowerCase();
      const e = (c.email ?? "").toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [clients, query]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clients", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to load clients");
      const list = Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json?.clients)
          ? json.clients
          : Array.isArray(json)
            ? json
            : [];
      setClients(list as Client[]);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setEmail("");
    setFullName("");
    setFormErr(null);
    setStatus(null);
    setModalOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setEmail(c.email ?? "");
    setFullName((c.full_name ?? c.name ?? "").trim());
    setFormErr(null);
    setStatus(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setFormErr(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    setStatus(null);

    const em = email.trim();
    const nm = fullName.trim();

    if (!nm) {
      setFormErr("Client name is required.");
      return;
    }
    if (!em) {
      setFormErr("Client email is required.");
      return;
    }
    if (!isValidEmail(em)) {
      setFormErr("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    if (editing?.id) setSavingClientId(editing.id);
    else setCreatingClient(true);

    try {
      if (editing?.id) {
        const payload = { id: editing.id, email: em, full_name: nm };

        let res = await fetch(`/api/clients/${editing.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: em, full_name: nm }),
        });

        if (res.status === 404 || res.status === 405) {
          res = await fetch("/api/clients", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Save failed");

        const updated = (json?.item ?? {
          ...editing,
          email: em,
          full_name: nm,
          name: nm,
          updated_at: new Date().toISOString(),
        }) as Client;

        setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
        setStatus("Saved.");
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: em, full_name: nm }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Create failed");

        const created = (json?.item ?? {
          id: `temp-${Date.now()}`,
          email: em,
          full_name: nm,
          name: nm,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }) as Client;

        setClients((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
        setStatus("Created.");
      }

      setModalOpen(false);
      setEditing(null);
      setEmail("");
      setFullName("");
    } catch (e: any) {
      setFormErr(e?.message ?? "Unknown error");
    } finally {
      setSaving(false);
      setSavingClientId(null);
      setCreatingClient(false);
    }
  }

  async function onDelete(c: Client) {
    const ok = window.confirm(`Delete client "${displayName(c)}" (${c.email})? This can't be undone.`);
    if (!ok) return;
    setStatus(null);
    setError(null);
    setDeletingClientId(c.id);

    try {
      let res = await fetch(`/api/clients/${c.id}`, { method: "DELETE" });
      if (res.status === 404 || res.status === 405) {
        res = await fetch("/api/clients", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id: c.id }),
        });
      }
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");

      setClients((prev) => prev.filter((x) => x.id !== c.id));
      setStatus("Deleted.");
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setDeletingClientId(null);
    }
  }

  async function copy(text: string) {
    setCopyingEmail(text);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard.");
      window.setTimeout(() => setStatus(null), 1500);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setStatus("Copied to clipboard.");
        window.setTimeout(() => setStatus(null), 1500);
      } catch {
        setStatus("Couldn't copy.");
        window.setTimeout(() => setStatus(null), 1500);
      }
    } finally {
      setCopyingEmail(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Clients</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage client records used across onboardings.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => load()}
            className="w-full sm:w-auto rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="w-full sm:w-auto rounded-full bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
            disabled={creatingClient}
          >
            {creatingClient ? "Creating..." : "New client"}
          </button>
        </div>
      </div>

      {(error || status) && (
        <div
          className={`rounded-[var(--radius-md)] border p-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-900" : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"}`}
        >
          {error ?? status}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription>
            Search clients, edit details, copy emails, and keep names up to date (names are required for onboarding).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <label className="sr-only" htmlFor="clientSearch">
                Search
              </label>
              <input
                id="clientSearch"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>
            <div className="text-sm text-[var(--color-text-muted)]">
              {loading ? "Loading…" : `${filtered.length} of ${clients.length} clients`}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
            <div className="min-w-[480px]">
            <div className="grid grid-cols-12 gap-2 bg-[var(--color-bg-subtle)] px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              <div className="col-span-4">Name</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2 hidden md:block">Updated</div>
              <div className="col-span-4 md:col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="space-y-3 px-3 py-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <div className="text-sm font-medium text-[var(--color-text-primary)]">No clients found</div>
                <div className="mt-1 text-sm text-[var(--color-text-muted)]">Try a different search or create a new client.</div>
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-4 rounded-full bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
                >
                  New client
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {filtered.map((c) => {
                  const nm = displayName(c);
                  const missingName = nm === "Unnamed";
                  const rowSaving = savingClientId === c.id;
                  const rowDeleting = deletingClientId === c.id;
                  const rowBusy = rowSaving || rowDeleting;
                  const rowCopying = copyingEmail === c.email;
                  return (
                    <li key={c.id} className="grid grid-cols-12 items-center gap-2 px-3 py-3">
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-[var(--color-text-primary)]">{nm}</div>
                          {missingName ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Missing name
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-text-muted)] md:hidden">Updated: {formatDate(c.updated_at)}</div>
                      </div>

                      <div className="col-span-4">
                        <button
                          type="button"
                          className="text-left text-sm text-[var(--color-text-primary)] hover:underline"
                          onClick={() => copy(c.email)}
                          title="Copy email"
                        >
                          {rowCopying ? "Copying..." : c.email}
                        </button>
                      </div>

                      <div className="col-span-2 hidden text-sm text-[var(--color-text-secondary)] md:block">{formatDate(c.updated_at)}</div>

                      <div className="col-span-4 md:col-span-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                          disabled={rowBusy}
                        >
                          {rowSaving ? "Saving..." : "Edit"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(c)}
                          className="rounded-full border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                          disabled={rowBusy}
                        >
                          {rowDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <div className="text-base font-semibold text-[var(--color-text-primary)]">{editing ? "Edit client" : "New client"}</div>
                <div className="mt-0.5 text-sm text-[var(--color-text-muted)]">
                  Names are required. These records are used when creating and sending onboardings.
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 px-5 py-4">
              {formErr ? (
                <div className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 p-3 text-sm text-red-900">{formErr}</div>
              ) : null}

              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="clientName">
                  Client full name <span className="text-red-600">*</span>
                </label>
                <input
                  id="clientName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)]"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="clientEmail">
                  Client email <span className="text-red-600">*</span>
                </label>
                <input
                  id="clientEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)]"
                  required
                  inputMode="email"
                />
                <div className="text-xs text-[var(--color-text-muted)]">Clicking an email in the list copies it to clipboard.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? (editing ? "Saving..." : "Creating...") : editing ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
