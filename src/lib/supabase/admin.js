import { createClient } from "@supabase/supabase-js";

// Cliente con la service_role key: se salta RLS por completo. Úsalo SOLO
// en código server-only (Server Actions, Route Handlers) y solo para lo
// que de verdad lo requiere (ej. invitar usuarios via Supabase Auth Admin
// API) — nunca lo importes desde un Client Component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
