import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

try {
  // 1. Find all events
  const { data: events } = await sb.from("events").select("id, name, status, org_id, submission_deadline");
  console.log("\n=== ALL EVENTS ===");
  for (const e of events ?? []) console.log(e.id, e.name, e.status, e.submission_deadline, "org:", e.org_id?.slice(0,8));

  const dreamhackEvents = (events ?? []).filter(e => e.name?.toLowerCase().includes("dreamhack") || e.name?.toLowerCase().includes("stockholm") || e.name?.toLowerCase().includes("birmingham"));
  console.log("\n=== DREAMHACK EVENTS ===");
  for (const e of dreamhackEvents) console.log(e.id, e.name);

  const eventIds = (events ?? []).map(e => e.id);
  const orgId = (events ?? [])[0]?.org_id;

  // 2. All onboardings
  const { data: obs } = await sb.from("onboardings").select("id, title, status, event_id, client_full_name, client_email").in("event_id", eventIds);
  console.log(`\n=== ONBOARDINGS (${obs?.length}) ===`);
  for (const o of obs ?? []) console.log(o.id.slice(0,8), o.event_id?.slice(0,8), (o.status ?? "").padEnd(12), o.client_full_name ?? o.title);

  const obIds = (obs ?? []).map(o => o.id);

  // 3. Sample requirements
  if (obIds.length > 0) {
    const { data: reqs } = await sb.from("onboarding_requirements").select("id, onboarding_id, type, label, phase_number, value_text, completed_at").in("onboarding_id", obIds.slice(0,2));
    console.log(`\n=== REQUIREMENTS sample ===`);
    for (const r of reqs ?? []) console.log(r.type.padEnd(12), `ph${r.phase_number}`, r.label?.slice(0,35).padEnd(35), r.value_text ? "HAS_VAL" : "empty");
  }

  // 4. Board columns/cards
  const { data: boardCols } = await sb.from("board_columns").select("id, name, event_id").in("event_id", eventIds);
  console.log(`\n=== BOARD_COLUMNS ===`);
  for (const c of boardCols ?? []) console.log(c.id.slice(0,8), c.name, "event:", c.event_id?.slice(0,8));

  const colIds = (boardCols ?? []).map(c => c.id);
  if (colIds.length > 0) {
    const { data: boardCards } = await sb.from("board_cards").select("id, column_id, title, assignee_id").in("column_id", colIds).limit(20);
    console.log(`\n=== BOARD_CARDS ===`);
    for (const c of boardCards ?? []) console.log(c.id.slice(0,8), c.column_id.slice(0,8), c.title?.slice(0,40));
  }

  // 5. Messages
  const { data: msgs } = await sb.from("messages").select("id, event_id, content, created_at").in("event_id", eventIds).limit(10);
  console.log(`\n=== MESSAGES (${msgs?.length}) ===`);
  for (const m of msgs ?? []) console.log(m.id.slice(0,8), m.content?.slice(0,50));

  // 6. Phases
  if (obIds.length > 0) {
    const { data: phases } = await sb.from("onboarding_phases").select("onboarding_id, phase_number, status, deadline").in("onboarding_id", obIds.slice(0,4));
    console.log(`\n=== PHASES sample ===`);
    for (const p of phases ?? []) console.log(p.onboarding_id.slice(0,8), `ph${p.phase_number}`, p.status.padEnd(15), p.deadline);
  }

  // 7. Reminder rules
  const { data: rules } = await sb.from("reminder_rules").select("id, subject, body, trigger_offset_days, rule_type, org_id").limit(10);
  console.log(`\n=== REMINDER_RULES ===`);
  for (const r of rules ?? []) console.log(r.id.slice(0,8), r.rule_type, r.trigger_offset_days, r.subject?.slice(0,50));

  // 8. Check followup_jobs table
  const { data: fups } = await sb.from("followup_jobs").select("id, subject, body, status").limit(5);
  console.log(`\n=== FOLLOWUP_JOBS sample ===`);
  for (const f of fups ?? []) console.log(f.id.slice(0,8), f.status, f.subject?.slice(0,40));

  console.log("\n=== ORG_ID ===", orgId);
} catch(e) { console.error(e.message); }
