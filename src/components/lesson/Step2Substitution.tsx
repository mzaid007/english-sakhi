"use client";

import { ContinueButton } from "@/components/lesson/ContinueButton";
import { SubstitutionCard } from "@/components/lesson/SubstitutionCard";
import type { LessonDay } from "@/lib/types";

interface Step2SubstitutionProps {
  lesson: LessonDay;
  onContinue: () => void;
}

export function Step2Substitution({
  lesson,
  onContinue,
}: Step2SubstitutionProps) {
  return (
    <div className="flex flex-col gap-6">
      <SubstitutionCard
        lesson={{
          id: lesson.id,
          day: lesson.day,
          title_hi: lesson.title_hi,
          title_en: lesson.title_en,
          pattern_label: lesson.pattern_label,
          pattern_emoji: lesson.pattern_emoji,
          ...lesson.substitution,
        }}
      />
      <ContinueButton onContinue={onContinue} label="बोलने का अभ्यास" />
    </div>
  );
}
