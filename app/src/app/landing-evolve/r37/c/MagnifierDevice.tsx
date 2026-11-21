"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Check, Move } from "lucide-react";
import SneakerIllustration from "./SneakerIllustration";
import { HOTSPOTS, TOTAL_HOTSPOTS, confidenceFromFound } from "./hotspots";
import { ACCENT_DEEP, ACCENT_FILL, ACCENT_TINT, CARD_BG, FOCUS } from "./theme";

/** The illustration's own coordinate system — see `SneakerIllustration`. */
const VIEW_W = 640;
const VIEW_H = 400;

/**
 * A hotspot counts as "found" once the lens center lands within this many
 * viewBox units of its fixed coordinate — ≈6.25% of the illustration's
 * width, about half the lens' own drawn radius (12%, see
 * `LENS_RADIUS_FRACTION`), so a marker lights up while it's held well
 * inside the glass rather than only grazed by its far edge. Doing this
 * math in fixed viewBox units (not rendered pixels) keeps it
 * resolution-independent: the container's CSS `aspect-ratio` is locked to
 * this same 640×400 box, so viewBox-unit distance and on-screen distance
 * always agree regardless of how large the box renders.
 */
const FOUND_THRESHOLD_VB = 40;

/** Lens visual radius as a fraction of the container's rendered width. */
const LENS_RADIUS_FRACTION = 0.12;
const ZOOM_SCALE = 1.8;
const STEP_PCT = 4;
const STEP_PCT_FAST = 10;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function MagnifierDevice({
  found,
  onFound,
}: {
  found: ReadonlySet<string>;
  onFound: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [lensPct, setLensPct] = useState({ x: 50, y: 50 });
  const liveRegionId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const moveLensTo = useCallback(
    (xPct: number, yPct: number) => {
      const x = clamp(xPct, 0, 100);
      const y = clamp(yPct, 0, 100);
      setLensPct({ x, y });
      const vx = (x / 100) * VIEW_W;
      const vy = (y / 100) * VIEW_H;
      for (const spot of HOTSPOTS) {
        const hx = (spot.xPct / 100) * VIEW_W;
        const hy = (spot.yPct / 100) * VIEW_H;
        if (Math.hypot(vx - hx, vy - hy) <= FOUND_THRESHOLD_VB) {
          onFound(spot.id);
        }
      }
    },
    [onFound],
  );

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    moveLensTo(((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? STEP_PCT_FAST : STEP_PCT;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "ArrowDown") dy = step;
    else return;
    e.preventDefault();
    moveLensTo(lensPct.x + dx, lensPct.y + dy);
  }

  // Derived, not stored: whichever hotspot the lens currently sits over.
  const vx = (lensPct.x / 100) * VIEW_W;
  const vy = (lensPct.y / 100) * VIEW_H;
  const active = HOTSPOTS.find((spot) => {
    const hx = (spot.xPct / 100) * VIEW_W;
    const hy = (spot.yPct / 100) * VIEW_H;
    return Math.hypot(vx - hx, vy - hy) <= FOUND_THRESHOLD_VB;
  });

  const confidence = confidenceFromFound(found.size);
  const lensRadiusPx = size.width * LENS_RADIUS_FRACTION;
  const lensPxX = (lensPct.x / 100) * size.width;
  const lensPxY = (lensPct.y / 100) * size.height;
  const foundList = HOTSPOTS.filter((h) => found.has(h.id));

  return (
    <div>
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative aspect-[8/5] w-full touch-none overflow-hidden rounded-2xl border border-white/10"
        style={{ backgroundColor: CARD_BG }}
      >
        <SneakerIllustration found={found} />

        {size.width > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `circle(${lensRadiusPx}px at ${lensPxX}px ${lensPxY}px)` }}
          >
            <div
              className="absolute inset-0"
              style={{ transform: `scale(${ZOOM_SCALE})`, transformOrigin: `${lensPxX}px ${lensPxY}px` }}
            >
              <SneakerIllustration found={found} />
            </div>
          </div>
        )}

        {size.width > 0 && (
          <div
            tabIndex={0}
            role="group"
            aria-label={`Magnifier lens, ${active ? `currently over ${active.label}` : "over a blank area"}. Use arrow keys to move it across the sneaker and reveal authenticity markers; hold Shift to move faster.`}
            aria-describedby={liveRegionId}
            onKeyDown={handleKeyDown}
            className={`absolute rounded-full border-2 border-white/70 shadow-[0_0_0_2px_rgba(0,0,0,0.5)] ${FOCUS}`}
            style={{
              width: lensRadiusPx * 2,
              height: lensRadiusPx * 2,
              left: lensPxX,
              top: lensPxY,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      <p id={liveRegionId} aria-live="polite" className="sr-only">
        {active
          ? found.has(active.id)
            ? `${active.label}, already verified: ${active.detail}`
            : `${active.label} found: ${active.detail}`
          : `${found.size} of ${TOTAL_HOTSPOTS} authenticity markers found.`}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
        <Move className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
        Drag the lens, or jump to a marker below
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {HOTSPOTS.map((spot) => {
          const isFound = found.has(spot.id);
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => moveLensTo(spot.xPct, spot.yPct)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${FOCUS} ${
                isFound ? "border-transparent text-white" : "border-white/15 text-zinc-300 hover:border-white/30"
              }`}
              style={isFound ? { backgroundColor: ACCENT_FILL } : undefined}
            >
              {isFound && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              {spot.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <p className="text-sm font-semibold text-zinc-300">
          <span className="font-extrabold tabular-nums text-white">{found.size}</span>
          <span className="tabular-nums"> / {TOTAL_HOTSPOTS}</span> authenticity markers found
        </p>
        <div
          role="progressbar"
          aria-valuenow={confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Confidence score"
          className="h-2.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: ACCENT_DEEP + "4D" }}
        >
          <div
            className="h-full w-full origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${confidence / 100})`, backgroundColor: ACCENT_FILL }}
          />
        </div>
      </div>
      <p className="mt-1.5 text-right text-sm font-semibold tabular-nums text-zinc-400 sm:hidden">
        {confidence}% confidence
      </p>

      {foundList.length > 0 && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {foundList.map((spot) => (
            <li
              key={spot.id}
              className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm leading-[1.5] text-zinc-300"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              <span>{spot.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
