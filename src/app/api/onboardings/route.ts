import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { randomUUID } from "crypto";

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function isMissingColumnError(err: any, column: string) {
  const msg = String(err?.message || err || "");
  return (
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    msg.includes("Could not find")
  ) && msg.toLowerCase().includes(column.toLowerCase());
}

async function getOrgIdForUser(supabase: Awaited<ReturnType<typeof supabaseServer>>) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { user: null as any, org_id: null as string | null };

  // If your app stores org_id somewhere else, keep this aligned with your existing schema.
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (error || !profile?.org_id) return { user, org_id: null as string | null };
  return { user, org_id: profile.org_id as string };
}

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function maxActiveOnboardingsForTier(tier: "free" | "pro" | "business") {
  if (tier === "business") return 200;
  if (tier === "pro") return 50;
  return 5;
}

const CreatePayload = z.union([
  // ID-based (admin UI can use this)
  z.object({
    title: z.string().min(1).max(160).optional(),
    template_id: z.string().uuid().optional(),
    client_id: z.string().uuid(),
  }),
  // Nested client object (supports either selecting an existing client by id, or providing email+name/full_name)
  z.object({
    title: z.string().min(1).max(160).optional(),
    template_id: z.string().uuid().optional(),
    client: z.union([
      z.object({
        id: z.string().uuid(),
      }),
      z.object({
        email: z.string().email(),
        // Accept either `name` or `full_name` from the UI; normalize later.
        name: z.string().min(1).optional(),
        full_name: z.string().min(1).optional(),
      }).refine((v) => Boolean((v.name ?? v.full_name)?.trim()), {
        message: "Client name is required",
        path: ["name"],
      }),
    ]),
  }),
  // Flat fields (current modal posts this)
  z
    .object({
      title: z.string().min(1).max(160).optional(),
      template_id: z.string().uuid().optional(),
      client_email: z.string().email(),
      client_name: z.string().min(1).optional(),
      client_full_name: z.string().min(1).optional(),
    })
    .refine((v) => Boolean((v.client_name ?? v.client_full_name)?.trim()), {
      message: "Client name is required",
      path: ["client_name"],
    }),
]);
async function upsertClientWithName(opts: {
  supabase: Awaited<ReturnType<typeof supabaseServer>>;
  org_id: string;
  email: string;
  name: string;
}) {
  const { supabase, org_id, email, name } = opts;

  const safeSelectClient = async () => {
    // NOTE: `single()` will throw if multiple rows match (common when there is no unique
    // constraint yet). Use `limit(1)` and pick the first row instead.
    const pickFirst = (r: any) => {
      const data = Array.isArray(r?.data) ? r.data : r?.data ? [r.data] : [];
      return { data: data[0] ?? null, error: r?.error ?? null };
    };

    // Prefer full_name if it exists
    const r1 = await supabase
      .from("clients")
      .select("id, email, full_name")
      .eq("org_id", org_id)
      .eq("email", email)
      .limit(1);

    const p1 = pickFirst(r1 as any);
    if (!p1.error) return { data: p1.data, error: null as any };

    // If full_name column doesn't exist, fall back to id/email only
    if (isMissingColumnError(p1.error, "full_name")) {
      const r2 = await supabase
        .from("clients")
        .select("id, email")
        .eq("org_id", org_id)
        .eq("email", email)
        .limit(1);

      const p2 = pickFirst(r2 as any);
      return { data: p2.data, error: p2.error };
    }

    return { data: null, error: p1.error };
  };

  const hasNoConflictConstraint = (err: any) => {
    const msg = String(err?.message || err || "").toLowerCase();
    return msg.includes("no unique") && msg.includes("on conflict");
  };

  const manualUpsert = async () => {
    // 1) Try to find an existing client by org_id+email
    const existing = await safeSelectClient();
    if (existing.error && !isMissingColumnError(existing.error, "full_name")) {
      // If we got a real error (not just missing column), surface it.
      return existing;
    }

    if (existing.data?.id) {
      // 2) Update name if possible
      const upd1 = await supabase
        .from("clients")
        .update({ full_name: name })
        .eq("id", existing.data.id)
        .eq("org_id", org_id);

      const updErr1 = (upd1 as any).error ?? null;
      if (updErr1 && !isMissingColumnError(updErr1, "full_name")) {
        return { data: null, error: updErr1 };
      }

      const upd2 = await supabase
        .from("clients")
        .update({ name })
        .eq("id", existing.data.id)
        .eq("org_id", org_id);

      const updErr2 = (upd2 as any).error ?? null;
      if (updErr2 && !isMissingColumnError(updErr2, "name")) {
        return { data: null, error: updErr2 };
      }

      return await safeSelectClient();
    }

    // 3) Insert new client (try full_name first; if missing, insert without it)
    {
      const ins1 = await supabase
        .from("clients")
        .insert({ org_id, email, full_name: name })
        .select("id")
        .limit(1);

      const insErr1 = (ins1 as any).error ?? null;
      if (!insErr1) return await safeSelectClient();

      if (!isMissingColumnError(insErr1, "full_name")) {
        return { data: null, error: insErr1 };
      }
    }

    {
      const ins2 = await supabase
        .from("clients")
        .insert({ org_id, email })
        .select("id")
        .limit(1);

      const insErr2 = (ins2 as any).error ?? null;
      if (insErr2) return { data: null, error: insErr2 };

      // Best-effort set name columns after insert
      const upd1 = await supabase
        .from("clients")
        .update({ full_name: name })
        .eq("org_id", org_id)
        .eq("email", email);

      const updErr1 = (upd1 as any).error ?? null;
      if (updErr1 && !isMissingColumnError(updErr1, "full_name")) {
        return { data: null, error: updErr1 };
      }

      const upd2 = await supabase
        .from("clients")
        .update({ name })
        .eq("org_id", org_id)
        .eq("email", email);

      const updErr2 = (upd2 as any).error ?? null;
      if (updErr2 && !isMissingColumnError(updErr2, "name")) {
        return { data: null, error: updErr2 };
      }

      return await safeSelectClient();
    }
  };

  const upsertWithConflict = async (payload: Record<string, any>) =>
    supabase.from("clients").upsert(payload, { onConflict: "org_id,email" });

  // 1) Try writing via upsert with onConflict (fast path)
  {
    const u1 = await upsertWithConflict({ org_id, email, full_name: name });
    const err = (u1 as any).error ?? null;

    if (!err) return await safeSelectClient();

    // If the deployment doesn't have a unique constraint for org_id,email, fall back.
    if (hasNoConflictConstraint(err)) {
      return await manualUpsert();
    }

    // If full_name doesn't exist, try upsert without it (still may hit constraint issue)
    if (isMissingColumnError(err, "full_name")) {
      const u2 = await upsertWithConflict({ org_id, email });
      const err2 = (u2 as any).error ?? null;

      if (!err2) {
        // Best-effort update name columns
        const upd1 = await supabase
          .from("clients")
          .update({ full_name: name })
          .eq("org_id", org_id)
          .eq("email", email);

        const updErr1 = (upd1 as any).error ?? null;
        if (updErr1 && !isMissingColumnError(updErr1, "full_name")) {
          return { data: null, error: updErr1 };
        }

        const upd2 = await supabase
          .from("clients")
          .update({ name })
          .eq("org_id", org_id)
          .eq("email", email);

        const updErr2 = (upd2 as any).error ?? null;
        if (updErr2 && !isMissingColumnError(updErr2, "name")) {
          return { data: null, error: updErr2 };
        }

        return await safeSelectClient();
      }

      if (hasNoConflictConstraint(err2)) {
        return await manualUpsert();
      }

      // Any other error should surface.
      return { data: null, error: err2 };
    }

    // Any other error should surface.
    return { data: null, error: err };
  }
}
async function getClientByIdWithOptionalName(opts: {
  supabase: Awaited<ReturnType<typeof supabaseServer>>;
  org_id: string;
  client_id: string;
}) {
  const { supabase, org_id, client_id } = opts;

  // Try the richest shape first.
  const r1 = await supabase
    .from("clients")
    .select("id, full_name, name")
    .eq("id", client_id)
    .eq("org_id", org_id)
    .maybeSingle();

  const d1 = (r1 as any).data ?? null;
  const e1 = (r1 as any).error ?? null;
  if (!e1) return { data: d1, error: null as any };

  // If `name` column doesn't exist, retry without it.
  if (isMissingColumnError(e1, "name")) {
    const r2 = await supabase
      .from("clients")
      .select("id, full_name")
      .eq("id", client_id)
      .eq("org_id", org_id)
      .maybeSingle();

    return { data: (r2 as any).data ?? null, error: (r2 as any).error ?? null };
  }

  // If `full_name` column doesn't exist, retry with `name` only.
  if (isMissingColumnError(e1, "full_name")) {
    const r3 = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", client_id)
      .eq("org_id", org_id)
      .maybeSingle();

    const d3 = (r3 as any).data ?? null;
    const e3 = (r3 as any).error ?? null;

    // If `name` also doesn't exist, fall back to just `id`.
    if (e3 && isMissingColumnError(e3, "name")) {
      const r4 = await supabase
        .from("clients")
        .select("id")
        .eq("id", client_id)
        .eq("org_id", org_id)
        .maybeSingle();

      return { data: (r4 as any).data ?? null, error: (r4 as any).error ?? null };
    }

    return { data: d3, error: e3 };
  }

  return { data: null, error: e1 };
}

