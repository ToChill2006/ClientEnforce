import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";
const BIRMINGHAM = "92e04f05-5c33-47fa-82bf-300a3ec3653d";
const STOCKHOLM  = "6424ad57-a95c-4b74-a6ed-6f7854bb23d7";

// All onboardings for this org
const { data: obs, error: obErr } = await sb.from("onboardings")
  .select("id, title, status, event_id, client_full_name, client_email, deadline")
  .eq("org_id", ORG_ID);
console.log("ob error:", obErr?.message);
console.log(`=== ONBOARDINGS (${obs?.length}) ===`);
for (const o of obs ?? []) {
  const ev = o.event_id === BIRMINGHAM ? "BHX" : o.event_id === STOCKHOLM ? "STK" : "other";
  console.log(o.id.slice(0,8), ev, (o.status ?? "").padEnd(12), o.client_full_name ?? o.title);
}

// Requirement types used
const obIds = (obs ?? []).filter(o => [BIRMINGHAM, STOCKHOLM].includes(o.event_id)).map(o => o.id);
console.log(`\nOnboarding IDs for BHX+STK: ${obIds.length}`);

if (obIds.length > 0) {
  const { data: reqs } = await sb.from("onboarding_requirements")
    .select("id, onboarding_id, type, label, phase_number, value_text, file_path, signature_path, completed_at, is_required, payment_status")
    .in("onboarding_id", [obIds[0]]);
  console.log(`\n=== REQUIREMENTS for first onboarding ===`);
  for (const r of reqs ?? []) {
    console.log(`  ph${r.phase_number} ${r.type.padEnd(12)} ${r.label?.slice(0,30).padEnd(30)} val=${r.value_text ? r.value_text.slice(0,15) : r.file_path ? "FILE" : r.signature_path ? "SIG" : "empty"}`);
  }

  // Phases
  const { data: phases } = await sb.from("onboarding_phases")
    .select("onboarding_id, phase_number, status, deadline, name")
    .in("onboarding_id", obIds.slice(0,3));
  console.log(`\n=== PHASES ===`);
  for (const p of phases ?? []) console.log(p.onboarding_id.slice(0,8), `ph${p.phase_number}`, p.name?.padEnd(20), p.status.padEnd(15), p.deadline);
}

// Board columns
const { data: cols, error: colErr } = await sb.from("board_columns").select("*").eq("org_id", ORG_ID);
console.log(`\n=== BOARD_COLUMNS (${cols?.length}) err=${colErr?.message} ===`);
for (const c of cols ?? []) console.log(c.id.slice(0,8), c.event_id?.slice(0,8), c.name, "pos:", c.position);

// Messages - try different table names
for (const tbl of ["messages", "event_messages", "chat_messages", "team_messages"]) {
  const { data, error } = await sb.from(tbl).select("id").eq("org_id", ORG_ID).limit(1);
  if (!error) console.log(`\nTable '${tbl}' exists, has data: ${data?.length}`);
}
