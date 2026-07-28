import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function getSupabaseEnv() {
  const url = (import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();
  return { url, key, configured: Boolean(url && key) };
}

export function isSupabaseConfigured() {
  return getSupabaseEnv().configured;
}

function createSupabaseClient(): SupabaseClient<Database> {
  const { url, key, configured } = getSupabaseEnv();
  if (!configured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env",
    );
  }
  return createClient<Database>(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: SupabaseClient<Database> | undefined;

/** Lazily created client — only call when `isSupabaseConfigured()` is true. */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
