"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { RejectionBanner } from "@/components/ui/rejection-banner";
import { PageHeader } from "@/components/ui/page-header";
import { RefreshCw, UserPlus } from "lucide-react";
import { ROLE_LABELS, type Role } from "@/lib/permissions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high" | "urgent";

type Member = {
  user_id: string;
  role: "owner" | "admin" | "member" | "onboarder" | "reviewer" | "external_viewer";
  email: string | null;
  full_name: string | null;
};

type Task = {
  id: string;
  created_by: string;
  assigned_to: string;
  title: string;
  description: string | null;       // raw stored value (includes priority prefix)
  priority: Priority;               // parsed from description prefix
  rawDescription: string | null;    // description with prefix stripped
  status: "open" | "in_progress" | "done" | "archived";
  due_at: string | null;
  updated_at: string;
  isOverdue: boolean;
};

type Me = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Tab = "members" | "tasks" | "workload" | "activity" | "chat";

// ─── Priority helpers ─────────────────────────────────────────────────────────
// Priority is encoded as a prefix in the description: "[P:high] rest of text"
// This lets it persist in the existing API without schema changes.

const PRIORITY_PREFIX_RE = /^\[P:(low|medium|high|urgent)\]\s*/i;

function parsePriority(description: string | null): { priority: Priority; rawDescription: string | null } {
  if (!description) return { priority: "medium", rawDescription: null };
  const m = description.match(PRIORITY_PREFIX_RE);
  if (!m) return { priority: "medium", rawDescription: description || null };
  const priority = m[1].toLowerCase() as Priority;
  const rawDescription = description.slice(m[0].length) || null;
  return { priority, rawDescription };
}

function encodePriorityDescription(priority: Priority, description: string): string {
  const stripped = description.replace(PRIORITY_PREFIX_RE, "").trim();
  return `[P:${priority}]${stripped ? " " + stripped : ""}`;
}

function priorityLabel(p: Priority) {
  return { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" }[p];
}

function priorityPillClass(p: Priority) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  switch (p) {
    case "urgent": return `${base} border-red-200 bg-red-50 text-red-700`;
    case "high":   return `${base} border-orange-200 bg-orange-50 text-orange-700`;
    case "medium": return `${base} border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]`;
    case "low":    return `${base} border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-muted)]`;
  }
}

// ─── Quick task templates ─────────────────────────────────────────────────────

const TASK_TEMPLATES: Array<{ title: string; description: string; priority: Priority }> = [
  { title: "Review onboarding submission",  description: "Check all fields and uploads are complete and accurate.", priority: "high" },
  { title: "Request missing documents",     description: "Follow up with client on outstanding document uploads.", priority: "high" },
  { title: "Verify signatures",            description: "Confirm all required signatures are present and valid.", priority: "medium" },
  { title: "Schedule kickoff call",        description: "Arrange an onboarding call with the new client.", priority: "medium" },
  { title: "Send welcome email",           description: "Send a manual welcome / next-steps email to the client.", priority: "low" },
  { title: "Compliance check",             description: "Verify all required compliance fields are complete.", priority: "urgent" },
  { title: "Approve uploaded documents",   description: "Review and approve client-uploaded files for compliance.", priority: "high" },
  { title: "Update onboarding status",     description: "Mark the onboarding as in-progress or submitted in the system.", priority: "low" },
];

// ─── Misc helpers ─────────────────────────────────────────────────────────────

function fmtDateShort(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch { return s; }
}

function checkOverdue(due_at: string | null, status: Task["status"]) {
  if (!due_at) return false;
  if (status === "done" || status === "archived") return false;
  return new Date(due_at) < new Date();
}

function getInitials(name: string | null, email: string | null) {
  const src = name ?? email ?? "?";
  return src
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusPill(status: Task["status"]) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  switch (status) {
    case "open":        return `${base} border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)]`;
    case "in_progress": return `${base} border-blue-200 bg-blue-50 text-blue-700`;
    case "done":        return `${base} border-green-200 bg-green-50 text-green-700`;
    case "archived":    return `${base} border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-muted)]`;
  }
}

function isTaskStatus(v: unknown): v is Task["status"] {
  return v === "open" || v === "in_progress" || v === "done" || v === "archived";
}

function getErrMsg(e: unknown, fallback: string) {
  return e instanceof Error && e.message ? e.message : fallback;
}

