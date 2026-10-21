import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabasePublicConfig } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

/**
 * Browser / client-component Supabase client (anon key + RLS).
 * Returns null when env is not configured yet — app stays usable offline.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!hasSupabasePublicConfig()) return null;

  if (!browserClient) {
    browserClient = createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

/**
 * Server-only client with the service role key.
 * Prefer the anon client + RLS for user data; use this sparingly.
 */
export function getSupabaseServiceClient(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
