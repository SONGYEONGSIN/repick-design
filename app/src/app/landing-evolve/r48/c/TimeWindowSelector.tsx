"use client";

import { useRef } from "react";
import {
  DAY_COUNT,
  PRESETS,
  STEP_DAYS,
  STEP_DAYS_LARGE,
  WINDOW_MIN_DAYS,
  clampIndex,
  formatDayLabel,
} from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

const MIN_GAP = WINDOW_MIN_DAYS - 1; // handles are day-indices; a 7-day window spans a 6-index gap
const GROUP_LABEL_ID = "time-window-label";

function pctForIndex(i: number): number {
  return (i / (DAY_COUNT - 1)) * 100;
}

export default function TimeWindowSelector({
  start,
  end,
  onChange,
}: {
  start: number;
  end: number;
  onChange: (start: number, end: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<"start" | "end" | null>(null);

  function indexFromClientX(clientX: number): number {
    const el = trackRef.current;
    if (!el) return start;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return start;
    const pct = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    return clampIndex((pct / 100) * (DAY_COUNT - 1));
  }

  function moveHandle(which: "start" | "end", index: number) {
    if (which === "start") {
      onChange(Math.min(index, end - MIN_GAP), end);
    } else {
      onChange(start, Math.max(index, start + MIN_GAP));
    }
  }

  function endDrag() {
    draggingRef.current = null;
  }
  function handlePointerDownStart(e: React.PointerEvent<HTMLButtonElement>) {
    draggingRef.current = "start";
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function handlePointerDownEnd(e: React.PointerEvent<HTMLButtonElement>) {
    draggingRef.current = "end";
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function handlePointerMoveStart(e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingRef.current !== "start") return;
    moveHandle("start", indexFromClientX(e.clientX));
  }
  function handlePointerMoveEnd(e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingRef.current !== "end") return;
    moveHandle("end", indexFromClientX(e.clientX));
  }

  function stepFor(which: "start" | "end", current: number, key: string): number | null {
    switch (key) {
      case "ArrowLeft":
      case "ArrowDown":
        return current - STEP_DAYS;
      case "ArrowRight":
      case "ArrowUp":
        return current + STEP_DAYS;
      case "PageDown":
        return current - STEP_DAYS_LARGE;
      case "PageUp":
        return current + STEP_DAYS_LARGE;
      case "Home":
        return which === "start" ? 0 : start + MIN_GAP;
      case "End":
        return which === "end" ? DAY_COUNT - 1 : end - MIN_GAP;
      default:
        return null;
    }
  }
  function handleKeyDownStart(e: React.KeyboardEvent<HTMLButtonElement>) {
    const next = stepFor("start", start, e.key);
    if (next === null) return;
    e.preventDefault();
    moveHandle("start", next);
  }
  function handleKeyDownEnd(e: React.KeyboardEvent<HTMLButtonElement>) {
    const next = stepFor("end", end, e.key);
    if (next === null) return;
    e.preventDefault();
    moveHandle("end", next);
  }

  function applyPreset(days: number) {
    onChange(DAY_COUNT - days, DAY_COUNT - 1);
  }

  // Month-ish tick labels at four evenly-spaced points across the fixed 90-day strip.
  const tickIndices = [0, Math.round((DAY_COUNT - 1) / 3), Math.round(((DAY_COUNT - 1) * 2) / 3), DAY_COUNT - 1];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={GROUP_LABEL_ID} className="text-sm font-semibold tracking-[0.01em] text-[#09090B]">
          Time window
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Jump to a preset window">
          {PRESETS.map((p) => {
            const active = end === DAY_COUNT - 1 && end - start + 1 === p.days;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => applyPreset(p.days)}
                className={`min-h-9 rounded-full border px-3 text-xs font-semibold transition-colors duration-200 ${FOCUS_RING} ${
                  active
                    ? "border-[#059669] bg-[#059669] text-[#09090B]"
                    : `border-[#E4E4E7] bg-white ${MUTED_TEXT} hover:border-[#059669] hover:text-[#09090B]`
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only">
        A dual-handle timeline spanning {formatDayLabel(0)} to {formatDayLabel(DAY_COUNT - 1)}. Use Tab to
        reach either handle, then arrow keys to move it by one day, Page Up or Page Down to move by a week,
        and Home or End to jump to that handle&rsquo;s limit. The window must span at least {WINDOW_MIN_DAYS}
        days.
      </p>

      <div className="relative mt-5 select-none pb-5 pt-2">
        <div ref={trackRef} className="relative h-2 w-full rounded-full" style={{ backgroundColor: "#F4F4F5" }}>
          {/* week ticks -- decorative calendar-strip texture */}
          <div className="absolute inset-0 flex items-center justify-between px-[1px]" aria-hidden="true">
            {Array.from({ length: Math.floor((DAY_COUNT - 1) / 7) + 1 }, (_, i) => (
              <span key={i} className="h-2.5 w-px bg-[#D4D4D8]" />
            ))}
          </div>

          {/* selected window band */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full border border-[#059669] bg-[#059669]/15"
            style={{ left: `${pctForIndex(start)}%`, width: `${pctForIndex(end) - pctForIndex(start)}%` }}
          />

          {/* start handle */}
          <button
            type="button"
            role="slider"
            aria-orientation="horizontal"
            aria-label="Window start day"
            aria-valuemin={0}
            aria-valuemax={end - MIN_GAP}
            aria-valuenow={start}
            aria-valuetext={formatDayLabel(start)}
            onPointerDown={handlePointerDownStart}
            onPointerMove={handlePointerMoveStart}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDownStart}
            style={{ left: `${pctForIndex(start)}%` }}
            className={`absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-[#059669] shadow-[0_1px_4px_rgba(0,0,0,0.25)] ${FOCUS_RING}`}
          />

          {/* end handle */}
          <button
            type="button"
            role="slider"
            aria-orientation="horizontal"
            aria-label="Window end day"
            aria-valuemin={start + MIN_GAP}
            aria-valuemax={DAY_COUNT - 1}
            aria-valuenow={end}
            aria-valuetext={formatDayLabel(end)}
            onPointerDown={handlePointerDownEnd}
            onPointerMove={handlePointerMoveEnd}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDownEnd}
            style={{ left: `${pctForIndex(end)}%` }}
            className={`absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-[#059669] shadow-[0_1px_4px_rgba(0,0,0,0.25)] ${FOCUS_RING}`}
          />
        </div>

        <div className={`mt-2 flex justify-between text-[11px] font-normal tabular-nums tracking-[0.04em] ${MUTED_TEXT}`} aria-hidden="true">
          {tickIndices.map((i) => (
            <span key={i}>{formatDayLabel(i)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
