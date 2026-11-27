"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Sparkles } from "lucide-react";
import { CATEGORIES, MIN_SHARE } from "./data";
import { moveBoundary, type AllocationModel, type Boundaries } from "./model";
import {
  ACCENT_SMALL_HEX,
  CAPTION,
  FOCUS_RING,
  INK,
  MUTED_ON_WHITE,
  SEGMENT_COLORS,
  SURFACE_BORDER,
  SURFACE_TINT,
} from "./tokens";

interface AllocatorProps {
  boundaries: Boundaries;
  shares: readonly number[];
  model: AllocationModel;
  onChange: (next: number[]) => void;
}

/**
 * The device: a stacked bar whose internal dividers trade credits between the two categories
 * they sit between. Dragging a divider only ever changes its immediate neighbors — the total
 * stays at exactly 100 by construction, with no rescale pass needed, which is what keeps "one
 * category's gain is literally another's loss" visible and local as you drag.
 */
export function Allocator({ boundaries, shares, model, onChange }: AllocatorProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const startBoundaries = boundaries;

    const handleMove = (moveEvent: PointerEvent) => {
      const pct = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      onChange(moveBoundary(startBoundaries, index, pct));
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
    const step = event.shiftKey ? 10 : 2;
    let rawValue: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") rawValue = boundaries[index] - step;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") rawValue = boundaries[index] + step;
    else if (event.key === "Home") rawValue = index === 0 ? 0 : boundaries[index - 1];
    else if (event.key === "End") rawValue = index === boundaries.length - 1 ? 100 : boundaries[index + 1];
    if (rawValue === null) return;
    event.preventDefault();
    onChange(moveBoundary(boundaries, index, rawValue));
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className={CAPTION} style={{ color: ACCENT_SMALL_HEX }}>
          Weekly spotlight pool · 100 credits
        </p>
        <p className="shrink-0 text-sm font-semibold" style={{ color: INK }}>
          Demand fit{" "}
          <span
            className="font-extrabold"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {model.fitScore}
          </span>
          /100
        </p>
      </div>

      <div
        ref={trackRef}
        className="relative mt-3 h-12 w-full select-none"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute inset-0 flex overflow-hidden rounded-2xl"
          style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE_TINT }}
          aria-hidden="true"
        >
          {CATEGORIES.map((category, i) => (
            <div
              key={category.id}
              className="h-full transition-[width] duration-150 ease-out"
              style={{ width: `${shares[i]}%`, backgroundColor: SEGMENT_COLORS[i] }}
            />
          ))}
        </div>

        {boundaries.map((boundary, i) => {
          const leftCategory = CATEGORIES[i];
          const rightCategory = CATEGORIES[i + 1];
          const min = i === 0 ? MIN_SHARE : boundaries[i - 1] + MIN_SHARE;
          const max = i === boundaries.length - 1 ? 100 - MIN_SHARE : boundaries[i + 1] - MIN_SHARE;
          return (
            <div
              key={`divider-${leftCategory.id}-${rightCategory.id}`}
              role="slider"
              tabIndex={0}
              aria-orientation="horizontal"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={boundary}
              aria-valuetext={`${leftCategory.label} ${shares[i]} percent, ${rightCategory.label} ${shares[i + 1]} percent`}
              aria-label={`Spotlight credit boundary between ${leftCategory.label} and ${rightCategory.label}`}
              onPointerDown={(event) => handlePointerDown(event, i)}
              onKeyDown={(event) => handleKeyDown(event, i)}
              className={`absolute top-1/2 flex h-12 w-6 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full transition-[left] duration-150 ease-out ${FOCUS_RING}`}
              style={{ left: `${boundary}%`, touchAction: "none" }}
            >
              <span
                aria-hidden="true"
                className="h-8 w-1 rounded-full bg-white"
                style={{ boxShadow: "0 0 0 1px rgba(11,11,15,0.3)" }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-4">
        {CATEGORIES.map((category, i) => {
          const Icon = category.Icon;
          const isSpotlighted = i === model.dominantIndex && !model.isTie;
          return (
            <div key={category.id} className="flex min-w-0 items-start gap-2">
              <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: INK }} aria-hidden="true" />
              <div className="min-w-0">
                <p className="flex min-w-0 flex-wrap items-center gap-1 text-[12px] font-semibold" style={{ color: INK }}>
                  {category.shortLabel}
                  {isSpotlighted ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: ACCENT_SMALL_HEX }}>
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Spotlighted
                    </span>
                  ) : null}
                </p>
                <p className={`text-[11px] ${MUTED_ON_WHITE}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {shares[i]}% split · {category.demandShare}% demand
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
