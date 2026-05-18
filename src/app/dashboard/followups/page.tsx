"use client";

import * as React from "react";
import { RefreshCw, ChevronDown, ChevronRight, Play, Clock, CheckCircle2, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FormField, FormGrid } from "@/components/ui/form-field";
import { Tag } from "@/components/ui/status-badge";
import { RejectionBanner } from "@/components/ui/rejection-banner";
import { PageHeader } from "@/components/ui/page-header";
import type { StatusTone } from "@/lib/status";

type Settings = {
  id: string;
  followup_delay_days: number;
  followup_max_count: number;
  followup_send_hour: number;
  followup_timezone: string;
};

type Job = {
  id: string;
  onboarding_id: string;
  to_email: string;
  subject: string;
  due_at: string;
  status: string;
  last_error: string | null;
  created_at: string;
  client_name: string | null;
  client_email: string | null;
  onboarding_title: string | null;
};

type SentReminder = {
  id: string;
  rule_id: string;
  phase_number: number | null;
  sent_at: string;
  subject: string;
  rule_type: string | null;
  trigger_offset_days: number | null;
};

type UpcomingReminder = {
  rule_id: string;
  subject: string;
  rule_type: string;
  trigger_offset_days: number;
  phase_number: number | null;
};

type Exhibitor = {
  onboarding_id: string;
  client_name: string | null;
  client_email: string | null;
  onboarding_title: string | null;
  status: string;
  upcoming_reminders: UpcomingReminder[];
  sent_reminders: SentReminder[];
};

type EventGroup = {
  id: string;
  name: string;
  end_date: string | null;
  start_date: string | null;
  exhibitors: Exhibitor[];
};

function fmt(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return s;
  }
}

function statusTone(status: string): StatusTone {
  const s = (status || "").toLowerCase();
  if (s === "sent") return "success";
  if (s === "failed") return "danger";
  if (s === "cancelled") return "neutral";
  if (s === "pending" || s === "queued") return "info";
  return "neutral";
}

function ruleTypeLabel(type: string | null, offsetDays: number | null) {
  if (type === "deadline_based" && offsetDays != null) return `${offsetDays}d before deadline`;
  if (type === "inactivity_based" && offsetDays != null) return `after ${offsetDays}d inactive`;
  if (type === "missing_item_based") return "missing items";
  return type ?? "rule";
}

function PersonInitial({ name, email }: { name: string | null; email: string | null }) {
  const label = name || email || "?";
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-[10px] font-bold text-[var(--color-accent)]">
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

function PersonName({ name, email }: { name: string | null; email: string | null }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
        {name || email || "Unknown"}
      </div>
      {name && email && (
        <div className="truncate text-xs text-[var(--color-text-muted)]">{email}</div>
      )}
    </div>
  );
}

