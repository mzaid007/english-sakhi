"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MissionComplete } from "@/components/lesson/MissionComplete";
import { Step1EarTraining } from "@/components/lesson/Step1EarTraining";
import { Step2Substitution } from "@/components/lesson/Step2Substitution";
import { Step3VoiceMission } from "@/components/lesson/Step3VoiceMission";
import { completeLesson } from "@/lib/progress";
import type { LessonDay } from "@/lib/types";

type Step = 1 | 2 | 3 | "done";

interface LessonPlayerProps {
  lesson: LessonDay;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [step, setStep] = useState<Step>(1);

  function finish() {
    completeLesson(lesson.id, lesson.day);
    setStep("done");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-10 pt-6 sm:px-5">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/"
          aria-label="होम पर जाएँ"
          className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-full bg-surface ring-1 ring-stone-200"
        >
          <ArrowLeft className="h-5 w-5 text-sakhi-ink" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-hindi text-xs text-sakhi-muted">दिन {lesson.day}</p>
          <h1 className="truncate font-hindi text-base font-semibold text-sakhi-ink">
            {lesson.title_hi}
          </h1>
        </div>
        {step !== "done" && (
          <div
            className="flex gap-1"
            aria-label={`चरण ${step} में से 3`}
          >
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={`h-2 w-6 rounded-full ${
                  n <= step ? "bg-sakhi-emerald" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {step === 1 && (
        <Step1EarTraining
          step={lesson.ear}
          patternLabel={lesson.pattern_label}
          patternEmoji={lesson.pattern_emoji}
          onContinue={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2Substitution lesson={lesson} onContinue={() => setStep(3)} />
      )}
      {step === 3 && (
        <Step3VoiceMission step={lesson.voice} onComplete={finish} />
      )}
      {step === "done" && (
        <MissionComplete
          day={lesson.day}
          titleHi={lesson.title_hi}
          onPracticeAgain={() => setStep(1)}
          homeHref="/"
        />
      )}
    </div>
  );
}
