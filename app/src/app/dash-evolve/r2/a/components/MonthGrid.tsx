"use client";

import type { MonthCell } from "../lib/calendar";
import { WEEKDAY_LABELS } from "../lib/data";
import EventChip from "./EventChip";

const VISIBLE_CAP = 3;

interface MonthGridProps {
  cells: MonthCell[];
  onSelectEvent: (id: string) => void;
  onSelectDay: (date: string) => void;
}

export default function MonthGrid({ cells, onSelectEvent, onSelectDay }: MonthGridProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-7 border-b border-zinc-100">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2 text-center text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {label}
          </div>
        ))}
      </div>

      <p className="sr-only">2026년 7월 캘린더. 각 날짜를 선택하면 해당일 게시물 목록을 볼 수 있습니다. 게시물을 선택하면 상세 정보가 열립니다.</p>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const rowIndex = Math.floor(i / 7);
            const isLastCol = i % 7 === 6;
            const isLastRow = i >= cells.length - 7;
            const visible = cell.events.slice(0, VISIBLE_CAP);
            const overflow = cell.events.length - visible.length;
            return (
              <div
                key={cell.date}
                className={`flex min-h-[118px] min-w-0 flex-col gap-1 p-1.5 ${isLastCol ? "" : "border-r border-zinc-100"} ${
                  isLastRow ? "" : "border-b border-zinc-100"
                } ${cell.isCurrentMonth ? "bg-white" : "bg-zinc-50/60"}`}
              >
                <button
                  type="button"
                  onClick={() => onSelectDay(cell.date)}
                  aria-label={`${cell.month}월 ${cell.dayOfMonth}일${cell.isToday ? " (오늘)" : ""} — 게시물 ${cell.events.length}건 보기`}
                  className={`flex size-6 shrink-0 items-center justify-center self-start rounded-full text-xs font-medium tabular-nums transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 ${
                    cell.isToday
                      ? "bg-indigo-600 text-white"
                      : cell.isCurrentMonth
                        ? "text-zinc-700 hover:bg-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-100"
                  }`}
                >
                  {cell.dayOfMonth}
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {visible.map((post) => (
                    <EventChip key={post.id} post={post} onSelect={onSelectEvent} tooltipAbove={rowIndex >= 3} dense />
                  ))}
                  {overflow > 0 && (
                    <button
                      type="button"
                      onClick={() => onSelectDay(cell.date)}
                      className="min-h-[20px] shrink-0 rounded-md px-1.5 text-left text-[11px] font-medium text-indigo-600 transition-colors motion-reduce:transition-none hover:bg-indigo-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500"
                    >
                      +{overflow}개 더보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
