import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET() {
  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) return err(403, "Enterprise feature not enabled");

    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member"]);

    const admin = supabaseAdmin();
    const orgId = profile.org_id;

    // 1. Fetch events for org
    const { data: events, error: eventsErr } = await admin
      .from("events")
      .select("id, name, end_date, start_date")
      .eq("org_id", orgId)
      .order("end_date", { ascending: false });
    if (eventsErr) return err(400, eventsErr.message);

    const eventIds = (events ?? []).map((e: any) => e.id);
    if (eventIds.length === 0) return NextResponse.json({ events: [] });

    // 2. Fetch event-linked onboardings (exhibitors)
    const { data: onboardings, error: onbErr } = await admin
      .from("onboardings")
      .select("id, event_id, client_name, client_email, title, status")
      .in("event_id", eventIds)
      .eq("org_id", orgId)
      .order("client_name", { ascending: true });
    if (onbErr) return err(400, onbErr.message);

    const onboardingIds = (onboardings ?? []).map((o: any) => o.id);

    // 3. Fetch reminder_sends for those onboardings
    let sendsMap = new Map<string, any[]>();
    if (onboardingIds.length > 0) {
      const { data: sends } = await admin
        .from("reminder_sends")
        .select("id, rule_id, onboarding_id, phase_number, created_at")
        .in("onboarding_id", onboardingIds)
        .order("created_at", { ascending: false });
      for (const s of sends ?? []) {
        if (!sendsMap.has(s.onboarding_id)) sendsMap.set(s.onboarding_id, []);
        sendsMap.get(s.onboarding_id)!.push(s);
      }
    }

    // 4. Fetch active reminder rules for org (to compute upcoming)
    const { data: rules } = await admin
      .from("reminder_rules")
      .select("id, subject, rule_type, trigger_offset_days, phase_number, is_active")
      .eq("org_id", orgId)
      .eq("is_active", true);

    // Build a set of sent (rule_id, onboarding_id) pairs for fast lookup
    const sentSet = new Set<string>();
    for (const [onbId, sends] of sendsMap) {
      for (const s of sends) {
        sentSet.add(`${s.rule_id}:${onbId}`);
      }
    }

    // 5. Group exhibitors by event, attach upcoming/sent reminders
    const exhibitorsByEvent = new Map<string, any[]>();
    for (const o of onboardings ?? []) {
      if (!exhibitorsByEvent.has(o.event_id)) exhibitorsByEvent.set(o.event_id, []);

      const sentReminders = (sendsMap.get(o.id) ?? []).map((s: any) => {
        const rule = (rules ?? []).find((r: any) => r.id === s.rule_id);
        return {
          id: s.id,
          rule_id: s.rule_id,
          phase_number: s.phase_number,
          sent_at: s.created_at,
          subject: rule?.subject ?? "Reminder",
          rule_type: rule?.rule_type ?? null,
          trigger_offset_days: rule?.trigger_offset_days ?? null,
        };
      });

      const upcomingReminders = (rules ?? [])
        .filter((r: any) => !sentSet.has(`${r.id}:${o.id}`))
        .map((r: any) => ({
          rule_id: r.id,
          subject: r.subject,
          rule_type: r.rule_type,
          trigger_offset_days: r.trigger_offset_days,
          phase_number: r.phase_number,
        }));

      exhibitorsByEvent.get(o.event_id)!.push({
        onboarding_id: o.id,
        client_name: o.client_name,
        client_email: o.client_email,
        onboarding_title: o.title,
        status: o.status,
        upcoming_reminders: upcomingReminders,
        sent_reminders: sentReminders,
      });
    }

    const result = (events ?? []).map((e: any) => ({
      id: e.id,
      name: e.name,
      end_date: e.end_date,
      start_date: e.start_date,
      exhibitors: exhibitorsByEvent.get(e.id) ?? [],
    }));

    return NextResponse.json({ events: result });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Internal error");
  }
}
