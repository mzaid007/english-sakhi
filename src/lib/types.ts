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

export interface SubstitutionTable {
  subject: SyntaxBlock;
  actions: ActionOption[];
  defaultActionId: string;
}

/** @deprecated Prefer LessonDay.substitution — kept for older imports. */
export interface SubstitutionLesson extends SubstitutionTable {
  id: string;
  day: number;
  title_hi: string;
  title_en: string;
  pattern_label: string;
  pattern_emoji: string;
}

export interface EarTrainingStep {
  prompt_hi: string;
  lines: DualScript[];
}

export interface VoiceMissionStep {
  prompt_hi: string;
  context_hi: string;
  target: DualScript;
}

export interface LessonDay {
  id: string;
  day: number;
  title_hi: string;
  title_en: string;
  pattern_label: string;
  pattern_emoji: string;
  ear: EarTrainingStep;
  substitution: SubstitutionTable;
  voice: VoiceMissionStep;
}

export interface SpeakEvalRequest {
  transcript: string;
  targetEn: string;
  targetHi: string;
}

export interface SpeakEvalResult {
  praise_hi: string;
  tip_hi: string;
  model_en: string;
  understood: boolean;
}

export interface CloudProgressRow {
  user_id: string;
  streak: number;
  completed_lessons: string[];
  current_day: number;
  updated_at: string;
}
