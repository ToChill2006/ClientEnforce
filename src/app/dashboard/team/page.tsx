"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Member = {
  user_id: string;
  role: "owner" | "admin" | "member";
  email: string | null;
  full_name: string | null;
};

type Task = {
  id: string;
  created_by: string;
  assigned_to: string;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "done" | "archived";
  due_at: string | null;
  updated_at: string;
};

type Me = {
  id: string;
  full_name: string | null;
  email: string | null;
};

function fmtDate(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

function pill(status: Task["status"]) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  switch (status) {
    case "open":
      return `${base} border-zinc-200 bg-white text-zinc-700`;
    case "in_progress":
      return `${base} border-zinc-200 bg-zinc-50 text-zinc-800`;
    case "done":
      return `${base} border-zinc-200 bg-zinc-100 text-zinc-900`;
    case "archived":
      return `${base} border-zinc-200 bg-white text-zinc-500`;
  }
}

function isTaskStatus(value: unknown): value is Task["status"] {
  return value === "open" || value === "in_progress" || value === "done" || value === "archived";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function TeamPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // create task form
  const [assignedTo, setAssignedTo] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [busyCreate, setBusyCreate] = React.useState(false);
  const [busyStatusById, setBusyStatusById] = React.useState<Record<string, Task["status"] | null>>({});
  const [busyDeleteId, setBusyDeleteId] = React.useState<string | null>(null);

  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | Task["status"]>("");
  const [scope, setScope] = React.useState<"all" | "mine">("all");

  const membersById = React.useMemo(() => new Map(members.map((m) => [m.user_id, m])), [members]);
  const meMember = React.useMemo(() => (me?.id ? membersById.get(me.id) ?? null : null), [me?.id, membersById]);
  const role = meMember?.role ?? null;
  const canAssign = role === "owner" || role === "admin";
  const canDelete = canAssign;

  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const [mRes, tRes, meRes] = await Promise.all([
        fetch("/api/team/members", { cache: "no-store" }),
        fetch(`/api/team/tasks${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ""}`, { cache: "no-store" }),
        fetch("/api/me", { cache: "no-store" }),
      ]);

      if (!mRes.ok) throw new Error((await mRes.json().catch(() => null))?.error || "Failed to load members");
      if (!tRes.ok) throw new Error((await tRes.json().catch(() => null))?.error || "Failed to load tasks");
      if (!meRes.ok) throw new Error((await meRes.json().catch(() => null))?.error || "Failed to load account");

      const mJson = await mRes.json();
      const tJson = await tRes.json();
      const meJson = await meRes.json();

      const rawMembers = Array.isArray(mJson?.members) ? mJson.members : [];
      const normalizedMembers: Member[] = rawMembers.map((row: unknown) => {
        const m = (row ?? {}) as {
          user_id?: string;
          id?: string;
          profile_id?: string;
          role?: Member["role"];
          email?: string | null;
          user_email?: string | null;
          full_name?: string | null;
          name?: string | null;
          display_name?: string | null;
          user_full_name?: string | null;
          profile_full_name?: string | null;
          user?: { email?: string | null } | null;
        };
        const email = (m?.email ?? m?.user_email ?? m?.user?.email ?? null) as string | null;
        const full =
          (m?.full_name ?? m?.name ?? m?.display_name ?? m?.user_full_name ?? m?.profile_full_name ?? null) as
            | string
            | null;
        const fallback = email ? email.split("@")[0].replace(/[._-]+/g, " ").trim() : null;
        return {
          user_id: (m?.user_id ?? m?.id ?? m?.profile_id ?? "") as string,
          role: (m?.role ?? "member") as Member["role"],
          email,
          full_name: (full && String(full).trim()) ? String(full).trim() : fallback,
        };
      });

      const meRaw = meJson?.user;
      const normalizedMe: Me | null =
        meRaw && typeof meRaw.id === "string"
          ? {
              id: meRaw.id,
              full_name: typeof meRaw.full_name === "string" ? meRaw.full_name : null,
              email: typeof meRaw.email === "string" ? meRaw.email : null,
            }
          : null;

      const rawTasks = Array.isArray(tJson?.tasks) ? tJson.tasks : [];
      const normalizedTasks: Task[] = rawTasks.map((row: unknown) => {
        const t = (row ?? {}) as {
          id?: string;
          created_by?: string;
          assigned_to?: string;
          title?: string;
          description?: string | null;
          status?: unknown;
          due_at?: string | null;
          updated_at?: string;
        };
        return {
          id: String(t?.id ?? ""),
          created_by: String(t?.created_by ?? ""),
          assigned_to: String(t?.assigned_to ?? ""),
          title: String(t?.title ?? ""),
          description: typeof t?.description === "string" ? t.description : null,
          status: isTaskStatus(t?.status) ? t.status : "open",
          due_at: typeof t?.due_at === "string" ? t.due_at : null,
          updated_at: typeof t?.updated_at === "string" ? t.updated_at : new Date().toISOString(),
        };
      });

      setMe(normalizedMe);
      setMembers(normalizedMembers);
      setTasks(normalizedTasks);
    } catch (e: unknown) {
      setErr(getErrorMessage(e, "Failed to load"));
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  React.useEffect(() => {
    if (role === "member" && scope !== "mine") setScope("mine");
  }, [role, scope]);

  const filteredMembers = members.filter((m) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    const name = (m.full_name ?? "").toLowerCase();
    const email = (m.email ?? "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (scope === "mine" && (!me?.id || t.assigned_to !== me.id)) return false;

    const q = filter.trim().toLowerCase();
    if (!q) return true;
    const assignee = membersById.get(t.assigned_to);
    const assigneeText = `${assignee?.full_name ?? ""} ${assignee?.email ?? ""}`.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q) ||
      assigneeText.includes(q)
    );
  });

  function canUpdateTask(task: Task) {
    if (!me?.id) return false;
    return canAssign || task.assigned_to === me.id;
  }

  async function createTask() {
    const a = assignedTo.trim();
    const t = title.trim();
    if (!canAssign) return setErr("Only owner/admin can assign tasks.");
    if (!a) return setErr("Select a team member to assign to.");
    if (!t) return setErr("Task title is required.");

    setBusyCreate(true);
    setErr(null);

    const tempId = `tmp-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const optimisticTask: Task = {
      id: tempId,
      created_by: me?.id ?? "",
      assigned_to: a,
      title: t,
      description: description.trim() ? description.trim() : null,
      status: "open",
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      updated_at: nowIso,
    };

    setTasks((prev) => [optimisticTask, ...prev.filter((x) => x.id !== tempId)]);

    try {
      const payload = {
        assigned_to: a,
        title: optimisticTask.title,
        description: optimisticTask.description,
        due_at: optimisticTask.due_at,
      };

      const res = await fetch("/api/team/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Create failed");

      const rawCreated = json?.item;
      const created: Task | null =
        rawCreated && typeof rawCreated.id === "string"
          ? {
              id: rawCreated.id,
              created_by: String(rawCreated.created_by ?? optimisticTask.created_by),
              assigned_to: String(rawCreated.assigned_to ?? optimisticTask.assigned_to),
              title: String(rawCreated.title ?? optimisticTask.title),
              description:
                typeof rawCreated.description === "string"
                  ? rawCreated.description
                  : rawCreated.description === null
                    ? null
                    : optimisticTask.description,
              status: isTaskStatus(rawCreated.status) ? rawCreated.status : optimisticTask.status,
              due_at: typeof rawCreated.due_at === "string" ? rawCreated.due_at : optimisticTask.due_at,
              updated_at: typeof rawCreated.updated_at === "string" ? rawCreated.updated_at : nowIso,
            }
          : null;

      setTasks((prev) => {
        if (!created) return prev.filter((x) => x.id !== tempId);
        return prev.map((x) => (x.id === tempId ? created : x));
      });

      setTitle("");
      setDescription("");
      setDueAt("");
    } catch (e: unknown) {
      setTasks((prev) => prev.filter((x) => x.id !== tempId));
      setErr(getErrorMessage(e, "Create failed"));
    } finally {
      setBusyCreate(false);
    }
  }

  async function setTaskStatus(id: string, status: Task["status"]) {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;
    if (!canUpdateTask(existing)) {
      setErr("You can only update tasks assigned to you.");
      return;
    }
    if (existing.status === status) return;

    setErr(null);
    setBusyStatusById((prev) => ({ ...prev, [id]: status }));

    const optimisticUpdatedAt = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updated_at: optimisticUpdatedAt } : t))
    );

    try {
      const res = await fetch("/api/team/tasks", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Update failed");
    } catch (e: unknown) {
      setTasks((prev) => prev.map((t) => (t.id === id ? existing : t)));
      setErr(getErrorMessage(e, "Update failed"));
    } finally {
      setBusyStatusById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  async function deleteTask(id: string) {
    if (!canDelete) {
      setErr("Only owner/admin can delete tasks.");
      return;
    }
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    setErr(null);
    setBusyDeleteId(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      const res = await fetch("/api/team/tasks", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Delete failed");
    } catch (e: unknown) {
      setTasks((prev) => [existing, ...prev]);
      setErr(getErrorMessage(e, "Delete failed"));
    } finally {
      setBusyDeleteId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Team</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Assign internal tasks to teammates and track progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadAll}>
            Refresh
          </Button>
          <Link className="text-sm text-zinc-600 hover:text-zinc-900" href="/dashboard/settings">
            Settings
          </Link>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-800">{err}</div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-900">Directory</div>
              <div className="mt-1 text-xs text-zinc-600">Search members and tasks.</div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search members or tasks…"
              />
              <select
                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
                value={statusFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatusFilter(isTaskStatus(value) ? value : "");
                }}
              >
                <option value="">All tasks</option>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="py-2 text-left font-medium">Member</th>
                  <th className="py-2 text-left font-medium">Role</th>
                  <th className="py-2 text-left font-medium">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="py-3 text-zinc-600">
                      Loading…
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-3 text-zinc-600">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.user_id} className="hover:bg-zinc-50">
                      <td className="py-2">
                        <div className="font-medium text-zinc-900">{m.full_name ?? "—"}</div>
                        <div className="text-xs text-zinc-600">{m.email ? m.email : "—"}</div>
                      </td>
                      <td className="py-2 text-zinc-700">{m.role}</td>
                      <td className="py-2 font-mono text-xs text-zinc-600">{m.user_id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-zinc-900">Assign a task</div>
            <div className="text-xs text-zinc-600">
              Owner/admin can assign tasks. Assignees can update status to open, in progress, or done.
            </div>
          </div>

          {canAssign ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Assign to</label>
                <select
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select a member</option>
                  {members.map((m) => {
                    const name = (m.full_name ?? "Member").trim();
                    const email = (m.email ?? "").trim();
                    const label = email ? `${name} — ${email}` : name;
                    return (
                      <option key={m.user_id} value={m.user_id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Due (optional)</label>
                <input
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
                  type="datetime-local"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Review client onboarding responses"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Description (optional)</label>
                <textarea
                  className="min-h-[88px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add helpful context…"
                />
              </div>

              <div className="md:col-span-2">
                <Button onClick={createTask} disabled={busyCreate || !assignedTo || !title.trim()}>
                  {busyCreate ? "Creating..." : "Create task"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
              You can update task status for tasks assigned to you.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-900">Tasks</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
                value={scope}
                onChange={(e) => setScope(e.target.value === "mine" ? "mine" : "all")}
                disabled={role === "member"}
              >
                <option value="all">All tasks</option>
                <option value="mine">Assigned to me</option>
              </select>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="py-2 text-left font-medium">Title</th>
                  <th className="py-2 text-left font-medium">Assignee</th>
                  <th className="py-2 text-left font-medium">Status</th>
                  <th className="py-2 text-left font-medium">Due</th>
                  <th className="py-2 text-left font-medium">Updated</th>
                  <th className="py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-3 text-zinc-600">
                      Loading…
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-3 text-zinc-600">
                      No tasks yet.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => {
                    const assignee = membersById.get(t.assigned_to);
                    const assigneeLabel = assignee ? (assignee.full_name ?? assignee.email ?? "User") : t.assigned_to;
                    const canUpdate = canUpdateTask(t);
                    const isDeleting = busyDeleteId === t.id;
                    const statusBusy = busyStatusById[t.id];
                    const rowBusy = Boolean(statusBusy) || isDeleting;

                    return (
                      <tr key={t.id} className="hover:bg-zinc-50">
                        <td className="py-2">
                          <div className="font-medium text-zinc-900">{t.title}</div>
                          {t.description ? <div className="mt-0.5 text-xs text-zinc-600">{t.description}</div> : null}
                        </td>
                        <td className="py-2 text-zinc-700">{assigneeLabel}</td>
                        <td className="py-2">
                          <span className={pill(t.status)}>{t.status.replace("_", " ")}</span>
                        </td>
                        <td className="py-2 text-zinc-700">{fmtDate(t.due_at)}</td>
                        <td className="py-2 text-zinc-700">{fmtDate(t.updated_at)}</td>
                        <td className="py-2">
                          <div className="flex justify-end gap-2">
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                              onClick={() => setTaskStatus(t.id, "open")}
                              disabled={rowBusy || !canUpdate || t.status === "open"}
                            >
                              {statusBusy === "open" ? "Saving..." : "Open"}
                            </button>
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                              onClick={() => setTaskStatus(t.id, "in_progress")}
                              disabled={rowBusy || !canUpdate || t.status === "in_progress"}
                            >
                              {statusBusy === "in_progress" ? "Saving..." : "In progress"}
                            </button>
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                              onClick={() => setTaskStatus(t.id, "done")}
                              disabled={rowBusy || !canUpdate || t.status === "done"}
                            >
                              {statusBusy === "done" ? "Saving..." : "Done"}
                            </button>
                            {canDelete ? (
                              <button
                                className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
                                onClick={() => deleteTask(t.id)}
                                disabled={rowBusy}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
