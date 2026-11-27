"use client";

import { useId, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, AlertTriangle, Clock, CircleDot, CircleCheckBig } from "lucide-react";
import {
  ZONE_LABEL,
  getDoorById,
  getDoorBookings,
  getDoorStats,
  getStatus,
  computeConflictIds,
  formatRangeCompact,
  formatDuration,
  pctFmt,
  STATUS_LABEL,
  type Period,
} from "./data";
import { Card, SectionLabel, Badge, FOCUS_RING, NUM } from "./ui";

type SortKey = "time" | "carrier";
type SortDir = "asc" | "desc";
type Tab = "upcoming" | "all";

const STATUS_ICON = { scheduled: Clock, loading: CircleDot, completed: CircleCheckBig } as const;

export function DetailPanel({ period, pinnedDoorId }: { period: Period; pinnedDoorId: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [tab, setTab] = useState<Tab>("upcoming");

  const tablistId = useId();
  const upcomingTabId = `${tablistId}-tab-upcoming`;
  const allTabId = `${tablistId}-tab-all`;
  const panelId = `${tablistId}-panel`;

  const door = getDoorById(pinnedDoorId);
  const stats = getDoorStats(period, pinnedDoorId);
  const conflictIds = useMemo(() => computeConflictIds(period), [period]);
  const bookings = useMemo(() => getDoorBookings(period, pinnedDoorId), [period, pinnedDoorId]);

  const visibleBookings = useMemo(() => {
    const base = tab === "upcoming" ? bookings.filter((bk) => getStatus(bk, period) !== "completed") : bookings;
    const sorted = [...base].sort((a, b) => {
      const cmp = sortKey === "time" ? a.start - b.start : a.carrier.localeCompare(b.carrier);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [bookings, tab, sortKey, sortDir, period]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  if (!door) return null;

  return (
    <Card>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <SectionLabel>Door detail</SectionLabel>
          <h2 className="mt-1 truncate text-lg font-semibold text-zinc-50">{door.code}</h2>
          <p className="mt-0.5 truncate text-sm text-zinc-400">{ZONE_LABEL[door.zone]}</p>
        </div>
        <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-base font-semibold text-zinc-50 ${NUM}`}>{pctFmt.format(stats.utilization)}</span>
            <span className="text-[11px] uppercase tracking-wide text-zinc-400">Booked</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-base font-semibold text-zinc-50 ${NUM}`}>{formatDuration(stats.bookedMinutes)}</span>
            <span className="text-[11px] uppercase tracking-wide text-zinc-400">Dwell time</span>
          </div>
          <p className="whitespace-nowrap text-sm text-zinc-300">
            {stats.nextOpeningLabel ? (
              <>
                Open from <span className={NUM}>{stats.nextOpeningLabel}</span>
              </>
            ) : (
              "Booked through close"
            )}
          </p>
        </div>
      </div>

      {/* Tabs — hand-set, matching id/aria-controls/aria-labelledby pairs. */}
      <div role="tablist" aria-label="Booking list filter" className="mt-4 inline-flex h-9 min-w-0 items-center rounded-lg border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          role="tab"
          id={upcomingTabId}
          aria-selected={tab === "upcoming"}
          aria-controls={panelId}
          onClick={() => setTab("upcoming")}
          className={`h-7 min-w-0 shrink-0 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            tab === "upcoming" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          role="tab"
          id={allTabId}
          aria-selected={tab === "all"}
          aria-controls={panelId}
          onClick={() => setTab("all")}
          className={`h-7 min-w-0 shrink-0 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            tab === "all" ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"
          }`}
        >
          All bookings
        </button>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tab === "upcoming" ? upcomingTabId : allTabId} className="mt-3 min-w-0">
        {/* Fluid table-fixed + colgroup%, no overflow-x-auto needed anywhere on this card — the
            compact "6:00a" time form and the merged trailer/load line keep every column readable
            even on the narrowest phone width without truncating a date value or letting one
            column's content paint over the next. */}
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only relative">
            {tab === "upcoming" ? "Upcoming" : "All"} bookings for {door.code}, {ZONE_LABEL[door.zone]}
          </caption>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "42%" }} />
            <col style={{ width: "28%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wide text-zinc-400">
              <th scope="col" aria-sort={ariaSortFor("time")} className="py-2 pr-2 font-medium">
                <button type="button" onClick={() => toggleSort("time")} className={`flex items-center gap-1 rounded ${FOCUS_RING}`}>
                  Time
                  <SortIcon active={sortKey === "time"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("carrier")} className="py-2 pr-2 font-medium">
                <button type="button" onClick={() => toggleSort("carrier")} className={`flex items-center gap-1 rounded ${FOCUS_RING}`}>
                  Carrier
                  <SortIcon active={sortKey === "carrier"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="py-2 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visibleBookings.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-zinc-400">
                  No {tab === "upcoming" ? "upcoming" : ""} bookings on this door.
                </td>
              </tr>
            ) : (
              visibleBookings.map((bk) => {
                const status = getStatus(bk, period);
                const Icon = STATUS_ICON[status];
                const isConflict = conflictIds.has(bk.id);
                return (
                  <tr key={bk.id} className="transition-colors hover:bg-white/[0.03] motion-reduce:transition-none">
                    <td className={`overflow-hidden py-2.5 pr-2 align-top whitespace-nowrap text-zinc-200 ${NUM}`}>{formatRangeCompact(bk.start, bk.end)}</td>
                    <td className="py-2.5 pr-2 align-top">
                      <span className="flex min-w-0 items-center gap-1.5">
                        {isConflict && <AlertTriangle className="h-3 w-3 shrink-0 text-rose-400" aria-hidden="true" />}
                        <span className="min-w-0 truncate text-zinc-50">{bk.carrier}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-zinc-400">
                        <span className={NUM}>{bk.trailer}</span> · {bk.load}
                      </span>
                      {isConflict ? <span className="mt-0.5 block text-[11px] text-rose-300">Scheduling conflict</span> : null}
                    </td>
                    <td className="py-2.5 align-top">
                      <Badge tone={status === "loading" ? "accent" : "neutral"} icon={Icon}>
                        {STATUS_LABEL[status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden="true" />
  );
}
