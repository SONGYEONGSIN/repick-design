"use client";

import type { ReactNode } from "react";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

export interface SegOption<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedGroupProps<T extends string> {
  labelId: string;
  label: string;
  options: SegOption<T>[];
  value: T;
  onChange: (id: T) => void;
}

/**
 * Accessible single-select segmented control: role="radiogroup" of role="radio" buttons with a
 * visible caption wired in via aria-labelledby (not aria-label, so the visible text and the
 * accessible name are the same string — avoids label-content-name-mismatch). Every option is a
 * genuine discrete choice, never a continuous range.
 */
export function SegmentedGroup<T extends string>({
  labelId,
  label,
  options,
  value,
  onChange,
}: SegmentedGroupProps<T>) {
  return (
    <div className="min-w-0">
      <p id={labelId} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.id)}
              className={[
                "inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors",
                FOCUS,
                active
                  ? "border-rose-500 bg-rose-500 text-[#0B0B0F]"
                  : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100",
              ].join(" ")}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
