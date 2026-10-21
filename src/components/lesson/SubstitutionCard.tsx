"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DualScriptText } from "@/components/common/DualScriptText";
import { day1Substitution } from "@/data/day1";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { ActionOption, DualScript, SubstitutionLesson } from "@/lib/types";

interface SubstitutionCardProps {
  lesson?: SubstitutionLesson;
}

const spring = { type: "spring" as const, stiffness: 420, damping: 26 };

function buildSentence(subject: DualScript, action: ActionOption): DualScript {
  return {
    en: `${subject.en} ${action.en}`,
    phonetic_hi: `${subject.phonetic_hi} ${action.phonetic_hi}`,
    hi: `${subject.hi} ${action.hi}`,
  };
}

/**
 * Wren & Martin–style substitution table:
 * tap green action pills to rebuild the sentence and hear it instantly.
 */
export function SubstitutionCard({
  lesson = day1Substitution,
}: SubstitutionCardProps) {
  const { speak, isSpeaking, isSupported, isReady } = useSpeechSynthesis();
  const [selectedId, setSelectedId] = useState(lesson.defaultActionId);
  const didAutoSpeak = useRef(false);

  useEffect(() => {
    setSelectedId(lesson.defaultActionId);
    didAutoSpeak.current = false;
  }, [lesson.id, lesson.defaultActionId]);

  const selected =
    lesson.actions.find((a) => a.id === selectedId) ?? lesson.actions[0];
  const sentence = buildSentence(lesson.subject, selected);
  const audioReady = isSupported && isReady;

  // Speak the default sentence once voices are ready.
  useEffect(() => {
    if (!audioReady || didAutoSpeak.current) return;
    didAutoSpeak.current = true;
    speak(sentence.en);
  }, [audioReady, speak, sentence.en]);

  function onSelect(action: ActionOption) {
    setSelectedId(action.id);
    if (audioReady) {
      speak(buildSentence(lesson.subject, action).en);
    }
  }

  return (
    <section
      aria-labelledby="substitution-heading"
      className="rounded-3xl bg-surface/80 p-5 shadow-soft ring-1 ring-stone-200/60 backdrop-blur-sm"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex min-h-touch items-center gap-1.5 rounded-full bg-sakhi-amber-soft px-3 font-hindi text-sm font-medium text-sakhi-amber"
          aria-hidden
        >
          <span>{lesson.pattern_emoji}</span>
          {lesson.pattern_label}
        </span>
        <h2
          id="substitution-heading"
          className="w-full font-hindi text-lg font-semibold text-sakhi-ink"
        >
          वाक्य बनाएँ — शब्द बदलें
        </h2>
        <p className="font-hindi text-sm text-sakhi-muted">
          हरे बटन पर टैप करें। सुनें, फिर दोहराएँ।
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2" aria-hidden>
        <span className="inline-flex min-h-touch items-center rounded-2xl bg-who-soft px-3 py-2 text-sm font-semibold text-amber-900 ring-1 ring-who/40">
          🟡 {lesson.subject.en}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={selected.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={spring}
            className="inline-flex min-h-touch items-center rounded-2xl bg-action-soft px-3 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-action/30"
          >
            🟢 {selected.en}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mb-6 rounded-2xl bg-cream px-4 py-4 ring-1 ring-stone-200/70">
        <AnimatePresence mode="wait">
          <motion.div
            key={sentence.en}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
          >
            <DualScriptText
              en={sentence.en}
              phonetic_hi={sentence.phonetic_hi}
              hi={sentence.hi}
              size="lg"
              onSpeak={speak}
              isSpeaking={isSpeaking}
              audioDisabled={!audioReady}
              speechSupported={isSupported}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mb-3 font-hindi text-sm font-medium text-sakhi-ink">
        क्या काम? — एक चुनें
      </p>

      <ul className="flex flex-col gap-3" role="listbox" aria-label="क्रिया चुनें">
        {lesson.actions.map((action) => {
          const isActive = action.id === selected.id;
          return (
            <li key={action.id} role="option" aria-selected={isActive}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={spring}
                onClick={() => onSelect(action)}
                className={`flex w-full min-h-touch cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakhi-emerald ${
                  isActive
                    ? "bg-sakhi-emerald text-white shadow-pill"
                    : "bg-white text-sakhi-ink ring-1 ring-stone-200 hover:bg-action-soft"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {action.emoji}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-sans text-base font-semibold leading-snug">
                    {action.en}
                  </span>
                  <span
                    className={`font-hindi text-sm leading-snug ${
                      isActive ? "text-emerald-50" : "text-sakhi-muted"
                    }`}
                  >
                    {action.hi}
                  </span>
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
