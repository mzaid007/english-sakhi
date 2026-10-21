"use client";

import { DualScriptText } from "@/components/common/DualScriptText";
import { ContinueButton } from "@/components/lesson/ContinueButton";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { EarTrainingStep } from "@/lib/types";

interface Step1EarTrainingProps {
  step: EarTrainingStep;
  patternLabel: string;
  patternEmoji: string;
  onContinue: () => void;
}

export function Step1EarTraining({
  step,
  patternLabel,
  patternEmoji,
  onContinue,
}: Step1EarTrainingProps) {
  const { speak, isSpeaking, isSupported, isReady } = useSpeechSynthesis();

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-touch items-center gap-1.5 rounded-full bg-sakhi-amber-soft px-3 font-hindi text-sm font-medium text-sakhi-amber">
          <span aria-hidden>{patternEmoji}</span>
          {patternLabel}
        </span>
        <h2 className="w-full font-hindi text-lg font-semibold text-sakhi-ink">
          {step.prompt_hi}
        </h2>
      </div>

      <ul className="flex flex-col gap-4">
        {step.lines.map((line) => (
          <li
            key={line.en}
            className="rounded-2xl bg-cream px-4 py-4 ring-1 ring-stone-200/70"
          >
            <DualScriptText
              {...line}
              onSpeak={speak}
              isSpeaking={isSpeaking}
              audioDisabled={!isSupported || !isReady}
              speechSupported={isSupported}
            />
          </li>
        ))}
      </ul>

      <ContinueButton onContinue={onContinue} label="अगला चरण" />
    </section>
  );
}
