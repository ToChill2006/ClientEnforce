/**
 * Backfills phase_number on onboarding_requirements rows that have phase_number = NULL.
 *
 * For each affected onboarding, loads the linked template's definition.requirements[]
 * and matches by sort_order to copy the correct phase_number.
 *
 * Run with: npx tsx scripts/backfill-phase-numbers.ts
 */

import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

for (const f of [".env.production", ".env.local"]) {
  try { (process as any).loadEnvFile(resolve(process.cwd(), f)); break; } catch { /* skip */ }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function main() {
  // Find all onboardings that have at least one requirement with null phase_number
  const { data: nullReqs, error: nullErr } = await db
    .from("onboarding_requirements")
    .select("id, onboarding_id, sort_order, label, phase_number")
    .is("phase_number", null);

  if (nullErr) {
    console.error("Failed to fetch requirements:", nullErr.message);
    process.exit(1);
  }

  if (!nullReqs || nullReqs.length === 0) {
    console.log("No requirements with null phase_number — nothing to do.");
    return;
  }

  // Group by onboarding_id
  const byOnboarding: Record<string, typeof nullReqs> = {};
  for (const r of nullReqs) {
    const id = r.onboarding_id as string;
    if (!byOnboarding[id]) byOnboarding[id] = [];
    byOnboarding[id].push(r);
  }

  console.log(`Found ${nullReqs.length} null-phase requirements across ${Object.keys(byOnboarding).length} onboarding(s)\n`);

  for (const [onboardingId, reqs] of Object.entries(byOnboarding)) {
    // Load the onboarding's template_id
    const { data: ob } = await db
      .from("onboardings")
      .select("id, title, template_id")
      .eq("id", onboardingId)
      .single();

    if (!ob || !(ob as any).template_id) {
      console.log(`  ⚠  ${onboardingId}: no template_id — skipping`);
      continue;
    }

    const templateId = (ob as any).template_id as string;
    const title = (ob as any).title ?? onboardingId;

    // Load the template definition
    const { data: tpl } = await db
      .from("templates")
      .select("definition")
      .eq("id", templateId)
      .single();

    if (!tpl) {
      console.log(`  ⚠  "${title}": template ${templateId} not found — skipping`);
      continue;
    }

    const def = (tpl as any).definition as any;
    const tplReqs: any[] = def?.requirements ?? def?.fields ?? [];

    if (tplReqs.length === 0) {
      console.log(`  ⚠  "${title}": template has no requirements — skipping`);
      continue;
    }

    // Build lookup: sort_order → phase_number from template
    const phaseBySort: Record<number, number | null> = {};
    for (const tr of tplReqs) {
      const sortOrder = Number(tr.sort_order ?? 0);
      const phaseNumber = typeof tr.phase_number === "number" ? tr.phase_number : null;
      phaseBySort[sortOrder] = phaseNumber;
    }

    // Also build lookup by label as fallback
    const phaseByLabel: Record<string, number | null> = {};
    for (const tr of tplReqs) {
      if (tr.label) {
        phaseByLabel[String(tr.label).toLowerCase()] = typeof tr.phase_number === "number" ? tr.phase_number : null;
      }
    }

    let updated = 0;
    let skipped = 0;

    for (const req of reqs) {
      const sortOrder = req.sort_order as number;
      const label = String(req.label ?? "").toLowerCase();

      // Try sort_order first, then label
      let phaseNumber: number | null = null;
      if (sortOrder !== undefined && sortOrder in phaseBySort) {
        phaseNumber = phaseBySort[sortOrder];
      } else if (label && label in phaseByLabel) {
        phaseNumber = phaseByLabel[label];
      }

      if (phaseNumber === null) {
        // No phase found in template — leave as null (will be treated as phase 1)
        skipped++;
        continue;
      }

      const { error: updateErr } = await db
        .from("onboarding_requirements")
        .update({ phase_number: phaseNumber })
        .eq("id", req.id as string);

      if (updateErr) {
        console.log(`    ✗  req ${req.id} (${req.label}): ${updateErr.message}`);
      } else {
        updated++;
      }
    }

    console.log(`  ✓  "${title}": updated ${updated} requirement(s), ${skipped} left as null (phase 1 fallback)`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
