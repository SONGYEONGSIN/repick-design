"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import type { LeafRow, Unit } from "./data";
import { formatValue } from "./data";
import { Badge } from "./ui";

type SortKey = "path" | "reason" | "value" | "percentOfTotal" | "severity";
type SortDir = "asc" | "desc";

const SEVERITY_RANK: Record<LeafRow["severity"], number> = { High: 3, Medium: 2, Low: 1 };
const SEVERITY_TONE: Record<LeafRow["severity"], "rose" | "amber" | "sky"> = {
  High: "rose",
  Medium: "amber",
  Low: "sky",
};
const SEVERITY_OPTIONS = ["All", "High", "Medium", "Low"] as const;

const COLUMNS: { key: SortKey; label: string; width: string; align: "left" | "right" }[] = [
  { key: "path", label: "Branch", width: "26%", align: "left" },
  { key: "reason", label: "Reason", width: "26%", align: "left" },
  { key: "value", label: "Value", width: "17%", align: "right" },
  { key: "percentOfTotal", label: "% of total", width: "15%", align: "right" },
  { key: "severity", label: "Severity", width: "16%", align: "right" },
];

/** Real, independent sort + text/severity filter over the current tree's leaf
 *  rows. This is the "real table sort/filter" interaction — intentionally
 *  decoupled from both the rail (which KPI) and the tree's own expand state. */
export function LeafTable({ rows, unit }: { rows: LeafRow[]; unit: Unit }) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<(typeof SEVERITY_OPTIONS)[number]>("All");

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      if (severity !== "All" && row.severity !== severity) return false;
      if (q && !row.reason.toLowerCase().includes(q) && !row.path.toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp: number;
      switch (sortKey) {
        case "value":
          cmp = a.value - b.value;
          break;
        case "percentOfTotal":
          cmp = a.percentOfTotal - b.percentOfTotal;
          break;
        case "severity":
          cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
          break;
        case "reason":
          cmp = a.reason.localeCompare(b.reason);
          break;
        case "path":
        default:
          cmp = a.path.localeCompare(b.path);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [rows, sortKey, sortDir, query, severity]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="leaf-table-caption" className="text-sm text-zinc-600">
          Every leaf reason code, ranked by share of the total — independent of which branches are
          expanded above.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex items-center">
            <span className="sr-only">Search reasons or branches</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 size-4 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reasons…"
              className="h-9 w-44 rounded-lg border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:w-56"
            />
          </label>
          <label className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-zinc-600">Severity</span>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as (typeof SEVERITY_OPTIONS)[number])}
              className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full min-w-[640px] table-fixed text-sm" aria-describedby="leaf-table-caption">
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`px-3 py-2 font-medium text-[11px] uppercase tracking-wide text-zinc-600 ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex items-center gap-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                        col.align === "right" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {col.label}
                      <Icon aria-hidden="true" className={`size-3.5 ${active ? "text-zinc-700" : "text-zinc-500"}`} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-3 py-2">
                  <span className="block truncate text-zinc-600" title={row.path}>
                    {row.path}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="block truncate font-medium text-zinc-900" title={row.reason}>
                    {row.reason}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-zinc-900">{formatValue(row.value, unit)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-zinc-600">
                  {row.percentOfTotal.toLocaleString("en-US", { maximumFractionDigits: 1 })}%
                </td>
                <td className="px-3 py-2 text-right">
                  <Badge tone={SEVERITY_TONE[row.severity]}>{row.severity}</Badge>
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-6 text-center text-sm text-zinc-500">
                  No reason codes match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
