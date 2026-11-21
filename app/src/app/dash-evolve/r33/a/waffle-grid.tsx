"use client";

import type { CategoryId } from "./categories";
import { categoryById } from "./categories";
import { exactPercent } from "./allocation";

/**
 * The 10x10 unit grid. Each of the 100 cells is exactly 1% of the current
 * backlog window. Cells are mouse-only (onClick + a CSS-only hover tooltip):
 * the equivalent information and the equivalent action are both available,
 * with full keyboard reach, from the CategoryLegend list next to it — so this
 * grid stays `aria-hidden` rather than exposing 100 redundant tab stops for a
 * single "pick a category" action.
 *
 * The hover tooltip is pure CSS (`group` / `group-hover`), so it carries no
 * React state at all and can never interfere with `selectedId`, which is
 * exactly the isolation the brief calls for.
 */
export function WaffleGrid({
  cells,
  counts,
  total,
  selectedId,
  onSelect,
}: {
  cells: CategoryId[];
  counts: Record<CategoryId, number>;
  total: number;
  selectedId: CategoryId | null;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-10 gap-[3px] sm:gap-1"
    >
      {cells.map((categoryId, index) => {
        const category = categoryById(categoryId);
        const row = Math.floor(index / 10);
        const col = index % 10;
        const count = counts[categoryId] ?? 0;
        const percent = exactPercent(count, total);
        const selected = selectedId === categoryId;
        const dimmed = selectedId !== null && !selected;

        const vertical = row < 2 ? "top-full mt-1.5" : "bottom-full mb-1.5";
        const horizontal =
          col <= 1 ? "left-0" : col >= 8 ? "right-0" : "left-1/2 -translate-x-1/2";

        return (
          <div key={index} className="group relative aspect-square">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(categoryId)}
              style={{
                backgroundColor: category.tint,
                color: category.hex,
                opacity: dimmed ? 0.35 : 1,
                boxShadow: selected ? "0 0 0 2px #ffffff, 0 0 0 4px #b45309" : undefined,
              }}
              className="flex h-full w-full items-center justify-center rounded-[4px] transition-opacity duration-150 motion-reduce:transition-none"
            >
              <category.icon className="h-[55%] w-[55%]" strokeWidth={2.25} aria-hidden="true" />
            </button>
            <div
              role="presentation"
              className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 motion-reduce:transition-none ${vertical} ${horizontal}`}
            >
              {category.label}
              <span className="tabular-nums text-zinc-300"> · {count} · {Math.round(percent)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
