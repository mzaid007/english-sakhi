/** Light helpers for Devanagari scaffold display (Rapidex-style stress hints). */

export function withStressHints(phonetic: string): string {
  return phonetic.replace(/-/g, "·");
}

export function joinPhonetic(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join(" ");
}
