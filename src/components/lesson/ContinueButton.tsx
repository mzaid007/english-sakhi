"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ContinueButtonProps {
  onContinue?: () => void;
  label?: string;
}

const spring = { type: "spring" as const, stiffness: 400, damping: 22 };

/** Primary CTA — tap only, no typing. */
export function ContinueButton({
  onContinue,
  label = "आगे बढ़ें",
}: ContinueButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      onClick={onContinue}
      className="flex w-full min-h-touch cursor-pointer items-center justify-center gap-2 rounded-2xl bg-sakhi-emerald px-6 py-4 font-hindi text-lg font-semibold text-white shadow-pill transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakhi-emerald"
    >
      <Sparkles className="h-5 w-5" aria-hidden />
      {label}
    </motion.button>
  );
}
