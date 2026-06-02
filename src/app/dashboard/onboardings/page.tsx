"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, RefreshCw, Copy, Send, Lock, Trash2, ExternalLink, Search, CalendarDays, Users, X as XIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, FormGrid } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { normalizeStatus, type OnboardingStatus } from "@/lib/status";
import { cn } from "@/lib/cn";

// Re-export so BulkTab (defined above the main component in this file) can use them
// These are already imported below — this comment is just for clarity

type OnboardingRow = {
  id: string;
  title?: string | null;
  status?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  company_name?: string | null;
  template_title?: string | null;
  client_link?: string | null;
  client_token?: string | null;
  token?: string | null;
  owner_id?: string | null;
  owner_name?: string | null;
  event_id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type TeamMember = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
};

function toLocaleDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusKey(raw?: string | null): OnboardingStatus {
  return normalizeStatus(raw) as OnboardingStatus;
}

// ─── Bulk Onboardings (Events) tab ────────────────────────────────────────────

type EventCard = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string;
  location: string | null;
  status: string;
  exhibitor_count?: number;
};

function EventStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    planning: "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]",
    active: "bg-[var(--color-success-subtle)] text-[var(--color-success)]",
    closed: "bg-[var(--color-warning-subtle)] text-[var(--color-warning)]",
    archived: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? map.planning}`}>
      {status}
    </span>
  );
}

function BulkTab({ hasFlag }: { hasFlag: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = React.useState<EventCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingEventId, setDeletingEventId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [name, setName] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [submissionDeadline, setSubmissionDeadline] = React.useState("");
  const [formErr, setFormErr] = React.useState<string | null>(null);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to load events");
      setEvents(json.events ?? []);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (hasFlag) loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFlag]);

  async function handleDeleteEvent(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm("Delete this event? This cannot be undone. Onboardings will not be deleted.")) return;
    setDeletingEventId(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      toast({ title: "Event deleted", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message, variant: "error" });
    } finally {
      setDeletingEventId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    if (!name.trim()) return setFormErr("Event name is required.");
    if (!endDate) return setFormErr("End date is required.");
    if (!submissionDeadline) return setFormErr("Submission deadline is required.");
    setCreating(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), end_date: endDate, start_date: startDate || null, location: location.trim() || null, submission_deadline: submissionDeadline }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to create event");
      setCreateOpen(false);
      setName(""); setEndDate(""); setStartDate(""); setLocation(""); setSubmissionDeadline("");
      toast({ title: "Event created", variant: "success" });
      router.push(`/dashboard/events/${json.event.id}`);
    } catch (err: any) {
      setFormErr(err?.message || "Failed to create event.");
    } finally {
      setCreating(false);
    }
  }

  if (!hasFlag) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
        Enterprise onboarding is not enabled for your organization.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreateOpen(true)}>
          New Event
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">Loading…</div>
      ) : events.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-10 text-center">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">No events yet</div>
          <div className="mt-1 text-sm text-[var(--color-text-secondary)]">Create an event to bulk-onboard exhibitors.</div>
          <Button className="mt-4" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreateOpen(true)}>
            New Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => router.push(`/dashboard/events/${ev.id}`)}
              className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 text-left shadow-[var(--shadow-sm)] transition hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{ev.name}</div>
                  {ev.location && <div className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">{ev.location}</div>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <EventStatusBadge status={ev.status} />
                  <button
                    onClick={(e) => handleDeleteEvent(ev.id, e)}
                    disabled={deletingEventId === ev.id}
                    className="opacity-0 group-hover:opacity-100 rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-all"
                    title="Delete event"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>{ev.end_date ? new Date(ev.end_date).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }) : "—"}</span>
                <span>{ev.exhibitor_count ?? 0} exhibitor{(ev.exhibitor_count ?? 0) !== 1 ? "s" : ""}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Event"
        description="Create a new event to bulk-onboard exhibitors."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)} disabled={creating}>Cancel</Button>
            <Button onClick={handleCreate as any} loading={creating}>Create Event</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Event name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="DreamHack Dallas 2026" />
          </FormField>
          <FormGrid>
            <FormField label="End date" required>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormField>
            <FormField label="Start date">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormField>
          </FormGrid>
          <FormField label="Submission deadline" required hint="All onboardings for this event will use this date for automated reminders.">
            <Input type="date" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} />
          </FormField>
          <FormField label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dallas, TX" />
          </FormField>
          {formErr && <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">{formErr}</div>}
          <button type="submit" className="hidden" />
        </form>
      </Modal>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [rows, setRows] = React.useState<OnboardingRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [progress, setProgress] = React.useState<Record<string, number>>({});
  const [progressLoading, setProgressLoading] = React.useState(false);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | OnboardingStatus>("all");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all");

  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [createErr, setCreateErr] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [titleTouched, setTitleTouched] = React.useState(false);
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [clientCompany, setClientCompany] = React.useState("");

  // Auto-fill title with company name unless user has manually edited it
  React.useEffect(() => {
    if (!titleTouched) setTitle(clientCompany.trim());
  }, [clientCompany, titleTouched]);

  const [templates, setTemplates] = React.useState<Array<{ id: string; name: string }>>([]);
  const [clients, setClients] = React.useState<
    Array<{ id: string; email: string; full_name?: string | null; name?: string | null; company_name?: string | null }>
  >([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");
  const [useExistingClient, setUseExistingClient] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string>("");
  const [selectedOwnerId, setSelectedOwnerId] = React.useState<string>("");

  const [rowBusy, setRowBusy] = React.useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = React.useState<OnboardingRow | null>(null);

  // ─── Bulk send to many ───────────────────────────────────────────────
  type BulkRecipient = {
    key: string;
    email: string;
    full_name: string;
    company_name?: string | null;
    source: "client" | "manual";
    client_id?: string;
  };
  type BulkResult =
    | { key: string; status: "sent" }
    | { key: string; status: "created" } // created but email send failed
    | { key: string; status: "error"; message: string };

  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [bulkTemplateId, setBulkTemplateId] = React.useState<string>("");
  const [bulkRecipients, setBulkRecipients] = React.useState<BulkRecipient[]>([]);
  const [bulkEmailInput, setBulkEmailInput] = React.useState("");
  const [bulkClientSearch, setBulkClientSearch] = React.useState("");
  const [bulkClientChecked, setBulkClientChecked] = React.useState<Set<string>>(new Set());
  const [bulkSending, setBulkSending] = React.useState(false);
  const [bulkProgress, setBulkProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [bulkResults, setBulkResults] = React.useState<BulkResult[] | null>(null);
  const [bulkErr, setBulkErr] = React.useState<string | null>(null);

  function openBulk() {
    setBulkOpen(true);
    setBulkTemplateId(selectedTemplateId || (templates[0]?.id ?? ""));
    setBulkRecipients([]);
    setBulkEmailInput("");
    setBulkClientSearch("");
    setBulkClientChecked(new Set());
    setBulkResults(null);
    setBulkProgress(null);
    setBulkErr(null);
  }

  function toggleBulkClientChecked(id: string) {
    setBulkClientChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addSelectedBulkClients() {
    const ids = Array.from(bulkClientChecked);
    if (ids.length === 0) return;
    const byId = new Map(clients.map((c) => [c.id, c] as const));
    ids.forEach((id) => {
      const c = byId.get(id);
      if (!c || !c.email) return;
      addBulkRecipient({
        key: `c-${c.id}`,
        email: c.email,
        full_name: (c.full_name || c.name || c.email.split("@")[0]) as string,
        company_name: c.company_name ?? null,
        source: "client",
        client_id: c.id,
      });
    });
    setBulkClientChecked(new Set());
  }

  function closeBulk() {
    if (bulkSending) return;
    setBulkOpen(false);
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function addBulkRecipient(r: BulkRecipient) {
    setBulkRecipients((prev) => {
      const norm = r.email.trim().toLowerCase();
      if (prev.some((x) => x.email.toLowerCase() === norm)) return prev;
      return [...prev, { ...r, email: r.email.trim() }];
    });
  }

  function removeBulkRecipient(key: string) {
    setBulkRecipients((prev) => prev.filter((r) => r.key !== key));
  }

  function commitBulkEmailInput() {
    const raw = bulkEmailInput.trim();
    if (!raw) return;
    // Accept comma/space/newline-separated lists; tolerate `Name <email@x.com>` form
    const tokens = raw.split(/[,\n;]+/).map((t) => t.trim()).filter(Boolean);
    const added: string[] = [];
    const skipped: string[] = [];
    for (const tok of tokens) {
      const m = tok.match(/^(.+?)\s*<([^>]+)>$/);
      const name = m ? m[1].trim() : "";
      const email = (m ? m[2].trim() : tok).trim();
      if (!emailRe.test(email)) { skipped.push(tok); continue; }
      addBulkRecipient({
        key: `m-${email.toLowerCase()}`,
        email,
        full_name: name || email.split("@")[0],
        source: "manual",
      });
      added.push(email);
    }
    setBulkEmailInput("");
    if (skipped.length > 0) {
      setBulkErr(`Skipped ${skipped.length} invalid entr${skipped.length === 1 ? "y" : "ies"}.`);
    } else {
      setBulkErr(null);
    }
  }

  async function runBulkSend() {
    setBulkErr(null);
    if (bulkRecipients.length === 0) {
      setBulkErr("Add at least one recipient.");
      return;
    }
    setBulkSending(true);
    setBulkProgress({ done: 0, total: bulkRecipients.length });
    const results: BulkResult[] = [];
    const created: OnboardingRow[] = [];

    for (let i = 0; i < bulkRecipients.length; i += 1) {
      const r = bulkRecipients[i];
      const titleBase = (r.company_name || r.full_name || r.email).trim();
      try {
        const createRes = await fetch("/api/onboardings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            title: titleBase,
            template_id: bulkTemplateId || null,
            company_name: r.company_name || null,
            client:
              r.source === "client" && r.client_id
                ? { id: r.client_id }
                : { email: r.email, full_name: r.full_name || null },
          }),
        });
        if (!createRes.ok) {
          const text = await createRes.text().catch(() => "");
          throw new Error(text || `Create failed (${createRes.status})`);
        }
        const cjson = (await createRes.json().catch(() => null)) as any;
        const item = (cjson?.item ?? cjson?.onboarding ?? null) as OnboardingRow | null;
        if (item?.id) created.push(item);

        let sentOk = false;
        if (item?.id) {
          const sendRes = await fetch("/api/onboardings/send", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ onboarding_id: item.id, id: item.id }),
          });
          sentOk = sendRes.ok;
        }
        results.push(sentOk ? { key: r.key, status: "sent" } : { key: r.key, status: "created" });
      } catch (e: any) {
        results.push({ key: r.key, status: "error", message: e?.message || "Failed" });
      }
      setBulkProgress({ done: i + 1, total: bulkRecipients.length });
    }

    if (created.length > 0) {
      setRows((prev) => [...created, ...prev.filter((x) => !created.some((c) => c.id === x.id))]);
      void loadProgress(created.map((c) => c.id));
    }
    setBulkResults(results);
    setBulkSending(false);

    const okCount = results.filter((r) => r.status === "sent").length;
    const partialCount = results.filter((r) => r.status === "created").length;
    const failCount = results.filter((r) => r.status === "error").length;
    toast({
      title: failCount === 0 && partialCount === 0
        ? `${okCount} invitation${okCount === 1 ? "" : "s"} sent`
        : `${okCount} sent, ${partialCount} created (no email), ${failCount} failed`,
      variant: failCount === 0 ? "success" : "error",
    });
  }

  const filteredBulkClients = React.useMemo(() => {
    const q = bulkClientSearch.trim().toLowerCase();
    const already = new Set(bulkRecipients.map((r) => r.email.toLowerCase()));
    return clients
      .filter((c) => !!c.email && !already.has(c.email.toLowerCase()))
      .filter((c) => {
        if (!q) return true;
        const hay = `${c.full_name ?? ""} ${c.name ?? ""} ${c.email} ${c.company_name ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 50);
  }, [clients, bulkClientSearch, bulkRecipients]);

  // Enterprise feature flag
  const [hasEnterpriseFlag, setHasEnterpriseFlag] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"solo" | "bulk">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onboardings_tab");
      return saved === "solo" ? "solo" : "bulk";
    }
    return "bulk";
  });

  React.useEffect(() => {
    // Check if we landed with ?tab=bulk
    if (searchParams?.get("tab") === "bulk") setActiveTab("bulk");
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    // Check enterprise flag; if not enterprise, force solo tab so nothing is hidden
    fetch("/api/events", { cache: "no-store" })
      .then((r) => {
        if (r.ok || r.status === 200) {
          setHasEnterpriseFlag(true);
          // Default to bulk (events) tab for enterprise users unless they've explicitly chosen solo
          if (typeof window !== "undefined" && localStorage.getItem("onboardings_tab") !== "solo") {
            setActiveTab("bulk");
          }
        } else {
          setActiveTab("solo");
        }
      })
      .catch(() => { setActiveTab("solo"); });
  }, []);

  async function load() {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await fetch("/api/onboardings?no_event=1", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load onboardings (${res.status})`);
      }
      const json = (await res.json()) as any;
      const list: OnboardingRow[] = Array.isArray(json)
        ? json
        : ((json.onboardings ?? json.data ?? []) as OnboardingRow[]);
      setRows(list);
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load onboardings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress(ids: string[]) {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    if (!unique.length) return;
    try {
      setProgressLoading(true);
      const q = unique.join(",");
      const res = await fetch(`/api/onboardings/progress?ids=${encodeURIComponent(q)}`, { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json().catch(() => null)) as any;
      const raw = (json && typeof json === "object" && !Array.isArray(json) && (json.progress ?? json.data)) || json;
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
      const normalized: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw)) {
        let c: any = v;
        if (c && typeof c === "object" && !Array.isArray(c)) c = c.percent;
        const n = typeof c === "number" ? c : typeof c === "string" ? Number(c) : NaN;
        if (!Number.isNaN(n)) normalized[k] = n;
      }
      if (Object.keys(normalized).length) {
        setProgress((prev) => ({ ...prev, ...normalized }));
        setRows((prev) =>
          prev.map((row) => {
            const pct = normalized[row.id];
            if (typeof pct !== "number") return row;
            const key = statusKey(row.status);
            if (key === "locked") return row;
            if (pct >= 100 && key !== "submitted") {
              return { ...row, status: "submitted", updated_at: new Date().toISOString() };
            }
            if (pct > 0 && (key === "draft" || key === "sent")) {
              return { ...row, status: "in_progress", updated_at: new Date().toISOString() };
            }
            return row;
          })
        );
      }
    } finally {
      setProgressLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  // Auto-open create modal from ?new=1
  React.useEffect(() => {
    if (searchParams?.get("new") === "1") {
      setCreateOpen(true);
      router.replace("/dashboard/onboardings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const [tRes, cRes, mRes] = await Promise.all([
          fetch("/api/templates", { cache: "no-store" }),
          fetch("/api/clients", { cache: "no-store" }),
          fetch("/api/team/members", { cache: "no-store" }),
        ]);
        if (tRes.ok) {
          const tJson = (await tRes.json().catch(() => null)) as any;
          const list = Array.isArray(tJson?.templates)
            ? tJson.templates
            : Array.isArray(tJson?.items)
            ? tJson.items
            : Array.isArray(tJson)
            ? tJson
            : [];
          if (!cancelled) {
            setTemplates(list);
            if (!selectedTemplateId && list?.[0]?.id) setSelectedTemplateId(list[0].id);
          }
        }
        if (cRes.ok) {
          const cJson = (await cRes.json().catch(() => null)) as any;
          const list = Array.isArray(cJson?.clients)
            ? cJson.clients
            : Array.isArray(cJson?.items)
            ? cJson.items
            : Array.isArray(cJson)
            ? cJson
            : [];
          if (!cancelled) setClients(list);
        }
        if (mRes.ok) {
          const mJson = (await mRes.json().catch(() => null)) as any;
          const list = Array.isArray(mJson?.members) ? mJson.members : [];
          if (!cancelled) setMembers(list);
        }
      } catch {
        // ignore
      }
    }
    loadMeta();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const ids = rows.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;
    loadProgress(ids);
    const t = window.setInterval(() => loadProgress(ids), 30_000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((r) => r.id).join(",")]);

  const list = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return rows.filter((r) => {
      const sk = statusKey(r.status);
      const statusOk = statusFilter === "all" ? true : sk === statusFilter;
      const ownerOk =
        ownerFilter === "all"
          ? true
          : ownerFilter === "unassigned"
          ? !r.owner_id
          : r.owner_id === ownerFilter;
      if (!q) return statusOk && ownerOk;
      const hay = [
        r.title ?? "",
        r.client_name ?? "",
        r.client_email ?? "",
        r.template_title ?? "",
        r.owner_name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return statusOk && ownerOk && hay.includes(q);
    });
  }, [rows, debouncedQuery, statusFilter, ownerFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateErr(null);

    const t = title.trim();
    const em = clientEmail.trim();
    const nm = clientName.trim();

    if (!t) return setCreateErr("Title is required.");
    if (useExistingClient) {
      if (!selectedClientId) return setCreateErr("Select an existing client.");
      if (!nm) return setCreateErr("Selected client is missing a name.");
    } else {
      if (!em) return setCreateErr("Client email is required.");
      if (!nm) return setCreateErr("Client full name is required.");
    }

    try {
      setCreating(true);
      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: t,
          template_id: selectedTemplateId || null,
          owner_id: selectedOwnerId || null,
          company_name: clientCompany.trim() || null,
          client: useExistingClient ? { id: selectedClientId } : { email: em, full_name: nm || null },
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Create failed (${res.status})`);
      }
      const json = (await res.json().catch(() => null)) as any;
      setCreateOpen(false);
      setTitle("");
      setTitleTouched(false);
      setClientEmail("");
      setClientName("");
      setClientCompany("");
      setUseExistingClient(false);
      setSelectedClientId("");
      setSelectedOwnerId("");

      const created = (json?.item ?? json?.onboarding ?? null) as OnboardingRow | null;
      if (created?.id) {
        setRows((prev) => [created, ...prev.filter((x) => x.id !== created.id)]);
        void loadProgress([created.id]);
      } else {
        await load();
      }
      toast({ title: "Onboarding created", variant: "success" });
    } catch (err: any) {
      setCreateErr(err?.message || "Failed to create onboarding.");
    } finally {
      setCreating(false);
    }
  }

  function getClientLink(row: OnboardingRow): string | null {
    // client_link is built server-side with the correct custom domain — prefer it.
    if (row.client_link) return row.client_link;
    if (row.client_token) return `${window.location.origin}/c/${row.client_token}`;
    if (row.token) return `${window.location.origin}/c/${row.token}`;
    return null;
  }

  async function copyLink(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    try {
      const link = getClientLink(row);
      if (!link) throw new Error("Client link not available.");
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copied", variant: "success" });
    } catch (e: any) {
      toast({ title: "Copy failed", description: e?.message, variant: "error" });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
    }
  }

  async function sendEmail(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    try {
      const res = await fetch("/api/onboardings/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ onboarding_id: row.id, id: row.id }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Send failed (${res.status})`);
      }
      setRows((prev) =>
        prev.map((x) =>
          x.id === row.id ? { ...x, status: "sent", updated_at: new Date().toISOString() } : x
        )
      );
      toast({ title: "Email sent", variant: "success" });
    } catch (e: any) {
      toast({ title: "Send failed", description: e?.message, variant: "error" });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
    }
  }

  async function lock(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    try {
      const res = await fetch("/api/onboardings/lock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Lock failed");
      setRows((prev) =>
        prev.map((x) =>
          x.id === row.id ? { ...x, status: "locked", updated_at: new Date().toISOString() } : x
        )
      );
      toast({ title: "Onboarding locked", variant: "success" });
    } catch (e: any) {
      toast({ title: "Lock failed", description: e?.message, variant: "error" });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
    }
  }

  async function doDelete(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(row.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.text().catch(() => "")) || "Delete failed");
      setRows((prev) => prev.filter((x) => x.id !== row.id));
      setSelected((prev) => prev.filter((id) => id !== row.id));
      toast({ title: "Onboarding deleted", variant: "success" });
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "error" });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
      setConfirmDelete(null);
    }
  }

  async function bulkDelete(ids: string[], clear: () => void) {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} onboarding${ids.length === 1 ? "" : "s"}?`)) return;
    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/onboardings/${encodeURIComponent(id)}`, { method: "DELETE" }).then((r) => {
          if (!r.ok) throw new Error();
          return id;
        })
      )
    );
    const succeeded = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<string>).value);
    if (succeeded.length) {
      setRows((prev) => prev.filter((x) => !succeeded.includes(x.id)));
      toast({
        title: `${succeeded.length} deleted`,
        description: succeeded.length < ids.length ? `${ids.length - succeeded.length} failed` : undefined,
        variant: succeeded.length === ids.length ? "success" : "info",
      });
    } else {
      toast({ title: "Nothing deleted", variant: "error" });
    }
    clear();
  }

  const columns: Column<OnboardingRow>[] = [
    {
      key: "client",
      header: "Client",
      sortValue: (r) => (r.client_name || r.client_email || "").toLowerCase(),
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
            {r.client_name || "—"}
          </div>
          {r.company_name && (
            <div className="truncate text-xs text-[var(--color-text-secondary)]">{r.company_name}</div>
          )}
          <div className="truncate text-xs text-[var(--color-text-muted)]">{r.client_email || "—"}</div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      hideOnMobile: true,
      sortValue: (r) => (r.title || "").toLowerCase(),
      render: (r) => (
        <span className="truncate text-sm text-[var(--color-text-secondary)]">{r.title || "—"}</span>
      ),
    },
    {
      key: "template",
      header: "Template",
      hideOnMobile: true,
      render: (r) => (
        <span className="truncate text-sm text-[var(--color-text-muted)]">{r.template_title || "Default"}</span>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      hideOnMobile: true,
      render: (r) => (
        <span className="truncate text-sm text-[var(--color-text-muted)]">{r.owner_name || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      sortValue: (r) => statusKey(r.status),
      render: (r) => <StatusBadge status={statusKey(r.status)} />,
    },
    {
      key: "progress",
      header: "Progress",
      width: "160px",
      hideOnMobile: true,
      sortValue: (r) => progress[r.id] ?? 0,
      render: (r) => <Progress value={progress[r.id] ?? 0} size="xs" showLabel />,
    },
    {
      key: "updated",
      header: "Updated",
      hideOnMobile: true,
      width: "110px",
      align: "right",
      sortValue: (r) => new Date(r.updated_at || r.created_at || 0).getTime(),
      render: (r) => (
        <span className="text-xs tabular-nums text-[var(--color-text-muted)]">
          {toLocaleDate(r.updated_at || r.created_at)}
        </span>
      ),
    },
  ];

  const rowActions = (row: OnboardingRow) => {
    const busy = !!rowBusy[row.id];
    const sKey = statusKey(row.status);
    return (
      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <Button size="xs" variant="ghost" onClick={() => copyLink(row)} disabled={busy} title="Copy link">
          <Copy className="h-3 w-3" />
        </Button>
        {sKey !== "submitted" && sKey !== "locked" && (
          <Button size="xs" variant="ghost" onClick={() => sendEmail(row)} disabled={busy} title="Send email">
            <Send className="h-3 w-3" />
          </Button>
        )}
        {sKey === "submitted" && (
          <Button size="xs" variant="ghost" onClick={() => lock(row)} disabled={busy} title="Lock">
            <Lock className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="xs"
          variant="ghost"
          onClick={() => setConfirmDelete(row)}
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
          placeholder="Search by client, title, template…"
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
        className="sm:w-44"
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="in_progress">In progress</option>
        <option value="submitted">Submitted</option>
        <option value="locked">Locked</option>
      </Select>
      <Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="sm:w-48">
        <option value="all">All owners</option>
        <option value="unassigned">Unassigned</option>
        {members.map((m) => (
          <option key={m.user_id} value={m.user_id}>
            {(m.full_name || m.email || m.user_id).trim()}
          </option>
        ))}
      </Select>
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)] sm:justify-end">
        <span>
          {loading
            ? "Loading…"
            : `${list.length} result${list.length === 1 ? "" : "s"}`}
          {progressLoading && <span className="ml-2">Updating…</span>}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={hasEnterpriseFlag ? "Events" : "Onboardings"}
        description={hasEnterpriseFlag ? "Manage events and bulk-onboard exhibitors. Progress updates automatically." : "Create, track, and send client onboarding links. Progress updates automatically."}
        actions={
          <>
            {activeTab === "solo" && (
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
                <Button
                  size="sm"
                  variant="secondary"
                  iconLeft={<Users className="h-3.5 w-3.5" />}
                  onClick={openBulk}
                >
                  Send to many
                </Button>
                <Button size="sm" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreateOpen(true)}>
                  New onboarding
                </Button>
              </>
            )}
          </>
        }
      />

      {/* Solo / Bulk tab bar — only visible when enterprise flag is on */}
      {hasEnterpriseFlag && (
        <div className="flex gap-0.5 overflow-x-auto scrollbar-none border-b border-[var(--color-border)]">
          {(["bulk", "solo"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); localStorage.setItem("onboardings_tab", t); }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4",
                activeTab === t
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {t === "solo" ? "Solo Onboardings" : <><CalendarDays className="h-3.5 w-3.5" /><span>Bulk Onboardings (Events)</span></>}
            </button>
          ))}
        </div>
      )}

      {activeTab === "bulk" && hasEnterpriseFlag && <BulkTab hasFlag={hasEnterpriseFlag} />}

      {activeTab === "solo" && (
        <>
      {loadError && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {loadError}
        </div>
      )}

      <DataTable<OnboardingRow>
        columns={columns}
        data={list}
        getRowId={(r) => r.id}
        rowHref={(r) => `/dashboard/onboardings/${r.id}`}
        loading={loading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        toolbar={toolbar}
        rowActions={rowActions}
        defaultSort={{ key: "updated", dir: "desc" }}
        csvExport={{ filename: "onboardings" }}
        bulkBar={(ids, clear) => (
          <>
            <Button size="xs" variant="ghost" onClick={clear}>
              Clear
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
              onClick={() => bulkDelete(ids, clear)}
            >
              <Trash2 className="h-3 w-3" /> Delete {ids.length}
            </Button>
          </>
        )}
        empty={
          <div className="py-12 text-center">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">No onboardings yet</div>
            <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Create one to start collecting requirements, uploads, and signatures.
            </div>
            <div className="mt-4 flex justify-center">
              <Button iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setCreateOpen(true)}>
                New onboarding
              </Button>
            </div>
          </div>
        }
      />

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setTitleTouched(false); }}
        title="New onboarding"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setCreateOpen(false); setTitleTouched(false); }} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate as any} loading={creating}>
              Create
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">

          {/* Client section */}
          <div>
            <div className="mb-1.5 text-xs font-medium text-[var(--color-text-secondary)]">Client</div>
            <div className="mb-3 flex rounded-[var(--radius-md)] border border-[var(--color-border)] p-0.5 bg-[var(--color-bg-subtle)]">
              <button
                type="button"
                onClick={() => { setUseExistingClient(false); setSelectedClientId(""); }}
                className={cn(
                  "flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
                  !useExistingClient
                    ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                New client
              </button>
              <button
                type="button"
                onClick={() => setUseExistingClient(true)}
                className={cn(
                  "flex-1 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-colors",
                  useExistingClient
                    ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                )}
              >
                Existing client
              </button>
            </div>

            {useExistingClient ? (
              <Select
                value={selectedClientId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedClientId(id);
                  const c = clients.find((x) => x.id === id);
                  if (c) {
                    const nm = ((c.full_name ?? c.name ?? "") as string).trim();
                    setClientEmail(c.email);
                    setClientName(nm);
                    setClientCompany(((c as any).company_name ?? "") as string);
                  }
                }}
              >
                <option value="">Select a client…</option>
                {clients.map((c) => {
                  const nm = ((c.full_name ?? c.name ?? "") as string).trim();
                  return (
                    <option key={c.id} value={c.id}>
                      {(nm || "Unnamed") + " — " + c.email}
                    </option>
                  );
                })}
              </Select>
            ) : (
              <FormGrid>
                <FormField label="Full name" required>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </FormField>
                <FormField label="Email" required>
                  <Input
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    inputMode="email"
                  />
                </FormField>
              </FormGrid>
            )}
          </div>

          <FormField label="Company name">
            <Input
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </FormField>

          <div className="border-t border-[var(--color-border)]" />

          <FormField label="Title" required>
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleTouched(true); }}
              placeholder="Filled from company name"
            />
          </FormField>

          <FormGrid>
            <FormField label="Template">
              <Select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
                {templates.length === 0 ? (
                  <option value="" disabled>No templates</option>
                ) : (
                  templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                )}
              </Select>
            </FormField>
            <FormField label="Owner">
              <Select value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)}>
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {(m.full_name || m.email || m.user_id).trim()}
                  </option>
                ))}
              </Select>
            </FormField>
          </FormGrid>

          {createErr && (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">
              {createErr}
            </div>
          )}

          <button type="submit" className="hidden" />
        </form>
      </Modal>

      {/* ─── Bulk send modal ─────────────────────────────────────────── */}
      <Modal
        open={bulkOpen}
        onClose={closeBulk}
        size="xl"
        title="Send template to many"
        description="Pick a template, add recipients, send invitations in one go."
        dismissOnBackdrop={!bulkSending}
        hideClose={bulkSending}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeBulk} disabled={bulkSending}>
              {bulkResults ? "Close" : "Cancel"}
            </Button>
            {!bulkResults ? (
              <Button onClick={runBulkSend} loading={bulkSending} disabled={bulkSending || bulkRecipients.length === 0}>
                {bulkSending
                  ? `Sending ${bulkProgress?.done ?? 0} of ${bulkProgress?.total ?? 0}…`
                  : `Send to ${bulkRecipients.length || 0} recipient${bulkRecipients.length === 1 ? "" : "s"}`}
              </Button>
            ) : null}
          </div>
        }
      >
        <div className="space-y-5">
          {bulkResults ? (
            <div className="space-y-3">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-sm">
                <div className="font-semibold text-[var(--color-text-primary)]">
                  Done — {bulkResults.filter((r) => r.status === "sent").length} sent,{" "}
                  {bulkResults.filter((r) => r.status === "created").length} created (no email),{" "}
                  {bulkResults.filter((r) => r.status === "error").length} failed
                </div>
              </div>
              <ul className="max-h-[320px] divide-y divide-[var(--color-border)] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
                {bulkResults.map((res) => {
                  const r = bulkRecipients.find((x) => x.key === res.key);
                  return (
                    <li key={res.key} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-[var(--color-text-primary)]">
                          {r?.full_name || r?.email || res.key}
                        </div>
                        <div className="truncate text-xs text-[var(--color-text-muted)]">{r?.email}</div>
                      </div>
                      {res.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-success)]">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                        </span>
                      ) : res.status === "created" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-warning)]">
                          <AlertCircle className="h-3.5 w-3.5" /> Created, email failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-danger)]" title={res.message}>
                          <AlertCircle className="h-3.5 w-3.5" /> Failed
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {/* Template select */}
              <FormField label="Template" required>
                <Select
                  value={bulkTemplateId}
                  onChange={(e) => setBulkTemplateId(e.target.value)}
                  disabled={bulkSending}
                >
                  <option value="">No template — blank onboarding</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Select>
              </FormField>

              {/* Pick from existing clients — multi-select */}
              {clients.length > 0 ? (
                <FormField
                  label="Pick recipients from your clients"
                  hint="Tick the clients you want, then click Add selected."
                >
                  <Input
                    value={bulkClientSearch}
                    onChange={(e) => setBulkClientSearch(e.target.value)}
                    placeholder="Search clients…"
                    disabled={bulkSending}
                  />
                  {filteredBulkClients.length > 0 ? (
                    <>
                      <div className="mt-2 flex items-center justify-between gap-2 px-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            const allChecked = filteredBulkClients.every((c) =>
                              bulkClientChecked.has(c.id)
                            );
                            setBulkClientChecked((prev) => {
                              const next = new Set(prev);
                              if (allChecked) {
                                filteredBulkClients.forEach((c) => next.delete(c.id));
                              } else {
                                filteredBulkClients.forEach((c) => next.add(c.id));
                              }
                              return next;
                            });
                          }}
                          disabled={bulkSending}
                          className="font-medium text-[var(--color-accent)] hover:underline disabled:opacity-50"
                        >
                          {filteredBulkClients.every((c) => bulkClientChecked.has(c.id))
                            ? "Clear all visible"
                            : `Select all ${filteredBulkClients.length} visible`}
                        </button>
                        <span className="text-[var(--color-text-muted)]">
                          {bulkClientChecked.size} selected
                        </span>
                      </div>
                      <ul className="mt-1 max-h-[220px] divide-y divide-[var(--color-border)] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
                        {filteredBulkClients.map((c) => {
                          const checked = bulkClientChecked.has(c.id);
                          return (
                            <li key={c.id}>
                              <label
                                className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-[var(--color-bg-subtle)]"
                              >
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
                                  checked={checked}
                                  onChange={() => toggleBulkClientChecked(c.id)}
                                  disabled={bulkSending}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium text-[var(--color-text-primary)]">
                                    {c.full_name || c.name || "—"}
                                  </div>
                                  <div className="truncate text-xs text-[var(--color-text-muted)]">
                                    {c.email}
                                    {c.company_name ? ` · ${c.company_name}` : ""}
                                  </div>
                                </div>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={addSelectedBulkClients}
                          disabled={bulkSending || bulkClientChecked.size === 0}
                          iconLeft={<Plus className="h-3.5 w-3.5" />}
                        >
                          Add {bulkClientChecked.size || 0} selected
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-3 py-3 text-xs text-[var(--color-text-muted)]">
                      No clients match — or all matches are already added.
                    </div>
                  )}
                </FormField>
              ) : (
                <FormField label="Pick recipients from your clients">
                  <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
                    You don&rsquo;t have any clients yet.{" "}
                    <Link href="/dashboard/clients" className="font-semibold text-[var(--color-accent)] hover:underline">
                      Add a client
                    </Link>{" "}
                    first, then come back here to send the template to many.
                  </div>
                </FormField>
              )}

              {/* Selected chips */}
              <FormField label={`Selected recipients (${bulkRecipients.length})`}>
                {bulkRecipients.length === 0 ? (
                  <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-3 py-6 text-center text-xs text-[var(--color-text-muted)]">
                    No recipients yet. Tick clients above and click Add selected.
                  </div>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {bulkRecipients.map((r) => (
                      <li
                        key={r.key}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-1 pl-3 pr-1 text-xs"
                      >
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {r.full_name || r.email}
                        </span>
                        <span className="text-[var(--color-text-muted)]">{r.email}</span>
                        <button
                          type="button"
                          onClick={() => removeBulkRecipient(r.key)}
                          disabled={bulkSending}
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
                          aria-label={`Remove ${r.email}`}
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </FormField>

              {bulkErr ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">
                  {bulkErr}
                </div>
              ) : null}

              {bulkSending && bulkProgress ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                  Sending {bulkProgress.done} of {bulkProgress.total}…
                </div>
              ) : null}
            </>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await doDelete(confirmDelete);
        }}
        title="Delete onboarding?"
        description={
          confirmDelete ? (
            <>
              This permanently deletes <b>{confirmDelete.title || "Untitled"}</b> and cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        destructive
      />
        </>
      )}
    </div>
  );
}
