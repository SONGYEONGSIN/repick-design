"use client";

import {
  SIGNALS,
  WEIGHT_MAX,
  WEIGHT_MIN,
  WEIGHT_STEP,
  computeShares,
  type SignalId,
  type Weights,
} from "./data";
import { Caption, FOCUS } from "./ui";

const SLIDER_CLASS =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-[#67E8F9] " +
  "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#67E8F9] [&::-webkit-slider-thumb]:shadow-none " +
  "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#67E8F9] " +
  FOCUS;

export function WeightSliders({
  weights,
  onChange,
  onReset,
}: {
  weights: Weights;
  onChange: (id: SignalId, value: number) => void;
  onReset: () => void;
}) {
  const shares = computeShares(weights);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <Caption>How much should each signal count?</Caption>
        <button
          type="button"
          onClick={onReset}
          className={`rounded-sm text-[12px] font-semibold text-[#67E8F9] underline decoration-[#67E8F9]/40 underline-offset-4 hover:decoration-[#67E8F9] ${FOCUS}`}
        >
          Reset to neutral weighting
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {SIGNALS.map((signal) => {
          const inputId = `weight-${signal.id}`;
          const value = weights[signal.id];
          return (
            <div key={signal.id}>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={inputId} className="text-sm font-semibold text-zinc-200">
                  {signal.short}
                </label>
                <span className="text-sm tabular-nums tracking-[0.12em] text-zinc-400">
                  {value.toFixed(1)}×
                  <span className="ml-2 text-zinc-400">· {shares[signal.id]}%</span>
                </span>
              </div>
              <input
                id={inputId}
                type="range"
                min={WEIGHT_MIN}
                max={WEIGHT_MAX}
                step={WEIGHT_STEP}
                value={value}
                onChange={(event) => onChange(signal.id, Number(event.currentTarget.value))}
                aria-valuetext={`${value.toFixed(1)} times weight. Currently ${shares[signal.id]} percent of this item's score.`}
                className={`mt-2 block ${SLIDER_CLASS}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
