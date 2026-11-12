"use client";

import { useRef, type KeyboardEvent } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Overrides the accessible name when the visible label is a compact abbreviation. */
  ariaLabel?: string;
}

/**
 * Generic segmented control, reused for both the sentiment filter and the
 * period toggle. role="radiogroup" with role="radio" options; Left/Right
 * arrow keys move the selection, matching native radio-group behavior.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + options.length) % options.length;
    const nextOption = options[next];
    onChange(nextOption.value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 ${className}`}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.ariaLabel}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium tabular-nums whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
              active
                ? "bg-emerald-500 text-zinc-950"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
