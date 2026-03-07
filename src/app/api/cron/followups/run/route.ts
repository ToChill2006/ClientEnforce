import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, requireProfile } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function followupsEnabledForTier(tier: "free" | "pro" | "business") {
  return tier === "pro" || tier === "business";
}

function authCron(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const hdr = req.headers.get("authorization") || "";
  return hdr === `Bearer ${secret}`;
}

function missingColumnFromMessage(message?: string | null): string | null {
  if (!message) return null;
  // PostgREST style: Could not find the 'metadata' column of 'followup_jobs' in the schema cache
  const m = message.match(/Could not find the '([^']+)' column of '([^']+)'/i);
  return m?.[1] ?? null;
}

async function safeUpdateFollowupJob(admin: ReturnType<typeof supabaseAdmin>, id: string, fields: Record<string, any>) {
  // If the DB schema doesn't have some columns, PostgREST returns PGRST204.
  // We retry after removing the missing column.
  let payload: Record<string, any> = { ...fields };

  for (let i = 0; i < 6; i++) {
    const { error } = await admin.from("followup_jobs").update(payload).eq("id", id);
    if (!error) return { ok: true as const };

    const missing = missingColumnFromMessage((error as any)?.message);
    if (!missing) return { ok: false as const, error };

    if (Object.prototype.hasOwnProperty.call(payload, missing)) {
      delete payload[missing];
      continue;
    }

    return { ok: false as const, error };
  }

  return { ok: false as const, error: new Error("Too many retries updating followup_jobs") };
}

export async function POST(req: Request) {
  const isCronRequest = authCron(req);

  if (!isCronRequest) {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return json(401, { error: "Unauthorized" });

    const role = await requireRole(["owner", "admin", "member"]);
    if (!roleHasPermission(role, "followups_run")) {
      return json(403, { error: "Forbidden" });
    }

    const profile = await requireProfile();

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("tier, plan_tier")
      .eq("id", profile.org_id)
      .single();

    if (orgError) return json(400, { error: orgError.message });

    const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);

    if (!followupsEnabledForTier(tier)) {
      return json(403, {
        error: "Follow-up automation is not included in your current plan. Upgrade to Pro to run reminders.",
      });
    }
  }

  if (!process.env.RESEND_API_KEY) {
    return json(500, { error: "RESEND_API_KEY is not set" });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";
  const from = `${fromName} <${fromEmail}>`;

  const admin = supabaseAdmin();

  const now = new Date().toISOString();

  const { data: jobs, error: jobsErr } = await admin
    .from("followup_jobs")
    .select("id, org_id, onboarding_id, to_email, subject, body, due_at, status")
    .lte("due_at", now)
    .eq("status", "queued")
    .order("due_at", { ascending: true })
    .limit(25);

  if (jobsErr) return json(400, { error: jobsErr.message });

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const job of jobs || []) {
    // Lock the job by atomically switching queued -> sending.
    // Use select to confirm we actually updated a row (no error if 0 rows updated).
    const { data: lockedRow, error: lockErr } = await admin
      .from("followup_jobs")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", job.id)
      .eq("status", "queued")
      .select("id")
      .maybeSingle();

    if (lockErr) {
      // If updated_at doesn't exist, retry without it
      const missing = missingColumnFromMessage((lockErr as any)?.message);
      if (missing === "updated_at") {
        const { data: lockedRow2, error: lockErr2 } = await admin
          .from("followup_jobs")
          .update({ status: "sending" })
          .eq("id", job.id)
          .eq("status", "queued")
          .select("id")
          .maybeSingle();

        if (lockErr2 || !lockedRow2?.id) {
          skipped += 1;
          continue;
        }
      } else {
        failed += 1;
        continue;
      }
    } else if (!lockedRow?.id) {
      // Someone else processed it
      skipped += 1;
      continue;
    }

    try {
      const html = `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
          <p>${String(job.body || "").replaceAll("\n", "<br/>")}</p>
        </div>
      `;

      const { error: emailErr } = await resend.emails.send({
        from,
        to: [job.to_email],
        subject: job.subject,
        html,
      });

      if (emailErr) throw new Error(emailErr.message);

      const upd = await safeUpdateFollowupJob(admin, job.id, {
        status: "sent",
        sent_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      });

      if (!upd.ok) {
        // If we can't mark it sent, still count as failed so it can be retried later.
        failed += 1;
        await admin.from("audit_logs").insert({
          org_id: job.org_id,
          actor_user_id: null,
          action: "followup.mark_sent_failed",
          entity_type: "followup_job",
          entity_id: job.id,
          metadata: { to: job.to_email, subject: job.subject, onboarding_id: job.onboarding_id, error: (upd as any).error?.message },
        });
        continue;
      }

      await admin.from("audit_logs").insert({
        org_id: job.org_id,
        actor_user_id: null,
        action: "followup.sent",
        entity_type: "followup_job",
        entity_id: job.id,
        metadata: { to: job.to_email, subject: job.subject, onboarding_id: job.onboarding_id },
      });

      sent += 1;
    } catch (e: any) {
      await safeUpdateFollowupJob(admin, job.id, {
        status: "failed",
        last_error: String(e?.message ?? "Unknown error"),
        updated_at: new Date().toISOString(),
      });

      await admin.from("audit_logs").insert({
        org_id: job.org_id,
        actor_user_id: null,
        action: "followup.failed",
        entity_type: "followup_job",
        entity_id: job.id,
        metadata: { to: job.to_email, error: String(e?.message ?? "Unknown error") },
      });

      failed += 1;
    }
  }

  return json(200, { ok: true, processed: (jobs || []).length, sent, failed, skipped });
}