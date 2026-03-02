"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

const Schema = z.object({
  title: z.string().min(1),
  client_email: z.string().email(),
  client_full_name: z.string().min(1).optional(),
});

export function CreateOnboardingCard({ onCreated }: { onCreated: () => void }) {
  const { push } = useToast();
  const [title, setTitle] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function create() {
    const parsed = Schema.safeParse({
      title,
      client_email: clientEmail,
      client_full_name: clientName || undefined,
    });
    if (!parsed.success) {
      push({ title: "Invalid input", description: "Check title and client email.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: parsed.data.title,
          client: { email: parsed.data.client_email, full_name: parsed.data.client_full_name },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create onboarding");

      push({ title: "Onboarding created", variant: "success" });
      setTitle("");
      setClientEmail("");
      setClientName("");
      onCreated();
    } catch (e: any) {
      push({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <CardTitle>Create onboarding</CardTitle>
        <CardDescription>Creates a new onboarding using your default template.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. ACME — March onboarding" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Client email</Label>
          <Input id="email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@company.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Client full name (optional)</Label>
          <Input id="name" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" onClick={create} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

type TemplateItem = {
  id: string;
  name?: string | null;
  title?: string | null;
  updated_at?: string | null;
};

type ClientItem = {
  id: string;
  email: string;
  full_name?: string | null;
  name?: string | null;
};

type ClientMode = "existing" | "new";

const Schema = z.object({
  title: z.string().min(1),
  template_id: z.string().min(1),
  client_mode: z.enum(["existing", "new"]),
  client_id: z.string().optional(),
  client_email: z.string().email().optional(),
  client_full_name: z.string().min(1).optional(),
});

export function CreateOnboardingCard({ onCreated }: { onCreated: () => void }) {
  const toastApi = useToast() as any;
  const toast: (t: any) => void =
    typeof toastApi?.notify === "function"
      ? toastApi.notify
      : typeof toastApi?.push === "function"
      ? toastApi.push
      : () => {};

  const [title, setTitle] = React.useState("");

  const [templates, setTemplates] = React.useState<TemplateItem[]>([]);
  const [templateId, setTemplateId] = React.useState<string>("");
  const [templatesLoading, setTemplatesLoading] = React.useState(false);

  const [clients, setClients] = React.useState<ClientItem[]>([]);
  const [clientMode, setClientMode] = React.useState<ClientMode>("existing");
  const [clientId, setClientId] = React.useState<string>("");
  const [clientsLoading, setClientsLoading] = React.useState(false);

  const [clientEmail, setClientEmail] = React.useState("");
  const [clientName, setClientName] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);

  const selectedClient = React.useMemo(() => {
    if (!clientId) return null;
    return clients.find((c) => c.id === clientId) ?? null;
  }, [clients, clientId]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      setTemplatesLoading(true);
      try {
        const res = await fetch("/api/templates", { cache: "no-store" });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Failed to load templates");

        const items: TemplateItem[] = Array.isArray(json?.items) ? json.items : Array.isArray(json) ? json : [];
        if (cancelled) return;

        setTemplates(items);
        // Auto-select the first template if none selected.
        if (!templateId && items.length > 0) {
          setTemplateId(items[0].id);
        }
      } catch (e: any) {
        if (!cancelled) toast({ title: "Could not load templates", description: e?.message ?? "Unknown error", variant: "error" });
      } finally {
        if (!cancelled) setTemplatesLoading(false);
      }
    }

    async function loadClients() {
      setClientsLoading(true);
      try {
        const res = await fetch("/api/clients", { cache: "no-store" });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error || "Failed to load clients");

        const items: ClientItem[] = Array.isArray(json?.items) ? json.items : Array.isArray(json) ? json : [];
        if (cancelled) return;

        setClients(items);
        // Auto-select first client in existing mode.
        if (!clientId && items.length > 0) {
          setClientId(items[0].id);
        }
      } catch (e: any) {
        if (!cancelled) toast({ title: "Could not load clients", description: e?.message ?? "Unknown error", variant: "error" });
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    }

    loadTemplates();
    loadClients();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // When switching to existing, populate the email/name fields from the selected client.
    if (clientMode === "existing") {
      const c = selectedClient;
      setClientEmail(c?.email ?? "");
      setClientName((c?.full_name ?? c?.name ?? "") as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientMode, clientId]);

  async function create() {
    const payloadBase = {
      title: title.trim(),
      template_id: templateId,
      client_mode: clientMode,
      client_id: clientId || undefined,
      client_email: clientEmail.trim() || undefined,
      client_full_name: clientName.trim() || undefined,
    };

    const parsed = Schema.safeParse(payloadBase);

    if (!parsed.success) {
      toast({ title: "Invalid input", description: "Check title, template and client details.", variant: "error" });
      return;
    }

    // Enforce conditional requirements.
    if (parsed.data.client_mode === "existing" && !parsed.data.client_id) {
      toast({ title: "Select a client", description: "Choose an existing client or switch to new client.", variant: "error" });
      return;
    }

    if (parsed.data.client_mode === "new" && !parsed.data.client_email) {
      toast({ title: "Client email required", description: "Enter a valid client email.", variant: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const body: any = {
        title: parsed.data.title,
        template_id: parsed.data.template_id,
      };

      if (parsed.data.client_mode === "existing") {
        body.client_id = parsed.data.client_id;
      } else {
        body.client = {
          email: parsed.data.client_email,
          full_name: parsed.data.client_full_name,
        };
      }

      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to create onboarding");

      toast({ title: "Onboarding created", variant: "success" });
      setTitle("");
      if (clientMode === "new") {
        setClientEmail("");
        setClientName("");
      }
      onCreated();
    } catch (e: any) {
      toast({ title: "Create failed", description: e?.message ?? "Unknown error", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <CardTitle>Create onboarding</CardTitle>
        <CardDescription>Create a new onboarding by selecting a template and client.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ACME — March onboarding"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="template">Template</Label>
            <select
              id="template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-300"
              disabled={templatesLoading}
            >
              {templatesLoading ? <option value="">Loading templates…</option> : null}
              {!templatesLoading && templates.length === 0 ? <option value="">No templates available</option> : null}
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {(t.name || t.title || "Untitled template") as string}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Client</Label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setClientMode("existing")}
              className={
                "rounded-md border px-3 py-1.5 text-sm " +
                (clientMode === "existing"
                  ? "border-zinc-300 bg-white text-zinc-900"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100")
              }
            >
              Existing client
            </button>
            <button
              type="button"
              onClick={() => setClientMode("new")}
              className={
                "rounded-md border px-3 py-1.5 text-sm " +
                (clientMode === "new"
                  ? "border-zinc-300 bg-white text-zinc-900"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100")
              }
            >
              New client
            </button>
          </div>
        </div>

        {clientMode === "existing" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="client">Select client</Label>
              <select
                id="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-300"
                disabled={clientsLoading}
              >
                {clientsLoading ? <option value="">Loading clients…</option> : null}
                {!clientsLoading && clients.length === 0 ? <option value="">No clients available</option> : null}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {((c.full_name || c.name) ? `${c.full_name || c.name} — ${c.email}` : c.email) as string}
                  </option>
                ))}
              </select>
              <div className="text-xs text-zinc-500">Uses the selected client’s saved details.</div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Client email</Label>
              <Input id="email" type="email" value={clientEmail} disabled />
            </div>

            <div className="flex flex-col gap-2 lg:col-span-2">
              <Label htmlFor="name">Client full name</Label>
              <Input id="name" value={clientName} disabled />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Client email</Label>
              <Input
                id="email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@company.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Client full name (optional)</Label>
              <Input id="name" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Jane Doe" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button type="button" onClick={create} disabled={submitting || templatesLoading || !templateId}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}