"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/common/Header";
import { SyncBanner } from "@/components/sync/SyncBanner";
import { SyncModal } from "@/components/sync/SyncModal";
import { curriculum } from "@/data/curriculum";
import { useProgressSync } from "@/hooks/useProgressSync";
import { isLessonUnlocked } from "@/lib/progress";

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
  const router = useRouter();
  const [syncOpen, setSyncOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [statusHi, setStatusHi] = useState<string | null>(null);

  useEffect(() => {
    refreshLocal();
    setHydrated(true);
  }, [refreshLocal]);

  useEffect(() => {
    for (const lesson of curriculum) {
      router.prefetch(`/lesson/${lesson.id}`);
    }
  }, [router]);

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

        <p className="mb-4 font-hindi text-base leading-relaxed text-sakhi-muted lg:hidden">
          रोज़ थोड़ी देर — सुनो, बोलो, आगे बढ़ो।
        </p>

        <SyncBanner
          visible={showBanner}
          onOpenSync={() => setSyncOpen(true)}
        />

        {statusHi && (
          <p className="mb-3 font-hindi text-sm text-sakhi-emerald" role="status">
            {statusHi}
          </p>
        )}

        {hydrated &&
          curriculum.every((lesson) =>
            progress.completedLessons.includes(lesson.id),
          ) && (
            <section className="mb-4 rounded-2xl bg-sakhi-emerald-soft px-4 py-4 ring-1 ring-sakhi-emerald/20">
              <h2 className="font-hindi text-base font-semibold text-emerald-900">
                पाँचों मिशन पूरे
              </h2>
              <p className="mt-1 font-hindi text-sm leading-relaxed text-sakhi-ink">
                इस कोर्स का नया दिन अभी नहीं है। किसी भी मिशन को फिर से खोलकर
                सुनें और बोलें।
              </p>
              <Link
                href="/lesson/day-1"
                className="mt-3 inline-flex min-h-touch items-center font-hindi text-sm font-semibold text-sakhi-emerald"
              >
                दिन 1 फिर से सुनें
              </Link>
            </section>
          )}

        <h2 className="mb-3 font-hindi text-lg font-semibold text-sakhi-ink">
          आपके मिशन
        </h2>

        <ul className="flex flex-col gap-3">
          {curriculum.map((lesson, index) => {
            const done = progress.completedLessons.includes(lesson.id);
            const previous = index > 0 ? curriculum[index - 1] : null;
            const unlocked = isLessonUnlocked(
              index,
              lesson.day,
              progress,
              previous?.id ?? null,
            );
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
                  <button
                    type="button"
                    onClick={() =>
                      setStatusHi(
                        `दिन ${lesson.day} अभी बंद है — पहले वाला मिशन पूरा करें।`,
                      )
                    }
                    className="flex min-h-touch w-full cursor-pointer items-center gap-3 rounded-2xl bg-surface/80 px-4 py-3 text-left opacity-70 ring-1 ring-stone-200/60"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-sakhi-muted">
                      <Lock className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="font-hindi text-sm text-sakhi-muted">
                      दिन {lesson.day} — पहले वाला मिशन पूरा करें
                    </span>
                  </button>
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
