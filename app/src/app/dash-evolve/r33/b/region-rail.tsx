"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Minus, Search } from "lucide-react";
import { METRICS, STATUS_META, type MetricKey, type Zone, type ZoneStatus } from "./data";
import { cx, InitialsAvatar, SortIcon, StatusBadge } from "./ui";

type SortKey = "zone" | "status" | "metric";
type SortDir = "ascending" | "descending";
type StatusFilter = "all" | ZoneStatus;

const STATUS_RANK: Record<ZoneStatus, number> = { "on-track": 0, watch: 1, "at-risk": 2 };

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All zones" },
  { value: "on-track", label: "On track" },
  { value: "watch", label: "Watch" },
  { value: "at-risk", label: "At risk" },
];

function trendDelta(trend: number[]): number {
  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2] ?? last;
  return Math.round((last - prev) * 10) / 10;
}

export default function RegionRail({
  zones,
  metric,
  selectedId,
  onSelect,
}: {
  zones: Zone[];
  metric: MetricKey;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("zone");
  const [sortDir, setSortDir] = useState<SortDir>("ascending");
  const meta = METRICS[metric];

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDir("ascending");
    }
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = zones.filter((z) => {
      if (statusFilter !== "all" && z.status !== statusFilter) return false;
      if (!q) return true;
      return z.code.toLowerCase().includes(q) || z.name.toLowerCase().includes(q) || z.manager.toLowerCase().includes(q);
    });
    const dir = sortDir === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "zone") return a.code.localeCompare(b.code) * dir;
      if (sortKey === "status") return (STATUS_RANK[a.status] - STATUS_RANK[b.status]) * dir;
      return (meta.value(a) - meta.value(b)) * dir;
    });
  }, [zones, query, statusFilter, sortKey, sortDir, meta]);

  function ariaSortFor(key: SortKey) {
    if (sortKey !== key) return "none" as const;
    return sortDir;
  }

  return (
    <div className="flex flex-col">
      <div className="p-3">
        <label className="relative block">
          <span className="sr-only">Search zones</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search zones or managers…"
            className={cx(
              "h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-[12.5px] font-normal text-zinc-50 placeholder:text-zinc-400",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
            )}
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(f.value)}
                className={cx(
                  "h-7 rounded-full border px-2.5 text-[11px] font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]",
                  active
                    ? "border-[#3f9c90]/40 bg-[#3f9c90]/15 text-[#8fcdc2]"
                    : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-50"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[620px] overflow-y-auto px-1 pb-2">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">
            Delivery zones, sorted by {sortKey === "zone" ? "zone code" : sortKey === "status" ? "status" : meta.label.toLowerCase()},{" "}
            {sortDir === "ascending" ? "ascending" : "descending"}. {rows.length} of {zones.length} zones shown.
          </caption>
          <colgroup>
            <col style={{ width: "46%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "28%" }} />
          </colgroup>
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-zinc-400">
              <th scope="col" aria-sort={ariaSortFor("zone")} className="px-2 pb-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("zone")}
                  className={cx(
                    "flex h-6 items-center gap-1",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
                  )}
                >
                  Zone
                  <SortIcon direction={ariaSortFor("zone")} />
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("status")} className="px-2 pb-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  className={cx(
                    "flex h-6 items-center gap-1",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
                  )}
                >
                  Status
                  <SortIcon direction={ariaSortFor("status")} />
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("metric")} className="px-2 pb-2 text-right font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("metric")}
                  className={cx(
                    "ml-auto flex h-6 items-center gap-1",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
                  )}
                >
                  {meta.shortLabel}
                  <SortIcon direction={ariaSortFor("metric")} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((zone) => {
              const selected = zone.id === selectedId;
              const delta = trendDelta(zone.trend);
              return (
                <tr key={zone.id} className={cx("group", selected ? "bg-[#3f9c90]/10" : "hover:bg-white/5")}>
                  <td className="px-2 py-2 align-middle">
                    <button
                      type="button"
                      onClick={() => onSelect(zone.id)}
                      aria-current={selected ? "true" : undefined}
                      className={cx(
                        "flex w-full min-w-0 items-center gap-2 rounded-md text-left",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
                      )}
                    >
                      <InitialsAvatar initials={zone.initials} />
                      <span className="min-w-0 flex-1">
                        <span className={cx("block truncate text-[12.5px]", selected ? "font-semibold text-zinc-50" : "font-medium text-zinc-50")}>
                          {zone.code}
                        </span>
                        <span className="block truncate text-[11px] font-normal text-zinc-400">{zone.name}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-2 py-2 align-middle">
                    <StatusBadge status={zone.status} label={STATUS_META[zone.status].label} />
                  </td>
                  <td className="px-2 py-2 align-middle text-right">
                    <span className="block text-[12.5px] font-semibold tabular-nums text-zinc-50">{meta.format(zone)}</span>
                    {metric === "onTime" ? (
                      <span
                        className={cx(
                          "mt-0.5 flex items-center justify-end gap-0.5 text-[10.5px] font-normal tabular-nums",
                          delta === 0 ? "text-zinc-400" : delta > 0 ? "text-[#8fcdc2]" : "text-rose-300"
                        )}
                      >
                        {delta === 0 ? (
                          <Minus className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : delta > 0 ? (
                          <ArrowUp className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-2.5 w-2.5" aria-hidden="true" />
                        )}
                        {Math.abs(delta).toFixed(1)}
                        <span className="sr-only">points vs. prior week</span>
                      </span>
                    ) : (
                      <span className="mt-0.5 block text-[10.5px] font-normal text-zinc-400">
                        {metric === "incidents" ? "per week" : "SLA exposure"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-2 py-6 text-center text-[12.5px] font-normal text-zinc-400">
                  No zones match this search and filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
