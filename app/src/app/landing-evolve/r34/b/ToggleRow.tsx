"use client";

import { Check } from "lucide-react";
import { COLOR } from "./data";
import { TOGGLES, type ToggleId, type ToggleState } from "./savings-math";

interface ToggleRowProps {
  toggles: ToggleState;
  onToggle: (id: ToggleId) => void;
}

/**
 * Four to five independent switches, each a qualifying condition a buyer can meet. A real
 * role="switch" button with aria-checked and a visible label — not a colored div with an
 * onClick — so the state is announced correctly to assistive tech, and every switch is reachable
 * and operable by keyboard alone.
 */
export default function ToggleRow({ toggles, onToggle }: ToggleRowProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: COLOR.muted }}>
        {"Qualifying conditions — switch on what applies to you"}
      </legend>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        {TOGGLES.map((toggle) => {
          const checked = toggles[toggle.id];
          return (
            <div
              key={toggle.id}
              className="flex min-w-0 items-center justify-between gap-4 rounded-xl border p-3.5 transition-colors"
              style={{
                borderColor: checked ? COLOR.accent : COLOR.border,
                backgroundColor: checked ? COLOR.accentSoft : "#FFFFFF",
              }}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{toggle.label}</p>
                <p className="mt-0.5 truncate text-xs" style={{ color: COLOR.muted }}>
                  {toggle.caption} Saves ${toggle.amount}.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={`${toggle.label} — saves $${toggle.amount} when switched on`}
                onClick={() => onToggle(toggle.id)}
                className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: checked ? COLOR.accentDark : "#D4D4D8",
                  outlineColor: COLOR.accentDark,
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform duration-200 motion-reduce:transition-none"
                  style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
                >
                  {checked && <Check className="h-3.5 w-3.5" style={{ color: COLOR.accentDark }} />}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
