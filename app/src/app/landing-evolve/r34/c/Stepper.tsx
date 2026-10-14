"use client";

import { Minus, Plus } from "lucide-react";
import { FOCUS } from "./theme";
import { MAX_COUNT, MIN_COUNT } from "./payout-math";

interface StepperProps {
  label: string;
  /** Singular noun used in the button aria-labels, e.g. "Electronics item". */
  noun: string;
  caption: string;
  value: number;
  onChange: (next: number) => void;
}

/**
 * One counter: a visible count, and a correctly-labelled −/+ pair. The
 * count itself carries `aria-live="polite"` so a screen-reader user hears
 * it change without needing to re-focus anything, and the live region's
 * content is a full sentence ("3 Electronics items planned"), not a bare
 * digit, so the announcement makes sense on its own.
 */
export default function Stepper({ label, noun, caption, value, onChange }: StepperProps) {
  const atMin = value <= MIN_COUNT;
  const atMax = value >= MAX_COUNT;
  const plural = value === 1 ? noun : `${noun}s`;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="mt-0.5 text-xs leading-[1.5] text-zinc-400">{caption}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          aria-label={`Decrease ${noun} count`}
          onClick={() => onChange(Math.max(MIN_COUNT, value - 1))}
          disabled={atMin}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors enabled:hover:border-sky-400/70 enabled:hover:bg-sky-400/10 disabled:cursor-not-allowed disabled:opacity-35 ${FOCUS}`}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="w-9 text-center" aria-live="polite">
          <span className="sr-only">
            {value} {plural} planned
          </span>
          <span aria-hidden="true" className="block text-xl font-bold tabular-nums text-white">
            {value}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Increase ${noun} count`}
          onClick={() => onChange(Math.min(MAX_COUNT, value + 1))}
          disabled={atMax}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors enabled:hover:border-sky-400/70 enabled:hover:bg-sky-400/10 disabled:cursor-not-allowed disabled:opacity-35 ${FOCUS}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
