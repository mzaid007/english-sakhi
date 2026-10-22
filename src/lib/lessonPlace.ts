const PREFIX = "english-sakhi-place:";

export interface LessonPlace {
  step: 1 | 2 | 3;
  actionId: string;
}

export function readLessonPlace(lessonId: string): LessonPlace | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PREFIX + lessonId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LessonPlace>;
    if (parsed.step !== 1 && parsed.step !== 2 && parsed.step !== 3) {
      return null;
    }
    if (typeof parsed.actionId !== "string" || !parsed.actionId) return null;
    return { step: parsed.step, actionId: parsed.actionId };
  } catch {
    return null;
  }
}

export function writeLessonPlace(lessonId: string, place: LessonPlace): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + lessonId, JSON.stringify(place));
}

export function clearLessonPlace(lessonId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + lessonId);
}
