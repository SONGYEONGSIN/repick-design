"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Trade } from "./data";
import { formatPrice, formatSize } from "./data";
import { Avatar, Card, FOCUS_RING, SideBadge } from "./ui";

type SortKey = "time" | "price" | "size" | "value";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "time", label: "Time" },
  { key: "price", label: "Price" },
  { key: "size", label: "Size" },
  { key: "value", label: "Value" },
];

export function TradesTable({ trades, symbol, decimals }: { trades: Trade[]; symbol: string; decimals: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Reset to the feed's natural (most-recent-first) order whenever the instrument changes.
  const [prevSymbol, setPrevSymbol] = useState(symbol);
  let effectiveSortKey = sortKey;
  if (prevSymbol !== symbol) {
    setPrevSymbol(symbol);
    setSortKey("time");
    setSortDir("asc");
    effectiveSortKey = "time";
  }

  function sortValue(t: Trade, key: SortKey): number {
    if (key === "time") return trades.indexOf(t);
    return t[key];
  }

  const sorted = [...trades].sort((a, b) => {
    const diff = sortValue(a, effectiveSortKey) - sortValue(b, effectiveSortKey);
    return sortDir === "asc" ? diff : -diff;
  });

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card className="p-4">
      <h2 className="font-semibold text-sm text-zinc-900">Recent Trades — {symbol}</h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-500">Latest executions reported to the desk. Sort any column.</p>

      <ul className="mt-3 space-y-2 sm:hidden">
        {sorted.map((t) => (
          <li key={t.id} className="rounded-lg border border-zinc-200 p-2.5">
            <div className="flex items-center gap-2">
              <Avatar name={t.counterparty} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm text-zinc-900">{t.counterparty}</p>
                <p className="font-normal text-xs text-zinc-500">{t.timeLabel}</p>
              </div>
              <SideBadge side={t.side} />
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
              <dt className="font-normal text-zinc-500">Price</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatPrice(t.price, decimals)}</dd>
              <dt className="font-normal text-zinc-500">Size</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatSize(t.size)}</dd>
              <dt className="font-normal text-zinc-500">Value</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">${formatPrice(t.value, 2)}</dd>
            </dl>
          </li>
        ))}
      </ul>

      <div className="mt-3 hidden overflow-y-auto sm:block" style={{ maxHeight: "22rem" }}>
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-500">
            Recent trades for {symbol}, sortable by any column.
          </caption>
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "27%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              {COLUMNS.slice(0, 1).map((col) => (
                <SortableHeader key={col.key} col={col} onSort={toggleSort} ariaSort={ariaSortFor(col.key)} align="left" />
              ))}
              <th scope="col" className="py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Side
              </th>
              <th scope="col" className="py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Counterparty
              </th>
              {COLUMNS.slice(1).map((col) => (
                <SortableHeader key={col.key} col={col} onSort={toggleSort} ariaSort={ariaSortFor(col.key)} align="right" />
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr key={t.id} className="border-b border-zinc-100 motion-safe:transition-colors hover:bg-zinc-50">
                <td className="py-2 font-normal text-sm text-zinc-700">{t.timeLabel}</td>
                <td className="py-2">
                  <SideBadge side={t.side} />
                </td>
                <td className="py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar name={t.counterparty} />
                    <span className="truncate font-medium text-sm text-zinc-800">{t.counterparty}</span>
                  </div>
                </td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatPrice(t.price, decimals)}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatSize(t.size)}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">${formatPrice(t.value, 2)}</td>
              </tr>
            ))}
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
    <th scope="col" aria-sort={ariaSort} className="py-2 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
      <button
        type="button"
        onClick={() => onSort(col.key)}
        className={`inline-flex min-h-7 w-full items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors hover:text-zinc-800 ${FOCUS_RING} ${
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
