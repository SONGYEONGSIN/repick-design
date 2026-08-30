"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, TriangleAlert, CalendarCheck2 } from "lucide-react";
import {
  type Civil,
  type DayCapacity,
  buildMonthGrid,
  buildWeekGrid,
  formatMonthTitle,
  formatMedium,
  formatLong,
  addDays,
  TODAY_ISO,
  TIER_CLASSES,
  TIER_LABEL,
} from "./data";
import { Progress, FOCUS } from "./ui";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function tooltipText(day: DayCapacity): string {
  if (day.tier === "none") return "Closed — no pickups scheduled";
  const plural = day.pickupCount === 1 ? "pickup" : "pickups";
  return `${day.pickupCount} ${plural} · ${day.hoursBooked}h / ${day.capacityMax}h booked (${TIER_LABEL[day.tier]})`;
}

export function Calendar({
  viewMode,
  monthCivil,
  onMonthNav,
  weekAnchor,
  onWeekNav,
  selectedIso,
  onSelect,
  onJumpToday,
}: {
  viewMode: "month" | "week";
  monthCivil: Civil;
  onMonthNav: (delta: number) => void;
  weekAnchor: Civil;
  onWeekNav: (delta: number) => void;
  selectedIso: string;
  onSelect: (iso: string) => void;
  onJumpToday: () => void;
}) {
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);

  const cells = viewMode === "month" ? buildMonthGrid(monthCivil.y, monthCivil.m) : buildWeekGrid(weekAnchor);
  const weekEnd = addDays(weekAnchor, 6);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => (viewMode === "month" ? onMonthNav(-1) : onWeekNav(-1))}
            aria-label={viewMode === "month" ? "Previous month" : "Previous week"}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => (viewMode === "month" ? onMonthNav(1) : onWeekNav(1))}
            aria-label={viewMode === "month" ? "Next month" : "Next week"}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-1 whitespace-nowrap text-[15px] font-semibold text-zinc-900">
            {viewMode === "month"
              ? formatMonthTitle(monthCivil.y, monthCivil.m)
              : `Week of ${formatMedium(weekAnchor)} – ${formatMedium(weekEnd)}`}
          </h2>
        </div>
        <button
          type="button"
          onClick={onJumpToday}
          className={`flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-50 ${FOCUS}`}
        >
          <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden />
          Today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 pb-1 text-center">
        {WEEKDAY_HEADERS.map((w) => (
          <div key={w} className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
            {w}
          </div>
        ))}
      </div>

      <div className={`grid flex-1 grid-cols-7 gap-1.5 ${viewMode === "month" ? "grid-rows-6" : ""}`}>
        {cells.map((day, i) => {
          const inMonth = viewMode === "week" || day.c.m === monthCivil.m;
          const isToday = day.iso === TODAY_ISO;
          const isSelected = day.iso === selectedIso;
          const isHovered = hoveredIso === day.iso;
          const tone = TIER_CLASSES[day.tier];
          const rowIndex = Math.floor(i / 7);
          const flipTooltip = viewMode === "week" || rowIndex === 0;

          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => onSelect(day.iso)}
              onMouseEnter={() => setHoveredIso(day.iso)}
              onMouseLeave={() => setHoveredIso((h) => (h === day.iso ? null : h))}
              onFocus={() => setHoveredIso(day.iso)}
              onBlur={() => setHoveredIso((h) => (h === day.iso ? null : h))}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={`${formatLong(day.c)}. ${tooltipText(day)}`}
              className={`relative flex flex-col justify-between rounded-lg border p-2 text-left transition-colors ${FOCUS} ${
                tone.bg
              } ${isSelected ? "border-2 border-teal-700" : `border ${tone.ring}`} ${
                inMonth ? "" : "opacity-45"
              } ${viewMode === "week" ? "min-h-[148px] p-3" : "min-h-[86px]"}`}
            >
              <div className="flex items-center justify-between">
                {isToday ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-[11.5px] font-semibold tabular-nums text-white">
                    {day.c.d}
                  </span>
                ) : (
                  <span className={`text-[13px] font-medium tabular-nums ${inMonth ? "text-zinc-900" : "text-zinc-400"}`}>
                    {day.c.d}
                  </span>
                )}
                {day.tier === "over" ? <TriangleAlert className="h-3.5 w-3.5 text-red-600" aria-hidden /> : null}
              </div>

              <div className="mt-1 flex items-baseline gap-1">
                <span className={`font-semibold tabular-nums ${viewMode === "week" ? "text-[22px]" : "text-[16px]"} ${
                  day.tier === "none" ? "text-zinc-300" : "text-zinc-900"
                }`}>
                  {day.tier === "none" ? "—" : day.pickupCount}
                </span>
                {day.tier !== "none" ? (
                  <span className="hidden text-[10px] text-zinc-400 sm:inline">
                    {day.pickupCount === 1 ? "pickup" : "pickups"}
                  </span>
                ) : null}
              </div>

              <div className="mt-auto space-y-1 pt-1" aria-hidden>
                {/* Purely decorative here — the button's own aria-label above
                    already states the hours/capacity/tier for screen readers,
                    so this bar and its text are hidden from the a11y tree to
                    avoid a duplicate, out-of-order announcement. */}
                <Progress value={day.hoursBooked} max={Math.max(day.capacityMax, 1)} barClassName={tone.bar} trackClassName="bg-white/70" />
                <span className={`hidden truncate text-[10px] tabular-nums sm:block ${tone.text}`}>
                  {day.hoursBooked}h / {day.capacityMax}h
                </span>
              </div>

              {isHovered ? (
                <div
                  role="tooltip"
                  className={`pointer-events-none absolute left-1/2 z-20 w-max max-w-[180px] -translate-x-1/2 rounded-md border border-zinc-200 bg-zinc-900 px-2.5 py-1.5 text-[11px] leading-snug text-white shadow-lg ${
                    flipTooltip ? "top-full mt-1.5" : "bottom-full mb-1.5"
                  }`}
                >
                  {tooltipText(day)}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
