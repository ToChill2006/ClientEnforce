#!/usr/bin/env tsx
/**
 * Seed the DreamHack demo workspace.
 *
 * Usage: npm run seed:dreamhack
 *
 * Creates:
 *  - DreamHack org (or looks up existing) with enterprise_onboarding flag ON
 *  - 5 client types + 3-phase templates for each
 *  - 1 event: DreamHack Dallas 2026 (end_date = 90 days from today)
 *  - 35 fake exhibitors spread across the 5 types
 *  - Pre-filled Phase 1 for 5 of them, awaiting_review for 2, rejected for 1
 */

import { createClient } from "@supabase/supabase-js";
import { resolve } from "path";
import { randomUUID } from "crypto";

try { (process as any).loadEnvFile(resolve(process.cwd(), ".env.local")); } catch { /* file may not exist */ }

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(d: Date, days: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r.toISOString().split("T")[0];
}

const today = new Date();
const eventEndDate = addDays(today, 90);

// ─── Client type definitions ──────────────────────────────────────────────────

const CLIENT_TYPES: Array<{
  name: string;
  description: string;
  phases: Array<{ number: number; name: string; offset: number; requirements: Array<{ label: string; type: string; is_required: boolean }> }>;
}> = [
  {
    name: "Floorspace Only",
    description: "Standard booth exhibitor purchasing floorspace.",
    phases: [
      {
        number: 1,
        name: "Initial Submission",
        offset: -60,
        requirements: [
          { label: "Company Name", type: "text", is_required: true },
          { label: "Booth Size Requested (sqm)", type: "text", is_required: true },
          { label: "Electrical Requirements", type: "text", is_required: false },
          { label: "Internet Requirements", type: "text", is_required: false },
          { label: "Insurance Certificate", type: "file", is_required: true },
        ],
      },
      {
        number: 2,
        name: "Logistics & Layout",
        offset: -45,
        requirements: [
          { label: "Floorplan Position Request", type: "text", is_required: false },
          { label: "Freight & Logistics Details", type: "text", is_required: true },
          { label: "Accessibility Requirements", type: "text", is_required: false },
        ],
      },
      {
        number: 3,
        name: "On-site Check-in",
        offset: -14,
        requirements: [
          { label: "On-site Contact Name", type: "text", is_required: true },
          { label: "On-site Contact Phone", type: "text", is_required: true },
          { label: "Badge Collection Details", type: "text", is_required: false },
          { label: "Final Check-in Confirmation", type: "checkbox", is_required: true },
        ],
      },
    ],
  },
  {
    name: "Global Partners",
    description: "Premium partnership sponsors with branding and activations.",
    phases: [
      {
        number: 1,
        name: "Partnership Onboarding",
        offset: -75,
        requirements: [
          { label: "Partnership Contract Addendum (signed)", type: "file", is_required: true },
          { label: "Branding Assets Pack (ZIP)", type: "file", is_required: true },
          { label: "Primary Contact Name", type: "text", is_required: true },
        ],
      },
      {
        number: 2,
        name: "Positioning & Activations",
        offset: -50,
        requirements: [
          { label: "Premium Positioning Request", type: "text", is_required: false },
          { label: "Hospitality Requirements", type: "text", is_required: false },
          { label: "Sponsor Activations Description", type: "text", is_required: true },
        ],
      },
      {
        number: 3,
        name: "VIP & Post-event",
        offset: -21,
        requirements: [
          { label: "VIP Guest List", type: "file", is_required: true },
          { label: "On-site Liaison Contact", type: "text", is_required: true },
          { label: "Post-event Reporting Preferences", type: "multiple_choice", is_required: false },
        ],
      },
    ],
  },
  {
    name: "Pre-built Booth",
    description: "Exhibitor using a contractor-built stand.",
    phases: [
      {
        number: 1,
        name: "Booth Requirements",
        offset: -70,
        requirements: [
          { label: "Company Name", type: "text", is_required: true },
          { label: "Booth Size", type: "text", is_required: true },
          { label: "Electrical Requirements", type: "text", is_required: true },
          { label: "Brand Asset Pack (ZIP)", type: "file", is_required: true },
        ],
      },
      {
        number: 2,
        name: "Stand Design & Build",
        offset: -45,
        requirements: [
          { label: "Stand Design Draft (PDF)", type: "file", is_required: true },
          { label: "Build Crew List", type: "text", is_required: true },
          { label: "Build Dates", type: "text", is_required: true },
        ],
      },
      {
        number: 3,
        name: "Safety & Compliance",
        offset: -14,
        requirements: [
          { label: "Fire Safety Compliance Certificate", type: "file", is_required: true },
          { label: "Electrical Test Certificates", type: "file", is_required: true },
          { label: "On-site Contact", type: "text", is_required: true },
        ],
      },
    ],
  },
  {
    name: "Retailers",
    description: "Vendors selling products at the event.",
    phases: [
      {
        number: 1,
        name: "Retail Registration",
        offset: -60,
        requirements: [
          { label: "Products Being Sold (list)", type: "text", is_required: true },
          { label: "Retail License", type: "file", is_required: true },
        ],
      },
      {
        number: 2,
        name: "Payment & Layout",
        offset: -40,
        requirements: [
          { label: "Payment Terminal Setup Requirements", type: "text", is_required: true },
          { label: "POS Layout Description", type: "text", is_required: false },
        ],
      },
      {
        number: 3,
        name: "On-site Logistics",
        offset: -10,
        requirements: [
          { label: "On-site Retail Staff Names", type: "text", is_required: true },
          { label: "Sales Reporting Preferences", type: "text", is_required: false },
        ],
      },
    ],
  },
  {
    name: "Sampling Partners",
    description: "Brands distributing product samples.",
    phases: [
      {
        number: 1,
        name: "Product Registration",
        offset: -65,
        requirements: [
          { label: "Products Being Sampled", type: "text", is_required: true },
          { label: "Sample Quantity", type: "text", is_required: true },
        ],
      },
      {
        number: 2,
        name: "Shipping & Branding",
        offset: -45,
        requirements: [
          { label: "Shipping Address (deliver to)", type: "text", is_required: true },
          { label: "Distribution Method", type: "text", is_required: true },
          { label: "Brand Asset Approval", type: "file", is_required: true },
        ],
      },
      {
        number: 3,
        name: "On-site & Sustainability",
        offset: -10,
        requirements: [
          { label: "On-site Staff List", type: "text", is_required: true },
          { label: "Post-event Waste / Recycling Plan", type: "text", is_required: true },
        ],
      },
    ],
  },
];

