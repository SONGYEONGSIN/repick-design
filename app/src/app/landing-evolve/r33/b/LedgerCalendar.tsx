"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ShieldCheck, BadgeCheck, Sparkles, type LucideIcon } from "lucide-react";
import {
  BAND_LABELS,
  LEDGER_MODEL_NAME,
  LISTING_PRICE,
  MONTH_LABELS,
  describeFilters,
  type FilterState,
  type LedgerStats,
} from "./data";

interface LedgerCalendarProps {
  filters: FilterState;
  onToggle: (key: keyof FilterState) => void;
  stats: LedgerStats;
}

const ROW_COUNT = BAND_LABELS.length;
const COL_COUNT = MONTH_LABELS.length;
// Band index 0 is the cheapest band (see data.ts). Drawing the grid with the highest band on
// top reads like an ordinary price ladder, so the visual row order is the reverse of the index
// order — this is the only place that reversal happens; every stored index stays 0-low/5-high.
const ROW_ORDER = Array.from({ length: ROW_COUNT }, (_, i) => ROW_COUNT - 1 - i);

const FILTER_TOGGLES: { key: keyof FilterState; label: string; icon: LucideIcon }[] = [
  { key: "gradeA", label: "Grade A only", icon: Sparkles },
  { key: "authVerified", label: "Authenticity verified", icon: BadgeCheck },
  { key: "sellerVerified", label: "Seller verified", icon: ShieldCheck },
];

// Four-step density scale, 0..3+, tuned to this ledger's own max cell count (3). Count 0 reads as
// "not included under these filters" rather than "zero sales ever" — the two are visually distinct
// because every non-empty cell keeps at least a tinted fill.
function cellFill(count: number): string {
  if (count <= 0) return "bg-white border border-zinc-200";
  if (count === 1) return "bg-[#DCF2E3] border border-[#BCE3CB]";
  if (count === 2) return "bg-[#5FAE7C] border border-[#4E9A6A]";
  return "bg-[#176B41] border border-[#125A36]";
}

const outline =
  "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2";

type Cell = { row: number; col: number };

