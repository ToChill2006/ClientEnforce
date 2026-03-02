"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
};

function fmt(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

function statusPill(status: string) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  const s = (status || "").toLowerCase();
  if (s === "sent") return `${base} border-zinc-200 bg-zinc-100 text-zinc-900`;
  if (s === "failed") return `${base} border-zinc-200 bg-white text-zinc-700`;
  if (s === "cancelled") return `${base} border-zinc-200 bg-white text-zinc-500`;
  return `${base} border-zinc-200 bg-zinc-50 text-zinc-800`;
}

export default function FollowupsPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [alert, setAlert] = React.useState<null | { variant: "success" | "error" | "info"; title: string; description?: string }>(null);

  const [q, setQ] = React.useState("");

  const [delayDays, setDelayDays] = React.useState("3");
  const [maxCount, setMaxCount] = React.useState("3");
  const [sendHour, setSendHour] = React.useState("9");
  const [tz, setTz] = React.useState("UTC");
  const [saving, setSaving] = React.useState(false);

  const TIMEZONES = React.useMemo(() => {
    try {
      // Modern browsers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyIntl: any = Intl as any;
      if (anyIntl?.supportedValuesOf) {
        const list = anyIntl.supportedValuesOf("timeZone") as string[];
        // Keep list usable (some browsers return huge lists)
        return Array.isArray(list) && list.length > 0 ? list : ["UTC"];
      }
    } catch {
      // ignore
    }

    // Fallback curated list
    return [
      "UTC",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Madrid",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Toronto",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Sydney",
    ];
  }, []);

  const sendPreview = React.useMemo(() => {
    try {
      const hour = Number(sendHour);
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
      const dt = new Date();
      dt.setSeconds(0, 0);
      dt.setHours(hour, 0, 0, 0);
      const formatted = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz || "UTC",
        timeZoneName: "short",
      }).format(dt);
      return formatted;
    } catch {
      return null;
    }
  }, [sendHour, tz]);

  async function loadSettings() {
    const res = await fetch("/api/cron/followups/settings", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Failed to load settings");
    const s: Settings | null = json?.settings ?? null;
    setSettings(s);
    if (s) {
      setDelayDays(String(s.followup_delay_days));
      setMaxCount(String(s.followup_max_count));
      setSendHour(String(s.followup_send_hour));
      setTz(String(s.followup_timezone || "UTC"));
    }
  }

  async function loadJobs() {
    // Use your existing endpoint (do not change backend behavior)
    const res = await fetch("/api/cron/followups", { method: "GET", cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Failed to load follow-ups");
    setJobs(Array.isArray(json?.items) ? json.items : []);
  }

  async function loadAll() {
    setAlert(null);
    setLoading(true);
    try {
      await Promise.all([loadSettings(), loadJobs()]);
    } catch (e: any) {
      console.error(e);
      setAlert({ variant: "error", title: "Load failed", description: e?.message ?? "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (!res.ok) throw new Error(json?.error || "Save failed");

      setAlert({ variant: "success", title: "Saved", description: "Follow-up timing updated for future schedules." });
      await loadSettings();
    } catch (e: any) {
      console.error(e);
      setAlert({ variant: "error", title: "Save failed", description: e?.message ?? "Unknown error" });
    } finally {
      setSaving(false);
    }
  }

  async function runCronNow() {
    try {
      const res = await fetch("/api/cron/followups/run-now", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setAlert({
        variant: "success",
        title: "Cron executed",
        description: `Processed ${json.processed} / sent ${json.sent} / failed ${json.failed}`,
      });
      await loadJobs();
    } catch (e: any) {
      console.error(e);
      setAlert({ variant: "error", title: "Run failed", description: e?.message ?? "Unknown error" });
    }
  }

  const filtered = jobs.filter((j) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      (j.to_email || "").toLowerCase().includes(term) ||
      (j.subject || "").toLowerCase().includes(term) ||
      (j.status || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Follow-ups</h1>
        <p className="mt-1 text-sm text-zinc-600">Configure timing and monitor scheduled reminder emails.</p>
      </div>
      {alert ? (
        <div
          className={
            alert.variant === "error"
              ? "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              : alert.variant === "success"
                ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                : "rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">{alert.title}</div>
              {alert.description ? <div className="mt-0.5 text-sm opacity-90">{alert.description}</div> : null}
            </div>
            <button
              type="button"
              className="text-xs opacity-70 hover:opacity-100"
              onClick={() => setAlert(null)}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Timing</CardTitle>
          <CardDescription>These settings apply when new follow-up jobs are scheduled.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Delay (days)</div>
              <Input value={delayDays} onChange={(e) => setDelayDays(e.target.value)} />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Max follow-ups</div>
              <Input value={maxCount} onChange={(e) => setMaxCount(e.target.value)} />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Send hour</div>
              <select
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                value={sendHour}
                onChange={(e) => setSendHour(e.target.value)}
              >
                {Array.from({ length: 24 }).map((_, h) => {
                  const label = `${String(h).padStart(2, "0")}:00`;
                  return (
                    <option key={h} value={String(h)}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Timezone</div>
              <select
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
              >
                {TIMEZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {sendPreview ? (
            <div className="text-xs text-zinc-500">
              Preview: sends at about <span className="font-medium text-zinc-700">{sendPreview}</span> in <span className="font-medium text-zinc-700">{tz}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={saveTiming} disabled={saving}>
              {saving ? "Saving..." : "Save timing"}
            </Button>
            <Button variant="secondary" onClick={loadAll}>
              Refresh
            </Button>
            <Button variant="secondary" onClick={runCronNow}>
              Run cron now
            </Button>
          </div>

          {settings ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800">
              Current: {settings.followup_max_count} follow-ups, every {settings.followup_delay_days} day(s), send hour{" "}
              {settings.followup_send_hour} ({settings.followup_timezone})
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming jobs</CardTitle>
          <CardDescription>Queued reminder emails and their due times.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-sm">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email, subject, status..." />
            </div>
            <div className="text-xs text-zinc-500">{loading ? "Loading..." : `${filtered.length} job(s)`}</div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2 text-left">To</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Due</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Last error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td className="px-4 py-3 text-zinc-600" colSpan={5}>
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-zinc-600" colSpan={5}>
                      No follow-up jobs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((j) => (
                    <tr key={j.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{j.to_email}</div>
                        <div className="text-xs text-zinc-500 font-mono">{j.onboarding_id}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-800">{j.subject}</td>
                      <td className="px-4 py-3 text-zinc-700">{fmt(j.due_at)}</td>
                      <td className="px-4 py-3">
                        <span className={statusPill(j.status)}>{j.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-600">{j.last_error ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}