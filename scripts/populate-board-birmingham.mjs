import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EVENT_ID = "92e04f05-5c33-47fa-82bf-300a3ec3653d";
const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const posts = [
  {
    body: "📌 Phase 1 deadline is 15 June — 6 exhibitors still haven't started. Chaser emails scheduled for Monday, follow up with calls if no response by Wednesday.",
    post_type: "alert",
    priority: "high",
    pinned: true,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(1),
  },
  {
    body: "🚨 NEC venue confirmed: all exhibitors with stands over 4m height must submit a structural risk assessment at least 6 weeks before move-in. Added to Phase 2 checklist.",
    post_type: "decision",
    priority: "urgent",
    pinned: true,
    author_name: "Thomas Chillman",
    created_at: daysAgo(3),
  },
  {
    body: "Forge Gaming Hardware upgraded from 3×3 to 6×3 shell scheme — booth number updated to Hall 4, Stand D-14. Invoice raised for the difference.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(4),
  },
  {
    body: "DECISION: exhibitor wristbands capped at 4 per standard stand, 8 per feature stand. Any requests above this need sign-off from the event director.",
    post_type: "decision",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(6),
  },
  {
    body: "Iron Gaming UK Phase 1 approved — fast turnaround, great submission. Their branding guide is clean, no issues. Phase 2 unlocked.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(8),
  },
  {
    body: "⚠️ Vortex Gaming Gear haven't responded since onboarding was sent 3 weeks ago. Two emails bounced — need to verify contact details with their account manager before escalating.",
    post_type: "alert",
    priority: "urgent",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(10),
  },
  {
    body: "NEC catering confirmed: exhibitors can bring own branded confectionery (sealed, pre-packaged only). Hot food prep on-stand is not permitted. Updated the exhibitor guide.",
    post_type: "decision",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(13),
  },
  {
    body: "Midlands Gaming Co have a new main contact — Charlotte Wright (c.wright@midlandsgaming.co.uk). Previous contact left the company. Updated in client record.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(15),
  },
  {
    body: "Move-in schedule confirmed with NEC: Hall 4 exhibitors load-in Friday 10 Oct from 09:00, Hall 5 from 14:00. Teardown Sunday 12 Oct from 18:00. Added to the guide.",
    post_type: "decision",
    priority: "high",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(18),
  },
  {
    body: "Canopy Esports submitted Phase 2 — flagged their booth concept description, it references a product launch that hasn't been publicly announced. Asked them to revise before we use it in the programme.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(21),
  },
  {
    body: "Spark Gaming Tech confirmed they're running hourly prize draws — need a PA system permit from NEC. Chasing venue team, will update once confirmed.",
    post_type: "note",
    priority: "high",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(24),
  },
  {
    body: "DECISION: all exhibitor logos for the event app must be submitted as SVG or PNG (min 500×500px) by 1 Aug. Added as a file upload requirement to Phase 2.",
    post_type: "decision",
    priority: "normal",
    pinned: false,
    author_name: "Thomas Chillman",
    created_at: daysAgo(28),
  },
  {
    body: "Initial Birmingham exhibitor list approved — 20 confirmed, 2 on waitlist. Onboarding invites sent. First deadline set at 15 June for Phase 1.",
    post_type: "note",
    priority: "normal",
    pinned: false,
    author_name: "Sarah Mitchell",
    created_at: daysAgo(35),
  },
];

const { error: delErr } = await sb.from("event_board_posts").delete().eq("event_id", EVENT_ID);
if (delErr) console.error("clear error:", delErr.message);
else console.log("Cleared existing board posts");

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
if (error) console.error("insert error:", error.message);
else console.log(`Inserted ${data.length} board posts for Birmingham`);
