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

export default function TeamPage() {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // create task form
  const [assignedTo, setAssignedTo] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [busyCreate, setBusyCreate] = React.useState(false);

  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"" | Task["status"]>("");

  async function loadAll() {
    setLoading(true);
    setErr(null);
    try {
      const [mRes, tRes] = await Promise.all([
        fetch("/api/team/members", { cache: "no-store" }),
        fetch(`/api/team/tasks${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ""}`, { cache: "no-store" }),
      ]);

      if (!mRes.ok) throw new Error((await mRes.json().catch(() => null))?.error || "Failed to load members");
      if (!tRes.ok) throw new Error((await tRes.json().catch(() => null))?.error || "Failed to load tasks");

      const mJson = await mRes.json();
      const tJson = await tRes.json();

      const rawMembers = Array.isArray(mJson?.members) ? mJson.members : [];
      const normalizedMembers: Member[] = rawMembers.map((m: any) => {
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

      setMembers(normalizedMembers);
      setTasks(Array.isArray(tJson?.tasks) ? tJson.tasks : []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredMembers = members.filter((m) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    const name = (m.full_name ?? "").toLowerCase();
    const email = (m.email ?? "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  const filteredTasks = tasks.filter((t) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return t.title.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
  });

  async function createTask() {
    const a = assignedTo.trim();
    const t = title.trim();
    if (!a) return setErr("Select a team member to assign to.");
    if (!t) return setErr("Task title is required.");

    setBusyCreate(true);
    setErr(null);
    try {
      const payload = {
        assigned_to: a,
        title: t,
        description: description.trim() ? description.trim() : null,
        due_at: dueAt ? new Date(dueAt).toISOString() : null,
      };

      const res = await fetch("/api/team/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Create failed");

      setTitle("");
      setDescription("");
      setDueAt("");
      await loadAll();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    } finally {
      setBusyCreate(false);
    }
  }

  async function setTaskStatus(id: string, status: Task["status"]) {
    setErr(null);
    const res = await fetch("/api/team/tasks", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.error || "Update failed");
      return;
    }
    await loadAll();
  }

  async function deleteTask(id: string) {
    setErr(null);
    const res = await fetch("/api/team/tasks", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setErr(json?.error || "Delete failed");
      return;
    }
    await loadAll();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Team</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage team members and assign internal tasks (admin/owner can assign).
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
                onChange={(e) => setStatusFilter(e.target.value as any)}
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
            <div className="text-xs text-zinc-600">Owner/admin only. Assignees can mark their tasks done.</div>
          </div>

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
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Review client onboarding responses" />
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
                {busyCreate ? "Creating…" : "Create task"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-900">Tasks</div>
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
                    const assignee = members.find((m) => m.user_id === t.assigned_to);
                    const assigneeLabel = assignee ? (assignee.full_name ?? assignee.email ?? "User") : t.assigned_to;

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
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                              onClick={() => setTaskStatus(t.id, "open")}
                            >
                              Open
                            </button>
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                              onClick={() => setTaskStatus(t.id, "in_progress")}
                            >
                              In progress
                            </button>
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                              onClick={() => setTaskStatus(t.id, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                              onClick={() => deleteTask(t.id)}
                            >
                              Delete
                            </button>
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