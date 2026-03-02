import * as React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ClientPortal } from "@/components/client/ClientPortal";

function StatusPill({ status, locked }: { status?: string | null; locked: boolean }) {
  const s = (status || "draft").toLowerCase();
  const label = locked ? "Locked" : s === "submitted" ? "Submitted" : "In progress";

  const cls = locked
    ? "border-zinc-200 bg-zinc-50 text-zinc-900"
    : s === "submitted"
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-zinc-200 bg-white text-zinc-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">{children}</div>;
}

function Hint({ title, message }: { title: string; message: string }) {
  return (
    <Shell>
      <div className="mx-auto max-w-xl">
        <Panel>
          <div className="p-8">
            <div className="text-lg font-semibold tracking-tight text-zinc-900">{title}</div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">{message}</div>
          </div>
        </Panel>
        <div className="mt-6 text-center text-xs text-zinc-500">
          If you believe this is a mistake, contact the sender for a new link.
        </div>
      </div>
    </Shell>
  );
}

export default async function ClientTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const admin = supabaseAdmin();


  const isMissingColumn = (e: any) => {
    const m = String(e?.message || "").toLowerCase();
    // Supabase/PostgREST can report missing columns and missing tables with similar "schema cache" wording.
    if (m.includes("schema cache") && (m.includes("could not find the table") || m.includes("column"))) return true;
    return m.includes("does not exist") && (m.includes("column") || m.includes("schema cache"));
  };

  const isMissingRelation = (e: any) => {
    const m = String(e?.message || "").toLowerCase();
    // Missing table errors commonly look like: "Could not find the table 'public.foo' in the schema cache".
    if (m.includes("could not find the table") && m.includes("schema cache")) return true;
    return m.includes("relation") && m.includes("does not exist");
  };

  // Normalize Supabase responses while ensuring we only ever await real Promises.
  type OneResult<T> = { data: T | null; error: any | null };
  const runOne = async <T,>(op: any): Promise<OneResult<T>> => {
    try {
      const r = await op;
      return { data: (r as any)?.data ?? null, error: (r as any)?.error ?? null };
    } catch (e: any) {
      return { data: null, error: e };
    }
  };

  const tryOnboarding = async (): Promise<OneResult<any>> => {
    const attempts: Array<() => Promise<OneResult<any>>> = [
      // Minimal + most common
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id,client_token")
            .eq("client_token", token)
            .maybeSingle()
        ),
      // Alternate token column
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id")
            .eq("clientToken", token as any)
            .maybeSingle()
        ),
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id")
            .eq("token", token as any)
            .maybeSingle()
        ),
      // Try with templateId/template fields if they exist
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id,templateId,template")
            .eq("client_token", token)
            .maybeSingle()
        ),
      // Last resort: select all columns (helps when the schema differs a lot)
      () => runOne(admin.from("onboardings").select("*").eq("client_token", token).maybeSingle()),
      () => runOne(admin.from("onboardings").select("*").eq("clientToken", token as any).maybeSingle()),
      () => runOne(admin.from("onboardings").select("*").eq("token", token as any).maybeSingle()),
    ];

    for (const attempt of attempts) {
      const r = await attempt();
      if (r.error && (isMissingColumn(r.error) || isMissingRelation(r.error))) {
        continue;
      }
      return r;
    }

    // If we only hit missing column/relation errors, surface a helpful message.
    return {
      data: null,
      error: new Error(
        "Onboarding schema mismatch: could not find a usable token column (client_token/clientToken/token)."
      ),
    };
  };

  const { data: onboarding, error: onboardingErr } = await tryOnboarding();

  if (onboardingErr) {
    // If the token exists but our select broke due to schema mismatch, show the real error.
    // Otherwise, keep the generic invalid link message.
    const msg = String(onboardingErr?.message || "");
    const looksSchema = isMissingColumn(onboardingErr) || isMissingRelation(onboardingErr) || msg.toLowerCase().includes("schema mismatch");
    return (
      <Hint
        title={looksSchema ? "Something went wrong" : "Invalid link"}
        message={looksSchema ? msg : "This onboarding link is not valid."}
      />
    );
  }

  if (!onboarding) {
    return <Hint title="Invalid link" message="This onboarding link is not valid." />;
  }

  // Requirements: prefer onboarding-scoped requirements, but fall back to template-scoped
  // and alternate table/column names when schemas differ.
  let reqRows: any[] | null = null;
  let reqErr: any = null;

  // Some deployments store the template FK under different names.
  const templateKey =
    (onboarding as any).template_id ??
    (onboarding as any).templateId ??
    (onboarding as any).template ??
    null;

  type TryResult = { data: any[] | null; error: any | null };

  const trySelect = async (
    table: string,
    where: { col: string; val: any },
    select: string = "*"
  ): Promise<TryResult> => {
    try {
      const r = await admin.from(table).select(select).eq(where.col as any, where.val);
      return { data: (r as any).data ?? null, error: (r as any).error ?? null };
    } catch (e: any) {
      // For unexpected thrown errors, normalize into the same shape.
      return { data: null, error: e };
    }
  };

  const tryMany = async (attempts: Array<() => Promise<TryResult>>) => {
    for (const fn of attempts) {
      const r = await fn();
      // If the table/column doesn't exist, continue to next attempt.
      if (r.error && (isMissingColumn(r.error) || isMissingRelation(r.error))) {
        continue;
      }
      // If we have a non-missing error, stop and surface it.
      if (r.error) {
        reqErr = r.error;
        reqRows = null;
        return;
      }
      // Success: keep the rows (even if empty) and stop.
      reqRows = Array.isArray(r.data) ? r.data : [];
      reqErr = null;
      return;
    }
    // If we exhausted attempts with only missing table/column issues,
    // treat it as no requirements rather than hard failing.
    reqRows = [];
    reqErr = null;
  };

  // Attempt order:
  // 1) onboarding-scoped requirements (these are usually the actual rows you answer against)
  // 2) template-scoped requirements tables (if present)
  // 3) templates table JSON (common: templates.requirements / templates.fields / templates.schema)
  await tryMany([
    // requirements table (most common in this codebase: answer route returns { requirement: { id, value_text, completed_at } })
    () => trySelect("requirements", { col: "onboarding_id", val: onboarding.id }),
    () => trySelect("requirements", { col: "onboardingId", val: onboarding.id }),
    () => trySelect("requirements", { col: "onboarding", val: onboarding.id }),

    // onboarding_requirements table (some schemas use this name for the per-onboarding rows)
    () => trySelect("onboarding_requirements", { col: "onboarding_id", val: onboarding.id }),
    () => trySelect("onboarding_requirements", { col: "onboardingId", val: onboarding.id }),
    () => trySelect("onboarding_requirements", { col: "onboarding", val: onboarding.id }),

    // template_requirements table (if it exists)
    () =>
      templateKey
        ? trySelect("template_requirements", { col: "template_id", val: templateKey })
        : Promise.resolve({ data: null, error: null }),
    () =>
      templateKey
        ? trySelect("template_requirements", { col: "templateId", val: templateKey })
        : Promise.resolve({ data: null, error: null }),

    // onboarding_requirements by template (some schemas don’t store onboarding FK)
    () =>
      templateKey
        ? trySelect("onboarding_requirements", { col: "template_id", val: templateKey })
        : Promise.resolve({ data: null, error: null }),
    () =>
      templateKey
        ? trySelect("onboarding_requirements", { col: "templateId", val: templateKey })
        : Promise.resolve({ data: null, error: null }),

    // generic requirements by template
    () =>
      templateKey
        ? trySelect("requirements", { col: "template_id", val: templateKey })
        : Promise.resolve({ data: null, error: null }),
    () =>
      templateKey
        ? trySelect("requirements", { col: "templateId", val: templateKey })
        : Promise.resolve({ data: null, error: null }),
  ]);

  // If we did not find per-onboarding requirement rows, fall back to requirements stored on the template row.
  // Many schemas store form definitions as JSON on templates (and materialize requirement rows later).
  // This keeps the client portal from looking empty when the template does have fields.
  if (!reqErr && Array.isArray(reqRows) && reqRows.length === 0 && templateKey) {
    try {
      const t = await admin
        .from("templates")
        .select("id,name,definition,requirements,fields,schema,config")
        .eq("id", templateKey)
        .single();

      const tErr = (t as any).error ?? null;
      const tRow = (t as any).data ?? null;

      if (!tErr && tRow) {
        const fromDirect = Array.isArray(tRow.requirements) ? tRow.requirements : null;
        const fromFields = Array.isArray(tRow.fields) ? tRow.fields : null;
        const fromSchema = Array.isArray(tRow.schema) ? tRow.schema : null;
        // Many schemas store the form definition under templates.definition (jsonb)
        const def = tRow.definition ?? null;
        const fromDefinition =
          def && typeof def === "object"
            ? Array.isArray((def as any).requirements)
              ? (def as any).requirements
              : Array.isArray((def as any).fields)
                ? (def as any).fields
                : Array.isArray((def as any).schema)
                  ? (def as any).schema
                  : Array.isArray((def as any).steps)
                    ? (def as any).steps
                    : null
            : null;
        const fromConfig =
          tRow.config &&
          (Array.isArray((tRow.config as any).requirements)
            ? (tRow.config as any).requirements
            : Array.isArray((tRow.config as any).fields)
              ? (tRow.config as any).fields
              : Array.isArray((tRow.config as any).schema)
                ? (tRow.config as any).schema
                : null);

        const candidate = fromDirect ?? fromFields ?? fromSchema ?? fromDefinition ?? fromConfig;
        if (Array.isArray(candidate)) {
          reqRows = candidate;
        }
      }
      // If templates table/columns don't exist, just ignore (same behavior as missing table/column).
    } catch {
      // ignore
    }
  }

  if (reqErr) {
    return <Hint title="Something went wrong" message={reqErr.message} />;
  }

  const safeReqRows = Array.isArray(reqRows) ? reqRows : [];

  // Normalize many possible shapes into the ClientPortal requirement shape.
  const normalizedReqs = safeReqRows.map((r: any, idx: number) => {
    const type = r.type ?? r.requirement_type ?? r.kind ?? r.field_type ?? r.input_type ?? "text";
    const label = r.label ?? r.name ?? r.title ?? r.prompt ?? "";
    const is_required = Boolean(r.is_required ?? r.required ?? r.isRequired ?? r.mandatory ?? false);
    const sort_order = Number(r.sort_order ?? r.position ?? r.sort ?? r.order ?? idx);

    // IMPORTANT: prefer a real DB id if present. If the template JSON uses a stable key, use it.
    // (ClientPortal answer/save endpoints typically expect requirement_id.)
    const id =
      r.id ??
      r.requirement_id ??
      r.requirementId ??
      r.key ??
      r.slug ??
      r.field_id ??
      r.fieldId ??
      null;

    return {
      id,
      type,
      label,
      is_required,
      sort_order,
      completed_at: r.completed_at ?? r.completedAt ?? null,
      value_text: r.value_text ?? r.value ?? r.answer_text ?? r.text ?? r.default ?? null,
      file_path: r.file_path ?? r.fileKey ?? r.storage_path ?? r.file_url ?? null,
      signature_path: r.signature_path ?? r.signatureKey ?? r.signature_storage_path ?? null,
    };
  });

  // Filter out any template-only rows that don't have an id; ClientPortal save endpoints require it.
  const normalizedReqsWithIds = normalizedReqs.filter((r: any) => typeof r.id === "string" && r.id.length > 0);

  const templatePreview = normalizedReqs
    .filter((r: any) => !r.id)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  normalizedReqsWithIds.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const locked = Boolean(onboarding.locked_at) || onboarding.status === "locked";

  return (
    <Shell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Client portal</div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                {onboarding.title || "Onboarding"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StatusPill status={onboarding.status} locked={locked} />
                <div className="text-sm text-zinc-600">Progress updates live below.</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 shadow-sm">
                Secure link • Do not share
              </div>
            </div>
          </div>

          {normalizedReqsWithIds.length === 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm">
              <div className="font-medium text-zinc-900">No questions have been added yet.</div>
              <div className="mt-1 text-zinc-600">Ask the sender to configure onboarding requirements.</div>

              {templatePreview.length > 0 && (
                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Template preview</div>
                  <div className="mt-2 text-xs text-zinc-600">
                    These questions exist in the template, but they haven’t been added to this onboarding yet.
                  </div>
                  <ul className="mt-3 space-y-2">
                    {templatePreview.slice(0, 12).map((r: any, i: number) => (
                      <li key={i} className="flex items-start justify-between gap-4 rounded-md bg-white px-3 py-2">
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{r.label || "Untitled question"}</div>
                          <div className="mt-0.5 text-xs text-zinc-600">Type: {String(r.type || "text")}</div>
                        </div>
                        <div className="text-xs text-zinc-600">{r.is_required ? "Required" : "Optional"}</div>
                      </li>
                    ))}
                  </ul>
                  {templatePreview.length > 12 && (
                    <div className="mt-2 text-xs text-zinc-500">…and {templatePreview.length - 12} more</div>
                  )}
                </div>
              )}
            </div>
          )}
          <ClientPortal
            token={token}
            onboardingTitle={onboarding.title}
            locked={locked}
            requirements={normalizedReqsWithIds as any}
          />

          <div className="border-t border-zinc-200 pt-6 text-xs text-zinc-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>Powered by ClientEnforce</div>
              <div className="tabular-nums">Token: {token.slice(0, 8)}…</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}