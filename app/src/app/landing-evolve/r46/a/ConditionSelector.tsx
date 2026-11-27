"use client";

import { useRef, type KeyboardEvent } from "react";
import { CONDITIONS } from "./data";
import { ACCENT_FILL, FOCUS_RING, MUTED_TEXT, ON_ACCENT_TEXT } from "./tokens";

interface ConditionSelectorProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  labelId: string;
}

/**
 * Flat horizontal segmented control — a plain single-row radiogroup, not a vertical rung
 * ladder and not a tab/accordion. One tier is "on" at a time; arrow keys move the roving
 * tabindex and selection together.
 */
export function ConditionSelector({ selectedIndex, onSelect, labelId }: ConditionSelectorProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focus(index: number) {
    refs.current[index]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(CONDITIONS.length - 1, index + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CONDITIONS.length - 1;
    else return;
    e.preventDefault();
    onSelect(next);
    focus(next);
  }

  return (
    <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2">
      {CONDITIONS.map((tier, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={tier.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${FOCUS_RING} ${
              isSelected
                ? `${ACCENT_FILL} ${ON_ACCENT_TEXT}`
                : `border border-white/15 ${MUTED_TEXT} hover:border-white/30 hover:text-[#F5F5F7]`
            }`}
          >
            {tier.label}
          </button>
        );
      })}
    </div>
  );
}
