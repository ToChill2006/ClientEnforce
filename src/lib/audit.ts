// src/lib/audit.ts
import { supabaseAdmin } from "@/lib/supabase-admin";

type AuditEvent = {
  org_id: string;
  actor_user_id?: string | null;
  actor_email?: string | null;
  actor_role?: string | null;

  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  onboarding_id?: string | null;

  meta?: Record<string, any>;
};

export async function logAudit(e: AuditEvent) {
  try {
    await supabaseAdmin().from("audit_events").insert({
      org_id: e.org_id,
      actor_user_id: e.actor_user_id ?? null,
      actor_email: e.actor_email ?? null,
      actor_role: e.actor_role ?? null,
      action: e.action,
      entity_type: e.entity_type ?? null,
      entity_id: e.entity_id ?? null,
      onboarding_id: e.onboarding_id ?? null,
      meta: e.meta ?? {},
    });
  } catch (err) {
    // never break core flows because audit logging failed
    console.warn("[audit] logAudit failed", err);
  }
}