-- Insert 3 DreamHack demo templates for Tom's org.

-- ─────────────────────────────────────────────────────────────
-- 1. DreamHack Atlanta 2026 – Onboarding Form
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.templates (org_id, name, definition)
SELECT
  p.org_id,
  'DreamHack Atlanta 2026 - Onboarding Form',
  '{
    "phases": [
      { "number": 1, "name": "Exhibiting Company Info" },
      { "number": 2, "name": "Booth Builder / Contractor Info" },
      { "number": 3, "name": "Billing" },
      { "number": 4, "name": "Brand & Social Media" }
    ],
    "requirements": [
      {
        "type": "heading", "label": "Exhibiting Company Information",
        "is_required": false, "sort_order": 0, "phase_number": 1
      },
      {
        "type": "info", "label": "",
        "is_required": false, "sort_order": 1, "phase_number": 1,
        "info_content": "Please complete all required fields. This information will be used for event logistics, signage, and the official exhibitor directory."
      },
      {
        "type": "text", "label": "Exhibiting Company Name",
        "is_required": true, "sort_order": 2, "phase_number": 1
      },
      {
        "type": "text", "label": "Main Contact First Name",
        "is_required": true, "sort_order": 3, "phase_number": 1
      },
      {
        "type": "text", "label": "Main Contact Last Name",
        "is_required": true, "sort_order": 4, "phase_number": 1
      },
      {
        "type": "text", "label": "Main Contact Email Address",
        "is_required": true, "sort_order": 5, "phase_number": 1
      },
      {
        "type": "text", "label": "Main Contact Phone Number",
        "is_required": true, "sort_order": 6, "phase_number": 1
      },
      {
        "type": "text", "label": "Booth Number(s)",
        "is_required": true, "sort_order": 7, "phase_number": 1
      },
      {
        "type": "multiple_choice", "label": "Booth Size",
        "is_required": true, "sort_order": 8, "phase_number": 1,
        "options": ["10x10", "10x20", "10x30", "20x20", "20x30", "30x30", "Other"]
      },
      {
        "type": "text", "label": "Products / Services Being Showcased",
        "is_required": true, "sort_order": 9, "phase_number": 1,
        "multiline": true
      },
      {
        "type": "multiple_choice", "label": "Industry / Category",
        "is_required": true, "sort_order": 10, "phase_number": 1,
        "options": ["Gaming", "Technology", "Esports", "Peripherals / Hardware", "Software", "Streaming / Content Creation", "Food & Beverage", "Apparel / Merchandise", "Other"]
      },
      {
        "type": "multiple_choice", "label": "Will you be running any activities or demos at your booth?",
        "is_required": true, "sort_order": 11, "phase_number": 1,
        "options": ["Yes", "No"]
      },
      {
        "type": "heading", "label": "Booth Builder / Agency / Contractor",
        "is_required": false, "sort_order": 0, "phase_number": 2
      },
      {
        "type": "multiple_choice", "label": "Are you using a third-party booth builder or contractor?",
        "is_required": true, "sort_order": 1, "phase_number": 2,
        "options": ["Yes", "No – building ourselves", "No – using shell scheme only"]
      },
      {
        "type": "text", "label": "Contractor / Agency Company Name",
        "is_required": false, "sort_order": 2, "phase_number": 2
      },
      {
        "type": "text", "label": "Contractor Contact Name",
        "is_required": false, "sort_order": 3, "phase_number": 2
      },
      {
        "type": "text", "label": "Contractor Email Address",
        "is_required": false, "sort_order": 4, "phase_number": 2
      },
      {
        "type": "text", "label": "Contractor Phone Number",
        "is_required": false, "sort_order": 5, "phase_number": 2
      },
      {
        "type": "multiple_choice", "label": "Will your contractor require access during setup and teardown?",
        "is_required": false, "sort_order": 6, "phase_number": 2,
        "options": ["Yes – both setup and teardown", "Yes – setup only", "Yes – teardown only", "No"]
      },
      {
        "type": "file", "label": "Booth Design / Rendering (PDF, PNG, or JPG)",
        "is_required": false, "sort_order": 7, "phase_number": 2
      },
      {
        "type": "text", "label": "Additional notes for the venue team",
        "is_required": false, "sort_order": 8, "phase_number": 2,
        "multiline": true
      },
      {
        "type": "heading", "label": "Billing Information",
        "is_required": false, "sort_order": 0, "phase_number": 3
      },
      {
        "type": "text", "label": "Billing Contact Full Name",
        "is_required": true, "sort_order": 1, "phase_number": 3
      },
      {
        "type": "text", "label": "Billing Email Address",
        "is_required": true, "sort_order": 2, "phase_number": 3
      },
      {
        "type": "text", "label": "Company / Organization Name",
        "is_required": true, "sort_order": 3, "phase_number": 3
      },
      {
        "type": "text", "label": "Billing Address (Street)",
        "is_required": true, "sort_order": 4, "phase_number": 3
      },
      {
        "type": "text", "label": "City",
        "is_required": true, "sort_order": 5, "phase_number": 3
      },
      {
        "type": "text", "label": "State / Province",
        "is_required": true, "sort_order": 6, "phase_number": 3
      },
      {
        "type": "text", "label": "ZIP / Postal Code",
        "is_required": true, "sort_order": 7, "phase_number": 3
      },
      {
        "type": "text", "label": "Country",
        "is_required": true, "sort_order": 8, "phase_number": 3
      },
      {
        "type": "text", "label": "VAT / Tax Registration Number",
        "is_required": false, "sort_order": 9, "phase_number": 3
      },
      {
        "type": "text", "label": "Purchase Order Number (if applicable)",
        "is_required": false, "sort_order": 10, "phase_number": 3
      },
      {
        "type": "multiple_choice", "label": "Preferred Payment Method",
        "is_required": true, "sort_order": 11, "phase_number": 3,
        "options": ["Bank / Wire Transfer", "Credit Card", "Check / Cheque", "ACH"]
      },
      {
        "type": "heading", "label": "Brand Information, Website & Social Media",
        "is_required": false, "sort_order": 0, "phase_number": 4
      },
      {
        "type": "info", "label": "",
        "is_required": false, "sort_order": 1, "phase_number": 4,
        "info_content": "This information will appear in the official DreamHack exhibitor directory and event app. Please provide accurate links and a short description."
      },
      {
        "type": "text", "label": "Company Website URL",
        "is_required": true, "sort_order": 2, "phase_number": 4
      },
      {
        "type": "text", "label": "LinkedIn URL",
        "is_required": false, "sort_order": 3, "phase_number": 4
      },
      {
        "type": "text", "label": "Twitter / X Handle",
        "is_required": false, "sort_order": 4, "phase_number": 4
      },
      {
        "type": "text", "label": "Instagram Handle",
        "is_required": false, "sort_order": 5, "phase_number": 4
      },
      {
        "type": "text", "label": "Facebook Page URL",
        "is_required": false, "sort_order": 6, "phase_number": 4
      },
      {
        "type": "text", "label": "TikTok Handle",
        "is_required": false, "sort_order": 7, "phase_number": 4
      },
      {
        "type": "text", "label": "Short Company Description (max 150 words) – for event app/website",
        "is_required": true, "sort_order": 8, "phase_number": 4,
        "multiline": true
      },
      {
        "type": "file", "label": "Company Logo (PNG or SVG, transparent background preferred)",
        "is_required": true, "sort_order": 9, "phase_number": 4
      },
      {
        "type": "checkbox", "label": "I confirm all information provided is accurate and I am authorised to submit on behalf of my company",
        "is_required": true, "sort_order": 10, "phase_number": 4
      }
    ]
  }'::jsonb
