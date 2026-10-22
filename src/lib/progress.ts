const STORAGE_KEY = "english-sakhi-progress";

export interface LocalProgress {
  streak: number;
  /** Local calendar day (YYYY-MM-DD) when the streak last moved. */
  lastActiveDate: string;
  completedLessons: string[];
  currentDay: number;
  updatedAt: string;
}

export function emptyProgress(): LocalProgress {
  return {
    streak: 0,
    lastActiveDate: "",
    completedLessons: [],
    currentDay: 1,
    // Stable default — real timestamps are written on save (Cache Components safe).
    updatedAt: "",
  };
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function previousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

/**
 * A streak is calendar days with a new lesson, not a count of lessons.
 * Five lessons in one evening stay on the same number.
 * A repeat does not move it. A missed day starts again at 1.
 * Progress saved before lastActiveDate existed keeps its number.
 */
export function advanceStreak(
  current: Pick<LocalProgress, "streak" | "lastActiveDate">,
  today = localDateKey(),
): { streak: number; lastActiveDate: string } {
  if (current.lastActiveDate === today) {
    return { streak: Math.max(current.streak, 1), lastActiveDate: today };
  }
  if (current.lastActiveDate === previousDateKey(today)) {
    return { streak: current.streak + 1, lastActiveDate: today };
  }
  if (!current.lastActiveDate && current.streak > 0) {
    return { streak: current.streak, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

export function readProgress(): LocalProgress {
  if (typeof window === "undefined") return emptyProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    return {
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      lastActiveDate:
        typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : "",
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

/** Mark a lesson complete. The streak moves at most once per calendar day. */
export function completeLesson(lessonId: string, day: number): LocalProgress {
  const current = readProgress();
  const alreadyDone = current.completedLessons.includes(lessonId);
  const completedLessons = alreadyDone
    ? current.completedLessons
    : [...current.completedLessons, lessonId];
  const streak = alreadyDone
    ? { streak: current.streak, lastActiveDate: current.lastActiveDate }
    : advanceStreak(current);

  const next: LocalProgress = {
    streak: streak.streak,
    lastActiveDate: streak.lastActiveDate,
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

/** Same rule as the home list: day 1 is open, later days follow the previous one. */
export function isLessonUnlocked(
  lessonIndex: number,
  lessonDay: number,
  progress: LocalProgress,
  previousLessonId: string | null,
): boolean {
  if (lessonIndex <= 0) return true;
  if (
    previousLessonId &&
    progress.completedLessons.includes(previousLessonId)
  ) {
    return true;
  }
  return lessonDay <= progress.currentDay;
}

function laterDate(a: string, b: string): string {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/** Union lessons + Math.max streak/day — never wipe offline progress. */
export function mergeProgress(
  local: LocalProgress,
  cloud: LocalProgress,
): LocalProgress {
  return {
    streak: Math.max(local.streak, cloud.streak),
    lastActiveDate: laterDate(local.lastActiveDate, cloud.lastActiveDate),
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
    lastActiveDate: "",
    completedLessons: row.completed_lessons ?? [],
    currentDay: row.current_day ?? 1,
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}
