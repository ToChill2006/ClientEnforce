import { supabaseAdmin } from "@/lib/supabase-admin";

export type AuditEvent = {
  org_id: string;
  actor_user_id?: string | null;
  actor_email?: string | null;
  actor_role?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  onboarding_id?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logAudit(e: AuditEvent): Promise<void> {
  try {
    await supabaseAdmin().from("audit_logs").insert({
      org_id: e.org_id,
      actor_user_id: e.actor_user_id ?? null,
      actor_email: e.actor_email ?? null,
      actor_role: e.actor_role ?? null,
      action: e.action,
      entity_type: e.entity_type ?? null,
      entity_id: e.entity_id ?? null,
      onboarding_id: e.onboarding_id ?? null,
      metadata: e.metadata ?? {},
    });
  } catch (err) {
    console.warn("[audit] logAudit failed", err);
  }
}
