"use client";

import type { CategoryId, CompositionSlice } from "./data";
import { CATEGORIES } from "./data";
import { cx } from "./ui";

// Always-visible legend: name, swatch+icon, count and share are all rendered as plain
// text — never hover-only — so category identity never depends on color perception alone.
export default function Legend({
  slices,
  pinnedId,
  onPin,
}: {
  slices: CompositionSlice[];
  pinnedId: CategoryId | null;
  onPin: (id: CategoryId) => void;
}) {
  const sliceByCategory = new Map(slices.map((s) => [s.categoryId, s]));

  return (
    <ul aria-label="Ticket categories" className="flex flex-col gap-1">
      {CATEGORIES.map((category) => {
        const slice = sliceByCategory.get(category.id);
        const isPinned = pinnedId === category.id;
        const isEmpty = !slice || slice.count === 0;
        const Icon = category.icon;
        return (
          <li key={category.id}>
            <button
              type="button"
              onClick={() => onPin(category.id)}
              aria-pressed={isPinned}
              disabled={isEmpty}
              className={cx(
                "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]",
                isPinned ? "border-[#1450b0]/30 bg-[#1450b0]/5" : "border-transparent hover:bg-zinc-50",
                isEmpty && "opacity-45"
              )}
            >
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px]"
                style={{ backgroundColor: category.color }}
              >
                <Icon className={cx("h-3.5 w-3.5", category.iconInk === "dark" ? "text-zinc-900/80" : "text-white/95")} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-zinc-900">{category.short}</span>
              <span className="shrink-0 tabular-nums text-[12px] text-zinc-600">
                {slice?.count ?? 0} <span className="text-zinc-500">{"·"}</span> {slice?.pct ?? 0}%
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
