"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ASSET_CLASSES, BASELINE_OPTIONS, POSITIONS, formatPoints, type AssetClass, type BaselineKey } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

type SortKey = "allocation" | "ownReturn" | "delta";
type SortDir = "asc" | "desc";

const SORT_LABEL: Record<SortKey, string> = {
  allocation: "Allocation",
  ownReturn: "Return",
  delta: "Delta",
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function PositionsTable({ baseline }: { baseline: BaselineKey }) {
  const [assetFilter, setAssetFilter] = useState<AssetClass | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("allocation");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const baselineMeta = BASELINE_OPTIONS.find((b) => b.key === baseline)!;

  const withDelta = POSITIONS.map((p) => ({
    ...p,
    delta: baseline === "index" ? p.deltaIndex : p.deltaPeer,
  }));

  const filtered = assetFilter === "all" ? withDelta : withDelta.filter((p) => p.assetClass === assetFilter);

  const sorted = [...filtered].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === "asc" ? diff : -diff;
  });

  const filteredAllocationSum = round2(filtered.reduce((s, p) => s + p.allocation, 0));

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />;
    return sortDir === "asc" ? (
      <ChevronUp aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" />
    ) : (
      <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-cyan-300" />
    );
  }

  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <section aria-labelledby="positions-heading" className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="positions-heading" className="text-base font-semibold text-zinc-50">
          Open positions
        </h2>
        <p className="text-xs font-normal tabular-nums text-zinc-400">
          Showing {filtered.length} of {POSITIONS.length} &middot; {filteredAllocationSum.toFixed(2)}% allocated
        </p>
      </div>

      <div role="group" aria-label="Filter by asset class" className="mt-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          aria-pressed={assetFilter === "all"}
          onClick={() => setAssetFilter("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${FOCUS} ${
            assetFilter === "all"
              ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
          }`}
        >
          All
        </button>
        {ASSET_CLASSES.map((ac) => {
          const active = assetFilter === ac;
          const count = POSITIONS.filter((p) => p.assetClass === ac).length;
          return (
            <button
              key={ac}
              type="button"
              aria-pressed={active}
              onClick={() => setAssetFilter(ac)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${FOCUS} ${
                active
                  ? "border-cyan-400 bg-cyan-400/15 text-cyan-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
              }`}
            >
              {ac} <span className="tabular-nums text-zinc-400">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 sm:p-3">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Open positions for Solstice Macro, sortable by allocation, return, and delta versus {baselineMeta.short}.
          </caption>
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[20%]" />
            <col className="w-[16%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-800 text-left">
              <th scope="col" className="px-2 py-2 text-xs font-medium text-zinc-400">
                Instrument
              </th>
              <th scope="col" className="px-2 py-2 text-xs font-medium text-zinc-400">
                Asset class
              </th>
              <th scope="col" aria-sort={ariaSort("allocation")} className="px-2 py-2 text-xs font-medium text-zinc-400">
                <button
                  type="button"
                  onClick={() => onSort("allocation")}
                  aria-label={`Sort by ${SORT_LABEL.allocation}`}
                  className={`inline-flex items-center gap-1 ${FOCUS} rounded`}
                >
                  Alloc. {sortIcon("allocation")}
                </button>
              </th>
              <th scope="col" aria-sort={ariaSort("ownReturn")} className="px-2 py-2 text-xs font-medium text-zinc-400">
                <button
                  type="button"
                  onClick={() => onSort("ownReturn")}
                  aria-label={`Sort by ${SORT_LABEL.ownReturn}`}
                  className={`inline-flex items-center gap-1 ${FOCUS} rounded`}
                >
                  Return {sortIcon("ownReturn")}
                </button>
              </th>
              <th scope="col" aria-sort={ariaSort("delta")} className="px-2 py-2 text-xs font-medium text-zinc-400">
                <button
                  type="button"
                  onClick={() => onSort("delta")}
                  aria-label={`Sort by ${SORT_LABEL.delta} versus ${baselineMeta.short}`}
                  className={`inline-flex items-center gap-1 ${FOCUS} rounded`}
                >
                  <span aria-hidden="true">&Delta;</span>
                  <span className="sr-only">Delta vs {baselineMeta.short}</span> {sortIcon("delta")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className="border-b border-zinc-800/60 last:border-0">
                <th scope="row" className="px-2 py-2 text-left text-sm font-normal text-zinc-100">
                  {p.instrument}
                </th>
                <td className="px-2 py-2 text-sm font-normal text-zinc-300">{p.assetClass}</td>
                <td className="px-2 py-2 text-sm font-normal tabular-nums text-zinc-300">{p.allocation.toFixed(2)}%</td>
                <td className={`px-2 py-2 text-sm font-normal tabular-nums ${p.ownReturn >= 0 ? "text-zinc-100" : "text-zinc-300"}`}>
                  {p.ownReturn >= 0 ? "+" : ""}
                  {p.ownReturn.toFixed(2)}%
                </td>
                <td className={`px-2 py-2 text-sm font-medium tabular-nums ${p.delta >= 0 ? "text-cyan-300" : "text-zinc-300"}`}>
                  {formatPoints(p.delta)}
                </td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-6 text-center text-sm font-normal text-zinc-400">
                  No positions in this asset class.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
