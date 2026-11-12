"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import type { Candle } from "./data";
import { formatPercent, formatPrice } from "./data";
import { cx, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION } from "./tokens";

type SortKey = "time" | "open" | "high" | "low" | "close" | "change";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "time", label: "Time", width: "18%" },
  { key: "open", label: "Open", width: "16.5%" },
  { key: "high", label: "High", width: "16.5%" },
  { key: "low", label: "Low", width: "16.5%" },
  { key: "close", label: "Close", width: "16.5%" },
  { key: "change", label: "Change", width: "16%" },
];

/**
 * Required OHLC fallback for the candlestick chart above (charts.catalog: A11y grade B candlestick
 * needs a real data-table alternative). Compact and collapsed by default so it does not compete with
 * the chart for attention, with a genuine client-side sort — the "real sort/filter" interaction. The
 * page's only horizontal scroller: the chart itself is a responsive SVG with no overflow-x, so this
 * table can safely use `overflow-x-auto` without creating a second wide scroller on the page.
 */
export function OhlcTable({ candles, instrumentName }: { candles: Candle[]; instrumentName: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(
    () =>
      candles.map((c) => ({
        ...c,
        change: Math.round((c.close - c.open) * 100) / 100,
        changePct: Math.round(((c.close - c.open) / c.open) * 100 * 100) / 100,
      })),
    [candles],
  );

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "time") diff = a.index - b.index;
      else if (sortKey === "change") diff = a.changePct - b.changePct;
      else diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <details className="group border-t border-white/10">
      <summary className={cx("flex h-11 cursor-pointer list-none items-center justify-between px-5 text-[13px] font-medium", TEXT_SECONDARY, TRANSITION, FOCUS, "[&::-webkit-details-marker]:hidden hover:text-zinc-100")}>
        <span>OHLC data table &middot; {candles.length} rows</span>
        <ChevronDown aria-hidden="true" className={cx("size-4 shrink-0 transition-transform duration-150 group-open:rotate-180", TEXT_AUX)} />
      </summary>

      <div className="overflow-x-auto px-5 pb-5">
        <table className="relative min-w-[560px] table-fixed border-collapse text-[12.5px]">
          <caption className="sr-only">
            Open, high, low and close for {instrumentName}, {candles.length} periods, sortable by column
          </caption>
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              {COLUMNS.map((col) => {
                const active = col.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={col.key} scope="col" aria-sort={ariaSort} className={cx("py-2 font-medium", col.key === "time" ? "text-left" : "text-right")}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded font-medium",
                        TRANSITION,
                        FOCUS,
                        col.key !== "time" && "flex-row-reverse",
                        active ? TEXT_PRIMARY : TEXT_AUX,
                        "hover:text-zinc-100",
                      )}
                    >
                      {col.label}
                      {active ? sortDir === "asc" ? <ChevronUp aria-hidden="true" className="size-3" /> : <ChevronDown aria-hidden="true" className="size-3" /> : <ChevronsUpDown aria-hidden="true" className="size-3 opacity-50" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isUp = row.change > 0;
              const isFlat = Math.abs(row.change) < 0.005;
              return (
                <tr key={row.index} className="border-b border-white/5 last:border-0">
                  <td className={cx("whitespace-nowrap py-2", NUM, TEXT_SECONDARY)}>{row.label}</td>
                  <td className={cx("whitespace-nowrap py-2 text-right", NUM, TEXT_SECONDARY)}>{formatPrice(row.open)}</td>
                  <td className={cx("whitespace-nowrap py-2 text-right", NUM, TEXT_SECONDARY)}>{formatPrice(row.high)}</td>
                  <td className={cx("whitespace-nowrap py-2 text-right", NUM, TEXT_SECONDARY)}>{formatPrice(row.low)}</td>
                  <td className={cx("whitespace-nowrap py-2 text-right font-medium", NUM, TEXT_PRIMARY)}>{formatPrice(row.close)}</td>
                  <td className={cx("whitespace-nowrap py-2 text-right font-medium", NUM, isFlat ? "text-zinc-400" : isUp ? "text-emerald-400" : "text-rose-400")}>
                    {formatPercent(row.changePct)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

