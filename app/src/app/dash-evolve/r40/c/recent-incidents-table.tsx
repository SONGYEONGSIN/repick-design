"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { PriorityBadge, StateBadge } from "./badge";
import { INCIDENTS, NODE_LAYOUT, type Incident, type Priority } from "./data";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";

type Tab = "all" | "open" | "resolved";
type SortKey = "state" | "age" | "priority";
type SortDirection = "asc" | "desc";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
];

const PRIORITY_RANK: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function stateRank(incident: Incident): number {
  return NODE_LAYOUT.findIndex((n) => n.id === incident.state);
}

function SortButton({
  keyId,
  label,
  sortKey,
  sortDirection,
  onSort,
}: {
  keyId: SortKey;
  label: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const activeCol = sortKey === keyId;
  const Icon = !activeCol ? ArrowUpDown : sortDirection === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort(keyId)}
      className={`flex h-6 min-h-6 items-center gap-1 px-0.5 font-medium text-xs text-zinc-400 uppercase tracking-wide hover:text-zinc-50 ${focusRing}`}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
  );
}

export default function RecentIncidentsTable() {
  const [tab, setTab] = useState<Tab>("all");
  const [sortKey, setSortKey] = useState<SortKey>("age");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filtered = useMemo(() => {
    if (tab === "all") return INCIDENTS;
    if (tab === "resolved") return INCIDENTS.filter((i) => i.state === "resolved");
    return INCIDENTS.filter((i) => i.state !== "resolved");
  }, [tab]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "age") diff = a.ageHours - b.ageHours;
      else if (sortKey === "priority") diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      else diff = stateRank(a) - stateRank(b);
      return sortDirection === "asc" ? diff : -diff;
    });
    return copy;
  }, [filtered, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-lg text-zinc-50">Recent incidents</h2>
        <div role="group" aria-label="Filter incidents" className="flex h-9 rounded-lg border border-white/10 p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`h-8 rounded-md px-3 font-medium text-xs motion-safe:transition-colors ${focusRing} ${
                tab === t.id ? "bg-cyan-400/15 text-cyan-300" : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop/tablet table */}
      <table className="mt-4 hidden w-full table-fixed border-collapse md:table">
        <caption className="sr-only">
          Recent incidents, filterable by status and sortable by state, age and priority.
        </caption>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "11%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="py-2 text-left font-medium text-xs text-zinc-400 uppercase tracking-wide">
              ID
            </th>
            <th scope="col" className="py-2 text-left font-medium text-xs text-zinc-400 uppercase tracking-wide">
              Title
            </th>
            <th scope="col" aria-sort={ariaSortFor("state")} className="py-2 pr-2 text-left">
              <SortButton keyId="state" label="State" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
            </th>
            <th scope="col" className="py-2 text-left font-medium text-xs text-zinc-400 uppercase tracking-wide">
              Assignee
            </th>
            <th scope="col" aria-sort={ariaSortFor("age")} className="py-2 pr-3 text-right">
              <span className="flex justify-end">
                <SortButton keyId="age" label="Age" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              </span>
            </th>
            <th scope="col" aria-sort={ariaSortFor("priority")} className="py-2 pl-1 text-right">
              <span className="flex justify-end">
                <SortButton keyId="priority" label="Priority" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((incident) => (
            <tr key={incident.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
              <td className="py-2.5 whitespace-nowrap font-normal text-xs text-zinc-400 tabular-nums">
                {incident.id}
              </td>
              <td className="py-2.5 truncate font-normal text-sm text-zinc-50">{incident.title}</td>
              <td className="py-2.5">
                <StateBadge state={incident.state} label={NODE_LAYOUT.find((n) => n.id === incident.state)!.label} />
              </td>
              <td className="py-2.5 pl-3">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-[10px] text-zinc-50">
                    {incident.assigneeInitials}
                  </span>
                  <span className="min-w-0 truncate font-normal text-sm text-zinc-50">{incident.assigneeName}</span>
                </span>
              </td>
              <td className="py-2.5 whitespace-nowrap text-right font-normal text-sm text-zinc-50 tabular-nums">
                {incident.ageHours.toFixed(1)}h
              </td>
              <td className="py-2.5 text-right">
                <PriorityBadge priority={incident.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="mt-4 space-y-2 md:hidden">
        {sorted.map((incident) => (
          <li key={incident.id} className="rounded-lg border border-white/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-normal text-xs text-zinc-400 tabular-nums">{incident.id}</span>
              <PriorityBadge priority={incident.priority} />
            </div>
            <p className="mt-1 truncate font-medium text-sm text-zinc-50">{incident.title}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <StateBadge state={incident.state} label={NODE_LAYOUT.find((n) => n.id === incident.state)!.label} />
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-[10px] text-zinc-50">
                  {incident.assigneeInitials}
                </span>
                <span className="font-normal text-xs text-zinc-400 tabular-nums">{incident.ageHours.toFixed(1)}h</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
