const STORAGE_KEY = "english-sakhi-progress";

export interface LocalProgress {
  streak: number;
  completedLessons: string[];
  currentDay: number;
  updatedAt: string;
}

function emptyProgress(): LocalProgress {
  return {
    streak: 0,
    completedLessons: [],
    currentDay: 1,
    updatedAt: new Date().toISOString(),
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
        ? parsed.completedLessons.filter((id): id is string => typeof id === "string")
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
    streak: alreadyDone ? current.streak : Math.max(current.streak, 1),
    completedLessons,
    currentDay: Math.max(current.currentDay, day),
    updatedAt: new Date().toISOString(),
  };

  writeProgress(next);
  return next;
}

export function isLessonComplete(lessonId: string): boolean {
  return readProgress().completedLessons.includes(lessonId);
}
