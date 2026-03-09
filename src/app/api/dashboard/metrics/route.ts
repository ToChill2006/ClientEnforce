import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

export const runtime = "nodejs";

type Warning = { key: string; message: string };

function isMissingColumnOrRelation(msg: string) {
  const m = (msg || "").toLowerCase();

  // Classic schema drift
  if (
    m.includes("does not exist") ||
    m.includes("column") ||
    m.includes("relation") ||
    m.includes("schema cache")
  ) {
    return true;
  }

  // PostgREST relationship/embed drift (common when using embedded joins)
  if (
    m.includes("could not find a relationship") ||
    m.includes("no relationship") ||
    m.includes("relationship") ||
    m.includes("foreign key") ||
    m.includes("could not embed") ||
    m.includes("failed to parse select") ||
    m.includes("select parameter")
  ) {
    return true;
  }

  return false;
}

async function safeCount(
  supabase: any,
  warnings: Warning[],
  key: string,
  table: string,
  orgId: string
) {
  // Org scoping has drifted across deployments.
  const scopeCols = ["org_id", "organization_id", "workspace_id", "team_id"];
  let lastSchemaError: string | null = null;

  const buildHeadCount = (scopeCol: string, onlyActiveTemplates: boolean) => {
    let q = supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq(scopeCol, orgId);
    if (table === "templates" && onlyActiveTemplates) q = q.is("deleted_at", null);
    return q;
  };

  const buildLengthFallback = (scopeCol: string, onlyActiveTemplates: boolean) => {
    let q = supabase
      .from(table)
      .select("id")
      .eq(scopeCol, orgId);
    if (table === "templates" && onlyActiveTemplates) q = q.is("deleted_at", null);
    return q;
  };

  for (const scopeCol of scopeCols) {
    const tryActiveFirst = table === "templates";
    const modes = tryActiveFirst ? [true, false] : [false];

    for (const onlyActiveTemplates of modes) {
      const headRes = await buildHeadCount(scopeCol, onlyActiveTemplates);

      if (!headRes.error) {
        if (typeof headRes.count === "number") return headRes.count;

        // Some PostgREST deployments return null count even when query succeeds.
        // Fallback to a non-HEAD select and compute length.
        const lenRes = await buildLengthFallback(scopeCol, onlyActiveTemplates);
        if (!lenRes.error) return Array.isArray(lenRes.data) ? lenRes.data.length : 0;

        if (!isMissingColumnOrRelation(lenRes.error?.message || "")) {
          warnings.push({ key, message: lenRes.error.message || `Failed counting ${table}` });
          return 0;
        }

        lastSchemaError = lenRes.error?.message || lastSchemaError;
        continue;
      }

      if (!isMissingColumnOrRelation(headRes.error?.message || "")) {
        warnings.push({ key, message: headRes.error.message || `Failed counting ${table}` });
        return 0;
      }

      lastSchemaError = headRes.error?.message || lastSchemaError;
    }
  }

  warnings.push({
    key,
    message: lastSchemaError || `Could not count ${table} (no compatible org scope columns found).`,
  });
  return 0;
}

