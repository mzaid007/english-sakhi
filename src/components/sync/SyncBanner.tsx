"use client";

import { Cloud } from "lucide-react";
import { motion } from "framer-motion";

interface SyncBannerProps {
  visible: boolean;
  onOpenSync: () => void;
}

/** Gentle non-blocking nudge to back up progress. */
export function SyncBanner({ visible, onOpenSync }: SyncBannerProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-center gap-3 rounded-2xl bg-sakhi-amber-soft px-4 py-3 ring-1 ring-sakhi-amber/25"
    >
      <Cloud className="h-5 w-5 shrink-0 text-sakhi-amber" aria-hidden />
      <p className="flex-1 font-hindi text-sm leading-snug text-sakhi-ink">
        प्रगति इस फ़ोन पर है। चाहें तो क्लाउड में भी सुरक्षित करें।
      </p>
      <button
        type="button"
        onClick={onOpenSync}
        className="min-h-touch shrink-0 cursor-pointer rounded-xl bg-white px-3 font-hindi text-sm font-semibold text-sakhi-amber ring-1 ring-sakhi-amber/30"
      >
        सुरक्षित करें
      </button>
    </motion.div>
  );
}
