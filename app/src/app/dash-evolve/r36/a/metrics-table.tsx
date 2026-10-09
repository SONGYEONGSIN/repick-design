"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { OKR_ITEMS, achievementPercent, statusForAchievement, type GoalStatus, type Period } from "./data";
import { formatByUnit, formatAchievement } from "./format";
import { Card, StatusPill, InitialsAvatar, SegmentedControl } from "./ui";

type SortKey = "team" | "current" | "target" | "achievement";
type SortDirection = "asc" | "desc";

const FILTERS = ["all", "on-track", "at-risk", "behind"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABEL: Record<Filter, string> = {
  all: "All",
  "on-track": "On track",
  "at-risk": "At risk",
  behind: "Behind",
};

interface Row {
  id: string;
  team: string;
  metric: string;
  owner: string;
  ownerInitials: string;
  current: number;
  target: number;
  currentLabel: string;
  targetLabel: string;
  achievement: number;
  status: GoalStatus;
}

/**
 * Independent secondary widget, deliberately NOT wired to the bullet grid's
 * selection state. It only ever reads `period` (the page-level quarter
 * toggle) — never `selectedId` — so expanding a bullet's accordion above
 * has zero effect on this table's rows, sort, or filter. This narrow,
 * explicit state fan-out is intentional: the strongest pattern for this
 * macro skeleton is no detail component fanning out from a selection at
 * all, and this table's independence is how that holds for the page's one
 * other widget.
 */
export function MetricsTable({ period }: { period: Period }) {
  const [sortKey, setSortKey] = useState<SortKey>("achievement");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo<Row[]>(() => {
    return OKR_ITEMS.map((item) => {
      const figures = item.figures[period];
      const achievement = achievementPercent(figures);
      return {
        id: item.id,
        team: item.team,
        metric: item.metric,
        owner: item.owner,
        ownerInitials: item.ownerInitials,
        current: figures.current,
        target: figures.target,
        currentLabel: formatByUnit(figures.current, item.unit, item.countSuffix),
        targetLabel: formatByUnit(figures.target, item.unit, item.countSuffix),
        achievement,
        status: statusForAchievement(achievement),
      };
    });
  }, [period]);

  const filteredRows = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [rows, filter],
  );

  const sortedRows = useMemo(() => {
    const sign = sortDirection === "asc" ? 1 : -1;
    return [...filteredRows].sort((a, b) => {
      if (sortKey === "team") return a.team.localeCompare(b.team) * sign;
      return (a[sortKey] - b[sortKey]) * sign;
    });
  }, [filteredRows, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  }

  return (
    <Card padded={false} className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 p-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900">All goals</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Sortable, filterable detail list — independent of the bullet grid above.
          </p>
        </div>
        <SegmentedControl
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          getLabel={(f) => FILTER_LABEL[f]}
          ariaLabel="Filter goals by status"
        />
      </div>

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only relative">
            All goals for {period === "q3" ? "this quarter" : "last quarter"}, sortable by column and filterable by
            status.
          </caption>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <SortableHeader label="Team / metric" sortKey="team" active={sortKey} onSort={handleSort} ariaSort={ariaSortFor("team")} align="left" />
              <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                Owner
              </th>
              <SortableHeader label="Current" sortKey="current" active={sortKey} onSort={handleSort} ariaSort={ariaSortFor("current")} align="right" />
              <SortableHeader label="Target" sortKey="target" active={sortKey} onSort={handleSort} ariaSort={ariaSortFor("target")} align="right" />
              <SortableHeader label="Achvmt." sortKey="achievement" active={sortKey} onSort={handleSort} ariaSort={ariaSortFor("achievement")} align="right" />
              <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 1 ? "bg-zinc-50/60" : undefined}>
                <th
                  scope="row"
                  className="truncate px-4 py-2.5 text-left align-middle text-sm font-medium text-zinc-900"
                >
                  <span className="block truncate">{row.team}</span>
                  <span className="block truncate text-xs font-normal text-zinc-500">{row.metric}</span>
                </th>
                <td className="px-4 py-2.5 align-middle">
                  <span className="flex min-w-0 items-center gap-2">
                    <InitialsAvatar initials={row.ownerInitials} className="h-6 w-6 text-[10px]" />
                    <span className="truncate text-xs text-zinc-600">{row.owner}</span>
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right align-middle tabular-nums text-zinc-900">{row.currentLabel}</td>
                <td className="px-4 py-2.5 text-right align-middle tabular-nums text-zinc-600">{row.targetLabel}</td>
                <td className="px-4 py-2.5 text-right align-middle tabular-nums font-medium text-zinc-900">
                  {formatAchievement(row.achievement)}
                </td>
                <td className="px-4 py-2.5 align-middle">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
            {sortedRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No goals match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function SortableHeader({
  label,
  sortKey,
  active,
  ariaSort,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  ariaSort: "ascending" | "descending" | "none";
  onSort: (key: SortKey) => void;
  align: "left" | "right";
}) {
  const isActive = active === sortKey;
  const Icon = !isActive ? ArrowUpDown : ariaSort === "ascending" ? ArrowUp : ArrowDown;
  return (
    <th scope="col" aria-sort={ariaSort} className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex w-full items-center gap-1 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-violet-700 ${
          align === "right" ? "justify-end" : "justify-start"
        } ${isActive ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"}`}
      >
        {align === "right" && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
        <span>{label}</span>
        {align === "left" && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      </button>
    </th>
  );
}