// ─── Fake exhibitors ──────────────────────────────────────────────────────────

const FAKE_EXHIBITORS = [
  // Floorspace Only (7)
  { name: "Acme Displays Ltd", email: "acme@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "Nordic Stands AB", email: "nordic@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "Booth Craft Inc", email: "boothcraft@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "Expo Express GmbH", email: "expoexpress@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "Showcase Solutions", email: "showcase@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "TradeStar Ltd", email: "tradestar@demo-exhibitor.io", type: "Floorspace Only" },
  { name: "Pixel Booth Co", email: "pixelbooth@demo-exhibitor.io", type: "Floorspace Only" },

  // Global Partners (7)
  { name: "Razer Inc", email: "razer@demo-exhibitor.io", type: "Global Partners" },
  { name: "Corsair Components", email: "corsair@demo-exhibitor.io", type: "Global Partners" },
  { name: "HyperX", email: "hyperx@demo-exhibitor.io", type: "Global Partners" },
  { name: "Logitech G", email: "logitechg@demo-exhibitor.io", type: "Global Partners" },
  { name: "SteelSeries", email: "steelseries@demo-exhibitor.io", type: "Global Partners" },
  { name: "Alienware", email: "alienware@demo-exhibitor.io", type: "Global Partners" },
  { name: "ASUS ROG", email: "asusrog@demo-exhibitor.io", type: "Global Partners" },

  // Pre-built Booth (7)
  { name: "DataStream Systems", email: "datastream@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "QuantumEdge Tech", email: "quantumedge@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "Neon Circuits Ltd", email: "neoncircuits@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "ByteForge Studios", email: "byteforge@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "Velocity Hardware", email: "velocity@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "Arc Systems Co", email: "arcsystems@demo-exhibitor.io", type: "Pre-built Booth" },
  { name: "Vertex Gaming", email: "vertex@demo-exhibitor.io", type: "Pre-built Booth" },

  // Retailers (7)
  { name: "GameStop Dallas", email: "gamestop@demo-exhibitor.io", type: "Retailers" },
  { name: "Best Buy Gaming", email: "bestbuy@demo-exhibitor.io", type: "Retailers" },
  { name: "Micro Center", email: "microcenter@demo-exhibitor.io", type: "Retailers" },
  { name: "Newegg Pop-up", email: "newegg@demo-exhibitor.io", type: "Retailers" },
  { name: "EB Games AUS", email: "ebgames@demo-exhibitor.io", type: "Retailers" },
  { name: "Level Up Shop", email: "levelup@demo-exhibitor.io", type: "Retailers" },
  { name: "Pixel Perfect Retail", email: "pixelperfect@demo-exhibitor.io", type: "Retailers" },

  // Sampling Partners (7)
  { name: "Red Bull Energies", email: "redbull@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "Monster Beverages", email: "monster@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "GFuel Labs", email: "gfuel@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "Sneak Energy EU", email: "sneak@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "Celsius Nutrition", email: "celsius@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "Lays Gaming Pack", email: "lays@demo-exhibitor.io", type: "Sampling Partners" },
  { name: "Doritos Stage", email: "doritos@demo-exhibitor.io", type: "Sampling Partners" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀 Seeding DreamHack demo workspace…\n");

  // 1) Find or create the DreamHack org
  let orgId: string;
  // Use the owner's primary workspace org directly
  const TARGET_ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";
  const OWNER_USER_ID = "91c7ecfd-f5b3-4f5b-ad95-2fa585c6bd0f";
  const { data: existingOrg } = await db
    .from("organizations")
    .select("id, name")
    .eq("id", TARGET_ORG_ID)
    .single();

  if (!existingOrg) throw new Error("Could not find target org");
  orgId = existingOrg.id as string;
  console.log(`✓ Using org: "${existingOrg.name}" (${orgId})`);

  // 2) Enable enterprise_onboarding flag
  await db.from("organizations").update({ feature_flags: { enterprise_onboarding: true } }).eq("id", orgId);
  console.log("✓ Feature flag: enterprise_onboarding = true");

  // 3) Create client types + templates
  const clientTypeIdByName: Record<string, string> = {};

  for (const ct of CLIENT_TYPES) {
    // Build template definition
    const allRequirements: any[] = [];
    for (const ph of ct.phases) {
      allRequirements.push({ type: "heading", label: `── ${ph.name} ──`, is_required: false, sort_order: allRequirements.length, phase: ph.number });
      for (const req of ph.requirements) {
        allRequirements.push({ ...req, sort_order: allRequirements.length, phase: ph.number });
      }
    }

    const templateDef = {
      requirements: allRequirements,
      phases: ct.phases.map((p) => ({
        number: p.number,
        name: p.name,
        default_deadline_offset_days: p.offset,
      })),
    };

    // Upsert template
    let templateId: string;
    const { data: existingTpl } = await db
      .from("templates")
      .select("id")
      .eq("org_id", orgId)
      .eq("name", ct.name)
      .limit(1)
      .maybeSingle();

    if (existingTpl) {
      await db.from("templates").update({ definition: templateDef }).eq("id", existingTpl.id);
      templateId = existingTpl.id as string;
    } else {
      const { data: newTpl, error } = await db
        .from("templates")
        .insert({ org_id: orgId, name: ct.name, definition: templateDef })
        .select("id")
        .single();
      if (error || !newTpl) throw new Error(`Failed to create template ${ct.name}: ${error?.message}`);
      templateId = (newTpl as any).id as string;
    }

    // Upsert client type
    let ctId: string;
    const { data: existingCt } = await db
      .from("client_types")
      .select("id")
      .eq("org_id", orgId)
      .eq("name", ct.name)
      .limit(1)
      .maybeSingle();

    if (existingCt) {
      await db.from("client_types").update({ default_template_id: templateId, description: ct.description }).eq("id", existingCt.id);
      ctId = existingCt.id as string;
    } else {
      const { data: newCt, error } = await db
        .from("client_types")
        .insert({ org_id: orgId, name: ct.name, description: ct.description, default_template_id: templateId })
        .select("id")
        .single();
      if (error || !newCt) throw new Error(`Failed to create client type ${ct.name}: ${error?.message}`);
      ctId = (newCt as any).id as string;
    }

    clientTypeIdByName[ct.name] = ctId;
    console.log(`✓ Client type + template: "${ct.name}" (ct:${ctId}, tpl:${templateId})`);
  }

  // 4) Create the event
  let eventId: string;
  const { data: existingEvent } = await db
    .from("events")
    .select("id")
    .eq("org_id", orgId)
    .ilike("name", "DreamHack Dallas%")
    .limit(1)
    .maybeSingle();

  if (existingEvent) {
    eventId = existingEvent.id as string;
    await db.from("events").update({ end_date: eventEndDate, status: "planning" }).eq("id", eventId);
    console.log(`✓ Event already exists, updated end_date: ${eventEndDate}`);
  } else {
    const { data: newEv, error } = await db
      .from("events")
      .insert({ org_id: orgId, name: "DreamHack Dallas 2026", end_date: eventEndDate, location: "Dallas, TX", status: "planning" })
      .select("id")
      .single();
    if (error || !newEv) throw new Error("Failed to create event: " + error?.message);
    eventId = (newEv as any).id as string;
    console.log(`✓ Event: "DreamHack Dallas 2026" (${eventId}), ends ${eventEndDate}`);
  }

  // 5) Seed exhibitors
  let created = 0;
  let skipped = 0;

  // Track which exhibitors get special states for demo
  const awaitingReviewExhibitors = new Set(["razer@demo-exhibitor.io", "acme@demo-exhibitor.io"]);
  const rejectedExhibitors = new Set(["corsair@demo-exhibitor.io"]);
  const phase1FilledExhibitors = new Set([
    "nordic@demo-exhibitor.io", "boothcraft@demo-exhibitor.io",
    "hyperx@demo-exhibitor.io", "logitech@demo-exhibitor.io",
    "datastream@demo-exhibitor.io",
  ]);

  for (const exhibitor of FAKE_EXHIBITORS) {
    const ctId = clientTypeIdByName[exhibitor.type];
    if (!ctId) { console.warn(`  ! Unknown type: ${exhibitor.type}`); continue; }

    const ctDef = CLIENT_TYPES.find((c) => c.name === exhibitor.type)!;

    // Get template
    const { data: ctRow } = await db.from("client_types").select("default_template_id").eq("id", ctId).single();
    const templateId = (ctRow as any)?.default_template_id;
    if (!templateId) { console.warn(`  ! No template for ${exhibitor.type}`); continue; }

    // Check if onboarding already exists
    const { data: existingOb } = await db
      .from("onboardings")
      .select("id")
      .eq("org_id", orgId)
      .eq("event_id", eventId)
      .eq("client_type_id", ctId)
      .in("status", ["draft", "sent", "in_progress", "submitted", "locked"])
      .limit(1)
      .maybeSingle();

    // Check by email too
    const { data: existingClient } = await db
      .from("clients")
      .select("id")
      .eq("org_id", orgId)
      .eq("email", exhibitor.email)
      .limit(1)
      .maybeSingle();

    if (existingClient) {
      const { data: existingObByClient } = await db
        .from("onboardings")
        .select("id")
        .eq("org_id", orgId)
        .eq("event_id", eventId)
        .eq("client_id", existingClient.id)
        .limit(1)
        .maybeSingle();
      if (existingObByClient) { skipped++; continue; }
    }

    // Upsert client
    let clientId: string;
    if (existingClient) {
      clientId = existingClient.id as string;
    } else {
      const { data: newClient, error } = await db
        .from("clients")
        .insert({ org_id: orgId, email: exhibitor.email, full_name: exhibitor.name })
        .select("id")
        .single();
      if (error || !newClient) { console.warn(`  ! Failed to create client ${exhibitor.name}: ${error?.message}`); continue; }
      clientId = (newClient as any).id as string;
    }

    // Create onboarding
    const token = randomUUID();
    const { data: ob, error: obErr } = await db
      .from("onboardings")
      .insert({
        org_id: orgId,
        client_id: clientId,
        template_id: templateId,
        title: `${exhibitor.name} — DreamHack Dallas 2026`,
        status: "sent",
        client_token: token,
        event_id: eventId,
        client_type_id: ctId,
        created_by_user_id: "91c7ecfd-f5b3-4f5b-ad95-2fa585c6bd0f",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (obErr || !ob) { console.warn(`  ! Failed to create onboarding for ${exhibitor.name}: ${obErr?.message}`); continue; }
    const obId = (ob as any).id as string;

    // Create requirements from template
    const { data: tplRow } = await db.from("templates").select("definition").eq("id", templateId).single();
    const def = (tplRow as any)?.definition as any;
    const reqs: any[] = def?.requirements ?? [];
    const now = new Date().toISOString();

    const reqInserts = reqs.map((r: any, idx: number) => ({
      org_id: orgId,
      onboarding_id: obId,
      type: r.type ?? "text",
      label: r.label ?? `Field ${idx + 1}`,
      is_required: r.type === "heading" ? false : Boolean(r.is_required),
      sort_order: Number(r.sort_order ?? idx),
      phase_number: r.phase ?? null,
      options: r.options ?? null,
      created_at: now,
      updated_at: now,
    }));

    const { data: insertedReqs } = await db.from("onboarding_requirements").insert(reqInserts).select("id, label, phase_number, type");

    // Create phase rows
    const phaseDefs: any[] = def?.phases ?? [];
    const phaseInserts = phaseDefs.map((p: any, idx: number) => {
      const d = new Date(eventEndDate);
      d.setDate(d.getDate() + p.default_deadline_offset_days);
      return {
        org_id: orgId,
        onboarding_id: obId,
        phase_number: p.number,
        name: p.name,
        deadline: d.toISOString().split("T")[0],
        status: idx === 0 ? "in_progress" : "locked",
        created_at: now,
        updated_at: now,
      };
    });
    await db.from("onboarding_phases").insert(phaseInserts);

    // Special demo states
    const isAwaiting = awaitingReviewExhibitors.has(exhibitor.email);
    const isRejected = rejectedExhibitors.has(exhibitor.email);
    const isPreFilled = phase1FilledExhibitors.has(exhibitor.email) || isAwaiting || isRejected;

    if (isPreFilled && insertedReqs) {
      // Fill in Phase 1 answers for this exhibitor
      const phase1Reqs = (insertedReqs as any[]).filter((r) => r.phase_number === 1 && r.type !== "heading");
      for (const req of phase1Reqs) {
        await db.from("onboarding_requirements").update({
          value_text: `Demo answer for ${req.label}`,
          updated_at: now,
        }).eq("id", req.id);
      }
    }

    if (isAwaiting && phaseInserts.length > 0) {
      await db.from("onboarding_phases")
        .update({ status: "awaiting_review", updated_at: now })
        .eq("onboarding_id", obId)
        .eq("phase_number", 1);
    }

    if (isRejected && phaseInserts.length > 0) {
      await db.from("onboarding_phases")
        .update({ status: "rejected", reviewer_note: "Please provide a higher resolution version of your branding assets and re-upload the insurance certificate.", updated_at: now })
        .eq("onboarding_id", obId)
        .eq("phase_number", 1);

      // Flag some requirements as needs_revision
      if (insertedReqs) {
        const toFlag = (insertedReqs as any[]).filter((r) => r.phase_number === 1 && r.type === "file").slice(0, 1);
        for (const req of toFlag) {
          await db.from("onboarding_requirements").update({
            review_status: "needs_revision",
            reviewer_comment: "Please re-upload in a higher quality format.",
            updated_at: now,
          }).eq("id", req.id);
        }
      }
    }

    created++;
    process.stdout.write(`  ✓ ${exhibitor.name} (${exhibitor.type})${isAwaiting ? " [awaiting_review]" : isRejected ? " [rejected]" : isPreFilled ? " [pre-filled]" : ""}\n`);
  }

  console.log(`\n✅ Done. Created ${created} exhibitors, skipped ${skipped} (already existed).`);
  console.log(`\nPortal links use token stored in onboardings.client_token`);
  console.log(`Dashboard: /dashboard/onboardings?tab=bulk`);
  console.log(`Events: /dashboard/events/${eventId}`);
}

main().catch((e) => {
  console.error("\n❌ Seed failed:", e.message || e);
  process.exit(1);
});
