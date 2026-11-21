"use client";

import { ChevronRight } from "lucide-react";
import { CATEGORIES, type CategoryId } from "./categories";
import { exactPercent } from "./allocation";
import { formatCount } from "./format";

/**
 * The keyboard- and screen-reader-accessible path to the same action the
 * waffle cells offer with a mouse: select a category, open its ticket list.
 * Each row restates the icon + color + label + exact numbers the waffle
 * encodes, so nothing here depends on the grid being visible or legible.
 */
export function CategoryLegend({
  counts,
  total,
  selectedId,
  onSelect,
}: {
  counts: Record<CategoryId, number>;
  total: number;
  selectedId: CategoryId | null;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {CATEGORIES.map((category) => {
        const count = counts[category.id] ?? 0;
        const percent = exactPercent(count, total);
        const selected = selectedId === category.id;
        return (
          <li key={category.id}>
            <button
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(category.id)}
              className={`flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2 text-left outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 ${
                selected ? "bg-amber-50" : "hover:bg-zinc-50"
              }`}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: category.tint, color: category.hex }}
              >
                <category.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900">{category.label}</span>
                <span className="block truncate text-xs text-zinc-600">{category.description}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block tabular-nums text-sm font-medium text-zinc-900">{formatCount(count)}</span>
                <span className="block tabular-nums text-xs text-zinc-600">{Math.round(percent)}%</span>
              </span>
              <ChevronRight
                className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${selected ? "translate-x-0.5 text-amber-700" : ""}`}
                aria-hidden="true"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
