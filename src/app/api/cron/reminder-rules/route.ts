import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrgEmail } from "@/lib/send-email";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

export const maxDuration = 300;

// Called hourly by Vercel cron
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const admin = supabaseAdmin();
  let processed = 0;
  let sent = 0;

  try {
    // 1. Load orgs that have enterprise_onboarding enabled
    const { data: orgs, error: orgsErr } = await admin
      .from("organizations")
      .select("id, feature_flags");

    if (orgsErr) throw new Error(`Failed to load orgs: ${orgsErr.message}`);

    const enterpriseOrgIds = (orgs ?? [])
      .filter((o: any) => {
        const flags = (o.feature_flags as Record<string, unknown>) ?? {};
        return flags["enterprise_onboarding"] === true;
      })
      .map((o: any) => o.id as string);

    if (enterpriseOrgIds.length === 0) {
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    // 2. Load all active reminder rules for those orgs
    const { data: rules, error: rulesErr } = await admin
      .from("reminder_rules")
      .select("*")
      .in("org_id", enterpriseOrgIds)
      .eq("is_active", true);

    if (rulesErr) throw new Error(`Failed to load rules: ${rulesErr.message}`);
    if (!rules || rules.length === 0) {
      return NextResponse.json({ processed: 0, sent: 0 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (const rule of rules) {
      processed++;

      try {
        // 3. Find matching onboardings based on rule type
        let matchingOnboardings: Array<{
          onboarding_id: string;
          phase_number: number;
          client_email: string;
          client_name: string;
          phase_name: string;
          deadline: string | null;
          missing_items: string[];
        }> = [];

        if (rule.rule_type === "deadline_based") {
          matchingOnboardings = await findDeadlineBasedMatches(admin, rule, today);
        } else if (rule.rule_type === "inactivity_based") {
          matchingOnboardings = await findInactivityBasedMatches(admin, rule);
        } else if (rule.rule_type === "missing_item_based") {
          matchingOnboardings = await findMissingItemBasedMatches(admin, rule);
        }

        for (const match of matchingOnboardings) {
          // 4. Check deduplication
          const { data: existing } = await admin
            .from("reminder_sends")
            .select("id")
            .eq("rule_id", rule.id)
            .eq("onboarding_id", match.onboarding_id)
            .eq("phase_number", match.phase_number)
            .maybeSingle();

          if (existing) continue;

          // 5. Substitute placeholders
          const missingItemsList = match.missing_items.length > 0
            ? match.missing_items.map((item) => `• ${item}`).join("\n")
            : "";

          const subject = interpolate(rule.subject, {
            client_name: match.client_name,
            phase_name: match.phase_name,
            deadline: match.deadline
              ? new Date(match.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "",
            missing_items: missingItemsList,
          });

          const bodyText = interpolate(rule.body, {
            client_name: match.client_name,
            phase_name: match.phase_name,
            deadline: match.deadline
              ? new Date(match.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
              : "",
            missing_items: missingItemsList,
          });

          // 6. Send email with branded wrapper
          let branding: Record<string, unknown> = {};
          try {
            const wl = await loadWhiteLabelForOrg(rule.org_id);
            branding = wl as Record<string, unknown>;
          } catch {
            // fallback to default branding
          }

          const paragraphs = bodyText.split(/\n\n+/).filter(Boolean);
          const { html, text } = renderClientEnforceEmail({
            title: subject,
            paragraphs,
            branding: branding as any,
          });

          try {
            await sendOrgEmail(rule.org_id, {
              to: match.client_email,
              subject,
              html,
              text,
            });

            // 7. Record the send
            await admin.from("reminder_sends").insert({
              rule_id: rule.id,
              onboarding_id: match.onboarding_id,
              phase_number: match.phase_number,
            });

            sent++;
          } catch (emailErr: any) {
            console.error(
              `[reminder-rules cron] Failed to send email for rule ${rule.id}, onboarding ${match.onboarding_id}:`,
              emailErr?.message
            );
          }
        }
      } catch (ruleErr: any) {
        console.error(`[reminder-rules cron] Error processing rule ${rule.id}:`, ruleErr?.message);
      }
    }
  } catch (err: any) {
    console.error("[reminder-rules cron] Fatal error:", err?.message);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }

  return NextResponse.json({ processed, sent });
}

// ── Helper: interpolate {{placeholder}} tokens ────────────────────────────────

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

// ── deadline_based: phase.deadline::date - CURRENT_DATE = trigger_offset_days ─

async function findDeadlineBasedMatches(
  admin: ReturnType<typeof supabaseAdmin>,
  rule: any,
  today: Date
): Promise<Array<{
  onboarding_id: string;
  phase_number: number;
  client_email: string;
  client_name: string;
  phase_name: string;
  deadline: string | null;
  missing_items: string[];
}>> {
  // deadline date = today + trigger_offset_days
  const targetDate = new Date(today);
  targetDate.setUTCDate(targetDate.getUTCDate() + rule.trigger_offset_days);
  const targetDateStr = targetDate.toISOString().split("T")[0];

  const phaseFilter = rule.phase_number != null
    ? { phase_number: rule.phase_number }
    : {};

  // Include rejected phases — client still needs to fix and resubmit,
  // so deadline reminders should keep firing. Awaiting review and approved
  // are excluded (client has acted; awaiting decision or already done).
  const { data: phases } = await admin
    .from("onboarding_phases")
    .select("onboarding_id, phase_number, name, deadline, status, org_id")
    .eq("org_id", rule.org_id)
    .in("status", ["in_progress", "rejected"])
    .not("deadline", "is", null);

  if (!phases) return [];

  const matching = phases.filter((p: any) => {
    if (rule.phase_number != null && p.phase_number !== rule.phase_number) return false;
    if (!p.deadline) return false;
    const deadlineDateStr = String(p.deadline).split("T")[0];
    return deadlineDateStr === targetDateStr;
  });

  return buildMatchResults(admin, rule.org_id, matching);
}

// ── inactivity_based: onboarding.updated_at < NOW() - trigger_offset_days ─────

async function findInactivityBasedMatches(
  admin: ReturnType<typeof supabaseAdmin>,
  rule: any
): Promise<Array<{
  onboarding_id: string;
  phase_number: number;
  client_email: string;
  client_name: string;
  phase_name: string;
  deadline: string | null;
  missing_items: string[];
}>> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - rule.trigger_offset_days);

  // Get onboardings with no activity since cutoff
  const { data: onboardings } = await admin
    .from("onboardings")
    .select("id, updated_at, org_id")
    .eq("org_id", rule.org_id)
    .lt("updated_at", cutoff.toISOString());

  if (!onboardings || onboardings.length === 0) return [];

  const onboardingIds = onboardings.map((o: any) => o.id as string);

  // Get in_progress phases for those onboardings
  const phaseQuery = admin
    .from("onboarding_phases")
    .select("onboarding_id, phase_number, name, deadline, status, org_id")
    .eq("org_id", rule.org_id)
    .in("status", ["in_progress", "rejected"])
    .in("onboarding_id", onboardingIds);

  const { data: phases } = await phaseQuery;

  if (!phases) return [];

  const matching = phases.filter((p: any) => {
    if (rule.phase_number != null && p.phase_number !== rule.phase_number) return false;
    return true;
  });

  return buildMatchResults(admin, rule.org_id, matching);
}

// ── missing_item_based: phase in_progress >= trigger_offset_days ago AND ──────
//    at least one unfilled required requirement

async function findMissingItemBasedMatches(
  admin: ReturnType<typeof supabaseAdmin>,
  rule: any
): Promise<Array<{
  onboarding_id: string;
  phase_number: number;
  client_email: string;
  client_name: string;
  phase_name: string;
  deadline: string | null;
  missing_items: string[];
}>> {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - rule.trigger_offset_days);

  // Get in_progress phases that became in_progress (updated_at) before the cutoff
  const { data: phases } = await admin
    .from("onboarding_phases")
    .select("onboarding_id, phase_number, name, deadline, status, updated_at, org_id")
    .eq("org_id", rule.org_id)
    .in("status", ["in_progress", "rejected"])
    .lt("updated_at", cutoff.toISOString());

  if (!phases || phases.length === 0) return [];

  const filtered = phases.filter((p: any) => {
    if (rule.phase_number != null && p.phase_number !== rule.phase_number) return false;
    return true;
  });

  if (filtered.length === 0) return [];

  // For each phase, check if there are unfilled required requirements
  const results: Array<{
    onboarding_id: string;
    phase_number: number;
    client_email: string;
    client_name: string;
    phase_name: string;
    deadline: string | null;
    missing_items: string[];
  }> = [];

  const baseMatches = await buildMatchResults(admin, rule.org_id, filtered);

  for (const match of baseMatches) {
    // Override missing_items with actual unfilled required items for this phase
    const missingItems = await getMissingRequiredItems(
      admin,
      match.onboarding_id,
      match.phase_number
    );

    if (missingItems.length > 0) {
      results.push({ ...match, missing_items: missingItems });
    }
  }

  return results;
}

// ── buildMatchResults: enrich phase rows with client details ──────────────────

async function buildMatchResults(
  admin: ReturnType<typeof supabaseAdmin>,
  orgId: string,
  phases: Array<{ onboarding_id: string; phase_number: number; name: string; deadline: string | null }>
): Promise<Array<{
  onboarding_id: string;
  phase_number: number;
  client_email: string;
  client_name: string;
  phase_name: string;
  deadline: string | null;
  missing_items: string[];
}>> {
  if (phases.length === 0) return [];

  const onboardingIds = [...new Set(phases.map((p) => p.onboarding_id))];

  const { data: onboardings } = await admin
    .from("onboardings")
    .select("id, client_email, client_name")
    .eq("org_id", orgId)
    .in("id", onboardingIds);

  if (!onboardings) return [];

  const onboardingMap = new Map(
    onboardings.map((o: any) => [o.id, o])
  );

  return phases
    .map((p) => {
      const onb = onboardingMap.get(p.onboarding_id) as any;
      if (!onb?.client_email) return null;
      return {
        onboarding_id: p.onboarding_id,
        phase_number: p.phase_number,
        client_email: onb.client_email as string,
        client_name: (onb.client_name as string) || onb.client_email,
        phase_name: p.name || `Phase ${p.phase_number}`,
        deadline: p.deadline ?? null,
        missing_items: [] as string[],
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

// ── getMissingRequiredItems: unfilled required requirements for a phase ────────

async function getMissingRequiredItems(
  admin: ReturnType<typeof supabaseAdmin>,
  onboardingId: string,
  phaseNumber: number
): Promise<string[]> {
  // Get the requirements for this onboarding + phase
  const { data: reqs } = await admin
    .from("onboarding_requirements")
    .select("label, is_required, phase_number, value, file_path")
    .eq("onboarding_id", onboardingId)
    .eq("phase_number", phaseNumber)
    .eq("is_required", true);

  if (!reqs) return [];

  return reqs
    .filter((r: any) => {
      const hasValue = r.value != null && String(r.value).trim().length > 0;
      const hasFile = r.file_path != null && String(r.file_path).trim().length > 0;
      return !hasValue && !hasFile;
    })
    .map((r: any) => r.label as string)
    .filter(Boolean);
}
