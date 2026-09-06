"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ROUTES, ZONES } from "./data";
import { BORDER, FOCUS, NUM, STATUS_BADGE, STATUS_ICON, STATUS_LABEL, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type RouteStatus, cx } from "./tokens";
import { CardHead, Dropdown, Tabs } from "./ui";

type SortKey = "id" | "items" | "weightKg" | "status" | "eta";
type SortDir = "asc" | "desc";
type StatusFilter = RouteStatus | "all";

const STATUS_TAB_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "on-time", label: "On-time" },
  { id: "at-risk", label: "At risk" },
  { id: "delayed", label: "Delayed" },
  { id: "completed", label: "Completed" },
];

const ZONE_FILTER_OPTIONS: { id: string; label: string }[] = [{ id: "all", label: "All zones" }, ...ZONES.map((z) => ({ id: z.id, label: z.name }))];

const STATUS_RANK: Record<RouteStatus, number> = { delayed: 0, "at-risk": 1, "on-time": 2, completed: 3 };

const COLUMNS: { key: SortKey | null; label: string; align: "left" | "right" | "center" }[] = [
  { key: "id", label: "Route", align: "left" },
  { key: null, label: "Driver", align: "left" },
  { key: null, label: "Stops", align: "left" },
  { key: "items", label: "Items", align: "right" },
  { key: "weightKg", label: "Weight", align: "right" },
  { key: "status", label: "Status", align: "left" },
  { key: "eta", label: "ETA", align: "right" },
  { key: null, label: "7-day trend", align: "left" },
];

export default function ManifestTable() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("eta");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    let list = ROUTES.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (zoneFilter !== "all" && r.zoneId !== zoneFilter) return false;
      if (q === "") return true;
      const zoneName = ZONES.find((z) => z.id === r.zoneId)?.name ?? "";
      return r.id.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || zoneName.toLowerCase().includes(q);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "items") cmp = a.items - b.items;
      else if (sortKey === "weightKg") cmp = a.weightKg - b.weightKg;
      else if (sortKey === "status") cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      else cmp = a.etaLabel.localeCompare(b.etaLabel);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [q, statusFilter, zoneFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div>
      <CardHead title="Today's manifest" hint={`Every route today, completed ones included · showing ${rows.length} of ${ROUTES.length}`} />

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <div className={cx("flex h-9 min-w-[180px] max-w-xs flex-1 items-center gap-2 rounded-lg border px-2.5", BORDER, SURFACE_INSET)}>
          <Search size={14} aria-hidden="true" className={TEXT_AUX} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by route, driver, zone"
            aria-label="Filter manifest by route, driver, or zone"
            className={cx("h-full min-w-0 flex-1 bg-transparent text-xs font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
        </div>
        <Dropdown label="Zone" options={ZONE_FILTER_OPTIONS} value={zoneFilter} onChange={setZoneFilter} ariaLabel="Filter by zone" />
      </div>

      <div className="mt-3">
        <Tabs options={STATUS_TAB_OPTIONS} value={statusFilter} onChange={setStatusFilter} ariaLabel="Filter by status" />
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 [scrollbar-width:thin]">
        <table className="w-full min-w-[960px] table-fixed border-collapse text-sm">
          <caption className="sr-only relative">
            Today&rsquo;s pickup manifest across all zones, sortable and filterable, {rows.length} of {ROUTES.length} routes shown
          </caption>
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((col) => {
                if (!col.key) {
                  return (
                    <th key={col.label} scope="col" className={cx("px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED, col.align === "right" ? "text-right" : "text-left")}>
                      {col.label}
                    </th>
                  );
                }
                const active = sortKey === col.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.label} scope="col" aria-sort={ariaSort as "ascending" | "descending" | "none"} className="px-3 py-2 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx(
                        "flex w-full items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em]",
                        col.align === "right" ? "justify-end" : "justify-start",
                        active ? "text-zinc-100" : TEXT_MUTED,
                        "hover:text-zinc-200",
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      {col.align === "right" ? <Icon size={11} aria-hidden="true" /> : null}
                      {col.label}
                      {col.align !== "right" ? <Icon size={11} aria-hidden="true" /> : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((route) => {
              const zone = ZONES.find((z) => z.id === route.zoneId)!;
              const StatusIcon = STATUS_ICON[route.status];
              return (
                <tr key={route.id} className={cx("hover:bg-white/[0.04]", TRANSITION)}>
                  <td className="px-3 py-2.5">
                    <span className={cx("block text-sm font-semibold", TEXT_PRIMARY)}>{route.id}</span>
                    <span className={cx("block text-[11px] font-normal", TEXT_AUX)}>{zone.name}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Image
                        src={`https://images.unsplash.com/photo-${route.avatarId}?w=56&h=56&fit=crop&crop=faces`}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 shrink-0 rounded-full bg-zinc-800 object-cover"
                      />
                      <span className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{route.driver}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-blue-400" style={{ width: `${Math.round((route.stopsDone / route.stopsTotal) * 100)}%` }} />
                      </div>
                      <span className={cx(NUM, "whitespace-nowrap text-xs font-normal", TEXT_AUX)}>
                        {route.stopsDone}/{route.stopsTotal}
                      </span>
                    </div>
                  </td>
                  <td className={cx(NUM, "px-3 py-2.5 text-right text-sm font-medium", TEXT_PRIMARY)}>{route.items}</td>
                  <td className={cx(NUM, "whitespace-nowrap px-3 py-2.5 text-right text-sm font-medium", TEXT_PRIMARY)}>{route.weightKg} kg</td>
                  <td className="px-3 py-2.5">
                    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", STATUS_BADGE[route.status])}>
                      <StatusIcon size={11} aria-hidden="true" />
                      {STATUS_LABEL[route.status]}
                    </span>
                  </td>
                  <td className={cx(NUM, "whitespace-nowrap px-3 py-2.5 text-right text-xs font-normal", TEXT_AUX)}>{route.etaLabel}</td>
                  <td className="px-3 py-2.5">
                    <MiniTrend values={route.trend7d} />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={cx("px-3 py-8 text-center text-sm font-normal", TEXT_AUX)}>
                  No routes match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniTrend({ values }: { values: number[] }) {
  const w = 64;
  const h = 20;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = Math.round((i / (values.length - 1)) * w * 100) / 100;
      const y = Math.round((h - ((v - min) / span) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <polyline points={pts} fill="none" className="stroke-blue-400" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
