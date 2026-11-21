"use client";

import { SLIDER_MIN, SLIDER_MAX, SLIDER_STEP, PRESETS } from "./data";

export function PriceSlider({
  price,
  onChange,
  id = "budget-slider",
}: {
  price: number;
  onChange: (next: number) => void;
  id?: string;
}) {
  const pct = Math.round(((price - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 10000) / 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold tracking-[0.12em] text-zinc-300">
          WHAT YOU&apos;D PAY
        </label>
        <output
          htmlFor={id}
          aria-live="polite"
          className="font-[family-name:var(--font-display-mono)] text-3xl font-semibold tabular-nums text-white"
        >
          ${price}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={price}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${price} dollars`}
        className="mt-3 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:bg-amber-500 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-thumb]:bg-amber-500"
        style={{
          background: `linear-gradient(to right, #F59E0B ${pct}%, #27272a ${pct}%)`,
        }}
      />

      <div className="mt-2 flex justify-between text-xs tracking-[0.08em] text-zinc-400">
        <span>${SLIDER_MIN}</span>
        <span>${SLIDER_MAX}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick budget presets">
        {PRESETS.map((p) => {
          const active = p === price;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                active
                  ? "border-amber-500 bg-amber-500 text-[#0B0B0F]"
                  : "border-zinc-700 bg-transparent text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
            >
              ${p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
