import { supabaseAdmin } from "@/lib/supabase-admin";

// Checks all onboardings for an event and updates the event's status:
//   - all completed           → "completed"
//   - any not draft           → "in_progress"
//   - all draft / none exist  → stays "planning" (no change if already planning)
export async function syncEventStatus(eventId: string): Promise<void> {
  if (!eventId) return;
  const admin = supabaseAdmin();

  const { data: onboardings } = await admin
    .from("onboardings")
    .select("status")
    .eq("event_id", eventId);

  if (!onboardings || onboardings.length === 0) return;

  const statuses = onboardings.map((o) => (o as any).status as string);
  const allCompleted = statuses.every((s) => s === "completed");
  const anyActive = statuses.some((s) => s !== "draft");

  const newStatus = allCompleted ? "completed" : anyActive ? "in_progress" : null;
  if (!newStatus) return; // all draft → leave event as planning

  const { data: event } = await admin
    .from("events")
    .select("status")
    .eq("id", eventId)
    .single();

  // Don't downgrade — e.g. don't move completed back to in_progress on re-open
  const currentStatus = (event as any)?.status ?? "planning";
  if (
    (newStatus === "in_progress" && currentStatus === "completed") ||
    currentStatus === newStatus
  ) return;

  await admin
    .from("events")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", eventId);
}
