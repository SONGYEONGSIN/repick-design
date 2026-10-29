"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, Pin, AlertOctagon } from "lucide-react";
import {
  ANCHOR_DATE, METRIC_META, buildMonthGrid, fmtDateLong, fmtMetricValue, metricBucket,
  type Metric, type MonthDef, type MonthGridCell,
} from "./data";
import { FOCUS_RING } from "./ui";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BUCKET_CLASSES = [
  "bg-orange-50 text-zinc-900",
  "bg-orange-100 text-zinc-900",
  "bg-orange-200 text-zinc-900",
  "bg-orange-300 text-zinc-900",
  "bg-orange-400 text-zinc-900",
  "bg-orange-500 text-zinc-900",
];
const CLOSED_CLASSES = "bg-zinc-50 text-zinc-500 border-dashed";

/**
 * Muted cells (out-of-month padding, or dimmed by the at-risk filter) get a flat, pre-verified
 * AA-safe treatment instead of fading the real heatmap color with opacity — opacity blends both
 * the colored background and the text toward the page background by the same factor, which can
 * collapse their contrast well below AA even though the un-faded pair was compliant.
 */
function cellColorClasses(cell: MonthGridCell, metric: Metric, muted: boolean): string {
  if (muted) return CLOSED_CLASSES;
  const bucket = metricBucket(cell.record, metric);
  return bucket === -1 ? CLOSED_CLASSES : BUCKET_CLASSES[bucket];
}

function cellAriaLabel(cell: MonthGridCell, metric: Metric, pinned: boolean): string {
  const { record } = cell;
  const dateLabel = fmtDateLong(record.date);
  if (!record.isOpen) return `${dateLabel}, closed`;
  const metricStr = `${METRIC_META[metric].shortLabel} ${fmtMetricValue(record, metric)}`;
  const riskStr = record.riskLevel === "high" ? ", at risk" : record.riskLevel === "medium" ? ", watch" : "";
  const pinStr = pinned ? ", pinned" : "";
  const todayStr = record.date === ANCHOR_DATE ? ", today" : "";
  return `${dateLabel}${todayStr} — ${metricStr}${riskStr}${pinStr}`;
}

