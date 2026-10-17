"use client";

import {
  ARCS,
  CATEGORIES,
  DIAGRAM_SIZE,
  NODE_POSITIONS,
  type CategoryId,
  categoryInfo,
  getTopCompanion,
} from "./data";

interface CategoryDeviceProps {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
}

const NODE_BTN = 48; // px, comfortably clears the 24px target-size floor

export default function CategoryDevice({ selected, onSelect }: CategoryDeviceProps) {
  const selectedInfo = categoryInfo(selected);
  const { companion, n } = getTopCompanion(selected);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      {/* Diagram + chooser nodes */}
      <div className="relative mx-auto aspect-square w-full max-w-[360px] min-w-0">
        <svg
          viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {ARCS.map((arc) => {
            const isActive = arc.a === selected || arc.b === selected;
            const strokeWidth = 1 + arc.weight * 0.85;
            const opacity = isActive ? 0.35 + (arc.weight / 7) * 0.55 : 0.16;
            const stroke = isActive ? "#f43f5e" : "#d4d4d8";
            return (
              <path
                key={`${arc.a}-${arc.b}`}
                d={arc.d}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={opacity}
                style={{
                  transition: "stroke-width 300ms ease, opacity 300ms ease, stroke 300ms ease",
                }}
              />
            );
          })}
        </svg>

        <div
          role="group"
          aria-label="Choose a product category"
          className="absolute inset-0"
        >
          {CATEGORIES.map((cat) => {
            const pos = NODE_POSITIONS[cat.id];
            const isSelected = cat.id === selected;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(cat.id)}
                className={[
                  "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5",
                  "focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2 rounded-xl",
                ].join(" ")}
                style={{
                  left: `${(pos.x / DIAGRAM_SIZE) * 100}%`,
                  top: `${(pos.y / DIAGRAM_SIZE) * 100}%`,
                }}
              >
                <span
                  className={[
                    "flex items-center justify-center rounded-full border-2 transition-colors duration-200",
                    isSelected
                      ? "border-rose-600 bg-rose-600"
                      : "border-zinc-300 bg-white hover:border-zinc-400",
                  ].join(" ")}
                  style={{ width: NODE_BTN, height: NODE_BTN }}
                >
                  <Icon
                    className={isSelected ? "h-5 w-5 text-white" : "h-5 w-5 text-zinc-600"}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={[
                    "whitespace-nowrap text-[11px] font-semibold",
                    isSelected ? "text-rose-700" : "text-zinc-600",
                  ].join(" ")}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live stat panel */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-700">
          Companion purchases
        </p>
        <p
          aria-live="polite"
          className="mt-3 text-xl leading-snug text-zinc-900 sm:text-2xl"
        >
          Of every{" "}
          <span className="font-extrabold tabular-nums">10</span>{" "}
          <span className="font-extrabold">{selectedInfo.label}</span> buyers,{" "}
          <span className="font-extrabold tabular-nums text-rose-700">{n}</span> also
          bought <span className="font-extrabold">{companion.label}</span> within 30
          days.
        </p>
        <p className="mt-4 max-w-[26rem] text-sm leading-relaxed text-zinc-500">
          Arc thickness and color show how often two categories are bought together.
          Pick a category to isolate its companion lines.
        </p>
      </div>
    </div>
  );
}
