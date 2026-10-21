import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { curriculum, getLessonById } from "@/data/curriculum";

export function generateStaticParams() {
  return curriculum.map((lesson) => ({ id: lesson.id }));
}

async function LessonBody({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-10 font-hindi text-sakhi-muted">
          पाठ लोड हो रहा है…
        </div>
      }
    >
      <LessonBody params={params} />
    </Suspense>
  );
}
