"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";

type QueueItem = {
  phase_id: string;
  phase_number: number;
  phase_name: string;
  deadline: string | null;
  days_until_deadline: number | null;
  onboarding_id: string;
  onboarding_title: string | null;
  client_name: string | null;
  client_email: string | null;
  event_name: string | null;
  template_name: string | null;
  updated_at: string | null;
};

function DeadlineBadge({ days }: { days: number | null }) {
  if (days === null) return <span className="text-xs text-[var(--color-text-muted)]">—</span>;
  if (days < 0) return <Tag tone="danger">Overdue {Math.abs(days)}d</Tag>;
  if (days <= 3) return <Tag tone="warning">{days}d left</Tag>;
  return <span className="text-xs text-[var(--color-text-muted)]">{days}d</span>;
}

export default function ReviewQueuePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = React.useState<QueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/review-queue", { cache: "no-store" });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || `Failed to load review queue (${res.status})`);
      }
      const json = await res.json();
      setItems(json.phases ?? []);
    } catch (e: any) {
      setError(e?.message || "Failed to load review queue.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  const columns: Column<QueueItem>[] = [
    {
      key: "client",
      header: "Exhibitor",
      sortValue: (r) => r.client_name?.toLowerCase() ?? "",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">{r.client_name || "—"}</div>
          <div className="truncate text-xs text-[var(--color-text-muted)]">{r.client_email || "—"}</div>
        </div>
      ),
    },
    {
      key: "event",
      header: "Event",
      hideOnMobile: true,
      render: (r) => <span className="text-sm text-[var(--color-text-secondary)]">{r.event_name || "—"}</span>,
    },
    {
      key: "template",
      header: "Template",
      hideOnMobile: true,
      render: (r) => r.template_name ? <Tag tone="info">{r.template_name}</Tag> : <span className="text-xs text-[var(--color-text-muted)]">—</span>,
    },
    {
      key: "phase",
      header: "Phase",
      render: (r) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          Phase {r.phase_number} — {r.phase_name}
        </span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      width: "110px",
      render: (r) => <DeadlineBadge days={r.days_until_deadline} />,
    },
    {
      key: "action",
      header: "",
      width: "100px",
      align: "right",
      render: (r) => (
        <Button
          size="xs"
          onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/onboardings/${r.onboarding_id}?review=${r.phase_number}`); }}
        >
          Review →
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Queue"
        description="Phases awaiting your review, sorted by deadline urgency."
        actions={
          <Button variant="outline" size="sm" iconLeft={<RefreshCw className="h-3.5 w-3.5" />} onClick={load} disabled={loading}>
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <DataTable<QueueItem>
        columns={columns}
        data={items}
        getRowId={(r) => r.phase_id}
        rowHref={(r) => `/dashboard/onboardings/${r.onboarding_id}?review=${r.phase_number}`}
        loading={loading}
        defaultSort={{ key: "deadline", dir: "asc" }}
        empty={
          <div className="py-12 text-center">
            <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-[var(--color-success)]" />
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">All caught up</div>
            <div className="mt-1 text-sm text-[var(--color-text-secondary)]">No phases are currently awaiting review.</div>
          </div>
        }
      />
    </div>
  );
}
