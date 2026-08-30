"use client";

import { FOCUS_RING } from "./focus";

export interface SegmentItem {
  id: string;
  label: string;
}

/** Pill-track segmented control — visually distinct from `Tabs` (underline). Used for the period toggle. */
export function SegmentedControl({
  items,
  activeId,
  onChange,
  label,
}: {
  items: SegmentItem[];
  activeId: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-800 p-0.5">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(item.id)}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium tabular-nums transition-colors ${FOCUS_RING} ${
              active ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
