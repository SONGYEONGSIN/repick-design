"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import type { CategoryId, Period, ResourceStatus, TeamId } from "./data";
import { CATEGORY_META, resourceCost, resourcesForTeam } from "./data";
import { formatCurrency } from "./format";
import { FOCUS_RING, SegmentedControl, SortHeader, StatusBadge, STATUS_SEVERITY } from "./ui";

type SortKey = "name" | "cost" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | ResourceStatus;

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "optimized", label: "OK" },
  { value: "idle", label: "Idle" },
  { value: "anomalous", label: "Alert" },
];

function CategoryAvatar({ categoryId }: { categoryId: CategoryId }) {
  const Icon = CATEGORY_META[categoryId].icon;
  return (
    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-zinc-300">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
}

/**
 * Independent selection source #2: pinning a row here only ever writes `pinnedResourceId`, a
 * value scoped globally (not to this team or to the treemap's drill path), and it never resets
 * the treemap's own drill state. Sorting and the status filter are real, client-side and
 * deterministic — no randomness, just array methods over the fixed data in `data.ts`.
 */
export function ResourcesTable({
  teamId,
  teamName,
  period,
  pinnedResourceId,
  onPin,
}: {
  teamId: TeamId;
  teamName: string;
  period: Period;
  pinnedResourceId: string;
  onPin: (resourceId: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = resourcesForTeam(teamId).filter((r) => statusFilter === "all" || r.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "cost") cmp = resourceCost(a, period) - resourceCost(b, period);
    else cmp = STATUS_SEVERITY[a.status] - STATUS_SEVERITY[b.status];
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-sm text-zinc-50">Resources — {teamName}</h2>
        <SegmentedControl label="Filter resources by status" options={STATUS_FILTER_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <table className="mt-3 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Individual cloud resources for {teamName}: name, monthly cost and status, sortable by any column, filterable by status. Pin a
          row to compare it in the pinned resource card.
        </caption>
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "16%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <SortHeader label="Resource" active={sortKey === "name"} dir={sortDir} onSort={() => handleSort("name")} />
            <SortHeader label="Cost" active={sortKey === "cost"} dir={sortDir} onSort={() => handleSort("cost")} align="right" />
            <SortHeader label="Status" active={sortKey === "status"} dir={sortDir} onSort={() => handleSort("status")} align="right" />
            <th scope="col" className="px-2 py-2.5 text-right font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
              Pin
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-2 py-6 text-center font-normal text-sm text-zinc-400">
                No resources match this filter.
              </td>
            </tr>
          ) : (
            sorted.map((resource) => {
              const isPinned = resource.id === pinnedResourceId;
              return (
                <tr key={resource.id} className={`border-b border-white/5 motion-safe:transition-colors hover:bg-white/[0.04] ${isPinned ? "bg-amber-400/5" : ""}`}>
                  <td className="min-w-0 px-2 py-2">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <CategoryAvatar categoryId={resource.categoryId} />
                      <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{resource.name}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-sm tabular-nums text-zinc-50">{formatCurrency(resourceCost(resource, period))}</td>
                  <td className="px-2 py-2 text-right">
                    <StatusBadge status={resource.status} abbreviated className="ml-auto" />
                  </td>
                  <td className="px-1 py-2 text-right">
                    <button
                      type="button"
                      aria-pressed={isPinned}
                      aria-label={isPinned ? `Unpin ${resource.name}` : `Pin ${resource.name}`}
                      onClick={() => onPin(resource.id)}
                      className={`ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg motion-safe:transition-colors ${FOCUS_RING} ${
                        isPinned ? "bg-amber-400/15 text-amber-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                      }`}
                    >
                      <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
