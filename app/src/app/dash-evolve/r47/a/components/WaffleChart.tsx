"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Category, CategoryId, PeriodData, StatusCounts, WaffleCell } from "../lib/data";
import { Card, FOCUS_RING, STATUS_META, TrendChip } from "./ui";

const STATUS_BG: Record<WaffleCell["status"], string> = {
  compliant: "bg-emerald-400",
  "at-risk": "bg-amber-400",
  "non-compliant": "bg-red-400",
  na: "bg-zinc-700",
};

export function WaffleChart({
  period,
  cells,
  totals,
  rate,
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  period: PeriodData;
  cells: WaffleCell[];
  totals: StatusCounts;
  rate: number;
  categories: Category[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const catName = (id: CategoryId) => categories.find((c) => c.id === id)?.name ?? id;
  const applicable = totals.compliant + totals.atRisk + totals.nonCompliant;

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    switch (e.key) {
      case "ArrowRight":
        next = Math.min(index + 1, 99);
        break;
      case "ArrowLeft":
        next = Math.max(index - 1, 0);
        break;
      case "ArrowDown":
        next = Math.min(index + 10, 99);
        break;
      case "ArrowUp":
        next = Math.max(index - 10, 0);
        break;
      case "Home":
        next = index - (index % 10);
        break;
      case "End":
        next = index - (index % 10) + 9;
        break;
      default:
        return;
    }
    e.preventDefault();
    setFocusedIndex(next);
    cellRefs.current[next]?.focus();
  }

  const active = activeIndex !== null ? cells[activeIndex] : null;
  const activeRow = activeIndex !== null ? Math.floor(activeIndex / 10) : 0;
  const activeCol = activeIndex !== null ? activeIndex % 10 : 0;
  const tooltipBelow = activeRow <= 1;

  return (
    <Card className="flex min-w-0 flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-zinc-50">Control Compliance</h2>
          <p className="mt-0.5 truncate text-xs text-zinc-400">{period.label} · 100 controls, SOC 2 Type II scope</p>
        </div>
        <TrendChip rate={rate} compareRate={period.compareRate} />
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-baseline gap-3">
          <span
            className="text-5xl font-semibold leading-none tabular-nums text-zinc-50"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {rate}%
          </span>
          <span className="text-sm text-zinc-400">compliant of applicable scope</span>
        </div>
        <p className="mt-2 text-xs text-zinc-400 tabular-nums">
          {totals.compliant} of {applicable} applicable controls compliant · {totals.na} of 100 marked not applicable
          · compared with {period.compareLabel} at {period.compareRate}%.
        </p>
      </div>

      <div className="relative mt-4 px-5">
        <div
          role="group"
          aria-label={`Compliance waffle chart, 100 controls for ${period.shortLabel}, one cell per control`}
          className="grid grid-cols-10 gap-[3px]"
        >
          {cells.map((cell, i) => {
            const meta = STATUS_META[cell.status];
            const isSelectedCategory = cell.category === selectedCategory;
            return (
              <button
                key={cell.cellId}
                type="button"
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                tabIndex={i === focusedIndex ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onFocus={() => {
                  setFocusedIndex(i);
                  setActiveIndex(i);
                }}
                onBlur={() => setActiveIndex((prev) => (prev === i ? null : prev))}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex((prev) => (prev === i ? null : prev))}
                onClick={() => onSelectCategory(cell.category)}
                aria-label={`${cell.cellId}, ${catName(cell.category)}, ${meta.label}. Select to focus this category.`}
                aria-pressed={isSelectedCategory}
                className={`aspect-square w-full rounded-[3px] transition-opacity duration-150 motion-reduce:transition-none ${FOCUS_RING} ${STATUS_BG[cell.status]} ${
                  isSelectedCategory ? "opacity-100 ring-2 ring-white/70 ring-offset-1 ring-offset-zinc-900" : "opacity-90 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>

        {active ? (
          <div
            role="status"
            style={{
              left: `${((activeCol + 0.5) / 10 * 100).toFixed(2)}%`,
              top: tooltipBelow ? `${((activeRow + 1) / 10 * 100).toFixed(2)}%` : `${(activeRow / 10 * 100).toFixed(2)}%`,
              transform: `translate(-50%, ${tooltipBelow ? "6px" : "calc(-100% - 6px)"})`,
            }}
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-white/10 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-50 shadow-lg"
          >
            <span className="font-medium tabular-nums">{active.cellId}</span>
            <span className="text-zinc-400"> · {catName(active.category)} · </span>
            <span className={STATUS_META[active.status].text}>{STATUS_META[active.status].label}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 px-5 py-3">
        {(["compliant", "at-risk", "non-compliant", "na"] as const).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
            <span className={`h-2.5 w-2.5 rounded-[2px] ${STATUS_BG[s]}`} aria-hidden="true" />
            {STATUS_META[s].label}
            <span className="tabular-nums text-zinc-50">{totals[s === "at-risk" ? "atRisk" : s === "non-compliant" ? "nonCompliant" : s]}</span>
          </span>
        ))}
      </div>

      <div className="border-t border-white/10 px-5 py-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Focus a category</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pin a control category">
          {categories.map((c) => {
            const isActive = c.id === selectedCategory;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                aria-pressed={isActive}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                  isActive
                    ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/40"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-50"
                }`}
              >
                {c.name} <span className="tabular-nums opacity-70">{c.total}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
