"use client";

import type { CategoryEntry, CategoryId } from "./data";
import { categoryDeltaPct, categoryPercent } from "./data";
import { formatCurrency, formatSignedPercent1, formatPercent1 } from "./format";
import { CATEGORY_ICON } from "./category-icons";
import { buildWedges, DONUT_LAYOUT } from "./geometry";
import { Badge, FOCUS_RING } from "./ui";

const VIEW_SIZE = 240;

function clampPercent(value: number): number {
  return Math.min(78, Math.max(22, value));
}

export default function DonutChart({
  categories,
  total,
  selectedId,
  hoveredId,
  largestId,
  onSelect,
  onHover,
  totalLabel,
}: {
  categories: CategoryEntry[];
  total: number;
  selectedId: CategoryId;
  hoveredId: CategoryId | null;
  largestId: CategoryId;
  onSelect: (id: CategoryId) => void;
  onHover: (id: CategoryId | null) => void;
  totalLabel: string;
}) {
  const shares = categories.map((c) => ({ id: c.id, percent: categoryPercent(c, total) }));
  const wedges = buildWedges(DONUT_LAYOUT, shares);
  const activeId = hoveredId ?? selectedId;
  const activeCategory = categories.find((c) => c.id === activeId) ?? null;
  const activeWedge = wedges.find((w) => w.id === activeId) ?? null;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-[220px] w-[220px] shrink-0 sm:mx-0 sm:h-[240px] sm:w-[240px]">
        <svg
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          width="100%"
          height="100%"
          aria-hidden="true"
          className="h-full w-full"
        >
          {wedges.map((wedge) => {
            const category = categories.find((c) => c.id === wedge.id);
            if (!category) return null;
            const isActive = wedge.id === activeId;
            const isDimmed = !isActive;
            return (
              <path
                key={wedge.id}
                d={wedge.path}
                fill={category.color}
                fillOpacity={isDimmed ? 0.35 : 1}
                stroke={isActive ? "rgba(255,255,255,0.35)" : "transparent"}
                strokeWidth={isActive ? 2 : 0}
                className="motion-safe:transition-[fill-opacity,stroke]"
                onMouseEnter={() => onHover(wedge.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(wedge.id)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p
            className="font-semibold text-[26px] leading-none text-zinc-50 tabular-nums sm:text-[30px]"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatCurrency(total)}
          </p>
          <p className="mt-1.5 max-w-[120px] font-normal text-[11px] uppercase tracking-wide text-zinc-400">
            Total spend, {totalLabel.toLowerCase()}
          </p>
        </div>

        {activeCategory && activeWedge ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 w-max max-w-[150px] -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-left shadow-xl motion-safe:transition-opacity"
            style={{
              left: `${clampPercent((activeWedge.labelPoint.x / VIEW_SIZE) * 100)}%`,
              top: `${Math.max(14, (activeWedge.labelPoint.y / VIEW_SIZE) * 100)}%`,
            }}
          >
            <p className="font-medium text-xs text-zinc-50">{activeCategory.name}</p>
            <p className="mt-0.5 font-normal text-xs text-zinc-400 tabular-nums">
              {formatCurrency(activeCategory.amount)} · {formatPercent1(categoryPercent(activeCategory, total))}
            </p>
            <p className="mt-0.5 font-normal text-[11px] text-zinc-400 tabular-nums">
              {formatSignedPercent1(categoryDeltaPct(activeCategory))} period over period
            </p>
          </div>
        ) : null}
      </div>

      <ul className="min-w-0 flex-1 space-y-1.5">
        {categories.map((category) => {
          const Icon = CATEGORY_ICON[category.id];
          const percent = categoryPercent(category, total);
          const delta = categoryDeltaPct(category);
          const selected = category.id === selectedId;
          return (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(category.id)}
                onMouseEnter={() => onHover(category.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(category.id)}
                onBlur={() => onHover(null)}
                className={`flex w-full min-w-0 items-center gap-3 rounded-lg px-2.5 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  selected ? "bg-rose-500/10" : "hover:bg-white/5"
                }`}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${category.color}26` }}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" style={{ color: category.color }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-medium text-sm text-zinc-50">{category.name}</span>
                    {category.id === largestId ? <Badge tone="accent">Largest</Badge> : null}
                  </span>
                  <span className="mt-0.5 flex items-baseline justify-between gap-2">
                    <span className="truncate font-normal text-xs text-zinc-400 tabular-nums">
                      {formatSignedPercent1(delta)} period over period
                    </span>
                    <span className="shrink-0 font-normal text-sm text-zinc-50 tabular-nums">
                      {formatCurrency(category.amount)} · {formatPercent1(percent)}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
