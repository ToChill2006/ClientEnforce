import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ORG_ID = "db240fdf-f555-43b7-8bff-1eebdf0f9f26";
const BIRMINGHAM = "92e04f05-5c33-47fa-82bf-300a3ec3653d";
const STOCKHOLM  = "6424ad57-a95c-4b74-a6ed-6f7854bb23d7";
const ATLANTA    = "60010a16-f69c-4da5-b535-fd3d62c4b277";
const now = new Date().toISOString();

// ─── Shared Phase definitions ─────────────────────────────────────────────────
// Each template has 3 phases, customised per type.

function phases(offsets = [-60, -30, -7]) {
  return [
    { number: 1, name: "New Client Info",  default_deadline_offset_days: offsets[0] },
    { number: 2, name: "Onboarding Info",  default_deadline_offset_days: offsets[1] },
    { number: 3, name: "On-Site Info",     default_deadline_offset_days: offsets[2] },
  ];
}

// ─── Template 1: Retailer ─────────────────────────────────────────────────────
const retailer = {
  phases: phases(),
  requirements: [
    // ── Phase 1: New Client Info ──────────────────────────────────────────────
    { sort_order: 0,  phase_number: 1, type: "heading", label: "Contract Signee Details", is_required: false },
    { sort_order: 1,  phase_number: 1, type: "text",    label: "First Name", is_required: true },
    { sort_order: 2,  phase_number: 1, type: "text",    label: "Last Name", is_required: true },
    { sort_order: 3,  phase_number: 1, type: "text",    label: "Job Title", is_required: true },
    { sort_order: 4,  phase_number: 1, type: "text",    label: "Email Address", is_required: true },
    { sort_order: 5,  phase_number: 1, type: "text",    label: "Phone Number", is_required: true },
    { sort_order: 6,  phase_number: 1, type: "heading", label: "Company & Invoicing Details", is_required: false },
    { sort_order: 7,  phase_number: 1, type: "text",    label: "Company Legal Name", is_required: true },
    { sort_order: 8,  phase_number: 1, type: "text",    label: "Company Registration Number", is_required: false },
    { sort_order: 9,  phase_number: 1, type: "text",    label: "VAT / Tax Number", is_required: false },
    { sort_order: 10, phase_number: 1, type: "textarea", label: "Billing Address", is_required: true },
    { sort_order: 11, phase_number: 1, type: "heading", label: "Contract & Agreement", is_required: false },
    { sort_order: 12, phase_number: 1, type: "signature", label: "Exhibitor Agreement — Please sign below to confirm you have read and agree to the DreamHack exhibitor terms and conditions.", is_required: true },

    // ── Phase 2: Onboarding Info ──────────────────────────────────────────────
    { sort_order: 0,  phase_number: 2, type: "heading", label: "Company Profile", is_required: false },
    { sort_order: 1,  phase_number: 2, type: "text",    label: "Exhibiting Brand / Company Name (as shown at event)", is_required: true },
    { sort_order: 2,  phase_number: 2, type: "textarea", label: "Brand Description (max 300 words — used in DreamHack programme)", is_required: true },
    { sort_order: 3,  phase_number: 2, type: "file",    label: "Logo (High Resolution — PNG or SVG preferred, min 1000px)", is_required: true },
    { sort_order: 4,  phase_number: 2, type: "text",    label: "Website URL", is_required: false },
    { sort_order: 5,  phase_number: 2, type: "text",    label: "Instagram Handle", is_required: false },
    { sort_order: 6,  phase_number: 2, type: "text",    label: "X / Twitter Handle", is_required: false },
    { sort_order: 7,  phase_number: 2, type: "heading", label: "Products & Retail", is_required: false },
    { sort_order: 8,  phase_number: 2, type: "multiple_choice", label: "Product Categories", is_required: true,
      options: ["Gaming Peripherals", "PC / Console Hardware", "Accessories & Cables", "Apparel & Merchandise", "Collectibles & Figures", "Trading Cards / TCG", "Food & Beverages", "Other"],
      allow_multi_select: true },
    { sort_order: 9,  phase_number: 2, type: "textarea", label: "Products / Items for Sale — Brief description of what you will be selling at the event", is_required: true },
    { sort_order: 10, phase_number: 2, type: "heading", label: "Booth Information", is_required: false },
    { sort_order: 11, phase_number: 2, type: "multiple_choice", label: "Booth Size", is_required: true,
      options: ["3×3m", "3×6m", "6×6m", "6×9m", "6×12m", "Custom — please describe below"] },
    { sort_order: 12, phase_number: 2, type: "textarea", label: "Booth Description / Concept (optional — what does your booth look like?)", is_required: false },
    { sort_order: 13, phase_number: 2, type: "heading", label: "Legal & Compliance", is_required: false },
    { sort_order: 14, phase_number: 2, type: "file",    label: "Certificate of Insurance (must name DreamHack as additional insured)", is_required: true },
    { sort_order: 15, phase_number: 2, type: "signature", label: "Health & Safety Declaration — I confirm all staff are briefed on site health & safety requirements.", is_required: true },

    // ── Phase 3: On-Site Info ─────────────────────────────────────────────────
    { sort_order: 0,  phase_number: 3, type: "heading", label: "Staff & Access Credentials", is_required: false },
    { sort_order: 1,  phase_number: 3, type: "textarea", label: "Staff Names & Roles (one per line, e.g. Jane Smith — Sales Manager)", is_required: true },
    { sort_order: 2,  phase_number: 3, type: "multiple_choice", label: "Preferred Move-In Day", is_required: true,
      options: ["Friday (large booths only — pre-approved)", "Saturday", "Sunday morning"] },
    { sort_order: 3,  phase_number: 3, type: "heading", label: "Guest List", is_required: false },
    { sort_order: 4,  phase_number: 3, type: "textarea", label: "Guest / Complimentary Ticket List (full names, one per line)", is_required: false },
    { sort_order: 5,  phase_number: 3, type: "heading", label: "Retail Setup", is_required: false },
    { sort_order: 6,  phase_number: 3, type: "multiple_choice", label: "Payment Methods Accepted at Booth", is_required: true,
      options: ["Cash only", "Card / contactless only", "Cash and card", "Not selling — demo only"] },
    { sort_order: 7,  phase_number: 3, type: "text",    label: "POS System / Card Reader (brand/model, or 'own device')", is_required: false },
    { sort_order: 8,  phase_number: 3, type: "heading", label: "Special Requirements", is_required: false },
    { sort_order: 9,  phase_number: 3, type: "textarea", label: "Any special requirements, power needs, or notes for the DreamHack team", is_required: false },
    { sort_order: 10, phase_number: 3, type: "text",    label: "On-Site Contact Name & Phone (person present during the event)", is_required: true },
  ],
};

