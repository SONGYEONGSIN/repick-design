"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { BASELINE_OPTIONS, MONTHS, formatPoints, rangeSlice, type BaselineKey, type RangeKey } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function shortLabel(label: string): string {
  const [month, year] = label.split(" ");
  return `${month} '${year.slice(2)}`;
}

// Fixed scale across both baselines so the axis does not jump when the baseline toggle changes —
// only the bar heights (and which months lead or trail) move.
const MAX_ABS_DELTA = round2(
  Math.max(...MONTHS.map((m) => Math.abs(round2(m.own - m.index))), ...MONTHS.map((m) => Math.abs(round2(m.own - m.peer)))),
);

export default function DivergenceChart({ range, baseline }: { range: RangeKey; baseline: BaselineKey }) {
  const [selected, setSelected] = useState(MONTHS.length - 1);
  const inRangeCount = rangeSlice(range).length;
  const firstInRangeIndex = MONTHS.length - inRangeCount;
  const baselineMeta = BASELINE_OPTIONS.find((b) => b.key === baseline)!;
  const month = MONTHS[selected];
  const monthDelta = round2(month.own - month[baseline]);

  return (
    <section aria-labelledby="divergence-heading" className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="divergence-heading" className="text-base font-semibold text-zinc-50">
          Monthly return vs {baselineMeta.short}
        </h2>
        <div className="flex items-center gap-3 text-xs font-normal text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
            Outperformed
          </span>
          <span className="inline-flex items-center gap-1">
            <TrendingDown aria-hidden="true" className="h-3.5 w-3.5 text-zinc-300" />
            Trailed
          </span>
        </div>
      </div>
      <p className="mt-1 text-sm font-normal text-zinc-400">
        24 published months. Dimmed bars fall outside the {range === "ALL" ? "current" : range} range selected above; select
        any month for its exact figures.
      </p>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="flex h-36 items-stretch gap-[3px] sm:h-44">
          {MONTHS.map((m, i) => {
            const delta = round2(m.own - m[baseline]);
            const positive = delta >= 0;
            const magnitudePct = MAX_ABS_DELTA > 0 ? (Math.abs(delta) / MAX_ABS_DELTA) * 100 : 0;
            const inRange = i >= firstInRangeIndex;
            const isSelected = i === selected;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                aria-label={`${m.label}: Solstice ${m.own.toFixed(2)}%, ${baselineMeta.short} ${m[baseline].toFixed(2)}%, ${formatPoints(delta)}${inRange ? "" : " (outside selected range)"}`}
                className={`group flex flex-1 min-w-0 flex-col justify-center rounded-sm transition-opacity ${FOCUS} ${
                  inRange ? "opacity-100" : "opacity-35 hover:opacity-70"
                }`}
              >
                <div className="flex h-1/2 items-end justify-center">
                  {positive ? (
                    <span
                      style={{ height: `${magnitudePct}%` }}
                      className={`w-full max-w-3 rounded-t-sm ${isSelected ? "bg-cyan-300" : "bg-cyan-400"}`}
                    />
                  ) : null}
                </div>
                <div className="flex h-1/2 items-start justify-center">
                  {!positive ? (
                    <span
                      style={{ height: `${magnitudePct}%` }}
                      className={`w-full max-w-3 rounded-b-sm ${isSelected ? "bg-zinc-200" : "bg-zinc-400"}`}
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-1 flex gap-[3px]" aria-hidden="true">
          {MONTHS.map((m, i) => (
            <span
              key={m.label}
              className={`flex-1 min-w-0 text-center text-[10px] font-normal tabular-nums text-zinc-400 ${
                i % 4 === 0 ? "" : "invisible"
              }`}
            >
              {shortLabel(m.label)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-50">{month.label} detail</h3>
        <dl className="mt-2 grid grid-cols-3 gap-3">
          <div>
            <dt className="text-xs font-normal text-zinc-400">Solstice</dt>
            <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
              {month.own >= 0 ? "+" : ""}
              {month.own.toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">{baselineMeta.short}</dt>
            <dd className="mt-0.5 text-base font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
              {month[baseline] >= 0 ? "+" : ""}
              {month[baseline].toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Delta</dt>
            <dd
              className={`mt-0.5 text-base font-semibold tabular-nums ${monthDelta >= 0 ? "text-cyan-300" : "text-zinc-200"}`}
              style={DISPLAY_FONT}
            >
              {formatPoints(monthDelta)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
