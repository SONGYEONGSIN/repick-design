"use client";

import { useState } from "react";
import type { EventTypeId } from "./data";
import { HEAT_DAYS, HEAT_HOURS, formatNumber, heatMax, heatValue } from "./data";
import { cn } from "./cn";

interface WeekHeatmapProps {
  eventTypeId: EventTypeId | "all";
  eventTypeLabel: string;
}

interface ActiveCell {
  dayIdx: number;
  hourIdx: number;
}

export function WeekHeatmap({ eventTypeId, eventTypeLabel }: WeekHeatmapProps) {
  const [active, setActive] = useState<ActiveCell | null>(null);

  const max = heatMax(eventTypeId);
  const total = HEAT_DAYS.reduce(
    (sum, _, dayIdx) =>
      sum + HEAT_HOURS.reduce((s, __, hourIdx) => s + heatValue(dayIdx, hourIdx, eventTypeId), 0),
    0,
  );

  const activeValue = active ? heatValue(active.dayIdx, active.hourIdx, eventTypeId) : null;
  const activeSharePct =
    active && total > 0 ? Math.round(((activeValue ?? 0) / total) * 1000) / 10 : null;

  return (
    <div className="relative">
      {active ? (
        <div
          role="status"
          className="pointer-events-none absolute -top-1 right-0 z-10 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 shadow-md"
        >
          <p className="whitespace-nowrap text-[11px] font-medium text-zinc-500">
            {HEAT_DAYS[active.dayIdx]} {HEAT_HOURS[active.hourIdx]}:00
          </p>
          <p className="whitespace-nowrap text-[13px] font-semibold tabular-nums text-zinc-900">
            {formatNumber(activeValue ?? 0)} bookings
          </p>
          <p className="whitespace-nowrap text-[11.5px] tabular-nums text-zinc-500">
            {activeSharePct}% of week
          </p>
        </div>
      ) : null}

      <table className="w-full border-separate border-spacing-1">
        <caption className="mb-2 text-left text-[12.5px] text-zinc-500">
          {eventTypeLabel} · Booking density by hour, weekdays 9:00–17:00
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-10">
              <span className="sr-only">Hour</span>
            </th>
            {HEAT_DAYS.map((day) => (
              <th
                key={day}
                scope="col"
                className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HEAT_HOURS.map((hour, hourIdx) => (
            <tr key={hour}>
              <th
                scope="row"
                className="w-10 pr-1 text-right text-[11px] tabular-nums font-normal text-zinc-500"
              >
                {hour}:00
              </th>
              {HEAT_DAYS.map((day, dayIdx) => {
                const value = heatValue(dayIdx, hourIdx, eventTypeId);
                const intensity = max > 0 ? value / max : 0;
                const isActive = active?.dayIdx === dayIdx && active?.hourIdx === hourIdx;
                return (
                  <td key={day} className="p-0">
                    <button
                      type="button"
                      onMouseEnter={() => setActive({ dayIdx, hourIdx })}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive({ dayIdx, hourIdx })}
                      onBlur={() => setActive(null)}
                      aria-label={`${day} ${hour}:00 · ${value} bookings`}
                      style={{
                        backgroundColor: `rgba(79, 70, 229, ${(0.08 + intensity * 0.62).toFixed(2)})`,
                      }}
                      className={cn(
                        "flex h-9 w-full min-w-9 items-center justify-center rounded-md text-[11px] font-medium tabular-nums transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 motion-safe:hover:scale-[1.06] motion-reduce:transition-none",
                        // 흰 글자는 이 램프 어디서도 AA 를 못 넘는다 — 최대 알파(0.70)에서도 3.41:1 이다.
                        // 전 구간을 넘는 것은 zinc-900 뿐이라(최악 5.19:1) 강도 분기를 없앤다.
                        "text-zinc-900",
                        isActive && "ring-2 ring-indigo-500",
                      )}
                    >
                      {value}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
