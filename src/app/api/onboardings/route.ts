import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { randomUUID } from "crypto";
import {
  maxActiveOnboardingsForTier,
  onboardingLimitMessage,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";

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

// Enterprise onboarding optional fields added to every variant
const EnterpriseFields = {
  event_id: z.string().uuid().optional().nullable(),
  client_type_id: z.string().uuid().optional().nullable(),
  company_name: z.string().optional().nullable(),
};

const CreatePayload = z.union([
  // ID-based (admin UI can use this)
  z.object({
    title: z.string().min(1).max(160).optional(),
    template_id: z.string().uuid().optional(),
    owner_id: z.string().uuid().optional(),
    client_id: z.string().uuid(),
    ...EnterpriseFields,
  }),
  // Nested client object (supports either selecting an existing client by id, or providing email+name/full_name)
  z.object({
    title: z.string().min(1).max(160).optional(),
    template_id: z.string().uuid().optional(),
    owner_id: z.string().uuid().optional(),
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
    ...EnterpriseFields,
  }),
  // Flat fields (current modal posts this)
  z
    .object({
      title: z.string().min(1).max(160).optional(),
      template_id: z.string().uuid().optional(),
      owner_id: z.string().uuid().optional(),
      client_email: z.string().email(),
      client_name: z.string().min(1).optional(),
      client_full_name: z.string().min(1).optional(),
      ...EnterpriseFields,
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

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");
  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_view")) {
    return jsonError(403, permissionDenied("You do not have access to view onboardings."));
  }

  // Prefer richer columns if they exist in your schema, but be defensive: some deployments
  // won't have denormalized fields like `client_full_name` / `client_email`.
  const selectExtendedWithDenorm =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id, client_full_name, client_email, owner_id, client_type_id, event_id";
  const selectExtendedNoDenorm =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id, owner_id, client_type_id, event_id";
  const selectBaseWithDenorm =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id, client_full_name, client_email, owner_id, client_type_id, event_id";
  const selectBaseNoDenorm =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id, owner_id, client_type_id, event_id";
  const selectExtendedWithDenormNoOwner =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id, client_full_name, client_email, client_type_id, event_id";
  const selectExtendedNoDenormNoOwner =
    "id, title, status, client_token, created_at, updated_at, locked_at, submitted_at, client_id, template_id, client_type_id, event_id";
  const selectBaseWithDenormNoOwner =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id, client_full_name, client_email, client_type_id, event_id";
  const selectBaseNoDenormNoOwner =
    "id, title, status, client_token, created_at, updated_at, client_id, template_id, client_type_id, event_id";

  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 100), 1), 500);
  const filterEventId = url.searchParams.get("event_id") ?? null;
  const noEvent = url.searchParams.get("no_event") === "1";

  const run = (sel: string) => {
    let q = supabase
      .from("onboardings")
      .select(sel)
      .eq("org_id", org_id)
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (filterEventId) q = (q as any).eq("event_id", filterEventId);
    if (noEvent) q = (q as any).is("event_id", null);
    return q;
  };

  // Try a small set of increasingly compatible selects.
  const selectCandidates = [
    selectExtendedWithDenorm,
    selectExtendedNoDenorm,
    selectBaseWithDenorm,
    selectBaseNoDenorm,
    // Fallbacks without owner_id in case the column doesn't exist yet
    selectExtendedWithDenormNoOwner,
    selectExtendedNoDenormNoOwner,
    selectBaseWithDenormNoOwner,
    selectBaseNoDenormNoOwner,
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

  const includeArchived = url.searchParams.get("include_archived") === "1";

  const rows = (data ?? []).filter((r: any) => {
    const s = String(r?.status ?? "").trim().toLowerCase();
    if (!s) return true;
    if (s === "deleted") return false;
    if (s === "archived" && !includeArchived) return false;
    return true;
  });
  if (rows.length === 0) return NextResponse.json({ onboardings: [] });

  // --- Enrich with client + template display data without depending on optional columns/relations ---
  const clientIds = Array.from(new Set(rows.map((r) => r.client_id).filter(Boolean)));
  const templateIds = Array.from(new Set(rows.map((r) => r.template_id).filter(Boolean)));

  // Clients: prefer full_name if it exists; fall back defensively.
  let clientsById: Record<string, { id: string; email?: string | null; name?: string | null; company_name?: string | null }> = {};
  if (clientIds.length > 0) {
    let cData: any[] | null = null;
    let cErr: any = null;

    // Prefer `full_name` + `company_name` first; fall back defensively.
    const r1 = await supabase
      .from("clients")
      .select("id, email, full_name, company_name")
      .eq("org_id", org_id)
      .in("id", clientIds);

    cData = (r1 as any).data ?? null;
    cErr = (r1 as any).error ?? null;

    // If company_name column doesn't exist yet, retry without it.
    if (cErr && isMissingColumnError(cErr, "company_name")) {
      const r1b = await supabase
        .from("clients")
        .select("id, email, full_name")
        .eq("org_id", org_id)
        .in("id", clientIds);
      cData = (r1b as any).data ?? null;
      cErr = (r1b as any).error ?? null;
    }

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
            company_name: c.company_name ?? null,
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

  // Fetch custom domain for portal link generation (best-effort)
  let portalBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://clientenforce.com";
  try {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("white_label_settings")
      .eq("id", org_id)
      .single();
    const customDomain = (orgRow as any)?.white_label_settings?.custom_domain?.trim();
    if (customDomain) portalBase = `https://${customDomain}`;
  } catch { /* use default */ }

  // Owners: look up full_name for any owner_id values present on onboardings.
  const ownerIds = Array.from(new Set(rows.map((r: any) => r.owner_id).filter(Boolean)));
  let ownerNamesById: Record<string, string | null> = {};
  if (ownerIds.length > 0) {
    const { data: ownerProfiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", ownerIds);

    if (ownerProfiles) {
      for (const p of ownerProfiles) {
        ownerNamesById[String((p as any).user_id)] = (p as any).full_name || (p as any).email || null;
      }
    }
  }

  // Enrich with phase data (active phase per onboarding)
  const onboardingIds = rows.map((r: any) => r.id).filter(Boolean);
  let phasesByOnboardingId: Record<string, { phase_number: number; name: string; status: string; deadline: string | null }> = {};
  let clientTypeNamesById: Record<string, string> = {};

  if (onboardingIds.length > 0) {
    const { data: phases } = await supabase
      .from("onboarding_phases")
      .select("onboarding_id, phase_number, name, status, deadline")
      .in("onboarding_id", onboardingIds)
      .order("phase_number", { ascending: false });

    if (phases) {
      for (const p of phases as any[]) {
        const existing = phasesByOnboardingId[p.onboarding_id];
        // Pick the highest-number non-locked phase as "current"
        if (!existing || (p.status !== "locked" && (existing.status === "locked" || p.phase_number > existing.phase_number))) {
          phasesByOnboardingId[p.onboarding_id] = p;
        }
      }
    }

    // Enrich client_type_name
    const ctIds = Array.from(new Set(rows.map((r: any) => r.client_type_id).filter(Boolean)));
    if (ctIds.length > 0) {
      const { data: ctRows } = await supabase
        .from("client_types")
        .select("id, name")
        .in("id", ctIds);
      if (ctRows) {
        for (const ct of ctRows as any[]) clientTypeNamesById[ct.id] = ct.name;
      }
    }
  }

  const enriched = rows.map((o: any) => {
    const client = o.client_id ? clientsById[o.client_id] : undefined;
    const template = o.template_id ? templatesById[o.template_id] : undefined;
    const phase = phasesByOnboardingId[o.id];

    // Prefer denormalized columns on onboardings if present.
    const resolvedClientEmail = o.client_email ?? client?.email ?? null;
    const resolvedClientName = o.client_full_name ?? o.client_name ?? client?.name ?? null;
    const resolvedCompanyName = client?.company_name ?? null;

    const resolvedTemplateName = (template as any)?.name ?? null;
    const resolvedOwnerName = o.owner_id ? (ownerNamesById[o.owner_id] ?? null) : null;

    const token = o.client_token ?? o.clientToken ?? o.token ?? null;
    const clientLink = token ? `${portalBase}/c/${token}` : null;

    return {
      ...o,
      // UI-friendly fields
      client_email: resolvedClientEmail,
      client_name: resolvedClientName,
      client_full_name: resolvedClientName,
      company_name: resolvedCompanyName,
      template_name: resolvedTemplateName,
      template_title: resolvedTemplateName,
      owner_name: resolvedOwnerName,
      client_link: clientLink,
      // Phase + type enrichment
      client_type_name: o.client_type_id ? (clientTypeNamesById[o.client_type_id] ?? null) : null,
      current_phase: phase?.phase_number ?? null,
      phase_name: phase?.name ?? null,
      phase_status: phase?.status ?? null,
      phase_deadline: phase?.deadline ?? null,
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
    return jsonError(403, permissionDenied("You do not have access to create onboardings."));
  }

  const { tier, error: orgError } = await selectOrganizationTier(supabase, org_id);

  if (orgError) return jsonError(400, orgError.message);

  const maxActiveOnboardings = maxActiveOnboardingsForTier(tier);

  const activeStatuses = ["draft", "sent", "in_progress", "in progress", "submitted", "locked"];

  const { count: activeCount, error: activeCountError } = await supabase
    .from("onboardings")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org_id)
    .in("status", activeStatuses);

  if (activeCountError) return jsonError(400, activeCountError.message);

  if ((activeCount ?? 0) >= maxActiveOnboardings) {
    return jsonError(403, onboardingLimitMessage(tier, maxActiveOnboardings));
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

  // Save company_name to the client record if provided (best-effort; ignored if column absent)
  const company_name = (parsed.data as any).company_name ?? null;
  if (company_name && client_id) {
    try {
      await supabase.from("clients").update({ company_name } as any).eq("id", client_id).eq("org_id", org_id);
    } catch { /* best-effort */ }
  }

  const owner_id = (parsed.data as any).owner_id ?? null;
  const event_id = (parsed.data as any).event_id ?? null;
  const client_type_id = (parsed.data as any).client_type_id ?? null;

  // Validate enterprise fields if present: org must have the flag
  if (event_id || client_type_id) {
    const { orgHasFeature } = await import("@/lib/feature-flags");
    const flagOn = await orgHasFeature(org_id, "enterprise_onboarding");
    if (!flagOn) return jsonError(400, "Invalid payload");
  }

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
    ...(owner_id ? { owner_id } : {}),
    ...(event_id ? { event_id } : {}),
    ...(client_type_id ? { client_type_id } : {}),
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

  const runInsertChain = async (base: Record<string, any>) => {
    // 1) Prefer `created_by_user_id`
    const r1 = await tryInsert({ ...base, created_by_user_id: user.id });
    let ob = (r1 as any).data ?? null;
    let err = (r1 as any).error ?? null;

    // If that column doesn't exist, fall back to `created_by`.
    if (err && isMissingColumnError(err, "created_by_user_id")) {
      const r2 = await tryInsert({ ...base, created_by: user.id });
      ob = (r2 as any).data ?? null;
      err = (r2 as any).error ?? null;
    }

    // If `created_by` also doesn't exist, only then try without any creator column.
    if (err && isMissingColumnError(err, "created_by")) {
      const r3 = await tryInsert(base);
      ob = (r3 as any).data ?? null;
      err = (r3 as any).error ?? null;
    }

    // Secondary fallback: if `updated_at` is missing (older schema), retry without it.
    if (err && isMissingColumnError(err, "updated_at")) {
      const { updated_at, ...withoutUpdatedAt } = base;

      const r4 = await tryInsert({ ...withoutUpdatedAt, created_by_user_id: user.id });
      ob = (r4 as any).data ?? null;
      err = (r4 as any).error ?? null;

      if (err && isMissingColumnError(err, "created_by_user_id")) {
        const r5 = await tryInsert({ ...withoutUpdatedAt, created_by: user.id });
        ob = (r5 as any).data ?? null;
        err = (r5 as any).error ?? null;
      }

      if (err && isMissingColumnError(err, "created_by")) {
        const r6 = await tryInsert(withoutUpdatedAt);
        ob = (r6 as any).data ?? null;
        err = (r6 as any).error ?? null;
      }
    }

    return { ob, err };
  };

  {
    const { ob, err } = await runInsertChain(insertBase);
    onboarding = ob;
    onboardingErr = err;

    // If owner_id column doesn't exist, retry without it.
    if (onboardingErr && isMissingColumnError(onboardingErr, "owner_id")) {
      const { owner_id: _oid, ...baseWithoutOwner } = insertBase;
      const { ob: ob2, err: err2 } = await runInsertChain(baseWithoutOwner);
      onboarding = ob2;
      onboardingErr = err2;
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
          // Headings are never required — enforce at snapshot time
          const is_required = type === "heading" ? false : Boolean(it.is_required ?? it.required ?? it.mandatory ?? false);
          const sort_order = Number(it.sort_order ?? it.position ?? it.order ?? idx);

          // If the template contains a stable id/key, keep it for traceability.
          const requirement_key = it.id ?? it.key ?? it.slug ?? null;
          const attachment_path = it.attachment_path ?? null;
          const options = it.options ?? null;

          // Build metadata from new per-type config fields (Features 1–3, 5).
          // This is snapshotted so the client portal can read config without loading the template.
          const metadataObj: Record<string, unknown> = {};
          if (it.file_mode) metadataObj.file_mode = it.file_mode;
          if (it.link_url) metadataObj.link_url = it.link_url;
          if (it.allow_multi_select) metadataObj.allow_multi_select = it.allow_multi_select;
          if (it.include_other) metadataObj.include_other = it.include_other;
          if (it.multiline) metadataObj.multiline = it.multiline;
          if (it.visible_if && it.visible_if.depends_on_label) {
            metadataObj.visible_if = {
              depends_on_label: String(it.visible_if.depends_on_label),
              ...(typeof it.visible_if.equals === "string" ? { equals: it.visible_if.equals } : {}),
              ...(it.visible_if.not_empty === true ? { not_empty: true } : {}),
            };
          }
          const metadata = Object.keys(metadataObj).length > 0 ? metadataObj : null;
          const phase_number = typeof it.phase_number === "number" ? it.phase_number : null;

          return {
            org_id,
            onboarding_id: onboarding.id,
            type,
            label,
            is_required,
            sort_order,
            phase_number,
            requirement_key,
            attachment_path,
            options,
            metadata,
            created_at: nowIso,
            updated_at: nowIso,
          };
        });

        // Known stable enum values that exist in all DB versions.
        const STABLE_TYPES = new Set(["text", "file", "signature", "multiple_choice"]);
        function isInvalidEnumError(err: any) {
          const msg = String(err?.message || "");
          return msg.toLowerCase().includes("invalid input value for enum") ||
            (msg.toLowerCase().includes("invalid") && msg.toLowerCase().includes("enum") && msg.toLowerCase().includes("requirement_type"));
        }

        // Insert defensively — strip columns that may not exist in older DB schemas.
        let { error: rErr } = await supabase.from("onboarding_requirements").insert(rows);

        // If the DB enum doesn't have newer types (checkbox, heading), remap them to "text" and retry.
        if (rErr && isInvalidEnumError(rErr)) {
          const remapped = rows.map((r) => ({
            ...r,
            type: STABLE_TYPES.has(r.type) ? r.type : "text",
            // Headings have no interaction, so just become a labeled text item (not required).
            is_required: r.type === "heading" ? false : r.is_required,
          }));
          const rEnum = await supabase.from("onboarding_requirements").insert(remapped);
          rErr = (rEnum as any).error ?? null;
        }

        if (rErr && isMissingColumnError(rErr, "metadata")) {
          const stripped = rows.map(({ metadata, ...rest }) => ({
            ...rest,
            type: STABLE_TYPES.has(rest.type) ? rest.type : "text",
            is_required: rest.type === "heading" ? false : rest.is_required,
          }));
          const rM = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (rM as any).error ?? null;
        }

        if (rErr && isMissingColumnError(rErr, "attachment_path")) {
          const stripped = rows.map(({ attachment_path, options, metadata, ...rest }) => rest);
          const r0 = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (r0 as any).error ?? null;
        }

        if (rErr && isMissingColumnError(rErr, "options")) {
          const stripped = rows.map(({ options, metadata, ...rest }) => rest);
          const r00 = await supabase.from("onboarding_requirements").insert(stripped);
          rErr = (r00 as any).error ?? null;
        }

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

      // Generate onboarding_phases rows if org has enterprise_onboarding flag
      if (event_id || client_type_id) {
        try {
          const { orgHasFeature } = await import("@/lib/feature-flags");
          const flagOn = await orgHasFeature(org_id, "enterprise_onboarding");
          if (flagOn && defObj) {
            const phaseDefs: any[] = defObj.phases ?? [];
            let eventEndDate: string | null = null;

            if (event_id) {
              const { data: eventRow } = await supabase
                .from("events")
                .select("end_date")
                .eq("id", event_id)
                .maybeSingle();
              eventEndDate = (eventRow as any)?.end_date ?? null;
            }

            const nowIso = new Date().toISOString();
            if (phaseDefs.length > 0) {
              const phaseRows = phaseDefs.map((p: any, idx: number) => {
                let deadline: string | null = null;
                if (eventEndDate && typeof p.default_deadline_offset_days === "number") {
                  const d = new Date(eventEndDate);
                  d.setDate(d.getDate() + p.default_deadline_offset_days);
                  deadline = d.toISOString().split("T")[0];
                }
                return {
                  org_id,
                  onboarding_id: onboarding.id,
                  phase_number: p.number ?? idx + 1,
                  name: p.name ?? `Phase ${p.number ?? idx + 1}`,
                  deadline,
                  status: idx === 0 ? "in_progress" : "locked",
                  created_at: nowIso,
                  updated_at: nowIso,
                };
              });
              await supabase.from("onboarding_phases").insert(phaseRows);
            } else {
              // Single fallback phase covering all requirements
              await supabase.from("onboarding_phases").insert({
                org_id,
                onboarding_id: onboarding.id,
                phase_number: 1,
                name: "Onboarding",
                status: "in_progress",
                created_at: nowIso,
                updated_at: nowIso,
              });
            }
          }
        } catch {
          // Best-effort phase generation.
        }
      }
    }
  } catch {
    // Best-effort only.
  }

  // Send invite email to client automatically on creation
  try {
    const { sendOrgEmail } = await import("@/lib/send-email");

    // Fetch client email + name
    const { data: clientRow } = await supabase
      .from("clients")
      .select("email, full_name")
      .eq("id", client_id)
      .single();

    const clientEmail = (clientRow as any)?.email ?? null;
    const clientName = (clientRow as any)?.full_name ?? "there";

    if (clientEmail) {
      // Resolve portal base (custom domain or default)
      let portalBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://clientenforce.com";
      try {
        const { loadWhiteLabelForOrg } = await import("@/lib/white-label");
        const wl = await loadWhiteLabelForOrg(org_id);
        const customDomain = (wl as any)?.custom_domain?.trim();
        if (customDomain) portalBase = `https://${customDomain}`;
      } catch { /* use default */ }

      const token = (onboarding as any).client_token;
      const portalLink = `${portalBase}/c/${token}`;

      // Fetch event name if applicable
      let eventName: string | null = null;
      if (event_id) {
        try {
          const { data: eventRow } = await supabase
            .from("events")
            .select("name")
            .eq("id", event_id)
            .single();
          eventName = (eventRow as any)?.name ?? null;
        } catch { /* best-effort */ }
      }

      const subject = eventName
        ? `You have been invited to complete your onboarding for ${eventName}`
        : `You have been invited to complete your onboarding`;

      const html = eventName
        ? `<p>Hi ${clientName},</p><p>You have been invited to complete your onboarding for <strong>${eventName}</strong>.</p><p><a href="${portalLink}">Click here to get started</a></p>`
        : `<p>Hi ${clientName},</p><p>You have been invited to complete your onboarding.</p><p><a href="${portalLink}">Click here to get started</a></p>`;

      const text = eventName
        ? `Hi ${clientName},\n\nYou have been invited to complete your onboarding for ${eventName}.\n\nGet started: ${portalLink}`
        : `Hi ${clientName},\n\nYou have been invited to complete your onboarding.\n\nGet started: ${portalLink}`;

      await sendOrgEmail(org_id, { to: clientEmail, subject, html, text });
    }
  } catch { /* Don't fail onboarding creation if email errors */ }

  return NextResponse.json({ ok: true, onboarding });
}
