"use client";

import { FOCUS } from "./ui";

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex min-w-0 flex-wrap gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`tab-${tab.value}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors ${FOCUS} ${
              isActive ? "border-green-700 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
