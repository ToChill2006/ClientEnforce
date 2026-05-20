import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";
import { logAudit } from "@/lib/audit";

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function isMissingColumnError(err: unknown, column: string) {
  const msg = String((err as { message?: string } | undefined)?.message || err || "");
  const lower = msg.toLowerCase();
  const col = column.toLowerCase();
  return (
    (lower.includes("does not exist") && lower.includes(col)) ||
    (lower.includes("schema cache") && lower.includes(col)) ||
    lower.includes(`could not find the '${col}' column`)
  );
}

async function getOrgIdForUser(supabase: Awaited<ReturnType<typeof supabaseServer>>) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { user: null, org_id: null as string | null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (error || !profile?.org_id) return { user, org_id: null as string | null };
  return { user, org_id: profile.org_id as string };
}

const PatchSchema = z.union([
  z.object({ status: z.enum(["archived"]) }),
  z.object({
    reminder_override: z
      .object({
        enabled: z.boolean(),
        days_between: z.number().int().min(1).max(90).optional(),
        max_reminders: z.number().int().min(0).max(20).optional(),
      })
      .nullable(),
  }),
  z.object({ owner_id: z.string().uuid().nullable() }),
  z.object({ client_type_id: z.string().uuid().nullable() }),
  z.object({ deadline: z.string().nullable() }),
  z.object({ template_id: z.string().uuid() }),
]);