FROM public.profiles p
WHERE p.email = 'tom.chillman@protonmail.com'
LIMIT 1;


-- ─────────────────────────────────────────────────────────────
-- 2. DreamHack – New Client Form
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.templates (org_id, name, definition)
SELECT
  p.org_id,
  'DreamHack - New Client Form',
  '{
    "phases": [
      { "number": 1, "name": "Contract Signee Info" },
      { "number": 2, "name": "Company & Invoicing Details" },
      { "number": 3, "name": "Contract Information" },
      { "number": 4, "name": "Billing & Sign-off" }
    ],
    "requirements": [
      {
        "type": "heading", "label": "Contract Signee Information",
        "is_required": false, "sort_order": 0, "phase_number": 1
      },
      {
        "type": "info", "label": "",
        "is_required": false, "sort_order": 1, "phase_number": 1,
        "info_content": "Please provide the details of the person who will be signing the contract. This must be someone with authority to enter into legally binding agreements on behalf of your company."
      },
      {
        "type": "text", "label": "First Name",
        "is_required": true, "sort_order": 2, "phase_number": 1
      },
      {
        "type": "text", "label": "Last Name",
        "is_required": true, "sort_order": 3, "phase_number": 1
      },
      {
        "type": "text", "label": "Job Title",
        "is_required": true, "sort_order": 4, "phase_number": 1
      },
      {
        "type": "text", "label": "Email Address",
        "is_required": true, "sort_order": 5, "phase_number": 1
      },
      {
        "type": "text", "label": "Phone Number",
        "is_required": true, "sort_order": 6, "phase_number": 1
      },
      {
        "type": "text", "label": "Company",
        "is_required": true, "sort_order": 7, "phase_number": 1
      },
      {
        "type": "heading", "label": "Company & Invoicing Details",
        "is_required": false, "sort_order": 0, "phase_number": 2
      },
      {
        "type": "text", "label": "Company Legal Name",
        "is_required": true, "sort_order": 1, "phase_number": 2
      },
      {
        "type": "text", "label": "Registered Company Address (Street)",
        "is_required": true, "sort_order": 2, "phase_number": 2
      },
      {
        "type": "text", "label": "City",
        "is_required": true, "sort_order": 3, "phase_number": 2
      },
      {
        "type": "text", "label": "State / Province",
        "is_required": true, "sort_order": 4, "phase_number": 2
      },
      {
        "type": "text", "label": "Postal / ZIP Code",
        "is_required": true, "sort_order": 5, "phase_number": 2
      },
      {
        "type": "text", "label": "Country",
        "is_required": true, "sort_order": 6, "phase_number": 2
      },
      {
        "type": "text", "label": "VAT / Tax Registration Number",
        "is_required": false, "sort_order": 7, "phase_number": 2
      },
      {
        "type": "text", "label": "Invoice Contact Name",
        "is_required": true, "sort_order": 8, "phase_number": 2
      },
      {
        "type": "text", "label": "Invoice Contact Email",
        "is_required": true, "sort_order": 9, "phase_number": 2
      },
      {
        "type": "text", "label": "Invoice Contact Phone",
        "is_required": false, "sort_order": 10, "phase_number": 2
      },
      {
        "type": "heading", "label": "Information for Contract",
        "is_required": false, "sort_order": 0, "phase_number": 3
      },
      {
        "type": "text", "label": "Event Name",
        "is_required": true, "sort_order": 1, "phase_number": 3
      },
      {
        "type": "text", "label": "Sponsorship / Exhibitor Package",
        "is_required": true, "sort_order": 2, "phase_number": 3
      },
      {
        "type": "text", "label": "Contract Start Date",
        "is_required": true, "sort_order": 3, "phase_number": 3
      },
      {
        "type": "text", "label": "Contract End Date",
        "is_required": true, "sort_order": 4, "phase_number": 3
      },
      {
        "type": "text", "label": "Total Contract Value (USD)",
        "is_required": true, "sort_order": 5, "phase_number": 3
      },
      {
        "type": "multiple_choice", "label": "Payment Terms",
        "is_required": true, "sort_order": 6, "phase_number": 3,
        "options": ["100% due upon signing", "50% deposit, 50% 30 days prior to event", "Net 30", "Net 60", "Other – please specify in notes"]
      },
      {
        "type": "text", "label": "Additional Notes / Special Terms",
        "is_required": false, "sort_order": 7, "phase_number": 3,
        "multiline": true
      },
      {
        "type": "multiple_choice", "label": "Will you require a W-9 or W-8BEN form?",
        "is_required": true, "sort_order": 8, "phase_number": 3,
        "options": ["Yes – W-9 (US entity)", "Yes – W-8BEN (non-US entity)", "No"]
      },
      {
        "type": "heading", "label": "Billing & Reference",
        "is_required": false, "sort_order": 0, "phase_number": 4
      },
      {
        "type": "multiple_choice", "label": "Preferred Payment Method",
        "is_required": true, "sort_order": 1, "phase_number": 4,
        "options": ["Bank / Wire Transfer", "ACH", "Credit Card", "Check / Cheque"]
      },
      {
        "type": "text", "label": "Purchase Order Number (if applicable)",
        "is_required": false, "sort_order": 2, "phase_number": 4
      },
      {
        "type": "text", "label": "Internal Reference / Cost Centre Code",
        "is_required": false, "sort_order": 3, "phase_number": 4
      },
      {
        "type": "text", "label": "Notes for Billing Team",
        "is_required": false, "sort_order": 4, "phase_number": 4,
        "multiline": true
      },
      {
        "type": "checkbox", "label": "I confirm all information provided is accurate and complete",
        "is_required": true, "sort_order": 5, "phase_number": 4
      },
      {
        "type": "checkbox", "label": "I confirm I am authorised to enter into this agreement on behalf of my company",
        "is_required": true, "sort_order": 6, "phase_number": 4
      },
      {
        "type": "signature", "label": "Authorised Signature",
        "is_required": true, "sort_order": 7, "phase_number": 4
      }
    ]
  }'::jsonb