// ─── Template 2: Floorspace ───────────────────────────────────────────────────
const floorspace = {
  phases: phases(),
  requirements: [
    // Phase 1
    { sort_order: 0,  phase_number: 1, type: "heading",   label: "Contract Signee Details", is_required: false },
    { sort_order: 1,  phase_number: 1, type: "text",      label: "First Name", is_required: true },
    { sort_order: 2,  phase_number: 1, type: "text",      label: "Last Name", is_required: true },
    { sort_order: 3,  phase_number: 1, type: "text",      label: "Job Title", is_required: true },
    { sort_order: 4,  phase_number: 1, type: "text",      label: "Email Address", is_required: true },
    { sort_order: 5,  phase_number: 1, type: "text",      label: "Phone Number", is_required: true },
    { sort_order: 6,  phase_number: 1, type: "heading",   label: "Company & Invoicing Details", is_required: false },
    { sort_order: 7,  phase_number: 1, type: "text",      label: "Company Legal Name", is_required: true },
    { sort_order: 8,  phase_number: 1, type: "text",      label: "Company Registration Number", is_required: false },
    { sort_order: 9,  phase_number: 1, type: "text",      label: "VAT / Tax Number", is_required: false },
    { sort_order: 10, phase_number: 1, type: "textarea",  label: "Billing Address", is_required: true },
    { sort_order: 11, phase_number: 1, type: "heading",   label: "Agreement", is_required: false },
    { sort_order: 12, phase_number: 1, type: "signature", label: "Exhibitor Agreement Signature", is_required: true },

    // Phase 2
    { sort_order: 0,  phase_number: 2, type: "heading",   label: "Company Profile", is_required: false },
    { sort_order: 1,  phase_number: 2, type: "text",      label: "Exhibiting Brand / Company Name", is_required: true },
    { sort_order: 2,  phase_number: 2, type: "textarea",  label: "Brand / Activation Description (for DreamHack programme)", is_required: true },
    { sort_order: 3,  phase_number: 2, type: "file",      label: "Logo (High Resolution PNG or SVG)", is_required: true },
    { sort_order: 4,  phase_number: 2, type: "text",      label: "Website URL", is_required: false },
    { sort_order: 5,  phase_number: 2, type: "heading",   label: "Booth Design & Build", is_required: false },
    { sort_order: 6,  phase_number: 2, type: "multiple_choice", label: "Booth Size", is_required: true,
      options: ["3×3m", "3×6m", "6×6m", "6×9m", "6×12m", "Custom — describe below"] },
    { sort_order: 7,  phase_number: 2, type: "text",      label: "Maximum Booth Height (metres)", is_required: true },
    { sort_order: 8,  phase_number: 2, type: "file",      label: "Booth Floor Plan / Layout Drawing", is_required: true },
    { sort_order: 9,  phase_number: 2, type: "file",      label: "Booth Rendering / 3D Visualisation (PDF, PNG, or JPG)", is_required: false },
    { sort_order: 10, phase_number: 2, type: "multiple_choice", label: "Booth Configuration", is_required: true,
      options: ["Inline (one open side)", "Corner (two open sides)", "Peninsula (three open sides)", "Island (four open sides)"] },
    { sort_order: 11, phase_number: 2, type: "textarea",  label: "Booth Build Contractor / Company (name and contact)", is_required: false },
    { sort_order: 12, phase_number: 2, type: "heading",   label: "Power & Technical Requirements", is_required: false },
    { sort_order: 13, phase_number: 2, type: "text",      label: "Total Power Requirement (kW)", is_required: true },
    { sort_order: 14, phase_number: 2, type: "textarea",  label: "List of electrical equipment (screens, lighting, PCs, etc.)", is_required: true },
    { sort_order: 15, phase_number: 2, type: "heading",   label: "Legal & Compliance", is_required: false },
    { sort_order: 16, phase_number: 2, type: "file",      label: "Certificate of Insurance", is_required: true },
    { sort_order: 17, phase_number: 2, type: "signature", label: "Health & Safety Declaration", is_required: true },

    // Phase 3
    { sort_order: 0,  phase_number: 3, type: "heading",   label: "Staff & Credentials", is_required: false },
    { sort_order: 1,  phase_number: 3, type: "textarea",  label: "Staff Names & Roles (one per line)", is_required: true },
    { sort_order: 2,  phase_number: 3, type: "textarea",  label: "Build Crew Details (names, company, dates on-site)", is_required: false },
    { sort_order: 3,  phase_number: 3, type: "multiple_choice", label: "Preferred Move-In Day", is_required: true,
      options: ["Friday (large booths — pre-approved)", "Saturday", "Sunday morning"] },
    { sort_order: 4,  phase_number: 3, type: "heading",   label: "Guest List", is_required: false },
    { sort_order: 5,  phase_number: 3, type: "textarea",  label: "Guest / Complimentary Ticket List (full names)", is_required: false },
    { sort_order: 6,  phase_number: 3, type: "heading",   label: "Activations & On-Site Info", is_required: false },
    { sort_order: 7,  phase_number: 3, type: "textarea",  label: "Planned Activations / Activities at Your Booth", is_required: true },
    { sort_order: 8,  phase_number: 3, type: "text",      label: "On-Site Contact Name & Phone (present throughout event)", is_required: true },
    { sort_order: 9,  phase_number: 3, type: "textarea",  label: "Any other special requirements or notes", is_required: false },
  ],
};

