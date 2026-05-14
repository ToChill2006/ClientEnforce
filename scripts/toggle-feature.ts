#!/usr/bin/env tsx
/**
 * Toggle feature flags on organizations.
 *
 * Usage:
 *   npm run feature -- enable enterprise_onboarding --org "DreamHack"
 *   npm run feature -- disable enterprise_onboarding --org "DreamHack"
 *   npm run feature -- list --org "DreamHack"
 */

import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";

try { (process as any).loadEnvFile(resolve(process.cwd(), ".env.local")); } catch { /* file may not exist */ }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const args = process.argv.slice(2);
const command = args[0]; // enable | disable | list
const flagName = command !== "list" ? args[1] : null;

const orgIdx = args.indexOf("--org");
const orgIdentifier = orgIdx !== -1 ? args[orgIdx + 1] : null;

if (!command || !["enable", "disable", "list"].includes(command)) {
  console.error('Usage: npm run feature -- <enable|disable|list> [flag_name] --org "OrgName"');
  process.exit(1);
}

if (!orgIdentifier) {
  console.error('Missing --org "OrgName"');
  process.exit(1);
}

async function resolveOrg(nameOrId: string) {
  // Try UUID first
  const uuidRe = /^[0-9a-f-]{36}$/i;
  if (uuidRe.test(nameOrId)) {
    const { data, error } = await supabase
      .from("organizations")
      .select("id, name, feature_flags")
      .eq("id", nameOrId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  // Otherwise search by name (case-insensitive)
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, feature_flags")
    .ilike("name", nameOrId)
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Organization not found: "${nameOrId}"`);
  return data;
}

async function main() {
  const org = await resolveOrg(orgIdentifier!);
  const flags = (org.feature_flags as Record<string, unknown>) ?? {};

  if (command === "list") {
    console.log(`\nFeature flags for "${org.name}" (${org.id}):`);
    const keys = Object.keys(flags);
    if (keys.length === 0) {
      console.log("  (none set)");
    } else {
      for (const k of keys) {
        console.log(`  ${k}: ${flags[k]}`);
      }
    }
    return;
  }

  if (!flagName) {
    console.error("Flag name required for enable/disable");
    process.exit(1);
  }

  const updated = { ...flags };
  if (command === "enable") {
    updated[flagName] = true;
  } else {
    delete updated[flagName];
  }

  const { error } = await supabase
    .from("organizations")
    .update({ feature_flags: updated })
    .eq("id", org.id);

  if (error) throw new Error(error.message);

  const action = command === "enable" ? "Enabled" : "Disabled";
  console.log(`\n${action} "${flagName}" for "${org.name}" (${org.id})`);
  console.log("Current flags:", updated);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
