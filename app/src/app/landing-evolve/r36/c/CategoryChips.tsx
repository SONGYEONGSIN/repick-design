"use client";

import { useRef, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { CATEGORY_ORDER, CATEGORIES, type CategoryId } from "./categories";
import { FOCUS } from "./theme";

interface CategoryChipsProps {
  selected: CategoryId[];
  onToggle: (id: CategoryId) => void;
}

/**
 * The route's input device — a multi-select chip cloud. Toggling a chip
 * adds or removes that category from the bubble cluster below, live, with
 * no submit step. The last remaining selected chip cannot be turned off
 * (there is always at least one category on stage, so the headline,
 * cluster and closing CTA always have a real "fastest" category to bind
 * to) — trying anyway is a silent no-op, same affordance either way.
 *
 * Each `<button>` keeps its own place in the normal tab order (nothing is
 * pulled out with `tabIndex={-1}`), so Tab alone reaches every chip. Left
 * and right arrow keys additionally move focus between chips without
 * changing selection, for visitors who expect roving arrow-key navigation
 * in a same-row control group — a pure convenience on top of, not a
 * replacement for, the plain tab order.
 */
export default function CategoryChips({ selected, onToggle }: CategoryChipsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + CATEGORY_ORDER.length) % CATEGORY_ORDER.length;
    refs.current[next]?.focus();
  }

  return (
    <div
      role="group"
      aria-label="Categories you sell — pick one or more"
      className="flex flex-wrap gap-2.5"
    >
      {CATEGORY_ORDER.map((id, index) => {
        const isOn = selected.includes(id);
        const isOnlyOne = isOn && selected.length === 1;
        return (
          <button
            key={id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            aria-pressed={isOn}
            disabled={isOnlyOne}
            onClick={() => onToggle(id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${FOCUS} ${
              isOn
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-950 hover:text-zinc-950"
            } ${isOnlyOne ? "cursor-not-allowed" : ""}`}
          >
            {isOn ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
            {CATEGORIES[id].label}
          </button>
        );
      })}
    </div>
  );
}