// ─── Template 3: Sampling ─────────────────────────────────────────────────────
const sampling = {
  phases: phases(),
  requirements: [
    // Phase 1
    { sort_order: 0,  phase_number: 1, type: "heading",   label: "Contract Signee Details", is_required: false },
    { sort_order: 1,  phase_number: 1, type: "text",      label: "First Name", is_required: true },
    { sort_order: 2,  phase_number: 1, type: "text",      label: "Last Name", is_required: true },
    { sort_order: 3,  phase_number: 1, type: "text",      label: "Job Title", is_required: true },
    { sort_order: 4,  phase_number: 1, type: "text",      label: "Email Address", is_required: true },
    { sort_order: 5,  phase_number: 1, type: "text",      label: "Phone Number", is_required: true },
    { sort_order: 6,  phase_number: 1, type: "heading",   label: "Company & Invoicing Details", is_required: false },
    { sort_order: 7,  phase_number: 1, type: "text",      label: "Company Legal Name", is_required: true },
    { sort_order: 8,  phase_number: 1, type: "text",      label: "Company Registration Number", is_required: false },
    { sort_order: 9,  phase_number: 1, type: "text",      label: "VAT / Tax Number", is_required: false },
    { sort_order: 10, phase_number: 1, type: "textarea",  label: "Billing Address", is_required: true },
    { sort_order: 11, phase_number: 1, type: "heading",   label: "Agreement", is_required: false },
    { sort_order: 12, phase_number: 1, type: "signature", label: "Sampling Partner Agreement Signature", is_required: true },

    // Phase 2
    { sort_order: 0,  phase_number: 2, type: "heading",   label: "Company Profile", is_required: false },
    { sort_order: 1,  phase_number: 2, type: "text",      label: "Exhibiting Brand / Company Name", is_required: true },
    { sort_order: 2,  phase_number: 2, type: "textarea",  label: "Brand Description (for DreamHack programme)", is_required: true },
    { sort_order: 3,  phase_number: 2, type: "file",      label: "Logo (High Resolution PNG or SVG)", is_required: true },
    { sort_order: 4,  phase_number: 2, type: "text",      label: "Website URL", is_required: false },
    { sort_order: 5,  phase_number: 2, type: "heading",   label: "Sampling Details", is_required: false },
    { sort_order: 6,  phase_number: 2, type: "multiple_choice", label: "Type of Sampling", is_required: true,
      options: ["Food", "Beverages (non-alcoholic)", "Beverages (alcoholic — requires permit)", "Health & Beauty", "Other product sampling"] },
    { sort_order: 7,  phase_number: 2, type: "textarea",  label: "Products Being Sampled — Full list with descriptions", is_required: true },
    { sort_order: 8,  phase_number: 2, type: "textarea",  label: "Allergen Information — List all allergens present in sampled products (nut, gluten, dairy, etc.)", is_required: true },
    { sort_order: 9,  phase_number: 2, type: "file",      label: "Food Safety Certificate / Handler Certification", is_required: true },
    { sort_order: 10, phase_number: 2, type: "textarea",  label: "Equipment List — All equipment being brought to site (tables, fridges, heaters, dispensers, etc.)", is_required: true },
    { sort_order: 11, phase_number: 2, type: "text",      label: "Power Requirement (kW) — for refrigeration, heating, or dispensing equipment", is_required: true },
    { sort_order: 12, phase_number: 2, type: "heading",   label: "Booth Information", is_required: false },
    { sort_order: 13, phase_number: 2, type: "multiple_choice", label: "Booth / Station Size", is_required: true,
      options: ["3×3m (standard)", "3×6m", "Custom — describe below"] },
    { sort_order: 14, phase_number: 2, type: "textarea",  label: "Additional booth details or special setup requirements", is_required: false },
    { sort_order: 15, phase_number: 2, type: "heading",   label: "Legal & Compliance", is_required: false },
    { sort_order: 16, phase_number: 2, type: "file",      label: "Certificate of Insurance (including product liability)", is_required: true },
    { sort_order: 17, phase_number: 2, type: "file",      label: "Alcohol Permit (if applicable)", is_required: false },
    { sort_order: 18, phase_number: 2, type: "signature", label: "Health & Safety Declaration — I confirm all sampling staff hold relevant food safety qualifications.", is_required: true },

    // Phase 3
    { sort_order: 0,  phase_number: 3, type: "heading",   label: "Staff & Credentials", is_required: false },
    { sort_order: 1,  phase_number: 3, type: "textarea",  label: "Staff Names & Roles (one per line)", is_required: true },
    { sort_order: 2,  phase_number: 3, type: "multiple_choice", label: "Preferred Move-In Day", is_required: true,
      options: ["Friday (pre-approved)", "Saturday", "Sunday morning"] },
    { sort_order: 3,  phase_number: 3, type: "heading",   label: "Guest List", is_required: false },
    { sort_order: 4,  phase_number: 3, type: "textarea",  label: "Guest / Complimentary Ticket List (full names)", is_required: false },
    { sort_order: 5,  phase_number: 3, type: "heading",   label: "On-Site Sampling Info", is_required: false },
    { sort_order: 6,  phase_number: 3, type: "textarea",  label: "Sampling Schedule / Hours (when you plan to sample each day)", is_required: true },
    { sort_order: 7,  phase_number: 3, type: "text",      label: "Estimated sample quantity per day", is_required: false },
    { sort_order: 8,  phase_number: 3, type: "text",      label: "On-Site Contact Name & Phone", is_required: true },
    { sort_order: 9,  phase_number: 3, type: "textarea",  label: "Any other requirements or notes", is_required: false },
  ],
};

