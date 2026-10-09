"use client";

import { ChevronDown } from "lucide-react";
import type { OkrItem, Period } from "./data";
import { achievementPercent, statusForAchievement } from "./data";
import { formatByUnit, formatBreakdownValue, formatAchievement } from "./format";
import { Sparkline, StatusPill, round2 } from "./ui";

/**
 * The hand-built bullet / gauge mark — no chart library. A horizontal track
 * carries three qualitative bands (poor / satisfactory / good), a violet bar
 * for the current value, and a dark tick for the target. All coordinates are
 * derived from literal data via linear interpolation and rounded to 2
 * decimal places before being written into the SVG, per the house rule on
 * hand-authored SVG coordinates.
 */
function BulletMark({ item, period }: { item: OkrItem; period: Period }) {
  const { current, target } = item.figures[period];
  const width = 100;
  const height = 24;
  const trackX0 = 2;
  const trackX1 = width - 2;
  const trackWidth = trackX1 - trackX0;

  const scale = (value: number) => {
    const clamped = Math.min(Math.max(value, item.scaleMin), item.scaleMax);
    const ratio = (clamped - item.scaleMin) / (item.scaleMax - item.scaleMin);
    return round2(trackX0 + ratio * trackWidth);
  };

  const poorEnd = scale(item.poorMax);
  const satisfactoryEnd = scale(item.satisfactoryMax);
  const barEnd = scale(current);
  const targetX = scale(target);

  const barW = round2(Math.max(barEnd - trackX0, 0));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-9 w-full"
      role="img"
      aria-label={`Bullet chart. Current ${formatByUnit(current, item.unit, item.countSuffix)} against a target of ${formatByUnit(target, item.unit, item.countSuffix)}.`}
    >
      <rect x={trackX0} y={6} width={round2(trackWidth)} height={12} rx={2} fill="#f4f4f5" stroke="#e4e4e7" strokeWidth={1} />
      <rect x={trackX0} y={6} width={round2(poorEnd - trackX0)} height={12} fill="#e4e4e7" />
      <rect x={poorEnd} y={6} width={round2(satisfactoryEnd - poorEnd)} height={12} fill="#f4f4f5" />
      <rect x={satisfactoryEnd} y={6} width={round2(trackX1 - satisfactoryEnd)} height={12} fill="#fafafa" />
      <rect x={trackX0} y={10} width={barW} height={4} rx={1} fill="#6d28d9" />
      <line x1={targetX} x2={targetX} y1={2} y2={22} stroke="#18181b" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

export function BulletCard({
  item,
  period,
  expanded,
  onToggle,
  registerRef,
}: {
  item: OkrItem;
  period: Period;
  expanded: boolean;
  onToggle: () => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const figures = item.figures[period];
  const achievement = achievementPercent(figures);
  const status = statusForAchievement(achievement);
  const breakdownRows = item.breakdown[period];
  const breakdownTotal = breakdownRows.reduce((sum, row) => sum + row.value, 0);
  const panelId = `${item.id}-panel`;

  return (
    <div className={`min-w-0 ${expanded ? "col-span-full" : ""}`}>
      <div className="min-w-0 rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,16,15,0.04)]">
        <button
          type="button"
          ref={(el) => registerRef(item.id, el)}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full min-w-0 flex-col gap-3 rounded-xl p-4 text-left outline-offset-2 transition-colors hover:bg-zinc-50/70 focus-visible:outline-2 focus-visible:outline-violet-700"
        >
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">{item.team}</p>
              <p className="truncate text-sm font-semibold text-zinc-900">{item.metric}</p>
            </div>
            <ChevronDown
              className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </div>

          <BulletMark item={item} period={period} />

          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex min-w-0 items-baseline gap-1.5">
              <span className="tabular-nums text-2xl font-semibold text-zinc-900">
                {formatByUnit(figures.current, item.unit, item.countSuffix)}
              </span>
              <span className="whitespace-nowrap text-xs text-zinc-500">
                target {formatByUnit(figures.target, item.unit, item.countSuffix)}
              </span>
            </div>
            <StatusPill status={status} />
          </div>
        </button>

        {/* Inline accordion: grid-template-rows 0fr→1fr trick, no JS height
            measurement, transition skipped entirely under reduced motion. */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              id={panelId}
              role="region"
              aria-label={`${item.metric} detail`}
              aria-hidden={!expanded}
              className="min-w-0 border-t border-zinc-100 p-4"
            >
              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                    Last 8 quarters
                  </p>
                  <div className="mt-2">
                    <Sparkline
                      data={item.history}
                      label={`${item.metric} trend over the last 8 quarters, ending at ${formatByUnit(item.history[item.history.length - 1], item.unit, item.countSuffix)}`}
                      className="h-10 w-40"
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Owner <span className="font-medium text-zinc-700">{item.owner}</span> · achievement{" "}
                    <span className="tabular-nums font-medium text-zinc-700">{formatAchievement(achievement)}</span>
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
                    {item.breakdownContext}
                  </p>
                  <ul className="mt-2 flex list-none flex-col gap-1.5">
                    {breakdownRows.map((row) => {
                      const share = breakdownTotal === 0 ? 0 : (row.value / breakdownTotal) * 100;
                      return (
                        <li key={row.label} className="flex min-w-0 items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-xs text-zinc-600">{row.label}</span>
                          <span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100">
                            <span
                              className="block h-full rounded-full bg-violet-300"
                              style={{ width: `${round2(share)}%` }}
                            />
                          </span>
                          <span className="w-20 shrink-0 text-right tabular-nums text-xs font-medium text-zinc-700">
                            {formatBreakdownValue(row.value, item.breakdownUnit)}
                          </span>
                        </li>
                      );
                    })}
                    <li className="mt-1 flex min-w-0 items-center gap-2 border-t border-zinc-100 pt-1.5">
                      <span className="min-w-0 flex-1 text-xs font-medium text-zinc-900">Total</span>
                      <span className="w-20 shrink-0 text-right tabular-nums text-xs font-semibold text-zinc-900">
                        {formatBreakdownValue(breakdownTotal, item.breakdownUnit)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
