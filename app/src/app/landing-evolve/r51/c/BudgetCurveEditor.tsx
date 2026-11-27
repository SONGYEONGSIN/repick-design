"use client";

import { useRef } from "react";
import {
  CHART_H,
  MAX_VALUE,
  MIN_VALUE,
  MONTHS,
  STEP,
  STEP_LARGE,
  clampStep,
  formatUsd,
  valueToY,
  xPercentForIndex,
  yToValue,
} from "./data";
import { ACCENT_HEX, FOCUS_RING, MUTED_TEXT } from "./tokens";

const GRIDLINES = [0, 100, 200, 300, 400];

/**
 * The hero's core input device: six INDEPENDENTLY draggable/keyboard-adjustable points, one per
 * fixed month, each ranging freely 0-400 on its own -- not a single playhead selecting one
 * position, and not a fixed small set of sliders that renormalize to sum to a constant. Dragging
 * or arrow-keying any one point changes only that point; the resulting shape is whatever six
 * independent values the visitor leaves behind.
 */
export default function BudgetCurveEditor({
  values,
  activeIndex,
  onChange,
  onActivate,
}: {
  values: number[];
  activeIndex: number;
  onChange: (index: number, value: number) => void;
  onActivate: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingIndexRef = useRef<number | null>(null);

  function valueFromClientY(clientY: number): number {
    const el = trackRef.current;
    if (!el) return MIN_VALUE;
    const rect = el.getBoundingClientRect();
    if (rect.height === 0) return MIN_VALUE;
    // The track is rendered at a fixed logical height (CHART_H px) regardless of width, so the
    // pointer's offset from the track's own top edge maps 1:1 onto the same px scale valueToY
    // draws with -- no separate "rendered vs logical height" conversion needed.
    const relY = clientY - rect.top;
    return yToValue(relY);
  }

  function endDrag() {
    draggingIndexRef.current = null;
  }

  function handlePointerDown(i: number) {
    return (e: React.PointerEvent<HTMLButtonElement>) => {
      draggingIndexRef.current = i;
      e.currentTarget.setPointerCapture(e.pointerId);
      onActivate(i);
    };
  }

  function handlePointerMove(i: number) {
    return (e: React.PointerEvent<HTMLButtonElement>) => {
      if (draggingIndexRef.current !== i) return;
      onChange(i, valueFromClientY(e.clientY));
    };
  }

  function handleKeyDown(i: number, value: number) {
    return (e: React.KeyboardEvent<HTMLButtonElement>) => {
      let next: number | null = null;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          next = value + STEP;
          break;
        case "ArrowDown":
        case "ArrowLeft":
          next = value - STEP;
          break;
        case "PageUp":
          next = value + STEP_LARGE;
          break;
        case "PageDown":
          next = value - STEP_LARGE;
          break;
        case "Home":
          next = MIN_VALUE;
          break;
        case "End":
          next = MAX_VALUE;
          break;
        default:
          return;
      }
      if (next === null) return;
      e.preventDefault();
      onChange(i, clampStep(next));
      onActivate(i);
    };
  }

  const points = values.map((v, i) => ({
    i,
    value: v,
    xPct: xPercentForIndex(i),
    y: valueToY(v),
  }));
  const polylinePoints = points.map((p) => `${p.xPct},${p.y}`).join(" ");

  return (
    <div>
      <p className="sr-only">
        {`A six-point budget curve, one point per month from January through June. Tab to reach any point, then use the Up or Down arrow key to change that month's planned spend by $${STEP}, Page Up or Page Down to change it by $${STEP_LARGE}, or Home and End to set it to the minimum or maximum. Each point moves independently of the others.`}
      </p>

      <div className="pl-9 pt-6">
        <div
          ref={trackRef}
          className="relative w-full select-none"
          style={{ height: `${CHART_H}px` }}
        >
          {/* Gridlines + $ scale -- a fixed axis, not value-dependent, so these labels are static
              chrome computed once from the fixed MAX_VALUE/STEP scale, never restating a
              curve-dependent number. */}
          {GRIDLINES.map((g) => (
            <div
              key={g}
              aria-hidden="true"
              className="absolute left-0 right-0 border-t border-dashed border-[#23232C]"
              style={{ top: `${valueToY(g)}px` }}
            >
              <span
                className={`absolute -left-9 -top-2 w-7 text-right text-[10px] font-normal tabular-nums ${MUTED_TEXT}`}
              >
                ${g}
              </span>
            </div>
          ))}

          {/* Connecting line -- purely decorative, re-drawn every render from the live values. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 100 ${CHART_H}`}
            preserveAspectRatio="none"
          >
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={ACCENT_HEX}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {points.map(({ i, value, xPct, y }) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${xPct}%`, top: `${y}px` }}
              >
                <span
                  aria-hidden="true"
                  className={`motion-reduce:scale-100! pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs tabular-nums transition-all duration-150 ${
                    isActive
                      ? "scale-110 font-extrabold text-[#22D3EE]"
                      : `scale-100 font-normal ${MUTED_TEXT} group-hover:scale-110 group-hover:font-extrabold group-hover:text-[#22D3EE] group-focus-within:scale-110 group-focus-within:font-extrabold group-focus-within:text-[#22D3EE]`
                  }`}
                >
                  {formatUsd(value)}
                </span>
                <button
                  type="button"
                  role="slider"
                  aria-orientation="vertical"
                  aria-label={`${MONTHS[i]} planned spend`}
                  aria-valuemin={MIN_VALUE}
                  aria-valuemax={MAX_VALUE}
                  aria-valuenow={value}
                  aria-valuetext={`${formatUsd(value)} planned for ${MONTHS[i]}`}
                  onPointerDown={handlePointerDown(i)}
                  onPointerMove={handlePointerMove(i)}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={handleKeyDown(i, value)}
                  onFocus={() => onActivate(i)}
                  className={`relative h-7 w-7 touch-none rounded-full border-2 bg-[#0B0B0F] transition-colors duration-150 ${FOCUS_RING} ${
                    isActive ? "border-[#22D3EE]" : "border-zinc-500 group-hover:border-[#22D3EE]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-[6px] rounded-full transition-colors duration-150 ${
                      isActive ? "bg-[#22D3EE]" : "bg-zinc-500 group-hover:bg-[#22D3EE]"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className={`mt-1 flex justify-between text-xs font-semibold tracking-[0.02em] ${MUTED_TEXT}`}>
          {MONTHS.map((m, i) => (
            <span key={m} className={i === activeIndex ? "text-[#22D3EE]" : undefined}>
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
