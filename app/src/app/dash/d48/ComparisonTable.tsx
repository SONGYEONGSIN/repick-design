"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { SERVICE_META, type Region, type ServiceId } from "./data";
import { BORDER, DIVIDE, FOCUS_VISIBLE_INSET, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, SegmentedControl, StatusBadge } from "./ui";

type SortKey = "service" | "aLatency" | "bLatency" | "delta";
type SortDir = "asc" | "desc";
type FilterId = "all" | "flagged" | "operational";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "flagged", label: "Flagged" },
  { id: "operational", label: "Fully operational" },
];

const COLUMNS: { key: SortKey | null; label: string; width: string }[] = [
  { key: "service", label: "Service", width: "28%" },
  { key: null, label: "A status", width: "15%" },
  { key: "aLatency", label: "A latency", width: "14%" },
  { key: null, label: "B status", width: "15%" },
  { key: "bLatency", label: "B latency", width: "14%" },
  { key: "delta", label: "Δ (A − B)", width: "14%" },
];

export default function ComparisonTable({ regionA, regionB }: { regionA: Region; regionB: Region }) {
  const [sortKey, setSortKey] = useState<SortKey>("delta");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<FilterId>("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const allRows = useMemo(() => {
    return SERVICE_META.map((meta) => {
      const a = regionA.services.find((s) => s.id === meta.id)!;
      const b = regionB.services.find((s) => s.id === meta.id)!;
      return { id: meta.id as ServiceId, label: meta.label, Icon: meta.Icon, a, b, delta: a.latencyMs - b.latencyMs };
    });
  }, [regionA, regionB]);

  const rows = useMemo(() => {
    const filtered = allRows.filter((r) => {
      if (filter === "all") return true;
      const flagged = r.a.status !== "operational" || r.b.status !== "operational";
      return filter === "flagged" ? flagged : !flagged;
    });
    const sorted = [...filtered].sort((r1, r2) => {
      let cmp = 0;
      if (sortKey === "service") cmp = r1.label.localeCompare(r2.label);
      else if (sortKey === "aLatency") cmp = r1.a.latencyMs - r2.a.latencyMs;
      else if (sortKey === "bLatency") cmp = r1.b.latencyMs - r2.b.latencyMs;
      else cmp = r1.delta - r2.delta;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [allRows, filter, sortKey, sortDir]);

  return (
    <Card id="comparison-table-card" className="mt-4">
      <CardHeader
        title="Service-level comparison"
        description={`${rows.length} of ${allRows.length} services shown — every row compares the same service across both regions`}
        action={<SegmentedControl options={FILTERS} value={filter} onChange={setFilter} ariaLabel="Filter services by status" />}
      />

      <div className={cx("relative mt-3 overflow-x-auto rounded-lg border", BORDER)}>
        <table className="relative w-full min-w-[640px] text-left text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            Per-service latency and status for {regionA.name} (Region A) versus {regionB.name} (Region B), with the latency delta. Sortable by clicking a column header.
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, "bg-zinc-50")}>
              {COLUMNS.map((col) => {
                if (!col.key) {
                  return (
                    <th key={col.label} scope="col" className={cx("px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>
                      {col.label}
                    </th>
                  );
                }
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.label} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx("flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED, "hover:text-zinc-900", TRANSITION, FOCUS_VISIBLE_INSET)}
                    >
                      {col.label}
                      <Icon size={11} aria-hidden="true" className={active ? "text-teal-700" : undefined} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.map((r) => (
              <tr key={r.id} className={HOVER_ROW}>
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <r.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{r.label}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <StatusBadge status={r.a.status} />
                </td>
                <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm", NUM, TEXT_PRIMARY)}>{r.a.latencyMs} ms</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <StatusBadge status={r.b.status} />
                </td>
                <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm", NUM, TEXT_PRIMARY)}>{r.b.latencyMs} ms</td>
                <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm font-medium", NUM, r.delta === 0 ? TEXT_CAPTION : r.delta > 0 ? "text-rose-700" : "text-emerald-700")}>
                  <span className="inline-flex items-center gap-1">
                    {r.delta === 0 ? null : r.delta > 0 ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
                    {r.delta > 0 ? "+" : ""}
                    {r.delta} ms
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
