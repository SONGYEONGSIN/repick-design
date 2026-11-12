"use client";

import { Fragment, useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import {
  SERVICES,
  STATUS_RANK,
  getDirectDependencies,
  getDirectDependents,
  formatInt,
  type Status,
} from "./data";
import { NODE_ICONS } from "./icons";
import { FOCUS_RING, SegmentedControl, StatusBadge } from "./ui";

type SortKey = "name" | "status" | "deps" | "dependents" | "incidents";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | Status;

interface Row {
  id: string;
  name: string;
  summary: string;
  icon: (typeof SERVICES)[number]["icon"];
  status: Status;
  team: string;
  deps: string[];
  dependents: string[];
  incidents90d: number;
}

const ROWS: Row[] = SERVICES.map((node) => ({
  id: node.id,
  name: node.name,
  summary: node.summary,
  icon: node.icon,
  status: node.status,
  team: node.team,
  deps: getDirectDependencies(node.id),
  dependents: getDirectDependents(node.id),
  incidents90d: node.incidents90d,
}));

function sortValue(row: Row, key: SortKey): number | string {
  switch (key) {
    case "name":
      return row.name;
    case "status":
      return STATUS_RANK[row.status];
    case "deps":
      return row.deps.length;
    case "dependents":
      return row.dependents.length;
    case "incidents":
      return row.incidents90d;
    default:
      return row.name;
  }
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-6 items-center gap-1 whitespace-nowrap rounded px-1 font-medium text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
    >
      {label}
      <Icon size={12} className={active ? "text-indigo-600" : "text-zinc-400"} aria-hidden="true" />
    </button>
  );
}

export function DependencyTable() {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(
    () => (filter === "all" ? ROWS : ROWS.filter((r) => r.status === filter)),
    [filter],
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      let cmp: number;
      if (typeof av === "string" && typeof bv === "string") {
        cmp = av.localeCompare(bv);
      } else {
        cmp = (av as number) - (bv as number);
      }
      if (cmp === 0) cmp = a.name.localeCompare(b.name);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Full adjacency list — every column below also drives the graph and detail panel.
        </p>
        <SegmentedControl
          ariaLabel="Filter by status"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "healthy", label: "Healthy" },
            { value: "degraded", label: "Degraded" },
            { value: "down", label: "Down" },
          ]}
        />
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <caption className="sr-only">
            Service dependency adjacency list: each row lists a service&apos;s status, what it depends
            on, what depends on it, and incidents in the last 90 days.
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs">
              <th scope="col" className="w-9 px-2 py-2.5">
                <span className="sr-only">Expand</span>
              </th>
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-3 py-2.5">
                <SortButton label="Service" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("status")} className="px-3 py-2.5">
                <SortButton label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("deps")} className="px-3 py-2.5">
                <SortButton label="Depends on" active={sortKey === "deps"} dir={sortDir} onClick={() => toggleSort("deps")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("dependents")} className="px-3 py-2.5">
                <SortButton
                  label="Depended on by"
                  active={sortKey === "dependents"}
                  dir={sortDir}
                  onClick={() => toggleSort("dependents")}
                />
              </th>
              <th scope="col" aria-sort={ariaSortFor("incidents")} className="px-3 py-2.5">
                <SortButton
                  label="Incidents (90d)"
                  active={sortKey === "incidents"}
                  dir={sortDir}
                  onClick={() => toggleSort("incidents")}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const Icon = NODE_ICONS[row.icon];
              const isExpanded = expandedId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`row-detail-${row.id}`}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} dependency detail for ${row.name}`}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
                      >
                        <ChevronRight size={14} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} aria-hidden="true" />
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                          <Icon size={13} aria-hidden="true" />
                        </span>
                        <span className="font-medium text-zinc-900">{row.name}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-700">
                      {formatInt(row.deps.length)} {row.deps.length === 1 ? "service" : "services"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-700">
                      {formatInt(row.dependents.length)} {row.dependents.length === 1 ? "service" : "services"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-700">
                      {formatInt(row.incidents90d)}
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr className="border-b border-zinc-100 bg-indigo-50/40 last:border-0">
                      <td colSpan={6} id={`row-detail-${row.id}`} className="px-3 py-3">
                        <p className="text-xs text-zinc-600">{row.summary}</p>
                        <dl className="mt-2 grid gap-3 sm:grid-cols-2">
                          <div>
                            <dt className="text-[11px] font-medium text-zinc-600">Depends on</dt>
                            <dd className="mt-0.5 text-xs text-zinc-800">
                              {row.deps.length > 0 ? row.deps.join(", ") : "Nothing — this service has no downstream calls."}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[11px] font-medium text-zinc-600">Depended on by</dt>
                            <dd className="mt-0.5 text-xs text-zinc-800">
                              {row.dependents.length > 0
                                ? row.dependents.join(", ")
                                : "Nothing — no other service calls this one directly."}
                            </dd>
                          </div>
                        </dl>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 ? (
        <p className="mt-3 text-center text-sm text-zinc-500">No services match this filter.</p>
      ) : null}
    </div>
  );
}