// ─── Template 4: Global Partner ───────────────────────────────────────────────
const global = {
  phases: phases([-90, -45, -14]),
  requirements: [
    // Phase 1
    { sort_order: 0,  phase_number: 1, type: "heading",   label: "Contract Signee Details", is_required: false },
    { sort_order: 1,  phase_number: 1, type: "text",      label: "First Name", is_required: true },
    { sort_order: 2,  phase_number: 1, type: "text",      label: "Last Name", is_required: true },
    { sort_order: 3,  phase_number: 1, type: "text",      label: "Job Title", is_required: true },
    { sort_order: 4,  phase_number: 1, type: "text",      label: "Email Address", is_required: true },
    { sort_order: 5,  phase_number: 1, type: "text",      label: "Phone Number (with country code)", is_required: true },
    { sort_order: 6,  phase_number: 1, type: "heading",   label: "Company & Invoicing Details", is_required: false },
    { sort_order: 7,  phase_number: 1, type: "text",      label: "Company Legal Name", is_required: true },
    { sort_order: 8,  phase_number: 1, type: "text",      label: "Country of Incorporation", is_required: true },
    { sort_order: 9,  phase_number: 1, type: "text",      label: "Company Registration Number", is_required: false },
    { sort_order: 10, phase_number: 1, type: "text",      label: "VAT / Tax / EIN Number", is_required: false },
    { sort_order: 11, phase_number: 1, type: "textarea",  label: "Billing Address (full international address)", is_required: true },
    { sort_order: 12, phase_number: 1, type: "heading",   label: "Local Event Contact", is_required: false },
    { sort_order: 13, phase_number: 1, type: "text",      label: "Local POC Name (if different from signee)", is_required: false },
    { sort_order: 14, phase_number: 1, type: "text",      label: "Local POC Email", is_required: false },
    { sort_order: 15, phase_number: 1, type: "text",      label: "Local POC Phone", is_required: false },
    { sort_order: 16, phase_number: 1, type: "heading",   label: "Contract & Agreement", is_required: false },
    { sort_order: 17, phase_number: 1, type: "signature", label: "Global Partner Agreement — Please sign to confirm acceptance of DreamHack partnership terms.", is_required: true },

    // Phase 2
    { sort_order: 0,  phase_number: 2, type: "heading",   label: "Brand & Media Assets", is_required: false },
    { sort_order: 1,  phase_number: 2, type: "text",      label: "Exhibiting Brand / Company Name (as shown at event)", is_required: true },
    { sort_order: 2,  phase_number: 2, type: "textarea",  label: "Brand Description — Short version (max 150 words, for signage/programme)", is_required: true },
    { sort_order: 3,  phase_number: 2, type: "textarea",  label: "Brand Description — Long version (max 500 words, for website/app)", is_required: true },
    { sort_order: 4,  phase_number: 2, type: "file",      label: "Logo — Primary (Vector / SVG or EPS)", is_required: true },
    { sort_order: 5,  phase_number: 2, type: "file",      label: "Logo — White / Knockout version", is_required: true },
    { sort_order: 6,  phase_number: 2, type: "file",      label: "Brand Guidelines / Style Guide (PDF)", is_required: false },
    { sort_order: 7,  phase_number: 2, type: "text",      label: "Website URL", is_required: true },
    { sort_order: 8,  phase_number: 2, type: "text",      label: "Social Media Handles (all platforms, comma-separated)", is_required: false },
    { sort_order: 9,  phase_number: 2, type: "heading",   label: "Activation & Booth", is_required: false },
    { sort_order: 10, phase_number: 2, type: "textarea",  label: "Activation / Booth Concept Description — What experience are you creating for DreamHack attendees?", is_required: true },
    { sort_order: 11, phase_number: 2, type: "multiple_choice", label: "Booth / Activation Space Size", is_required: true,
      options: ["6×6m", "6×9m", "6×12m", "9×12m", "12×12m or larger", "Custom footprint"] },
    { sort_order: 12, phase_number: 2, type: "file",      label: "Booth Floor Plan / Layout", is_required: true },
    { sort_order: 13, phase_number: 2, type: "file",      label: "Booth Rendering / 3D Visualisation", is_required: true },
    { sort_order: 14, phase_number: 2, type: "text",      label: "Maximum Booth Height (metres)", is_required: true },
    { sort_order: 15, phase_number: 2, type: "text",      label: "Power Requirement (kW)", is_required: true },
    { sort_order: 16, phase_number: 2, type: "heading",   label: "Freight & Logistics", is_required: false },
    { sort_order: 17, phase_number: 2, type: "multiple_choice", label: "Freight / Shipping Method", is_required: true,
      options: ["Own transport", "Freight forwarder (name below)", "Advance warehouse (STS)", "No freight — all local supply"] },
    { sort_order: 18, phase_number: 2, type: "textarea",  label: "Freight / Logistics Notes (forwarder name, shipment details, customs info)", is_required: false },
    { sort_order: 19, phase_number: 2, type: "heading",   label: "Legal & Compliance", is_required: false },
    { sort_order: 20, phase_number: 2, type: "file",      label: "Certificate of Insurance (international — must cover the event country)", is_required: true },
    { sort_order: 21, phase_number: 2, type: "signature", label: "Health & Safety Declaration", is_required: true },

    // Phase 3
    { sort_order: 0,  phase_number: 3, type: "heading",   label: "Staff & Credentials", is_required: false },
    { sort_order: 1,  phase_number: 3, type: "textarea",  label: "Full Staff List — Name, Role, Nationality (one per line)", is_required: true },
    { sort_order: 2,  phase_number: 3, type: "textarea",  label: "Build / Install Crew — Names, Company, Dates On-Site", is_required: false },
    { sort_order: 3,  phase_number: 3, type: "multiple_choice", label: "Preferred Move-In Day", is_required: true,
      options: ["Friday (large activations — must be pre-approved)", "Saturday", "Sunday morning"] },
    { sort_order: 4,  phase_number: 3, type: "heading",   label: "Guest & VIP List", is_required: false },
    { sort_order: 5,  phase_number: 3, type: "textarea",  label: "Guest / VIP List (full names — one per line)", is_required: false },
    { sort_order: 6,  phase_number: 3, type: "heading",   label: "Activations Schedule", is_required: false },
    { sort_order: 7,  phase_number: 3, type: "textarea",  label: "Planned Activations / Events (demos, tournaments, meet & greets, livestreams)", is_required: true },
    { sort_order: 8,  phase_number: 3, type: "textarea",  label: "Proposed Content / Streaming Schedule (if applicable)", is_required: false },
    { sort_order: 9,  phase_number: 3, type: "heading",   label: "On-Site Contacts", is_required: false },
    { sort_order: 10, phase_number: 3, type: "text",      label: "Primary On-Site Contact Name & Phone", is_required: true },
    { sort_order: 11, phase_number: 3, type: "text",      label: "Secondary On-Site Contact Name & Phone", is_required: false },
    { sort_order: 12, phase_number: 3, type: "textarea",  label: "Any other requirements, notes, or requests for the DreamHack team", is_required: false },
  ],
};

// ─── Insert templates ─────────────────────────────────────────────────────────

const TEMPLATES = [
  { name: "DreamHack — Retailer",        definition: retailer },
  { name: "DreamHack — Floorspace",      definition: floorspace },
  { name: "DreamHack — Sampling",        definition: sampling },
  { name: "DreamHack — Global Partner",  definition: global },
];

console.log("Creating templates…");
const created = [];

for (const tpl of TEMPLATES) {
  // Delete old version if it exists (for idempotency)
  await sb.from("templates").delete().eq("org_id", ORG_ID).eq("name", tpl.name);

  const { data, error } = await sb.from("templates").insert({
    org_id: ORG_ID,
    name: tpl.name,
    definition: tpl.definition,
    created_at: now,
    updated_at: now,
  }).select("id, name").single();

  if (error) {
    console.error(`  ✗ ${tpl.name}: ${error.message}`);
  } else {
    console.log(`  ✓ ${data.name} (${data.id.slice(0,8)})`);
    created.push(data);
  }
}

console.log(`\nDone — created ${created.length} templates.`);
console.log("These are now available to assign to exhibitors across all DreamHack events (Stockholm, Birmingham, Atlanta).");
