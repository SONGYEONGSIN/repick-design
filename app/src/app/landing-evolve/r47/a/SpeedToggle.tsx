"use client";

import { COLORS, FOCUS_RING } from "./tokens";
import { SPEEDS, type SpeedId } from "./data";

export default function SpeedToggle({
  value,
  onChange,
}: {
  value: SpeedId;
  onChange: (id: SpeedId) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Shipping speed"
      className="inline-flex flex-wrap gap-2 rounded-full border p-1"
      style={{ borderColor: COLORS.line }}
    >
      {SPEEDS.map((speed) => {
        const selected = speed.id === value;
        return (
          <button
            key={speed.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(speed.id)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS_RING}`}
            style={{
              backgroundColor: selected ? COLORS.accent : "transparent",
              color: selected ? "#FFFFFF" : COLORS.fg,
            }}
          >
            {speed.label}
          </button>
        );
      })}
    </div>
  );
}
