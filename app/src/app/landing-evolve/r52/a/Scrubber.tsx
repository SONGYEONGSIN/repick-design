"use client";

import { useId, type CSSProperties } from "react";
import { ACCENT_HEX, STAT_LABEL } from "./tokens";

type ScrubberProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  label: string;
  readout: string;
  describedBy?: string;
};

/**
 * The page's single continuous input: one native range control (drag, click-to-jump, and arrow
 * keys all move the same one axis). Styled with a scoped <style> block instead of arbitrary
 * Tailwind pseudo-elements, since `::-webkit-slider-thumb` / `::-moz-range-thumb` need real CSS.
 */
export function Scrubber({
  value,
  min,
  max,
  step,
  onChange,
  label,
  readout,
  describedBy,
}: ScrubberProps) {
  const inputId = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const ticks = [min, Math.round((min + max) / 4), Math.round((min + max) / 2), Math.round(((min + max) * 3) / 4), max];

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={inputId} className={`${STAT_LABEL} text-[#A1A1AA]`}>
          {label}
        </label>
        <span
          className="font-sans text-[13px] font-semibold tabular-nums tracking-[0.04em]"
          style={{ color: ACCENT_HEX }}
          aria-hidden="true"
        >
          {readout}
        </span>
      </div>

      <div className="scrubber-track relative">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          aria-valuetext={readout}
          aria-describedby={describedBy}
          className="scrubber-input"
          style={{ "--scrubber-pct": `${pct}%` } as CSSProperties}
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] font-normal tracking-[0.02em] text-[#A1A1AA]">
        {ticks.map((tick, index) => (
          <span key={`${tick}-${index}`}>{`Day ${tick}`}</span>
        ))}
      </div>

      <style>{`
        .scrubber-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            #F59E0B 0%,
            #F59E0B var(--scrubber-pct),
            #27272F var(--scrubber-pct),
            #27272F 100%
          );
          outline-offset: 6px;
        }
        .scrubber-input:focus-visible {
          outline: 2px solid #F59E0B;
          outline-offset: 6px;
        }
        .scrubber-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #ffffff;
          border: 3px solid #F59E0B;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .scrubber-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #ffffff;
          border: 3px solid #F59E0B;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .scrubber-input::-moz-range-track {
          background: transparent;
        }
        @media (prefers-reduced-motion: no-preference) {
          .scrubber-input::-webkit-slider-thumb {
            transition: transform 150ms ease;
          }
          .scrubber-input:active::-webkit-slider-thumb {
            transform: scale(1.08);
          }
        }
      `}</style>
    </div>
  );
}
