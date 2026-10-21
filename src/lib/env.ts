/**
 * Central env accessors.
 * NEXT_PUBLIC_* must use static `process.env.NEXT_PUBLIC_…` access so Next.js
 * can inline them into the client bundle at build time. Dynamic `process.env[name]`
 * breaks production (keys look "missing" even when set on Vercel).
 */

function trim(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export const env = {
  supabaseUrl: trim(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  /** Server-only. Never expose to the client bundle. */
  supabaseServiceRoleKey: trim(process.env.SUPABASE_SERVICE_ROLE_KEY),
  geminiApiKey: trim(process.env.GEMINI_API_KEY),
  groqApiKey: trim(process.env.GROQ_API_KEY),
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