export function CalendarCard({
  months, monthIndex, onMonthIndexChange,
  metric, onMetricChange,
  selectedDate, onSelectDate,
  onHoverDate,
  pinnedDates,
  riskOnly, onToggleRiskOnly,
}: {
  months: MonthDef[];
  monthIndex: number;
  onMonthIndexChange: (i: number) => void;
  metric: Metric;
  onMetricChange: (m: Metric) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onHoverDate: (date: string | null) => void;
  pinnedDates: string[];
  riskOnly: boolean;
  onToggleRiskOnly: () => void;
}) {
  const def = months[monthIndex];
  const grid = useMemo(() => buildMonthGrid(def), [def]);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function indexOfDate(date: string): number {
    const i = grid.findIndex((c) => c.date === date);
    return i >= 0 ? i : 0;
  }

  const [focusIndex, setFocusIndex] = useState(() => indexOfDate(selectedDate));

  // Reset the roving-tabindex focus target when the visible month changes — adjusted synchronously
  // during render (React's documented pattern for "resetting state when a prop changes") instead of
  // in a useEffect, since a plain setState-in-effect for a derived reset is a lint hard-fail here.
  const [focusedGridKey, setFocusedGridKey] = useState(def.key);
  if (def.key !== focusedGridKey) {
    setFocusedGridKey(def.key);
    setFocusIndex(indexOfDate(selectedDate));
  }

  function move(delta: number) {
    setFocusIndex((i) => {
      const next = Math.max(0, Math.min(grid.length - 1, i + delta));
      cellRefs.current[next]?.focus();
      return next;
    });
  }

  function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); move(7); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-7); }
    else if (e.key === "Home") { e.preventDefault(); setFocusIndex(0); cellRefs.current[0]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); setFocusIndex(grid.length - 1); cellRefs.current[grid.length - 1]?.focus(); }
  }

  return (
    <section aria-labelledby="calendar-heading" className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMonthIndexChange(monthIndex - 1)}
            disabled={monthIndex === 0}
            aria-label="Previous month"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30 ${FOCUS_RING}`}
          >
            <ChevronLeft aria-hidden="true" className="h-4.5 w-4.5" />
          </button>
          <h2 id="calendar-heading" className="w-40 text-center text-base font-bold text-zinc-900 sm:w-48 sm:text-lg">
            {def.label}
          </h2>
          <button
            type="button"
            onClick={() => onMonthIndexChange(monthIndex + 1)}
            disabled={monthIndex === months.length - 1}
            aria-label="Next month"
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30 ${FOCUS_RING}`}
          >
            <ChevronRight aria-hidden="true" className="h-4.5 w-4.5" />
          </button>
        </div>

        <div role="group" aria-label="Choose calendar metric" className="ml-auto flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1">
          {(["utilization", "revenue", "risk"] as Metric[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => onMetricChange(m)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${FOCUS_RING} ${
                metric === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {METRIC_META[m].shortLabel}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={riskOnly}
          onClick={onToggleRiskOnly}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${FOCUS_RING} ${
            riskOnly ? "border-orange-300 bg-orange-50 text-orange-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          <AlertOctagon aria-hidden="true" className="h-4 w-4 shrink-0" />
          At-risk only
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {w}
          </div>
        ))}
      </div>

      <div
        role="group"
        aria-label={`${def.label} calendar, colored by ${METRIC_META[metric].label.toLowerCase()}`}
        onKeyDown={onGridKeyDown}
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
      >
        {grid.map((cell, i) => {
          const isSelected = cell.date === selectedDate;
          const isPinned = pinnedDates.includes(cell.date);
          const isToday = cell.date === ANCHOR_DATE;
          const dimmed = riskOnly && cell.record.isOpen && cell.record.riskLevel !== "high";
          const muted = !cell.inMonth || dimmed;
          return (
            <button
              key={cell.date}
              ref={(el) => { cellRefs.current[i] = el; }}
              type="button"
              tabIndex={i === focusIndex ? 0 : -1}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              onClick={() => onSelectDate(cell.date)}
              onFocus={() => { setFocusIndex(i); onHoverDate(cell.date); }}
              onBlur={() => onHoverDate(null)}
              onMouseEnter={() => onHoverDate(cell.date)}
              onMouseLeave={() => onHoverDate(null)}
              className={`group relative flex aspect-square flex-col items-start justify-between rounded-lg border p-1.5 text-left sm:p-2 ${FOCUS_RING} ${cellColorClasses(cell, metric, muted)} ${
                isSelected ? "border-zinc-900 ring-2 ring-zinc-900" : "border-transparent"
              }`}
            >
              {/* The visible day-number and metric-value pieces are decorative duplicates of this
                  single sr-only description — using aria-label here instead would silently discard
                  that visible text from the accessible name and risk a content/name mismatch. */}
              <span className="sr-only">{cellAriaLabel(cell, metric, isPinned)}</span>
              <span aria-hidden="true" className="flex w-full items-center justify-between">
                <span className={`text-[11px] font-medium sm:text-xs ${isToday ? "flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-900 text-white" : ""}`}>
                  {cell.record.d}
                </span>
                {cell.record.riskLevel === "high" && cell.record.isOpen && (
                  <AlertTriangle className="h-3 w-3 shrink-0 text-orange-800 sm:h-3.5 sm:w-3.5" />
                )}
              </span>
              <span aria-hidden="true" className="flex w-full items-end justify-between">
                <span className="text-[10px] font-bold leading-none sm:text-xs">
                  {fmtMetricValue(cell.record, metric)}
                </span>
                {isPinned && <Pin className="h-3 w-3 shrink-0 fill-current text-zinc-900" />}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-hidden="true" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-normal text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="flex overflow-hidden rounded">
            {BUCKET_CLASSES.map((c, i) => (
              <span key={i} className={`h-3 w-3 ${c.split(" ")[0]}`} />
            ))}
          </span>
          Low → High {METRIC_META[metric].label.toLowerCase()}
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded border border-dashed border-zinc-300 ${CLOSED_CLASSES.split(" ")[0]}`} />
          Closed
        </span>
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-orange-800" />
          At risk
        </span>
      </div>
    </section>
  );
}
