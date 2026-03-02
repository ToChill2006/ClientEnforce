import { z } from "zod";

export const RequirementTypeSchema = z.enum(["text", "file", "signature"]);

export const TemplateRequirementSchema = z.object({
  type: RequirementTypeSchema,
  label: z.string().min(1),
  is_required: z.boolean().default(true),
  sort_order: z.number().int().nonnegative().default(0),
});

export const TemplateDefinitionSchema = z.object({
  requirements: z.array(TemplateRequirementSchema).min(1),
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