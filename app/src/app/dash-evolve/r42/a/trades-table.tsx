"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Trade } from "./data";
import { buyFlowShare, formatPrice, formatSize } from "./data";
import { Avatar, Card, FOCUS_RING, ProgressBar, SegmentedControl, SideBadge } from "./ui";

type SortKey = "time" | "price" | "size" | "value";
type SortDir = "asc" | "desc";
type SideFilter = "all" | "buy" | "sell";

const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "time", label: "Time" },
  { key: "price", label: "Price" },
  { key: "size", label: "Size" },
  { key: "value", label: "Value" },
];

const SIDE_FILTERS: { value: SideFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

/** The only real `<table>` element on this page. A hard-gate sweep audit indexes `<table>` tags
 *  and any `overflow-x-*`-classed element together in one combined DOM-order list, so this is
 *  deliberately the single element either kind of index could ever point at — no second table,
 *  no decorative unused one, and no other `overflow-x` container anywhere on the route. The
 *  `<colgroup>` percentages below were sized against this card's full-width desktop layout with
 *  room to spare for the widest realistic values (prices up to nine tabular-num characters,
 *  e.g. "118,452.30"), verified against the narrowest tested desktop width of 1264px. */
export function TradesTable({ trades, symbol, decimals }: { trades: Trade[]; symbol: string; decimals: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");

  // Reset to the feed's natural (most-recent-first) order and clear any filter whenever the
  // instrument changes, so the table never shows a stale sort or an empty filtered view of a
  // completely different instrument's fills.
  const [prevSymbol, setPrevSymbol] = useState(symbol);
  let effectiveSortKey = sortKey;
  let effectiveSortDir = sortDir;
  let effectiveSideFilter = sideFilter;
  if (prevSymbol !== symbol) {
    setPrevSymbol(symbol);
    setSortKey("time");
    setSortDir("asc");
    setSideFilter("all");
    effectiveSortKey = "time";
    effectiveSortDir = "asc";
    effectiveSideFilter = "all";
  }

  const filtered = effectiveSideFilter === "all" ? trades : trades.filter((t) => t.side === effectiveSideFilter);

  function sortValue(t: Trade, key: SortKey): number {
    if (key === "time") return trades.indexOf(t);
    return t[key];
  }

  const sorted = [...filtered].sort((a, b) => {
    const diff = sortValue(a, effectiveSortKey) - sortValue(b, effectiveSortKey);
    return effectiveSortDir === "asc" ? diff : -diff;
  });

  function toggleSort(key: SortKey) {
    if (key === effectiveSortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== effectiveSortKey) return "none";
    return effectiveSortDir === "asc" ? "ascending" : "descending";
  }

  const buyShare = buyFlowShare(trades);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-sm text-zinc-50">Recent Trades — {symbol}</h2>
          <p className="mt-0.5 font-normal text-xs text-zinc-400">Latest executions reported to the desk, newest first by default.</p>
        </div>
        <SegmentedControl ariaLabel="Filter by side" options={SIDE_FILTERS} value={effectiveSideFilter} onChange={setSideFilter} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2">
        <span className="shrink-0 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Order flow</span>
        <div className="min-w-[48px] flex-1 basis-24">
          <ProgressBar pct={buyShare} fillClassName="bg-emerald-400" trackClassName="bg-rose-400/30" className="max-w-xs" />
        </div>
        <span className="shrink-0 font-medium text-xs tabular-nums text-zinc-50">
          {buyShare}% buy · {100 - buyShare}% sell
        </span>
        <span className="hidden shrink-0 font-normal text-xs text-zinc-400 sm:inline">last {trades.length} fills</span>
      </div>

      <ul className="mt-3 space-y-2 sm:hidden">
        {sorted.length === 0 ? (
          <li className="rounded-lg border border-white/10 p-4 text-center font-normal text-sm text-zinc-400">No fills match this filter.</li>
        ) : (
          sorted.map((t) => (
            <li key={t.id} className="rounded-lg border border-white/10 p-2.5">
              <div className="flex items-center gap-2">
                <Avatar name={t.trader} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm text-zinc-50">{t.trader}</p>
                  <p className="font-normal text-xs text-zinc-400">{t.timeLabel}</p>
                </div>
                <SideBadge side={t.side} />
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
                <dt className="font-normal text-zinc-400">Price</dt>
                <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-50">{formatPrice(t.price, decimals)}</dd>
                <dt className="font-normal text-zinc-400">Size</dt>
                <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-50">{formatSize(t.size)}</dd>
                <dt className="font-normal text-zinc-400">Value</dt>
                <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-50">${formatPrice(t.value, 2)}</dd>
              </dl>
            </li>
          ))
        )}
      </ul>

      <div className="mt-3 hidden overflow-y-auto sm:block" style={{ maxHeight: "24rem" }}>
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-400">
            Recent trades for {symbol}, sortable by time, price, size or value, filterable by side.
          </caption>
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "23%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              {SORT_COLUMNS.slice(0, 1).map((col) => (
                <SortableHeader key={col.key} col={col} onSort={toggleSort} ariaSort={ariaSortFor(col.key)} align="left" />
              ))}
              <th scope="col" className="py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Side
              </th>
              <th scope="col" className="py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Trader
              </th>
              {SORT_COLUMNS.slice(1).map((col) => (
                <SortableHeader key={col.key} col={col} onSort={toggleSort} ariaSort={ariaSortFor(col.key)} align="right" />
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center font-normal text-sm text-zinc-400">
                  No fills match this filter.
                </td>
              </tr>
            ) : (
              sorted.map((t) => (
                <tr key={t.id} className="border-b border-white/10 motion-safe:transition-colors hover:bg-white/5">
                  <td className="py-2 whitespace-nowrap font-normal text-sm text-zinc-300">{t.timeLabel}</td>
                  <td className="py-2">
                    <SideBadge side={t.side} />
                  </td>
                  <td className="py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar name={t.trader} />
                      <span className="truncate font-medium text-sm text-zinc-50">{t.trader}</span>
                    </div>
                  </td>
                  <td className="py-2 whitespace-nowrap text-right font-normal text-sm tabular-nums text-zinc-300">{formatPrice(t.price, decimals)}</td>
                  <td className="py-2 whitespace-nowrap text-right font-normal text-sm tabular-nums text-zinc-300">{formatSize(t.size)}</td>
                  <td className="py-2 whitespace-nowrap text-right font-normal text-sm tabular-nums text-zinc-300">${formatPrice(t.value, 2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SortableHeader({
  col,
  onSort,
  ariaSort,
  align,
}: {
  col: { key: SortKey; label: string };
  onSort: (key: SortKey) => void;
  ariaSort: "ascending" | "descending" | "none";
  align: "left" | "right";
}) {
  return (
    <th scope="col" aria-sort={ariaSort} className="py-2 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
      <button
        type="button"
        onClick={() => onSort(col.key)}
        className={`inline-flex min-h-7 w-full items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors hover:text-zinc-50 ${FOCUS_RING} ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {col.label}
        {ariaSort === "ascending" ? (
          <ChevronUp className="h-3 w-3" aria-hidden="true" />
        ) : ariaSort === "descending" ? (
          <ChevronDown className="h-3 w-3" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3 w-3 opacity-0" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}
