"use client";

import type { CSSProperties } from "react";
import type { FactorKey } from "./gauge-math";

export function WeightSlider({
  id,
  label,
  hint,
  value,
  rawScore,
  contribution,
  accent,
  onChange,
}: {
  id: FactorKey;
  label: string;
  hint: string;
  value: number;
  rawScore: number;
  contribution: number;
  accent: string;
  onChange: (next: number) => void;
}) {
  const barMax = 40; // realistic ceiling for a single factor's point-contribution to a 4-factor composite
  const barPct = Math.min(100, (contribution / barMax) * 100);

  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3">
      <label htmlFor={`weight-${id}`} className="text-[13px] font-semibold text-white">
        {label}
      </label>
      <span className="tabular-nums text-[13px] font-semibold" style={{ color: accent }}>
        {value}
      </span>

      <input
        id={`weight-${id}`}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={`weight-${id}-hint`}
        className="col-span-2 mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#27272E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[var(--thumb-color)] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--thumb-color)]"
        style={{
          background: `linear-gradient(to right, ${accent} ${value}%, #27272E ${value}%)`,
          "--thumb-color": accent,
          outlineColor: accent,
        } as CSSProperties}
      />

      <p id={`weight-${id}-hint`} className="col-span-2 mt-1 text-[11px] leading-snug text-[#A1A1AA]">
        {hint}
      </p>

      <div className="col-span-2 mt-1.5 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#1C1C22]" role="presentation">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${barPct}%`, backgroundColor: accent }}
          />
        </div>
        <span className="w-[92px] shrink-0 text-right text-[11px] tabular-nums text-[#A1A1AA]">
          +{contribution.toFixed(1)} pts · raw {rawScore}
        </span>
      </div>
    </div>
  );
}
