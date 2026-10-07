"use client";

import { OKR_ITEMS, overallCompletion, type Period } from "./data";
import { formatAchievement } from "./format";
import { BulletCard } from "./bullet-card";

/**
 * The bullet grid is the full-width hero — not a KPI row sitting above a
 * different chart type. Selecting a card expands its own inline accordion
 * in place (handled inside BulletCard via col-span-full), so there is no
 * persistent third pane and no separate detail rail anywhere on the page.
 *
 * The "overall completion" figure below is intentionally rendered at
 * text-lg, strictly smaller than the text-2xl current-value numbers inside
 * each bullet card, so this summary stat never reads as competing with the
 * bullet grid as the page's dominant number.
 */
export function BulletGrid({
  period,
  selectedId,
  onToggle,
  registerRef,
}: {
  period: Period;
  selectedId: string | null;
  onToggle: (id: string) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const completion = overallCompletion(period);

  return (
    <section aria-labelledby="goal-grid-heading" className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id="goal-grid-heading" className="text-sm font-semibold text-zinc-900">
            Goal attainment
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Each bullet shows current value against target, with poor / satisfactory / good context bands.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Legend />
          <div className="flex items-baseline gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5">
            <span className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Avg. completion</span>
            <span className="tabular-nums text-lg font-semibold text-violet-700">
              {formatAchievement(completion)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {OKR_ITEMS.map((item) => (
          <BulletCard
            key={item.id}
            item={item}
            period={period}
            expanded={selectedId === item.id}
            onToggle={() => onToggle(item.id)}
            registerRef={registerRef}
          />
        ))}
      </div>
    </section>
  );
}

function Legend() {
  return (
    <ul className="flex list-none flex-wrap items-center gap-3 text-[11px] text-zinc-500">
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-zinc-200" />
        Poor
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-zinc-100" />
        Satisfactory
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-zinc-200 bg-zinc-50" />
        Good
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-violet-700" />
        Current
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-2.5 w-0.5 bg-zinc-900" />
        Target
      </li>
    </ul>
  );
}
