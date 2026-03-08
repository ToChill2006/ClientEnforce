"use client";

import * as React from "react";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const RequirementSchema = z.object({
  type: z.enum(["text", "file", "signature"]),
  label: z.string().min(1),
  is_required: z.boolean(),
  sort_order: z.number().int().nonnegative(),
});

type TemplateRow = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type TemplateDetail = {
  id: string;
  name: string;
  definition: { requirements: Array<z.infer<typeof RequirementSchema>> };
};

export default function TemplatesPage() {
  const toastApi = useToast() as any;
  const notify: (t: any) => void =
    typeof toastApi?.notify === "function"
      ? toastApi.notify
      : typeof toastApi?.push === "function"
      ? toastApi.push
      : () => {};
  const [items, setItems] = React.useState<TemplateRow[]>([]);
  const [selected, setSelected] = React.useState<TemplateDetail | null>(null);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [canCreateTemplate, setCanCreateTemplate] = React.useState(true);
  const [canEditTemplate, setCanEditTemplate] = React.useState(true);
  const [canDeleteTemplate, setCanDeleteTemplate] = React.useState(true);
  const [upgradeMessage, setUpgradeMessage] = React.useState<string | null>(null);
  const [detailCache, setDetailCache] = React.useState<Record<string, TemplateDetail>>({});
  const [creating, setCreating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [openingId, setOpeningId] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      const rows = json.items || [];
      setItems(rows);
      setDetailCache((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          if (!next[row.id] && row?.name) {
            next[row.id] = {
              id: row.id,
              name: row.name,
              definition: { requirements: [] },
            };
          }
        }
        return next;
      });
    } catch (e: any) {
      notify({ title: "Load failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim() || creating) {
      if (!name.trim()) notify({ title: "Name required", variant: "error" });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          definition: {
            requirements: [
              { type: "text", label: "Primary contact name", is_required: true, sort_order: 0 },
              { type: "file", label: "Upload contract", is_required: true, sort_order: 1 },
              { type: "signature", label: "Signature", is_required: true, sort_order: 2 },
            ],
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          const message = String(json?.error ?? "");
          const looksLikePlanLimit = /upgrade|current plan|allows|templates/i.test(message);

          if (looksLikePlanLimit) {
            setUpgradeMessage(message || "Your current subscription does not allow more templates.");
            notify({
              title: "Upgrade required",
              description: message || "Your current subscription does not allow more templates.",
              variant: "error",
            });
            return;
          }

          notify({
            title: "Permission required",
            description: "You do not have permission to create templates.",
            variant: "error",
          });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }

      const created = (json?.item ?? null) as TemplateDetail | null;
      setUpgradeMessage(null);
      notify({ title: "Template created", variant: "success" });
      setName("");

      if (created?.id) {
        const now = new Date().toISOString();
        setItems((prev) => [
          {
            id: created.id,
            name: created.name,
            created_at: (created as any).created_at ?? now,
            updated_at: (created as any).updated_at ?? now,
          },
          ...prev.filter((x) => x.id !== created.id),
        ]);
        setDetailCache((prev) => ({ ...prev, [created.id]: created }));
        setSelected(created);
      } else {
        void load();
      }
    } catch (e: any) {
      notify({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setCreating(false);
    }
  }

  async function openTemplate(id: string) {
    if (openingId === id) return;

    const cached = detailCache[id];
    if (cached && cached.definition?.requirements?.length > 0) {
      setSelected(cached);
      return;
    }

    // Show instant shell from list data while fetching full detail.
    const row = items.find((x) => x.id === id);
    if (row) {
      setSelected((prev) =>
        prev?.id === id
          ? prev
          : {
              id: row.id,
              name: row.name,
              definition: cached?.definition ?? { requirements: [] },
            }
      );
    }

    setOpeningId(id);
    try {
      const res = await fetch(`/api/templates/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setSelected(json.item);
      setDetailCache((prev) => ({ ...prev, [id]: json.item }));
    } catch (e: any) {
      notify({ title: "Open failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setOpeningId(null);
    }
  }

  async function saveSelected() {
    if (!selected || saving) return;
    setSaving(true);
    try {
      const optimistic = {
        ...selected,
        definition: {
          requirements: selected.definition.requirements.map((r, i) => ({ ...r, sort_order: i })),
        },
      };

      const res = await fetch(`/api/templates/${selected.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: optimistic.name, definition: optimistic.definition }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          notify({
            title: "Permission required",
            description: "You do not have permission to edit templates.",
            variant: "error",
          });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }

      const saved = (json?.item ?? optimistic) as TemplateDetail;
      setSelected(saved);
      setDetailCache((prev) => ({ ...prev, [saved.id]: saved }));
      setItems((prev) =>
        prev.map((t) =>
          t.id === saved.id
            ? {
                ...t,
                name: saved.name,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
      notify({ title: "Saved", variant: "success" });
    } catch (e: any) {
      notify({ title: "Save failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelected() {
    if (!selected || deleting) return;
    const doomed = selected;
    setDeleting(true);
    try {
      const res = await fetch(`/api/templates/${doomed.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          notify({
            title: "Permission required",
            description: "You do not have permission to delete templates.",
            variant: "error",
          });
          return;
        }
        throw new Error(JSON.stringify(json.error ?? json));
      }

      setItems((prev) => prev.filter((t) => t.id !== doomed.id));
      setDetailCache((prev) => {
        const next = { ...prev };
        delete next[doomed.id];
        return next;
      });
      setSelected(null);
      notify({ title: "Deleted", variant: "success" });
    } catch (e: any) {
      notify({ title: "Delete failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Define requirements that will be snapshotted into each onboarding.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">New template name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Standard onboarding" />
            </div>
            <Button onClick={create} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
            {upgradeMessage ? (
              <div className="text-sm text-amber-700">{upgradeMessage}</div>
            ) : null}
          </div>

          <div className="rounded-xl border border-zinc-200">
            {upgradeMessage ? (
              <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {upgradeMessage}
              </div>
            ) : null}
            <div className="border-b border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600">
              {loading ? "Loading..." : `${items.length} templates`}
            </div>
            <div className="divide-y divide-zinc-200">
              {items.map((t) => (
                <button
                  key={t.id}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50"
                  onClick={() => openTemplate(t.id)}
                  disabled={openingId === t.id}
                >
                  <div className="text-sm font-medium text-zinc-900">{t.name}</div>
                  <div className="text-xs text-zinc-500">
                    {openingId === t.id ? "Opening..." : new Date(t.updated_at).toLocaleString()}
                  </div>
                </button>
              ))}
              {!items.length && !loading ? (
                <div className="px-4 py-4 text-sm text-zinc-600">No templates yet.</div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {selected ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit template</CardTitle>
            <CardDescription>Owner/Admin only. Changes affect future onboardings only.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={selected.name}
                onChange={(e) => setSelected({ ...selected, name: e.target.value })}
              />
            </div>

            <div className="rounded-xl border border-zinc-200 p-3">
              <div className="text-sm font-semibold">Requirements</div>
              <div className="mt-3 flex flex-col gap-3">
                {selected.definition.requirements
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((r, idx) => (
                    <div key={idx} className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
                      <div className="md:col-span-3">
                        <select
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                          value={r.type}
                          onChange={(e) => {
                            const type = e.target.value as any;
                            const reqs = selected.definition.requirements.map((x, i) => (i === idx ? { ...x, type } : x));
                            setSelected({ ...selected, definition: { requirements: reqs } });
                          }}
                        >
                          <option value="text">text</option>
                          <option value="file">file</option>
                          <option value="signature">signature</option>
                        </select>
                      </div>

                      <div className="md:col-span-6">
                        <Input
                          value={r.label}
                          onChange={(e) => {
                            const label = e.target.value;
                            const reqs = selected.definition.requirements.map((x, i) => (i === idx ? { ...x, label } : x));
                            setSelected({ ...selected, definition: { requirements: reqs } });
                          }}
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={r.is_required}
                          onChange={(e) => {
                            const is_required = e.target.checked;
                            const reqs = selected.definition.requirements.map((x, i) =>
                              i === idx ? { ...x, is_required } : x
                            );
                            setSelected({ ...selected, definition: { requirements: reqs } });
                          }}
                        />
                        <span className="text-sm text-zinc-700">Required</span>
                      </div>

                      <div className="md:col-span-1">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const reqs = selected.definition.requirements.filter((_, i) => i !== idx).map((x, i) => ({
                              ...x,
                              sort_order: i,
                            }));
                            setSelected({ ...selected, definition: { requirements: reqs } });
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  ))}

                <Button
                  variant="secondary"
                  onClick={() => {
                    const reqs = selected.definition.requirements.slice();
                    reqs.push({ type: "text", label: "New requirement", is_required: true, sort_order: reqs.length });
                    setSelected({ ...selected, definition: { requirements: reqs } });
                  }}
                >
                  Add requirement
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveSelected} disabled={saving || deleting}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={deleteSelected} disabled={saving || deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}