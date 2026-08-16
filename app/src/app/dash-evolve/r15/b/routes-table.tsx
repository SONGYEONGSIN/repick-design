"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CORRIDOR_LABEL, HUBS, STATUS_LABEL, fmtVolume, onTimeForPeriod, statusForOnTime } from "./data";
import type { Hub, PeriodId, Status } from "./types";
import { BORDER, DIVIDE, FOCUS_VISIBLE_INSET, FOCUS_WITHIN, HOVER_ROW, NUM, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge, SegmentedControl } from "./ui";

type SortKey = "name" | "corridor" | "status" | "onTime" | "volume" | "transit";
type StatusFilter = "all" | Status;

const COLUMNS: { key: SortKey; label: string; widthPct: number }[] = [
  { key: "name", label: "Hub", widthPct: 26 },
  { key: "corridor", label: "Corridor", widthPct: 16 },
  { key: "status", label: "Status", widthPct: 14 },
  { key: "onTime", label: "On time", widthPct: 14 },
  { key: "volume", label: "Volume/day", widthPct: 16 },
  { key: "transit", label: "Avg transit", widthPct: 14 },
];

/** The Geographic chart family's mandatory fallback (charts.catalog: "지역 텍스트 라벨, 정렬 가능한
 *  테이블") for the network map above — a real, sortable, keyboard-navigable table naming every hub
 *  in text, never relying on the map's spatial layout alone. */
export default function RoutesTable({ period, selectedHubId, onSelectHub }: { period: PeriodId; selectedHubId: string; onSelectHub: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("onTime");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const enriched = HUBS.map((h) => {
      const onTime = onTimeForPeriod(h, period);
      return { hub: h, onTime, status: statusForOnTime(onTime) };
    });
    const filtered = enriched.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q === "") return true;
      return r.hub.name.toLowerCase().includes(q) || r.hub.code.toLowerCase().includes(q) || CORRIDOR_LABEL[r.hub.corridor].toLowerCase().includes(q);
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return dir * a.hub.name.localeCompare(b.hub.name);
        case "corridor":
          return dir * CORRIDOR_LABEL[a.hub.corridor].localeCompare(CORRIDOR_LABEL[b.hub.corridor]);
        case "status":
          return dir * a.status.localeCompare(b.status);
        case "onTime":
          return dir * (a.onTime - b.onTime);
        case "volume":
          return dir * (a.hub.volume - b.hub.volume);
        case "transit":
          return dir * (a.hub.transitHours - b.hub.transitHours);
        default:
          return 0;
      }
    });
  }, [period, statusFilter, query, sortKey, sortDir]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className={cx("flex h-9 items-center gap-2 rounded-lg border px-2.5 sm:w-64", BORDER, "bg-white/[0.03]", FOCUS_WITHIN)}>
          <Search size={14} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by hub, code, corridor"
            aria-label="Filter routes table"
            className={cx("h-full flex-1 bg-transparent text-xs outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
        </div>
        <SegmentedControl
          ariaLabel="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { id: "all", label: "All" },
            { id: "on-track", label: "On track" },
            { id: "at-risk", label: "At risk" },
            { id: "delayed", label: "Delayed" },
          ]}
        />
      </div>

      <div className="overflow-x-auto [scrollbar-width:thin] lg:overflow-visible">
        <table className="w-full min-w-[720px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">Regions and routes: all hubs with corridor, status, on-time rate, daily volume, and average transit time — sortable by any column.</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: `${c.widthPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                const alignEnd = col.key === "onTime" || col.key === "volume" || col.key === "transit";
                return (
                  <th key={col.key} scope="col" aria-sort={ariaSort} className="py-2 pr-2 first:pl-0">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wider",
                        alignEnd && "ml-auto",
                        TEXT_CAPTION,
                        TRANSITION,
                        FOCUS_VISIBLE_INSET,
                        active && "text-zinc-100",
                      )}
                    >
                      {col.label}
                      <Icon size={12} aria-hidden="true" className={active ? "text-cyan-400" : "text-zinc-400"} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.map(({ hub, onTime, status }) => (
              <TableRow key={hub.id} hub={hub} onTime={onTime} status={status} selected={hub.id === selectedHubId} onSelect={() => onSelectHub(hub.id)} />
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>No hubs match this filter.</p> : null}
      </div>
    </div>
  );
}

function TableRow({ hub, onTime, status, selected, onSelect }: { hub: Hub; onTime: number; status: Status; selected: boolean; onSelect: () => void }) {
  const tone = TONE[STATUS_TONE[status]];
  return (
    <tr className={cx(HOVER_ROW, TRANSITION, selected && "bg-cyan-500/[0.07]")}>
      <td className="py-2 pr-2">
        <button type="button" onClick={onSelect} className={cx("flex min-h-9 w-full items-center rounded text-left", FOCUS_VISIBLE_INSET, TRANSITION)}>
          <span className="min-w-0">
            <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{hub.name}</span>
            <span className={cx("block truncate text-[11px]", NUM, TEXT_CAPTION)}>{hub.code}</span>
          </span>
        </button>
      </td>
      <td className={cx("whitespace-nowrap py-2 pr-2 text-sm", TEXT_CAPTION)}>{CORRIDOR_LABEL[hub.corridor]}</td>
      <td className="whitespace-nowrap py-2 pr-2">
        <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>
      </td>
      <td className={cx("whitespace-nowrap py-2 pr-2 text-right text-sm font-medium", NUM, TEXT_PRIMARY)}>{onTime.toFixed(1)}%</td>
      <td className={cx("whitespace-nowrap py-2 pr-2 text-right text-sm", NUM, TEXT_CAPTION)}>{fmtVolume(hub.volume)}</td>
      <td className={cx("whitespace-nowrap py-2 pr-0 text-right text-sm", NUM, TEXT_CAPTION)}>{hub.transitHours.toFixed(1)} hrs</td>
    </tr>
  );
}
