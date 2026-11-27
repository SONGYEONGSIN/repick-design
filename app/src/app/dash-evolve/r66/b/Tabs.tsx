"use client";

import { cx, FOCUS_RING_INSET } from "./ui";

interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  idPrefix: string;
}

export function Tabs<T extends string>({ options, value, onChange, label, idPrefix }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-zinc-200">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${opt.value}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${opt.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cx(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              FOCUS_RING_INSET,
              active ? "border-lime-600 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
