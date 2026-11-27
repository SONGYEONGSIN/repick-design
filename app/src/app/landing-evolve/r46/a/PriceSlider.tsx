"use client";

import { formatUsd, PRICE_MAX, PRICE_MIN, PRICE_STEP } from "./data";
import { ACCENT_TINT_HEX, MUTED_TEXT } from "./tokens";

interface PriceSliderProps {
  price: number;
  onChange: (price: number) => void;
  labelId: string;
  describedById: string;
}

/**
 * A plain range input, not a dual-handle band and not a tied-in spec grid — it drives one
 * number (what you originally paid) that feeds the credit calculation. Focus-visible is
 * verified to actually paint: no `outline-none` is applied anywhere on this element, so the
 * paired focus-visible outline below is never at risk of being cancelled by it.
 */
export function PriceSlider({ price, onChange, labelId, describedById }: PriceSliderProps) {
  const pct = ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${MUTED_TEXT}`}>
          What you originally paid
        </span>
        <span className="text-base font-semibold tabular-nums text-[#F5F5F7]">{formatUsd(price)}</span>
      </div>
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={price}
        aria-labelledby={labelId}
        aria-describedby={describedById}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-6 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 focus-visible:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/15 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/15 [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:bg-sky-500 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-thumb]:bg-sky-500"
        style={{
          background: `linear-gradient(to right, ${ACCENT_TINT_HEX} 0%, ${ACCENT_TINT_HEX} ${pct}%, transparent ${pct}%, transparent 100%)`,
        }}
      />
      <div className={`flex justify-between text-[11px] font-normal tabular-nums ${MUTED_TEXT}`}>
        <span>{formatUsd(PRICE_MIN)}</span>
        <span>{formatUsd(PRICE_MAX)}</span>
      </div>
    </div>
  );
}
