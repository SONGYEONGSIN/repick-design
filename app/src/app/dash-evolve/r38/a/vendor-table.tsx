"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { VENDORS, CATEGORIES, getVendorStat, formatNum, formatPct, STATUS_LABEL, type Category, type Period } from "./data";
import { Card, CategoryTag, StatusBadge, Sparkline, SrOnly, Tabs } from "./ui";

type SortKey = "name" | "status" | "requests" | "min" | "q1" | "median" | "q3" | "max" | "outliers";
type SortDir = "asc" | "desc";

type ColumnKey = SortKey | "trend";

const COLUMNS: Array<{ key: ColumnKey; label: string; align: "left" | "right"; widthPct: number }> = [
  { key: "name", label: "Vendor", align: "left", widthPct: 22 },
  { key: "status", label: "Status", align: "left", widthPct: 14 },
  { key: "requests", label: "Requests", align: "right", widthPct: 10 },
  { key: "min", label: "Min (ms)", align: "right", widthPct: 8 },
  { key: "q1", label: "Q1 (ms)", align: "right", widthPct: 8 },
  { key: "median", label: "Median (ms)", align: "right", widthPct: 9 },
  { key: "q3", label: "Q3 (ms)", align: "right", widthPct: 8 },
  { key: "max", label: "Max (ms)", align: "right", widthPct: 8 },
  { key: "outliers", label: "Outliers", align: "right", widthPct: 7 },
  { key: "trend", label: "Trend", align: "right", widthPct: 6 },
];
// 22+14+10+8+8+9+8+8+7+6 = 100 — verified by hand so the colgroup below can never under- or over-shoot the table's own width.

const STATUS_RANK: Record<string, number> = { breach: 2, watch: 1, "on-track": 0 };

/**
 * Independent of the box plot above it: clicking or hovering a box there never touches this
 * table's rows, and this table's own sort/filter state never touches the plot. The only thing the
 * two sides share is which period is selected, the same way a date-range picker would.
 */
export function VendorTable({ period }: { period: Period }) {
  const [sortKey, setSortKey] = useState<SortKey>("median");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [category, setCategory] = useState<Category | "All">("All");

  const rows = useMemo(() => {
    const withStats = VENDORS.filter((v) => category === "All" || v.category === category).map((v) => ({ vendor: v, stat: getVendorStat(v, period) }));
    const sorted = [...withStats].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.vendor.name.localeCompare(b.vendor.name);
      else if (sortKey === "status") cmp = STATUS_RANK[a.stat.status] - STATUS_RANK[b.stat.status];
      else cmp = (a.stat[sortKey as keyof typeof a.stat] as number) - (b.stat[sortKey as keyof typeof b.stat] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [category, period, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const categoryOptions = [{ value: "All" as const, label: "All vendors" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <Card className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-0">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900">Vendor directory</h2>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">{rows.length} of {VENDORS.length} vendors · five-number summary, request volume and error rate per vendor</p>
        </div>
      </div>

      <div className="px-5 pt-3">
        <Tabs options={categoryOptions} value={category} onChange={setCategory} label="Filter vendors by category" panelId="vendor-table-body" />
      </div>

      {/* Desktop / tablet: a real table-fixed grid. Percentage colgroup widths that sum to exactly
         100 (22+14+10+8+8+9+8+8+7+6=100) so the table can never grow past its container — there is
         no `min-w` anywhere on it, because under `table-fixed` a `min-w` on a `td`/`th` has no
         layout effect at all, and the previous two attempts at this page spent a fix on that exact
         dead end. */}
      <div className="hidden min-w-0 overflow-hidden px-5 py-5 lg:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: `${c.widthPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              {COLUMNS.map((c) => {
                const sortable = c.key !== "trend";
                const ariaSort = sortable && sortKey === c.key ? (sortDir === "asc" ? "ascending" : "descending") : sortable ? "none" : undefined;
                return (
                  <th key={c.key} scope="col" aria-sort={ariaSort} className={`py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${c.align === "right" ? "text-right" : "text-left"}`}>
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key as SortKey)}
                        className={`inline-flex items-center gap-1 rounded font-medium outline-offset-2 transition-colors duration-150 ease-out hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
                          c.align === "right" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {c.label}
                        {sortKey === c.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-3 w-3 shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody id="vendor-table-body">
            {rows.map(({ vendor: v, stat }) => (
              <tr key={v.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="py-2.5 pr-2 align-top">
                  <p className="text-sm font-normal text-zinc-900">{v.name}</p>
                  <CategoryTag category={v.category} />
                </td>
                <td className="py-2.5 pr-2 align-top">
                  <StatusBadge status={stat.status} label={STATUS_LABEL[stat.status]} />
                  <p className="mt-1 text-[11px] font-normal tabular-nums text-zinc-500">{formatPct(stat.errorRate)} errors</p>
                </td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">{formatNum(stat.requests)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">{formatNum(stat.min)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">{formatNum(stat.q1)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-semibold tabular-nums text-zinc-900">{formatNum(stat.median)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">{formatNum(stat.q3)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">{formatNum(stat.max)}</td>
                <td className="py-2.5 pr-2 text-right align-top text-sm font-normal tabular-nums text-zinc-700">
                  {stat.outliers}
                  <SrOnly> outliers</SrOnly>
                </td>
                <td className="py-2.5 text-right align-top">
                  <span className="inline-flex justify-end">
                    <Sparkline points={v.sparkline} width={40} height={16} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Below `lg`, a stacked card list carries the exact same columns as labelled rows instead of
         a table — this is the page's one and only place that could have needed a second
         `overflow-x-auto`, and avoiding the table element entirely here sidesteps that rule rather
         than testing it. */}
      <div className="flex flex-col gap-3 p-5 pt-3 lg:hidden">
        {rows.map(({ vendor: v, stat }) => (
          <div key={v.id} className="min-w-0 rounded-lg border border-zinc-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-normal text-zinc-900">{v.name}</p>
                <CategoryTag category={v.category} />
              </div>
              <StatusBadge status={stat.status} label={STATUS_LABEL[stat.status]} />
            </div>
            <dl className="mt-3 grid grid-cols-5 gap-2 text-center">
              {(
                [
                  ["Min", stat.min],
                  ["Q1", stat.q1],
                  ["Med", stat.median],
                  ["Q3", stat.q3],
                  ["Max", stat.max],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
                  <dd className={`text-xs tabular-nums ${label === "Med" ? "font-semibold text-zinc-900" : "font-normal text-zinc-700"}`}>{formatNum(value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2">
              <p className="text-[11px] font-normal tabular-nums text-zinc-500">
                {formatNum(stat.requests)} req · {formatPct(stat.errorRate)} err · {stat.outliers} outliers
              </p>
              <Sparkline points={v.sparkline} width={48} height={18} />
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && <p className="px-5 pb-5 text-sm font-normal text-zinc-500">No vendors in this category for the current filter.</p>}
    </Card>
  );
}