type ResponseError = { message?: string | null };
type PatchItem = { id: string; status?: string | null; updated_at?: string | null };
type MaybeSingleResult<T> = { data: T | null; error: ResponseError | null };

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_delete")) {
    return jsonError(403, permissionDenied("You do not have access to archive onboardings."));
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload");

  const now = new Date().toISOString();

  // Branch: reminder_override update — store in `metadata.reminders` JSONB if present.
  if ("reminder_override" in parsed.data) {
    const override = parsed.data.reminder_override;
    // Read existing metadata, patch `reminders`, write back.
    const { data: existing, error: readErr } = (await supabase
      .from("onboardings")
      .select("id, metadata")
      .eq("org_id", org_id)
      .eq("id", id)
      .maybeSingle()) as { data: { id: string; metadata: any } | null; error: ResponseError | null };
    if (readErr && !isMissingColumnError(readErr, "metadata")) {
      return jsonError(400, readErr.message || "Failed to load onboarding");
    }
    if (!existing) return jsonError(404, "Onboarding not found");
    const currentMeta = (existing.metadata && typeof existing.metadata === "object") ? existing.metadata : {};
    const nextMeta = { ...currentMeta, reminders: override };
    let upd = await supabase
      .from("onboardings")
      .update({ metadata: nextMeta, updated_at: now })
      .eq("org_id", org_id)
      .eq("id", id)
      .select("id, metadata, updated_at")
      .maybeSingle();
    if (upd.error && isMissingColumnError(upd.error, "metadata")) {
      return jsonError(400, "metadata column is not available on this database");
    }
    if (upd.error && isMissingColumnError(upd.error, "updated_at")) {
      upd = await supabase
        .from("onboardings")
        .update({ metadata: nextMeta })
        .eq("org_id", org_id)
        .eq("id", id)
        .select("id, metadata")
        .maybeSingle();
    }
    if (upd.error) return jsonError(400, upd.error.message || "Failed to save reminders override");
    logAudit({
      org_id,
      actor_user_id: user.id,
      action: "onboarding.updated",
      entity_type: "onboarding",
      entity_id: id,
      onboarding_id: id,
      metadata: { field: "reminder_override" },
    });
    return NextResponse.json({ ok: true, item: upd.data });
  }

  if ("owner_id" in parsed.data) {
    const { error } = await supabase
      .from("onboardings")
      .update({ owner_id: parsed.data.owner_id, updated_at: now })
      .eq("org_id", org_id)
      .eq("id", id);
    if (error) return jsonError(400, error.message || "Failed to update owner");
    logAudit({
      org_id,
      actor_user_id: user.id,
      action: "onboarding.updated",
      entity_type: "onboarding",
      entity_id: id,
      onboarding_id: id,
      metadata: { field: "owner_id", owner_id: parsed.data.owner_id },
    });
    return NextResponse.json({ ok: true });
  }

  if ("client_type_id" in parsed.data) {
    const { error } = await supabase
      .from("onboardings")
      .update({ client_type_id: parsed.data.client_type_id, updated_at: now })
      .eq("org_id", org_id)
      .eq("id", id);
    if (error) return jsonError(400, error.message || "Failed to update client type");
    logAudit({
      org_id,
      actor_user_id: user.id,
      action: "onboarding.updated",
      entity_type: "onboarding",
      entity_id: id,
      onboarding_id: id,
      metadata: { field: "client_type_id", client_type_id: parsed.data.client_type_id },
    });
    return NextResponse.json({ ok: true });
  }

  if ("deadline" in parsed.data) {
    const { error } = await supabaseAdmin()
      .from("onboardings")
      .update({ deadline: parsed.data.deadline, updated_at: now })
      .eq("org_id", org_id)
      .eq("id", id);
    if (error) return jsonError(400, error.message || "Failed to update deadline");
    logAudit({
      org_id,
      actor_user_id: user.id,
      action: "onboarding.updated",
      entity_type: "onboarding",
      entity_id: id,
      onboarding_id: id,
      metadata: { field: "deadline", deadline: parsed.data.deadline },
    });
    return NextResponse.json({ ok: true });
  }

  if ("template_id" in parsed.data) {
    const admin = supabaseAdmin();
    const templateId = parsed.data.template_id;

    // Verify template belongs to the org
    const { data: tpl, error: tplErr } = await admin
      .from("templates")
      .select("id, name, definition")
      .eq("id", templateId)
      .eq("org_id", org_id)
      .single();
    if (tplErr || !tpl) return jsonError(404, "Template not found");

    // Update the onboarding's template_id
    const { error: updErr } = await admin
      .from("onboardings")
      .update({ template_id: templateId, updated_at: now })
      .eq("org_id", org_id)
      .eq("id", id);
    if (updErr) return jsonError(400, updErr.message || "Failed to update template");

    // Delete any existing requirements + phases so we start fresh from the template
    await admin.from("onboarding_requirements").delete().eq("onboarding_id", id);
    await admin.from("onboarding_phases").delete().eq("onboarding_id", id);

    // Insert requirements from template definition
    const def = (tpl as any).definition as any;
    const reqs: any[] = def?.requirements ?? def?.fields ?? [];
    if (reqs.length > 0) {
      const reqRows = reqs.map((it: any, idx: number) => {
        const reqType = it.type ?? "text";
        const row: Record<string, any> = {
          org_id,
          onboarding_id: id,
          type: reqType,
          label: it.label ?? `Field ${idx + 1}`,
          is_required: (reqType === "heading" || reqType === "info") ? false : Boolean(it.is_required ?? false),
          sort_order: Number(it.sort_order ?? idx),
          phase_number: typeof it.phase_number === "number" ? it.phase_number : null,
          options: it.options ?? null,
          created_at: now,
          updated_at: now,
        };
        if (reqType === "payment") {
          row.payment_amount = it.payment_amount != null ? Number(it.payment_amount) : null;
          row.payment_currency = it.payment_currency ?? null;
          row.payment_description = it.payment_description ?? null;
          row.payment_status = "not_paid";
        }
        if (reqType === "info") row.value_text = it.info_content ?? null;
        if (reqType === "multiple_choice") {
          const meta: Record<string, unknown> = {};
          if (it.allow_multi_select) meta.allow_multi_select = true;
          if (it.include_other) meta.include_other = true;
          if (Object.keys(meta).length > 0) row.metadata = meta;
        }
        return row;
      });
      await admin.from("onboarding_requirements").insert(reqRows);
    }

    // Resolve event deadline for phase deadline calculation
    const { data: obRow } = await admin
      .from("onboardings")
      .select("event_id, deadline")
      .eq("id", id)
      .single();
    let eventBase: string | null = (obRow as any)?.deadline ?? null;
    if (!eventBase && (obRow as any)?.event_id) {
      const { data: evRow } = await admin
        .from("events")
        .select("submission_deadline, end_date")
        .eq("id", (obRow as any).event_id)
        .single();
      eventBase = (evRow as any)?.submission_deadline ?? (evRow as any)?.end_date ?? null;
    }

    // Insert phases from template definition
    const phaseDefs: any[] = def?.phases ?? [];
    if (phaseDefs.length > 0) {
      const phaseRows = phaseDefs.map((p: any, idx: number) => {
        let deadline: string | null = null;
        if (p.deadline) {
          deadline = p.deadline;
        } else if (eventBase && typeof p.default_deadline_offset_days === "number") {
          const d = new Date(eventBase);
          d.setDate(d.getDate() + p.default_deadline_offset_days);
          deadline = d.toISOString().split("T")[0];
        } else if (eventBase) {
          deadline = eventBase.split("T")[0];
        }
        return {
          org_id,
          onboarding_id: id,
          phase_number: p.number ?? idx + 1,
          name: p.name ?? `Phase ${p.number ?? idx + 1}`,
          deadline,
          status: idx === 0 ? "in_progress" : "locked",
          created_at: now,
          updated_at: now,
        };
      });
      await admin.from("onboarding_phases").insert(phaseRows);
    } else {
      await admin.from("onboarding_phases").insert({
        org_id,
        onboarding_id: id,
        phase_number: 1,
        name: "Onboarding",
        deadline: eventBase ? eventBase.split("T")[0] : null,
        status: "in_progress",
        created_at: now,
        updated_at: now,
      });
    }

    logAudit({
      org_id,
      actor_user_id: user.id,
      action: "onboarding.updated",
      entity_type: "onboarding",
      entity_id: id,
      onboarding_id: id,
      metadata: { field: "template_id", template_id: templateId, template_name: (tpl as any).name },
    });
    return NextResponse.json({ ok: true });
  }

  let update = (await supabase
    .from("onboardings")
    .update({ status: parsed.data.status, updated_at: now })
    .eq("org_id", org_id)
    .eq("id", id)
    .select("id, status, updated_at")
    .maybeSingle()) as MaybeSingleResult<PatchItem>;

  if (update.error && isMissingColumnError(update.error, "updated_at")) {
    update = (await supabase
      .from("onboardings")
      .update({ status: parsed.data.status })
      .eq("org_id", org_id)
      .eq("id", id)
      .select("id, status")
      .maybeSingle()) as MaybeSingleResult<PatchItem>;
  }

  const item = update.data ?? null;
  const error = update.error ?? null;
  if (error) return jsonError(400, error.message || "Failed to archive onboarding");
  if (!item) return jsonError(404, "Onboarding not found");

  logAudit({
    org_id,
    actor_user_id: user.id,
    action: "onboarding.updated",
    entity_type: "onboarding",
    entity_id: id,
    onboarding_id: id,
    metadata: { field: "status", status: parsed.data.status },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_delete")) {
    return jsonError(403, permissionDenied("You do not have access to delete onboardings."));
  }

  const deleted = (await supabase
    .from("onboardings")
    .delete()
    .eq("org_id", org_id)
    .eq("id", id)
    .select("id")
    .maybeSingle()) as MaybeSingleResult<{ id: string }>;

  const item = deleted.data ?? null;
  const error = deleted.error ?? null;
  if (error) return jsonError(400, error.message || "Failed to delete onboarding");
  if (!item) return jsonError(404, "Onboarding not found");

  // Purge storage files for this onboarding from both buckets
  try {
    const { supabaseAdmin } = await import("@/lib/supabase-admin");
    const admin = supabaseAdmin();
    const orgRaw = org_id.startsWith("org_") ? org_id.slice(4) : org_id;

    const deletePrefix = async (bucket: string, prefix: string) => {
      const { data } = await admin.storage.from(bucket).list(prefix, { limit: 500 });
      const paths = (data ?? []).filter((f: any) => f.name).map((f: any) => `${prefix}/${f.name}`);
      if (paths.length > 0) await admin.storage.from(bucket).remove(paths);
    };

    const uploadPrefix = `org_${orgRaw}/onboarding_${id}`;
    const sigPrefixNew = `org_${orgRaw}/${id}`;
    const sigPrefixLegacy = `${orgRaw}/${id}`;

    await Promise.allSettled([
      deletePrefix("clientenforce-uploads", uploadPrefix),
      deletePrefix("clientenforce-signatures", sigPrefixNew),
      deletePrefix("clientenforce-signatures", sigPrefixLegacy),
    ]);
  } catch {
    // Non-fatal: onboarding is already deleted; log but don't fail
  }

  logAudit({
    org_id,
    actor_user_id: user.id,
    action: "onboarding.deleted",
    entity_type: "onboarding",
    entity_id: id,
    onboarding_id: id,
  });
  return NextResponse.json({ ok: true });
}
