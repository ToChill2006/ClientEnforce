import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ORG_ID    = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";
const BIRMINGHAM = "92e04f05-5c33-47fa-82bf-300a3ec3653d";
const STOCKHOLM  = "6424ad57-a95c-4b74-a6ed-6f7854bb23d7";
const NOW = new Date().toISOString();

// ─── Realistic exhibitor data ────────────────────────────────────────────────

const EXHIBITOR_DATA = {
  // Birmingham
  "James Fletcher":    { first:"James",     last:"Fletcher",    title:"Head of Partnerships",    phone:"+44 7700 900123", company:"Midlands Gaming Co",     address:"14 Broad Street",          city:"Birmingham", state:"West Midlands", zip:"B1 2JE",  country:"United Kingdom", vat:"GB123456789", legal:"Midlands Gaming Co Ltd",        invoice_name:"Rachel Fletcher",  invoice_email:"accounts@midlandsgaming.co.uk",  package:"Gold Exhibitor",  value:"12500", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Sophie Turner":     { first:"Sophie",    last:"Turner",      title:"Marketing Director",      phone:"+44 7700 900124", company:"Iron Gaming UK",          address:"22 Corporation Street",    city:"Birmingham", state:"West Midlands", zip:"B2 4RQ",  country:"United Kingdom", vat:"GB234567890", legal:"Iron Gaming UK Limited",        invoice_name:"Tom Briggs",       invoice_email:"finance@irongaming.co.uk",       package:"Silver Exhibitor", value:"8000",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Oliver Bennett":    { first:"Oliver",    last:"Bennett",     title:"CEO",                     phone:"+44 7700 900125", company:"Brumgear Tech",           address:"5 Colmore Row",            city:"Birmingham", state:"West Midlands", zip:"B3 2BJ",  country:"United Kingdom", vat:"GB345678901", legal:"Brumgear Technologies Ltd",     invoice_name:"Priya Rajan",      invoice_email:"ap@brumgear.co.uk",              package:"Gold Exhibitor",  value:"12500", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Charlotte Hughes":  { first:"Charlotte", last:"Hughes",      title:"Sponsorship Manager",     phone:"+44 7700 900126", company:"PixelBridge Studios",     address:"89 New Street",            city:"Birmingham", state:"West Midlands", zip:"B2 5QL",  country:"United Kingdom", vat:"GB456789012", legal:"PixelBridge Studios Ltd",       invoice_name:"Alex Moore",       invoice_email:"billing@pixelbridge.co.uk",      package:"Platinum Exhibitor",value:"22000", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Harry Patel":       { first:"Harry",     last:"Patel",       title:"Business Development",    phone:"+44 7700 900127", company:"Apex Esports UK",         address:"12 Temple Row",            city:"Birmingham", state:"West Midlands", zip:"B2 5LG",  country:"United Kingdom", vat:"GB567890123", legal:"Apex Esports UK Ltd",           invoice_name:"Nisha Patel",      invoice_email:"finance@apexesports.co.uk",      package:"Silver Exhibitor", value:"8000",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Emily Clarke":      { first:"Emily",     last:"Clarke",      title:"Events Coordinator",      phone:"+44 7700 900128", company:"BullRing Interactive",    address:"33 High Street",           city:"Birmingham", state:"West Midlands", zip:"B4 7SL",  country:"United Kingdom", vat:"",            legal:"BullRing Interactive Ltd",      invoice_name:"James Yates",      invoice_email:"accounts@bullringinteractive.co.uk", package:"Bronze Exhibitor",value:"4500",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Liam Morrison":     { first:"Liam",      last:"Morrison",    title:"Sales Manager",           phone:"+44 7700 900129", company:"Forge Gaming Hardware",   address:"7 Brindleyplace",          city:"Birmingham", state:"West Midlands", zip:"B1 2JB",  country:"United Kingdom", vat:"GB678901234", legal:"Forge Gaming Hardware Ltd",     invoice_name:"Sara Hill",        invoice_email:"billing@forgegaming.co.uk",      package:"Gold Exhibitor",  value:"12500", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Isla Thompson":     { first:"Isla",      last:"Thompson",    title:"Brand Partnerships Lead", phone:"+44 7700 900130", company:"Midlands Esports Arena",  address:"15 Snow Hill",             city:"Birmingham", state:"West Midlands", zip:"B4 6JE",  country:"United Kingdom", vat:"GB789012345", legal:"Midlands Esports Arena Ltd",    invoice_name:"Tom Davis",        invoice_email:"finance@midlandsesports.co.uk",  package:"Silver Exhibitor", value:"8000",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Noah Williams":     { first:"Noah",      last:"Williams",    title:"Founder",                 phone:"+44 7700 900131", company:"Cadent Peripherals",      address:"28 Queensway",             city:"Birmingham", state:"West Midlands", zip:"B1 1RN",  country:"United Kingdom", vat:"GB890123456", legal:"Cadent Peripherals Ltd",        invoice_name:"Ben Clarke",       invoice_email:"accounts@cadentperipherals.co.uk", package:"Bronze Exhibitor",value:"4500",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Grace Robinson":    { first:"Grace",     last:"Robinson",    title:"Marketing Manager",       phone:"+44 7700 900132", company:"Black Country Studios",   address:"3 Centenary Square",       city:"Birmingham", state:"West Midlands", zip:"B1 2EP",  country:"United Kingdom", vat:"",            legal:"Black Country Studios Ltd",     invoice_name:"Will Hunt",        invoice_email:"billing@blackcountrystudios.co.uk", package:"Silver Exhibitor",value:"8000",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Jack Davies":       { first:"Jack",      last:"Davies",      title:"Co-Founder",              phone:"+44 7700 900133", company:"Canopy Esports",          address:"44 Broad Street",          city:"Birmingham", state:"West Midlands", zip:"B1 2HF",  country:"United Kingdom", vat:"GB901234567", legal:"Canopy Esports Ltd",            invoice_name:"Amy Cross",        invoice_email:"ap@canopyesports.co.uk",         package:"Gold Exhibitor",  value:"12500", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Mia Evans":         { first:"Mia",       last:"Evans",       title:"Account Executive",       phone:"+44 7700 900134", company:"Spark Gaming Tech",       address:"11 Victoria Square",       city:"Birmingham", state:"West Midlands", zip:"B2 4DX",  country:"United Kingdom", vat:"",            legal:"Spark Gaming Technologies Ltd", invoice_name:"Luke Evans",       invoice_email:"finance@sparkgamingtech.co.uk",  package:"Bronze Exhibitor",value:"4500",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Ethan Wilson":      { first:"Ethan",     last:"Wilson",      title:"Director of Operations",  phone:"+44 7700 900135", company:"Hexagon Game Works",      address:"6 Edmund Street",          city:"Birmingham", state:"West Midlands", zip:"B3 2HJ",  country:"United Kingdom", vat:"GB012345678", legal:"Hexagon Game Works Ltd",        invoice_name:"Emma Gray",        invoice_email:"accounts@hexagongameworks.co.uk",package:"Silver Exhibitor", value:"8000",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  // Stockholm
  "Erik Lindqvist":    { first:"Erik",      last:"Lindqvist",   title:"Head of Partnerships",    phone:"+46 70 123 4567", company:"Nordic Gaming AB",        address:"Drottninggatan 12",        city:"Stockholm",  state:"Stockholm County", zip:"111 51", country:"Sweden",         vat:"SE556123456701", legal:"Nordic Gaming AB",             invoice_name:"Maja Svensson",    invoice_email:"ekonomi@nordicgaming.se",        package:"Platinum Exhibitor",value:"18000", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Anna Svensson":     { first:"Anna",      last:"Svensson",    title:"Marketing Director",      phone:"+46 70 234 5678", company:"PixelStorm Studios",      address:"Sveavägen 44",             city:"Stockholm",  state:"Stockholm County", zip:"111 34", country:"Sweden",         vat:"SE556234567802", legal:"PixelStorm Studios AB",        invoice_name:"Lars Nilsson",     invoice_email:"faktura@pixelstorm.se",          package:"Gold Exhibitor",  value:"12000", payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Marcus Johansson":  { first:"Marcus",    last:"Johansson",   title:"CEO",                     phone:"+46 70 345 6789", company:"Frostbyte Interactive",   address:"Kungsgatan 55",            city:"Stockholm",  state:"Stockholm County", zip:"111 22", country:"Sweden",         vat:"SE556345678903", legal:"Frostbyte Interactive AB",     invoice_name:"Elin Berg",        invoice_email:"accounts@frostbyte.se",          package:"Gold Exhibitor",  value:"12000", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Sofia Andersson":   { first:"Sofia",     last:"Andersson",   title:"Sponsorship Manager",     phone:"+46 70 456 7890", company:"Hyperion Esports",        address:"Birger Jarlsgatan 7",      city:"Stockholm",  state:"Stockholm County", zip:"114 34", country:"Sweden",         vat:"SE556456789004", legal:"Hyperion Esports AB",          invoice_name:"Tobias Ek",        invoice_email:"billing@hyperionesports.se",     package:"Silver Exhibitor", value:"7500",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Johan Karlsson":    { first:"Johan",     last:"Karlsson",    title:"Business Development",    phone:"+46 70 567 8901", company:"Arctic Code Labs",        address:"Stureplan 2",              city:"Stockholm",  state:"Stockholm County", zip:"114 46", country:"Sweden",         vat:"SE556567890105", legal:"Arctic Code Labs AB",          invoice_name:"Sara Holm",        invoice_email:"ekonomi@arcticcode.se",          package:"Silver Exhibitor", value:"7500",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Maja Nilsson":      { first:"Maja",      last:"Nilsson",     title:"Events Coordinator",      phone:"+46 70 678 9012", company:"Vikingame Technologies",  address:"Hamngatan 33",             city:"Stockholm",  state:"Stockholm County", zip:"111 47", country:"Sweden",         vat:"",               legal:"Vikingame Technologies AB",    invoice_name:"Oscar Strand",     invoice_email:"faktura@vikingame.se",           package:"Bronze Exhibitor",value:"4000",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Oskar Eriksson":    { first:"Oskar",     last:"Eriksson",    title:"Sales Manager",           phone:"+46 70 789 0123", company:"Snowflake Gaming",        address:"Kungsholmsgatan 15",       city:"Stockholm",  state:"Stockholm County", zip:"112 27", country:"Sweden",         vat:"SE556789012307", legal:"Snowflake Gaming AB",          invoice_name:"Frida Lund",       invoice_email:"billing@snowflakegaming.se",     package:"Gold Exhibitor",  value:"12000", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Linnea Berg":       { first:"Linnea",    last:"Berg",        title:"Brand Partnerships Lead", phone:"+46 70 890 1234", company:"Aurora Peripherals",      address:"Odengatan 62",             city:"Stockholm",  state:"Stockholm County", zip:"113 22", country:"Sweden",         vat:"SE556890123408", legal:"Aurora Peripherals AB",        invoice_name:"Axel Grön",        invoice_email:"ekonomi@auroraperipherals.se",   package:"Silver Exhibitor", value:"7500",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Fredrik Larsson":   { first:"Fredrik",   last:"Larsson",     title:"Founder",                 phone:"+46 70 901 2345", company:"Scandinavian Servers",    address:"Vasagatan 22",             city:"Stockholm",  state:"Stockholm County", zip:"101 20", country:"Sweden",         vat:"SE556901234509", legal:"Scandinavian Servers AB",      invoice_name:"Johanna Åberg",    invoice_email:"faktura@scandinavianservers.se", package:"Bronze Exhibitor",value:"4000",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Ida Holm":          { first:"Ida",       last:"Holm",        title:"Co-Founder",              phone:"+46 70 012 3456", company:"Northlight Studios",      address:"Lidingövägen 4",           city:"Stockholm",  state:"Stockholm County", zip:"115 25", country:"Sweden",         vat:"SE556012345610", legal:"Northlight Studios AB",        invoice_name:"Per Lindberg",     invoice_email:"billing@northlightstudios.se",   package:"Gold Exhibitor",  value:"12000", payment_terms:"Net 30", w9:"W-8BEN (Non-US entity)", payment_method:"Bank Transfer" },
  "Bjorn Strand":      { first:"Björn",     last:"Strand",      title:"Account Executive",       phone:"+46 70 123 5555", company:"Midnight Sun Gaming",     address:"Fleminggatan 18",          city:"Stockholm",  state:"Stockholm County", zip:"112 26", country:"Sweden",         vat:"",               legal:"Midnight Sun Gaming AB",       invoice_name:"Lisa Mattsson",    invoice_email:"ekonomi@midnightsun.se",         package:"Bronze Exhibitor",value:"4000",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Klara Nyström":     { first:"Klara",     last:"Nyström",     title:"Director of Operations",  phone:"+46 70 234 6666", company:"Polar Esports Gear",      address:"Hornsgatan 51",            city:"Stockholm",  state:"Stockholm County", zip:"118 49", country:"Sweden",         vat:"SE556234666711", legal:"Polar Esports Gear AB",        invoice_name:"Carl Eng",         invoice_email:"accounts@polaresports.se",       package:"Silver Exhibitor", value:"7500",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Emil Wallin":       { first:"Emil",      last:"Wallin",      title:"Marketing Manager",       phone:"+46 70 345 7777", company:"Stockholm Byte",          address:"Götgatan 78",              city:"Stockholm",  state:"Stockholm County", zip:"118 30", country:"Sweden",         vat:"",               legal:"Stockholm Byte AB",            invoice_name:"Hanna Löf",        invoice_email:"faktura@stockholmbyte.se",       package:"Bronze Exhibitor",value:"4000",  payment_terms:"Upfront",w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
  "Hanna Gustafsson":  { first:"Hanna",     last:"Gustafsson",  title:"Account Manager",         phone:"+46 70 456 8888", company:"CryoTech Peripherals",    address:"Ringvägen 100",            city:"Stockholm",  state:"Stockholm County", zip:"118 60", country:"Sweden",         vat:"SE556456888812", legal:"CryoTech Peripherals AB",      invoice_name:"Daniel Ros",       invoice_email:"billing@cryotech.se",            package:"Silver Exhibitor", value:"7500",  payment_terms:"Net 14", w9:"W-8BEN (Non-US entity)", payment_method:"Credit Card" },
};

// ─── Status assignment ────────────────────────────────────────────────────────
// BHX: completed=4, awaiting_review=3, in_progress=4, rejected=3, draft=6
// STK: completed=4, awaiting_review=3, in_progress=4, rejected=3, draft=6

const BHX_COMPLETED      = ["James Fletcher","Sophie Turner","Oliver Bennett","Charlotte Hughes"];
const BHX_AWAIT_REVIEW   = ["Harry Patel","Emily Clarke","Liam Morrison"];
const BHX_IN_PROGRESS    = ["Isla Thompson","Noah Williams","Jack Davies","Sebastian Hall"];
const BHX_REJECTED       = ["Grace Robinson","Mia Evans","Ethan Wilson"];
// rest are draft

const STK_COMPLETED      = ["Erik Lindqvist","Anna Svensson","Marcus Johansson","Sofia Andersson"];
const STK_AWAIT_REVIEW   = ["Johan Karlsson","Maja Nilsson","Oskar Eriksson"];
const STK_IN_PROGRESS    = ["Linnea Berg","Fredrik Larsson","Ida Holm","Bjorn Strand"];
const STK_REJECTED       = ["Klara Nyström","Emil Wallin","Hanna Gustafsson"];

function getCategory(name) {
  if (BHX_COMPLETED.includes(name) || STK_COMPLETED.includes(name))    return "completed";
  if (BHX_AWAIT_REVIEW.includes(name) || STK_AWAIT_REVIEW.includes(name)) return "awaiting_review";
  if (BHX_IN_PROGRESS.includes(name) || STK_IN_PROGRESS.includes(name)) return "in_progress";
  if (BHX_REJECTED.includes(name) || STK_REJECTED.includes(name))      return "rejected";
  return "draft";
}

// ─── Requirement value helpers ────────────────────────────────────────────────
function fillReq(r, d, category, phaseDone) {
  if (!d) return null; // no data for this exhibitor, leave empty
  const lbl = (r.label ?? "").toLowerCase();
  const type = r.type;

  // Phase-based: only fill phases that are done for this category
  const phaseNum = r.phase_number ?? 1;
  if (!phaseDone(phaseNum)) return null;

  if (type === "signature") return { signature_path: `orgs/${ORG_ID}/signatures/${r.onboarding_id}/authorised_sig.png`, completed_at: NOW };
  if (type === "checkbox")  return { value_text: "true", completed_at: NOW };
  if (type === "info")      return null;

  // ph1
  if (lbl.includes("first name"))  return { value_text: d.first, completed_at: NOW };
  if (lbl.includes("last name"))   return { value_text: d.last, completed_at: NOW };
  if (lbl.includes("job title") || lbl.includes("position")) return { value_text: d.title, completed_at: NOW };
  if (lbl.includes("email address") || lbl === "email") return { value_text: d.invoice_email.replace("accounts@","").replace("billing@","").replace("finance@","").replace("ekonomi@","").replace("faktura@",""), completed_at: NOW };
  if (lbl.includes("phone"))       return { value_text: d.phone, completed_at: NOW };
  if (lbl.includes("company") && !lbl.includes("legal") && !lbl.includes("invoice")) return { value_text: d.company, completed_at: NOW };

  // ph2
  if (lbl.includes("legal"))       return { value_text: d.legal, completed_at: NOW };
  if (lbl.includes("registered") || lbl.includes("street") || lbl.includes("address")) return { value_text: d.address, completed_at: NOW };
  if (lbl.includes("city"))        return { value_text: d.city, completed_at: NOW };
  if (lbl.includes("state") || lbl.includes("province") || lbl.includes("county")) return { value_text: d.state, completed_at: NOW };
  if (lbl.includes("postal") || lbl.includes("zip"))  return { value_text: d.zip, completed_at: NOW };
  if (lbl.includes("country"))     return { value_text: d.country, completed_at: NOW };
  if (lbl.includes("vat") || lbl.includes("tax"))     return { value_text: d.vat || "N/A", completed_at: NOW };
  if (lbl.includes("invoice contact name")) return { value_text: d.invoice_name, completed_at: NOW };
  if (lbl.includes("invoice contact email")) return { value_text: d.invoice_email, completed_at: NOW };
  if (lbl.includes("invoice contact phone")) return { value_text: d.phone, completed_at: NOW };

  // ph3
  if (lbl.includes("event name"))  return { value_text: "DreamHack Atlanta 2026", completed_at: NOW };
  if (lbl.includes("sponsorship") || lbl.includes("package")) return { value_text: d.package, completed_at: NOW };
  if (lbl.includes("start date"))  return { value_text: "2026-09-15", completed_at: NOW };
  if (lbl.includes("end date"))    return { value_text: "2026-09-17", completed_at: NOW };
  if (lbl.includes("contract value") || lbl.includes("total")) return { value_text: d.value, completed_at: NOW };
  if (lbl.includes("payment terms")) return { value_text: d.payment_terms, completed_at: NOW };
  if (lbl.includes("additional notes") || lbl.includes("special term")) return { value_text: "", completed_at: NOW };
  if (lbl.includes("w-9") || lbl.includes("w-8")) return { value_text: d.w9, completed_at: NOW };

  // ph4
  if (lbl.includes("payment method")) return { value_text: d.payment_method, completed_at: NOW };
  if (lbl.includes("purchase order") || lbl.includes("po number")) return { value_text: "", completed_at: NOW };
  if (lbl.includes("reference") || lbl.includes("cost centre") || lbl.includes("cost center")) return { value_text: "", completed_at: NOW };
  if (lbl.includes("notes for billing")) return { value_text: "", completed_at: NOW };

  // Birmingham-specific template fields (booth, activities, schedules, guest list)
  if (lbl.includes("booth") || lbl.includes("stand name")) return { value_text: d.company, completed_at: NOW };
  if (lbl.includes("stand size") || lbl.includes("booth size")) return { value_text: "6m x 3m", completed_at: NOW };
  if (lbl.includes("exhibitor badge") || lbl.includes("badge name")) return { value_text: `${d.first} ${d.last}`, completed_at: NOW };
  if (lbl.includes("activity") || lbl.includes("demo") || lbl.includes("programme")) return { value_text: "Live product demonstrations and interactive gaming sessions", completed_at: NOW };
  if (lbl.includes("schedule") || lbl.includes("timing")) return { value_text: "09:00–18:00 daily", completed_at: NOW };
  if (lbl.includes("onsite contact") || lbl.includes("on-site")) return { value_text: `${d.first} ${d.last} — ${d.phone}`, completed_at: NOW };
  if (lbl.includes("guest") || lbl.includes("attendee")) return { value_text: "5", completed_at: NOW };
  if (lbl.includes("file") || lbl.includes("upload") || lbl.includes("logo") || lbl.includes("artwork")) {
    return { file_path: `orgs/${ORG_ID}/uploads/${r.onboarding_id}/artwork.pdf`, completed_at: NOW };
  }

  // Fallback for any remaining required text/textarea
  if (type === "text" || type === "textarea") return { value_text: "Provided", completed_at: NOW };
  if (type === "multiple_choice" || type === "select") return { value_text: "Confirmed", completed_at: NOW };
  return null;
}

function phaseDoneForCategory(category, phaseNum) {
  if (category === "completed")      return true;            // all phases done
  if (category === "awaiting_review") return phaseNum <= 2;   // ph1+ph2 done, ph2 awaiting review
  if (category === "in_progress")    return phaseNum === 1;   // only ph1 partially done
  if (category === "rejected")       return phaseNum === 1;   // ph1 done, then rejected
  return false;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

// 1. Load all onboardings for both events
const { data: allObs } = await sb.from("onboardings")
  .select("id, title, status, event_id, deadline")
  .eq("org_id", ORG_ID);

const demoObs = (allObs ?? []).filter(o => [BIRMINGHAM, STOCKHOLM].includes(o.event_id));
console.log(`Found ${demoObs.length} demo onboardings`);

// Extract name from title like "Bjorn Strand — Stockholm"
function nameFromTitle(title) {
  return title?.split("—")[0]?.trim() ?? "";
}

let reqUpdates = 0, phaseUpdates = 0, obUpdates = 0;

for (const ob of demoObs) {
  const name = nameFromTitle(ob.title);
  const d = EXHIBITOR_DATA[name];
  const category = getCategory(name);
  const phaseDone = (ph) => phaseDoneForCategory(category, ph);

  // 2. Update onboarding status
  const obStatus =
    category === "completed"      ? "completed" :
    category === "awaiting_review"? "submitted" :
    category === "in_progress"    ? "in_progress" :
    category === "rejected"       ? "in_progress" :
    "draft";

  if (obStatus !== ob.status) {
    await sb.from("onboardings").update({ status: obStatus, updated_at: NOW }).eq("id", ob.id);
    obUpdates++;
  }

  // 3. Load and update phases
  const { data: phases } = await sb.from("onboarding_phases")
    .select("id, phase_number, status")
    .eq("onboarding_id", ob.id)
    .order("phase_number");

  for (const ph of phases ?? []) {
    let phStatus = "locked";
    if (category === "completed") {
      phStatus = "approved";
    } else if (category === "awaiting_review") {
      if (ph.phase_number === 1) phStatus = "approved";
      else if (ph.phase_number === 2) phStatus = "awaiting_review";
      else phStatus = "locked";
    } else if (category === "in_progress") {
      phStatus = ph.phase_number === 1 ? "in_progress" : "locked";
    } else if (category === "rejected") {
      phStatus = ph.phase_number === 1 ? "rejected" : "locked";
    } else {
      phStatus = ph.phase_number === 1 ? "in_progress" : "locked"; // draft: phase 1 in_progress for portal
    }

    if (phStatus !== ph.status) {
      await sb.from("onboarding_phases").update({ status: phStatus, updated_at: NOW }).eq("id", ph.id);
      phaseUpdates++;
    }
  }

  // 4. Load and update requirements
  const { data: reqs } = await sb.from("onboarding_requirements")
    .select("id, type, label, phase_number, value_text, file_path, signature_path, completed_at, onboarding_id")
    .eq("onboarding_id", ob.id);

  for (const r of reqs ?? []) {
    const update = fillReq(r, d, category, phaseDone);
    if (!update) continue;

    // Only update if not already filled
    const alreadyFilled = r.value_text || r.file_path || r.signature_path || r.completed_at;
    if (alreadyFilled) continue;

    const { error } = await sb.from("onboarding_requirements")
      .update({ ...update, updated_at: NOW })
      .eq("id", r.id);
    if (!error) reqUpdates++;
  }

  process.stdout.write(`  ${category.padEnd(16)} ${name}\n`);
}

console.log(`\n✓ Onboardings: ${obUpdates}, Phases: ${phaseUpdates}, Requirements: ${reqUpdates}`);

// 5. Clear team_messages
const { error: delErr } = await sb.from("team_messages").delete().eq("org_id", ORG_ID);
console.log(`✓ team_messages cleared (err=${delErr?.message ?? "none"})`);

// 6. Update reminder rules to be DreamHack branded
const { data: rules } = await sb.from("reminder_rules").select("id, subject, body, trigger_offset_days, phase_number").eq("org_id", ORG_ID);
console.log(`\nUpdating ${rules?.length} reminder rules...`);

const ruleUpdates = [
  {
    match: (r) => r.trigger_offset_days === 30,
    subject: "30 days to go — complete your DreamHack onboarding",
    body: `Hi {{client_name}},\n\nThis is a reminder that your DreamHack exhibitor onboarding is due in 30 days.\n\nPlease log in to your portal and complete the required information as soon as possible to avoid any delays with your participation.\n\n👉 Access your portal: {{portal_link}}\n\nIf you have any questions, please contact us at exhibitors@dreamhack.com.\n\nBest regards,\nDreamHack Exhibitor Team`,
  },
  {
    match: (r) => r.trigger_offset_days === 21,
    subject: "Reminder: Complete your DreamHack registration — 3 weeks left",
    body: `Hi {{client_name}},\n\nJust 3 weeks until your DreamHack onboarding deadline.\n\nPlease ensure {{phase_name}} is completed on time. Late submissions may affect your booth assignment and access credentials.\n\n👉 Complete your onboarding: {{portal_link}}\n\nQuestions? Reach us at exhibitors@dreamhack.com.\n\nDreamHack Exhibitor Team`,
  },
  {
    match: (r) => r.trigger_offset_days === 14,
    subject: "2 weeks left — action required for your DreamHack submission",
    body: `Hi {{client_name}},\n\n⚠️ Your DreamHack onboarding deadline is in 14 days.\n\n{{phase_name}} must be completed by {{deadline}}. Please log in and submit your information now.\n\n👉 Your portal: {{portal_link}}\n\nFor urgent assistance contact exhibitors@dreamhack.com.\n\nDreamHack Exhibitor Team`,
  },
  {
    match: (r) => r.trigger_offset_days === 7,
    subject: "URGENT: 7 days remaining for your DreamHack submission",
    body: `Hi {{client_name}},\n\n🚨 URGENT: Only 7 days left to complete your DreamHack exhibitor onboarding.\n\n{{phase_name}} is due on {{deadline}}. Failure to submit on time may result in delays to your accreditation and booth setup.\n\n👉 Submit now: {{portal_link}}\n\nImmediate assistance: exhibitors@dreamhack.com\n\nDreamHack Exhibitor Team`,
  },
  {
    match: (r) => r.trigger_offset_days === 5,
    subject: "URGENT: DreamHack deadline in 5 days — final notice",
    body: `Hi {{client_name}},\n\n🚨 FINAL NOTICE: Your DreamHack onboarding deadline is in just 5 days.\n\nIf {{phase_name}} is not completed by {{deadline}}, your exhibitor package may be affected.\n\n👉 Act now: {{portal_link}}\n\nContact us immediately at exhibitors@dreamhack.com if you are experiencing difficulties.\n\nDreamHack Exhibitor Team`,
  },
  {
    match: (r) => r.trigger_offset_days === 3,
    subject: "Action needed: DreamHack deadline in 3 days",
    body: `Hi {{client_name}},\n\nYour DreamHack onboarding is due in 3 days.\n\nPlease complete {{phase_name}} by {{deadline}} to ensure your booth and accreditation are processed on time.\n\n👉 Portal: {{portal_link}}\n\nDreamHack Exhibitor Team | exhibitors@dreamhack.com`,
  },
];

for (const rule of rules ?? []) {
  const match = ruleUpdates.find(u => u.match(rule));
  if (match) {
    await sb.from("reminder_rules").update({ subject: match.subject, body: match.body, updated_at: NOW }).eq("id", rule.id);
    console.log(`  Updated rule: ${match.subject.slice(0,50)}`);
  }
}

// 7. Sync event statuses
for (const evId of [BIRMINGHAM, STOCKHOLM]) {
  const { data: evObs } = await sb.from("onboardings").select("status").eq("event_id", evId);
  const statuses = (evObs ?? []).map(o => o.status);
  const allDone = statuses.every(s => s === "completed");
  const anyActive = statuses.some(s => s !== "draft");
  const evStatus = allDone ? "completed" : anyActive ? "in_progress" : "planning";
  await sb.from("events").update({ status: evStatus, updated_at: NOW }).eq("id", evId);
  console.log(`Event ${evId.slice(0,8)} → ${evStatus}`);
}

console.log("\n✅ Demo data population complete.");
