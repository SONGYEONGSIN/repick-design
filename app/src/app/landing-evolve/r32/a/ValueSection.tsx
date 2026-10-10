'use client';

import { useMemo } from 'react';
import Reveal from './Reveal';
import {
  GRADE_ORDER,
  GRADE_LABELS,
  EXAMPLE_LISTING,
  filteredPrices,
  computeBoxStats,
  percentileRank,
  type Grade,
} from './data';

interface ValueSectionProps {
  minPrice: number;
  maxPrice: number;
}

export default function ValueSection({ minPrice, maxPrice }: ValueSectionProps) {
  const statsByGrade = useMemo(() => {
    const result = {} as Record<Grade, ReturnType<typeof computeBoxStats>>;
    for (const grade of GRADE_ORDER) {
      result[grade] = computeBoxStats(filteredPrices(grade, minPrice, maxPrice));
    }
    return result;
  }, [minPrice, maxPrice]);

  const goodFiltered = useMemo(
    () => filteredPrices('good', minPrice, maxPrice),
    [minPrice, maxPrice],
  );
  const goodStats = statsByGrade.good;
  const examplePercentile = percentileRank(goodFiltered, EXAMPLE_LISTING.price);

  return (
    <section id="value" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <div className="max-w-[640px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            Value, in three parts
          </div>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-900"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            What the distribution actually buys you.
          </h2>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Reveal delay={0}>
          <div className="flex h-full flex-col rounded-2xl border border-zinc-200 p-6">
            <div className="text-[12px] font-semibold tabular-nums tracking-[0.12em] text-zinc-500">
              01
            </div>
            <h3 className="mt-2 text-[17px] font-semibold text-zinc-900">The full spread</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-zinc-600">
              Min, Q1, median, Q3, max — all five numbers, for all three condition
              grades, across the whole $40–$420 pool of sold Sneakers.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
            <div className="text-[12px] font-semibold tabular-nums tracking-[0.12em] text-sky-700">
              02
            </div>
            <h3 className="mt-2 text-[17px] font-semibold text-zinc-900">
              Narrowed to your range
            </h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-zinc-700">
              At{' '}
              <span className="font-semibold tabular-nums">
                ${minPrice}–${maxPrice}
              </span>
              , here is every grade from the hero chart above, recomputed live:
            </p>
            <ul className="mt-3 space-y-2 text-[13px] leading-[1.5] text-zinc-700">
              {GRADE_ORDER.map((grade) => {
                const stats = statsByGrade[grade];
                return (
                  <li key={grade} className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-zinc-800">{GRADE_LABELS[grade]}</span>
                    <span className="tabular-nums text-zinc-600">
                      {stats
                        ? `$${stats.min}–$${stats.max}, median $${stats.median}`
                        : 'no comps in range'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex h-full flex-col rounded-2xl border border-zinc-200 p-6">
            <div className="text-[12px] font-semibold tabular-nums tracking-[0.12em] text-zinc-500">
              03
            </div>
            <h3 className="mt-2 text-[17px] font-semibold text-zinc-900">Where you&rsquo;d land</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-zinc-600">
              {goodStats
                ? `The ${EXAMPLE_LISTING.name} example sits at the ${examplePercentile}th percentile of the ${goodStats.count} Good-grade comps inside your current range — median $${goodStats.median}.`
                : `Widen the range above — there are no Good-grade comps between $${minPrice} and $${maxPrice} yet.`}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
