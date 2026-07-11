import { TrendingDown, TrendingUp } from "lucide-react";
import type { EventTypeId, Period } from "./data";
import { ACCENT_CLASSES, EVENT_TYPES, formatNumber, formatPercent } from "./data";
import { cn } from "./cn";

interface EventTypePanelProps {
  period: Period;
  selected: EventTypeId | "all";
  onSelect: (id: EventTypeId | "all") => void;
}

export function EventTypePanel({ period, selected, onSelect }: EventTypePanelProps) {
  const total = EVENT_TYPES.reduce((sum, t) => sum + t.counts[period], 0);

  return (
    <div role="group" aria-label="이벤트 타입별 성과 필터" className="space-y-1">
      <button
        type="button"
        aria-pressed={selected === "all"}
        onClick={() => onSelect("all")}
        className={cn(
          "flex w-full min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          selected === "all" ? "bg-indigo-50" : "hover:bg-zinc-50",
        )}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-900">전체</span>
          <span className="block text-[11.5px] text-zinc-500">모든 이벤트 타입</span>
        </span>
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-zinc-900">
          {formatNumber(total)}건
        </span>
      </button>

      <div className="my-1 border-t border-zinc-100" />

      {EVENT_TYPES.map((t) => {
        const accent = ACCENT_CLASSES[t.accent];
        const active = selected === t.id;
        const DeltaIcon = t.conversionRate >= 45 ? TrendingUp : TrendingDown;
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(t.id)}
            className={cn(
              "flex w-full min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              active ? accent.bg : "hover:bg-zinc-50",
            )}
          >
            <span className={cn("h-2 w-2 shrink-0 rounded-full", accent.dot)} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-zinc-900">
                {t.name}
              </span>
              <span className="flex items-center gap-1 text-[11.5px] text-zinc-500">
                <DeltaIcon
                  className={cn("h-3 w-3", t.conversionRate >= 45 ? "text-emerald-500" : "text-zinc-400")}
                  aria-hidden="true"
                />
                전환율 {formatPercent(t.conversionRate)} · {t.durationMin}분
              </span>
            </span>
            <span className="shrink-0 text-[13px] font-semibold tabular-nums text-zinc-900">
              {formatNumber(t.counts[period])}건
            </span>
          </button>
        );
      })}
    </div>
  );
}
