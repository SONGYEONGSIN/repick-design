"use client";

import { RotateCcw } from "lucide-react";
import { ACCENT, DEFAULT_WEIGHTS, FOCUS_RING, WEIGHT_FIELDS, type Weights } from "./data";

export default function WeightSliders({
  weights,
  onChange,
  onReset,
}: {
  weights: Weights;
  onChange: (key: keyof Weights, value: number) => void;
  onReset: () => void;
}) {
  const atDefault = WEIGHT_FIELDS.every((f) => weights[f.key] === DEFAULT_WEIGHTS[f.key]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2" role="group" aria-labelledby="weights-heading">
        {WEIGHT_FIELDS.map((field) => {
          const value = weights[field.key];
          return (
            <div key={field.key} className="min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={`weight-${field.key}`} className="text-sm font-semibold text-zinc-950">
                  {field.label}
                </label>
                <span className="text-sm font-semibold tabular-nums text-zinc-950">{value}</span>
              </div>
              <input
                id={`weight-${field.key}`}
                type="range"
                min={0}
                max={100}
                step={5}
                value={value}
                onChange={(e) => onChange(field.key, Number(e.target.value))}
                className={`mt-2 h-2 w-full cursor-pointer ${FOCUS_RING}`}
                style={{ accentColor: ACCENT }}
                aria-valuetext={`${field.label} weighted at ${value} out of 100`}
              />
              <p className="mt-1 text-xs font-normal leading-[1.5] text-zinc-600">{field.hint}</p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={atDefault}
        className={`mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset to defaults
      </button>
    </div>
  );
}
