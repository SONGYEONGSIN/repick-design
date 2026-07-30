"use client";

import { AlertTriangle } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useMemo, useRef } from "react";
import { formatDate, formatDateShort, SERVICES, WEEKDAY_LABELS, type DayCell } from "./data";
import { BORDER, intensityFor, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });

function monthLabelForCol(colDays: DayCell[]): string | null {
  const first = colDays.find((d) => d.inRange);
  if (!first) return null;
  const date = new Date(first.dateMs);
  // Only label a column when it contains the 1st-7th of the month (i.e. the month "starts" here).
  if (date.getUTCDate() > 7) return null;
  return monthFmt.format(date);
}

export default function HeatmapCalendar({
  days,
  selectedDateMs,
  onSelectDay,
}: {
  days: DayCell[];
  selectedDateMs: number | null;
  onSelectDay: (dateMs: number) => void;
}) {
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());

  const columns = useMemo(() => {
    const map = new Map<number, DayCell[]>();
    for (const d of days) {
      if (!map.has(d.col)) map.set(d.col, []);
      map.get(d.col)!.push(d);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([col, cells]) => ({ col, cells: [...cells].sort((a, b) => a.row - b.row) }));
  }, [days]);

  const byKey = useMemo(() => {
    const map = new Map<string, DayCell>();
    for (const d of days) map.set(`${d.col}:${d.row}`, d);
    return map;
  }, [days]);

  const firstInRangeIndex = days.findIndex((d) => d.inRange);
  const activeFocusKey = (() => {
    if (selectedDateMs != null) {
      const sel = days.find((d) => d.dateMs === selectedDateMs);
      if (sel) return `${sel.col}:${sel.row}`;
    }
    const first = days[firstInRangeIndex];
    return first ? `${first.col}:${first.row}` : null;
  })();

  function moveFocus(fromCol: number, fromRow: number, dCol: number, dRow: number) {
    const target = byKey.get(`${fromCol + dCol}:${fromRow + dRow}`);
    if (target && target.inRange) {
      cellRefs.current.get(`${target.col}:${target.row}`)?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, cell: DayCell) {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        moveFocus(cell.col, cell.row, 0, -1);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(cell.col, cell.row, 0, 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(cell.col, cell.row, -1, 0);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(cell.col, cell.row, 1, 0);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectDay(cell.dateMs);
        break;
    }
  }

  return (
    <div>
      <div className="overflow-x-auto pb-1 [scrollbar-width:thin]">
        <div className="inline-flex gap-3">
          {/* Weekday gutter */}
          <div className="flex shrink-0 flex-col gap-1 pt-[18px]">
            {WEEKDAY_LABELS.map((label, row) => (
              <div key={label} className="grid h-8 w-7 place-items-end sm:h-9">
                <span className={cx("text-[10px] leading-none", TEXT_CAPTION)}>{row % 2 === 1 ? label.slice(0, 3) : ""}</span>
              </div>
            ))}
          </div>

          {columns.map(({ col, cells }) => {
            const monthLabel = monthLabelForCol(cells);
            return (
              <div key={col} className="flex shrink-0 flex-col gap-1">
                <div className={cx("h-[14px] text-[10px] leading-none", TEXT_CAPTION)}>{monthLabel}</div>
                {cells.map((cell) => {
                  if (!cell.inRange) {
                    return <div key={cell.index} aria-hidden="true" className="h-8 w-8 sm:h-9 sm:w-9" />;
                  }
                  const bucket = intensityFor(cell.deployCount);
                  const isSelected = selectedDateMs === cell.dateMs;
                  const isFocusable = activeFocusKey === `${cell.col}:${cell.row}`;
                  const dateLabel = formatDate(cell.dateMs);
                  const desc = cell.deployCount === 0 ? "no deploys" : `${cell.deployCount} deploy${cell.deployCount === 1 ? "" : "s"}`;
                  const incidentDesc = cell.incident ? `, incident recorded (MTTR ${cell.mttrMinutes} min)` : "";

                  return (
                    <div key={cell.index} className="group relative">
                      <button
                        ref={(el) => {
                          if (el) cellRefs.current.set(`${cell.col}:${cell.row}`, el);
                          else cellRefs.current.delete(`${cell.col}:${cell.row}`);
                        }}
                        type="button"
                        tabIndex={isFocusable ? 0 : -1}
                        aria-pressed={isSelected}
                        aria-label={`${dateLabel}: ${desc}${incidentDesc}`}
                        onClick={() => onSelectDay(cell.dateMs)}
                        onKeyDown={(e) => handleKeyDown(e, cell)}
                        className={cx(
                          "relative grid h-8 w-8 place-items-center rounded-[6px] border text-[10px] font-semibold sm:h-9 sm:w-9 sm:text-[11px]",
                          bucket.bg,
                          bucket.text,
                          bucket.border,
                          NUM_CLASS,
                          TRANSITION,
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-zinc-950",
                          isSelected && "ring-2 ring-indigo-600 ring-offset-1 ring-offset-white dark:ring-indigo-400 dark:ring-offset-zinc-950",
                        )}
                      >
                        {cell.deployCount}
                        {cell.incident ? (
                          <span
                            aria-hidden="true"
                            className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full border border-white bg-rose-600 text-white dark:border-zinc-950 dark:bg-rose-500"
                          >
                            <AlertTriangle size={8} strokeWidth={3} />
                          </span>
                        ) : null}
                      </button>

                      {/* Keyboard-accessible tooltip: shown on hover and on focus-visible alike. */}
                      <div
                        role="tooltip"
                        className={cx(
                          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-max max-w-[11rem] -translate-x-1/2 rounded-lg border px-2 py-1.5 text-left text-[11px] opacity-0 shadow-lg transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
                          BORDER,
                          "bg-white dark:bg-zinc-900",
                        )}
                      >
                        <p className={cx("font-semibold", TEXT_PRIMARY)}>{formatDateShort(cell.dateMs)}</p>
                        <p className={TEXT_CAPTION}>
                          {desc}
                          {cell.incident ? ` · incident, ${cell.mttrMinutes}m MTTR` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cx("mt-3 flex flex-col gap-2.5 border-t pt-3", BORDER)}>
        <div className="flex flex-wrap items-center gap-3">
          <EyebrowLabel>Deploy count</EyebrowLabel>
          <div className="flex items-center gap-1">
            {intensitySwatches.map((b, i) => (
              <span key={i} className={cx("h-3.5 w-3.5 rounded-[4px] border", b.bg, b.border)} aria-hidden="true" />
            ))}
          </div>
          <span className={cx("text-xs", TEXT_CAPTION)}>Low to high</span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="grid h-3.5 w-3.5 place-items-center rounded-full bg-rose-600 text-white dark:bg-rose-500">
              <AlertTriangle size={8} strokeWidth={3} />
            </span>
            <span className={cx("text-xs", TEXT_CAPTION)}>Incident that day</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <EyebrowLabel>Services</EyebrowLabel>
          {SERVICES.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5">
              <span className={cx("h-2 w-2 rounded-full", s.dot)} aria-hidden="true" />
              <span className={cx("text-xs", TEXT_CAPTION)}>{s.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Screen-reader summary table — properly wrapped (never a bare sr-only on <table>). */}
      <div className="sr-only">
        <table>
          <caption>Daily deploy count and incident status by week and weekday for the selected period.</caption>
          <thead>
            <tr>
              <th scope="col">Week starting</th>
              {WEEKDAY_LABELS.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map(({ col, cells }) => (
              <tr key={col}>
                <th scope="row">{formatDate(cells.find((c) => c.inRange)?.dateMs ?? cells[0].dateMs)}</th>
                {cells.map((cell) => (
                  <td key={cell.index}>
                    {cell.inRange ? `${formatDate(cell.dateMs)}: ${cell.deployCount} deploys${cell.incident ? `, incident (${cell.mttrMinutes} min MTTR)` : ", no incident"}` : "outside selected period"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const NUM_CLASS = "tabular-nums [font-feature-settings:'tnum']";

const intensitySwatches = [
  { bg: "bg-zinc-100 dark:bg-white/[0.06]", border: "border-zinc-200 dark:border-white/10" },
  { bg: "bg-indigo-100 dark:bg-indigo-500/20", border: "border-indigo-200 dark:border-indigo-500/25" },
  { bg: "bg-indigo-300 dark:bg-indigo-500/45", border: "border-indigo-300 dark:border-indigo-400/40" },
  { bg: "bg-indigo-500 dark:bg-indigo-500/75", border: "border-indigo-500 dark:border-indigo-400/60" },
  { bg: "bg-indigo-700 dark:bg-indigo-400", border: "border-indigo-700 dark:border-indigo-300" },
];
