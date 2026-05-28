import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";
const BIRMINGHAM = "92e04f05-5c33-47fa-82bf-300a3ec3653d";
const STOCKHOLM  = "6424ad57-a95c-4b74-a6ed-6f7854bb23d7";

// Onboardings without the bad column
const { data: obs, error: obErr } = await sb.from("onboardings")
  .select("id, title, status, event_id, deadline")
  .eq("org_id", ORG_ID);
console.log("ob error:", obErr?.message);
console.log(`=== ONBOARDINGS (${obs?.length}) ===`);
const demoObs = (obs ?? []).filter(o => [BIRMINGHAM, STOCKHOLM].includes(o.event_id));
for (const o of demoObs) {
  const ev = o.event_id === BIRMINGHAM ? "BHX" : "STK";
  console.log(o.id.slice(0,8), ev, (o.status ?? "").padEnd(12), o.title?.slice(0,40));
}
console.log("BHX:", demoObs.filter(o => o.event_id === BIRMINGHAM).length, "  STK:", demoObs.filter(o => o.event_id === STOCKHOLM).length);

// Requirements for first onboarding
if (demoObs.length > 0) {
  const { data: reqs, error: rErr } = await sb.from("onboarding_requirements")
    .select("id, type, label, phase_number, value_text, file_path, signature_path, completed_at, is_required, payment_status")
    .eq("onboarding_id", demoObs[0].id);
  console.log(`\n=== REQUIREMENTS for ${demoObs[0].id.slice(0,8)} (${reqs?.length} reqs) err=${rErr?.message} ===`);
  for (const r of reqs ?? []) {
    console.log(`  ph${r.phase_number} ${(r.type??'').padEnd(10)} ${(r.label??'').slice(0,30).padEnd(30)} val=${r.value_text ? r.value_text.slice(0,15) : r.file_path ? "FILE:"+r.file_path.slice(0,20) : r.signature_path ? "SIG" : "empty"} req=${r.is_required}`);
  }

  // Phases for first few
  const obIds = demoObs.map(o => o.id);
  const { data: phases } = await sb.from("onboarding_phases")
    .select("onboarding_id, phase_number, status, deadline, name")
    .in("onboarding_id", obIds.slice(0,4));
  console.log(`\n=== PHASES ===`);
  for (const p of phases ?? []) console.log(p.onboarding_id.slice(0,8), `ph${p.phase_number}`, (p.name??'').padEnd(20), p.status.padEnd(15), p.deadline);
}

// Planning board tables
for (const tbl of ["board_columns", "planning_columns", "kanban_columns", "event_board_columns", "board_items", "board_tasks"]) {
  const { error } = await sb.from(tbl).select("id").limit(1);
  if (!error) console.log(`\nTable '${tbl}' EXISTS`);
}

// Team messages
const { data: tmsgs, error: tmErr } = await sb.from("team_messages").select("id, content, event_id, created_at").limit(10);
console.log(`\n=== TEAM_MESSAGES (${tmsgs?.length}) err=${tmErr?.message} ===`);
for (const m of tmsgs ?? []) console.log(m.id.slice(0,8), m.event_id?.slice(0,8), m.content?.slice(0,50));

// What columns does team_messages have?
const { data: tmSample } = await sb.from("team_messages").select("*").limit(1);
if (tmSample?.[0]) console.log("team_messages columns:", Object.keys(tmSample[0]));
