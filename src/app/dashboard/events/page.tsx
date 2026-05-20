"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, Loader2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { DeadlineBadge } from "@/components/ui/deadline-badge";

type EventSummary = {
  id: string;
  name: string;
  end_date: string | null;
  submission_deadline?: string | null;
  location: string | null;
  status: string;
  exhibitor_count: number;
  phase_status_counts: Record<string, number>;
};

export default function EventsPage() {
  const [events, setEvents] = React.useState<EventSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/events", { cache: "no-store" })
      .then(async (r) => {
        const json = await r.json().catch(() => null);
        if (!r.ok) throw new Error(json?.error || "Failed to load events");
        setEvents(json.events ?? []);
      })
      .catch((e) => setError(e?.message ?? "Error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Events you have access to"
      />

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-text-muted)]" />
        </div>
      ) : error ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-danger-border)] bg-[var(--color-danger-subtle)] p-4 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] py-16 text-center">
          <CalendarDays className="mb-3 h-8 w-8 text-[var(--color-text-muted)] opacity-40" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">No events assigned</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Contact your administrator to get access to events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const counts = ev.phase_status_counts ?? {};
            const total = ev.exhibitor_count;
            const completed = (counts.approved ?? 0) + (counts.completed ?? 0);
            const awaitingReview = counts.awaiting_review ?? 0;
            const inProgress = counts.in_progress ?? 0;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <Link
                key={ev.id}
                href={`/dashboard/events/${ev.id}`}
                className="group block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
                      {ev.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--color-text-muted)]">
                      {ev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {ev.location}
                        </span>
                      )}
                      {ev.end_date && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(ev.end_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-medium ${
                    ev.status === "completed" ? "bg-[var(--color-success-subtle,#d1fae5)] text-[var(--color-success,#059669)]" :
                    ev.status === "in_progress" ? "bg-[var(--color-accent-subtle,#dbeafe)] text-[var(--color-accent,#2563eb)]" :
                    "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"
                  }`}>
                    {ev.status === "in_progress" ? "In Progress" :
                     ev.status === "completed" ? "Completed" :
                     ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}
                  </span>
                </div>

                {ev.submission_deadline && (
                  <div className="mt-2 text-xs">
                    <span className="text-[var(--color-text-muted)]">Deadline: </span>
                    <DeadlineBadge deadline={ev.submission_deadline} />
                  </div>
                )}

                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{total} exhibitor{total !== 1 ? "s" : ""}</span>
                    <span className="font-medium text-[var(--color-accent)]">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                    <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[10px] text-[var(--color-text-muted)]">
                    {inProgress > 0 && <span className="text-[var(--color-accent)]">{inProgress} in progress</span>}
                    {awaitingReview > 0 && <span className="text-[var(--color-warning)]">{awaitingReview} needs review</span>}
                    {completed > 0 && <span className="text-[var(--color-success)]">{completed} done</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
