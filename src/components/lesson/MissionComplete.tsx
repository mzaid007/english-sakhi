"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";

interface MissionCompleteProps {
  day: number;
  titleHi: string;
  onPracticeAgain: () => void;
}

const spring = { type: "spring" as const, stiffness: 380, damping: 24 };

export function MissionComplete({
  day,
  titleHi,
  onPracticeAgain,
}: MissionCompleteProps) {
  return (
    <motion.section
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={spring}
      className="flex flex-col items-center gap-5 rounded-3xl bg-sakhi-emerald-soft px-5 py-8 text-center shadow-soft ring-1 ring-sakhi-emerald/25"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 0.08 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-sakhi-emerald text-white shadow-pill"
        aria-hidden
      >
        <Sparkles className="h-8 w-8" />
      </motion.div>

      <div className="flex flex-col gap-2">
        <p className="font-hindi text-2xl font-bold text-emerald-900">
          बहुत बढ़िया!
        </p>
        <p className="font-hindi text-base leading-relaxed text-sakhi-ink/90">
          दिन {day} का छोटा मिशन पूरा हो गया — {titleHi}।
        </p>
        <p className="font-hindi text-sm text-sakhi-muted">
          आपकी प्रगति इस फ़ोन पर सुरक्षित है। कल फिर मिलते हैं।
        </p>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        transition={spring}
        onClick={onPracticeAgain}
        className="flex min-h-touch w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-hindi text-base font-semibold text-sakhi-emerald ring-1 ring-sakhi-emerald/30 transition-colors hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakhi-emerald"
      >
        <RotateCcw className="h-5 w-5" aria-hidden />
        एक बार और अभ्यास करें
      </motion.button>
    </motion.section>
  );
}
