"use client";

import { useRef } from "react";
import {
  ITEMS,
  MIN_PRICE,
  MAX_PRICE,
  MIN_GAP,
  filterByRange,
  medianPrice,
  formatPrice,
  buildHistogram,
  clampNum,
} from "./data";
import ProductCard from "./ProductCard";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]";

const BIN_COUNT = 14;
const TRACK_HEIGHT = 88;
const STEP = 10;
const PAGE_STEP = 50;

function pctFromPrice(price: number): number {
  return ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
}
function priceFromPct(pct: number): number {
  return MIN_PRICE + (pct / 100) * (MAX_PRICE - MIN_PRICE);
}
function roundToStep(v: number, step = 5): number {
  return Math.round(v / step) * step;
}

export default function RangeSweep({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  const bins = buildHistogram(BIN_COUNT);
  const maxCount = Math.max(...bins.map((b) => b.count), 1);
  const filtered = filterByRange(min, max);
  const med = medianPrice(filtered);
  const visible = filtered.slice(0, 6);
  const overflow = filtered.length - visible.length;

  function priceFromClientX(clientX: number): number {
    const el = trackRef.current;
    if (!el) return min;
    const r = el.getBoundingClientRect();
    const pct = clampNum(((clientX - r.left) / r.width) * 100, 0, 100);
    return roundToStep(priceFromPct(pct));
  }

  function moveHandle(which: "min" | "max", price: number) {
    if (which === "min") {
      onChange(clampNum(price, MIN_PRICE, max - MIN_GAP), max);
    } else {
      onChange(min, clampNum(price, min + MIN_GAP, MAX_PRICE));
    }
  }

  function endDrag() {
    draggingRef.current = null;
  }
  function handlePointerDownMin(e: React.PointerEvent<HTMLButtonElement>) {
    draggingRef.current = "min";
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function handlePointerDownMax(e: React.PointerEvent<HTMLButtonElement>) {
    draggingRef.current = "max";
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function handlePointerMoveMin(e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingRef.current !== "min") return;
    moveHandle("min", priceFromClientX(e.clientX));
  }
  function handlePointerMoveMax(e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingRef.current !== "max") return;
    moveHandle("max", priceFromClientX(e.clientX));
  }

  function stepFor(which: "min" | "max", current: number, key: string): number | null {
    switch (key) {
      case "ArrowLeft":
      case "ArrowDown":
        return current - STEP;
      case "ArrowRight":
      case "ArrowUp":
        return current + STEP;
      case "PageDown":
        return current - PAGE_STEP;
      case "PageUp":
        return current + PAGE_STEP;
      case "Home":
        return which === "min" ? MIN_PRICE : min + MIN_GAP;
      case "End":
        return which === "max" ? MAX_PRICE : max - MIN_GAP;
      default:
        return null;
    }
  }
  function handleKeyDownMin(e: React.KeyboardEvent<HTMLButtonElement>) {
    const next = stepFor("min", min, e.key);
    if (next === null) return;
    e.preventDefault();
    moveHandle("min", next);
  }
  function handleKeyDownMax(e: React.KeyboardEvent<HTMLButtonElement>) {
    const next = stepFor("max", max, e.key);
    if (next === null) return;
    e.preventDefault();
    moveHandle("max", next);
  }

  return (
    <div>
      <div
        aria-live="polite"
        className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
      >
        <span className="font-[family-name:var(--font-display-mono)] text-3xl font-extrabold tabular-nums text-white sm:text-4xl">
          {formatPrice(min)}
          <span className="px-2 text-zinc-400">–</span>
          {formatPrice(max)}
        </span>
        <p className="text-sm font-normal text-zinc-400">
          <span className="font-semibold tabular-nums text-white">{filtered.length}</span> of {ITEMS.length} listings inside this window
          {filtered.length > 0 && (
            <>
              {" "}
              · median <span className="font-semibold tabular-nums text-white">{formatPrice(med)}</span>
            </>
          )}
        </p>
      </div>

      <p className="sr-only font-normal">
        Price distribution across {ITEMS.length} listings, ranging from {formatPrice(MIN_PRICE)} to {formatPrice(MAX_PRICE)}.
        Use the arrow keys on either handle to move it by {STEP} dollars at a time.
      </p>

      <div className="relative select-none pb-4 pt-2">
        <div
          ref={trackRef}
          className="relative w-full rounded-lg bg-white/[0.03]"
          style={{ height: TRACK_HEIGHT }}
        >
          {/* active window band */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 border-x border-emerald-500/50 bg-emerald-500/10"
            style={{
              left: `${pctFromPrice(min)}%`,
              width: `${pctFromPrice(max) - pctFromPrice(min)}%`,
            }}
          />

          {/* histogram */}
          <div className="absolute inset-0 flex items-end gap-[3px] px-[2px]" aria-hidden="true">
            {bins.map((b) => {
              const h = Math.max(4, Math.round((b.count / maxCount) * (TRACK_HEIGHT - 8)));
              const inRange = b.binMax >= min && b.binMin <= max;
              return (
                <div
                  key={`${b.binMin}-${b.binMax}`}
                  title={`${b.count} listing${b.count === 1 ? "" : "s"}, ${formatPrice(Math.round(b.binMin))}–${formatPrice(Math.round(b.binMax))}`}
                  className={`flex-1 rounded-[2px] transition-colors duration-150 ${inRange ? "bg-emerald-500/70" : "bg-white/15"}`}
                  style={{ height: h }}
                />
              );
            })}
          </div>

          {/* min handle */}
          <button
            type="button"
            role="slider"
            aria-orientation="horizontal"
            aria-label="Minimum price"
            aria-valuemin={MIN_PRICE}
            aria-valuemax={max - MIN_GAP}
            aria-valuenow={min}
            aria-valuetext={formatPrice(min)}
            onPointerDown={handlePointerDownMin}
            onPointerMove={handlePointerMoveMin}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDownMin}
            style={{ left: `${pctFromPrice(min)}%` }}
            className={`absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-[#0B0B0F] bg-emerald-400 shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${FOCUS}`}
          />

          {/* max handle */}
          <button
            type="button"
            role="slider"
            aria-orientation="horizontal"
            aria-label="Maximum price"
            aria-valuemin={min + MIN_GAP}
            aria-valuemax={MAX_PRICE}
            aria-valuenow={max}
            aria-valuetext={formatPrice(max)}
            onPointerDown={handlePointerDownMax}
            onPointerMove={handlePointerMoveMax}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDownMax}
            style={{ left: `${pctFromPrice(max)}%` }}
            className={`absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-[#0B0B0F] bg-emerald-400 shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${FOCUS}`}
          />
        </div>

        <div className="mt-2 flex justify-between text-[0.72rem] font-normal tabular-nums tracking-[0.12em] text-zinc-400">
          <span>{formatPrice(MIN_PRICE)}</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visible.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm font-normal text-zinc-400">
          Nothing lands in that window yet — widen it to see listings reappear.
        </p>
      ) : overflow > 0 ? (
        <p className="mt-6 text-sm font-normal text-zinc-400">
          +{overflow} more listing{overflow === 1 ? "" : "s"} inside this window, not shown above.
        </p>
      ) : null}
    </div>
  );
}
