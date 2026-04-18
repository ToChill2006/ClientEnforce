import * as React from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ClientPortal } from "@/components/client/ClientPortal";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

function StatusPill({ status, locked }: { status?: string | null; locked: boolean }) {
  const s = (status || "draft").toLowerCase();
  const label = locked ? "Locked" : s === "submitted" ? "Submitted" : "In progress";

  const cls = locked
    ? "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]"
    : s === "submitted"
      ? "border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] text-[var(--color-success)]"
      : "border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function Shell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)]" style={style}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">{children}</div>;
}

function Hint({ title, message }: { title: string; message: string }) {
  return (
    <Shell>
      <div className="mx-auto max-w-xl">
        <Panel>
          <div className="p-8">
            <div className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</div>
            <div className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{message}</div>
          </div>
        </Panel>
        <div className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
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
            .select("id,title,status,locked_at,template_id,client_token,org_id")
            .eq("client_token", token)
            .maybeSingle()
        ),
      // Alternate token column
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id,org_id")
            .eq("clientToken", token as any)
            .maybeSingle()
        ),
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id,org_id")
            .eq("token", token as any)
            .maybeSingle()
        ),
      // Try with templateId/template fields if they exist
      () =>
        runOne(
          admin
            .from("onboardings")
            .select("id,title,status,locked_at,template_id,templateId,template,org_id")
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

  // Some deployments store the template FK under different names.
  const templateKey =
    (onboarding as any).template_id ??
    (onboarding as any).templateId ??
    (onboarding as any).template ??
    null;

  type TryResult = { data: any[] | null; error: any | null };
  type TryManyResult = { rows: any[] | null; err: any };

  const trySelect = async (
    table: string,
    where: { col: string; val: any },
    select: string = "*"
  ): Promise<TryResult> => {
    try {
      const r = await (admin as any).from(table).select(select).eq(where.col, where.val);
      return { data: (r as any).data ?? null, error: (r as any).error ?? null };
    } catch (e: any) {
      // For unexpected thrown errors, normalize into the same shape.
      return { data: null, error: e };
    }
  };

  const tryMany = async (attempts: Array<() => Promise<TryResult>>): Promise<TryManyResult> => {
    for (const fn of attempts) {
      const r = await fn();
      // If the table/column doesn't exist, continue to next attempt.
      if (r.error && (isMissingColumn(r.error) || isMissingRelation(r.error))) {
        continue;
      }
      // If we have a non-missing error, stop and surface it.
      if (r.error) {
        return { rows: null, err: r.error };
      }
      // Success: keep the rows (even if empty) and stop.
      return { rows: Array.isArray(r.data) ? r.data : [], err: null };
    }
    // If we exhausted attempts with only missing table/column issues,
    // treat it as no requirements rather than hard failing.
    return { rows: [], err: null };
  };

  // Attempt order:
  // 1) onboarding-scoped requirements (these are usually the actual rows you answer against)
  // 2) template-scoped requirements tables (if present)
  // 3) templates table JSON (common: templates.requirements / templates.fields / templates.schema)
  const { rows: reqRowsInit, err: reqErr } = await tryMany([
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

    // onboarding_requirements by template (some schemas don't store onboarding FK)
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
  let reqRows: any[] | null = reqRowsInit;
  const reqRowsArr = Array.isArray(reqRows) ? reqRows : [];
  if (!reqErr && reqRowsArr.length === 0 && templateKey) {
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
      // Feature 4: multi-file paths array (JSONB column)
      file_paths: Array.isArray(r.file_paths) ? r.file_paths : null,
      signature_path: r.signature_path ?? r.signatureKey ?? r.signature_storage_path ?? null,
      attachment_path: r.attachment_path ?? null,
      options: Array.isArray(r.options) ? r.options : null,
      // Features 1–3, 5: per-type config snapshotted from template (file_mode, link_url,
      // allow_multi_select, include_other, multiline)
      metadata: r.metadata && typeof r.metadata === "object" ? r.metadata : null,
    };
  });

  // Filter out any template-only rows that don't have an id; ClientPortal save endpoints require it.
  const normalizedReqsWithIds = normalizedReqs.filter((r: any) => typeof r.id === "string" && r.id.length > 0);

  const templatePreview = normalizedReqs
    .filter((r: any) => !r.id)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  normalizedReqsWithIds.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const locked = Boolean(onboarding.locked_at) || onboarding.status === "locked";

  const orgId = (onboarding as any).org_id ?? (onboarding as any).orgId ?? null;
  const whiteLabel = orgId ? await loadWhiteLabelForOrg(String(orgId)) : null;
  const brandName = whiteLabel?.brand_name?.trim() || "ClientEnforce";
  const portalTagline = whiteLabel?.portal_tagline?.trim() || "Client portal";
  const logoUrl = whiteLabel?.logo_url?.trim() || null;
  const accentColor = whiteLabel?.accent_color?.trim() || null;
  const supportEmail = whiteLabel?.support_email?.trim() || null;
  const removeBranding = Boolean(whiteLabel?.remove_branding);

  const shellStyle: React.CSSProperties | undefined = accentColor
    ? ({
        ["--color-accent" as any]: accentColor,
      } as React.CSSProperties)
    : undefined;

  return (
    <Shell style={shellStyle}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt={brandName}
                      className="h-9 w-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white object-contain"
                    />
                  ) : null}
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {portalTagline}
                  </div>
                </div>
                <h1
                  className="mt-3 truncate text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-[28px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {onboarding.title || "Onboarding"}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusPill status={onboarding.status} locked={locked} />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    Secure link
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {normalizedReqsWithIds.length === 0 && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)]">
                <div className="font-medium text-[var(--color-text-primary)]">No questions have been added yet.</div>
                <div className="mt-1 text-[var(--color-text-secondary)]">Ask the sender to configure onboarding requirements.</div>

                {templatePreview.length > 0 && (
                  <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Template preview</div>
                    <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      These questions exist in the template, but they haven&apos;t been added to this onboarding yet.
                    </div>
                    <ul className="mt-3 space-y-2">
                      {templatePreview.slice(0, 12).map((r: any, i: number) => (
                        <li key={i} className="flex items-start justify-between gap-4 rounded-md bg-white px-3 py-2">
                          <div>
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">{r.label || "Untitled question"}</div>
                            <div className="mt-0.5 text-xs text-[var(--color-text-secondary)]">Type: {String(r.type || "text")}</div>
                          </div>
                          <div className="text-xs text-[var(--color-text-secondary)]">{r.is_required ? "Required" : "Optional"}</div>
                        </li>
                      ))}
                    </ul>
                    {templatePreview.length > 12 && (
                      <div className="mt-2 text-xs text-[var(--color-text-muted)]">…and {templatePreview.length - 12} more</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-8">
            <ClientPortal
              token={token}
              onboardingTitle={onboarding.title}
              locked={locked}
              requirements={normalizedReqsWithIds as any}
            />
          </div>

          <div className="mt-10 border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-text-muted)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {removeBranding ? (
                  supportEmail ? (
                    <>Need help? <a href={`mailto:${supportEmail}`} className="underline">{supportEmail}</a></>
                  ) : (
                    brandName
                  )
                ) : (
                  <>
                    Powered by {brandName}
                    {supportEmail && (
                      <>
                        {" · "}
                        <a href={`mailto:${supportEmail}`} className="underline">{supportEmail}</a>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="tabular-nums">Token: {token.slice(0, 8)}…</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
