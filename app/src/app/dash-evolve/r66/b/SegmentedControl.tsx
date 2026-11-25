"use client";

import { cx, FOCUS_RING_INSET } from "./ui";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, label }: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex h-11 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "h-full rounded-md px-3 text-sm font-medium transition-colors",
              FOCUS_RING_INSET,
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
