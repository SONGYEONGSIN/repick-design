"use client";

import { ArrowRight, Filter, RotateCcw, ScatterChart as ScatterChartIcon, Table2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, TEXT_DIM, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * ⌘K navigation only — jumps to a section or runs the filter rail's own reset.
 * It deliberately never touches `pinnedIds`: the chart-local pin stays reachable
 * from exactly one place, the data table's Pin column, so it never grows a third
 * independent consumer (the rail is the second-but-shared "reset" trigger, the
 * chart/table are the pin's only reader/writer pair).
 */
const DESTINATIONS = [
  { id: "filters", label: "Jump to filters", hint: "Channel, goal, window", Icon: Filter },
  { id: "chart", label: "Jump to scatter chart", hint: "Spend vs. conversion rate", Icon: ScatterChartIcon },
  { id: "table", label: "Jump to campaign table", hint: "Sortable, every exact value", Icon: Table2 },
] as const;

export default function CommandPalette({ onClose, onResetFilters }: { onClose: () => void; onResetFilters: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstItemRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function go(id: string) {
    onClose();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className={cx("relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl shadow-black/50", BORDER, PANEL_BG)}
      >
        <div className={cx("border-b px-4 py-3", BORDER)}>
          <p className={cx("text-xs font-semibold uppercase tracking-[0.06em]", TEXT_DIM)}>Go to</p>
        </div>
        <div className="p-1.5">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.id}
              ref={i === 0 ? firstItemRef : undefined}
              type="button"
              onClick={() => go(d.id)}
              className={cx("flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left", TRANSITION, FOCUS, HOVER_BG)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-zinc-950">
                <d.Icon size={14} aria-hidden="true" className={TEXT_DIM} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{d.label}</span>
                <span className={cx("block truncate text-[11px] font-normal", TEXT_DIM)}>{d.hint}</span>
              </span>
              <ArrowRight size={14} aria-hidden="true" className={cx("shrink-0", TEXT_DIM)} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className={cx("flex min-h-11 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left", TRANSITION, FOCUS, HOVER_BG)}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-zinc-950">
              <RotateCcw size={14} aria-hidden="true" className={TEXT_DIM} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>Reset all filters</span>
              <span className={cx("block truncate text-[11px] font-normal", TEXT_DIM)}>Channel, goal and window back to default</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
