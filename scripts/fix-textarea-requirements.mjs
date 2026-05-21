// Fix onboarding_requirements where type should be "textarea" but was stored as "text"
// Cross-references template definitions to find the correct type.
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Load all templates that have textarea fields
const { data: templates } = await sb.from("templates").select("id, name, definition");

// Build a lookup: templateId → Map<`${phase_number}:${label}` → type>
const templateFieldTypes = new Map();
for (const t of templates || []) {
  const reqs = t.definition?.requirements || [];
  const map = new Map();
  for (const r of reqs) {
    if (r.type === "textarea") {
      map.set(`${r.phase_number}:${r.label}`, "textarea");
    }
  }
  if (map.size > 0) {
    templateFieldTypes.set(t.id, map);
    console.log(`Template "${t.name}" has ${map.size} textarea fields`);
  }
}

if (templateFieldTypes.size === 0) {
  console.log("No templates with textarea fields found.");
  process.exit(0);
}

// Load onboarding_requirements that are "text" type and have a template_id
const { data: onboardings } = await sb
  .from("onboardings")
  .select("id, template_id, title")
  .in("template_id", [...templateFieldTypes.keys()]);

console.log(`\nFound ${onboardings?.length ?? 0} onboardings using templates with textarea fields`);

let totalFixed = 0;

for (const ob of onboardings || []) {
  const fieldMap = templateFieldTypes.get(ob.template_id);
  if (!fieldMap) continue;

  // Get all "text" requirements for this onboarding
  const { data: reqs } = await sb
    .from("onboarding_requirements")
    .select("id, label, phase_number, type")
    .eq("onboarding_id", ob.id)
    .eq("type", "text");

  const toFix = (reqs || []).filter(r =>
    fieldMap.has(`${r.phase_number}:${r.label}`)
  );

  if (toFix.length === 0) continue;

  console.log(`\n"${ob.title}": fixing ${toFix.length} requirements`);
  toFix.forEach(r => console.log(`  - Phase ${r.phase_number}: "${r.label}"`));

  const { error } = await sb
    .from("onboarding_requirements")
    .update({ type: "textarea" })
    .in("id", toFix.map(r => r.id));

  if (error) {
    console.error(`  ERROR: ${error.message}`);
  } else {
    totalFixed += toFix.length;
    console.log(`  ✓ Fixed`);
  }
}

console.log(`\nDone. Fixed ${totalFixed} requirements total.`);
