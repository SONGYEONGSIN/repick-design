"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown, Search, UserMinus, UserPlus } from "lucide-react";
import {
  DEPARTMENTS,
  GROUPS,
  MONTH_LABELS,
  NOW_IDX,
  headcountAt,
  levelBreakdown,
  recentActivity,
  type DeptId,
  type Group,
} from "../lib/data";
import { Card, CardHeader, FOCUS_RING, SingleSelectChips } from "./ui";

export type GroupFilter = "all" | Group;

export function BulletGrid({ groupFilter, onGroupFilterChange }: { groupFilter: GroupFilter; onGroupFilterChange: (g: GroupFilter) => void }) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<DeptId | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEPARTMENTS.filter((d) => (groupFilter === "all" || d.group === groupFilter) && (q === "" || d.name.toLowerCase().includes(q))).map((d) => {
      const current = headcountAt(NOW_IDX, d.id);
      const target = d.target;
      const ratioPct = target > 0 ? (current / target) * 100 : 0;
      const rowMax = Math.max(1, Math.ceil(Math.max(current, target) * 1.2));
      return { dept: d, current, target, ratioPct, rowMax };
    });
  }, [query, groupFilter]);

  return (
    <Card>
      <CardHeader title="Headcount by department" subtitle="Current headcount vs. hiring target — as of today, independent of the period toggle above" />

      <div className="flex min-w-0 flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <label className="relative flex h-9 min-w-0 max-w-xs flex-1 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 px-2.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          <span className="sr-only">Search departments</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departments…"
            className={`h-full min-w-0 flex-1 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-400 ${FOCUS_RING} rounded`}
          />
        </label>
        <SingleSelectChips
          ariaLabel="Filter by department group"
          value={groupFilter}
          onChange={onGroupFilterChange}
          options={[{ value: "all" as GroupFilter, label: "All groups" }, ...GROUPS.map((g) => ({ value: g as GroupFilter, label: g }))]}
        />
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-zinc-400 sm:px-5">No departments match this search and group filter.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {rows.map((row) => (
            <BulletRow key={row.dept.id} row={row} expanded={expandedId === row.dept.id} onToggle={() => setExpandedId((id) => (id === row.dept.id ? null : row.dept.id))} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function BulletRow({
  row,
  expanded,
  onToggle,
}: {
  row: { dept: { id: DeptId; name: string; group: Group }; current: number; target: number; ratioPct: number; rowMax: number };
  expanded: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const over = row.ratioPct > 100;
  const ratioX = row.target > 0 ? row.current / row.target : 0;
  const ratioLabel = over
    ? `${ratioX.toFixed(2)}× target (+${Math.round(row.ratioPct - 100)}% over)`
    : `${Math.round(row.ratioPct)}% of target`;

  const basePct = Math.min(row.current, row.target) / row.rowMax * 100;
  const overflowPct = Math.max(0, row.current - row.target) / row.rowMax * 100;
  const tickPct = Math.min(100, (row.target / row.rowMax) * 100);

  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={`flex w-full min-w-0 flex-col gap-2 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-white/5 motion-reduce:transition-none sm:px-5 ${FOCUS_RING}`}
      >
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:flex-1">
            <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-150 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">{row.dept.name}</p>
              <p className="truncate text-[11px] text-zinc-400">{row.dept.group}</p>
            </div>
          </div>
          <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 pl-7 sm:flex-col sm:items-end sm:justify-center sm:gap-0 sm:pl-0">
            <p className="whitespace-nowrap text-sm tabular-nums text-zinc-100">
              {row.current} <span className="text-zinc-400">/ {row.target} target</span>
            </p>
            <p className={`whitespace-nowrap text-[11px] font-medium tabular-nums ${over ? "text-amber-300" : "text-zinc-400"}`}>{ratioLabel}</p>
          </div>
        </div>

        <div className="relative h-2.5 w-full min-w-0 overflow-hidden rounded-full bg-white/5" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 rounded-full bg-lime-400" style={{ width: `${basePct}%` }} />
          {overflowPct > 0 ? (
            <div
              className="absolute inset-y-0 rounded-r-full bg-amber-400/80"
              style={{
                left: `${basePct}%`,
                width: `${overflowPct}%`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(9,9,11,0.45) 0px, rgba(9,9,11,0.45) 3px, transparent 3px, transparent 6px)",
              }}
            />
          ) : null}
          <div className="absolute inset-y-0 w-px bg-white/50" style={{ left: `${tickPct}%` }} />
        </div>
      </button>

      {expanded ? (
        <div id={panelId} className="min-w-0 border-t border-white/10 bg-zinc-950/60 px-4 py-4 sm:px-5">
          <DeptInspector deptId={row.dept.id} onCollapse={onToggle} />
        </div>
      ) : null}
    </li>
  );
}

function DeptInspector({ deptId, onCollapse }: { deptId: DeptId; onCollapse: () => void }) {
  const levels = levelBreakdown(deptId);
  const activity = recentActivity(deptId);

  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Roles by level</p>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
        {levels.map((l) => (
          <div key={l.level} className="min-w-0">
            <dt className="truncate text-[11px] text-zinc-400">{l.level}</dt>
            <dd className="text-sm font-medium tabular-nums text-zinc-100">{l.count}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Recent activity</p>
      {activity.length === 0 ? (
        <p className="mt-2 text-xs text-zinc-400">No hires or departures recorded in this window.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {activity.map((a, i) => (
            <li key={i} className="flex min-w-0 items-center gap-2 text-xs text-zinc-400">
              {a.kind === "hire" ? (
                <UserPlus className="h-3.5 w-3.5 shrink-0 text-lime-300" aria-hidden="true" />
              ) : (
                <UserMinus className="h-3.5 w-3.5 shrink-0 text-rose-300" aria-hidden="true" />
              )}
              <span className="truncate text-zinc-300">
                {a.level} · {a.kind === "hire" ? "Joined" : "Departed"} {MONTH_LABELS[a.monthIdx]}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onCollapse}
        className={`mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
      >
        Collapse
      </button>
    </div>
  );
}
