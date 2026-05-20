// Backfills onboarding_phases.deadline for all phases that have no deadline set
// but whose onboarding has a deadline (set from the event's submission_deadline).
//
// Usage: node scripts/backfill-phase-deadlines.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Find all phases with no deadline whose onboarding has a deadline
const { data: phases, error } = await supabase
  .from("onboarding_phases")
  .select("id, onboarding_id, phase_number, deadline, onboardings(deadline)")
  .is("deadline", null);

if (error) { console.error("DB error:", error.message); process.exit(1); }

const toUpdate = (phases ?? []).filter((p) => p.onboardings?.deadline);
console.log(`Found ${toUpdate.length} phases to backfill (out of ${phases?.length ?? 0} with no deadline).\n`);

let updated = 0;
for (const p of toUpdate) {
  const deadline = p.onboardings.deadline;
  const { error: upErr } = await supabase
    .from("onboarding_phases")
    .update({ deadline, updated_at: new Date().toISOString() })
    .eq("id", p.id);

  if (upErr) {
    console.log(`  ${p.id.slice(0,8)} (phase ${p.phase_number}) → ERROR: ${upErr.message}`);
  } else {
    console.log(`  ${p.id.slice(0,8)} (phase ${p.phase_number}) → deadline=${deadline} ✓`);
    updated++;
  }
}
console.log(`\nDone. Updated ${updated}/${toUpdate.length} phases.`);
