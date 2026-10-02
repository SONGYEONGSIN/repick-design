"use client";

import { Circle, ShieldCheck, TriangleAlert } from "lucide-react";
import type { PeriodId, SeriesStyle, Vendor } from "./data";
import { overallScore } from "./data";

const STATUS_ICON = {
  preferred: ShieldCheck,
  standard: Circle,
  "at-risk": TriangleAlert,
} as const;

/**
 * The page's single selection mechanism: toggling a chip directly recomputes the radar chart and
 * its fallback table in place — there is no separate detail pane this swaps content on. Order of
 * selection assigns which of the four fixed series styles (color + stroke pattern + marker shape)
 * a vendor gets, so the same vendor can carry a different style across sessions depending on pick
 * order, but always stays visually consistent across chips, chart and table within one session.
 */
export function EntityToggle({
  vendors,
  selectedIds,
  onToggle,
  max,
  period,
  styles,
  message,
}: {
  vendors: Vendor[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  max: number;
  period: PeriodId;
  styles: SeriesStyle[];
  message: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Overlay vendors on the radar chart, up to ${max} at once`}>
        {vendors.map((vendor) => {
          const idx = selectedIds.indexOf(vendor.id);
          const selected = idx >= 0;
          const style = selected ? styles[idx] : undefined;
          const score = overallScore(vendor.scores[period]);
          const StatusIcon = STATUS_ICON[vendor.status];
          return (
            <button
              key={vendor.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(vendor.id)}
              className={`group flex max-w-[220px] items-center gap-2 rounded-full border px-2.5 py-1.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
                selected
                  ? "border-lime-200 bg-lime-50"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                style={{ backgroundColor: style ? style.color : "#71717A" }}
              >
                {vendor.initials}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1 truncate text-xs text-zinc-800">
                  {vendor.name}
                </span>
                <span className={`flex items-center gap-1 text-[11px] ${selected ? "text-zinc-600" : "text-zinc-500"}`}>
                  <StatusIcon aria-hidden="true" className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
                  <span className="truncate">{vendor.category}</span>
                </span>
              </span>
              <span className="ml-auto shrink-0 tabular-nums text-xs text-zinc-700">{score}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 min-h-[1rem] text-xs text-lime-800" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
