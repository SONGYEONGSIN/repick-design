"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AlertCircle } from "lucide-react";
import {
  DAYS_IN_MONTH, MONTH_LABEL, TODAY_DAY, WEEKDAY_LABELS,
  buildMonthGrid, getBookingsForDay, getDayStats, getRoomById, formatClock,
  usdCompactFmt, type ViewMode,
} from "./data";
import { DISPLAY_FACE, NUM, SegmentedControl } from "./ui";

/** Shared description for a day, read by assistive tech as the button's full accessible name — the
 *  visible day-number / revenue pieces inside the cell are marked `aria-hidden` decorative
 *  duplicates of this text, so there is no separate custom `aria-label` to drift out of sync with
 *  what's on screen. */
function dayAriaLabel(day: number, inMonth: boolean, isToday: boolean, isSelected: boolean): string {
  if (!inMonth) return `December ${day}, outside November`;
  const stats = getDayStats(day);
  const parts = [`November ${day}`];
  if (isToday) parts.push("today");
  if (stats.activeCount > 0) {
    parts.push(`${stats.activeCount} ${stats.activeCount === 1 ? "booking" : "bookings"}`);
    parts.push(usdCompactFmt.format(stats.revenue));
    if (stats.hasPending) parts.push("deposit pending");
  } else {
    parts.push("no bookings");
  }
  if (isSelected) parts.push("selected");
  return parts.join(", ");
}

function MonthCell({
  day, inMonth, isToday, isSelected, tabIndex, cellRef, onSelect, onFocus,
}: {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  tabIndex: 0 | -1;
  cellRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onFocus: () => void;
}) {
  const stats = inMonth ? getDayStats(day) : null;

  const base = "group relative flex min-h-[72px] flex-col justify-between rounded-lg border p-1.5 text-left sm:min-h-[88px] sm:p-2";
  const tone = isSelected
    ? "border-orange-700 bg-orange-700 text-white"
    : !inMonth
      ? "border-zinc-100 bg-zinc-50 text-zinc-500"
      : "border-zinc-200 bg-white text-zinc-900 hover:border-orange-200 hover:bg-orange-50/60";

  return (
    <button
      ref={cellRef}
      type="button"
      tabIndex={tabIndex}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
      onClick={onSelect}
      onFocus={onFocus}
      className={`${base} ${tone} transition-colors motion-reduce:transition-none focus-visible:outline-2 outline-offset-2 outline-orange-600`}
    >
      <span className="sr-only">{dayAriaLabel(day, inMonth, isToday, isSelected)}</span>
      <span aria-hidden="true" className="flex w-full items-center justify-between">
        <span
          className={`text-[11px] font-medium sm:text-xs ${
            isToday && !isSelected ? "flex h-5 w-5 items-center justify-center rounded-full bg-orange-700 text-white" : ""
          }`}
        >
          {day}
        </span>
        {stats?.hasPending ? (
          <AlertCircle className={`h-3 w-3 shrink-0 ${isSelected ? "text-white" : "text-orange-700"}`} />
        ) : null}
      </span>
      <span aria-hidden="true" className="flex w-full items-end justify-between gap-1">
        {stats && stats.activeCount > 0 ? (
          <>
            <span className={`min-w-0 truncate text-[11px] font-medium sm:text-xs ${NUM} ${isSelected ? "text-white" : "text-zinc-900"}`}>
              {usdCompactFmt.format(stats.revenue)}
            </span>
            <span className={`shrink-0 rounded px-1 text-[10px] font-medium ${NUM} ${isSelected ? "text-white" : "bg-zinc-100 text-zinc-600"}`}>
              ×{stats.activeCount}
            </span>
          </>
        ) : (
          <span className={`text-[10px] ${isSelected ? "text-white" : "text-zinc-500"}`}>—</span>
        )}
      </span>
    </button>
  );
}

function MonthView({ selectedDay, onSelectDay }: { selectedDay: number; onSelectDay: (day: number) => void }) {
  const grid = useMemo(() => buildMonthGrid(), []);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(() => selectedDay - 1);

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
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {w}
          </div>
        ))}
      </div>
      <div
        role="group"
        aria-label={`${MONTH_LABEL} calendar, colored by booking revenue`}
        onKeyDown={onGridKeyDown}
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
      >
        {grid.map((cell) => (
          <MonthCell
            key={cell.index}
            day={cell.day}
            inMonth={cell.inMonth}
            isToday={cell.inMonth && cell.day === TODAY_DAY}
            isSelected={cell.inMonth && cell.day === selectedDay}
            tabIndex={cell.index === focusIndex ? 0 : -1}
            cellRef={(el) => { cellRefs.current[cell.index] = el; }}
            onSelect={() => cell.inMonth && onSelectDay(cell.day)}
            onFocus={() => setFocusIndex(cell.index)}
          />
        ))}
      </div>
    </div>
  );
}

function weekStartFor(day: number): number {
  const grid = buildMonthGrid();
  const cell = grid.find((c) => c.inMonth && c.day === day);
  const weekday = cell ? cell.weekday : 0;
  return day - weekday;
}

