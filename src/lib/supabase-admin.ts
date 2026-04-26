import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Admin client (server-side).
 *
 * Preferred: SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
 * Fallback: anon key (requires RLS/policies to allow the needed operations).
 */
export function createSupabaseAdminClient() {
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");

  const key = serviceRole || anonKey;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