function AvatarDot({ name, email, size = "md" }: { name: string | null; email: string | null; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] font-semibold text-white ${sz}`}>
      {getInitials(name, email)}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TeamPage() {
  const [tab, setTab] = React.useState<Tab>("members");
  const [members, setMembers] = React.useState<Member[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // External viewer scopes
  const [memberScopes, setMemberScopes] = React.useState<Record<string, string[]>>({});
  const [availableEvents, setAvailableEvents] = React.useState<Array<{ id: string; name: string }>>([]);
  const [editScopeUserId, setEditScopeUserId] = React.useState<string | null>(null);
  const [editScopeEventIds, setEditScopeEventIds] = React.useState<string[]>([]);
  const [savingScopes, setSavingScopes] = React.useState(false);

  // ── Create task form state ──
  const [showCreate, setShowCreate] = React.useState(false);
  const [assignedTo, setAssignedTo] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [taskDesc, setTaskDesc] = React.useState("");
  const [taskPriority, setTaskPriority] = React.useState<Priority>("medium");
  const [taskDue, setTaskDue] = React.useState("");
  const [busyCreate, setBusyCreate] = React.useState(false);

  // ── Row-level busy state ──
  const [busyStatusById, setBusyStatusById] = React.useState<Record<string, Task["status"] | null>>({});
  const [busyDeleteId, setBusyDeleteId] = React.useState<string | null>(null);

  // ── Member filters ──
  const [memberSearch, setMemberSearch] = React.useState("");
  const [memberRoleFilter, setMemberRoleFilter] = React.useState<"" | Member["role"]>("");

  // ── Task filters ──
  const [taskSearch, setTaskSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | Task["status"]>("");
  const [priorityFilter, setPriorityFilter] = React.useState<"" | Priority>("");
  const [assigneeFilter, setAssigneeFilter] = React.useState("");
  const [overdueOnly, setOverdueOnly] = React.useState(false);
  const [scope, setScope] = React.useState<"all" | "mine">("all");

  // ─── Derived ────────────────────────────────────────────────────────────────
  const membersById = React.useMemo(() => new Map(members.map((m) => [m.user_id, m])), [members]);
  const meMember = React.useMemo(() => (me?.id ? membersById.get(me.id) ?? null : null), [me?.id, membersById]);
  const role = meMember?.role ?? null;
  const canAssign = role === "owner" || role === "admin";
  const canDelete = canAssign;

  // ─── External viewer scope helpers ───────────────────────────────────────────
  async function loadEventScopes(memberList: Member[]) {
    const evViewers = memberList.filter((m) => m.role === "external_viewer");
    if (evViewers.length === 0) return;

    // Load available events (once)
    const evRes = await fetch("/api/events", { cache: "no-store" }).catch(() => null);
    if (evRes?.ok) {
      const j = await evRes.json().catch(() => null);
      const evts = Array.isArray(j?.events) ? j.events : [];
      setAvailableEvents(evts.map((e: any) => ({ id: e.id, name: e.name })));
    }

    // Load per-user scopes
    const results: Record<string, string[]> = {};
    await Promise.all(
      evViewers.map(async (m) => {
        try {
          const r = await fetch(`/api/team/external-viewer-scopes?user_id=${m.user_id}`, { cache: "no-store" });
          if (!r.ok) return;
          const j = await r.json().catch(() => null);
          results[m.user_id] = Array.isArray(j?.event_ids) ? j.event_ids : [];
        } catch { /* ignore */ }
      })
    );
    setMemberScopes((prev) => ({ ...prev, ...results }));
  }

  async function saveScopes(userId: string, eventIds: string[]) {
    setSavingScopes(true);
    setErr(null);
    try {
      const res = await fetch("/api/team/external-viewer-scopes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id: userId, event_ids: eventIds }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to save scopes");
      setMemberScopes((prev) => ({ ...prev, [userId]: eventIds }));
      setEditScopeUserId(null);
      setEditScopeEventIds([]);
    } catch (e: unknown) {
      setErr(getErrMsg(e, "Failed to save scopes"));
    } finally {
      setSavingScopes(false);
    }
  }

  // ─── Load ────────────────────────────────────────────────────────────────────
  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const [mRes, tRes, meRes] = await Promise.all([
        fetch("/api/team/members", { cache: "no-store" }),
        fetch("/api/team/tasks", { cache: "no-store" }),
        fetch("/api/me", { cache: "no-store" }),
      ]);

      if (!mRes.ok) throw new Error((await mRes.json().catch(() => null))?.error || "Failed to load members");
      if (!tRes.ok) throw new Error((await tRes.json().catch(() => null))?.error || "Failed to load tasks");
      if (!meRes.ok) throw new Error((await meRes.json().catch(() => null))?.error || "Failed to load account");

      const [mJson, tJson, meJson] = await Promise.all([mRes.json(), tRes.json(), meRes.json()]);

      const rawMembers = Array.isArray(mJson?.members) ? mJson.members : [];
      const normalizedMembers: Member[] = rawMembers.map((row: unknown) => {
        const m = (row ?? {}) as Record<string, unknown>;
        const email = (m.email ?? m.user_email ?? (m.user as Record<string, unknown> | null)?.email ?? null) as string | null;
        const full = (m.full_name ?? m.name ?? m.display_name ?? null) as string | null;
        const fallback = email ? email.split("@")[0].replace(/[._-]+/g, " ").trim() : null;
        return {
          user_id: String(m.user_id ?? m.id ?? m.profile_id ?? ""),
          role: (m.role ?? "member") as Member["role"],
          email,
          full_name: full && String(full).trim() ? String(full).trim() : fallback,
        };
      });

      const meRaw = meJson?.user;
      const normalizedMe: Me | null =
        meRaw && typeof meRaw.id === "string"
          ? { id: meRaw.id, full_name: typeof meRaw.full_name === "string" ? meRaw.full_name : null, email: typeof meRaw.email === "string" ? meRaw.email : null }
          : null;

      const rawTasks = Array.isArray(tJson?.tasks) ? tJson.tasks : [];
      const normalizedTasks: Task[] = rawTasks.map((row: unknown) => {
        const t = (row ?? {}) as Record<string, unknown>;
        const status = isTaskStatus(t.status) ? t.status : "open";
        const due_at = typeof t.due_at === "string" ? t.due_at : null;
        const rawDesc = typeof t.description === "string" ? t.description : null;
        const { priority: p, rawDescription } = parsePriority(rawDesc);
        return {
          id: String(t.id ?? ""),
          created_by: String(t.created_by ?? ""),
          assigned_to: String(t.assigned_to ?? ""),
          title: String(t.title ?? ""),
          description: rawDesc,
          priority: p,
          rawDescription,
          status,
          due_at,
          updated_at: typeof t.updated_at === "string" ? t.updated_at : new Date().toISOString(),
          isOverdue: checkOverdue(due_at, status),
        };
      });

      setMe(normalizedMe);
      setMembers(normalizedMembers);
      setTasks(normalizedTasks);

      // Load scopes for external viewers (best-effort, non-blocking)
      loadEventScopes(normalizedMembers).catch(() => {});
    } catch (e: unknown) {
      setErr(getErrMsg(e, "Failed to load"));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (role === "member" && scope !== "mine") setScope("mine"); }, [role, scope]);

  // ─── Filtered members ─────────────────────────────────────────────────────
  const filteredMembers = React.useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    return members.filter((m) => {
      // Normalize legacy roles: owner→admin, member→onboarder for filter purposes
      const normalizedRole =
        m.role === "owner" ? "admin" :
        m.role === "member" ? "onboarder" :
        m.role;
      const roleOk = !memberRoleFilter || normalizedRole === memberRoleFilter;
      if (!q) return roleOk;
      return roleOk && ((m.full_name ?? "").toLowerCase().includes(q) || (m.email ?? "").toLowerCase().includes(q));
    });
  }, [members, memberSearch, memberRoleFilter]);

  // ─── Filtered tasks ───────────────────────────────────────────────────────
  const filteredTasks = React.useMemo(() => {
    const q = taskSearch.trim().toLowerCase();
    return tasks.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (assigneeFilter && t.assigned_to !== assigneeFilter) return false;
      if (overdueOnly && !t.isOverdue) return false;
      if (scope === "mine" && (!me?.id || t.assigned_to !== me.id)) return false;
      if (!q) return true;
      const assignee = membersById.get(t.assigned_to);
      const hay = [t.title, t.rawDescription ?? "", assignee?.full_name ?? "", assignee?.email ?? ""].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [tasks, taskSearch, statusFilter, priorityFilter, assigneeFilter, overdueOnly, scope, me?.id, membersById]);

  // ─── Per-member task stats (for member cards + workload) ─────────────────
  const memberTaskStats = React.useMemo(() => {
    const stats = new Map<string, { open: number; in_progress: number; done: number; overdue: number }>();
    for (const m of members) stats.set(m.user_id, { open: 0, in_progress: 0, done: 0, overdue: 0 });
    for (const t of tasks) {
      const s = stats.get(t.assigned_to);
      if (!s) continue;
      if (t.status === "open") s.open++;
      else if (t.status === "in_progress") s.in_progress++;
      else if (t.status === "done") s.done++;
      if (t.isOverdue) s.overdue++;
    }
    return stats;
  }, [members, tasks]);

  // ─── Summary counts ───────────────────────────────────────────────────────
  const openCount = tasks.filter((t) => t.status === "open").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const overdueCount = tasks.filter((t) => t.isOverdue).length;

  function canUpdateTask(task: Task) {
    if (!me?.id) return false;
    return canAssign || task.assigned_to === me.id;
  }

  function applyTemplate(tpl: (typeof TASK_TEMPLATES)[number]) {
    setTaskTitle(tpl.title);
    setTaskDesc(tpl.description);
    setTaskPriority(tpl.priority);
    setShowCreate(true);
    setTab("tasks");
  }

  // ─── Create task ──────────────────────────────────────────────────────────
  async function createTask() {
    const a = assignedTo.trim();
    const t = taskTitle.trim();
    if (!canAssign) return setErr("Only owner/admin can assign tasks.");
    if (!a) return setErr("Select a team member to assign to.");
    if (!t) return setErr("Task title is required.");

    setBusyCreate(true);
    setErr(null);

    const encodedDesc = encodePriorityDescription(taskPriority, taskDesc.trim());
    const { priority: p, rawDescription } = parsePriority(encodedDesc);
    const due_at_iso = taskDue ? new Date(taskDue).toISOString() : null;

    const tempId = `tmp-${Date.now()}`;
    const optimistic: Task = {
      id: tempId,
      created_by: me?.id ?? "",
      assigned_to: a,
      title: t,
      description: encodedDesc,
      priority: p,
      rawDescription,
      status: "open",
      due_at: due_at_iso,
      updated_at: new Date().toISOString(),
      isOverdue: checkOverdue(due_at_iso, "open"),
    };

    setTasks((prev) => [optimistic, ...prev.filter((x) => x.id !== tempId)]);

    try {
      const res = await fetch("/api/team/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assigned_to: a, title: t, description: encodedDesc, due_at: due_at_iso }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Create failed");

      const rawCreated = json?.item;
      if (rawCreated && typeof rawCreated.id === "string") {
        const due = typeof rawCreated.due_at === "string" ? rawCreated.due_at : due_at_iso;
        const st = isTaskStatus(rawCreated.status) ? rawCreated.status : "open";
        const desc = typeof rawCreated.description === "string" ? rawCreated.description : encodedDesc;
        const { priority: cp, rawDescription: crd } = parsePriority(desc);
        const created: Task = {
          id: rawCreated.id,
          created_by: String(rawCreated.created_by ?? optimistic.created_by),
          assigned_to: String(rawCreated.assigned_to ?? a),
          title: String(rawCreated.title ?? t),
          description: desc,
          priority: cp,
          rawDescription: crd,
          status: st,
          due_at: due,
          updated_at: typeof rawCreated.updated_at === "string" ? rawCreated.updated_at : new Date().toISOString(),
          isOverdue: checkOverdue(due, st),
        };
        setTasks((prev) => prev.map((x) => (x.id === tempId ? created : x)));
      } else {
        setTasks((prev) => prev.filter((x) => x.id !== tempId));
      }

      setTaskTitle(""); setTaskDesc(""); setTaskDue(""); setTaskPriority("medium"); setAssignedTo("");
      setShowCreate(false);
    } catch (e: unknown) {
      setTasks((prev) => prev.filter((x) => x.id !== tempId));
      setErr(getErrMsg(e, "Create failed"));
    } finally {
      setBusyCreate(false);
    }
  }

  // ─── Update status ────────────────────────────────────────────────────────
  async function setTaskStatus(id: string, status: Task["status"]) {
    const existing = tasks.find((t) => t.id === id);
    if (!existing || !canUpdateTask(existing)) { setErr("You can only update tasks assigned to you."); return; }
    if (existing.status === status) return;

    setErr(null);
    setBusyStatusById((p) => ({ ...p, [id]: status }));
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status, updated_at: new Date().toISOString(), isOverdue: checkOverdue(t.due_at, status) } : t));

    try {
      const res = await fetch("/api/team/tasks", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Update failed");
    } catch (e: unknown) {
      setTasks((prev) => prev.map((t) => (t.id === id ? existing : t)));
      setErr(getErrMsg(e, "Update failed"));
    } finally {
      setBusyStatusById((p) => { const n = { ...p }; delete n[id]; return n; });
    }
  }

  // ─── Delete task ──────────────────────────────────────────────────────────
  async function deleteTask(id: string) {
    if (!canDelete) { setErr("Only owner/admin can delete tasks."); return; }
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    setErr(null);
    setBusyDeleteId(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch("/api/team/tasks", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
    } catch (e: unknown) {
      setTasks((prev) => [existing, ...prev]);
      setErr(getErrMsg(e, "Delete failed"));
    } finally {
      setBusyDeleteId(null);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl space-y-5">

      <PageHeader
        title="Team"
        description="Manage team members, assign onboarding tasks, and track workload."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
              onClick={loadAll}
              disabled={loading}
            >
              Refresh
            </Button>
            <Link href="/dashboard/settings">
              <Button size="sm" iconLeft={<UserPlus className="h-3.5 w-3.5" />}>
                Invite members
              </Button>
            </Link>
          </>
        }
      />

      {err ? (
        <RejectionBanner
          kind={/plan|upgrade/i.test(err) ? "plan" : /permission|access|forbidden/i.test(err) ? "permission" : "error"}
          message={err}
          onDismiss={() => setErr(null)}
        />
      ) : null}

      {/* Stats strip */}
      {!loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Members", value: members.length, alert: false },
            { label: "Open tasks", value: openCount, alert: false },
            { label: "In progress", value: inProgressCount, alert: false },
            { label: "Overdue", value: overdueCount, alert: overdueCount > 0 },
          ].map((s) => (
            <div key={s.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{s.label}</div>
              <div className={`mt-1 text-2xl font-semibold tabular-nums ${s.alert ? "text-red-600" : "text-[var(--color-text-primary)]"}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Tab bar */}
      <div className="flex gap-1 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-1">
        {(["members", "tasks", "workload", "activity", "chat"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[var(--color-panel)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "tasks" && overdueCount > 0 ? (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {overdueCount > 9 ? "9+" : overdueCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════
          TAB: MEMBERS
          ══════════════════════════════════ */}
      {tab === "members" ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search by name or email…" />
            </div>
            <Select
              className="sm:w-40"
              value={memberRoleFilter}
              onChange={(e) => setMemberRoleFilter(e.target.value as Member["role"] | "")}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="onboarder">Onboarder</option>
              <option value="reviewer">Reviewer</option>
              <option value="external_viewer">Guest Viewer</option>
            </Select>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 sm:hidden flex flex-col gap-3">
            {loading ? (
              <div className="text-sm text-[var(--color-text-secondary)]">Loading…</div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-sm text-[var(--color-text-secondary)]">No members found.</div>
            ) : filteredMembers.map((m) => {
              const stats = memberTaskStats.get(m.user_id);
              const isMe = m.user_id === me?.id;
              return (
                <div key={m.user_id} className={`flex items-start gap-3 rounded-[var(--radius-md)] border p-3 ${isMe ? "border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)]/10" : "border-[var(--color-border)] bg-[var(--color-bg-subtle)]"}`}>
                  <AvatarDot name={m.full_name} email={m.email} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-medium text-sm text-[var(--color-text-primary)]">{m.full_name ?? "—"}</span>
                      {isMe ? <span className="text-[10px] text-[var(--color-accent)] font-semibold uppercase tracking-wide">You</span> : null}
                      <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] capitalize">{ROLE_LABELS[m.role as Role] ?? m.role.replace("_", " ")}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-secondary)] truncate">{m.email ?? "—"}</div>
                    {m.role === "external_viewer" && (() => {
                      const scopeIds = memberScopes[m.user_id] ?? [];
                      const scopeNames = scopeIds.map((id) => availableEvents.find((e) => e.id === id)?.name ?? id);
                      return (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                          <span>Access: {scopeNames.length > 0 ? scopeNames.join(", ") : "No events"}</span>
                          {canAssign && (
                            <button
                              onClick={() => { setEditScopeUserId(m.user_id); setEditScopeEventIds(scopeIds); }}
                              className="text-[var(--color-accent)] hover:underline"
                            >
                              Edit access
                            </button>
                          )}
                        </div>
                      );
                    })()}
                    {stats ? (
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                        <span>{stats.open} open</span>
                        <span>{stats.in_progress} in progress</span>
                        <span>{stats.done} done</span>
                        {stats.overdue > 0 ? <span className="font-semibold text-red-600">{stats.overdue} overdue</span> : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="mt-4 hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="py-2 text-left font-medium">Member</th>
                  <th className="py-2 text-left font-medium">Role</th>
                  <th className="py-2 text-center font-medium">Open</th>
                  <th className="py-2 text-center font-medium">In Progress</th>
                  <th className="py-2 text-center font-medium">Done</th>
                  <th className="py-2 text-center font-medium">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr><td colSpan={6} className="py-3 text-[var(--color-text-secondary)]">Loading…</td></tr>
                ) : filteredMembers.length === 0 ? (
                  <tr><td colSpan={6} className="py-3 text-[var(--color-text-secondary)]">No members found.</td></tr>
                ) : filteredMembers.map((m) => {
                  const stats = memberTaskStats.get(m.user_id) ?? { open: 0, in_progress: 0, done: 0, overdue: 0 };
                  const isMe = m.user_id === me?.id;
                  return (
                    <tr key={m.user_id} className={`${isMe ? "bg-[var(--color-accent-subtle)]/5" : "hover:bg-[var(--color-bg-subtle)]"}`}>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarDot name={m.full_name} email={m.email} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-[var(--color-text-primary)]">{m.full_name ?? "—"}</span>
                              {isMe ? <span className="text-[10px] text-[var(--color-accent)] font-semibold uppercase tracking-wide">You</span> : null}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)]">{m.email ?? "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)] capitalize">{ROLE_LABELS[m.role as Role] ?? m.role.replace("_", " ")}</span>
                          {m.role === "external_viewer" && (() => {
                            const scopeIds = memberScopes[m.user_id] ?? [];
                            const scopeNames = scopeIds.map((id) => availableEvents.find((e) => e.id === id)?.name ?? id);
                            return (
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-[11px] text-[var(--color-text-muted)]">
                                  Access: {scopeNames.length > 0 ? scopeNames.join(", ") : "No events"}
                                </span>
                                {canAssign && (
                                  <button
                                    onClick={() => {
                                      setEditScopeUserId(m.user_id);
                                      setEditScopeEventIds(scopeIds);
                                    }}
                                    className="text-[11px] text-[var(--color-accent)] hover:underline"
                                  >
                                    Edit access
                                  </button>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="py-3 text-center text-[var(--color-text-secondary)]">{stats.open}</td>
                      <td className="py-3 text-center text-[var(--color-text-secondary)]">{stats.in_progress}</td>
                      <td className="py-3 text-center text-[var(--color-text-secondary)]">{stats.done}</td>
                      <td className="py-3 text-center">
                        {stats.overdue > 0 ? <span className="font-semibold text-red-600">{stats.overdue}</span> : <span className="text-[var(--color-text-muted)]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 border-t border-[var(--color-border)] pt-3">
            <Link href="/dashboard/settings" className="text-sm text-[var(--color-accent)] hover:underline">
              Invite or manage team members in Settings →
            </Link>
          </div>
        </div>
      ) : null}

      {/* ── Edit Access Modal for external_viewer ── */}
      {editScopeUserId ? (() => {
        const member = members.find((m) => m.user_id === editScopeUserId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]">
            <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-[var(--shadow-xl)]">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Edit event access</h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {member?.full_name ?? member?.email ?? "This user"} — select which events they can view.
              </p>
              <div className="mt-4 max-h-56 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 space-y-2">
                {availableEvents.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">No events available.</p>
                ) : availableEvents.map((ev) => (
                  <label key={ev.id} className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={editScopeEventIds.includes(ev.id)}
                      onChange={(e) => {
                        setEditScopeEventIds((prev) =>
                          e.target.checked ? [...prev, ev.id] : prev.filter((id) => id !== ev.id)
                        );
                      }}
                    />
                    {ev.name}
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setEditScopeUserId(null); setEditScopeEventIds([]); }}
                  disabled={savingScopes}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => saveScopes(editScopeUserId, editScopeEventIds)}
                  disabled={savingScopes}
                >
                  {savingScopes ? "Saving…" : "Save access"}
                </Button>
              </div>
            </div>
          </div>
        );
      })() : null}

      {/* ══════════════════════════════════
          TAB: TASKS
          ══════════════════════════════════ */}
      {tab === "tasks" ? (
        <div className="flex flex-col gap-4">

          {/* Quick templates — owner/admin only */}
          {canAssign ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
              <div className="mb-3">
                <div className="text-sm font-medium text-[var(--color-text-primary)]">Quick templates</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Click to pre-fill a common onboarding task.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {TASK_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.title}
                    onClick={() => applyTemplate(tpl)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <span className={priorityPillClass(tpl.priority)}>{tpl.priority.charAt(0).toUpperCase()}</span>
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Create task panel — collapsible */}
          {canAssign ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">Assign a task</span>
                  <span className="ml-2 text-xs text-[var(--color-text-secondary)]">Create a task and assign it to a team member.</span>
                </div>
                <span className="ml-4 text-xs text-[var(--color-text-muted)]">{showCreate ? "▲ Collapse" : "▼ Expand"}</span>
              </button>

              {showCreate ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Assign to</label>
                    <Select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Select a member</option>
                      {members.map((m) => (
                        <option key={m.user_id} value={m.user_id}>
                          {(m.full_name ?? "Member").trim()}{m.email ? ` — ${m.email}` : ""}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Priority</label>
                    <Select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Due date (optional)</label>
                    <input
                      type="datetime-local"
                      className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 text-sm text-[var(--color-text-primary)]"
                      value={taskDue}
                      onChange={(e) => setTaskDue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Title</label>
                    <Input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Review client onboarding responses"
                      maxLength={140}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Description (optional)</label>
                    <textarea
                      className="min-h-[72px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-text-primary)] resize-none"
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Add helpful context for your teammate…"
                    />
                  </div>

                  <div className="flex gap-2 md:col-span-2">
                    <Button onClick={createTask} disabled={busyCreate || !assignedTo || !taskTitle.trim()}>
                      {busyCreate ? "Creating…" : "Create task"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => { setShowCreate(false); setTaskTitle(""); setTaskDesc(""); setTaskDue(""); setTaskPriority("medium"); setAssignedTo(""); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text-secondary)]">
              Tasks assigned to you will appear below. Contact your owner or admin to assign tasks.
            </div>
          )}

          {/* Filters */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Search</label>
                <Input value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="Search tasks by title, description, or assignee…" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Status</label>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Task["status"] | "")}
                  >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Priority</label>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
                  >
                    <option value="">All</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Assignee</label>
                  <Select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.full_name ?? m.email ?? m.user_id}
                      </option>
                    ))}
                  </Select>
                </div>

                {role !== "member" ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Scope</label>
                    <Select
                      value={scope}
                      onChange={(e) => setScope(e.target.value as "all" | "mine")}
                    >
                      <option value="all">All tasks</option>
                      <option value="mine">Assigned to me</option>
                    </Select>
                  </div>
                ) : null}

                <div className="flex flex-col justify-end">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Filter</label>
                  <label className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 text-sm text-[var(--color-text-primary)]">
                    <input type="checkbox" className="h-3.5 w-3.5" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} />
                    <span className={overdueOnly ? "text-red-700 font-medium" : ""}>Overdue only</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-[var(--color-text-muted)]">
              {filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"}
              {overdueCount > 0 ? <span className="ml-2 font-semibold text-red-600">· {overdueCount} overdue</span> : null}
            </div>
          </div>

          {/* Task list */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-[var(--color-border)]">
              {loading ? (
                <div className="p-4 text-sm text-[var(--color-text-secondary)]">Loading…</div>
              ) : filteredTasks.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">No tasks found</div>
                  <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {canAssign ? "Use a quick template above or expand the assign panel." : "Tasks assigned to you will appear here."}
                  </div>
                </div>
              ) : filteredTasks.map((t) => {
                const assignee = membersById.get(t.assigned_to);
                const assigneeLabel = assignee ? (assignee.full_name ?? assignee.email ?? "User") : "Unknown";
                const canUpdate = canUpdateTask(t);
                const isDeleting = busyDeleteId === t.id;
                const statusBusy = busyStatusById[t.id];
                const rowBusy = Boolean(statusBusy) || isDeleting;
                return (
                  <div key={t.id} className={`p-4 flex flex-col gap-2 ${t.isOverdue ? "bg-red-50" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm text-[var(--color-text-primary)]">{t.title}</div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={priorityPillClass(t.priority)}>{priorityLabel(t.priority)}</span>
                        <span className={statusPill(t.status)}>{t.status.replace("_", " ")}</span>
                      </div>
                    </div>
                    {t.rawDescription ? <div className="text-xs text-[var(--color-text-secondary)]">{t.rawDescription}</div> : null}
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <AvatarDot name={assignee?.full_name ?? null} email={assignee?.email ?? null} size="sm" />
                      <span>{assigneeLabel}</span>
                    </div>
                    <div className={`text-xs ${t.isOverdue ? "font-semibold text-red-700" : "text-[var(--color-text-secondary)]"}`}>
                      Due: {fmtDateShort(t.due_at)}{t.isOverdue ? " · OVERDUE" : ""}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(["open", "in_progress", "done"] as Task["status"][]).map((s) => (
                        <button key={s}
                          className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
                          onClick={() => setTaskStatus(t.id, s)}
                          disabled={rowBusy || !canUpdate || t.status === s}
                        >
                          {statusBusy === s ? "Saving…" : s.replace("_", " ")}
                        </button>
                      ))}
                      {canDelete ? (
                        <button
                          className="rounded-full border border-red-200 bg-[var(--color-panel)] px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                          onClick={() => deleteTask(t.id)}
                          disabled={rowBusy}
                        >
                          {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Task</th>
                    <th className="px-4 py-2.5 text-left font-medium">Assignee</th>
                    <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                    <th className="px-4 py-2.5 text-left font-medium">Due</th>
                    <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-4 text-[var(--color-text-secondary)]">Loading…</td></tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">No tasks found</div>
                        <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                          {canAssign ? "Use a quick template above or expand \"Assign a task\"." : "Tasks assigned to you will appear here."}
                        </div>
                      </td>
                    </tr>
                  ) : filteredTasks.map((t) => {
                    const assignee = membersById.get(t.assigned_to);
                    const assigneeLabel = assignee ? (assignee.full_name ?? assignee.email ?? "User") : "Unknown";
                    const canUpdate = canUpdateTask(t);
                    const isDeleting = busyDeleteId === t.id;
                    const statusBusy = busyStatusById[t.id];
                    const rowBusy = Boolean(statusBusy) || isDeleting;
                    return (
                      <tr key={t.id} className={t.isOverdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-[var(--color-bg-subtle)]"}>
                        <td className="px-4 py-3 max-w-[280px]">
                          <div className="font-medium text-[var(--color-text-primary)] truncate">{t.title}</div>
                          {t.rawDescription ? (
                            <div className="mt-0.5 text-xs text-[var(--color-text-secondary)] line-clamp-1">{t.rawDescription}</div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <AvatarDot name={assignee?.full_name ?? null} email={assignee?.email ?? null} size="sm" />
                            <span className="text-[var(--color-text-secondary)] truncate">{assigneeLabel}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={priorityPillClass(t.priority)}>{priorityLabel(t.priority)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={statusPill(t.status)}>{t.status.replace("_", " ")}</span>
                        </td>
                        <td className={`px-4 py-3 text-sm tabular-nums ${t.isOverdue ? "font-semibold text-red-700" : "text-[var(--color-text-secondary)]"}`}>
                          {fmtDateShort(t.due_at)}{t.isOverdue ? " ⚠" : ""}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {(["open", "in_progress", "done"] as Task["status"][]).map((s) => (
                              <button key={s}
                                className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
                                onClick={() => setTaskStatus(t.id, s)}
                                disabled={rowBusy || !canUpdate || t.status === s}
                              >
                                {statusBusy === s ? "…" : s.replace("_", " ")}
                              </button>
                            ))}
                            {canDelete ? (
                              <button
                                className="rounded-full border border-red-200 bg-[var(--color-panel)] px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                                onClick={() => deleteTask(t.id)}
                                disabled={rowBusy}
                              >
                                {isDeleting ? "…" : "Delete"}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* ══════════════════════════════════
          TAB: WORKLOAD
          ══════════════════════════════════ */}
      {tab === "workload" ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
          <div className="mb-5">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">Workload overview</div>
            <div className="text-xs text-[var(--color-text-secondary)]">Active task distribution across all team members.</div>
          </div>

          {loading ? (
            <div className="text-sm text-[var(--color-text-secondary)]">Loading…</div>
          ) : members.length === 0 ? (
            <div className="text-sm text-[var(--color-text-secondary)]">No team members yet.</div>
          ) : (
            <>
              {/* Bar chart view */}
              <div className="space-y-5">
                {members
                  .slice()
                  .sort((a, b) => {
                    const sa = memberTaskStats.get(a.user_id) ?? { open: 0, in_progress: 0, done: 0, overdue: 0 };
                    const sb = memberTaskStats.get(b.user_id) ?? { open: 0, in_progress: 0, done: 0, overdue: 0 };
                    return (sb.open + sb.in_progress) - (sa.open + sa.in_progress);
                  })
                  .map((m) => {
                    const stats = memberTaskStats.get(m.user_id) ?? { open: 0, in_progress: 0, done: 0, overdue: 0 };
                    const active = stats.open + stats.in_progress;
                    const total = active + stats.done;
                    const maxActive = Math.max(
                      ...members.map((mm) => {
                        const s = memberTaskStats.get(mm.user_id);
                        return s ? s.open + s.in_progress : 0;
                      }),
                      1
                    );
                    const pct = Math.round((active / maxActive) * 100);
                    const isMe = m.user_id === me?.id;
                    return (
                      <div key={m.user_id}>
                        <div className="flex items-center gap-3 mb-1.5">
                          <AvatarDot name={m.full_name} email={m.email} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{m.full_name ?? m.email ?? "—"}</span>
                                {isMe ? <span className="text-[10px] text-[var(--color-accent)] font-semibold uppercase tracking-wide shrink-0">You</span> : null}
                                <span className="text-xs text-[var(--color-text-muted)] shrink-0">{ROLE_LABELS[m.role as Role] ?? m.role}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] shrink-0">
                                <span>{stats.open} open</span>
                                <span>{stats.in_progress} in progress</span>
                                <span className="text-[var(--color-text-muted)]">{stats.done} done</span>
                                {stats.overdue > 0 ? (
                                  <span className="font-semibold text-red-600">{stats.overdue} overdue</span>
                                ) : null}
                                <span className="text-[var(--color-text-muted)]">{total} total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-11 h-2 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${stats.overdue > 0 ? "bg-red-500" : "bg-[var(--color-accent)]"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Summary table */}
              <div className="mt-8 overflow-x-auto border-t border-[var(--color-border)] pt-5">
                <div className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Full breakdown</div>
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                    <tr>
                      <th className="py-2 text-left font-medium">Member</th>
                      <th className="py-2 text-center font-medium">Open</th>
                      <th className="py-2 text-center font-medium">In Progress</th>
                      <th className="py-2 text-center font-medium">Done</th>
                      <th className="py-2 text-center font-medium">Overdue</th>
                      <th className="py-2 text-center font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {members.map((m) => {
                      const stats = memberTaskStats.get(m.user_id) ?? { open: 0, in_progress: 0, done: 0, overdue: 0 };
                      const active = stats.open + stats.in_progress;
                      return (
                        <tr key={m.user_id} className="hover:bg-[var(--color-bg-subtle)]">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <AvatarDot name={m.full_name} email={m.email} size="sm" />
                              <div>
                                <div className="font-medium text-[var(--color-text-primary)]">{m.full_name ?? "—"}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">{m.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 text-center text-[var(--color-text-secondary)]">{stats.open}</td>
                          <td className="py-2.5 text-center text-[var(--color-text-secondary)]">{stats.in_progress}</td>
                          <td className="py-2.5 text-center text-[var(--color-text-secondary)]">{stats.done}</td>
                          <td className="py-2.5 text-center">
                            {stats.overdue > 0 ? <span className="font-semibold text-red-600">{stats.overdue}</span> : <span className="text-[var(--color-text-muted)]">—</span>}
                          </td>
                          <td className="py-2.5 text-center font-semibold text-[var(--color-text-primary)]">{active}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setTab("tasks")}
                className="mt-4 text-sm text-[var(--color-accent)] hover:underline"
              >
                View all tasks →
              </button>
            </>
          )}
        </div>
      ) : null}

      {/* ══════════════════════════════════
          TAB: ACTIVITY
          ══════════════════════════════════ */}
      {tab === "activity" ? <ActivityFeedTab /> : null}

      {/* ══════════════════════════════════
          TAB: CHAT
          ══════════════════════════════════ */}
      {tab === "chat" ? <TeamChatTab /> : null}
    </div>
  );
}

// ─── Team Chat Tab ────────────────────────────────────────────────────────────

type TeamMessage = {
  id: string;
  sender_name: string | null;
  user_id: string | null;
  body: string;
  created_at: string;
};

function TeamChatTab() {
  const [messages, setMessages] = React.useState<TeamMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/team/chat", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      setMessages(json?.messages ?? []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  React.useEffect(() => {
    load();
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/team/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) return;
      setMessages((prev) => [...prev, json.message]);
      setDraft("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } catch { /* ignore */ } finally { setSending(false); }
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return `Yesterday ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden" style={{ height: "520px" }}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">Team Chat</span>
        <span className="ml-auto text-xs text-[var(--color-text-muted)]">Internal — visible to team members only</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-2 text-3xl opacity-20">💬</div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">No messages yet</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Start a conversation with your team.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex items-end gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[11px] font-bold text-white">
                {(m.sender_name || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex max-w-[70%] flex-col gap-0.5 items-start">
                <span className="px-1 text-[10px] font-medium text-[var(--color-text-muted)]">{m.sender_name ?? "Team member"}</span>
                <div className="rounded-2xl rounded-bl-sm bg-[var(--color-bg-subtle)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                  {m.body}
                </div>
                <span className="px-1 text-[10px] text-[var(--color-text-muted)]">{formatTime(m.created_at)}</span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Message the team…"
            className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] overflow-hidden"
            style={{ minHeight: "38px", maxHeight: "96px" }}
          />
          <button
            onClick={send}
            disabled={!draft.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            {sending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7l5 1.5M14 2l-5 12-1.5-5M14 2L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

// ─── Activity Feed Tab ────────────────────────────────────────────────────────

type ActivityItem = {
  id: string;
  verb: string;
  actor_name: string | null;
  actor_kind: string;
  subject_kind: string;
  message: string;
  created_at: string;
};

function ActivityFeedTab() {
  const [items, setItems] = React.useState<ActivityItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/team-activity", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = await res.json().catch(() => null);
      setItems(Array.isArray(json?.items) ? json.items : []);
    } catch (e: any) { setError(e?.message || "Failed to load activity."); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { load(); }, []);

  function relTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const verbDot: Record<string, string> = {
    approved: "bg-[var(--color-success)]",
    rejected: "bg-[var(--color-danger)]",
    submitted: "bg-[var(--color-info)]",
    imported: "bg-[var(--color-accent)]",
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-[var(--color-text-primary)]">Recent activity</div>
        <button onClick={load} className="text-xs text-[var(--color-accent)] hover:underline" disabled={loading}>Refresh</button>
      </div>

      {error && (
        <div className="mb-3 rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-3 py-2 text-xs text-[var(--color-danger)]">{error}</div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-border)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-[var(--color-bg-subtle)]" />
                <div className="h-3 w-1/4 rounded bg-[var(--color-bg-subtle)]" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">No activity yet.</div>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${verbDot[item.verb] ?? "bg-[var(--color-text-muted)]"}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--color-text-primary)]">{item.message}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{relTime(item.created_at)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
