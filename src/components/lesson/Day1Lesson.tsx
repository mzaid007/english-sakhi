"use client";

import { useEffect, useState } from "react";
import { ContinueButton } from "@/components/lesson/ContinueButton";
import { MissionComplete } from "@/components/lesson/MissionComplete";
import { SubstitutionCard } from "@/components/lesson/SubstitutionCard";
import { day1Substitution } from "@/data/day1";
import { completeLesson, isLessonComplete } from "@/lib/progress";

type Phase = "practice" | "complete";

/**
 * Client shell for Day 1: practice → आगे बढ़ें → celebration + local save.
 */
export function Day1Lesson() {
  const [phase, setPhase] = useState<Phase>("practice");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (isLessonComplete(day1Substitution.id)) {
      setPhase("complete");
    }
    setHydrated(true);
  }, []);

  function handleContinue() {
    completeLesson(day1Substitution.id, day1Substitution.day);
    setPhase("complete");
  }

  function handlePracticeAgain() {
    setPhase("practice");
  }

  if (!hydrated) {
    return (
      <div
        className="min-h-[12rem] rounded-3xl bg-surface/50"
        aria-hidden
      />
    );
  }

  if (phase === "complete") {
    return (
      <MissionComplete
        day={day1Substitution.day}
        titleHi={day1Substitution.title_hi}
        onPracticeAgain={handlePracticeAgain}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SubstitutionCard />
      <ContinueButton onContinue={handleContinue} />
    </div>
  );
}
