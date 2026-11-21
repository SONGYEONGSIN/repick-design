"use client";

import { CATEGORIES, CATEGORY_IDS, WEIGHT_MAX, WEIGHT_MIN, WEIGHT_PRESETS, type Weights } from "./data";
import { ACCENT_FILL, CATEGORY_COLOR, cx, FOCUS, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

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
        className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2"
        role="group"
        aria-label="Set how much of your kit falls in each category — the ribbon reflows live"
      >
        {CATEGORY_IDS.map((cat) => {
          const meta = CATEGORIES[cat];
          const value = weights[cat];
          return (
            <div key={cat} className="min-w-0">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor={`weight-${cat}`} className={cx("text-[12.5px] font-semibold", INK_TEXT)}>
                  <span
                    aria-hidden="true"
                    className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ backgroundColor: CATEGORY_COLOR[cat] }}
                  />
                  {meta.label}
                </label>
                <span className={cx("text-[12.5px] font-semibold", NUM, INK_TEXT)}>{value}</span>
              </div>
              <input
                id={`weight-${cat}`}
                type="range"
                min={WEIGHT_MIN}
                max={WEIGHT_MAX}
                step={1}
                value={value}
                onChange={(e) => onChange({ ...weights, [cat]: Number(e.target.value) })}
                className={cx("mt-2 h-2 w-full cursor-pointer", FOCUS)}
                style={{ accentColor: ACCENT_FILL }}
                aria-valuetext={`${meta.label} weighted at ${value} out of ${WEIGHT_MAX}`}
              />
              <p className={cx("mt-1 text-[11.5px] leading-[1.4]", MUTED_TEXT)}>{meta.blurb}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className={cx("text-[11px] font-semibold uppercase", MUTED_TEXT)} style={{ letterSpacing: "0.12em" }}>
          Quick presets
        </span>
        {WEIGHT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.weights)}
            aria-pressed={activePreset === preset.id}
            className={cx(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              FOCUS,
              activePreset === preset.id
                ? "border-[#C2410C] bg-[#C2410C] text-white"
                : "border-zinc-300 text-[#111114] hover:border-[#C2410C]",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
