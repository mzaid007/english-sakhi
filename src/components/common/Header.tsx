"use client";

import { Cloud, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  streak: number;
  isSynced: boolean;
  onSyncClick: () => void;
}

export function Header({ streak, isSynced, onSyncClick }: HeaderProps) {
  return (
    <header className="mb-5 flex items-center justify-between gap-3">
      <Link href="/" className="flex min-h-touch min-w-0 items-center gap-2.5">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-xl"
          priority
        />
        <span className="min-w-0">
          <span className="block font-hindi text-sm font-medium text-sakhi-amber">
            इंग्लिश सखी
          </span>
          <span className="block font-display text-xl font-bold tracking-tight text-sakhi-ink">
            English Sakhi
          </span>
        </span>
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
          aria-label={
            isSynced ? "क्लाउड सिंक — खाता देखें या बंद करें" : "क्लाउड सिंक खोलें"
          }
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
