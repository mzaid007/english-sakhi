import { ContinueButton } from "@/components/lesson/ContinueButton";
import { SubstitutionCard } from "@/components/lesson/SubstitutionCard";
import { day1Substitution } from "@/data/day1";

/**
 * Day 1 mobile shell — brand, mission badge, substitution activity, continue CTA.
 * Interactive leaves are client components; this page stays a Server Component.
 */
export default function HomePage() {
  const { day, title_hi } = day1Substitution;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-4 pb-10 pt-6 sm:px-5">
      <header className="mb-6">
        <p className="font-hindi text-sm font-medium text-sakhi-amber">
          इंग्लिश सखी
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-sakhi-ink sm:text-4xl">
          English Sakhi
        </h1>
        <p className="mt-2 font-hindi text-base leading-relaxed text-sakhi-muted">
          रोज़ थोड़ी देर — सुनो, बोलो, आगे बढ़ो।
        </p>
      </header>

      <div className="mb-5 inline-flex w-fit min-h-touch items-center gap-2 rounded-full bg-sakhi-emerald-soft px-4 py-2 ring-1 ring-sakhi-emerald/20">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-sakhi-emerald font-display text-sm font-bold text-white"
          aria-hidden
        >
          {day}
        </span>
        <div className="flex flex-col">
          <span className="font-hindi text-sm font-semibold text-emerald-900">
            दिन {day}
          </span>
          <span className="font-hindi text-xs text-sakhi-muted">{title_hi}</span>
        </div>
      </div>

      <main className="flex flex-1 flex-col gap-6">
        <SubstitutionCard />
        <ContinueButton />
      </main>
    </div>
  );
}
