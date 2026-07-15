"use client";

import { CalendarRange, ChevronLeft, ChevronRight, LayoutGrid, RotateCcw } from "lucide-react";
import type { ChannelId } from "../lib/data";
import { CHANNEL_META, Segmented } from "./ui";
import type { CalendarView } from "./CadenceClient";

interface CalendarToolbarProps {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  periodLabel: string;
  weekIndex: number;
  weekCount: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  channels: ChannelId[];
  activeChannels: ChannelId[];
  onToggleChannel: (c: ChannelId) => void;
  onResetChannels: () => void;
}

export default function CalendarToolbar({
  view,
  onViewChange,
  periodLabel,
  weekIndex,
  weekCount,
  onPrevWeek,
  onNextWeek,
  onToday,
  channels,
  activeChannels,
  onToggleChannel,
  onResetChannels,
}: CalendarToolbarProps) {
  const allActive = activeChannels.length === channels.length;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="보기 전환"
          value={view}
          onChange={onViewChange}
          options={[
            { value: "month", label: "월간", Icon: LayoutGrid },
            { value: "week", label: "주간", Icon: CalendarRange },
          ]}
        />

        {view === "week" ? (
          <div className="flex h-11 items-center gap-1 rounded-lg border border-zinc-200 bg-white pr-1 pl-2.5">
            <button
              type="button"
              onClick={onPrevWeek}
              disabled={weekIndex === 0}
              aria-label="이전 주"
              className="flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="min-w-[132px] text-center text-sm font-medium tabular-nums whitespace-nowrap text-zinc-800">{periodLabel}</span>
            <button
              type="button"
              onClick={onNextWeek}
              disabled={weekIndex === weekCount - 1}
              aria-label="다음 주"
              className="flex size-8 items-center justify-center rounded-md text-zinc-500 transition-colors motion-reduce:transition-none hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onToday}
              className="ml-1 flex h-8 items-center gap-1 rounded-md border border-zinc-200 px-2 text-xs font-medium text-zinc-600 transition-colors motion-reduce:transition-none hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              오늘
            </button>
          </div>
        ) : (
          <span className="text-sm font-medium tabular-nums text-zinc-800">{periodLabel}</span>
        )}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5" role="group" aria-label="채널 필터">
        <button
          type="button"
          onClick={onResetChannels}
          aria-pressed={allActive}
          className={`inline-flex h-11 items-center rounded-full border px-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            allActive ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
          }`}
        >
          전체
        </button>
        {channels.map((c) => {
          const meta = CHANNEL_META[c];
          const active = activeChannels.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => onToggleChannel(c)}
              aria-pressed={active}
              className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                active ? `border-transparent ${meta.chip}` : "border-zinc-200 bg-white text-zinc-400 hover:bg-zinc-50"
              }`}
            >
              <meta.Icon className="size-3.5" aria-hidden="true" />
              {meta.label}
              {active && <span className="sr-only">(선택됨)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
