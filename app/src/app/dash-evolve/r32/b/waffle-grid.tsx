"use client";

import { useState } from "react";
import type { CategoryId, CompositionSlice, WindowDays } from "./data";
import { CATEGORY_BY_ID } from "./data";
import { cx } from "./ui";

// Row-major 10x10 waffle: each cell is a real <button>, individually focusable and
// keyboard-activatable (never a bare div+onClick). Hover/focus state (`hoverIdx`) lives
// entirely inside this component and is never lifted to a parent or compared against a
// shared "selectedId" — it only ever drives this component's own ephemeral tooltip, so it
// structurally cannot collide with the pin the parent owns. The one place the two ideas
// meet is read-only: the tooltip copy checks `category.id === pinnedId` purely to append
// "Currently pinned" text, never to mutate pinned state.
export default function WaffleGrid({
  sequence,
  slices,
  windowDays,
  pinnedId,
  onPin,
}: {
  sequence: CategoryId[];
  slices: CompositionSlice[];
  windowDays: WindowDays;
  pinnedId: CategoryId | null;
  onPin: (id: CategoryId) => void;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const sliceByCategory = new Map(slices.map((s) => [s.categoryId, s]));
  const seen: Partial<Record<CategoryId, number>> = {};
  const windowLabel = windowDays === 7 ? "last 7 days" : "last 30 days";

  const hoveredCategoryId = hoverIdx !== null ? sequence[hoverIdx] : null;
  const hoveredCategory = hoveredCategoryId ? CATEGORY_BY_ID[hoveredCategoryId] : null;
  const hoveredSlice = hoveredCategoryId ? sliceByCategory.get(hoveredCategoryId) : null;

  if (sequence.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-zinc-200 text-[13px] text-zinc-500">
        No tickets fall inside the {windowLabel} window.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        role="group"
        aria-label={`Ticket backlog composition, ${windowLabel}, 100 cells, one cell per percentage point`}
        className="grid aspect-square w-full grid-cols-10 gap-[3px] sm:gap-1"
      >
        {sequence.map((catId, idx) => {
          const category = CATEGORY_BY_ID[catId];
          const slice = sliceByCategory.get(catId);
          const localIndex = (seen[catId] = (seen[catId] ?? 0) + 1);
          const isPinned = pinnedId === catId;
          const isHovered = hoverIdx === idx;
          const Icon = category.icon;
          const label = `${category.name}: ${slice?.count ?? 0} ticket${(slice?.count ?? 0) === 1 ? "" : "s"}, ${slice?.pct ?? 0}% of the ${windowLabel} backlog, cell ${localIndex} of ${slice?.pct ?? 0}.${isPinned ? " Currently pinned." : ""}`;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx((h) => (h === idx ? null : h))}
              onFocus={() => setHoverIdx(idx)}
              onBlur={() => setHoverIdx((h) => (h === idx ? null : h))}
              onClick={() => onPin(catId)}
              aria-label={label}
              aria-pressed={isPinned}
              style={{ backgroundColor: category.color }}
              className={cx(
                "relative rounded-[3px] shadow-[inset_0_0_0_0_rgba(255,255,255,0)] transition-transform duration-150 motion-reduce:transition-none focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]",
                isHovered && "z-10 scale-[1.14] motion-reduce:scale-100",
                isPinned && "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.95)]"
              )}
            >
              <Icon
                aria-hidden
                className={cx(
                  "pointer-events-none absolute inset-0 m-auto h-[45%] w-[45%]",
                  category.iconInk === "dark" ? "text-zinc-900/80" : "text-white/95"
                )}
              />
            </button>
          );
        })}
      </div>

      {hoveredCategory && hoveredSlice && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg border border-zinc-200 bg-zinc-900 px-2.5 py-1.5 text-[12px] font-medium text-white shadow-lg"
          style={{
            left: `${((hoverIdx! % 10) + 0.5) * 10}%`,
            top: `${Math.floor(hoverIdx! / 10) * 10}%`,
          }}
        >
          <span className="font-semibold">{hoveredCategory.name}</span>
          <span className="ml-1.5 tabular-nums text-zinc-300">
            {hoveredSlice.count} · {hoveredSlice.pct}%
          </span>
          {pinnedId === hoveredCategory.id && <span className="ml-1.5 text-zinc-400">(pinned)</span>}
        </div>
      )}
    </div>
  );
}
