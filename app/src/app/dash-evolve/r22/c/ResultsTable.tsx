"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { formatByUnit, type MetricDef, type TableRow } from "./data";
import { CATEGORICAL } from "./tokens";
import { Card, DeltaChip, FOCUS_RING, Progress, Sparkline, Tabs } from "./ui";

type SortKey = "category" | "value" | "delta";
type SortDir = "asc" | "desc";
type TableTab = "breakdown" | "about";

/**
 * The literal answer to the assembled question, one row per category — real
 * sort and a live name filter, both client-side and deterministic.
 */
export function ResultsTable({ metric, dimensionLabel, rows }: { metric: MetricDef; dimensionLabel: string; rows: TableRow[] }) {
  const [tab, setTab] = useState<TableTab>("breakdown");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "category" ? "asc" : "desc");
    }
  }

  const rowsWithIndex = useMemo(
    () => rows.map((row, i) => ({ row, colorIndex: i })),
    [rows],
  );

  const filtered = useMemo(
    () => rowsWithIndex.filter((r) => r.row.category.label.toLowerCase().includes(query.trim().toLowerCase())),
    [rowsWithIndex, query],
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "category") cmp = a.row.category.label.localeCompare(b.row.category.label);
      else if (sortKey === "value") cmp = a.row.value - b.row.value;
      else cmp = a.row.deltaPct - b.row.deltaPct;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  function sortIcon(column: SortKey) {
    if (sortKey !== column) return <ArrowUpDown size={13} className="text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp size={13} className="text-[#5b9bec]" aria-hidden="true" />
    ) : (
      <ArrowDown size={13} className="text-[#5b9bec]" aria-hidden="true" />
    );
  }

  return (
    <Card>
      <h2 className="sr-only font-medium">Results</h2>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          ariaLabel="Table view"
          value={tab}
          onChange={setTab}
          options={[
            { id: "breakdown", label: "Breakdown" },
            { id: "about", label: "About this metric" },
          ]}
        />
        {tab === "breakdown" && (
          <label className="relative">
            <span className="sr-only">Filter categories</span>
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories…"
              className={`h-9 w-44 rounded-lg border border-white/10 bg-zinc-950/60 pl-8 pr-3 text-[13px] text-zinc-50 placeholder:text-zinc-400 hover:border-white/20 sm:w-56 ${FOCUS_RING}`}
            />
          </label>
        )}
      </div>

      {tab === "about" ? (
        <div className="mt-4 max-w-2xl text-sm font-normal leading-relaxed text-zinc-300">
          <p>{metric.description}</p>
          <p className="mt-2 text-zinc-400">
            {metric.additive
              ? "This metric is additive: every category row is a real portion of the period total, and the rows sum back to it exactly."
              : "This metric is a rate or average: each category row is its own value, and the period headline is the weight-adjusted average across categories — not a sum."}
          </p>
        </div>
      ) : (
        <div className="mt-4 w-full">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              {metric.label} broken down by {dimensionLabel.toLowerCase()}, matching the chart above.
            </caption>
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" aria-sort={ariaSortFor("category")} className="w-[34%] py-2 pr-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  <button type="button" onClick={() => toggleSort("category")} className={`flex items-center gap-1 rounded ${FOCUS_RING}`}>
                    {dimensionLabel}
                    {sortIcon("category")}
                  </button>
                </th>
                <th scope="col" aria-sort={ariaSortFor("value")} className="w-[28%] py-2 pr-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  <button type="button" onClick={() => toggleSort("value")} className={`ml-auto flex items-center gap-1 rounded ${FOCUS_RING}`}>
                    {metric.short}
                    {sortIcon("value")}
                  </button>
                </th>
                <th scope="col" className="w-[20%] py-2 pr-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  {metric.additive ? "Share" : "Vs. avg"}
                </th>
                <th scope="col" aria-sort={ariaSortFor("delta")} className="w-[18%] py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                  <button type="button" onClick={() => toggleSort("delta")} className={`ml-auto flex items-center gap-1 rounded ${FOCUS_RING}`}>
                    Prior
                    {sortIcon("delta")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ row, colorIndex }) => {
                const color = CATEGORICAL[colorIndex % CATEGORICAL.length];
                return (
                  <tr key={row.category.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="py-2.5 pr-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                        <span className="truncate text-sm font-medium text-zinc-50">{row.category.label}</span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-2">
                      <span className="flex items-center justify-end gap-2">
                        <span className="hidden shrink-0 sm:block">
                          <Sparkline values={row.spark} color={color} width={56} height={20} />
                        </span>
                        <span className="whitespace-nowrap text-sm font-medium tabular-nums text-zinc-50">
                          {formatByUnit(row.value, metric.unit)}
                        </span>
                      </span>
                    </td>
                    <td className="py-2.5 pr-2">
                      {metric.additive ? (
                        <span className="flex items-center justify-end gap-2">
                          <span className="hidden w-12 shrink-0 sm:block">
                            <Progress pct={row.sharePct} />
                          </span>
                          <span className="w-10 shrink-0 text-right text-xs font-normal tabular-nums text-zinc-400">
                            {row.sharePct.toFixed(0)}%
                          </span>
                        </span>
                      ) : (
                        <span className="flex justify-end">
                          <span
                            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${
                              row.sharePct >= 100
                                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                                : "border-white/10 bg-white/5 text-zinc-300"
                            }`}
                          >
                            {row.sharePct.toFixed(0)}% of avg
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <span className="flex justify-end">
                        <DeltaChip deltaPct={row.deltaPct} isGood={row.isGood} />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm font-normal text-zinc-400">
                    No categories match “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
