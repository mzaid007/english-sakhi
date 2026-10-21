/** Dual-script lesson text: English + Devanagari scaffold. */
export interface DualScript {
  en: string;
  phonetic_hi: string;
  hi: string;
}

/** Color role in the English Sakhi SVO frame. */
export type BlockRole = "who" | "action" | "where";

export interface SyntaxBlock extends DualScript {
  role: BlockRole;
  id: string;
}

/** Swappable action for substitution tables. */
export interface ActionOption extends DualScript {
  id: string;
  /** Decorative content emoji on the pill (not a UI icon). */
  emoji: string;
}

export interface SubstitutionLesson {
  id: string;
  day: number;
  title_hi: string;
  title_en: string;
  /** Visual pattern label — no academic jargon. */
  pattern_label: string;
  pattern_emoji: string;
  subject: SyntaxBlock;
  actions: ActionOption[];
  defaultActionId: string;
}
