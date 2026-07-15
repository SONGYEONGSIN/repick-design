"use client";

import type { WeekHourRow } from "../lib/calendar";
import type { DayMeta } from "../lib/data";
import EventChip from "./EventChip";

const GRID_COLS = "grid-cols-[52px_repeat(7,minmax(0,1fr))]";

interface WeekGridProps {
  week: DayMeta[];
  rows: WeekHourRow[];
  onSelectEvent: (id: string) => void;
  onSelectDay: (date: string) => void;
}

export default function WeekGrid({ week, rows, onSelectEvent, onSelectDay }: WeekGridProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={`grid shrink-0 border-b border-zinc-100 ${GRID_COLS}`}>
        <div />
        {week.map((day) => (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelectDay(day.date)}
            aria-label={`${day.month}월 ${day.dayOfMonth}일${day.isToday ? " (오늘)" : ""} — 게시물 목록 보기`}
            className="flex min-w-0 flex-col items-center gap-1 border-l border-zinc-100 py-2 transition-colors motion-reduce:transition-none first:border-l-0 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-500"
          >
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">{"일월화수목금토"[day.weekday]}</span>
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                day.isToday ? "bg-indigo-600 text-white" : "text-zinc-800"
              }`}
            >
              {day.dayOfMonth}
            </span>
          </button>
        ))}
      </div>

      <p className="sr-only">주간 캘린더, 08시부터 20시까지 시간대별 게시물이 표시됩니다.</p>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, rowIndex) => (
          <div key={row.hour} className={`grid min-h-[56px] border-b border-zinc-100 last:border-0 ${GRID_COLS}`}>
            <div className="border-r border-zinc-100 py-1 pr-2 text-right text-[11px] tabular-nums text-zinc-400">
              {String(row.hour).padStart(2, "0")}:00
            </div>
            {row.cells.map((posts, dayIndex) => (
              <div key={week[dayIndex].date} className="flex min-w-0 flex-col gap-1 border-l border-zinc-100 p-1 first:border-l-0">
                {posts.map((post) => (
                  <EventChip key={post.id} post={post} onSelect={onSelectEvent} tooltipAbove={rowIndex >= 9} dense />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
