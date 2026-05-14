"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Users,
  LayoutTemplate,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Trash2,
  Send,
  UserCheck,
  Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, FormGrid } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Modal } from "@/components/ui/modal";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type EventData = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string;
  location: string | null;
  status: string;
  exhibitor_count?: number;
};

type ExhibitorRow = {
  id: string;
  title: string | null;
  client_name: string | null;
  client_email: string | null;
  company_name: string | null;
  client_type_name: string | null;
  current_phase: number | null;
  phase_status: string | null;
  deadline: string | null;
  updated_at: string | null;
};

type CsvRow = {
  email: string;
  full_name: string;
  client_type_name: string;
  company_name?: string;
  _valid: boolean;
  _error?: string;
  _template?: string;
};

type ClientType = { id: string; name: string; templates?: { name: string } | null };
type TeamMember = { user_id: string; email: string | null; full_name: string | null };

type Tab = "add" | "exhibitors" | "templates";

function PhaseStatusBadge({ status }: { status: string | null }) {
  if (!status) return <Tag>—</Tag>;
  const map: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
    locked: "neutral",
    in_progress: "info",
    awaiting_review: "warning",
    approved: "success",
    rejected: "danger",
  };
  const label = status.replace("_", " ");
  return <Tag tone={map[status] ?? "neutral"}>{label}</Tag>;
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function SingleExhibitorForm({
  eventId,
  clientTypes,
  onAdded,
}: {
  eventId: string;
  clientTypes: ClientType[];
  onAdded: () => void;
}) {
  const { toast } = useToast();
  const [useExisting, setUseExisting] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [clientTypeId, setClientTypeId] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [existingClients, setExistingClients] = React.useState<Array<{ id: string; email: string; full_name?: string | null; company_name?: string | null }>>([]);

  React.useEffect(() => {
    fetch("/api/clients", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((j) => { if (j) setExistingClients(j.items ?? j.clients ?? []); })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientTypeId) { setErr("Client type is required."); return; }
    const ct = clientTypes.find((c) => c.id === clientTypeId);
    if (!ct) { setErr("Select a client type."); return; }

    if (useExisting) {
      if (!selectedClientId) { setErr("Select an existing client."); return; }
    } else {
      if (!fullName.trim()) { setErr("Full name is required."); return; }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Valid email is required."); return; }
    }

    setErr(null); setSaving(true);
    try {
      if (useExisting) {
        const res = await fetch("/api/onboardings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            client: { id: selectedClientId },
            event_id: eventId,
            client_type_id: clientTypeId,
            company_name: companyName.trim() || null,
            title: fullName.trim() ? `${fullName.trim()} — Exhibitor` : "Exhibitor",
          }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Failed to add exhibitor");
      } else {
        const res = await fetch(`/api/events/${eventId}/bulk-import`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ rows: [{ email: email.trim(), full_name: fullName.trim(), client_type_name: ct.name, company_name: companyName.trim() || undefined }] }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Failed to add exhibitor");
        if (json?.failed?.length) throw new Error(json.failed[0]?.error || "Failed to add exhibitor");
      }
      toast({ title: "Exhibitor added", description: `${fullName || "Exhibitor"} has been invited.`, variant: "success" });
      setFullName(""); setEmail(""); setClientTypeId(""); setCompanyName(""); setSelectedClientId(""); setUseExisting(false);
      onAdded();
    } catch (e: any) {
      setErr(e?.message || "Unknown error");
    } finally { setSaving(false); }
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <div className="mb-4 text-sm font-medium text-[var(--color-text-primary)]">Add one exhibitor</div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <div className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">Client</div>
          <div className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] p-0.5 bg-[var(--color-bg-subtle)]">
            <button type="button" onClick={() => { setUseExisting(false); setSelectedClientId(""); }}
              className={cn("flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
                !useExisting ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]")}>
              New client
            </button>
            <button type="button" onClick={() => setUseExisting(true)}
              className={cn("flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
                useExisting ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]")}>
              Existing client
            </button>
          </div>
        </div>

        {useExisting ? (
          <FormField label="Select client" required>
            <Select value={selectedClientId} onChange={(e) => {
              const id = e.target.value;
              setSelectedClientId(id);
              const c = existingClients.find((x) => x.id === id);
              if (c) {
                setFullName(c.full_name ?? "");
                setEmail(c.email);
                setCompanyName(c.company_name ?? "");
              }
            }}>
              <option value="">Select a client…</option>
              {existingClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {((c.full_name ?? "") || "Unnamed") + " — " + c.email}
                </option>
              ))}
            </Select>
          </FormField>
        ) : (
          <FormGrid className="grid-cols-2">
            <FormField label="Full name" required>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" />
            </FormField>
            <FormField label="Email" required>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" inputMode="email" />
            </FormField>
          </FormGrid>
        )}

        <FormField label="Company name">
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." />
        </FormField>

        <FormField label="Client type" required>
          <Select value={clientTypeId} onChange={(e) => setClientTypeId(e.target.value)}>
            <option value="">Select a client type…</option>
            {clientTypes.map((ct) => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
          </Select>
        </FormField>
        {err && <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">{err}</div>}
        <Button type="submit" loading={saving}>Add &amp; invite</Button>
      </form>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.id as string;

  const [event, setEvent] = React.useState<EventData | null>(null);
  const [loadingEvent, setLoadingEvent] = React.useState(true);
  const [tab, setTab] = React.useState<Tab>("exhibitors");

  // Exhibitors tab
  const [exhibitors, setExhibitors] = React.useState<ExhibitorRow[]>([]);
  const [loadingExhibitors, setLoadingExhibitors] = React.useState(false);
  const [exhibitorQuery, setExhibitorQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Selection + bulk actions
  const [selected, setSelected] = React.useState<string[]>([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [assignOwnerOpen, setAssignOwnerOpen] = React.useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = React.useState(false);
  const [bulkOwnerId, setBulkOwnerId] = React.useState("");
  const [bulkClientTypeId, setBulkClientTypeId] = React.useState("");
  const [bulkBusy, setBulkBusy] = React.useState(false);

  // Client types (for CSV preview)
  const [clientTypes, setClientTypes] = React.useState<ClientType[]>([]);

  // CSV upload state
  const [csvRows, setCsvRows] = React.useState<CsvRow[]>([]);
  const [csvParsed, setCsvParsed] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [confirmImportOpen, setConfirmImportOpen] = React.useState(false);

  async function loadEvent() {
    setLoadingEvent(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to load event");
      setEvent(json.event);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setLoadingEvent(false);
    }
  }

  async function loadExhibitors() {
    setLoadingExhibitors(true);
    try {
      const res = await fetch(`/api/onboardings?event_id=${eventId}`, { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to load exhibitors");

      const onboardings: any[] = json.onboardings ?? [];
      const enriched: ExhibitorRow[] = onboardings.map((o: any) => ({
        id: o.id,
        title: o.title,
        client_name: o.client_full_name ?? o.client_name ?? null,
        client_email: o.client_email ?? null,
        company_name: o.company_name ?? null,
        client_type_name: o.client_type_name ?? null,
        current_phase: o.current_phase ?? null,
        phase_status: o.phase_status ?? null,
        deadline: o.phase_deadline ?? null,
        updated_at: o.updated_at ?? null,
      }));
      setExhibitors(enriched);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setLoadingExhibitors(false);
    }
  }

  async function loadClientTypes() {
    try {
      const res = await fetch("/api/client-types", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok) setClientTypes(json.client_types ?? []);
    } catch { /* ignore */ }
  }

  async function loadMembers() {
    try {
      const res = await fetch("/api/team/members", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok) setMembers(json.members ?? []);
    } catch { /* ignore */ }
  }

  async function bulkDelete(ids: string[], clear: () => void) {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    setBulkBusy(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`/api/onboardings/${id}`, { method: "DELETE" }).then((r) => { if (!r.ok) throw new Error(); return id; }))
      );
      const ok = results.filter((r) => r.status === "fulfilled").length;
      setExhibitors((prev) => prev.filter((e) => !ids.includes(e.id)));
      toast({ title: `${ok} deleted`, variant: ok === ids.length ? "success" : "info" });
      clear();
    } finally { setBulkBusy(false); }
  }

  async function bulkSend(ids: string[], clear: () => void) {
    setBulkBusy(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => fetch("/api/onboardings/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ onboarding_id: id }),
        }).then((r) => { if (!r.ok) throw new Error(); return id; }))
      );
      const ok = results.filter((r) => r.status === "fulfilled").length;
      toast({ title: `${ok} invite${ok === 1 ? "" : "s"} sent`, variant: ok === ids.length ? "success" : "info" });
      clear();
    } finally { setBulkBusy(false); }
  }

  async function bulkAssignOwner(ids: string[], ownerId: string | null, clear: () => void) {
    setBulkBusy(true);
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/onboardings/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ owner_id: ownerId || null }),
        }))
      );
      toast({ title: `Owner updated for ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`, variant: "success" });
      setAssignOwnerOpen(false);
      clear();
    } finally { setBulkBusy(false); }
  }

  async function bulkChangeType(ids: string[], clientTypeId: string, clear: () => void) {
    setBulkBusy(true);
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/onboardings/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ client_type_id: clientTypeId }),
        }))
      );
      const ct = clientTypes.find((c) => c.id === clientTypeId);
      setExhibitors((prev) => prev.map((e) => ids.includes(e.id) ? { ...e, client_type_name: ct?.name ?? e.client_type_name } : e));
      toast({ title: `Type updated for ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`, variant: "success" });
      setChangeTypeOpen(false);
      clear();
    } finally { setBulkBusy(false); }
  }

  React.useEffect(() => {
    loadEvent();
    loadClientTypes();
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  React.useEffect(() => {
    if (tab === "exhibitors") loadExhibitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function parseCsv(text: string) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
    const emailIdx = headers.indexOf("email");
    const nameIdx = headers.indexOf("full_name");
    const ctIdx = headers.indexOf("client_type_name");
    const companyIdx = headers.indexOf("company_name");

    if (emailIdx === -1 || nameIdx === -1 || ctIdx === -1) {
      toast({ title: "Invalid CSV", description: "Required columns: email, full_name, client_type_name", variant: "error" });
      return;
    }

    const ctNames = new Set(clientTypes.map((c) => c.name.toLowerCase()));

    const rows: CsvRow[] = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const email = cols[emailIdx] ?? "";
      const full_name = cols[nameIdx] ?? "";
      const client_type_name = cols[ctIdx] ?? "";
      const company_name = companyIdx !== -1 ? cols[companyIdx] : undefined;

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const validCt = ctNames.has(client_type_name.toLowerCase());

      const ct = clientTypes.find((c) => c.name.toLowerCase() === client_type_name.toLowerCase());

      let _error: string | undefined;
      if (!validEmail) _error = "Invalid email";
      else if (!full_name) _error = "Missing name";
      else if (!validCt) _error = `Unknown client type: "${client_type_name}"`;

      return {
        email,
        full_name,
        client_type_name,
        company_name,
        _valid: !_error,
        _error,
        _template: ct ? (ct.templates as any)?.name ?? "Default" : undefined,
      };
    }).filter((r) => r.email || r.full_name);

    setCsvRows(rows);
    setCsvParsed(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      parseCsv(ev.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function runImport() {
    setImporting(true);
    setConfirmImportOpen(false);
    try {
      const validRows = csvRows.filter((r) => r._valid);
      const res = await fetch(`/api/events/${eventId}/bulk-import`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rows: validRows.map(({ email, full_name, client_type_name, company_name }) => ({ email, full_name, client_type_name, company_name })) }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Import failed");
      toast({ title: `Invited ${json.created} exhibitors`, variant: "success" });
      setCsvRows([]);
      setCsvParsed(false);
      setTab("exhibitors");
    } catch (e: any) {
      toast({ title: "Import failed", description: e?.message, variant: "error" });
    } finally {
      setImporting(false);
    }
  }

  const validCount = csvRows.filter((r) => r._valid).length;
  const invalidCount = csvRows.filter((r) => !r._valid).length;

  const filteredExhibitors = React.useMemo(() => {
    const q = exhibitorQuery.trim().toLowerCase();
    return exhibitors.filter((e) => {
      const statusOk = statusFilter === "all" || e.phase_status === statusFilter;
      if (!q) return statusOk;
      const hay = [e.client_name ?? "", e.client_email ?? "", e.client_type_name ?? ""].join(" ").toLowerCase();
      return statusOk && hay.includes(q);
    });
  }, [exhibitors, exhibitorQuery, statusFilter]);

  const exhibitorCols: Column<ExhibitorRow>[] = [
    {
      key: "client",
      header: "Exhibitor",
      sortValue: (r) => r.client_name?.toLowerCase() ?? "",
      render: (r) => (
        <div>
          <div className="text-sm font-medium text-[var(--color-text-primary)]">{r.client_name || "—"}</div>
          {r.company_name && (
            <div className="text-xs text-[var(--color-text-secondary)]">{r.company_name}</div>
          )}
          <div className="text-xs text-[var(--color-text-muted)]">{r.client_email || "—"}</div>
        </div>
      ),
    },
    {
      key: "client_type",
      header: "Type",
      hideOnMobile: true,
      render: (r) => r.client_type_name ? <Tag tone="info">{r.client_type_name}</Tag> : <span className="text-xs text-[var(--color-text-muted)]">—</span>,
    },
    {
      key: "phase",
      header: "Phase",
      render: (r) => <span className="text-sm">{r.current_phase ? `Phase ${r.current_phase}` : "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <PhaseStatusBadge status={r.phase_status} />,
    },
    {
      key: "deadline",
      header: "Deadline",
      hideOnMobile: true,
      render: (r) => <span className="text-xs text-[var(--color-text-muted)]">{formatDate(r.deadline)}</span>,
    },
    {
      key: "updated",
      header: "Last activity",
      hideOnMobile: true,
      render: (r) => <span className="text-xs text-[var(--color-text-muted)]">{formatDate(r.updated_at)}</span>,
    },
  ];

  if (loadingEvent) {
    return <div className="flex items-center justify-center py-24 text-[var(--color-text-muted)]"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  if (!event) {
    return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Event not found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.name}
        description={[event.location, `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`].filter(Boolean).join(" · ")}
        actions={
          <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/onboardings?tab=bulk")}>
            Back
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {(["exhibitors", "add", "templates"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { add: "Add Exhibitors", exhibitors: "Exhibitors", templates: "Templates" };
          const icons: Record<Tab, React.ReactNode> = {
            add: <Upload className="h-3.5 w-3.5" />,
            exhibitors: <Users className="h-3.5 w-3.5" />,
            templates: <LayoutTemplate className="h-3.5 w-3.5" />,
          };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {icons[t]} {labels[t]}
              {t === "exhibitors" && exhibitors.length > 0 && (
                <span className="ml-1 rounded-full bg-[var(--color-bg-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                  {exhibitors.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Exhibitors tab */}
      {tab === "add" && (
        <div className="space-y-6">

          {/* Single exhibitor form */}
          <SingleExhibitorForm
            eventId={eventId}
            clientTypes={clientTypes}
            onAdded={() => { setTab("exhibitors"); loadExhibitors(); }}
          />

          <div className="relative flex items-center gap-3">
            <div className="flex-1 border-t border-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">or import multiple via CSV</span>
            <div className="flex-1 border-t border-[var(--color-border)]" />
          </div>

          <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] p-8 text-center">
            <Upload className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
            <div className="text-sm font-medium text-[var(--color-text-primary)]">Upload CSV</div>
            <div className="mt-1 text-xs text-[var(--color-text-muted)]">
              Required columns: <code>email</code>, <code>full_name</code>, <code>client_type_name</code>. Optional: <code>company_name</code>
            </div>
            <label className="mt-4 inline-block cursor-pointer">
              <span className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:opacity-90">
                Choose file
              </span>
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileChange} />
            </label>
          </div>

          {csvParsed && csvRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-sm">
                  <span className="text-[var(--color-success)]"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />{validCount} valid</span>
                  {invalidCount > 0 && <span className="text-[var(--color-danger)]"><AlertCircle className="mr-1 inline h-3.5 w-3.5" />{invalidCount} invalid (will skip)</span>}
                </div>
                <Button
                  disabled={validCount === 0 || importing}
                  onClick={() => setConfirmImportOpen(true)}
                  loading={importing}
                >
                  Send Invites ({validCount})
                </Button>
              </div>

              <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--color-bg-subtle)]">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">#</th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">Name</th>
                      <th className="px-3 py-2 text-left font-medium">Client Type</th>
                      <th className="px-3 py-2 text-left font-medium">Template</th>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {csvRows.map((row, i) => (
                      <tr key={i} className={row._valid ? "" : "bg-[var(--color-danger-subtle)]"}>
                        <td className="px-3 py-2 text-[var(--color-text-muted)]">{i + 1}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">{row.full_name}</td>
                        <td className="px-3 py-2">{row.client_type_name}</td>
                        <td className="px-3 py-2 text-[var(--color-text-muted)]">{row._template ?? "—"}</td>
                        <td className="px-3 py-2">
                          {row._valid
                            ? <span className="text-[var(--color-success)]">✓</span>
                            : <span className="text-[var(--color-danger)]">{row._error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exhibitors tab */}
      {tab === "exhibitors" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <Input value={exhibitorQuery} onChange={(e) => setExhibitorQuery(e.target.value)} placeholder="Search exhibitors…" className="pl-9" />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-44">
              <option value="all">All statuses</option>
              <option value="in_progress">In progress</option>
              <option value="awaiting_review">Awaiting review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="locked">Locked</option>
            </Select>
          </div>

          <DataTable<ExhibitorRow>
            columns={exhibitorCols}
            data={filteredExhibitors}
            getRowId={(r) => r.id}
            rowHref={(r) => `/dashboard/onboardings/${r.id}`}
            loading={loadingExhibitors}
            defaultSort={{ key: "client", dir: "asc" }}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            bulkBar={(ids, clear) => (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">{ids.length} selected</span>
                <Button size="xs" variant="ghost" onClick={clear}>Clear</Button>
                <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />
                <Button
                  size="xs"
                  variant="ghost"
                  iconLeft={<Send className="h-3 w-3" />}
                  disabled={bulkBusy}
                  onClick={() => bulkSend(ids, clear)}
                >
                  Send invite
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  iconLeft={<UserCheck className="h-3 w-3" />}
                  disabled={bulkBusy}
                  onClick={() => { setBulkOwnerId(""); setAssignOwnerOpen(true); }}
                >
                  Assign owner
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  iconLeft={<TagIcon className="h-3 w-3" />}
                  disabled={bulkBusy}
                  onClick={() => { setBulkClientTypeId(""); setChangeTypeOpen(true); }}
                >
                  Change type
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
                  iconLeft={<Trash2 className="h-3 w-3" />}
                  disabled={bulkBusy}
                  onClick={() => bulkDelete(ids, clear)}
                >
                  Delete
                </Button>

                {/* Assign owner modal */}
                <Modal
                  open={assignOwnerOpen}
                  onClose={() => setAssignOwnerOpen(false)}
                  title={`Assign owner to ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`}
                  size="sm"
                  footer={
                    <>
                      <Button variant="secondary" onClick={() => setAssignOwnerOpen(false)}>Cancel</Button>
                      <Button loading={bulkBusy} onClick={() => bulkAssignOwner(ids, bulkOwnerId, clear)}>
                        Assign
                      </Button>
                    </>
                  }
                >
                  <Select value={bulkOwnerId} onChange={(e) => setBulkOwnerId(e.target.value)}>
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {(m.full_name || m.email || m.user_id).trim()}
                      </option>
                    ))}
                  </Select>
                </Modal>

                {/* Change type modal */}
                <Modal
                  open={changeTypeOpen}
                  onClose={() => setChangeTypeOpen(false)}
                  title={`Change client type for ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`}
                  size="sm"
                  footer={
                    <>
                      <Button variant="secondary" onClick={() => setChangeTypeOpen(false)}>Cancel</Button>
                      <Button loading={bulkBusy} disabled={!bulkClientTypeId} onClick={() => bulkChangeType(ids, bulkClientTypeId, clear)}>
                        Apply
                      </Button>
                    </>
                  }
                >
                  <Select value={bulkClientTypeId} onChange={(e) => setBulkClientTypeId(e.target.value)}>
                    <option value="">Select a type…</option>
                    {clientTypes.map((ct) => (
                      <option key={ct.id} value={ct.id}>{ct.name}</option>
                    ))}
                  </Select>
                </Modal>
              </div>
            )}
            empty={
              <div className="py-10 text-center">
                <div className="text-sm text-[var(--color-text-muted)]">No exhibitors yet. Use the Add Exhibitors tab to import from CSV.</div>
              </div>
            }
          />
        </div>
      )}

      {/* Templates tab */}
      {tab === "templates" && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">Templates assigned by client type for this event.</p>
          {clientTypes.length === 0 ? (
            <div className="text-sm text-[var(--color-text-muted)]">No client types defined for this organisation.</div>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-bg-subtle)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Client Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Default Template</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {clientTypes.map((ct) => (
                    <tr key={ct.id}>
                      <td className="px-4 py-3 font-medium">{ct.name}</td>
                      <td className="px-4 py-3 text-[var(--color-text-muted)]">{(ct.templates as any)?.name ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirm import modal */}
      <Modal
        open={confirmImportOpen}
        onClose={() => setConfirmImportOpen(false)}
        title="Send invites?"
        description={`This will send invite emails to ${validCount} exhibitor${validCount === 1 ? "" : "s"}. This cannot be undone.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmImportOpen(false)}>Cancel</Button>
            <Button onClick={runImport} loading={importing}>Send {validCount} invites</Button>
          </>
        }
      >{null}</Modal>
    </div>
  );
}
