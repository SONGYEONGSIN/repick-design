"use client";

import { STAGES, FOCUS, type Stage } from "./data";

// Input's own box is 24px tall (h-6) so the control clears the 24x24 minimum target size
// even though the visible track is a slim 6px pill — the thumb is centered inside that box
// with a negative margin-top, the same formula (trackHeight - thumbHeight) / 2 used by the
// catalog's other range sliders (e.g. /v24's SliderRow).
const RANGE_CLASSES =
  "h-6 w-full cursor-pointer appearance-none rounded-full bg-white/10 " +
  "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10 " +
  "[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D9BE84] " +
  "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#D9BE84] " +
  "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/10 " +
  FOCUS;

export default function StageScrubber({
  stageIndex,
  onChange,
}: {
  stageIndex: number;
  onChange: (index: number) => void;
}) {
  const stage: Stage = STAGES[stageIndex];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span id="stage-scrubber-label" className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400">
          GRADING PIPELINE — STAGE <span className="tabular-nums">{stage.index + 1}</span> OF{" "}
          <span className="tabular-nums">{STAGES.length}</span>
        </span>
        <span className="text-[11px] font-normal tabular-nums text-zinc-400">{stage.timestamp}</span>
      </div>
      <input
        type="range"
        min={0}
        max={STAGES.length - 1}
        step={1}
        value={stageIndex}
        aria-labelledby="stage-scrubber-label"
        aria-valuetext={stage.fullLabel}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-3 ${RANGE_CLASSES}`}
      />
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {STAGES.map((s) => {
          const isActive = s.index === stageIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.index)}
              aria-current={isActive ? "step" : undefined}
              className={`rounded-lg border px-1.5 py-2 text-left transition-colors ${FOCUS} ${
                isActive
                  ? "border-[#7A5F28] bg-[#7A5F28]/20"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <span
                className={`block text-[10px] font-semibold tabular-nums ${
                  isActive ? "text-[#D9BE84]" : "text-zinc-400"
                }`}
              >
                {String(s.index + 1).padStart(2, "0")}
              </span>
              <span
                className={`mt-0.5 block text-[10.5px] font-semibold leading-tight ${
                  isActive ? "text-white" : "text-zinc-400"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
