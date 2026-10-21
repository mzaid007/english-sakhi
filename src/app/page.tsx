import { Day1Lesson } from "@/components/lesson/Day1Lesson";
import { day1Substitution } from "@/data/day1";

/**
 * Responsive shell: full-bleed mobile column; on laptop/desktop a brand panel
 * sits beside a phone-width lesson stage (interactions stay touch-sized).
 */
export default function HomePage() {
  const { day, title_hi, title_en } = day1Substitution;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col lg:flex-row lg:items-stretch lg:gap-10 lg:px-8 lg:py-10 xl:gap-14">
      {/* Brand / welcome — compact on phone, hero panel on desktop */}
      <aside className="flex flex-col px-4 pt-6 sm:px-5 lg:w-[min(42%,24rem)] lg:shrink-0 lg:justify-center lg:px-0 lg:pt-0">
        <p className="font-hindi text-sm font-medium text-sakhi-amber lg:text-base">
          इंग्लिश सखी
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-sakhi-ink sm:text-4xl lg:text-5xl lg:leading-[1.1]">
          English Sakhi
        </h1>
        <p className="mt-2 max-w-sm font-hindi text-base leading-relaxed text-sakhi-muted lg:mt-4 lg:text-lg">
          रोज़ थोड़ी देर — सुनो, बोलो, आगे बढ़ो।
        </p>

        <ul className="mt-6 hidden gap-4 lg:flex lg:flex-col" aria-label="सीखने के तरीके">
          <DesktopPerk
            title="सिर्फ़ टैप"
            body="कीबोर्ड की ज़रूरत नहीं — शब्द चुनकर वाक्य बनाएँ।"
          />
          <DesktopPerk
            title="आवाज़ पहले"
            body="हर वाक्य भारतीय अंग्रेज़ी में सुनें — धीरे मोड भी।"
          />
          <DesktopPerk
            title="५–१० मिनट"
            body="व्यस्त दिन में भी एक छोटा मिशन पूरा करें।"
          />
        </ul>

        <p className="mt-8 hidden font-hindi text-sm text-sakhi-muted lg:block">
          फ़ोन पर सबसे अच्छा लगता है — लैपटॉप पर भी वही अभ्यास यहाँ है।
        </p>
      </aside>

      {/* Lesson stage — phone-width on all breakpoints */}
      <div className="flex flex-1 flex-col px-4 pb-10 pt-4 sm:px-5 lg:items-center lg:justify-center lg:px-0 lg:pb-0 lg:pt-0">
        <div className="flex w-full max-w-md flex-col lg:rounded-[1.75rem] lg:bg-surface/70 lg:p-6 lg:shadow-soft lg:ring-1 lg:ring-stone-200/70 lg:backdrop-blur-sm">
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
              <span className="font-hindi text-xs text-sakhi-muted">
                {title_hi}
              </span>
              <span className="hidden text-[0.7rem] text-sakhi-muted sm:inline">
                {title_en}
              </span>
            </div>
          </div>

          <main className="flex flex-1 flex-col">
            <Day1Lesson />
          </main>
        </div>
      </div>
    </div>
  );
}

function DesktopPerk({ title, body }: { title: string; body: string }) {
  return (
    <li className="border-l-2 border-sakhi-emerald/40 pl-4">
      <p className="font-hindi text-base font-semibold text-sakhi-ink">{title}</p>
      <p className="mt-0.5 font-hindi text-sm leading-relaxed text-sakhi-muted">
        {body}
      </p>
    </li>
  );
}
