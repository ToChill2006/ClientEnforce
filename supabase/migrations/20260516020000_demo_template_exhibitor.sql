-- Insert a demo "Event Exhibitor Onboarding" template for Tom's org.
-- Showcases every available requirement type across 3 phases.

INSERT INTO public.templates (org_id, name, definition)
SELECT
  p.org_id,
  'Event Exhibitor Onboarding (Demo)',
  '{
    "phases": [
      { "number": 1, "name": "Welcome & Payment",     "default_deadline_offset_days": 7  },
      { "number": 2, "name": "Stand & Brand Details", "default_deadline_offset_days": 14 },
      { "number": 3, "name": "Documents & Sign-off",  "default_deadline_offset_days": 21 }
    ],
    "requirements": [
      {
        "type": "heading",
        "label": "Welcome to the Exhibitor Portal",
        "is_required": false,
        "sort_order": 0,
        "phase_number": 1
      },
      {
        "type": "info",
        "label": "",
        "is_required": false,
        "sort_order": 1,
        "phase_number": 1,
        "info_content": "Thanks for joining us as an exhibitor! Please complete each phase before the deadlines shown. If you have any questions reply to your invitation email and a member of our team will be in touch."
      },
      {
        "type": "payment",
        "label": "Exhibitor Stand Fee",
        "is_required": true,
        "sort_order": 2,
        "phase_number": 1,
        "payment_amount": 499.00,
        "payment_currency": "GBP",
        "payment_description": "Includes a 3x2 m shell-scheme stand, fascia board, two exhibitor passes, and Wi-Fi for the event."
      },
      {
        "type": "heading",
        "label": "Your Company",
        "is_required": false,
        "sort_order": 3,
        "phase_number": 2
      },
      {
        "type": "text",
        "label": "Company Name",
        "is_required": true,
        "sort_order": 4,
        "phase_number": 2
      },
      {
        "type": "text",
        "label": "Website URL",
        "is_required": false,
        "sort_order": 5,
        "phase_number": 2
      },
      {
        "type": "text",
        "label": "On-site Contact Name",
        "is_required": true,
        "sort_order": 6,
        "phase_number": 2
      },
      {
        "type": "text",
        "label": "On-site Contact Phone",
        "is_required": true,
        "sort_order": 7,
        "phase_number": 2
      },
      {
        "type": "heading",
        "label": "Stand Setup",
        "is_required": false,
        "sort_order": 8,
        "phase_number": 2
      },
      {
        "type": "multiple_choice",
        "label": "Stand Type",
        "is_required": true,
        "sort_order": 9,
        "phase_number": 2,
        "options": ["Shell scheme (included)", "Space only", "Island stand (pre-approval required)"]
      },
      {
        "type": "multiple_choice",
        "label": "Additional Extras",
        "is_required": false,
        "sort_order": 10,
        "phase_number": 2,
        "allow_multi_select": true,
        "include_other": true,
        "options": ["Extra exhibitor pass (+£40)", "Lockable storage unit (+£30)", "Premium carpet upgrade (+£20)", "Monitor hire 27\" (+£60)"]
      },
      {
        "type": "text",
        "label": "Stand Description / What You will Be Showcasing",
        "is_required": false,
        "sort_order": 11,
        "phase_number": 2,
        "multiline": true
      },
      {
        "type": "file",
        "label": "Company Logo (PNG or SVG)",
        "is_required": true,
        "sort_order": 12,
        "phase_number": 2
      },
      {
        "type": "heading",
        "label": "Health & Safety",
        "is_required": false,
        "sort_order": 13,
        "phase_number": 3
      },
      {
        "type": "info",
        "label": "",
        "is_required": false,
        "sort_order": 14,
        "phase_number": 3,
        "info_content": "All exhibitors must confirm they have read the venue Health & Safety guidelines and hold valid public liability insurance. Please upload your certificate and complete the sign-off below."
      },
      {
        "type": "file",
        "label": "Public Liability Insurance Certificate",
        "is_required": true,
        "sort_order": 15,
        "phase_number": 3
      },
      {
        "type": "checkbox",
        "label": "I confirm I have read and agree to the Health & Safety guidelines",
        "is_required": true,
        "sort_order": 16,
        "phase_number": 3
      },
      {
        "type": "checkbox",
        "label": "I confirm all stand materials comply with the venue fire safety regulations",
        "is_required": true,
        "sort_order": 17,
        "phase_number": 3
      },
      {
        "type": "signature",
        "label": "Exhibitor Agreement - Authorised Signature",
        "is_required": true,
        "sort_order": 18,
        "phase_number": 3
      }
    ]
  }'::jsonb
FROM public.profiles p
WHERE p.email = 'tom.chillman@protonmail.com'
LIMIT 1;
