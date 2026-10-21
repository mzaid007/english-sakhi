/**
 * Central env accessors. Missing keys return undefined so Day 1
 * (local-only, no login) still runs; Phase 2/3 features check before use.
 */

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export const env = {
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  /** Server-only. Never expose to the client bundle. */
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  geminiApiKey: read("GEMINI_API_KEY"),
  groqApiKey: read("GROQ_API_KEY"),
} as const;

export function hasSupabasePublicConfig(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasGemini(): boolean {
  return Boolean(env.geminiApiKey);
}

export function hasGroq(): boolean {
  return Boolean(env.groqApiKey);
}
