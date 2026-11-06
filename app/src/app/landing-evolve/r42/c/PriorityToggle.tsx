"use client";

import type { KeyboardEvent } from "react";
import { MODE_LABEL, MODE_ORDER, type PriorityMode } from "./data";
import { ACCENT, FOCUS_RING } from "./tokens";

const DESCRIPTION: Record<PriorityMode, string> = {
  price: "80% price, 20% condition",
  condition: "20% price, 80% condition",
  balanced: "50% price, 50% condition",
};

/**
 * Native radiogroup pattern: role="radiogroup" + role="radio" + aria-checked,
 * roving tabindex, and arrow-key movement — the keyboard behavior a real
 * <input type="radio"> group gets for free, wired up by hand since this is
 * a styled button group rather than native inputs.
 */
export default function PriorityToggle({
  mode,
  onChange,
  id,
}: {
  mode: PriorityMode;
  onChange: (m: PriorityMode) => void;
  id?: string;
}) {
  function move(from: number, dir: 1 | -1) {
    const next = (from + dir + MODE_ORDER.length) % MODE_ORDER.length;
    const nextMode = MODE_ORDER[next];
    onChange(nextMode);
    const el = document.getElementById(`${id ?? "priority"}-${nextMode}`);
    el?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(index, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(index, -1);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Bracket priority"
      className="inline-flex flex-wrap gap-2"
    >
      {MODE_ORDER.map((m, i) => {
        const active = m === mode;
        return (
          <button
            key={m}
            id={`${id ?? "priority"}-${m}`}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(m)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`rounded-xl border px-4 py-2.5 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "border-transparent" : "border-zinc-300 hover:border-zinc-400"
            }`}
            style={active ? { backgroundColor: ACCENT } : undefined}
          >
            <span
              className={`block text-sm font-semibold ${active ? "text-white" : "text-zinc-900"}`}
            >
              {MODE_LABEL[m]}
            </span>
            <span
              className={`block text-[11px] font-normal tabular-nums ${
                active ? "text-white" : "text-zinc-600"
              }`}
            >
              {DESCRIPTION[m]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
