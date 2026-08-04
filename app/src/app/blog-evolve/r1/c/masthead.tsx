import { BookOpen, CalendarDays, Users } from "lucide-react";
import { CONTRIBUTOR_COUNT, PUBLICATION, TOTAL_POST_COUNT } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/**
 * Page hero. The single h1 for the whole route lives here — everything below it (month markers,
 * post titles, sidebar module headers) steps down to h2/h3 without skipping a level.
 */
export default function Masthead() {
  return (
    <div className="border-b border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8 sm:pt-16 sm:pb-10">
        <p className="text-xs font-medium tracking-[0.16em] text-stone-600 uppercase">Notes on visual craft</p>
        <h1
          style={DISPLAY_FONT}
          className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl"
        >
          {PUBLICATION}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed font-normal text-stone-700 sm:text-lg">
          Field notes on creative review, remote critique, and the small habits that keep a
          distributed team shipping work everyone is proud of.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
              <BookOpen className="h-4 w-4 text-orange-700" aria-hidden="true" />
              Posts published
            </dt>
            <dd className="text-sm font-semibold tabular-nums text-stone-900">{TOTAL_POST_COUNT}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
              <Users className="h-4 w-4 text-orange-700" aria-hidden="true" />
              Contributors
            </dt>
            <dd className="text-sm font-semibold tabular-nums text-stone-900">{CONTRIBUTOR_COUNT}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
              <CalendarDays className="h-4 w-4 text-orange-700" aria-hidden="true" />
              Publishing since
            </dt>
            <dd className="text-sm font-semibold text-stone-900">2023</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
