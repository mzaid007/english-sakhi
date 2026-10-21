"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import { SyncBanner } from "@/components/sync/SyncBanner";
import { SyncModal } from "@/components/sync/SyncModal";
import { curriculum } from "@/data/curriculum";
import { useProgressSync } from "@/hooks/useProgressSync";

const spring = { type: "spring" as const, stiffness: 380, damping: 26 };

export function HomeDashboard() {
  const {
    progress,
    isSynced,
    refreshLocal,
    pushAndPull,
    userEmail,
    signOut,
    lastSyncMessageHi,
  } = useProgressSync();
  const [syncOpen, setSyncOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [statusHi, setStatusHi] = useState<string | null>(null);

  useEffect(() => {
    refreshLocal();
    setHydrated(true);
  }, [refreshLocal]);

  useEffect(() => {
    if (lastSyncMessageHi) setStatusHi(lastSyncMessageHi);
  }, [lastSyncMessageHi]);

  async function handleSynced() {
    const result = await pushAndPull();
    setStatusHi(result.message_hi);
    refreshLocal();
  }

  const showBanner =
    hydrated && !isSynced && progress.completedLessons.length > 0;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col lg:flex-row lg:items-stretch lg:gap-10 lg:px-8 lg:py-10">
      <aside className="hidden flex-col justify-center lg:flex lg:w-[min(42%,24rem)] lg:shrink-0">
        <p className="font-hindi text-base font-medium text-sakhi-amber">
          इंग्लिश सखी
        </p>
        <h1 className="mt-1 font-display text-5xl font-bold leading-[1.1] tracking-tight text-sakhi-ink">
          English Sakhi
        </h1>
        <p className="mt-4 max-w-sm font-hindi text-lg leading-relaxed text-sakhi-muted">
          रोज़ थोड़ी देर — सुनो, बोलो, आगे बढ़ो।
        </p>
        {userEmail && (
          <p className="mt-6 font-hindi text-sm text-sakhi-muted">
            सिंक: {userEmail}
          </p>
        )}
      </aside>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-10 pt-6 sm:px-5 lg:mx-0 lg:rounded-[1.75rem] lg:bg-surface/70 lg:p-6 lg:shadow-soft lg:ring-1 lg:ring-stone-200/70">
        <Header
          streak={hydrated ? progress.streak : 0}
          isSynced={isSynced}
          onSyncClick={() => setSyncOpen(true)}
        />

        <SyncBanner
          visible={showBanner}
          onOpenSync={() => setSyncOpen(true)}
        />

        {statusHi && (
          <p className="mb-3 font-hindi text-sm text-sakhi-emerald" role="status">
            {statusHi}
          </p>
        )}

        <h2 className="mb-3 font-hindi text-lg font-semibold text-sakhi-ink">
          आपके मिशन
        </h2>

        <ul className="flex flex-col gap-3">
          {curriculum.map((lesson, index) => {
            const done = progress.completedLessons.includes(lesson.id);
            const unlocked =
              index === 0 ||
              progress.completedLessons.includes(curriculum[index - 1].id) ||
              lesson.day <= progress.currentDay;
            const isNext =
              !done && unlocked && lesson.day === progress.currentDay;

            return (
              <li key={lesson.id}>
                {unlocked ? (
                  <motion.div whileTap={{ scale: 0.98 }} transition={spring}>
                    <Link
                      href={`/lesson/${lesson.id}`}
                      className={`flex min-h-touch items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-colors ${
                        isNext
                          ? "bg-sakhi-emerald text-white ring-sakhi-emerald shadow-pill"
                          : done
                            ? "bg-sakhi-emerald-soft text-sakhi-ink ring-sakhi-emerald/20"
                            : "bg-white text-sakhi-ink ring-stone-200"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                          isNext
                            ? "bg-white/20 text-white"
                            : "bg-sakhi-emerald text-white"
                        }`}
                      >
                        {done ? <Check className="h-5 w-5" /> : lesson.day}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block font-hindi text-base font-semibold leading-snug">
                          {lesson.title_hi}
                        </span>
                        <span
                          className={`block text-xs ${
                            isNext ? "text-emerald-50" : "text-sakhi-muted"
                          }`}
                        >
                          {lesson.pattern_emoji} {lesson.pattern_label}
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="flex min-h-touch items-center gap-3 rounded-2xl bg-surface/80 px-4 py-3 opacity-70 ring-1 ring-stone-200/60">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-sakhi-muted">
                      <Lock className="h-4 w-4" />
                    </span>
                    <span className="font-hindi text-sm text-sakhi-muted">
                      दिन {lesson.day} — पहले वाला मिशन पूरा करें
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <SyncModal
        open={syncOpen}
        onClose={() => setSyncOpen(false)}
        onSynced={() => void handleSynced()}
        isSynced={isSynced}
        userEmail={userEmail}
        onSignOut={signOut}
        onSignedOut={() => {
          setStatusHi("क्लाउड बंद हो गया। इस फ़ोन की प्रगति सुरक्षित है।");
          refreshLocal();
        }}
      />
    </div>
  );
}
