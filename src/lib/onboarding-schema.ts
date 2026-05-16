import { z } from "zod";

// All supported requirement/field types.
// checkbox  = Feature 6: completion checkbox
// heading   = Feature 7: visual section heading (no interaction)
// payment   = Stripe payment requirement
// info      = Read-only description / info block
export const RequirementTypeSchema = z.enum([
  "text",
  "file",
  "signature",
  "multiple_choice",
  "checkbox",
  "heading",
  "payment",
  "info",
]);

export const TemplateRequirementSchema = z.object({
  type: RequirementTypeSchema,
  label: z.string().trim().min(1),
  is_required: z.boolean().default(true),
  sort_order: z.number().int().nonnegative().default(0),
  phase_number: z.number().int().positive().optional(),
  // file type: optional admin-provided form template (upload or link)
  attachment_path: z.string().nullish(),
  // multiple_choice: list of selectable options
  options: z.array(z.string()).optional(),

  // Feature 1: file upload vs link mode for form templates
  // "upload" = existing file-based attachment; "link" = clickable URL shown to client
  file_mode: z.enum(["upload", "link"]).optional(),
  link_url: z.string().nullish(),

  // Feature 2: allow multiple selections for multiple_choice
  allow_multi_select: z.boolean().optional(),

  // Feature 3: include an "Other" free-text option for multiple_choice
  include_other: z.boolean().optional(),

  // Feature 5: multi-line textarea instead of single-line input for text type
  multiline: z.boolean().optional(),

  // payment type fields
  payment_amount: z.number().nullish(),
  payment_currency: z.string().nullish(),
  payment_description: z.string().nullish(),

  // info type: read-only content block
  info_content: z.string().nullish(),

  // Phase 5.3: conditional visibility — opt-in, stored in metadata downstream
  visible_if: z
    .object({
      depends_on_label: z.string().min(1),
      equals: z.string().optional(),
      not_empty: z.boolean().optional(),
    })
    .nullish(),
});

export const PhaseDefSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1),
  default_deadline_offset_days: z.number().int().optional(),
});

export const TemplateDefinitionSchema = z.object({
  requirements: z.array(TemplateRequirementSchema).min(1),
  phases: z.array(PhaseDefSchema).optional(),
});

export type TemplateDefinition = z.infer<typeof TemplateDefinitionSchema>;

export const CreateOnboardingSchema = z.object({
  title: z.string().min(1),
  client: z.object({
    email: z.string().email(),
    full_name: z.string().min(1).optional(),
  }),
  template_id: z.string().uuid().optional(),
});

export const SendOnboardingSchema = z.object({
  onboarding_id: z.string().uuid(),
});

export const ClientAnswerSchema = z.object({
  token: z.string().min(10),
  requirement_id: z.string().uuid(),
  value_text: z.string().min(1),
});

export const ClientSignatureSchema = z.object({
  token: z.string().min(10),
  requirement_id: z.string().uuid(),
  data_url: z
    .string()
    .regex(/^data:image\/png;base64,/, "Expected a PNG data URL starting with data:image/png;base64,"),
});

export const ClientSubmitSchema = z.object({
  token: z.string().min(10),
});