FROM public.profiles p
WHERE p.email = 'tom.chillman@protonmail.com'
LIMIT 1;


-- ─────────────────────────────────────────────────────────────
-- 3. DreamHack – Onsite Info Form
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.templates (org_id, name, definition)
SELECT
  p.org_id,
  'DreamHack - Onsite Info Form',
  '{
    "phases": [
      { "number": 1, "name": "Booth Setup & Renderings" },
      { "number": 2, "name": "Activities & Programming" },
      { "number": 3, "name": "Schedules & Onsite Contacts" },
      { "number": 4, "name": "Guest List" }
    ],
    "requirements": [
      {
        "type": "heading", "label": "Booth Setup & Renderings",
        "is_required": false, "sort_order": 0, "phase_number": 1
      },
      {
        "type": "info", "label": "",
        "is_required": false, "sort_order": 1, "phase_number": 1,
        "info_content": "Please upload a rendering or floor plan of your booth. This is reviewed by our venue team to ensure your build complies with height restrictions, aisle access requirements, and fire safety regulations."
      },
      {
        "type": "file", "label": "Booth Rendering / 3D Visualisation (PDF, PNG, or JPG)",
        "is_required": true, "sort_order": 2, "phase_number": 1
      },
      {
        "type": "file", "label": "Booth Floor Plan / Layout Drawing",
        "is_required": true, "sort_order": 3, "phase_number": 1
      },
      {
        "type": "text", "label": "Maximum Booth Height (ft or m)",
        "is_required": true, "sort_order": 4, "phase_number": 1
      },
      {
        "type": "multiple_choice", "label": "Booth Configuration",
        "is_required": true, "sort_order": 5, "phase_number": 1,
        "options": ["Inline / Linear (open one side)", "Corner (open two sides)", "Peninsula (open three sides)", "Island (open all sides)"]
      },
      {
        "type": "multiple_choice", "label": "Will your booth include any custom structures or hanging elements?",
        "is_required": true, "sort_order": 6, "phase_number": 1,
        "options": ["Yes – hanging sign / banner", "Yes – elevated platform / second floor", "Yes – rigging / truss", "No"]
      },
      {
        "type": "multiple_choice", "label": "Do you require any electrical connections beyond the standard package?",
        "is_required": true, "sort_order": 7, "phase_number": 1,
        "options": ["Yes – please detail in notes", "No – standard package is sufficient"]
      },
      {
        "type": "text", "label": "Electrical / AV / Special Requirements",
        "is_required": false, "sort_order": 8, "phase_number": 1,
        "multiline": true
      },
      {
        "type": "heading", "label": "Activities & Programming",
        "is_required": false, "sort_order": 0, "phase_number": 2
      },
      {
        "type": "multiple_choice", "label": "Will you be hosting activities, demos, or competitions at your booth?",
        "is_required": true, "sort_order": 1, "phase_number": 2,
        "options": ["Yes", "No"]
      },
      {
        "type": "text", "label": "Activity / Demo Name(s)",
        "is_required": false, "sort_order": 2, "phase_number": 2
      },
      {
        "type": "text", "label": "Activity Description – what will attendees be doing?",
        "is_required": false, "sort_order": 3, "phase_number": 2,
        "multiline": true
      },
      {
        "type": "text", "label": "Activity Schedule (days and times)",
        "is_required": false, "sort_order": 4, "phase_number": 2,
        "multiline": true
      },
      {
        "type": "text", "label": "Expected Participation Numbers per Activity",
        "is_required": false, "sort_order": 5, "phase_number": 2
      },
      {
        "type": "multiple_choice", "label": "Will activities require any special equipment, AV, or additional space?",
        "is_required": false, "sort_order": 6, "phase_number": 2,
        "options": ["Yes – please detail below", "No"]
      },
      {
        "type": "text", "label": "Equipment / AV Requirements for Activities",
        "is_required": false, "sort_order": 7, "phase_number": 2,
        "multiline": true
      },
      {
        "type": "multiple_choice", "label": "Will there be any prize giveaways or competitions?",
        "is_required": false, "sort_order": 8, "phase_number": 2,
        "options": ["Yes – prizes valued under $500", "Yes – prizes valued $500+", "No"]
      },
      {
        "type": "heading", "label": "Schedules & Onsite Contacts",
        "is_required": false, "sort_order": 0, "phase_number": 3
      },
      {
        "type": "text", "label": "Primary Onsite Contact Name",
        "is_required": true, "sort_order": 1, "phase_number": 3
      },
      {
        "type": "text", "label": "Primary Onsite Contact Phone",
        "is_required": true, "sort_order": 2, "phase_number": 3
      },
      {
        "type": "text", "label": "Primary Onsite Contact Email",
        "is_required": true, "sort_order": 3, "phase_number": 3
      },
      {
        "type": "text", "label": "Secondary / Emergency Onsite Contact Name & Phone",
        "is_required": false, "sort_order": 4, "phase_number": 3
      },
      {
        "type": "text", "label": "Preferred Setup Start Date & Time",
        "is_required": true, "sort_order": 5, "phase_number": 3
      },
      {
        "type": "text", "label": "Estimated Setup Completion Time",
        "is_required": false, "sort_order": 6, "phase_number": 3
      },
      {
        "type": "text", "label": "Preferred Teardown Start Date & Time",
        "is_required": false, "sort_order": 7, "phase_number": 3
      },
      {
        "type": "text", "label": "Total Number of Booth Staff During Event",
        "is_required": true, "sort_order": 8, "phase_number": 3
      },
      {
        "type": "file", "label": "Staff Shift Schedule (optional – Excel or PDF)",
        "is_required": false, "sort_order": 9, "phase_number": 3
      },
      {
        "type": "multiple_choice", "label": "Will any staff require vehicle / freight access to the loading dock?",
        "is_required": true, "sort_order": 10, "phase_number": 3,
        "options": ["Yes – please coordinate with venue team", "No"]
      },
      {
        "type": "heading", "label": "Guest List",
        "is_required": false, "sort_order": 0, "phase_number": 4
      },
      {
        "type": "info", "label": "",
        "is_required": false, "sort_order": 1, "phase_number": 4,
        "info_content": "If you are hosting invited guests (beyond general attendees), please provide their details so we can prepare badges and ensure smooth entry. Upload your list as an Excel or CSV file with columns: First Name, Last Name, Email, Company."
      },
      {
        "type": "text", "label": "Total Number of Invited Guests Expected",
        "is_required": true, "sort_order": 2, "phase_number": 4
      },
      {
        "type": "file", "label": "Guest List Upload (Excel or CSV: First Name, Last Name, Email, Company)",
        "is_required": false, "sort_order": 3, "phase_number": 4
      },
      {
        "type": "multiple_choice", "label": "Will guests require printed badges or wristbands?",
        "is_required": true, "sort_order": 4, "phase_number": 4,
        "options": ["Yes – printed badges", "Yes – wristbands", "Yes – both", "No – they will use standard event passes"]
      },
      {
        "type": "multiple_choice", "label": "Will you have VIP guests requiring backstage or restricted-area access?",
        "is_required": true, "sort_order": 5, "phase_number": 4,
        "options": ["Yes", "No"]
      },
      {
        "type": "text", "label": "VIP Guest Details (names, access level required)",
        "is_required": false, "sort_order": 6, "phase_number": 4,
        "multiline": true
      },
      {
        "type": "text", "label": "Guests with Accessibility Requirements – please provide details so we can make appropriate arrangements",
        "is_required": false, "sort_order": 7, "phase_number": 4,
        "multiline": true
      },
      {
        "type": "checkbox", "label": "I confirm the guest list provided is accurate and I have consent to share these details with DreamHack",
        "is_required": true, "sort_order": 8, "phase_number": 4
      }
    ]
  }'::jsonb
FROM public.profiles p
WHERE p.email = 'tom.chillman@protonmail.com'
LIMIT 1;
