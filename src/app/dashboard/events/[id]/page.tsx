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
  Download,
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Clock,
  TrendingUp,
  Bell,
  Plus,
  Pencil,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, FormGrid } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { DeadlineBadge, DeadlinePill } from "@/components/ui/deadline-badge";

type EventData = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string;
  submission_deadline?: string | null;
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
  template_title: string | null;
  current_phase: number | null;
  phase_status: string | null;
  deadline: string | null;
  updated_at: string | null;
};

type CsvRow = {
  email: string;
  full_name: string;
  template_name: string;
  company_name?: string;
  _valid: boolean;
  _error?: string;
  _template?: string;
};

type Template = { id: string; name: string };
type TeamMember = { user_id: string; email: string | null; full_name: string | null };

type Tab = "dashboard" | "exhibitors" | "add" | "templates";

function PhaseStatusBadge({ status }: { status: string | null }) {
  if (!status) return <Tag>—</Tag>;
  const map: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
    draft: "neutral",
    sent: "neutral",
    locked: "neutral",
    in_progress: "info",
    awaiting_review: "warning",
    approved: "success",
    rejected: "danger",
    completed: "success",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    sent: "Sent",
    in_progress: "In progress",
    awaiting_review: "Awaiting review",
    approved: "Approved",
    rejected: "Rejected",
    locked: "Locked",
    completed: "Completed",
  };
  return <Tag tone={map[status] ?? "neutral"}>{labels[status] ?? status.replace(/_/g, " ")}</Tag>;
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function SingleExhibitorForm({
  eventId,
  templates,
  members,
  onAdded,
}: {
  eventId: string;
  templates: Template[];
  members: TeamMember[];
  onAdded: () => void;
}) {
  const { toast } = useToast();
  const [useExisting, setUseExisting] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [templateId, setTemplateId] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("");
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
    if (!templateId) { setErr("Template is required."); return; }
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) { setErr("Select a template."); return; }

    if (useExisting) {
      if (!selectedClientId) { setErr("Select an existing client."); return; }
    } else {
      if (!fullName.trim()) { setErr("Full name is required."); return; }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Valid email is required."); return; }
    }

    setErr(null); setSaving(true);
    try {
      const title = companyName.trim() || fullName.trim() || "Exhibitor";
      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          client: useExisting ? { id: selectedClientId } : { email: email.trim(), full_name: fullName.trim() },
          event_id: eventId,
          template_id: templateId,
          company_name: companyName.trim() || null,
          owner_id: ownerId || null,
          title,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to add exhibitor");
      toast({ title: "Exhibitor added", description: `${fullName || "Exhibitor"} has been invited.`, variant: "success" });
      setFullName(""); setEmail(""); setTemplateId(""); setCompanyName(""); setSelectedClientId(""); setUseExisting(false); setOwnerId("");
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

        <FormGrid className="grid-cols-2">
          <FormField label="Template" required>
            <Select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              <option value="">Select a template…</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Owner">
            <Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {(m.full_name || m.email || m.user_id).trim()}
                </option>
              ))}
            </Select>
          </FormField>
        </FormGrid>
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
  const [tab, setTab] = React.useState<Tab>("dashboard");

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
  const [bulkTemplateId, setBulkTemplateId] = React.useState("");
  const [bulkBusy, setBulkBusy] = React.useState(false);

  // Delete event
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  // Submission deadline editing
  const [deadlineEditing, setDeadlineEditing] = React.useState(false);
  const [deadlineValue, setDeadlineValue] = React.useState("");
  const [deadlineSaving, setDeadlineSaving] = React.useState(false);

  // Reminder rules
  type ReminderRule = { id: string; phase_number: number | null; trigger_offset_days: number; subject: string; body: string; is_active: boolean };
  const [reminderRules, setReminderRules] = React.useState<ReminderRule[]>([]);
  const [reminderModalOpen, setReminderModalOpen] = React.useState(false);
  const [newRulePhase, setNewRulePhase] = React.useState<string>("all");
  const [newRuleDays, setNewRuleDays] = React.useState<number[]>([3]);
  const [newRuleSubject, setNewRuleSubject] = React.useState("Action needed: deadline approaching");
  const [newRuleBody, setNewRuleBody] = React.useState("Hi {{client_name}},\n\nThis is a reminder that your {{phase_name}} deadline is on {{deadline}}.\n\nPlease log in and complete your requirements as soon as possible.\n\nThank you.");
  const [ruleSaving, setRuleSaving] = React.useState(false);

  async function saveEventDeadline(value: string) {
    setDeadlineSaving(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submission_deadline: value || null }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to save deadline");
      setEvent((prev) => prev ? { ...prev, submission_deadline: value || null } : prev);
      toast({ title: "Deadline saved", variant: "success" });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setDeadlineSaving(false);
      setDeadlineEditing(false);
    }
  }

  async function loadReminderRules() {
    try {
      const res = await fetch("/api/reminder-rules", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      setReminderRules(json?.rules ?? []);
    } catch { /* enterprise feature may not be enabled */ }
  }

  async function saveReminderRule() {
    if (newRuleDays.length === 0) return;
    setRuleSaving(true);
    try {
      const results = await Promise.all(
        newRuleDays.map((days) =>
          fetch("/api/reminder-rules", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              phase_number: newRulePhase === "all" ? null : parseInt(newRulePhase, 10),
              rule_type: "deadline_based",
              trigger_offset_days: days,
              subject: newRuleSubject,
              body: newRuleBody,
              is_active: true,
            }),
          }).then((r) => r.json())
        )
      );
      const newRules = results.map((r) => r.rule).filter(Boolean);
      setReminderRules((prev) => [...newRules, ...prev]);
      setReminderModalOpen(false);
      setNewRulePhase("all");
      setNewRuleDays([3]);
      setNewRuleSubject("Action needed: deadline approaching");
      setNewRuleBody("Hi {{client_name}},\n\nThis is a reminder that your {{phase_name}} deadline is on {{deadline}}.\n\nPlease log in and complete your requirements as soon as possible.\n\nThank you.");
      toast({ title: `${newRules.length} reminder rule${newRules.length !== 1 ? "s" : ""} created`, variant: "success" });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setRuleSaving(false);
    }
  }

  async function toggleReminderRule(rule: ReminderRule) {
    try {
      const res = await fetch(`/api/reminder-rules/${rule.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ is_active: !rule.is_active }),
      });
      if (!res.ok) return;
      setReminderRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, is_active: !r.is_active } : r));
    } catch { /* ignore */ }
  }

  async function deleteReminderRule(id: string) {
    try {
      const res = await fetch(`/api/reminder-rules/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setReminderRules((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Rule deleted", variant: "success" });
    } catch { /* ignore */ }
  }

  // Templates (for single-add form and CSV preview)
  const [templates, setTemplates] = React.useState<Template[]>([]);

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
        template_title: o.template_title ?? null,
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

  async function loadTemplates() {
    try {
      const res = await fetch("/api/templates", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok) setTemplates((json.items ?? []).map((t: any) => ({ id: t.id, name: t.name })));
    } catch { /* ignore */ }
  }

  async function loadMembers() {
    try {
      const res = await fetch("/api/team/members", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok) setMembers(json.members ?? []);
    } catch { /* ignore */ }
  }

  async function deleteEvent() {
    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Delete failed");
    toast({ title: "Event deleted", variant: "success" });
    router.push("/dashboard/onboardings?tab=bulk");
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

  async function bulkChangeTemplate(ids: string[], tplId: string, clear: () => void) {
    setBulkBusy(true);
    try {
      await Promise.all(
        ids.map((id) => fetch(`/api/onboardings/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ template_id: tplId }),
        }))
      );
      const tpl = templates.find((t) => t.id === tplId);
      setExhibitors((prev) => prev.map((e) => ids.includes(e.id) ? { ...e, template_title: tpl?.name ?? e.template_title } : e));
      toast({ title: `Template updated for ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`, variant: "success" });
      setChangeTypeOpen(false);
      clear();
    } finally { setBulkBusy(false); }
  }

  React.useEffect(() => {
    loadEvent();
    loadTemplates();
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  React.useEffect(() => {
    if (tab === "exhibitors" || tab === "dashboard") loadExhibitors();
    if (tab === "dashboard") loadReminderRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function parseCsv(text: string) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
    const emailIdx = headers.indexOf("email");
    const nameIdx = headers.indexOf("full_name");
    const tplIdx = headers.indexOf("template_name");
    const companyIdx = headers.indexOf("company_name");

    if (emailIdx === -1 || nameIdx === -1 || tplIdx === -1) {
      toast({ title: "Invalid CSV", description: "Required columns: email, full_name, template_name", variant: "error" });
      return;
    }

    const tplNames = new Set(templates.map((t) => t.name.toLowerCase()));

    const rows: CsvRow[] = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const email = cols[emailIdx] ?? "";
      const full_name = cols[nameIdx] ?? "";
      const template_name = cols[tplIdx] ?? "";
      const company_name = companyIdx !== -1 ? cols[companyIdx] : undefined;

      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const validTpl = tplNames.has(template_name.toLowerCase());

      let _error: string | undefined;
      if (!validEmail) _error = "Invalid email";
      else if (!full_name) _error = "Missing name";
      else if (!validTpl) _error = `Unknown template: "${template_name}"`;

      return {
        email,
        full_name,
        template_name,
        company_name,
        _valid: !_error,
        _error,
        _template: template_name || undefined,
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
        body: JSON.stringify({ rows: validRows.map(({ email, full_name, template_name, company_name }) => ({ email, full_name, template_name, company_name })) }),
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
      const hay = [e.client_name ?? "", e.client_email ?? "", e.template_title ?? ""].join(" ").toLowerCase();
      return statusOk && hay.includes(q);
    });
  }, [exhibitors, exhibitorQuery, statusFilter]);

  const exhibitorCols: Column<ExhibitorRow>[] = [
    {
      key: "client",
      header: "Exhibitor",
      sortValue: (r) => (r.company_name ?? r.client_name ?? "").toLowerCase(),
      render: (r) => (
        <div>
          <div className="text-sm font-medium text-[var(--color-text-primary)]">{r.company_name || r.client_name || "—"}</div>
          {r.client_name && (
            <div className="text-xs text-[var(--color-text-secondary)]">{r.client_name}</div>
          )}
          <div className="text-xs text-[var(--color-text-muted)]">{r.client_email || "—"}</div>
        </div>
      ),
    },
    {
      key: "template",
      header: "Template",
      hideOnMobile: true,
      render: (r) => r.template_title ? <Tag tone="info">{r.template_title}</Tag> : <span className="text-xs text-[var(--color-text-muted)]">—</span>,
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconLeft={<Download className="h-3.5 w-3.5" />}
              onClick={() => { window.location.href = `/api/events/${eventId}/export`; }}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[var(--color-danger)] border-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
              iconLeft={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete event
            </Button>
            <Button variant="outline" size="sm" iconLeft={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/onboardings?tab=bulk")}>
              Back
            </Button>
          </div>
        }
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={deleteEvent}
        title="Delete event"
        description={`Are you sure you want to delete "${event.name}"? This will permanently remove the event and cannot be undone. Onboardings attached to this event will not be deleted.`}
        confirmLabel="Delete event"
        destructive
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {(["dashboard", "exhibitors", "add", "templates"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { dashboard: "Dashboard", add: "Add Exhibitors", exhibitors: "Exhibitors", templates: "Templates" };
          const icons: Record<Tab, React.ReactNode> = {
            dashboard: <LayoutDashboard className="h-3.5 w-3.5" />,
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

      {/* Dashboard tab */}
      {tab === "dashboard" && (() => {
        const total = exhibitors.length;
        const completed = exhibitors.filter((e) => e.phase_status === "completed" || e.phase_status === "approved").length;
        const awaitingReview = exhibitors.filter((e) => e.phase_status === "awaiting_review").length;
        const inProgress = exhibitors.filter((e) => e.phase_status === "in_progress").length;
        const rejected = exhibitors.filter((e) => e.phase_status === "rejected").length;
        const notStarted = total - completed - awaitingReview - inProgress - rejected;
        const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const needsAttention = exhibitors.filter((e) => e.phase_status === "awaiting_review" || e.phase_status === "rejected");

        const statCards = [
          { label: "Total Exhibitors", value: total, color: "text-[var(--color-text-primary)]" },
          { label: "Completed", value: completed, color: "text-green-600 dark:text-green-400" },
          { label: "In Progress", value: inProgress, color: "text-blue-600 dark:text-blue-400" },
          { label: "Awaiting Review", value: awaitingReview, color: "text-amber-600 dark:text-amber-400" },
          { label: "Needs Revision", value: rejected, color: "text-red-600 dark:text-red-400" },
          { label: "Not Started", value: notStarted, color: "text-[var(--color-text-muted)]" },
        ];

        return (
          <div className="space-y-6">
            {/* Event info card */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Event Details</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Date</div>
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">
                      {event.start_date ? `${formatDate(event.start_date)} → ${formatDate(event.end_date)}` : formatDate(event.end_date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Location</div>
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">{event.location || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Status</div>
                    <div className="text-sm font-medium text-[var(--color-text-primary)] capitalize">{event.status}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[var(--color-accent)] mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Submission Deadline</div>
                    {deadlineEditing ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="date"
                          value={deadlineValue}
                          onChange={(e) => setDeadlineValue(e.target.value)}
                          className="w-36 rounded border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-xs text-[var(--color-text-primary)]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEventDeadline(deadlineValue);
                            if (e.key === "Escape") setDeadlineEditing(false);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => saveEventDeadline(deadlineValue)}
                          disabled={deadlineSaving}
                          className="rounded bg-[var(--color-accent)] px-2 py-0.5 text-[10px] text-white disabled:opacity-50"
                        >
                          {deadlineSaving ? "…" : "Save"}
                        </button>
                        <button onClick={() => setDeadlineEditing(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {event.submission_deadline ? (
                          <DeadlineBadge deadline={event.submission_deadline} />
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">Not set</span>
                        )}
                        <button
                          onClick={() => { setDeadlineValue(event.submission_deadline ?? ""); setDeadlineEditing(true); }}
                          className="rounded p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {statCards.map((s) => (
                <div key={s.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{s.label}</div>
                  <div className={`mt-2 text-2xl font-semibold tabular-nums ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>
                    {loadingExhibitors ? <span className="text-[var(--color-text-muted)]">—</span> : s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Overall Progress</span>
                </div>
                <span className="text-sm font-semibold text-[var(--color-accent)]">{completionPct}% complete</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
                <span><span className="font-semibold text-green-600">{completed}</span> completed</span>
                <span><span className="font-semibold text-blue-600">{inProgress}</span> in progress</span>
                <span><span className="font-semibold text-amber-600">{awaitingReview}</span> awaiting review</span>
                <span><span className="font-semibold text-red-600">{rejected}</span> needs revision</span>
                <span><span className="font-semibold text-[var(--color-text-muted)]">{notStarted}</span> not started</span>
              </div>
            </div>

            {/* Needs attention */}
            {needsAttention.length > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-5 py-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Needs Attention</span>
                  <span className="ml-auto text-xs text-[var(--color-text-muted)]">{needsAttention.length} exhibitor{needsAttention.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {needsAttention.map((e) => (
                    <a key={e.id} href={`/dashboard/onboardings/${e.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-bg-hover)] transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-[11px] font-bold text-[var(--color-accent)]">
                        {(e.client_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{e.client_name || e.title || "—"}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Phase {e.current_phase} · {e.phase_status?.replace(/_/g, " ")}</div>
                      </div>
                      <PhaseStatusBadge status={e.phase_status} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Exhibitor deadlines table */}
            {total > 0 && exhibitors.some((e) => e.deadline) && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-5 py-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Exhibitor Deadlines</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[var(--color-bg-subtle)]">
                      <tr>
                        <th className="px-5 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Exhibitor</th>
                        <th className="px-5 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Phase</th>
                        <th className="px-5 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Deadline</th>
                        <th className="px-5 py-2.5 text-left font-medium text-[var(--color-text-muted)]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {[...exhibitors]
                        .filter((e) => e.deadline)
                        .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
                        .map((e) => (
                          <tr key={e.id} className="hover:bg-[var(--color-bg-hover)] transition-colors">
                            <td className="px-5 py-2.5">
                              <a href={`/dashboard/onboardings/${e.id}`} className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]">
                                {e.client_name || e.title || "—"}
                              </a>
                              {e.company_name && <div className="text-[var(--color-text-muted)]">{e.company_name}</div>}
                            </td>
                            <td className="px-5 py-2.5 text-[var(--color-text-secondary)]">Phase {e.current_phase ?? 1}</td>
                            <td className="px-5 py-2.5"><DeadlinePill deadline={e.deadline} /></td>
                            <td className="px-5 py-2.5"><PhaseStatusBadge status={e.phase_status} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reminder rules */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
              <div className="border-b border-[var(--color-border)] px-5 py-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Deadline Reminders</span>
                <span className="ml-auto text-xs text-[var(--color-text-muted)]">Auto-sent before deadlines</span>
                <button
                  onClick={() => setReminderModalOpen(true)}
                  className="ml-2 flex items-center gap-1 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-white hover:opacity-90"
                >
                  <Plus className="h-3 w-3" /> Add reminder
                </button>
              </div>
              {reminderRules.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)]">
                  No reminder rules yet. Add one to automatically notify exhibitors before their deadline.
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {reminderRules.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">{rule.subject}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {rule.phase_number ? `Phase ${rule.phase_number}` : "All phases"} · {rule.trigger_offset_days}d before deadline
                        </div>
                      </div>
                      <button
                        onClick={() => toggleReminderRule(rule)}
                        className={cn("text-[var(--color-text-muted)] hover:text-[var(--color-accent)]", rule.is_active && "text-[var(--color-accent)]")}
                        title={rule.is_active ? "Disable" : "Enable"}
                      >
                        {rule.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => deleteReminderRule(rule.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                        title="Delete rule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Full exhibitor list summary */}
            {total > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">All Exhibitors</span>
                  <button onClick={() => setTab("exhibitors")} className="text-xs text-[var(--color-accent)] hover:underline">
                    Manage →
                  </button>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {exhibitors.map((e) => (
                    <a key={e.id} href={`/dashboard/onboardings/${e.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-bg-hover)] transition-colors">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-[10px] font-bold text-[var(--color-text-secondary)]">
                        {(e.client_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-[var(--color-text-primary)]">{e.client_name || e.title || "—"}</div>
                        {e.company_name && <div className="truncate text-xs text-[var(--color-text-muted)]">{e.company_name}</div>}
                      </div>
                      <div className="shrink-0 text-xs text-[var(--color-text-muted)]">Phase {e.current_phase ?? 1}</div>
                      <PhaseStatusBadge status={e.phase_status} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Add Exhibitors tab */}
      {tab === "add" && (
        <div className="space-y-6">

          {/* Single exhibitor form */}
          <SingleExhibitorForm
            eventId={eventId}
            templates={templates}
            members={members}
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
              Required columns: <code>email</code>, <code>full_name</code>, <code>template_name</code>. Optional: <code>company_name</code>
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
                      <th className="px-3 py-2 text-left font-medium">Template</th>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                      <th className="px-3 py-2 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {csvRows.map((row, i) => (
                      <tr key={i} className={row._valid ? "" : "bg-[var(--color-danger-subtle)]"}>
                        <td className="px-3 py-2 text-[var(--color-text-muted)]">{i + 1}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">{row.full_name}</td>
                        <td className="px-3 py-2">{row.template_name}</td>
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="in_progress">In progress</option>
              <option value="awaiting_review">Awaiting review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
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
                  onClick={() => { setBulkTemplateId(""); setChangeTypeOpen(true); }}
                >
                  Change template
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
                  title={`Change template for ${ids.length} exhibitor${ids.length === 1 ? "" : "s"}`}
                  size="sm"
                  footer={
                    <>
                      <Button variant="secondary" onClick={() => setChangeTypeOpen(false)}>Cancel</Button>
                      <Button loading={bulkBusy} disabled={!bulkTemplateId} onClick={() => bulkChangeTemplate(ids, bulkTemplateId, clear)}>
                        Apply
                      </Button>
                    </>
                  }
                >
                  <Select value={bulkTemplateId} onChange={(e) => setBulkTemplateId(e.target.value)}>
                    <option value="">Select a template…</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
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
          <p className="text-sm text-[var(--color-text-secondary)]">Available templates for this organisation. Select one when adding exhibitors.</p>
          {templates.length === 0 ? (
            <div className="text-sm text-[var(--color-text-muted)]">No templates defined. Create templates in the Templates section.</div>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-bg-subtle)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Template name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {templates.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 font-medium">{t.name}</td>
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

      {/* Add reminder rule modal */}
      <Modal
        open={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        title="Add deadline reminder"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setReminderModalOpen(false)}>Cancel</Button>
            <Button loading={ruleSaving} disabled={!newRuleSubject.trim() || !newRuleBody.trim()} onClick={saveReminderRule}>
              Save reminder
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormGrid className="grid-cols-2">
            <FormField label="Phase">
              <Select value={newRulePhase} onChange={(e) => setNewRulePhase(e.target.value)}>
                <option value="all">All phases</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={String(n)}>Phase {n}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Days before deadline">
              <div className="space-y-2">
                <p className="text-xs text-[var(--color-text-muted)]">Select one or more — a separate reminder is created for each.</p>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 3, 7, 14, 21, 30].map((d) => {
                    const selected = newRuleDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewRuleDays((prev) => selected ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b))}
                        className={cn(
                          "rounded-[var(--radius-md)] border px-3 py-1 text-xs font-medium transition-colors",
                          selected
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]"
                        )}
                      >
                        {d}d
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    placeholder="Custom (e.g. 10)"
                    className="w-36"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = Math.max(1, Math.min(365, parseInt((e.target as HTMLInputElement).value, 10) || 0));
                        if (v && !newRuleDays.includes(v)) setNewRuleDays((prev) => [...prev, v].sort((a, b) => a - b));
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <span className="text-xs text-[var(--color-text-muted)]">Press Enter to add</span>
                </div>
                {newRuleDays.length > 0 && (
                  <div className="text-xs text-[var(--color-text-muted)]">
                    Will create {newRuleDays.length} rule{newRuleDays.length !== 1 ? "s" : ""}: {newRuleDays.map((d) => `${d}d`).join(", ")} before deadline
                  </div>
                )}
              </div>
            </FormField>
          </FormGrid>
          <FormField label="Email subject">
            <Input
              value={newRuleSubject}
              onChange={(e) => setNewRuleSubject(e.target.value)}
              placeholder="Action needed: deadline approaching"
            />
          </FormField>
          <FormField label="Email body">
            <textarea
              value={newRuleBody}
              onChange={(e) => setNewRuleBody(e.target.value)}
              rows={6}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              placeholder="Email body…"
            />
          </FormField>
          <div className="text-xs text-[var(--color-text-muted)]">
            Available variables: <code className="bg-[var(--color-bg-subtle)] px-1 py-0.5 rounded">{"{{client_name}}"}</code>{" "}
            <code className="bg-[var(--color-bg-subtle)] px-1 py-0.5 rounded">{"{{phase_name}}"}</code>{" "}
            <code className="bg-[var(--color-bg-subtle)] px-1 py-0.5 rounded">{"{{deadline}}"}</code>
          </div>
        </div>
      </Modal>
    </div>
  );
}