// Solo follow-ups accordion — one row per onboarding (person)
function SoloPersonRow({
  jobs,
  onMarkDone,
  markingJobId,
}: {
  jobs: Job[];
  onMarkDone: (job: Job) => void;
  markingJobId: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const pending = jobs.filter((j) => j.status === "pending" || j.status === "queued" || j.status === "failed");
  const done = jobs.filter((j) => j.status === "sent" || j.status === "cancelled");
  const first = jobs[0];

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        )}
        <PersonInitial name={first.client_name} email={first.client_email} />
        <PersonName name={first.client_name} email={first.client_email} />
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {pending.length > 0 && (
            <Tag tone="info">{pending.length} upcoming</Tag>
          )}
          {done.length > 0 && (
            <Tag tone="success">{done.length} sent</Tag>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 pb-4 pt-3">
          {first.onboarding_title && (
            <p className="mb-3 text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              {first.onboarding_title}
            </p>
          )}

          {pending.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <Clock className="h-3 w-3" />
                Upcoming
              </div>
              <div className="space-y-2">
                {pending.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{j.subject}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Due: {fmt(j.due_at)}
                        {j.status === "failed" && j.last_error && (
                          <span className="ml-2 text-[var(--color-danger)]">Error: {j.last_error}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Tag tone={statusTone(j.status)}>{j.status}</Tag>
                      {j.status !== "sent" && j.status !== "cancelled" && (
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => onMarkDone(j)}
                          disabled={markingJobId === j.id}
                        >
                          {markingJobId === j.id ? "…" : "Mark done"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <CheckCircle2 className="h-3 w-3" />
                Already sent
              </div>
              <div className="space-y-2">
                {done.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 opacity-70"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--color-text-secondary)]">{j.subject}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">Sent: {fmt(j.due_at)}</p>
                    </div>
                    <Tag tone={statusTone(j.status)}>{j.status}</Tag>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pending.length === 0 && done.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)]">No follow-ups scheduled.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Event reminders: exhibitor row inside an event
function ExhibitorRow({ exhibitor }: { exhibitor: Exhibitor }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-6 py-2.5 text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
        )}
        <PersonInitial name={exhibitor.client_name} email={exhibitor.client_email} />
        <PersonName name={exhibitor.client_name} email={exhibitor.client_email} />
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {exhibitor.upcoming_reminders.length > 0 && (
            <Tag tone="info">{exhibitor.upcoming_reminders.length} upcoming</Tag>
          )}
          {exhibitor.sent_reminders.length > 0 && (
            <Tag tone="success">{exhibitor.sent_reminders.length} sent</Tag>
          )}
          {exhibitor.upcoming_reminders.length === 0 && exhibitor.sent_reminders.length === 0 && (
            <span className="text-[11px] text-[var(--color-text-muted)]">no reminders</span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-6 pb-3 pt-2.5">
          {exhibitor.upcoming_reminders.length > 0 && (
            <div className="mb-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <Clock className="h-3 w-3" />
                Upcoming reminders
              </div>
              <div className="space-y-1.5">
                {exhibitor.upcoming_reminders.map((r) => (
                  <div
                    key={r.rule_id + (r.phase_number ?? "")}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{r.subject}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        {ruleTypeLabel(r.rule_type, r.trigger_offset_days)}
                        {r.phase_number ? ` · Phase ${r.phase_number}` : ""}
                      </p>
                    </div>
                    <Tag tone="info">scheduled</Tag>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exhibitor.sent_reminders.length > 0 && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <CheckCircle2 className="h-3 w-3" />
                Already sent
              </div>
              <div className="space-y-1.5">
                {exhibitor.sent_reminders.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 opacity-70"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--color-text-secondary)]">{r.subject}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Sent: {fmt(r.sent_at)}
                        {r.phase_number ? ` · Phase ${r.phase_number}` : ""}
                      </p>
                    </div>
                    <Tag tone="success">sent</Tag>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exhibitor.upcoming_reminders.length === 0 && exhibitor.sent_reminders.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)]">No reminders scheduled or sent.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Event accordion row
function EventRow({ event }: { event: EventGroup }) {
  const [open, setOpen] = React.useState(false);
  const totalUpcoming = event.exhibitors.reduce((n, e) => n + e.upcoming_reminders.length, 0);
  const totalSent = event.exhibitors.reduce((n, e) => n + e.sent_reminders.length, 0);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" />
        )}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)]">
          <CalendarDays className="h-3.5 w-3.5 text-[var(--color-accent)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{event.name}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            {event.exhibitors.length} exhibitor{event.exhibitors.length !== 1 ? "s" : ""}
            {event.end_date ? ` · ends ${fmt(event.end_date)}` : ""}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          {totalUpcoming > 0 && <Tag tone="info">{totalUpcoming} upcoming</Tag>}
          {totalSent > 0 && <Tag tone="success">{totalSent} sent</Tag>}
        </div>
      </button>

      {open && (
        <div className="border-t border-[var(--color-border)]">
          {event.exhibitors.length === 0 ? (
            <p className="px-6 py-3 text-sm text-[var(--color-text-muted)]">No exhibitors yet.</p>
          ) : (
            event.exhibitors.map((ex) => (
              <ExhibitorRow key={ex.onboarding_id} exhibitor={ex} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function FollowupsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [events, setEvents] = React.useState<EventGroup[]>([]);
  const [isEnterprise, setIsEnterprise] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [markingJobId, setMarkingJobId] = React.useState<string | null>(null);
  const [runningCron, setRunningCron] = React.useState(false);

  const [alert, setAlert] = React.useState<null | {
    variant: "success" | "error" | "info";
    title: string;
    description?: string;
  }>(null);

  const [delayDays, setDelayDays] = React.useState("3");
  const [maxCount, setMaxCount] = React.useState("3");
  const [sendHour, setSendHour] = React.useState("9");
  const [tz, setTz] = React.useState("UTC");
  const [saving, setSaving] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [canEditSettings, setCanEditSettings] = React.useState(true);
  const [canRunCron, setCanRunCron] = React.useState(true);

  React.useEffect(() => { setMounted(true); }, []);

  const [timezones, setTimezones] = React.useState<string[]>([
    "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Toronto", "Europe/London", "Europe/Paris", "Europe/Berlin",
    "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
  ]);

  React.useEffect(() => {
    try {
      const anyIntl: any = Intl as any;
      if (anyIntl?.supportedValuesOf) {
        const list = anyIntl.supportedValuesOf("timeZone") as string[];
        if (Array.isArray(list) && list.length > 0) {
          setTimezones(list);
          setTz((prev) => (list.includes(prev) ? prev : "UTC"));
        }
      }
    } catch { /* ignore */ }
  }, []);

  const sendPreview = React.useMemo(() => {
    if (!mounted) return null;
    try {
      const hour = Number(sendHour);
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
      const dt = new Date();
      dt.setHours(hour, 0, 0, 0);
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit", minute: "2-digit", timeZone: tz || "UTC", timeZoneName: "short",
      }).format(dt);
    } catch { return null; }
  }, [sendHour, tz, mounted]);

  async function loadAll() {
    setAlert(null);
    setLoading(true);
    try {
      const [settingsRes, jobsRes, teamRes] = await Promise.all([
        fetch("/api/cron/followups/settings", { cache: "no-store" }),
        fetch("/api/cron/followups", { cache: "no-store" }),
        fetch("/api/team", { cache: "no-store" }),
      ]);

      const settingsJson = await settingsRes.json().catch(() => null);
      if (settingsRes.ok && settingsJson?.settings) {
        const s = settingsJson.settings;
        setSettings(s);
        setDelayDays(String(s.followup_delay_days));
        setMaxCount(String(s.followup_max_count));
        setSendHour(String(s.followup_send_hour));
        setTz(String(s.followup_timezone || "UTC"));
      }

      const jobsJson = await jobsRes.json().catch(() => null);
      setJobs(Array.isArray(jobsJson?.items) ? jobsJson.items : []);

      const teamJson = await teamRes.json().catch(() => null);
      const enterprise = teamJson?.org?.feature_flags?.enterprise_onboarding === true;
      setIsEnterprise(enterprise);

      if (enterprise) {
        const evRes = await fetch("/api/followups/event-reminders", { cache: "no-store" });
        const evJson = await evRes.json().catch(() => null);
        setEvents(Array.isArray(evJson?.events) ? evJson.events : []);
      }
    } catch (e: any) {
      setAlert({ variant: "error", title: "Load failed", description: e?.message ?? "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { loadAll(); }, []);

  async function saveTiming() {
    setSaving(true);
    try {
      const payload = {
        followup_delay_days: Number(delayDays),
        followup_max_count: Number(maxCount),
        followup_send_hour: Number(sendHour),
        followup_timezone: tz.trim() || "UTC",
      };
      const res = await fetch("/api/cron/followups/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 403) {
          setCanEditSettings(false);
          setAlert({ variant: "info", title: "Permission required", description: "Only admins can change follow-up settings." });
          return;
        }
        throw new Error(json?.error || "Save failed");
      }
      setCanEditSettings(true);
      setAlert({ variant: "success", title: "Saved", description: "Follow-up timing updated." });
    } catch (e: any) {
      setAlert({ variant: "error", title: "Save failed", description: e?.message ?? "Unknown error" });
    } finally {
      setSaving(false);
    }
  }

  async function runCronNow() {
    setRunningCron(true);
    try {
      const res = await fetch("/api/cron/followups/run-now", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 403) {
          setCanRunCron(false);
          setAlert({ variant: "info", title: "Permission required", description: "Only admins can run follow-ups manually." });
          return;
        }
        throw new Error(json?.error ?? "Failed");
      }
      setCanRunCron(true);
      setAlert({ variant: "success", title: "Cron executed", description: `Processed ${json.processed} / sent ${json.sent} / failed ${json.failed}` });
      await loadAll();
    } catch (e: any) {
      setAlert({ variant: "error", title: "Run failed", description: e?.message ?? "Unknown error" });
    } finally {
      setRunningCron(false);
    }
  }

  async function markDone(job: Job) {
    if (markingJobId) return;
    const prev = jobs;
    setMarkingJobId(job.id);
    setJobs((j) => j.map((x) => x.id === job.id ? { ...x, status: "sent" } : x));
    try {
      const res = await fetch("/api/cron/followups", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: job.id, status: "sent" }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Update failed");
    } catch (e: any) {
      setJobs(prev);
      setAlert({ variant: "error", title: "Update failed", description: e?.message ?? "Unknown error" });
    } finally {
      setMarkingJobId(null);
    }
  }

  // Group solo jobs by onboarding_id
  const soloGroups = React.useMemo(() => {
    const map = new Map<string, Job[]>();
    for (const j of jobs) {
      if (!map.has(j.onboarding_id)) map.set(j.onboarding_id, []);
      map.get(j.onboarding_id)!.push(j);
    }
    return Array.from(map.values());
  }, [jobs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Monitor scheduled reminders and event-based follow-ups."
        actions={
          <>
            <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={loadAll} disabled={loading}>
              Refresh
            </Button>
            <Button size="sm" iconLeft={<Play className="h-3.5 w-3.5" />} onClick={runCronNow} disabled={!canRunCron || runningCron} loading={runningCron}>
              Run cron now
            </Button>
          </>
        }
      />

      {alert && (
        alert.variant === "success" ? (
          <div className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] px-3 py-2.5 text-sm text-[var(--color-success)]">
            <div>
              <div className="font-medium">{alert.title}</div>
              {alert.description && <div className="mt-0.5 text-xs opacity-90">{alert.description}</div>}
            </div>
            <button type="button" className="shrink-0 text-xs opacity-60 hover:opacity-100" onClick={() => setAlert(null)} aria-label="Dismiss">✕</button>
          </div>
        ) : (
          <RejectionBanner
            kind={/plan|upgrade/i.test(`${alert.title} ${alert.description ?? ""}`) ? "plan" : /permission/i.test(alert.title) ? "permission" : "error"}
            message={alert.description ? `${alert.title}: ${alert.description}` : alert.title}
            onDismiss={() => setAlert(null)}
          />
        )
      )}

      {/* Timing settings */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Timing</CardTitle>
            <CardDescription>
              {canEditSettings ? "Applied when new follow-up jobs are scheduled." : "Only admins and owners can change timing."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormGrid className="sm:grid-cols-2 lg:grid-cols-4">
            <FormField label="Delay (days)">
              <Input value={delayDays} disabled={!canEditSettings} onChange={(e) => setDelayDays(e.target.value)} />
            </FormField>
            <FormField label="Max follow-ups">
              <Input value={maxCount} disabled={!canEditSettings} onChange={(e) => setMaxCount(e.target.value)} />
            </FormField>
            <FormField label="Send hour">
              <Select value={sendHour} disabled={!canEditSettings} onChange={(e) => setSendHour(e.target.value)}>
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={String(h)}>{String(h).padStart(2, "0")}:00</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Timezone">
              <Select value={tz} disabled={!canEditSettings} onChange={(e) => setTz(e.target.value)}>
                {timezones.map((z) => <option key={z} value={z}>{z}</option>)}
              </Select>
            </FormField>
          </FormGrid>
          {sendPreview && (
            <div className="text-xs text-[var(--color-text-muted)]">
              Sends at about <span className="font-medium text-[var(--color-text-secondary)]">{sendPreview}</span> in <span className="font-medium text-[var(--color-text-secondary)]">{tz}</span>
            </div>
          )}
          <Button onClick={saveTiming} loading={saving} disabled={saving || !canEditSettings}>
            {canEditSettings ? "Save timing" : "Admins can change timing"}
          </Button>
          {settings && (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
              Current: {settings.followup_max_count} follow-ups, every {settings.followup_delay_days} day(s), send hour {settings.followup_send_hour} ({settings.followup_timezone})
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solo Follow-ups */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Solo Follow-ups</CardTitle>
            <CardDescription>Scheduled reminder emails for individual onboardings.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">Loading…</p>
          ) : soloGroups.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">No follow-up jobs found.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {soloGroups.map((group) => (
                <SoloPersonRow
                  key={group[0].onboarding_id}
                  jobs={group}
                  onMarkDone={markDone}
                  markingJobId={markingJobId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Reminders — enterprise only */}
      {isEnterprise && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Event Reminders</CardTitle>
              <CardDescription>Automated reminder rules sent to exhibitors based on deadlines and activity.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">Loading…</p>
            ) : events.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">No events found.</p>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {events.map((ev) => (
                  <EventRow key={ev.id} event={ev} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
