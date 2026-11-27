"use client";

import { useState } from "react";
import { AlertTriangle, Pin } from "lucide-react";
import { MONTH_DAYS, engineerById, type DayCell } from "./data";
import { Badge } from "./ui";

const LEVEL_BG = ["bg-zinc-50", "bg-sky-100", "bg-sky-200", "bg-sky-300"];
const LEVEL_LABEL = ["Quiet", "Light", "Busy", "Heavy"];
const WEEKDAY_HEADER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarHeatmap({
  pinnedDate,
  onPinDate,
}: {
  pinnedDate: string;
  onPinDate: (dateIso: string) => void;
}) {
  const [readout, setReadout] = useState<DayCell | null>(null);
  const shown = readout ?? MONTH_DAYS.find((d) => d.dateIso === pinnedDate) ?? MONTH_DAYS[0];
  const shownEngineer = engineerById(shown.onCallEngineerId);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            {readout ? "Hovering" : "Pinned"}
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display-wide)] text-lg font-semibold tabular-nums text-zinc-900">
              {shown.dateIso}
            </span>
            <span className="text-sm text-zinc-600">
              {shown.incidentCount} incident{shown.incidentCount === 1 ? "" : "s"}
            </span>
            {shown.sev1Count > 0 ? (
              <Badge tone="rose">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                {shown.sev1Count} sev1
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="text-sm text-zinc-600">
          On-call: <span className="font-medium text-zinc-900">{shownEngineer.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {WEEKDAY_HEADER.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {MONTH_DAYS.map((day) => {
          const pinned = day.dateIso === pinnedDate;
          const inOctober = day.dateIso.startsWith("2026-10");
          return (
            <button
              key={day.dateIso}
              type="button"
              onMouseEnter={() => setReadout(day)}
              onMouseLeave={() => setReadout(null)}
              onFocus={() => setReadout(day)}
              onBlur={() => setReadout(null)}
              onClick={() => onPinDate(day.dateIso)}
              aria-pressed={pinned}
              className={`relative flex min-h-16 flex-col items-start justify-between rounded-md p-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none ${
                LEVEL_BG[day.coverageLevel]
              } ${inOctober ? "text-zinc-900" : "text-zinc-500"} ${pinned ? "ring-2 ring-sky-600" : ""}`}
            >
              {/* No competing aria-label: the accessible name is the visible content itself, plus
                  this trailing sr-only span that narrates what the day number/count alone don't say
                  (full date, on-call engineer, density tier, pin state) — so it can never diverge
                  from what's on screen. */}
              <span className="text-xs font-medium tabular-nums">{day.dayOfMonth}</span>
              {day.incidentCount > 0 ? (
                <span className="flex items-center gap-1 text-xs font-semibold tabular-nums">
                  {day.incidentCount}
                  {day.sev1Count > 0 ? (
                    <AlertTriangle className="h-3 w-3 text-rose-600" aria-hidden="true" />
                  ) : null}
                </span>
              ) : null}
              {pinned ? (
                <Pin
                  className="absolute right-1 top-1 h-3 w-3 text-sky-700"
                  aria-hidden="true"
                />
              ) : null}
              <span className="sr-only">
                {" "}
                — {day.dateIso}, {day.incidentCount} incident{day.incidentCount === 1 ? "" : "s"}
                {day.sev1Count ? `, ${day.sev1Count} sev1` : ""}, on-call {engineerById(day.onCallEngineerId).name}.{" "}
                {LEVEL_LABEL[day.coverageLevel]} day.{pinned ? " Currently pinned." : ""}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
        <span className="font-medium text-zinc-600">Density</span>
        {LEVEL_LABEL.map((label, idx) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`h-3 w-3 rounded-sm ${LEVEL_BG[idx]}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
