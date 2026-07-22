"use client";

import { TriangleAlert } from "lucide-react";
import { formatPercent, formatUnits, TOTAL_OVER_COUNT, ZONE_STATS, zoneVelocityTrend } from "./data";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, ProgressBar, Sparkline } from "./ui";

export default function ZoneRail({ selectedZoneId, onSelect }: { selectedZoneId: string; onSelect: (id: string) => void }) {
  return (
    <Card padded={false} className="flex h-full min-h-0 flex-col">
      <div className={cx("border-b p-3.5 sm:p-4", BORDER)}>
        <CardHeader
          title="존 레일"
          titleId="zone-rail-heading"
          description={`${ZONE_STATS.length}개 존 · 초과 ${TOTAL_OVER_COUNT}건`}
        />
      </div>

      <ul aria-labelledby="zone-rail-heading" className="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin]">
        {ZONE_STATS.map((z) => {
          const selected = z.id === selectedZoneId;
          const trend = zoneVelocityTrend(z);
          const barTone = z.overCount > 0 ? "bg-rose-500" : z.utilizationPct >= 95 ? "bg-indigo-600" : "bg-indigo-500";
          return (
            <li key={z.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(z.id)}
                className={cx(
                  "mb-1 w-full rounded-xl border px-3 py-2.5 text-left last:mb-0",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? cx("border-indigo-300 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10") : cx(BORDER, "border-transparent hover:bg-zinc-50 dark:hover:bg-white/[0.03]"),
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                      selected ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    <z.Icon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>
                      <span className={cx("mr-1 text-[11px] font-normal", NUM, TEXT_CAPTION)}>{z.code}</span>
                      {z.name}
                    </p>
                    <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>
                      통로 {z.aisleCount}개 · {formatUnits(z.totalOccupied)}/{formatUnits(z.totalCapacity)}
                    </p>
                  </div>
                  {z.overCount > 0 ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/12 dark:text-rose-300">
                      <TriangleAlert size={11} aria-hidden="true" />
                      {z.overCount}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <ProgressBar
                    value={z.utilizationPct}
                    max={100}
                    toneClass={barTone}
                    className="flex-1"
                    label={`${z.name} 가동률 ${formatPercent(z.utilizationPct)}`}
                  />
                  <span className={cx("w-9 shrink-0 text-right text-xs font-semibold", NUM, TEXT_PRIMARY)}>{formatPercent(z.utilizationPct)}</span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-6 w-16 shrink-0">
                    <Sparkline values={trend} stroke="stroke-indigo-500 dark:stroke-indigo-400" fill="fill-indigo-500 dark:fill-indigo-400" />
                  </span>
                  <span className={cx("truncate text-[11px]", TEXT_CAPTION)}>평균 {z.avgVelocity.toFixed(1)}건/일</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
