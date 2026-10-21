"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { DualScriptText } from "@/components/common/DualScriptText";
import { ContinueButton } from "@/components/lesson/ContinueButton";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { SpeakEvalResult, VoiceMissionStep } from "@/lib/types";

interface Step3VoiceMissionProps {
  step: VoiceMissionStep;
  onComplete: () => void;
}

const spring = { type: "spring" as const, stiffness: 420, damping: 26 };

export function Step3VoiceMission({
  step,
  onComplete,
}: Step3VoiceMissionProps) {
  const { speak, isSpeaking, isSupported, isReady } = useSpeechSynthesis();
  const recognition = useSpeechRecognition();
  const [feedback, setFeedback] = useState<SpeakEvalResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  async function evaluate() {
    const transcript = recognition.transcript.trim();
    if (!transcript) {
      setFeedback({
        understood: false,
        praise_hi: "बहुत बढ़िया कोशिश! पहले माइक दबाकर बोलें।",
        tip_hi: "शांत जगह पर एक वाक्य साफ़ बोलें।",
        model_en: step.target.en,
      });
      return;
    }

    setEvaluating(true);
    try {
      const res = await fetch("/api/speak-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          targetEn: step.target.en,
          targetHi: step.target.hi,
        }),
      });
      const data = (await res.json()) as SpeakEvalResult;
      setFeedback(data);
      if (data.model_en) speak(data.model_en);
    } catch {
      setFeedback({
        understood: true,
        praise_hi: "बहुत बढ़िया कोशिश! एक बार ऐसे सुनकर दोहराएँ।",
        tip_hi: "नेट धीमा हो तो भी अभ्यास जारी रखें।",
        model_en: step.target.en,
      });
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-hindi text-lg font-semibold text-sakhi-ink">
          {step.prompt_hi}
        </h2>
        <p className="mt-1 font-hindi text-sm text-sakhi-muted">
          {step.context_hi}
        </p>
      </div>

      <div className="rounded-2xl bg-cream px-4 py-4 ring-1 ring-stone-200/70">
        <DualScriptText
          {...step.target}
          onSpeak={speak}
          isSpeaking={isSpeaking}
          audioDisabled={!isSupported || !isReady}
          speechSupported={isSupported}
        />
      </div>

      <div className="flex flex-col items-center gap-3 py-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() =>
            recognition.isListening ? recognition.stop() : recognition.start()
          }
          disabled={!recognition.isSupported}
          aria-pressed={recognition.isListening}
          aria-label={
            recognition.isListening ? "सुनना बंद करें" : "बोलना शुरू करें"
          }
          className={`relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full text-white shadow-pill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakhi-emerald disabled:cursor-not-allowed disabled:opacity-50 ${
            recognition.isListening
              ? "bg-sakhi-coral"
              : "bg-sakhi-emerald hover:bg-emerald-700"
          }`}
        >
          {recognition.isListening && (
            <span className="absolute inset-0 animate-ping rounded-full bg-sakhi-coral/40" />
          )}
          <Mic className="relative h-10 w-10" aria-hidden />
        </motion.button>
        <p className="font-hindi text-sm text-sakhi-muted">
          {recognition.isListening
            ? "सुन रहे हैं… बोलकर छोड़ें"
            : "बड़े माइक पर टैप करें"}
        </p>
      </div>

      {recognition.transcript && (
        <p className="rounded-2xl bg-surface px-4 py-3 font-sans text-base text-sakhi-ink ring-1 ring-stone-200/60">
          <span className="font-hindi text-xs text-sakhi-muted">आपने कहा: </span>
          {recognition.transcript}
        </p>
      )}

      {recognition.errorHi && (
        <p className="font-hindi text-sm text-sakhi-amber" role="status">
          {recognition.errorHi}
        </p>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={evaluating}
        onClick={() => void evaluate()}
        className="flex min-h-touch w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sakhi-amber px-4 font-hindi text-base font-semibold text-white disabled:opacity-60"
      >
        <Sparkles className="h-5 w-5" aria-hidden />
        {evaluating ? "सुनकर जाँच हो रही है…" : "जाँचें"}
      </motion.button>

      {feedback && (
        <div
          className="rounded-2xl bg-sakhi-emerald-soft px-4 py-4 ring-1 ring-sakhi-emerald/20"
          role="status"
        >
          <p className="font-hindi text-base font-semibold text-emerald-900">
            {feedback.praise_hi}
          </p>
          <p className="mt-1 font-hindi text-sm text-sakhi-ink/90">
            {feedback.tip_hi}
          </p>
        </div>
      )}

      <ContinueButton
        onContinue={onComplete}
        label={feedback ? "मिशन पूरा करें" : "बाद में पूरा करें"}
      />
    </section>
  );
}
