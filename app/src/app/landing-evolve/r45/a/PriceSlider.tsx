"use client";

import { MIN_PRICE, MAX_PRICE, PRICE_STEP, formatUsd } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export function PriceSlider({
  price,
  onChange,
  id = "list-price-slider",
}: {
  price: number;
  onChange: (next: number) => void;
  id?: string;
}) {
  const pct = ((price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold tracking-[0.02em] text-[#F5F5F7]">
          List it at
        </label>
        <output
          htmlFor={id}
          aria-live="polite"
          className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-[#F5F5F7] sm:text-4xl`}
        >
          {formatUsd(price)}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={PRICE_STEP}
        value={price}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={`${id}-hint`}
        aria-valuetext={`${formatUsd(price)} listed price`}
        className={`mt-4 h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-white/10 ${FOCUS_RING} [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.5)] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-thumb]:bg-sky-400`}
        style={{
          background: `linear-gradient(to right, #38bdf8 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
        }}
      />

      <p id={`${id}-hint`} className={`mt-2 flex justify-between text-xs font-normal tabular-nums tracking-[0.04em] ${MUTED_TEXT}`}>
        <span>{formatUsd(MIN_PRICE)}</span>
        <span>{formatUsd(MAX_PRICE)}</span>
      </p>
    </div>
  );
}
