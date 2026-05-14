"use client";

import * as React from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2, Copy, Layers } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";

type PageTab = "clients" | "types";

type ClientType = {
  id: string;
  name: string;
  description: string | null;
  template_id: string | null;
  templates?: { name: string } | null;
};

function ClientTypesTab() {
  const { toast } = useToast();
  const [types, setTypes] = React.useState<ClientType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ClientType | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [templateId, setTemplateId] = React.useState<string>("");
  const [templates, setTemplates] = React.useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<ClientType | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/client-types", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      setTypes(Array.isArray(json?.client_types) ? json.client_types : []);
    } catch { /* non-fatal */ } finally { setLoading(false); }
  }

  async function loadTemplates() {
    try {
      const res = await fetch("/api/templates", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      setTemplates(Array.isArray(json?.items) ? json.items.map((t: any) => ({ id: t.id, name: t.name })) : []);
    } catch { /* non-fatal */ }
  }

  React.useEffect(() => { load(); loadTemplates(); }, []);

  function openCreate() { setEditing(null); setName(""); setDescription(""); setTemplateId(""); setFormErr(null); setModalOpen(true); }
  function openEdit(t: ClientType) { setEditing(t); setName(t.name); setDescription(t.description ?? ""); setTemplateId(t.template_id ?? ""); setFormErr(null); setModalOpen(true); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setFormErr("Name is required."); return; }
    setSaving(true); setFormErr(null);
    try {
      const res = await fetch(editing ? `/api/client-types/${editing.id}` : "/api/client-types", {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null, default_template_id: templateId || null }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast({ title: editing ? "Client type updated" : "Client type created", variant: "success" });
      setModalOpen(false); load();
    } catch (e: any) { setFormErr(e?.message || "Unknown error"); }
    finally { setSaving(false); }
  }

  async function onDelete(t: ClientType) {
    try {
      const res = await fetch(`/api/client-types/${t.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      toast({ title: "Client type deleted", variant: "success" });
      setConfirmDelete(null); load();
    } catch (e: any) { toast({ title: "Delete failed", description: e?.message, variant: "error" }); }
  }

  const columns: Column<ClientType>[] = [
    { key: "name", header: "Name", sortValue: (r) => r.name.toLowerCase(),
      render: (r) => <span className="text-sm font-medium text-[var(--color-text-primary)]">{r.name}</span> },
    { key: "template", header: "Template", hideOnMobile: true,
      render: (r) => r.templates?.name ? <Tag tone="accent">{r.templates.name}</Tag> : <span className="text-xs text-[var(--color-text-muted)]">No template</span> },
    { key: "description", header: "Description", hideOnMobile: true,
      render: (r) => <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{r.description || "—"}</span> },
  ];

  const rowActions = (t: ClientType) => (
    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      <Button size="xs" variant="ghost" onClick={() => openEdit(t)} title="Edit"><Pencil className="h-3 w-3" /></Button>
      <Button size="xs" variant="ghost" onClick={() => setConfirmDelete(t)} title="Delete"
        className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"><Trash2 className="h-3 w-3" /></Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">Client types group exhibitors and link to onboarding templates. Only admins can create or delete types.</p>
        <Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>New type</Button>
      </div>
      <DataTable<ClientType> columns={columns} data={types} getRowId={(r) => r.id} loading={loading} rowActions={rowActions}
        defaultSort={{ key: "name", dir: "asc" }}
        empty={
          <div className="py-10 text-center">
            <Layers className="mx-auto mb-2 h-7 w-7 text-[var(--color-text-muted)]" />
            <div className="text-sm font-medium text-[var(--color-text-primary)]">No client types yet</div>
            <div className="mt-1 text-xs text-[var(--color-text-secondary)]">Create a type to group exhibitors by category.</div>
            <div className="mt-3 flex justify-center"><Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>New type</Button></div>
          </div>
        }
      />
      <Modal open={modalOpen} onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit client type" : "New client type"} size="sm"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button><Button onClick={onSubmit as any} loading={saving}>{editing ? "Save" : "Create"}</Button></>}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Name" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Floorspace Only" autoFocus /></FormField>
          <FormField label="Template">
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
            >
              <option value="">— No template —</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Description"><Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description…" /></FormField>
          {formErr && <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">{formErr}</div>}
          <button type="submit" className="hidden" />
        </form>
      </Modal>
      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}
        onConfirm={async () => { if (confirmDelete) await onDelete(confirmDelete); }}
        title="Delete client type?"
        description={confirmDelete ? <>Permanently delete <b>{confirmDelete.name}</b>? This may affect existing onboardings.</> : null}
        confirmLabel="Delete" destructive />
    </div>
  );
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
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ClientsPage() {
  const { toast } = useToast();
  const [pageTab, setPageTab] = React.useState<PageTab>("clients");
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);

  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savingClientId, setSavingClientId] = React.useState<string | null>(null);
  const [deletingClientId, setDeletingClientId] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Client | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const n = displayName(c).toLowerCase();
      const e = (c.email ?? "").toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [clients, debouncedQuery]);

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
    setModalOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setEmail(c.email ?? "");
    setFullName((c.full_name ?? c.name ?? "").trim());
    setFormErr(null);
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

    const em = email.trim();
    const nm = fullName.trim();

    if (!nm) return setFormErr("Client name is required.");
    if (!em) return setFormErr("Client email is required.");
    if (!isValidEmail(em)) return setFormErr("Please enter a valid email address.");

    setSaving(true);
    if (editing?.id) setSavingClientId(editing.id);

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
        toast({ title: "Client saved", variant: "success" });
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
        toast({ title: "Client created", variant: "success" });
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
    }
  }

  async function onDelete(c: Client) {
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
      toast({ title: "Client deleted", variant: "success" });
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "error" });
    } finally {
      setDeletingClientId(null);
      setConfirmDelete(null);
    }
  }

  async function copyEmail(emailText: string) {
    try {
      await navigator.clipboard.writeText(emailText);
      toast({ title: "Email copied", variant: "success" });
    } catch {
      toast({ title: "Copy failed", variant: "error" });
    }
  }

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: "Name",
      sortValue: (r) => displayName(r).toLowerCase(),
      render: (r) => {
        const nm = displayName(r);
        const missingName = nm === "Unnamed";
        return (
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate text-sm font-medium text-[var(--color-text-primary)]">{nm}</span>
            {missingName && <Tag tone="warning">Missing name</Tag>}
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      sortValue: (r) => (r.email || "").toLowerCase(),
      render: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void copyEmail(r.email);
          }}
          className="inline-flex items-center gap-1.5 truncate text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          title="Copy email"
        >
          <Copy className="h-3 w-3 opacity-60" />
          <span className="truncate">{r.email}</span>
        </button>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      hideOnMobile: true,
      width: "140px",
      align: "right",
      sortValue: (r) => new Date(r.updated_at || r.created_at || 0).getTime(),
      render: (r) => (
        <span className="text-xs tabular-nums text-[var(--color-text-muted)]">
          {formatDate(r.updated_at || r.created_at)}
        </span>
      ),
    },
  ];

  const rowActions = (c: Client) => {
    const rowSaving = savingClientId === c.id;
    const rowDeleting = deletingClientId === c.id;
    const rowBusy = rowSaving || rowDeleting;
    return (
      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button size="xs" variant="ghost" onClick={() => openEdit(c)} disabled={rowBusy} title="Edit">
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setConfirmDelete(c)}
          disabled={rowBusy}
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
          placeholder="Search by name or email…"
          className="pl-9"
        />
      </div>
      <div className="text-xs text-[var(--color-text-muted)] sm:ml-2">
        {loading ? "Loading…" : `${filtered.length} of ${clients.length}`}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage client records used across onboardings."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={() => load()}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>
              New client
            </Button>
          </>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-1">
        {(["clients", "types"] as PageTab[]).map((t) => (
          <button key={t} onClick={() => setPageTab(t)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
              pageTab === t ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t === "clients" ? "Clients" : "Client Types"}
          </button>
        ))}
      </div>

      {pageTab === "types" && <ClientTypesTab />}

      {pageTab === "clients" && <>
      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <DataTable<Client>
        columns={columns}
        data={filtered}
        getRowId={(r) => r.id}
        loading={loading}
        toolbar={toolbar}
        rowActions={rowActions}
        defaultSort={{ key: "updated", dir: "desc" }}
        csvExport={{ filename: "clients" }}
        empty={
          <div className="py-12 text-center">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">No clients found</div>
            <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Try a different search or create a new client.
            </div>
            <div className="mt-4 flex justify-center">
              <Button iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={openCreate}>
                New client
              </Button>
            </div>
          </div>
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit client" : "New client"}
        description="Names are required. These records are used when creating and sending onboardings."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={onSubmit as any} loading={saving}>
              {editing ? "Save" : "Create"}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Client full name" required>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              autoFocus
            />
          </FormField>

          <FormField label="Client email" required hint="Clicking an email in the list copies it to clipboard.">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com"
              inputMode="email"
            />
          </FormField>

          {formErr && (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">
              {formErr}
            </div>
          )}

          <button type="submit" className="hidden" />
        </form>
      </Modal>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await onDelete(confirmDelete);
        }}
        title="Delete client?"
        description={
          confirmDelete ? (
            <>
              This permanently deletes <b>{displayName(confirmDelete)}</b> ({confirmDelete.email}) and cannot be
              undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
      />
      </>}
    </div>
  );
}