function WeekView({ selectedDay, onSelectDay }: { selectedDay: number; onSelectDay: (day: number) => void }) {
  const start = weekStartFor(selectedDay);
  const days = Array.from({ length: 7 }, (_, i) => start + i);

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {w}
          </div>
        ))}
      </div>
      <div role="group" aria-label="Selected week" className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const inMonth = day >= 1 && day <= DAYS_IN_MONTH;
          const stats = inMonth ? getDayStats(day) : null;
          const bookings = inMonth ? getBookingsForDay(day).filter((b) => b.status !== "cancelled") : [];
          const isSelected = inMonth && day === selectedDay;
          const isToday = inMonth && day === TODAY_DAY;
          return (
            <button
              key={day}
              type="button"
              disabled={!inMonth}
              onClick={() => inMonth && onSelectDay(day)}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              className={`flex min-h-[220px] flex-col gap-1.5 rounded-lg border p-1.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 outline-offset-2 outline-orange-600 sm:p-2 ${
                !inMonth
                  ? "border-zinc-100 bg-zinc-50 text-zinc-500"
                  : isSelected
                    ? "border-orange-700 bg-orange-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-900 hover:border-orange-200 hover:bg-orange-50/60"
              }`}
            >
              <span className="sr-only">{inMonth ? dayAriaLabel(day, true, isToday, isSelected) : "Outside November"}</span>
              <span aria-hidden="true" className={`text-xs font-medium ${isToday && !isSelected ? "text-orange-700" : ""}`}>
                {inMonth ? day : ""}
              </span>
              {inMonth && stats && stats.activeCount > 0 ? (
                <span aria-hidden="true" className={`text-[11px] font-medium ${NUM} ${isSelected ? "text-white" : "text-zinc-900"}`}>
                  {usdCompactFmt.format(stats.revenue)}
                </span>
              ) : null}
              <span aria-hidden="true" className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
                {bookings.slice(0, 3).map((bk) => (
                  <span
                    key={bk.id}
                    className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight ${
                      isSelected ? "border border-white/40 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {formatClock(bk.start)} · {getRoomById(bk.room).code} · {bk.eventName}
                  </span>
                ))}
                {bookings.length > 3 ? (
                  <span className={`text-[10px] ${isSelected ? "text-white" : "text-zinc-500"}`}>+{bookings.length - 3} more</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({ selectedDay, onSelectDay }: { selectedDay: number; onSelectDay: (day: number) => void }) {
  const busyDays = useMemo(
    () => Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).filter((d) => getDayStats(d).activeCount > 0),
    [],
  );

  return (
    <ul className="flex flex-col gap-2">
      {busyDays.map((day) => {
        const stats = getDayStats(day);
        const isSelected = day === selectedDay;
        const isToday = day === TODAY_DAY;
        return (
          <li key={day}>
            <button
              type="button"
              onClick={() => onSelectDay(day)}
              aria-pressed={isSelected}
              className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 outline-offset-2 outline-orange-600 ${
                isSelected ? "border-orange-700 bg-orange-700 text-white" : "border-zinc-200 bg-white hover:border-orange-200 hover:bg-orange-50/60"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-medium ${
                    isSelected ? "bg-white text-orange-700" : isToday ? "bg-orange-50 text-orange-700" : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {day}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-medium ${isSelected ? "text-white" : "text-zinc-900"}`}>
                    November {day}{isToday ? " · Today" : ""}
                  </span>
                  <span className={`block truncate text-xs ${isSelected ? "text-white" : "text-zinc-500"}`}>
                    {stats.activeCount} {stats.activeCount === 1 ? "booking" : "bookings"}
                    {stats.hasPending ? " · deposit pending" : ""}
                  </span>
                </span>
              </span>
              <span className={`shrink-0 whitespace-nowrap text-sm font-medium ${NUM} ${isSelected ? "text-white" : "text-zinc-900"}`}>
                {usdCompactFmt.format(stats.revenue)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function BookingCalendar({
  view, selectedDay, onSelectDay, onViewChange, onJumpToday,
}: {
  view: ViewMode;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onViewChange: (view: ViewMode) => void;
  onJumpToday: () => void;
}) {
  return (
    <section aria-labelledby="calendar-heading">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 id="calendar-heading" className="min-w-0 flex-1 text-xl font-semibold text-zinc-900 sm:text-2xl" style={DISPLAY_FACE}>
          {MONTH_LABEL}
        </h2>
        <button
          type="button"
          onClick={onJumpToday}
          className="h-11 shrink-0 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 motion-reduce:transition-none focus-visible:outline-2 outline-offset-2 outline-orange-600"
        >
          Today
        </button>
        <SegmentedControl
          label="Calendar view"
          options={[
            { value: "month" as ViewMode, label: "Month" },
            { value: "week" as ViewMode, label: "Week" },
            { value: "agenda" as ViewMode, label: "Agenda" },
          ]}
          value={view}
          onChange={onViewChange}
        />
      </div>
      {view === "month" ? (
        <MonthView selectedDay={selectedDay} onSelectDay={onSelectDay} />
      ) : view === "week" ? (
        <WeekView selectedDay={selectedDay} onSelectDay={onSelectDay} />
      ) : (
        <AgendaView selectedDay={selectedDay} onSelectDay={onSelectDay} />
      )}
      <div aria-hidden="true" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-orange-700" />
          Selected day
        </span>
        <span className="flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-orange-700" />
          Deposit pending
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-dashed border-zinc-300 bg-zinc-50" />
          Outside November
        </span>
      </div>
    </section>
  );
}
