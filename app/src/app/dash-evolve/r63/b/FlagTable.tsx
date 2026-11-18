"use client";

import { useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { FLAGS, type Flag, type FlagStatus } from "./data";
import { Card, FOCUS_RING, InitialsAvatar, NUM, Progress, SectionLabel, SegmentedControl, StatusBadge } from "./ui";

type SortKey = "name" | "status" | "rolloutPct" | "owner";

function sortFlags(rows: Flag[], key: SortKey, dir: 1 | -1): Flag[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    let cmp: number;
    if (key === "rolloutPct") cmp = a.rolloutPct - b.rolloutPct;
    else if (key === "owner") cmp = a.owner.name.localeCompare(b.owner.name);
    else if (key === "status") cmp = a.status.localeCompare(b.status);
    else cmp = a.name.localeCompare(b.name);
    return cmp * dir;
  });
  return copy;
}

function HeaderButton({
  k,
  align = "left",
  onToggle,
  children,
}: {
  k: SortKey;
  align?: "left" | "right";
  onToggle: (k: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(k)}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING} ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {children}
      <ArrowUpDown className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
  );
}

export function FlagTable({
  statusFilter,
  onStatusFilterChange,
  selectedId,
  onSelect,
}: {
  statusFilter: FlagStatus | "all";
  onStatusFilterChange: (status: FlagStatus | "all") => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("rolloutPct");
  const [dir, setDir] = useState<1 | -1>(-1);
  const [query, setQuery] = useState("");

  function toggleSort(key: SortKey) {
    if (key === sortKey) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setDir(-1);
    }
  }

  function ariaSortFor(key: SortKey) {
    if (key !== sortKey) return "none" as const;
    return dir === 1 ? ("ascending" as const) : ("descending" as const);
  }

  const byStatus = statusFilter === "all" ? FLAGS : FLAGS.filter((f) => f.status === statusFilter);
  const q = query.trim().toLowerCase();
  const byQuery = q.length === 0 ? byStatus : byStatus.filter((f) => `${f.name} ${f.key} ${f.segments.join(" ")}`.toLowerCase().includes(q));
  const rows = sortFlags(byQuery, sortKey, dir);

  return (
    <Card id="flag-table" className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <SectionLabel className="w-auto">Flags ({rows.length})</SectionLabel>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label className="relative flex h-11 min-w-0 items-center">
            <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="sr-only">Search flags by name or segment</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flags…"
              className={`h-11 w-40 min-w-0 rounded-lg border border-zinc-200 bg-white pl-8 pr-2.5 text-sm text-zinc-900 placeholder:text-zinc-500 sm:w-52 ${FOCUS_RING}`}
            />
          </label>
          <SegmentedControl
            label="Filter flags by status"
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "paused", label: "Paused" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>
      </div>

      <div className="mt-3 min-w-0 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <caption className="sr-only">Feature flags, sortable by name, status, rollout percentage, or owner, filterable by status.</caption>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-2 py-2 text-left">
                <HeaderButton k="name" onToggle={toggleSort}>
                  Flag
                </HeaderButton>
              </th>
              <th scope="col" aria-sort={ariaSortFor("status")} className="px-2 py-2 text-left">
                <HeaderButton k="status" onToggle={toggleSort}>
                  Status
                </HeaderButton>
              </th>
              <th scope="col" aria-sort={ariaSortFor("rolloutPct")} className="px-2 py-2 text-left">
                <HeaderButton k="rolloutPct" onToggle={toggleSort}>
                  Rollout
                </HeaderButton>
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Segments
              </th>
              <th scope="col" aria-sort={ariaSortFor("owner")} className="px-2 py-2 text-left">
                <HeaderButton k="owner" onToggle={toggleSort}>
                  Owner
                </HeaderButton>
              </th>
              <th scope="col" className="px-2 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Changed
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-2 py-8 text-center text-sm text-zinc-500">
                  No flags match this filter.
                </td>
              </tr>
            ) : (
              rows.map((f) => {
                const isSelected = selectedId === f.id;
                return (
                  <tr key={f.id} className={`border-b border-zinc-100 last:border-0 ${isSelected ? "bg-lime-50/70" : "hover:bg-zinc-50"}`}>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={() => onSelect(f.id)}
                        aria-pressed={isSelected}
                        className={`block w-full min-w-0 truncate text-left text-sm font-medium text-zinc-900 hover:text-lime-700 ${FOCUS_RING}`}
                      >
                        {f.name}
                      </button>
                      <span className="block truncate text-xs text-zinc-500">{f.key}</span>
                    </td>
                    <td className="px-2 py-2.5">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`shrink-0 text-sm text-zinc-900 ${NUM}`}>{f.rolloutPct}%</span>
                        <div className="w-16 shrink-0">
                          <Progress value={f.rolloutPct / 100} label={`${f.name} rollout, ${f.rolloutPct}%`} />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="block w-full truncate text-sm text-zinc-600">{f.segments.join(", ")}</span>
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <InitialsAvatar initials={f.owner.initials} size={22} />
                        <span className="block min-w-0 flex-1 truncate text-sm text-zinc-600">{f.owner.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-right text-xs text-zinc-500">{f.lastChangedLabel}</td>
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
