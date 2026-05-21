// Seed planning board posts for DreamHack Atlanta 2026
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EVENT_ID = "60010a16-f69c-4da5-b535-fd3d62c4b277";
const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";

// Spread posts across the past ~6 weeks
function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const posts = [
  // Pinned alerts / decisions at the top
  {
    body: "🚨 FLOOR PLAN FINALISED — all booth numbers confirmed with GWCC. See the attached layout in Files. No further moves without written approval from Sarah.",
    post_type: "decision",
    priority: "urgent",
    pinned: true,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(2),
  },
  {
    body: "📌 Exhibitor onboarding deadline for Phase 1 is 1 July. Anyone still at 0% progress needs a chaser call this week — check the dashboard filter for 'Not started'.",
    post_type: "alert",
    priority: "high",
    pinned: true,
    author_name: "Thomas Chillman",
    created_at: daysAgo(1),
  },

  // Recent decisions
  {
    body: "Confirmed with STS: all standard booth packages include 1× 13A socket. Exhibitors requesting extra power must submit the electrical form by 15 Aug — added this to the Phase 2 requirements.",
    post_type: "decision",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(3),
  },
  {
    body: "Move-in schedule updated: Hall B exhibitors now start setup Monday 16 Nov from 08:00, Hall A from 12:00. Communicated to all affected onboardings.",
    post_type: "decision",
    priority: "high",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(5),
  },

  // Notes / updates
  {
    body: "Razer have upgraded to a 6×6 island booth — updated their record and flagged for extra power form. Their booth number is now B-12 (was B-08). DM sent to their main contact.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(7),
  },
  {
    body: "NVIDIA confirmed they'll be bringing a live demo rig (RTX 5090 showcase). They'll need a dedicated 32A circuit — chasing venue for availability. Their Phase 2 response mentions 4× 4K monitors and a custom LED backdrop.",
    post_type: "note",
    priority: "high",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(9),
  },
  {
    body: "SteelSeries Phase 1 submitted — reviewed and approved. Clean submission, all required fields complete. Their branding assets are in Files & Signatures.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(10),
  },
  {
    body: "Reminder: wristband allocations are capped at 6 per exhibitor for standard packages, 12 for premium. Several onboardings have requested more — we'll need to flag these as 'to review' before issuing.",
    post_type: "alert",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(12),
  },
  {
    body: "Corsair have swapped their main contact — James Park is out, new contact is Mia Torres (mia.torres@corsair.com). Updated in their client record.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(14),
  },
  {
    body: "Logitech G confirmed they're bringing a full peripherals wall display — requesting forklift access during move-in. Liaising with GWCC on loading dock scheduling.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(16),
  },

  // Older decisions / notes
  {
    body: "DECISION: catering supplier changed from AtlantaEats to Proof of the Pudding (official GWCC preferred vendor). All food & beverage queries to go through them directly. Contract signed.",
    post_type: "decision",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(19),
  },
  {
    body: "Secretlab have submitted Phase 2 — flagged their brand description for revision (exceeded 300 words and included pricing, which isn't allowed in the programme). Sent back for revision.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(21),
  },
  {
    body: "AMD confirmed full island booth B-01 (premium placement, centre of hall). Their build contractor (Exhibit Force, Atlanta) is already registered. Phase 1 complete, Phase 2 in progress.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(24),
  },
  {
    body: "⚠️ Alienware have not responded to 3 emails since onboarding was sent. Escalate to account manager — if no response by end of week, their booth slot may be reallocated.",
    post_type: "alert",
    priority: "urgent",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(27),
  },
  {
    body: "Venue confirmed: wi-fi SSID and passwords for exhibitor network will be distributed at accreditation. We'll add this to the Exhibitor Guide once confirmed.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(30),
  },
  {
    body: "DECISION: all sampling exhibitors must submit allergen information by 1 Sep (8 weeks before event). Updated the Sampling template Phase 2 deadline accordingly.",
    post_type: "decision",
    priority: "high",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(33),
  },
  {
    body: "Initial exhibitor list signed off by DreamHack event director — 20 confirmed exhibitors, 3 on waitlist. Onboarding invites sent to all 20 today.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(40),
  },
];

// Clear existing board posts for this event
const { error: delErr } = await sb.from("event_board_posts").delete().eq("event_id", EVENT_ID);
if (delErr) { console.error("clear error:", delErr.message); }
else { console.log("Cleared existing board posts"); }

// Insert all posts
const rows = posts.map((p) => ({
  event_id: EVENT_ID,
  org_id: ORG_ID,
  body: p.body,
  post_type: p.post_type,
  priority: p.priority,
  pinned: p.pinned,
  author_name: p.author_name,
  created_at: p.created_at,
}));

const { data, error } = await sb.from("event_board_posts").insert(rows).select("id");
if (error) {
  console.error("insert error:", error.message);
} else {
  console.log(`Inserted ${data.length} board posts for DreamHack Atlanta 2026`);
}
