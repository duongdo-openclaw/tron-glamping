import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(url && anonKey);

function assertEnv() {
  if (!url || !anonKey) throw new Error("Missing Supabase env");
  return { url, anonKey };
}

export function createSupabaseBrowserClient() {
  const env = assertEnv();
  return createClient(env.url, env.anonKey);
}

export function createSupabaseServerClient() {
  const env = assertEnv();
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