export default function LedgerCalendar({ filters, onToggle, stats }: LedgerCalendarProps) {
  // `cursor` is the roving-tabindex position (moves only on focus/keyboard). `hovered` is a
  // purely visual preview for mouse users that never steals DOM focus or reassigns tabIndex —
  // it only changes what the sighted readout and live region report.
  const [cursor, setCursor] = useState<Cell>({ row: 2, col: 11 });
  const [hovered, setHovered] = useState<Cell | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>(
    Array.from({ length: ROW_COUNT }, () => Array.from({ length: COL_COUNT }, () => null)),
  );

  const { grid, count, medianPrice, beatsPct } = stats;
  const active = hovered ?? cursor;
  const activeCount = grid.cells[active.row][active.col];

  function moveCursor(nextRow: number, nextCol: number) {
    const row = Math.min(ROW_COUNT - 1, Math.max(0, nextRow));
    const col = Math.min(COL_COUNT - 1, Math.max(0, nextCol));
    setCursor({ row, col });
    cellRefs.current[row][col]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, row: number, col: number) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveCursor(row, col + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveCursor(row, col - 1);
        break;
      case "ArrowDown":
        // Visually down = toward the cheaper band = a lower raw row index.
        e.preventDefault();
        moveCursor(row - 1, col);
        break;
      case "ArrowUp":
        // Visually up = toward the pricier band = a higher raw row index.
        e.preventDefault();
        moveCursor(row + 1, col);
        break;
      case "Home":
        e.preventDefault();
        moveCursor(row, 0);
        break;
      case "End":
        e.preventDefault();
        moveCursor(row, COL_COUNT - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#176B41]">
          The comp ledger
        </p>
        <p className="max-w-[26rem] text-sm leading-relaxed text-zinc-600">
          96 closed resale sales of the{" "}
          <span className="font-semibold text-zinc-900">{LEDGER_MODEL_NAME}</span>, the
          last 12 months. Toggle a filter to re-count the ledger.
        </p>
      </div>

      {/* Filter toggles */}
      <div
        role="group"
        aria-label="Filter which comparable sales count"
        className="mt-4 flex flex-wrap gap-2"
      >
        {FILTER_TOGGLES.map(({ key, label, icon: Icon }) => {
          const isOn = filters[key];
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(key)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                outline,
                isOn
                  ? "bg-[#1E7A4C] text-white"
                  : "bg-white text-zinc-600 border border-zinc-300 hover:border-zinc-400 hover:text-zinc-900",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid + stat panel */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div style={{ contain: "layout" }}>
          <div className="overflow-x-auto pb-1">
            <div
              style={{ minWidth: "560px" }}
              role="group"
              aria-label={`Comparable sale calendar for ${LEDGER_MODEL_NAME}, 12 months by price band`}
            >
              {/* Month header row */}
              <div
                className="grid items-end"
                style={{ gridTemplateColumns: `6.5rem repeat(${COL_COUNT}, minmax(0,1fr))` }}
              >
                <span aria-hidden="true" />
                {MONTH_LABELS.map((m) => (
                  <span
                    key={m}
                    aria-hidden="true"
                    className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-600"
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* Band rows */}
              <div className="mt-1 flex flex-col gap-[3px]">
                {ROW_ORDER.map((row) => {
                  const bandLabel = BAND_LABELS[row];
                  return (
                  <div
                    key={bandLabel}
                    className="grid items-center gap-[3px]"
                    style={{ gridTemplateColumns: `6.5rem repeat(${COL_COUNT}, minmax(0,1fr))` }}
                  >
                    <span className="truncate pr-2 text-right text-[11px] font-semibold text-zinc-600">
                      {bandLabel}
                    </span>
                    {MONTH_LABELS.map((monthLabel, col) => {
                      const c = grid.cells[row][col];
                      const isCursor = cursor.row === row && cursor.col === col;
                      const isActive = active.row === row && active.col === col;
                      return (
                        <button
                          key={`${row}-${col}`}
                          ref={(el) => {
                            cellRefs.current[row][col] = el;
                          }}
                          type="button"
                          tabIndex={isCursor ? 0 : -1}
                          onFocus={() => setCursor({ row, col })}
                          onMouseEnter={() => setHovered({ row, col })}
                          onMouseLeave={() => setHovered(null)}
                          onKeyDown={(e) => handleKeyDown(e, row, col)}
                          className={[
                            "aspect-square rounded-[4px] transition-colors",
                            cellFill(c),
                            isActive ? "shadow-[0_0_0_2px_#176B41]" : "",
                            outline,
                          ].join(" ")}
                        >
                          <span className="sr-only">
                            {monthLabel}, {bandLabel}: {c} comparable sale{c === 1 ? "" : "s"} under the
                            current filters.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
            <span className="font-semibold uppercase tracking-wide text-zinc-600">Sales per cell</span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-[3px] ${cellFill(0)}`} aria-hidden="true" />0
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-[3px] ${cellFill(1)}`} aria-hidden="true" />1
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-[3px] ${cellFill(2)}`} aria-hidden="true" />2
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`inline-block h-3 w-3 rounded-[3px] ${cellFill(3)}`} aria-hidden="true" />3+
            </span>
          </div>

          {/* Visible, sighted-user readout of the focused/hovered cell */}
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            <span className="font-semibold text-zinc-900">
              {MONTH_LABELS[active.col]} · {BAND_LABELS[active.row]}:
            </span>{" "}
            <span className="tabular-nums">{activeCount}</span> comparable sale
            {activeCount === 1 ? "" : "s"} under the current filters.
          </p>

          {/* Mirrors the readout above for assistive tech on both focus and hover */}
          <div aria-live="polite" className="sr-only">
            {MONTH_LABELS[active.col]}, {BAND_LABELS[active.row]}: {activeCount} comparable sale
            {activeCount === 1 ? "" : "s"} under the current filters.
          </div>
        </div>

        {/* Headline stat panel — recomputed live from the active filters */}
        <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Counting {describeFilters(filters)}
          </p>
          <p
            className="mt-2 text-3xl tabular-nums text-zinc-900"
            style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
          >
            {count}
          </p>
          <p className="text-sm text-zinc-600">comps counted</p>

          <div className="mt-4 border-t border-zinc-100 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Median comp price
            </p>
            <p
              className="mt-1 text-2xl tabular-nums text-zinc-900"
              style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
            >
              {medianPrice !== null ? `$${medianPrice}` : "—"}
            </p>
          </div>

          <div className="mt-4 border-t border-zinc-100 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              This <span className="tabular-nums">{`$${LISTING_PRICE}`}</span> listing beats
            </p>
            <p
              className="mt-1 text-2xl tabular-nums text-[#176B41]"
              style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
            >
              {beatsPct !== null ? `${beatsPct}%` : "—"}
            </p>
            <p className="text-sm text-zinc-600">of those comps on price</p>
          </div>
        </div>
      </div>
    </div>
  );
}
