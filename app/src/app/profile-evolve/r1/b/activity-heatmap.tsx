"use client";

import type { KeyboardEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { ACTIVITY_TOTALS, HEATMAP_WEEKS, MONTH_MARKERS, heatLevel } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const RANGES = [
  { key: "30", label: "30d", days: 30 },
  { key: "90", label: "90d", days: 90 },
  { key: "365", label: "1y", days: 364 },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];

const LEVEL_FILL: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-zinc-800",
  1: "bg-amber-900",
  2: "bg-amber-700",
  3: "bg-amber-500",
  4: "bg-amber-300",
};

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

// Sized so the full 52-week grid (day-label gutter + 52 columns) fits inside the narrowest
// measured right-column width at desktop breakpoints (~734px at 1264–1920, main content capped
// at max-w-[1180px] well before that) without the wrapper ever needing to scroll — verified via
// the gate's own sweep. Only 390px mobile is allowed to scroll this locally.
const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const DAY_LABEL_W = 28;
const WEEKS = 52;
const DAYS = 7;

const WEEKDAY_ROWS: [number, string][] = [
  [1, "Mon"],
  [3, "Wed"],
  [5, "Fri"],
];

const ALL_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function contributionWord(n: number): string {
  return n === 1 ? "contribution" : "contributions";
}

/** Flat list of the real (non-future) cells, in grid order — used for roving tabindex and the
 *  screen-reader summary table. */
interface FlatCell {
  col: number;
  row: number;
  count: number;
  label: string;
}

