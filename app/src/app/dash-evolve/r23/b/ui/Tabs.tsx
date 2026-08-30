"use client";

import { FOCUS_RING } from "./focus";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

/** Underline-style tabs — used for the watchlist category filter. */
export function Tabs({
  items,
  activeId,
  onChange,
  label,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex items-center gap-4 border-b border-white/10 px-1">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={`relative -mb-px flex items-center gap-1 whitespace-nowrap pb-2 pt-1 text-[12.5px] font-medium transition-colors ${FOCUS_RING} ${
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="tabular-nums text-zinc-400">{item.count}</span>
            )}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-colors ${
                active ? "bg-amber-400" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
