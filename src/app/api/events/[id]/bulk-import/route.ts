import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { sendOrgEmail, getOrgEmailConfig } from "@/lib/send-email";
import { resend } from "@/lib/resend";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
import { randomUUID } from "crypto";

// Allow up to 5 minutes — sequential DB work for 500 rows can take a while
export const maxDuration = 300;

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const RowSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  template_name: z.string().min(1),
  company_name: z.string().optional().nullable(),
});

const ImportPayload = z.object({
  rows: z.array(RowSchema).min(1).max(500),
});

type QueuedEmail = {
  to: string;
  fullName: string;
  portalLink: string;
};

// Send all invite emails efficiently.
// Resend orgs: one batch API call per 100 emails (fast, no rate-limit issues).
// Custom SMTP orgs: sequential — their mail server handles its own delivery.
async function sendBatchInvites(
  orgId: string,
  eventName: string,
  queue: QueuedEmail[]
): Promise<void> {
  if (queue.length === 0) return;

  const config = await getOrgEmailConfig(orgId);

  if (config.provider === "smtp") {
    // Sequential through their own SMTP — respect their server's delivery
    for (const q of queue) {
      try {
        await sendOrgEmail(orgId, {
          to: q.to,
          subject: `You have been invited to complete your onboarding for ${eventName}`,
          html: `<p>Hi ${q.fullName},</p><p>You have been invited to complete your onboarding for <strong>${eventName}</strong>.</p><p><a href="${q.portalLink}">Click here to get started</a></p>`,
          text: `Hi ${q.fullName},\n\nYou have been invited to complete your onboarding for ${eventName}.\n\nGet started: ${q.portalLink}`,
        });
      } catch { /* best-effort per email */ }
    }
    return;
  }

  // Resend batch — chunked at 100 per call
  const wl = await loadWhiteLabelForOrg(orgId);
  const brandName = wl.brand_name?.trim() || "ClientEnforce";
  const from = `${brandName} <info@clientenforce.com>`;
  const replyTo = wl.support_email?.trim() || undefined;

  const CHUNK = 100;
  for (let offset = 0; offset < queue.length; offset += CHUNK) {
    const chunk = queue.slice(offset, offset + CHUNK);
    await resend.batch.send(
      chunk.map((q) => ({
        from,
        ...(replyTo ? { replyTo } : {}),
        to: [q.to],
        subject: `You have been invited to complete your onboarding for ${eventName}`,
        html: `<p>Hi ${q.fullName},</p><p>You have been invited to complete your onboarding for <strong>${eventName}</strong>.</p><p><a href="${q.portalLink}">Click here to get started</a></p>`,
        text: `Hi ${q.fullName},\n\nYou have been invited to complete your onboarding for ${eventName}.\n\nGet started: ${q.portalLink}`,
      }))
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: eventId } = await params;
    const supabase = await supabaseServer();
    const admin = supabaseAdmin();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "events_write")) return err(403, "Forbidden");

    // Verify event belongs to org
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, name, end_date")
      .eq("id", eventId)
      .eq("org_id", org_id)
      .single();

    if (eventErr || !event) return err(404, "Event not found");

    const body = await req.json().catch(() => null);
    const parsed = ImportPayload.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload");

    // Load all templates for this org indexed by name
    const { data: orgTemplates, error: tplErr } = await supabase
      .from("templates")
      .select("id, name")
      .eq("org_id", org_id);

    if (tplErr) return err(400, tplErr.message);

    const templateByName: Record<string, string> = {};
    for (const t of orgTemplates ?? []) {
      templateByName[(t.name as string).toLowerCase()] = t.id as string;
    }

    // Fallback template (first created)
    const { data: fallbackTpl } = await supabase
      .from("templates")
      .select("id")
      .eq("org_id", org_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const fallbackTemplateId = (fallbackTpl as any)?.id ?? null;

    // Fetch org portal base for invite links
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

    const created: string[] = [];
    const failed: Array<{ row_index: number; error: string }> = [];
    const emailQueue: QueuedEmail[] = [];

    // Phase 1: create all records in DB
    for (let i = 0; i < parsed.data.rows.length; i++) {
      const row = parsed.data.rows[i];
      try {
        const templateId = templateByName[row.template_name.toLowerCase()] ?? fallbackTemplateId;
        if (!templateId) {
          failed.push({ row_index: i, error: `Template not found: "${row.template_name}"` });
          continue;
        }

        const email = row.email.trim().toLowerCase();
        const fullName = row.full_name.trim();

        let clientId: string;
        const { data: existingClient } = await admin
          .from("clients")
          .select("id")
          .eq("org_id", org_id)
          .eq("email", email)
          .limit(1)
          .maybeSingle();

        if (existingClient?.id) {
          await admin.from("clients").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", existingClient.id);
          clientId = existingClient.id as string;
        } else {
          const { data: newClient, error: clientInsertErr } = await admin
            .from("clients")
            .insert({ org_id, email, full_name: fullName, ...(row.company_name ? { company_name: row.company_name } : {}) })
            .select("id")
            .single();
          if (clientInsertErr || !newClient) throw new Error(clientInsertErr?.message || "Failed to create client");
          clientId = (newClient as any).id;
        }

        const token = randomUUID();

        const { data: onboarding, error: obErr } = await admin
          .from("onboardings")
          .insert({
            org_id,
            client_id: clientId,
            template_id: templateId,
            title: `${fullName} — ${event.name}`,
            status: "draft",
            client_token: token,
            event_id: eventId,
            created_by_user_id: userData.user.id,
            updated_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (obErr || !onboarding) throw new Error(obErr?.message || "Failed to create onboarding");

        const onboardingId = (onboarding as any).id as string;

        const { data: tplRow } = await admin
          .from("templates")
          .select("definition")
          .eq("id", templateId)
          .single();

        if (tplRow) {
          const def = (tplRow as any).definition as any;
          const reqs: any[] = def?.requirements ?? def?.fields ?? [];
          if (reqs.length > 0) {
            const now = new Date().toISOString();
            const reqRows = reqs.map((it: any, idx: number) => ({
              org_id,
              onboarding_id: onboardingId,
              type: it.type ?? "text",
              label: it.label ?? `Field ${idx + 1}`,
              is_required: it.type === "heading" ? false : Boolean(it.is_required ?? false),
              sort_order: Number(it.sort_order ?? idx),
              phase_number: typeof it.phase_number === "number" ? it.phase_number : null,
              options: it.options ?? null,
              created_at: now,
              updated_at: now,
            }));
            await admin.from("onboarding_requirements").insert(reqRows);
          }

          const phaseDefs: any[] = def?.phases ?? [];
          const now = new Date().toISOString();
          if (phaseDefs.length > 0) {
            const phaseRows = phaseDefs.map((p: any, idx: number) => {
              let deadline: string | null = null;
              if (event.end_date && typeof p.default_deadline_offset_days === "number") {
                const d = new Date(event.end_date as string);
                d.setDate(d.getDate() + p.default_deadline_offset_days);
                deadline = d.toISOString().split("T")[0];
              }
              return {
                org_id,
                onboarding_id: onboardingId,
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
              onboarding_id: onboardingId,
              phase_number: 1,
              name: "Onboarding",
              status: "in_progress",
              created_at: now,
              updated_at: now,
            });
          }
        }

        created.push(onboardingId);
        emailQueue.push({ to: email, fullName, portalLink: `${portalBase}/c/${token}` });
      } catch (e: any) {
        failed.push({ row_index: i, error: e?.message || "Unknown error" });
      }
    }

    // Phase 2: send all invite emails in one batch (chunked at 100)
    try {
      await sendBatchInvites(org_id, event.name as string, emailQueue);
    } catch { /* Don't fail the import if email batch errors */ }

    // Write activity feed entry
    try {
      await supabase.from("team_activity").insert({
        org_id,
        actor_user_id: userData.user.id,
        actor_kind: "user",
        verb: "invited",
        subject_kind: "event",
        subject_id: eventId,
        context: { event_id: eventId, event_name: event.name, count: created.length },
      });
    } catch { /* best-effort */ }

    return NextResponse.json({ created: created.length, failed });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
