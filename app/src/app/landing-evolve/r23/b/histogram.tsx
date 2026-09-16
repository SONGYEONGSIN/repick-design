"use client";

import { motion } from "framer-motion";
import { BIN_COUNT, binRange, money, type FilterId } from "./data";

const ACCENT = "#15803D";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]";

function barLabel(count: number, lo: number, hi: number, isItemBin: boolean, active: FilterId[]): string {
  const scope = active.length > 0 ? `within the current ${active.length}-filter pool` : "across the full pool";
  const base = `${count} comparable sale${count === 1 ? "" : "s"} between ${money(lo)} and ${money(hi)}, ${scope}.`;
  return isItemBin ? `${base} This band includes your listing, priced at the same range.` : base;
}

export default function Histogram({
  counts,
  itemBinIndex,
  hoverBin,
  onHover,
  activeFilters,
  reduce,
}: {
  counts: number[];
  itemBinIndex: number;
  hoverBin: number | null;
  onHover: (index: number | null) => void;
  activeFilters: FilterId[];
  reduce: boolean;
}) {
  const maxCount = Math.max(1, ...counts);

  return (
    <div
      role="group"
      aria-label="Sold-price distribution of comparable sales, grouped into eight price bands"
      className="flex h-64 w-full items-end gap-2 sm:gap-3"
    >
      {Array.from({ length: BIN_COUNT }, (_, i) => {
        const { lo, hi } = binRange(i);
        const count = counts[i] ?? 0;
        const ratio = count / maxCount;
        const isItemBin = i === itemBinIndex;
        const isHovered = hoverBin === i;
        const isLastBin = i === BIN_COUNT - 1;

        return (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span
              aria-hidden="true"
              className="block h-3 text-[9px] font-semibold tracking-[0.14em] text-[#4ADE80]"
            >
              {isItemBin ? "YOURS" : " "}
            </span>
            <button
              type="button"
              onMouseEnter={() => onHover(i)}
              onFocus={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              onBlur={() => onHover(null)}
              aria-label={barLabel(count, lo, hi, isItemBin, activeFilters)}
              className={`relative h-48 w-full max-w-16 overflow-hidden rounded-t-md bg-white/[0.07] transition-colors ${FOCUS}`}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 block h-full origin-bottom rounded-t-md"
                style={{
                  background: isItemBin
                    ? ACCENT
                    : isHovered
                      ? "rgba(255,255,255,0.30)"
                      : "rgba(255,255,255,0.16)",
                }}
                animate={{ scaleY: Math.max(ratio, count > 0 ? 0.04 : 0) }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px] font-semibold tabular-nums text-white"
              >
                {count}
              </span>
            </button>
            <span aria-hidden="true" className="text-[10px] font-normal tabular-nums text-zinc-400">
              {isLastBin ? money(hi) : money(lo)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
