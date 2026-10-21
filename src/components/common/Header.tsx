"use client";

import { Cloud, Flame } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  streak: number;
  isSynced: boolean;
  onSyncClick: () => void;
}

export function Header({ streak, isSynced, onSyncClick }: HeaderProps) {
  return (
    <header className="mb-5 flex items-center justify-between gap-3">
      <Link href="/" className="min-h-touch min-w-0">
        <p className="font-hindi text-sm font-medium text-sakhi-amber">
          इंग्लिश सखी
        </p>
        <p className="font-display text-xl font-bold tracking-tight text-sakhi-ink">
          English Sakhi
        </p>
      </Link>

      <div className="flex items-center gap-2">
        <div
          className="inline-flex min-h-touch items-center gap-1.5 rounded-full bg-sakhi-amber-soft px-3 ring-1 ring-sakhi-amber/20"
          aria-label={`स्ट्रीक ${streak} दिन`}
        >
          <Flame className="h-4 w-4 text-sakhi-amber" aria-hidden />
          <span className="font-display text-sm font-bold text-sakhi-ink">
            {streak}
          </span>
        </div>

        <button
          type="button"
          onClick={onSyncClick}
          aria-label={isSynced ? "क्लाउड सिंक हुआ" : "क्लाउड सिंक खोलें"}
          className={`inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center rounded-full ring-1 ${
            isSynced
              ? "bg-sakhi-emerald-soft text-sakhi-emerald ring-sakhi-emerald/30"
              : "bg-white text-sakhi-muted ring-stone-200"
          }`}
        >
          <Cloud className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
