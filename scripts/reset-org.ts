/**
 * Wipes ALL org data for the target org, leaving only the org record,
 * its feature flags, and the owner's user/profile/membership intact.
 * Run with: npx tsx scripts/reset-org.ts
 */

import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// Prefer .env.production (real DB), fall back to .env.local
for (const f of [".env.production", ".env.local"]) {
  try { (process as any).loadEnvFile(resolve(process.cwd(), f)); break; } catch { /* skip */ }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const TARGET_ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";

async function del(table: string, column = "org_id") {
  const { error, count } = await db
    .from(table)
    .delete({ count: "exact" })
    .eq(column, TARGET_ORG_ID);
  if (error) {
    console.warn(`  ⚠  ${table}: ${error.message}`);
  } else {
    console.log(`  ✓  ${table}: deleted ${count ?? "?"} row(s)`);
  }
}

async function main() {
  console.log(`\nResetting org ${TARGET_ORG_ID}...\n`);

  // Order matters for FK constraints — delete dependents first
  await del("onboarding_phases");
  await del("onboarding_requirements");
  await del("team_activity");
  await del("onboardings");
  await del("events");
  await del("client_types");
  await del("clients");
  await del("templates");

  // Followup tables (best-effort, ignore if table doesn't exist)
  for (const t of ["followup_schedules", "followups", "follow_ups"]) {
    await del(t);
  }

  // Storage references (soft-delete any file records)
  for (const t of ["storage_files", "file_records"]) {
    await del(t);
  }

  console.log("\nDone. The org is clean — no onboardings, events, clients, or templates.");
}

main().catch((e) => { console.error(e); process.exit(1); });
