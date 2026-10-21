import { getLessonByDay } from "@/data/curriculum";
import type { SubstitutionLesson } from "@/lib/types";

/** Back-compat wrapper — Day 1 substitution table from curriculum. */
export const day1Substitution: SubstitutionLesson = (() => {
  const lesson = getLessonByDay(1)!;
  return {
    id: lesson.id,
    day: lesson.day,
    title_hi: lesson.title_hi,
    title_en: lesson.title_en,
    pattern_label: lesson.pattern_label,
    pattern_emoji: lesson.pattern_emoji,
    ...lesson.substitution,
  };
})();
