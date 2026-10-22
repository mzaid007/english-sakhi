"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MissionComplete } from "@/components/lesson/MissionComplete";
import { Step1EarTraining } from "@/components/lesson/Step1EarTraining";
import { Step2Substitution } from "@/components/lesson/Step2Substitution";
import { Step3VoiceMission } from "@/components/lesson/Step3VoiceMission";
import { curriculum, voiceForChoice } from "@/data/curriculum";
import {
  clearLessonPlace,
  readLessonPlace,
  writeLessonPlace,
} from "@/lib/lessonPlace";
import { completeLesson, isLessonUnlocked, readProgress } from "@/lib/progress";
import type { LessonDay } from "@/lib/types";

type Step = 1 | 2 | 3 | "done";

interface LessonPlayerProps {
  lesson: LessonDay;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [step, setStep] = useState<Step>(1);
  const [actionId, setActionId] = useState(lesson.substitution.defaultActionId);
  const [hydrated, setHydrated] = useState(false);
  const [locked, setLocked] = useState(false);
  const restoredId = useRef<string | null>(null);

  useEffect(() => {
    if (restoredId.current === lesson.id) return;
    restoredId.current = lesson.id;

    const index = curriculum.findIndex((item) => item.id === lesson.id);
    const previous = index > 0 ? curriculum[index - 1] : null;
    const progress = readProgress();
    const open = isLessonUnlocked(
      index,
      lesson.day,
      progress,
      previous?.id ?? null,
    );
    setLocked(!open);

    const known = new Set(lesson.substitution.actions.map((action) => action.id));
    const place = readLessonPlace(lesson.id);
    if (place && known.has(place.actionId)) {
      setStep(place.step);
      setActionId(place.actionId);
    } else {
      setStep(1);
      setActionId(lesson.substitution.defaultActionId);
    }
    setHydrated(true);
  }, [lesson]);

  useEffect(() => {
    if (!hydrated || locked || step === "done") return;
    writeLessonPlace(lesson.id, { step, actionId });
  }, [hydrated, locked, step, actionId, lesson.id]);

  function finish() {
    completeLesson(lesson.id, lesson.day);
    clearLessonPlace(lesson.id);
    setStep("done");
  }

  const voice = voiceForChoice(lesson, actionId);
  const nextLineHi =
    lesson.day < curriculum.length
      ? "अगला मिशन होम पर तैयार है।"
      : "पाँचों मिशन पूरे। जब चाहें इन्हें दोहराएँ।";

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
        {hydrated && !locked && step !== "done" && (
          <div className="flex gap-1" aria-label={`चरण ${step} में से 3`}>
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

      {!hydrated && (
        <p className="font-hindi text-base text-sakhi-muted">पाठ लोड हो रहा है…</p>
      )}

      {hydrated && locked && (
        <section className="rounded-3xl bg-surface px-5 py-6 ring-1 ring-stone-200/70">
          <h2 className="font-hindi text-lg font-semibold text-sakhi-ink">
            यह मिशन अभी बंद है
          </h2>
          <p className="mt-2 font-hindi text-base leading-relaxed text-sakhi-muted">
            पहले वाला मिशन पूरा करें। फिर यह अपने आप खुल जाएगा।
          </p>
          <Link
            href="/"
            className="mt-5 flex min-h-touch w-full items-center justify-center rounded-2xl bg-sakhi-emerald font-hindi text-base font-semibold text-white"
          >
            होम पर जाएँ
          </Link>
        </section>
      )}

      {hydrated && !locked && step === 1 && (
        <Step1EarTraining
          step={lesson.ear}
          patternLabel={lesson.pattern_label}
          patternEmoji={lesson.pattern_emoji}
          onContinue={() => setStep(2)}
        />
      )}
      {hydrated && !locked && step === 2 && (
        <Step2Substitution
          lesson={lesson}
          selectedId={actionId}
          onSelectedId={setActionId}
          onContinue={() => setStep(3)}
        />
      )}
      {hydrated && !locked && step === 3 && (
        <Step3VoiceMission step={voice} onComplete={finish} />
      )}
      {hydrated && !locked && step === "done" && (
        <MissionComplete
          day={lesson.day}
          titleHi={lesson.title_hi}
          nextLineHi={nextLineHi}
          onPracticeAgain={() => {
            setActionId(lesson.substitution.defaultActionId);
            setStep(1);
          }}
          homeHref="/"
        />
      )}
    </div>
  );
}
