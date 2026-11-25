"use client";

import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CALENDAR_WEEKS,
  CURRENT_WEEK_INDEX,
  HEAT_CELL_CLASS,
  HEAT_TEXT_CLASS,
  MONTH_LABEL,
  TODAY_DAY,
  WEEKDAY_SHORT,
  dayCount,
  formatDayShort,
  heatBucket,
  visitTypeBreakdownForDay,
  type Visit,
} from "./data";
import { Card, CardHeader } from "./Card";
import { SegmentedControl } from "./SegmentedControl";
import { cx, FOCUS_RING_INSET } from "./ui";

export type CalendarView = "month" | "week";

interface CalendarPanelProps {
  visits: Visit[];
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

interface Tip {
  day: number;
  x: number;
  y: number;
  below: boolean;
}

export function CalendarPanel({ visits, view, onViewChange, selectedDay, onSelectDay }: CalendarPanelProps) {
  const [weekIndex, setWeekIndex] = useState(CURRENT_WEEK_INDEX);
  const [tip, setTip] = useState<Tip | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const weeks = view === "month" ? CALENDAR_WEEKS : [CALENDAR_WEEKS[weekIndex]];
  const inMonthDays = weeks.flat().filter((c) => c.inMonth).map((c) => c.day);

  function showTip(day: number, el: HTMLElement) {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const x = Math.min(Math.max(eRect.left - cRect.left + eRect.width / 2, 72), cRect.width - 72);
    const topOffset = eRect.top - cRect.top;
    const below = topOffset < 140;
    const y = below ? eRect.bottom - cRect.top : topOffset;
    setTip({ day, x, y, below });
  }

  function hideTip() {
    setTip(null);
  }

  function handleKeyNav(e: ReactKeyboardEvent<HTMLButtonElement>, day: number) {
    const delta =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? 7 : e.key === "ArrowUp" ? -7 : 0;
    if (delta === 0) return;
    e.preventDefault();
    const target = day + delta;
    if (!inMonthDays.includes(target)) return;
    cellRefs.current.get(target)?.focus();
  }

  const tipBreakdown = tip ? visitTypeBreakdownForDay(visits, tip.day) : [];
  const tipCount = tip ? dayCount(visits, tip.day) : 0;

  return (
    <Card>
      <CardHeader
        id="calendar-heading"
        title={view === "month" ? MONTH_LABEL : `Week of ${formatDayShort(CALENDAR_WEEKS[weekIndex][0].day)}`}
        description="Visit density across every site this trial runs. Darker cells carry more scheduled visits."
        right={
          <div className="flex items-center gap-2">
            {view === "week" && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={weekIndex === 0}
                  onClick={() => setWeekIndex((w) => Math.max(0, w - 1))}
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                    FOCUS_RING_INSET
                  )}
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  disabled={weekIndex === CALENDAR_WEEKS.length - 1}
                  onClick={() => setWeekIndex((w) => Math.min(CALENDAR_WEEKS.length - 1, w + 1))}
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40",
                    FOCUS_RING_INSET
                  )}
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
            <SegmentedControl
              label="Calendar view"
              value={view}
              onChange={onViewChange}
              options={[
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
              ]}
            />
          </div>
        }
      />

      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAY_SHORT.map((d) => (
            <div key={d} className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {d}
            </div>
          ))}
        </div>

        <div className={cx("mt-1.5 grid grid-cols-7 gap-1.5", view === "week" && "sm:gap-3")}>
          {weeks.flat().map((cell, idx) => {
            if (!cell.inMonth) {
              return (
                <div
                  key={`fill-${idx}`}
                  className="flex min-h-14 items-start justify-end rounded-lg border border-transparent p-1.5 sm:min-h-16"
                >
                  <span className="text-xs text-zinc-500">{cell.day}</span>
                </div>
              );
            }

            const count = dayCount(visits, cell.day);
            const bucket = heatBucket(count);
            const isToday = cell.day === TODAY_DAY;
            const isSelected = cell.day === selectedDay;

            return (
              <button
                key={cell.day}
                ref={(el) => {
                  if (el) cellRefs.current.set(cell.day, el);
                  else cellRefs.current.delete(cell.day);
                }}
                type="button"
                onClick={() => onSelectDay(cell.day)}
                onMouseEnter={(e) => showTip(cell.day, e.currentTarget)}
                onMouseLeave={hideTip}
                onFocus={(e) => showTip(cell.day, e.currentTarget)}
                onBlur={hideTip}
                onKeyDown={(e) => handleKeyNav(e, cell.day)}
                aria-pressed={isSelected}
                className={cx(
                  "flex min-h-14 flex-col items-start justify-between rounded-lg border p-1.5 text-left transition-colors sm:min-h-16 sm:p-2",
                  FOCUS_RING_INSET,
                  isSelected ? "border-2 border-lime-600" : "border border-zinc-200",
                  HEAT_CELL_CLASS[bucket]
                )}
              >
                <span className={cx("text-xs font-medium tabular-nums", isToday ? "text-zinc-900" : "text-zinc-700")}>
                  {cell.day}
                  {isToday && <span className="sr-only"> (Today)</span>}
                </span>
                <span className="flex w-full items-center justify-between">
                  {isToday && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime-600" />}
                  {count > 0 ? (
                    <span className={cx("ml-auto text-sm font-bold tabular-nums", HEAT_TEXT_CLASS[bucket])}>
                      {count}
                      <span className="sr-only"> visits scheduled</span>
                    </span>
                  ) : (
                    <span className="ml-auto text-xs text-zinc-500">
                      <span aria-hidden="true">–</span>
                      <span className="sr-only">No visits scheduled</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {tip && (
          <div
            role="status"
            style={{ left: tip.x, top: tip.below ? tip.y + 8 : Math.max(0, tip.y - 8) }}
            className={cx(
              "pointer-events-none absolute z-10 w-44 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-2.5 text-xs shadow-lg",
              !tip.below && "-translate-y-full"
            )}
          >
            <p className="font-bold tabular-nums text-zinc-900">
              {formatDayShort(tip.day)} · {tipCount} {tipCount === 1 ? "visit" : "visits"}
            </p>
            {tipBreakdown.length > 0 ? (
              <ul className="mt-1 space-y-0.5">
                {tipBreakdown.map((b) => (
                  <li key={b.type} className="flex items-center justify-between gap-2 text-zinc-600">
                    <span className="truncate">{b.type}</span>
                    <span className="tabular-nums font-medium text-zinc-800">{b.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-zinc-500">No visits scheduled.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
