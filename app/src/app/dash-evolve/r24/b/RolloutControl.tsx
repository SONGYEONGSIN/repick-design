"use client";

const PRESETS = [0, 10, 25, 50, 100];

export default function RolloutControl({
  pct,
  onChange,
  disabled,
}: {
  pct: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  function clamp(v: number) {
    return Math.min(100, Math.max(0, Math.round(v)));
  }

  return (
    <div className={disabled ? "opacity-50" : ""}>
      <style>{`
        #rollout-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #38bdf8;
          border: 2px solid #082f49;
          cursor: pointer;
          margin-top: 0;
        }
        #rollout-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #38bdf8;
          border: 2px solid #082f49;
          cursor: pointer;
        }
        #rollout-slider::-moz-range-track {
          background: transparent;
        }
        #rollout-slider:disabled::-webkit-slider-thumb,
        #rollout-slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
        }
      `}</style>
      <div className="flex items-center gap-3">
        <label htmlFor="rollout-slider" className="sr-only">
          Rollout percentage
        </label>
        <input
          id="rollout-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={pct}
          disabled={disabled}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #38bdf8 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          }}
        />
        <div className="flex shrink-0 items-center gap-1">
          <label htmlFor="rollout-number" className="sr-only">
            Rollout percentage, numeric
          </label>
          <input
            id="rollout-number"
            type="number"
            min={0}
            max={100}
            step={1}
            value={pct}
            disabled={disabled}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            className="h-9 w-16 rounded-md border border-white/10 bg-zinc-950 px-2 text-right text-sm tabular-nums text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed"
          />
          <span className="text-sm text-zinc-400">%</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Rollout percentage presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p)}
            aria-pressed={pct === p}
            className={`rounded-md border px-2 py-1 text-[11px] font-medium tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed ${
              pct === p ? "border-sky-400/40 bg-sky-400/10 text-sky-300" : "border-white/10 text-zinc-400 hover:bg-white/[0.06]"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>
    </div>
  );
}
