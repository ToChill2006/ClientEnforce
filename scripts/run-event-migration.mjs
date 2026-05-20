import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Drop old check constraint and add new one with in_progress + completed
const sql = `
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
  ALTER TABLE public.events
    ADD CONSTRAINT events_status_check
    CHECK (status IN ('planning','active','in_progress','completed','closed','archived'));
`;

const { error } = await supabase.rpc("exec_sql", { query: sql });
if (error) {
  // Try direct via postgrest
  console.log("RPC failed, trying direct:", error.message);
} else {
  console.log("Migration applied ✓");
}
