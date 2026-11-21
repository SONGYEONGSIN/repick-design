"use client";

import { AXES, PRESETS, WEIGHT_MAX, WEIGHT_MIN, type Weights } from "./data";
import { ACCENT_HEX, cx, FOCUS, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

export default function WeightPanel({
  weights,
  onChange,
  activePreset,
}: {
  weights: Weights;
  onChange: (w: Weights) => void;
  activePreset: string | null;
}) {
  return (
    <div>
      <div
        className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
        role="group"
        aria-label="Set what matters most — every slider reweights all six listings live"
      >
        {AXES.map(({ key, label }) => {
          const value = weights[key];
          return (
            <div key={key} className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`weight-${key}`} className={cx("text-[12px] font-semibold", MUTED_TEXT)}>
                  {label}
                </label>
                <span className={cx("text-[12px] font-semibold", NUM, INK_TEXT)}>{value}</span>
              </div>
              <input
                id={`weight-${key}`}
                type="range"
                min={WEIGHT_MIN}
                max={WEIGHT_MAX}
                step={1}
                value={value}
                onChange={(e) => onChange({ ...weights, [key]: Number(e.target.value) })}
                className={cx("mt-2 h-2 w-full cursor-pointer", FOCUS)}
                style={{ accentColor: ACCENT_HEX }}
                aria-valuetext={`${label} set to ${value} out of ${WEIGHT_MAX}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className={cx("text-[11px] font-semibold uppercase", MUTED_TEXT)} style={{ letterSpacing: "0.12em" }}>
          Quick presets
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.weights)}
            aria-pressed={activePreset === preset.id}
            className={cx(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              FOCUS,
              activePreset === preset.id
                ? "border-[#0E7490] bg-[#0E7490] text-white"
                : "border-zinc-300 text-[#111114] hover:border-[#0E7490]",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