export default function ActivityHeatmap() {
  const [range, setRange] = useState<RangeKey>("365");
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const [focusKey, setFocusKey] = useState<string | null>(null);

  const rangeDays = RANGES.find((r) => r.key === range)?.days ?? 364;
  const cutoffIndex = WEEKS * DAYS - rangeDays;

  const totals =
    range === "30" ? ACTIVITY_TOTALS.d30 : range === "90" ? ACTIVITY_TOTALS.d90 : ACTIVITY_TOTALS.d365;

  const gridWidth = useMemo(() => DAY_LABEL_W + WEEKS * STEP - GAP, []);

  const flat: FlatCell[] = useMemo(() => {
    const out: FlatCell[] = [];
    HEATMAP_WEEKS.forEach((week, col) => {
      week.forEach(([count, label, isFuture], row) => {
        if (!isFuture) out.push({ col, row, count, label });
      });
    });
    return out;
  }, []);

  const defaultFocusKey = flat.length ? `${flat[flat.length - 1].col}:${flat[flat.length - 1].row}` : null;
  const activeFocusKey = focusKey ?? defaultFocusKey;

  function moveFocus(col: number, row: number, dCol: number, dRow: number) {
    let c = col + dCol;
    let r = row + dRow;
    if (r < 0) {
      r = DAYS - 1;
      c -= 1;
    } else if (r >= DAYS) {
      r = 0;
      c += 1;
    }
    const week = HEATMAP_WEEKS[c];
    if (!week) return;
    const cell = week[r];
    if (!cell || cell[2]) return; // out of range or future
    const key = `${c}:${r}`;
    setFocusKey(key);
    cellRefs.current.get(key)?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, col: number, row: number) {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        moveFocus(col, row, 0, -1);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(col, row, 0, 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(col, row, -1, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(col, row, 1, 0);
        break;
    }
  }

  return (
    <section aria-labelledby="activity-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="activity-heading" className="text-lg font-semibold text-zinc-50">
            Contribution activity
          </h2>
          <p className="mt-1 text-sm font-normal text-zinc-400" aria-live="polite">
            <span className="font-medium tabular-nums text-amber-400" style={DISPLAY_FONT}>
              {totals.contributions.toLocaleString("en-US")}
            </span>{" "}
            {contributionWord(totals.contributions)} &middot;{" "}
            <span className="font-medium tabular-nums text-zinc-200" style={DISPLAY_FONT}>
              {totals.activeDays.toLocaleString("en-US")}
            </span>{" "}
            active days in the selected window
          </p>
        </div>

        <div role="group" aria-label="Activity time range" className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          {RANGES.map((r) => {
            const active = r.key === range;
            return (
              <button
                key={r.key}
                type="button"
                aria-pressed={active}
                onClick={() => setRange(r.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium tabular-nums transition-colors ${FOCUS} ${
                  active ? "bg-amber-500 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-1 [scrollbar-width:thin]">
        <div className="relative" style={{ width: gridWidth, minWidth: gridWidth }}>
          {/* Month labels */}
          <div className="relative h-4" aria-hidden="true">
            {MONTH_MARKERS.map(([weekIndex, label]) => (
              <span
                key={`${weekIndex}-${label}`}
                className="absolute top-0 text-[11px] font-normal text-zinc-400"
                style={{ left: DAY_LABEL_W + weekIndex * STEP }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-1 flex gap-[3px]">
            {/* Weekday labels */}
            <div className="relative shrink-0" style={{ width: DAY_LABEL_W - GAP }}>
              {WEEKDAY_ROWS.map(([row, label]) => (
                <span
                  key={label}
                  className="absolute text-[11px] font-normal text-zinc-400"
                  style={{ top: row * STEP - 1 }}
                >
                  {label}
                </span>
              ))}
              <div style={{ height: 7 * STEP - GAP }} aria-hidden="true" />
            </div>

            {/* Week columns */}
            {HEATMAP_WEEKS.map((week, col) => (
              <div key={col} className="flex flex-col gap-[3px]">
                {week.map(([count, label, isFuture], row) => {
                  const flatIndex = col * DAYS + row;
                  const inRange = flatIndex >= cutoffIndex;
                  const key = `${col}:${row}`;

                  if (isFuture) {
                    return (
                      <div
                        key={row}
                        aria-hidden="true"
                        className="rounded-[2px] border border-dashed border-zinc-800/60"
                        style={{ width: CELL, height: CELL }}
                      />
                    );
                  }

                  const level = heatLevel(count);
                  const isFocusable = activeFocusKey === key;

                  return (
                    <div key={row} className="group relative">
                      <button
                        ref={(el) => {
                          if (el) cellRefs.current.set(key, el);
                          else cellRefs.current.delete(key);
                        }}
                        type="button"
                        tabIndex={isFocusable ? 0 : -1}
                        aria-label={`${count} ${contributionWord(count)} on ${label}`}
                        onFocus={() => setFocusKey(key)}
                        onKeyDown={(e) => handleKeyDown(e, col, row)}
                        className={`block rounded-[2px] transition-opacity ${FOCUS} ${LEVEL_FILL[level]} ${
                          inRange ? "opacity-100" : "opacity-30"
                        }`}
                        style={{ width: CELL, height: CELL }}
                      />
                      <div
                        role="tooltip"
                        className={`pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs font-normal text-zinc-100 shadow-lg group-hover:block group-focus-within:block ${
                          row === 0 ? "top-full mt-1.5" : "bottom-full mb-1.5"
                        }`}
                      >
                        <span className="font-medium tabular-nums text-amber-300">{count}</span> {contributionWord(count)}{" "}
                        <span className="text-zinc-400">on {label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] font-normal text-zinc-400">
        <span>Less</span>
        <span className="flex gap-[3px]" aria-hidden="true">
          {([0, 1, 2, 3, 4] as const).map((lvl) => (
            <span key={lvl} className={`block rounded-[2px] ${LEVEL_FILL[lvl]}`} style={{ width: CELL, height: CELL }} />
          ))}
        </span>
        <span>More</span>
        <span className="ml-2 text-zinc-400">Arrow keys move through the grid</span>
      </div>

      {/* Screen-reader summary — the same data as a proper table, independent of the visual grid. */}
      <div className="sr-only">
        <table>
          <caption>Daily contribution count by week and weekday, for the past year.</caption>
          <thead>
            <tr>
              <th scope="col">Week of</th>
              {ALL_WEEKDAYS.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_WEEKS.map((week, col) => (
              <tr key={col}>
                <th scope="row">{week[0][1]}</th>
                {week.map(([count, label, isFuture], i) => (
                  <td key={i}>{isFuture ? "not yet occurred" : `${label}: ${count} ${contributionWord(count)}`}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
