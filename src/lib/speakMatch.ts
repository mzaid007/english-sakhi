const FILLERS = new Set([
  "um",
  "uh",
  "uhh",
  "hmm",
  "hm",
  "er",
  "ah",
  "eh",
  "mmm",
]);

/** Words a learner actually said, without punctuation or hesitation sounds. */
export function speechTokens(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !FILLERS.has(word));
}

/**
 * True only when the spoken words are the target sentence.
 * A shared word ("tea", "bill") is not enough.
 */
export function speechMatchesTarget(
  transcript: string,
  targetEn: string,
): boolean {
  const said = speechTokens(transcript);
  const target = speechTokens(targetEn);
  if (said.length === 0 || target.length === 0) return false;
  if (said.length !== target.length) return false;
  return said.every((word, index) => word === target[index]);
}
