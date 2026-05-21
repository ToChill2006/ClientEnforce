// Fix textarea fields in old DreamHack templates and existing onboarding_requirements
// These templates were created before textarea type existed, so long text fields were stored as "text"
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Labels that should be textarea (multi-line) by template ID
const TEXTAREA_LABELS_BY_TEMPLATE = {
  // DreamHack Atlanta 2026 - Onboarding Form
  "4f8e9ef4-c7d3-4f4e-b592-1e4d13ea4e6a": new Set([
    "Products / Services Being Showcased",
    "Additional notes for the venue team",
    "Short Company Description (max 150 words) – for event app/website",
  ]),
  // DreamHack - Onsite Info Form
  "4557cac6-f611-40ce-beae-f362018913fd": new Set([
    "Electrical / AV / Special Requirements",
    "Activity Description – what will attendees be doing?",
    "Activity Schedule (days and times)",
    "Equipment / AV Requirements for Activities",
    "VIP Guest Details (names, access level required)",
    "Guests with Accessibility Requirements – please provide details so we can make appropriate arrangements",
  ]),
  // DreamHack - New Client Form
  "a4343fbb-3a6d-4ebd-ac84-5e5f1f4e7723": new Set([
    "Registered Company Address (Street)",
    "Additional Notes / Special Terms",
    "Notes for Billing Team",
  ]),
};

// Step 1: Update template definitions
console.log("=== Updating template definitions ===");
const { data: templates } = await sb
  .from("templates")
  .select("id, name, definition")
  .in("id", Object.keys(TEXTAREA_LABELS_BY_TEMPLATE));

for (const t of templates || []) {
  const labels = TEXTAREA_LABELS_BY_TEMPLATE[t.id];
  const reqs = t.definition?.requirements || [];
  let changed = 0;
  const updated = reqs.map((r) => {
    if (r.type === "text" && labels.has(r.label)) {
      changed++;
      return { ...r, type: "textarea" };
    }
    return r;
  });

  if (changed === 0) {
    console.log(`"${t.name}": already up to date`);
    continue;
  }

  const { error } = await sb
    .from("templates")
    .update({ definition: { ...t.definition, requirements: updated } })
    .eq("id", t.id);

  if (error) {
    console.error(`"${t.name}": ERROR - ${error.message}`);
  } else {
    console.log(`"${t.name}": updated ${changed} fields to textarea`);
  }
}

// Step 2: Update existing onboarding_requirements
console.log("\n=== Updating onboarding_requirements ===");
const { data: onboardings } = await sb
  .from("onboardings")
  .select("id, title, template_id")
  .in("template_id", Object.keys(TEXTAREA_LABELS_BY_TEMPLATE));

console.log(`Found ${onboardings?.length ?? 0} onboardings to check`);

let totalFixed = 0;
for (const ob of onboardings || []) {
  const labels = TEXTAREA_LABELS_BY_TEMPLATE[ob.template_id];

  const { data: reqs } = await sb
    .from("onboarding_requirements")
    .select("id, label, phase_number, type")
    .eq("onboarding_id", ob.id)
    .eq("type", "text")
    .in("label", [...labels]);

  if (!reqs || reqs.length === 0) continue;

  const { error } = await sb
    .from("onboarding_requirements")
    .update({ type: "textarea" })
    .in("id", reqs.map((r) => r.id));

  if (error) {
    console.error(`"${ob.title}": ERROR - ${error.message}`);
  } else {
    totalFixed += reqs.length;
    console.log(`"${ob.title}": fixed ${reqs.length} requirements`);
    reqs.forEach((r) => console.log(`  - Phase ${r.phase_number}: "${r.label}"`));
  }
}

console.log(`\nDone. Fixed ${totalFixed} requirements total.`);