async function safeFollowupsDue(supabase: any, warnings: Warning[], orgId: string) {
  // Follow-up schemas have drifted a lot across iterations.
  // We try multiple table/column/status patterns, and we also support schemas
  // where follow-ups do NOT have org_id but instead reference an onboarding
  // which has org_id.

  const nowIso = new Date().toISOString();
  let lastHardError: any = null;

  // Quick path: count queued follow-up jobs for this org regardless of due time.
  // This matches the Follow-ups page and fixes dashboard cards that should show
  // total queued follow-ups, not only overdue ones.
  const quickQueued = await supabase
    .from("followup_jobs")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .eq("status", "queued");

  if (!quickQueued.error) {
    return quickQueued.count ?? 0;
  }

  if (!isMissingColumnOrRelation(quickQueued.error?.message || "")) {
    lastHardError = quickQueued.error;
  }

  type Candidate = {
    table: string;
    // how to scope to org
    scope: "org_id" | "organization_id" | "onboarding_join";
    // possible due columns
    dueCols: string[];
    // possible status columns
    statusCols: string[];
    // statuses that imply a follow-up is still outstanding
    openStatuses: string[];
    // optional completed columns to exclude completed rows
    completedCols?: string[];
    // optional onboarding FK column name (used for join scoping)
    onboardingFk?: string;
  };

  // NOTE: the dashboard card label says “Follow-ups due”, but across versions
  // the UI has been used to show either (a) overdue follow-ups, or (b) total
  // scheduled/open follow-ups. We attempt overdue first, then fall back to
  // counting all follow-ups for the org if the schema doesn’t support due logic.

  const candidates: Candidate[] = [
    // Most common “job queue” style
    {
      table: "followup_jobs",
      scope: "org_id",
      dueCols: ["due_at", "run_at", "next_run_at", "scheduled_for", "send_at"],
      statusCols: ["status"],
      openStatuses: ["queued", "pending", "scheduled"],
      completedCols: ["completed_at", "processed_at"],
    },
    {
      table: "followup_jobs",
      scope: "organization_id",
      dueCols: ["due_at", "run_at", "next_run_at", "scheduled_for", "send_at"],
      statusCols: ["status"],
      openStatuses: ["queued", "pending", "scheduled"],
      completedCols: ["completed_at", "processed_at"],
    },

    // App table style
    {
      table: "followups",
      scope: "org_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
    {
      table: "followups",
      scope: "organization_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },

    // Cron namespace style
    {
      table: "cron_followups",
      scope: "org_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
    {
      table: "cron_followups",
      scope: "organization_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },

    // Underscore variants sometimes used
    {
      table: "follow_ups",
      scope: "org_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
    {
      table: "follow_ups",
      scope: "organization_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },

    // Join-scoped variants (no org_id on followups; it belongs to onboardings)
    {
      table: "followup_jobs",
      scope: "onboarding_join",
      onboardingFk: "onboarding_id",
      dueCols: ["due_at", "run_at", "next_run_at", "scheduled_for", "send_at"],
      statusCols: ["status"],
      openStatuses: ["queued", "pending", "scheduled"],
      completedCols: ["completed_at", "processed_at"],
    },
    {
      table: "followups",
      scope: "onboarding_join",
      onboardingFk: "onboarding_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
    {
      table: "cron_followups",
      scope: "onboarding_join",
      onboardingFk: "onboarding_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
    {
      table: "follow_ups",
      scope: "onboarding_join",
      onboardingFk: "onboarding_id",
      dueCols: ["due_at", "run_at", "next_run_at", "next_due_at", "scheduled_for", "send_at"],
      statusCols: ["status", "state"],
      openStatuses: ["queued", "pending", "scheduled", "open"],
      completedCols: ["completed_at", "done_at"],
    },
  ];

  // Helper: build a query for either org scoping or onboarding join scoping.
  // For join scoping, we try both relation names (`onboardings` and `onboarding`)
  // because PostgREST embedding names can vary depending on views/foreign keys.
  const buildBaseQueries = (c: Candidate): any[] => {
    if (c.scope === "org_id") {
      return [
        supabase
          .from(c.table)
          .select("id", { count: "exact", head: true })
          .eq("org_id", orgId),
      ];
    }

    if (c.scope === "organization_id") {
      return [
        supabase
          .from(c.table)
          .select("id", { count: "exact", head: true })
          .eq("organization_id", orgId),
      ];
    }

    // Join through onboardings using PostgREST embedded join.
    // NOTE: do NOT use `head: true` here; embedded joins frequently fail to return a count in HEAD mode.
    return [
      supabase
        .from(c.table)
        .select("id, onboardings!inner(org_id)", { count: "exact" })
        .eq("onboardings.org_id", orgId),
      supabase
        .from(c.table)
        .select("id, onboarding!inner(org_id)", { count: "exact" })
        .eq("onboarding.org_id", orgId),
    ];
  };

  // Try each candidate with increasing leniency.
  for (const c of candidates) {
    const baseQueries = buildBaseQueries(c);

    for (const base of baseQueries) {
      for (const dueCol of c.dueCols) {
        // Attempt set A: due + status + not-completed (try all statusCols and completedCols)
        {
          const statusColsToTry = c.statusCols.length ? c.statusCols : [null as any];
          const completedColsToTry = c.completedCols?.length ? c.completedCols : [null as any];

          for (const statusCol of statusColsToTry) {
            for (const completedCol of completedColsToTry) {
              let q: any = base;

              if (statusCol) {
                q = q.in(statusCol, c.openStatuses);
              }

              if (completedCol) {
                q = q.is(completedCol, null);
              }

              q = q.lte(dueCol, nowIso);

              const res = await q;
              if (!res.error) return res.count ?? 0;

              // Non-schema errors: record and keep trying other candidates.
              if (!isMissingColumnOrRelation(res.error.message || "")) {
                lastHardError = res.error;
                continue;
              }
            }
          }
        }

        // Attempt set B (lenient): count all follow‑ups for the org (no due/status filter)
        {
          const res2 = await base;
          if (!res2.error) return res2.count ?? 0;

          if (!isMissingColumnOrRelation(res2.error.message || "")) {
            lastHardError = res2.error;
            continue;
          }
        }
      }
    }
  }

  if (lastHardError) {
    warnings.push({
      key: "followups_due",
      message:
        lastHardError?.message ||
        JSON.stringify(lastHardError) ||
        "Failed computing follow-ups due",
    });
  } else {
    warnings.push({
      key: "followups_due",
      message:
        "Could not compute follow-ups due (no matching followups table/columns or missing onboarding join).",
    });
  }

  return 0;
}

async function safeFollowupsScheduled(supabase: any, warnings: Warning[], orgId: string) {
  // Counts scheduled/queued (open) follow-up jobs for the org, regardless of due time.
  // This is what the Follow-ups page shows as “Upcoming jobs”.

  let lastHardError: any = null;

  type Candidate = {
    table: string;
    scope: "org_id" | "organization_id" | "onboarding_join";
    statusCols: string[];
    openStatuses: string[];
  };

  const candidates: Candidate[] = [
    { table: "followup_jobs", scope: "org_id", statusCols: ["status"], openStatuses: ["queued", "pending", "scheduled"] },
    { table: "followup_jobs", scope: "organization_id", statusCols: ["status"], openStatuses: ["queued", "pending", "scheduled"] },

    { table: "followups", scope: "org_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
    { table: "followups", scope: "organization_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },

    { table: "cron_followups", scope: "org_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
    { table: "cron_followups", scope: "organization_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },

    { table: "follow_ups", scope: "org_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
    { table: "follow_ups", scope: "organization_id", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },

    // Join-scoped variants (no org_id on followups; it belongs to onboardings)
    { table: "followup_jobs", scope: "onboarding_join", statusCols: ["status"], openStatuses: ["queued", "pending", "scheduled"] },
    { table: "followups", scope: "onboarding_join", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
    { table: "cron_followups", scope: "onboarding_join", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
    { table: "follow_ups", scope: "onboarding_join", statusCols: ["status", "state"], openStatuses: ["queued", "pending", "scheduled", "open"] },
  ];

  const buildBaseQueries = (c: Candidate): any[] => {
    if (c.scope === "org_id") {
      return [
        supabase
          .from(c.table)
          .select("id", { count: "exact", head: true })
          .eq("org_id", orgId),
      ];
    }

    if (c.scope === "organization_id") {
      return [
        supabase
          .from(c.table)
          .select("id", { count: "exact", head: true })
          .eq("organization_id", orgId),
      ];
    }

    // Embedded join variants (avoid head:true for counts with embeds)
    return [
      supabase
        .from(c.table)
        .select("id, onboardings!inner(org_id)", { count: "exact" })
        .eq("onboardings.org_id", orgId),
      supabase
        .from(c.table)
        .select("id, onboarding!inner(org_id)", { count: "exact" })
        .eq("onboarding.org_id", orgId),
    ];
  };

  for (const c of candidates) {
    const baseQueries = buildBaseQueries(c);

    for (const base of baseQueries) {
      // Try with status filters first
      {
        for (const statusCol of c.statusCols) {
          const res = await base.in(statusCol, c.openStatuses);
          if (!res.error) return res.count ?? 0;

          if (!isMissingColumnOrRelation(res.error.message || "")) {
            lastHardError = res.error;
            continue;
          }
        }
      }

      // Lenient fallback: count all follow-ups for the org/table
      {
        const res2 = await base;
        if (!res2.error) return res2.count ?? 0;

        if (!isMissingColumnOrRelation(res2.error.message || "")) {
          lastHardError = res2.error;
          continue;
        }
      }
    }
  }

  if (lastHardError) {
    warnings.push({
      key: "followups_scheduled",
      message:
        lastHardError?.message ||
        JSON.stringify(lastHardError) ||
        "Failed computing follow-ups scheduled",
    });
  } else {
    warnings.push({
      key: "followups_scheduled",
      message:
        "Could not compute follow-ups scheduled (no matching followups table/columns or missing onboarding join).",
    });
  }

  return 0;
}

async function safeOrgMeta(supabase: any, warnings: Warning[], orgId: string) {
  const res = await supabase
    .from("organizations")
    .select("tier,seats_limit,stripe_subscription_status")
    .eq("id", orgId)
    .maybeSingle();

  if (res.error) {
    warnings.push({ key: "org", message: res.error.message || "Failed loading org meta" });
    return null;
  }

  return res.data ?? null;
}

async function safeMembersCount(supabase: any, warnings: Warning[], orgId: string) {
  const res = await supabase
    .from("memberships")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);

  if (res.error) {
    warnings.push({ key: "members", message: res.error.message || "Failed counting members" });
    return 0;
  }

  return res.count ?? 0;
}

async function safeOnboardings(
  supabase: any,
  warnings: Warning[],
  orgId: string
): Promise<{ total: number; byStatus: Record<string, number>; raw: Record<string, number> }> {
  // Schema drift support:
  // - org scoping can be `org_id` or `organization_id`
  // - status column can be `status` or `state`
  // We try the combinations in a safe order and fall back to 0s.

  const scopes: Array<{ col: string; label: string }> = [
    { col: "org_id", label: "org_id" },
    { col: "organization_id", label: "organization_id" },
    // seen in some versions
    { col: "workspace_id", label: "workspace_id" },
    { col: "team_id", label: "team_id" },
  ];

  const statusCols: string[] = [
    "status",
    "state",
    "onboarding_status",
    "lifecycle_status",
  ];

  let rows: Array<{ status: string | null }> = [];
  let total: number | null = null;
  let worked = false;

  for (const scope of scopes) {
    for (const statusCol of statusCols) {
      const res = await supabase
        .from("onboardings")
        .select(`id,${statusCol}`, { count: "exact" })
        .eq(scope.col, orgId);

      if (!res.error) {
        worked = true;
        // Normalize into a common shape
        rows = (res.data || []).map((r: any) => ({ status: r?.[statusCol] ?? null }));
        total = typeof res.count === "number" ? res.count : rows.length;
        break;
      }

      // If this is a real error (not missing column/relationship), surface it and stop.
      if (!isMissingColumnOrRelation(res.error.message || "")) {
        warnings.push({
          key: "onboardings",
          message:
            res.error.message ||
            `Failed loading onboardings using ${scope.label}.${statusCol}`,
        });
        return {
          total: 0,
          byStatus: { draft: 0, sent: 0, in_progress: 0, submitted: 0, locked: 0 },
          raw: {},
        };
      }
      // else: keep trying other combinations
    }

    if (worked) break;
  }

  if (!worked) {
    warnings.push({
      key: "onboardings",
      message:
        "Could not load onboardings (missing onboardings table or expected org/status columns).",
    });
    return {
      total: 0,
      byStatus: { draft: 0, sent: 0, in_progress: 0, submitted: 0, locked: 0 },
      raw: {},
    };
  }

  const normalizeStatus = (s: string | null) => {
    const v0 = String(s || "").trim();
    const v = v0.toLowerCase();
    if (!v) return "draft";

    // Common variants
    if (v === "in progress" || v === "inprogress" || v === "in-progress" || v === "in_progress") {
      return "in_progress";
    }

    // Sent variants
    if (v === "send" || v === "sent" || v === "emailed" || v === "delivered") return "sent";

    // Submitted variants
    if (v === "submit" || v === "submitted" || v === "complete" || v === "completed") return "submitted";

    // Locked variants
    if (v === "locked" || v === "final" || v === "finalized") return "locked";

    // Draft variants
    if (v === "draft" || v === "new" || v === "created") return "draft";

    // Preserve unknown statuses but normalize spacing
    return v.replace(/\s+/g, "_");
  };

  const raw = rows.reduce((acc: Record<string, number>, o) => {
    const s = normalizeStatus(o.status);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Map into the UI's expected buckets
  const draft = raw.draft || 0;
  const sent = raw.sent || 0;
  const in_progress = raw.in_progress || 0;
  const archived = raw.archived || 0;
  const deleted = raw.deleted || 0;
  const cancelled = raw.cancelled || 0;

  // Treat locked as submitted for the dashboard distribution (but also expose locked explicitly)
  const locked = raw.locked || 0;
  const submitted = (raw.submitted || 0) + locked;

  const byStatus: Record<string, number> = {
    // canonical
    draft,
    sent,
    in_progress,
    submitted,
    locked,

    // common JS/camel aliases
    inProgress: in_progress,
    inprogress: in_progress,

    // UI label-style keys some components use
    "Draft": draft,
    "Sent": sent,
    "In progress": in_progress,
    "In Progress": in_progress,
    "Submitted": submitted,
    "Locked": locked,

    // sometimes used in earlier dashboard widgets
    "in progress": in_progress,
    "in-progress": in_progress,
  };

  const computedTotal = total ?? rows.length;
  const activeTotal = Math.max(0, computedTotal - archived - deleted - cancelled);

  return { total: activeTotal, byStatus, raw };
}

async function safeRecentOnboardings(supabase: any, warnings: Warning[], orgId: string) {
  // Title column has drifted across iterations. Try a few options.
  const onboardingSelects = [
    "id,title,status,updated_at,client_id",
    "id,name,status,updated_at,client_id",
    "id,onboarding_title,status,updated_at,client_id",
  ];

  let onboardings: any[] = [];
  let usedTitleKey: "title" | "name" | "onboarding_title" | null = null;

  for (const sel of onboardingSelects) {
    let res: any = null;

    // Try both org scoping columns
    for (const scopeCol of ["org_id", "organization_id", "workspace_id", "team_id"]) {
      res = await supabase
        .from("onboardings")
        .select(sel)
        .eq(scopeCol, orgId)
        .order("updated_at", { ascending: false })
        .limit(5);

      if (!res.error) break;

      if (!isMissingColumnOrRelation(res.error.message || "")) {
        warnings.push({
          key: "recent_onboardings",
          message: res.error.message || "Failed loading recent onboardings",
        });
        return [];
      }
    }

    if (res && !res.error) {
      onboardings = (res?.data || []);
      if (sel.includes("title")) usedTitleKey = "title";
      else if (sel.includes("name")) usedTitleKey = "name";
      else usedTitleKey = "onboarding_title";
      break;
    }
  }

  // Hydrate recent onboardings with client info without assuming a specific client schema
  const clientIds = Array.from(
    new Set(onboardings.map((o) => o.client_id).filter(Boolean))
  ) as string[];

  let clientsById: Record<string, any> = {};
  if (clientIds.length) {
    const { data: clientsData, error: clientsErr } = await supabase
      .from("clients")
      .select("*")
      .in("id", clientIds);

    if (clientsErr) {
      warnings.push({ key: "recent_onboardings.clients", message: clientsErr.message || "Failed loading clients for recent onboardings" });
    } else {
      clientsById = (clientsData || []).reduce((acc: Record<string, any>, c: any) => {
        acc[String(c.id)] = c;
        return acc;
      }, {});
    }
  }

  return onboardings.map((o) => {
    const normalizedStatus = String(o.status ?? "").trim().toLowerCase();
    if (normalizedStatus === "archived" || normalizedStatus === "deleted") {
      return null;
    }

    const c = o.client_id ? clientsById[String(o.client_id)] : null;

    const clientName =
      c?.name ??
      c?.full_name ??
      c?.client_name ??
      c?.company_name ??
      c?.contact_name ??
      null;

    const clientEmail = c?.email ?? c?.client_email ?? null;

    // Ensure title always has something meaningful
    const title =
      (usedTitleKey ? o[usedTitleKey] : o.title ?? o.name ?? o.onboarding_title) ??
      o.subject ??
      o.id;

    return {
      id: o.id,
      title,
      // Title aliases for older UI code paths
      name: title,
      onboarding_title: title,
      status: o.status ?? null,
      updated_at: o.updated_at,
      client_id: o.client_id ?? null,
      // Client aliases for older UI code paths
      client_name: clientName ?? clientEmail ?? null,
      client_email: clientEmail ?? null,
      client: c
        ? {
            id: c.id,
            name: clientName ?? clientEmail ?? "Client",
            email: clientEmail,
          }
        : null,
    };
  }).filter(Boolean);
}

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const warnings: Warning[] = [];
    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member"]);

    if (!roleHasPermission(role, "dashboard_view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      clients,
      templates,
      onboardingsAgg,
      followups_due,
      followups_scheduled,
      org,
      members,
      recent_onboardings,
    ] = await Promise.all([
      safeCount(supabase, warnings, "clients", "clients", profile.org_id),
      safeCount(supabase, warnings, "templates", "templates", profile.org_id),
      safeOnboardings(supabase, warnings, profile.org_id),
      safeFollowupsDue(supabase, warnings, profile.org_id),
      safeFollowupsScheduled(supabase, warnings, profile.org_id),
      safeOrgMeta(supabase, warnings, profile.org_id),
      safeMembersCount(supabase, warnings, profile.org_id),
      safeRecentOnboardings(supabase, warnings, profile.org_id),
    ]);

    return NextResponse.json({
      clients,
      templates,
      onboardings_total: onboardingsAgg.total,
      onboardings_count: onboardingsAgg.total,
      onboardings_by_status: onboardingsAgg.byStatus,
      // Aliases for different dashboard implementations
      onboarding_status: onboardingsAgg.byStatus,
      onboardingStatus: onboardingsAgg.byStatus,
      onboardingStatusCounts: onboardingsAgg.byStatus,
      onboardings_by_status_raw: onboardingsAgg.raw,
      followups_due,
      followups_due_count: followups_due,
      followupsDueCount: followups_due,

      followups_scheduled,
      followups_scheduled_count: followups_scheduled,
      followupsScheduledCount: followups_scheduled,

      // Aliases for UI components that may expect different key names
      onboardings: onboardingsAgg.total,
      followups: followups_due,
      followupsDue: followups_due,
      followupsDueTotal: followups_due,
      followupsScheduled: followups_scheduled,
      followupsTotalScheduled: followups_scheduled,
      members,
      recent_onboardings,
      org,
      warnings,
    });
  } catch (e: any) {
    const message = e?.message ? String(e.message) : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
