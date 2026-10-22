import type { ActionOption, DualScript, SyntaxBlock } from "@/lib/types";

/** Join the fixed block and the chosen pill into one sentence. */
export function composeSentence(
  subject: SyntaxBlock,
  action: ActionOption,
): DualScript {
  const end = action.en_end ?? "";
  const en = `${subject.en} ${action.en}${end}`.replace(/\s+/g, " ").trim();
  const phonetic = action.phonetic_sentence_hi
    ? action.phonetic_sentence_hi
    : `${subject.phonetic_hi} ${action.phonetic_hi}${end}`;
  const hi = action.hi_sentence ?? `${subject.hi} ${action.hi}`;

  return {
    en,
    phonetic_hi: phonetic.replace(/\s+/g, " ").trim(),
    hi: hi.replace(/\s+/g, " ").trim(),
  };
}
