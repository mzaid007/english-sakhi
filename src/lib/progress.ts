const STORAGE_KEY = "english-sakhi-progress";

export interface LocalProgress {
  streak: number;
  completedLessons: string[];
  currentDay: number;
  updatedAt: string;
}

export function emptyProgress(): LocalProgress {
  return {
    streak: 0,
    completedLessons: [],
    currentDay: 1,
    // Stable default — real timestamps are written on save (Cache Components safe).
    updatedAt: "",
  };
}

export function readProgress(): LocalProgress {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      currentDay:
        typeof parsed.currentDay === "number" && parsed.currentDay >= 1
          ? parsed.currentDay
          : 1,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(next: LocalProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/** Mark a lesson complete; bumps streak the first time that lesson is finished. */
export function completeLesson(lessonId: string, day: number): LocalProgress {
  const current = readProgress();
  const alreadyDone = current.completedLessons.includes(lessonId);
  const completedLessons = alreadyDone
    ? current.completedLessons
    : [...current.completedLessons, lessonId];

  const next: LocalProgress = {
    streak: alreadyDone ? current.streak : current.streak + 1,
    completedLessons,
    currentDay: Math.max(current.currentDay, Math.min(day + 1, 5)),
    updatedAt: new Date().toISOString(),
  };

  writeProgress(next);
  return next;
}

export function isLessonComplete(lessonId: string): boolean {
  return readProgress().completedLessons.includes(lessonId);
}

/** Union lessons + Math.max streak/day — never wipe offline progress. */
export function mergeProgress(
  local: LocalProgress,
  cloud: LocalProgress,
): LocalProgress {
  return {
    streak: Math.max(local.streak, cloud.streak),
    completedLessons: Array.from(
      new Set([...local.completedLessons, ...cloud.completedLessons]),
    ),
    currentDay: Math.max(local.currentDay, cloud.currentDay),
    updatedAt: new Date().toISOString(),
  };
}

export function progressFromCloud(row: {
  streak: number;
  completed_lessons: string[] | null;
  current_day: number;
  updated_at?: string;
}): LocalProgress {
  return {
    streak: row.streak ?? 0,
    completedLessons: row.completed_lessons ?? [],
    currentDay: row.current_day ?? 1,
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}
