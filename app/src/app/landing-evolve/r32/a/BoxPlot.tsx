'use client';

import { Diamond } from 'lucide-react';
import {
  GRADE_ORDER,
  GRADE_LABELS,
  type Grade,
  type BoxStats,
  toDomainPercent,
  PRICE_DOMAIN,
} from './data';

interface BoxPlotProps {
  statsByGrade: Record<Grade, BoxStats | null>;
  markerGrade: Grade;
  markerPrice: number;
  markerInRange: boolean;
}

export default function BoxPlot({ statsByGrade, markerGrade, markerPrice, markerInRange }: BoxPlotProps) {
  const markerPct = toDomainPercent(markerPrice);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {GRADE_ORDER.map((grade) => {
          const stats = statsByGrade[grade];
          const showMarker = grade === markerGrade;
          return (
            <div key={grade} className="flex items-center gap-3">
              <div className="w-14 shrink-0 text-right sm:w-20">
                <div className="text-[13px] font-semibold text-zinc-700">{GRADE_LABELS[grade]}</div>
                <div className="text-[11px] tabular-nums text-zinc-500">
                  n={stats ? stats.count : 0}
                </div>
              </div>
              <div className="relative h-9 min-w-0 flex-1 rounded-md bg-zinc-100">
                {stats ? (
                  <>
                    {/* whisker: min -> max */}
                    <div
                      className="absolute top-1/2 h-px -translate-y-1/2 bg-zinc-400"
                      style={{
                        left: `${toDomainPercent(stats.min)}%`,
                        width: `${Math.max(0, toDomainPercent(stats.max) - toDomainPercent(stats.min))}%`,
                      }}
                    />
                    {/* end caps */}
                    <div
                      className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-zinc-400"
                      style={{ left: `${toDomainPercent(stats.min)}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-zinc-400"
                      style={{ left: `${toDomainPercent(stats.max)}%` }}
                    />
                    {/* box: Q1 -> Q3 */}
                    <div
                      className="absolute top-1/2 h-6 min-w-[4px] -translate-y-1/2 rounded-sm border border-sky-500 bg-sky-100"
                      style={{
                        left: `${toDomainPercent(stats.q1)}%`,
                        width: `${Math.max(0.6, toDomainPercent(stats.q3) - toDomainPercent(stats.q1))}%`,
                      }}
                    />
                    {/* median tick */}
                    <div
                      className="absolute top-1/2 h-6 w-[2px] -translate-y-1/2 bg-sky-700"
                      style={{ left: `${toDomainPercent(stats.median)}%` }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] text-zinc-600">
                    No comps in this range
                  </div>
                )}
                {showMarker ? (
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${markerPct}%` }}
                    aria-hidden="true"
                  >
                    <Diamond
                      className={markerInRange ? 'h-4 w-4 fill-sky-600 text-sky-600' : 'h-4 w-4 fill-white text-sky-600'}
                      strokeWidth={2}
                    />
                  </div>
                ) : null}
              </div>
              <div className="hidden w-24 shrink-0 text-[11px] tabular-nums text-zinc-500 sm:block">
                {stats ? `med $${stats.median}` : '—'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] tabular-nums text-zinc-500">
        <span>${PRICE_DOMAIN.min}</span>
        <span>${Math.round((PRICE_DOMAIN.min + PRICE_DOMAIN.max) / 2)}</span>
        <span>${PRICE_DOMAIN.max}</span>
      </div>
    </div>
  );
}