export async function GET() {
  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");
  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_view")) {
    return jsonError(403, "Forbidden");
  }

  // Prefer richer columns if they exist in your schema, but be defensive: some deployments
  // won't have denormalized fields like `client_full_name` / `client_email`.
  const selectExtendedWithDenorm =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id, client_full_name, client_email";
  const selectExtendedNoDenorm =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id";
  const selectBaseWithDenorm =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id, client_full_name, client_email";
  const selectBaseNoDenorm =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id";

  const run = (sel: string) =>
    supabase
      .from("onboardings")
      .select(sel)
      .eq("org_id", org_id)
      .order("updated_at", { ascending: false });

  // Try a small set of increasingly compatible selects.
  const selectCandidates = [
    selectExtendedWithDenorm,
    selectExtendedNoDenorm,
    selectBaseWithDenorm,
    selectBaseNoDenorm,
  ];

  let data: any[] | null = null;
  let error: any = null;

  for (const sel of selectCandidates) {
    const r = await run(sel);
    data = (r as any).data ?? null;
    error = (r as any).error ?? null;
    if (!error) break;

    // If we hit a missing column/table error, try the next candidate.
    const msg = String(error?.message || "");
    const isSchemaError =
      msg.toLowerCase().includes("schema cache") ||
      msg.toLowerCase().includes("does not exist") ||
      msg.toLowerCase().includes("could not find") ||
      msg.toLowerCase().includes("column");

    if (!isSchemaError) break;

    // If the error isn't about missing columns, stop.
    // Otherwise keep looping.
  }

  if (error) return jsonError(400, error.message);

  const rows = data ?? [];
  if (rows.length === 0) return NextResponse.json({ onboardings: [] });

  // --- Enrich with client + template display data without depending on optional columns/relations ---
  const clientIds = Array.from(new Set(rows.map((r) => r.client_id).filter(Boolean)));
  const templateIds = Array.from(new Set(rows.map((r) => r.template_id).filter(Boolean)));

  // Clients: prefer full_name if it exists; fall back defensively.
  let clientsById: Record<string, { id: string; email?: string | null; name?: string | null }> = {};
  if (clientIds.length > 0) {
    let cData: any[] | null = null;
    let cErr: any = null;

    // Prefer `full_name` first (most common in your current schema).
    const r1 = await supabase
      .from("clients")
      .select("id, email, full_name")
      .eq("org_id", org_id)
      .in("id", clientIds);

    cData = (r1 as any).data ?? null;
    cErr = (r1 as any).error ?? null;

    // If full_name doesn't exist, try `name`.
    if (cErr && isMissingColumnError(cErr, "full_name")) {
      const r2 = await supabase
        .from("clients")
        .select("id, email, name")
        .eq("org_id", org_id)
        .in("id", clientIds);

      cData = (r2 as any).data ?? null;
      cErr = (r2 as any).error ?? null;

      // If name also doesn't exist, fall back to id/email.
      if (cErr && isMissingColumnError(cErr, "name")) {
        const r3 = await supabase
          .from("clients")
          .select("id, email")
          .eq("org_id", org_id)
          .in("id", clientIds);

        cData = (r3 as any).data ?? null;
        cErr = (r3 as any).error ?? null;
      }
    }

    // If client enrichment fails for any other reason, don't break the list endpoint.
    if (!cErr && cData) {
      clientsById = Object.fromEntries(
        cData.map((c: any) => [
          c.id,
          {
            id: c.id,
            email: c.email ?? null,
            // Normalize to `name` for UI usage.
            name: (c.full_name ?? c.name ?? null) as any,
          },
        ])
      );
    }
  }

  // Templates: your schema uses `name` (see Supabase UI). Be defensive and fall back to `title` if needed.
  let templatesById: Record<string, { id: string; name?: string | null }> = {};
  if (templateIds.length > 0) {
    let tData: any[] | null = null;
    let tErr: any = null;

    // Prefer `name` first.
    const r1 = await supabase
      .from("templates")
      .select("id, name")
      .eq("org_id", org_id)
      .in("id", templateIds);

    tData = (r1 as any).data ?? null;
    tErr = (r1 as any).error ?? null;

    if (tErr && isMissingColumnError(tErr, "name")) {
      // Extremely defensive: older schema might use `title`.
      const r2 = await supabase
        .from("templates")
        .select("id, title")
        .eq("org_id", org_id)
        .in("id", templateIds);

      tData = (r2 as any).data ?? null;
      tErr = (r2 as any).error ?? null;

      if (!tErr && tData) {
        templatesById = Object.fromEntries(
          tData.map((t: any) => [t.id, { id: t.id, name: t.title ?? null }])
        );
      }
    } else if (!tErr && tData) {
      templatesById = Object.fromEntries(
        tData.map((t: any) => [t.id, { id: t.id, name: t.name ?? null }])
      );
    }
  }

  const enriched = rows.map((o: any) => {
    const client = o.client_id ? clientsById[o.client_id] : undefined;
    const template = o.template_id ? templatesById[o.template_id] : undefined;

    // Prefer denormalized columns on onboardings if present.
    const resolvedClientEmail = o.client_email ?? client?.email ?? null;
    const resolvedClientName = o.client_full_name ?? o.client_name ?? client?.name ?? null;

    const resolvedTemplateName = (template as any)?.name ?? null;

    return {
      ...o,
      // UI-friendly fields
      client_email: resolvedClientEmail,
      client_name: resolvedClientName,
      client_full_name: resolvedClientName,

      template_name: resolvedTemplateName,

      // Backward compatibility for older UI code
      template_title: resolvedTemplateName,
    };
  });

  return NextResponse.json({ onboardings: enriched });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");
  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_write")) {
    return jsonError(403, "Forbidden");
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", org_id)
    .single();

  if (orgError) return jsonError(400, orgError.message);

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);
  const maxActiveOnboardings = maxActiveOnboardingsForTier(tier);

  const activeStatuses = ["draft", "sent", "in_progress", "in progress", "submitted", "locked"];

  const { count: activeCount, error: activeCountError } = await supabase
    .from("onboardings")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org_id)
    .in("status", activeStatuses);

  if (activeCountError) return jsonError(400, activeCountError.message);

  if ((activeCount ?? 0) >= maxActiveOnboardings) {
    return jsonError(
      403,
      tier === "free"
        ? "Your current plan allows up to 5 active onboardings. Upgrade to Pro to create more."
        : tier === "pro"
          ? "Your current plan allows up to 50 active onboardings. Upgrade to Business to create more."
          : `Your current plan allows up to ${maxActiveOnboardings} active onboardings.`
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = CreatePayload.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload");

  const title = (parsed.data.title?.trim() || "Onboarding").slice(0, 160);

  // Resolve template: prefer provided template_id, otherwise fall back to the first org template.
  let template_id: string | null = (parsed.data as any).template_id ?? null;

  if (template_id) {
    const { data: tpl, error: tplErr } = await supabase
      .from("templates")
      .select("id")
      .eq("id", template_id)
      .eq("org_id", org_id)
      .single();

    if (tplErr || !tpl) return jsonError(404, "Template not found");
    template_id = tpl.id;
  } else {
    const { data: tpl, error: tplErr } = await supabase
      .from("templates")
      .select("id")
      .eq("org_id", org_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (tplErr || !tpl?.id) return jsonError(400, "No template available");
    template_id = tpl.id;
  }

  let client_id: string;

  // 1) Direct client_id payload
  if ("client_id" in parsed.data) {
    // Validate client belongs to org and has a name
    const { data: client, error: clientErr } = await getClientByIdWithOptionalName({
      supabase,
      org_id,
      client_id: parsed.data.client_id,
    });

    if (clientErr || !client) return jsonError(404, "Client not found");

    const nm = String((client as any)?.full_name ?? (client as any)?.name ?? "").trim();
    if (!nm) return jsonError(400, "Selected client is missing a name");

    client_id = client.id;
  }
  // 2) Nested client object payload
  else if ("client" in parsed.data) {
    const c: any = (parsed.data as any).client;

    // Existing client by id
    if (c?.id) {
      const { data: client, error: clientErr } = await getClientByIdWithOptionalName({
        supabase,
        org_id,
        client_id: String(c.id),
      });

      if (clientErr || !client) return jsonError(404, "Client not found");

      const nm = String((client as any)?.full_name ?? (client as any)?.name ?? "").trim();
      if (!nm) return jsonError(400, "Selected client is missing a name");

      client_id = client.id;
    }
    // Create/resolve by email + name (name required by schema)
    else {
      const email = String(c.email ?? "").trim().toLowerCase();
      const name = String((c.name ?? c.full_name) ?? "").trim();

      if (!email) return jsonError(400, "Client email is required");
      if (!name) return jsonError(400, "Client name is required");

      // Upsert client so it always appears in /dashboard/clients
      const up = await upsertClientWithName({ supabase, org_id, email, name });
      if (up.error || !up.data) return jsonError(400, up.error?.message || "Failed to upsert client");
      client_id = up.data.id;

      // Touch updated_at so new clients reliably appear in Clients section
      const touch = await supabase
        .from("clients")
        .update({ updated_at: new Date().toISOString() })
        .eq("org_id", org_id)
        .eq("id", client_id);

      const touchErr = (touch as any).error ?? null;
      if (touchErr && !isMissingColumnError(touchErr, "updated_at")) {
        return jsonError(400, touchErr.message);
      }
    }
  }
  // 3) Flat fields payload (requires client_name or client_full_name)
  else {
    const email = String((parsed.data as any).client_email ?? "").trim().toLowerCase();
    const name = String(((parsed.data as any).client_name ?? (parsed.data as any).client_full_name) ?? "").trim();

    if (!email) return jsonError(400, "Client email is required");
    if (!name) return jsonError(400, "Client name is required");

    const up = await upsertClientWithName({ supabase, org_id, email, name });
    if (up.error || !up.data) return jsonError(400, up.error?.message || "Failed to upsert client");
    client_id = up.data.id;

    // Touch updated_at so new clients reliably appear in Clients section
    const touch = await supabase
      .from("clients")
      .update({ updated_at: new Date().toISOString() })
      .eq("org_id", org_id)
      .eq("id", client_id);

    const touchErr = (touch as any).error ?? null;
    if (touchErr && !isMissingColumnError(touchErr, "updated_at")) {
      return jsonError(400, touchErr.message);
    }
  }

  const now = new Date().toISOString();

  // Some environments may not have newer columns (e.g. created_by). Try with the full payload,
  // and fall back gracefully if the schema doesn't include optional columns.
  const insertBase: Record<string, any> = {
    org_id,
    client_id,
    template_id,
    title,
    status: "draft",
    // Some schemas enforce NOT NULL on client_token without a DB default.
    // Generate it here so onboarding creation always succeeds.
    client_token: randomUUID(),
    updated_at: now,
  };

  const tryInsert = async (payload: Record<string, any>) =>
    supabase
      .from("onboardings")
      .insert(payload)
      .select("id, title, status, client_token, created_at, updated_at, client_id, template_id")
      .single();

  // Some schemas require a NOT NULL creator column. We support the common variants:
  // - created_by_user_id (your schema)
  // - created_by (older variants)
  // If one exists, we MUST populate it.
  let onboarding: any = null;
  let onboardingErr: any = null;

  // 1) Prefer `created_by_user_id`
  {
    const r1 = await tryInsert({ ...insertBase, created_by_user_id: user.id });
    onboarding = (r1 as any).data ?? null;
    onboardingErr = (r1 as any).error ?? null;

    // If that column doesn't exist, fall back to `created_by`.
    if (onboardingErr && isMissingColumnError(onboardingErr, "created_by_user_id")) {
      const r2 = await tryInsert({ ...insertBase, created_by: user.id });
      onboarding = (r2 as any).data ?? null;
      onboardingErr = (r2 as any).error ?? null;
    }

    // If `created_by` also doesn't exist, only then try without any creator column.
    // NOTE: If your DB enforces a NOT NULL creator column, this attempt will fail —
    // which is correct and will surface a clear error.
    if (onboardingErr && isMissingColumnError(onboardingErr, "created_by")) {
      const r3 = await tryInsert(insertBase);
      onboarding = (r3 as any).data ?? null;
      onboardingErr = (r3 as any).error ?? null;
    }

    // Secondary fallback: if `updated_at` is missing (older schema), retry without it.
    if (onboardingErr && isMissingColumnError(onboardingErr, "updated_at")) {
      const { updated_at, ...withoutUpdatedAt } = insertBase;

      // Keep creator column if it exists/was required.
      const msg = String(onboardingErr?.message || "");
      // Try updated_at-less with created_by_user_id first, then created_by, then none.
      let r4 = await tryInsert({ ...withoutUpdatedAt, created_by_user_id: user.id });
      onboarding = (r4 as any).data ?? null;
      onboardingErr = (r4 as any).error ?? null;

      if (onboardingErr && isMissingColumnError(onboardingErr, "created_by_user_id")) {
        const r5 = await tryInsert({ ...withoutUpdatedAt, created_by: user.id });
        onboarding = (r5 as any).data ?? null;
        onboardingErr = (r5 as any).error ?? null;
      }

      if (onboardingErr && isMissingColumnError(onboardingErr, "created_by")) {
        const r6 = await tryInsert(withoutUpdatedAt);
        onboarding = (r6 as any).data ?? null;
        onboardingErr = (r6 as any).error ?? null;
      }
    }
  }

  if (onboardingErr || !onboarding) {
    return jsonError(400, onboardingErr?.message || "Failed to create onboarding");
  }

  // --- Snapshot template + generate onboarding requirements (from templates.definition) ---
  try {
    const { data: tplRow, error: tplRowErr } = await supabase
      .from("templates")
      .select("id, definition")
      .eq("id", template_id)
      .eq("org_id", org_id)
      .single();

    if (!tplRowErr && tplRow) {
      const definition = (tplRow as any).definition ?? null;

      // 1) Snapshot into onboarding_versions (best-effort, schema varies)
      if (definition) {
        const versionBase: Record<string, any> = {
          onboarding_id: onboarding.id,
          template_id,
          created_at: new Date().toISOString(),
        };

        const candidates: Array<Record<string, any>> = [
          { ...versionBase, definition },
          { ...versionBase, template_snapshot: definition },
          { ...versionBase, definition_snapshot: definition },
          { ...versionBase, snapshot: definition },
          { ...versionBase, snapshot_json: definition },
        ];

        for (const payload of candidates) {
          const { error: vErr } = await supabase.from("onboarding_versions").insert(payload);
          if (!vErr) break;
          // If the table or column doesn't exist, keep trying other shapes.
          if (
            String(vErr?.message || "").toLowerCase().includes("does not exist") ||
            String(vErr?.message || "").toLowerCase().includes("schema cache")
          ) {
            continue;
          }
          // Any other error: stop trying versions but don't fail onboarding creation.
          break;
        }
      }

      // 2) Generate onboarding_requirements rows from template definition
      // We support common shapes:
      // - { requirements: [...] }
      // - { fields: [...] }
      // - { schema: [...] }
      const defObj = typeof definition === "object" && definition ? (definition as any) : null;
      const rawList: any[] =
        (defObj && Array.isArray(defObj.requirements) ? defObj.requirements : null) ??
        (defObj && Array.isArray(defObj.fields) ? defObj.fields : null) ??
        (defObj && Array.isArray(defObj.schema) ? defObj.schema : null) ??
        [];

      if (rawList.length > 0) {
        const nowIso = new Date().toISOString();

        const rows = rawList.map((it: any, idx: number) => {
          const type = it.type ?? it.kind ?? it.field_type ?? it.input_type ?? "text";
          const label = it.label ?? it.name ?? it.title ?? it.prompt ?? `Field ${idx + 1}`;
          const is_required = Boolean(it.is_required ?? it.required ?? it.mandatory ?? false);
          const sort_order = Number(it.sort_order ?? it.position ?? it.order ?? idx);

          // If the template contains a stable id/key, keep it for traceability.
          const requirement_key = it.id ?? it.key ?? it.slug ?? null;

          return {
            org_id,
            onboarding_id: onboarding.id,
            type,
            label,
            is_required,
            sort_order,
            requirement_key,
            created_at: nowIso,
            updated_at: nowIso,
          };
        });

        // Insert defensively (some schemas won't have requirement_key/created_at/updated_at)
        let { error: rErr } = await supabase.from("onboarding_requirements").insert(rows);

        if (rErr && isMissingColumnError(rErr, "requirement_key")) {
          const stripped = rows.map(({ requirement_key, ...rest }) => rest);
          const r2 = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (r2 as any).error ?? null;
        }

        if (rErr && isMissingColumnError(rErr, "updated_at")) {
          const stripped = rows.map(({ updated_at, ...rest }) => rest);
          const r3 = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (r3 as any).error ?? null;
        }

        if (rErr && isMissingColumnError(rErr, "created_at")) {
          const stripped = rows.map(({ created_at, updated_at, ...rest }) => rest);
          const r4 = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (r4 as any).error ?? null;
        }

        // Do not fail onboarding creation if requirements generation fails.
      }
    }
  } catch {
    // Best-effort only.
  }

  return NextResponse.json({ ok: true, onboarding });
}