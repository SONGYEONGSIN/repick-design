"use client";

import { useId, useState, type CSSProperties } from "react";
import { ACCENT, BORDER, FG, MUTED, STAT_TRACKING } from "./tokens";
import { formatUsd } from "./model";

interface DualRangeSliderProps {
  bound: readonly [number, number];
  step: number;
  gap: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (next: number) => void;
  onChangeMax: (next: number) => void;
  compact?: boolean;
}

/**
 * The page's one manipulation device: two independent native `<input type="range">` controls
 * sharing a track, so drag, click-the-thumb, and arrow keys after Tab all move one handle each.
 * Each input keeps its own full hit area for keyboard focus, but `pointer-events: none` on the
 * input body with `pointer-events: auto` restored only on the thumb pseudo-element means a mouse
 * can only ever grab a thumb, never the invisible far side of the other input's track — the
 * standard accessible two-up-range trick. Whichever handle was most recently focused/pressed gets
 * a higher z-index, so the two thumbs never permanently block each other when they sit close.
 */
export function DualRangeSlider({
  bound,
  step,
  gap,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  compact = false,
}: DualRangeSliderProps) {
  const [boundMin, boundMax] = bound;
  const minId = useId();
  const maxId = useId();
  const [active, setActive] = useState<"min" | "max">("max");

  const pctMin = ((valueMin - boundMin) / (boundMax - boundMin)) * 100;
  const pctMax = ((valueMax - boundMin) / (boundMax - boundMin)) * 100;

  function handleMinChange(next: number) {
    onChangeMin(Math.min(next, valueMax - gap));
  }
  function handleMaxChange(next: number) {
    onChangeMax(Math.max(next, valueMin + gap));
  }

  return (
    <div className="w-full">
      {!compact ? (
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <span className={`text-[11px] font-semibold uppercase ${STAT_TRACKING}`} style={{ color: MUTED }}>
            Price range you&apos;re comfortable with
          </span>
        </div>
      ) : null}

      <div
        className="relative flex items-center justify-between gap-3 text-[15px] font-semibold tabular-nums"
        style={{ color: FG }}
      >
        <span aria-hidden="true">{formatUsd(valueMin)}</span>
        <span className="text-[12px] font-normal" style={{ color: MUTED }}>
          to
        </span>
        <span aria-hidden="true">{formatUsd(valueMax)}</span>
      </div>

      <div className="relative mt-3 h-6">
        {/* static full track */}
        <div
          className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: BORDER }}
          aria-hidden="true"
        />
        {/* live selected-range fill */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: ACCENT, left: `${pctMin}%`, right: `${100 - pctMax}%` }}
          aria-hidden="true"
        />
        <input
          id={minId}
          type="range"
          min={boundMin}
          max={boundMax}
          step={step}
          value={valueMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          onPointerDown={() => setActive("min")}
          onFocus={() => setActive("min")}
          aria-label="Minimum price"
          aria-valuetext={formatUsd(valueMin)}
          className="dual-range-input"
          style={{ zIndex: active === "min" ? 3 : 2 } as CSSProperties}
        />
        <input
          id={maxId}
          type="range"
          min={boundMin}
          max={boundMax}
          step={step}
          value={valueMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          onPointerDown={() => setActive("max")}
          onFocus={() => setActive("max")}
          aria-label="Maximum price"
          aria-valuetext={formatUsd(valueMax)}
          className="dual-range-input"
          style={{ zIndex: active === "max" ? 3 : 2 } as CSSProperties}
        />
      </div>

      {!compact ? (
        <div className="mt-2 flex justify-between text-[11px] font-normal tabular-nums" style={{ color: MUTED }}>
          <span>{formatUsd(boundMin)}</span>
          <span>{formatUsd(boundMax)}</span>
        </div>
      ) : null}

      <style>{`
        .dual-range-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
        .dual-range-input::-webkit-slider-runnable-track {
          background: transparent;
        }
        .dual-range-input::-moz-range-track {
          background: transparent;
        }
        .dual-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 22px;
          height: 22px;
          margin-top: 0;
          border-radius: 999px;
          background: #ffffff;
          border: 3px solid ${ACCENT};
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        .dual-range-input::-moz-range-thumb {
          pointer-events: auto;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #ffffff;
          border: 3px solid ${ACCENT};
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        .dual-range-input:focus-visible::-webkit-slider-thumb {
          outline: 2px solid ${ACCENT};
          outline-offset: 3px;
        }
        .dual-range-input:focus-visible::-moz-range-thumb {
          outline: 2px solid ${ACCENT};
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: no-preference) {
          .dual-range-input::-webkit-slider-thumb {
            transition: transform 120ms ease;
          }
          .dual-range-input:active::-webkit-slider-thumb {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
