"use client";

import { TONE_OPTIONS, type Tone } from "./data";

export function ToneToggle({
  value,
  onChange,
}: {
  value: Tone;
  onChange: (tone: Tone) => void;
}) {
  return (
    <div>
      <span id="tone-toggle-label" className="block text-[13px] font-semibold text-zinc-700">
        Tone
      </span>
      <div
        role="group"
        aria-labelledby="tone-toggle-label"
        className="mt-1.5 inline-flex flex-wrap gap-1 rounded-xl bg-zinc-100 p-1"
      >
        {TONE_OPTIONS.map((opt) => {
          const isActive = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isActive}
              title={opt.hint}
              onClick={() => onChange(opt.id)}
              className={
                "rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] " +
                (isActive
                  ? "bg-[#0f766e] text-white"
                  : "text-zinc-700 hover:text-zinc-900")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
