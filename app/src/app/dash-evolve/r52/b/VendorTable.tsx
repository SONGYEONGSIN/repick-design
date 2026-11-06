"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { VENDORS, metricById, formatUsd, type Vendor, type RiskTier, type MetricId } from "./data";
import { Badge, SegmentedControl } from "./ui";

type SortKey = "spend" | "risk";
type SortDir = "asc" | "desc";
type RiskFilter = "all" | "low" | "medium" | "high";

const RISK_RANK: Record<RiskTier, number> = { low: 0, medium: 1, high: 2 };
const RISK_TONE: Record<RiskTier, "lime" | "amber" | "rose"> = { low: "lime", medium: "amber", high: "rose" };
// Abbreviated for the table's narrow Status column only.
const STATUS_LABEL: Record<Vendor["status"], string> = { active: "Active", "under-review": "Review", offboarding: "Leaving" };

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-zinc-400" aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-lime-300" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3 text-lime-300" aria-hidden="true" />
  );
}

export function VendorTable({ pinnedMetricId }: { pinnedMetricId: MetricId | null }) {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    let base = pinnedMetricId ? VENDORS.filter((v) => v.metricId === pinnedMetricId) : VENDORS;
    if (riskFilter !== "all") base = base.filter((v) => v.riskTier === riskFilter);
    const sorted = [...base].sort((a, b) => {
      const cmp = sortKey === "spend" ? a.spendThisQuarter - b.spendThisQuarter : RISK_RANK[a.riskTier] - RISK_RANK[b.riskTier];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [pinnedMetricId, riskFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-50">
          Vendors
          {pinnedMetricId ? <span className="ml-2 font-normal text-zinc-400">· {metricById(pinnedMetricId).label}</span> : null}
        </h2>
        <SegmentedControl
          label="Filter by risk tier"
          value={riskFilter}
          onChange={setRiskFilter}
          options={[
            { value: "all", label: "All" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
        />
      </div>

      <div className="max-h-96 overflow-y-auto overflow-x-hidden rounded-lg border border-white/10">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Vendors{pinnedMetricId ? ` tagged to ${metricById(pinnedMetricId).label}` : ""}, filtered to{" "}
            {riskFilter} risk, sorted by {sortKey} {sortDir === "asc" ? "ascending" : "descending"}
          </caption>
          <colgroup>
            <col style={{ width: "24%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead className="sticky top-0 bg-zinc-900 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
            <tr>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Vendor
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Category
              </th>
              <th scope="col" aria-sort={sortKey === "spend" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-right font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("spend")}
                  className="ml-auto flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                >
                  Spend
                  <SortIcon active={sortKey === "spend"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" aria-sort={sortKey === "risk" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("risk")}
                  className="flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
                >
                  Risk
                  <SortIcon active={sortKey === "risk"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Status
              </th>
              <th scope="col" className="overflow-hidden px-3 py-2 text-right font-medium">
                Ends
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-zinc-400">
                  No vendors match this filter.
                </td>
              </tr>
            ) : (
              rows.map((v: Vendor) => (
                <tr key={v.id} className="hover:bg-white/5">
                  <td className="truncate px-3 py-2.5 font-medium text-zinc-50">{v.name}</td>
                  <td className="truncate px-3 py-2.5 text-zinc-400">{metricById(v.metricId).label}</td>
                  <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-200">{formatUsd(v.spendThisQuarter)}</td>
                  <td className="overflow-hidden px-2 py-2.5">
                    <Badge tone={RISK_TONE[v.riskTier]}>{v.riskTier}</Badge>
                  </td>
                  <td className="overflow-hidden px-2 py-2.5">
                    <Badge tone="neutral">{STATUS_LABEL[v.status]}</Badge>
                  </td>
                  <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-400">{v.contractEndIso}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
