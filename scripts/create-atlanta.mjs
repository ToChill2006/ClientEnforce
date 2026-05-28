import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";

function id() { return Math.random().toString(36).slice(2, 10); }

const ATLANTA_GUIDE = {
  title: "DreamHack Atlanta 2026 — Exhibitor Guide",
  hero_image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&q=80",
  intro: "Welcome to DreamHack Atlanta 2026! This guide contains everything you need to know as an exhibitor — venue details, schedules, deadlines, credentials, and rules. Please read it in full before move-in.",
  sections: [

    { id: id(), type: "heading", title: "Changelog" },
    {
      id: id(), type: "table",
      title: "Live Document — Last Updated",
      headers: ["Date", "Change"],
      rows: [
        ["May 20, 2026", "Initial guide published"],
        ["Jun 2, 2026",  "STS deadline dates updated"],
        ["Jun 15, 2026", "Added credential pick-up times"],
      ]
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Venue & STS Venue Services" },
    {
      id: id(), type: "text",
      title: "Venue",
      content: "Georgia World Congress Center (GWCC)\n285 Andrew Young International Blvd NW\nAtlanta, GA 30313\n\nHall C — Exhibitor Hall"
    },
    {
      id: id(), type: "text",
      title: "STS Venue Services",
      content: "STS is the official venue services and logistics partner for DreamHack Atlanta 2026. All booth furniture, electrical, carpet, and freight orders must be placed through STS.\n\nSTS Service Desk will be located at the entrance of Hall C during all move-in and move-out days."
    },
    {
      id: id(), type: "info_box",
      title: "WiFi — Exhibitor Network",
      content: "Network: DreamHack-EXH-2026\nPassword: Will be distributed at credential pickup\n\nNote: Exhibitor WiFi is for operational use only. Do not share with festival attendees.",
      color: "blue"
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Key Contacts" },
    {
      id: id(), type: "table",
      title: "Communication Directory",
      headers: ["Role", "Name / Contact", "Notes"],
      rows: [
        ["STS Venue Services", "sts-atlanta@stsexpo.com\n+1 (404) 555-0190", "Booth furniture, electrical, carpet, freight"],
        ["DreamHack Exhibitor POC", "exhibitors@dreamhack.com", "All exhibitor onboarding & compliance questions"],
        ["EXPO Command Center", "+1 (404) 555-0199", "On-site only — move-in & festival days"],
        ["Security / Lost & Found", "security@gwcc.com", "+1 (404) 555-0180"],
      ]
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Move In" },
    {
      id: id(), type: "table",
      title: "Move-In Schedule",
      headers: ["Date", "Who", "Hours"],
      rows: [
        ["Friday, Nov 13", "Large booths (20×20+) only", "8:00 AM – 8:00 PM"],
        ["Saturday, Nov 14", "All exhibitors", "8:00 AM – 8:00 PM"],
        ["Sunday, Nov 15", "All exhibitors (completion)", "8:00 AM – 12:00 PM"],
        ["Sunday, Nov 15", "STS decorator deadline", "12:00 PM"],
        ["Sunday, Nov 15", "Final walk-through by DH staff", "2:00 PM – 4:00 PM"],
      ]
    },
    {
      id: id(), type: "info_box",
      title: "Move-In Rules",
      content: "• All vehicles must use the loading dock entrance on Centennial Olympic Park Drive.\n• Forklifts are available from STS — advance booking required.\n• Booth must be exhibit-ready by Sunday 12:00 PM. Unfinished booths risk removal.\n• Keep aisles clear at all times during installation.",
      color: "yellow"
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Festival Dates & Opening Hours" },
    {
      id: id(), type: "table",
      title: "Festival Schedule",
      headers: ["Date", "Festival Hours", "Exhibitor Hall Hours", "Exhibitor Access"],
      rows: [
        ["Sunday, Nov 15",  "—",                "—",              "Setup only — hall not open to public"],
        ["Monday, Nov 16",  "12:00 PM – 9:00 PM", "12:00 PM – 9:00 PM", "From 10:00 AM"],
        ["Tuesday, Nov 17", "10:00 AM – 9:00 PM", "10:00 AM – 9:00 PM", "From 9:00 AM"],
        ["Wednesday, Nov 18","10:00 AM – 9:00 PM","10:00 AM – 9:00 PM", "From 9:00 AM"],
        ["Thursday, Nov 19", "10:00 AM – 6:00 PM","10:00 AM – 6:00 PM", "From 9:00 AM"],
      ]
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Move Out" },
    {
      id: id(), type: "table",
      title: "Move-Out Schedule",
      headers: ["Date", "Who", "Hours"],
      rows: [
        ["Thursday, Nov 19", "All exhibitors", "6:00 PM – 11:59 PM"],
        ["Friday, Nov 20",   "All exhibitors", "8:00 AM – 5:00 PM"],
        ["Friday, Nov 20",   "All freight must be out", "5:00 PM"],
      ]
    },
    {
      id: id(), type: "info_box",
      title: "Abandonment Policy",
      content: "Any materials, fixtures, or equipment left in the hall after Friday 5:00 PM will be treated as abandoned and disposed of at the exhibitor's cost. DreamHack and GWCC accept no liability for abandoned property.",
      color: "red"
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Deadlines" },
    {
      id: id(), type: "table",
      title: "DreamHack Exhibitor Deadlines",
      headers: ["Date", "Item", "Notes"],
      rows: [
        ["Aug 30, 2026",  "All onboarding phases complete",         "Including insurance, media assets & agreements"],
        ["Sep 15, 2026",  "Booth design approval",                  "Submit floor plan to exhibitors@dreamhack.com"],
        ["Sep 30, 2026",  "Media kit submission",                   "Logos, descriptions for the DH website & app"],
        ["Oct 15, 2026",  "Staffing list submitted",                "Names for credential issuance"],
        ["Oct 31, 2026",  "Promotional item approval",              "All giveaways must be pre-approved"],
        ["Nov 7, 2026",   "Final exhibitor brief confirmation",     "Respond to DH team email to confirm readiness"],
      ]
    },
    {
      id: id(), type: "table",
      title: "STS Venue Services Deadlines",
      headers: ["Date", "Item"],
      rows: [
        ["Sep 5, 2026",  "Early-bird discount deadline — booth furniture & carpet"],
        ["Oct 1, 2026",  "Standard order deadline"],
        ["Oct 20, 2026", "Electrical order deadline"],
        ["Nov 1, 2026",  "Freight advance warehouse receiving opens"],
        ["Nov 10, 2026", "Advance warehouse receiving closes"],
      ]
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Credentials & Access" },
    {
      id: id(), type: "text",
      title: "Exhibitor Wristbands",
      content: "Each exhibitor company receives wristbands based on booth size:\n• 10×10 booth: 4 exhibitor wristbands\n• 10×20 booth: 6 exhibitor wristbands\n• 20×20 booth: 10 exhibitor wristbands\n• 20×40+ booth: 16 exhibitor wristbands + 2 VIP\n\nAdditional wristbands can be purchased at cost. Contact exhibitors@dreamhack.com."
    },
    {
      id: id(), type: "table",
      title: "Credential Pick-Up",
      headers: ["Date", "Time", "Location"],
      rows: [
        ["Saturday, Nov 14", "9:00 AM – 6:00 PM", "GWCC Hall C — Exhibitor Registration Desk"],
        ["Sunday, Nov 15",   "8:00 AM – 2:00 PM", "GWCC Hall C — Exhibitor Registration Desk"],
      ]
    },
    {
      id: id(), type: "info_box",
      title: "Badge Policy",
      content: "Exhibitor badges and wristbands must be worn visibly at all times on the show floor.\n\nBadges are non-transferable. Lost badges will be replaced at $25 each.\n\nAll staff listed in your staffing submission will receive a named badge. Walk-in credential requests are not guaranteed.",
      color: "blue"
    },

    { id: id(), type: "divider" },
    { id: id(), type: "heading", title: "Rules & Guidelines" },
    {
      id: id(), type: "info_box", title: "Show Lighting",
      content: "Exhibitors may use standard lighting within their booth space. Any lighting that extends beyond booth boundaries, creates strobing effects, or could be distracting to adjacent exhibitors must be pre-approved by DreamHack.\n\nLasers are strictly prohibited unless approved in writing.",
      color: "blue"
    },
    {
      id: id(), type: "info_box", title: "Speakers & Audio",
      content: "Sound levels must remain below 85 dB measured at the aisle edge of your booth. DreamHack staff will monitor noise levels throughout the event and may ask you to lower volume.\n\nSubwoofers must be pre-approved. Sound that bleeds into adjacent booths is not permitted.",
      color: "blue"
    },
    {
      id: id(), type: "info_box", title: "All Ages Policy",
      content: "DreamHack Atlanta is an all-ages event. All materials, demos, signage, and promotional items must be appropriate for all audiences including children.\n\nGames rated M (Mature) may be shown only on screens that are clearly signed as 17+ content and placed such that they are not visible from the main aisle without entering the booth.",
      color: "yellow"
    },
    {
      id: id(), type: "info_box", title: "Attire & Conduct",
      content: "All booth staff must wear appropriate attire throughout the event. DreamHack enforces a strict no-cosplay-that-conflicts-with-festival-IP policy.\n\nHarassment of any attendee or fellow exhibitor will result in immediate credential revocation without refund.",
      color: "yellow"
    },
    {
      id: id(), type: "info_box", title: "Giveaways & Promotions",
      content: "All giveaway items must be submitted for approval by October 31, 2026. Unapproved promotional items may not be distributed on the show floor.\n\nFood and beverage distribution requires a special permit from GWCC. Contact the STS desk to arrange.",
      color: "green"
    },
    {
      id: id(), type: "info_box", title: "Health & Safety",
      content: "Fire exits must remain unobstructed at all times. No exhibit elements may exceed the designated booth footprint height limit of 12 feet without written DreamHack approval.\n\nA first aid station is located at the north entrance of Hall C. In an emergency call GWCC Security at +1 (404) 555-0180.",
      color: "red"
    },
  ]
};

// Create Atlanta event
const now = new Date().toISOString();
const { data: atlantaEvent, error: createErr } = await sb.from("events").insert({
  org_id: ORG_ID,
  name: "DreamHack Atlanta 2026",
  status: "planning",
  start_date: "2026-11-16",
  end_date: "2026-11-19",
  location: "Georgia World Congress Center, Atlanta, GA",
  submission_deadline: "2026-08-30",
  exhibitor_guide: ATLANTA_GUIDE,
  created_at: now,
  updated_at: now,
}).select("id, name").single();

if (createErr) {
  console.error("Failed to create Atlanta event:", createErr.message);
  process.exit(1);
}

console.log(`Created Atlanta event: ${atlantaEvent.id} — ${atlantaEvent.name}`);
console.log(`Guide URL: /guide/${atlantaEvent.id}`);
