"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { FOCUS, SegmentedControl, StatusBadge, PriorityBadge } from "./ui";
import {
  REPL_TASKS,
  REPL_STATUS_LABEL,
  PRIORITY_LABEL,
  PERSON_BY_ID,
  fmtNumber,
  type ReplStatus,
  type ReplTask,
} from "./data";

type SortKey = "qty" | "eta";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | ReplStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-transit", label: "In Transit" },
  { value: "overdue", label: "Overdue" },
];

function sortValue(task: ReplTask, key: SortKey): number {
  return key === "qty" ? task.qty : task.etaRank;
}

export function ReplenishmentTable() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("eta");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = REPL_TASKS.filter((t) => statusFilter === "all" || t.status === statusFilter);
  const sorted = [...filtered].sort((a, b) => {
    const diff = sortValue(a, sortKey) - sortValue(b, sortKey);
    return sortDir === "asc" ? diff : -diff;
  });

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <ArrowUpDown className="h-3 w-3 flex-shrink-0 text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 flex-shrink-0 text-green-700" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3 w-3 flex-shrink-0 text-green-700" aria-hidden="true" />
    );
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div id="panel-queue" role="tabpanel" aria-labelledby="tab-queue">
      <div className="flex flex-wrap items-center justify-between gap-3 py-3">
        <p className="text-xs font-normal text-zinc-500">
          Showing {sorted.length} of {REPL_TASKS.length} open tasks
        </p>
        <SegmentedControl label="Filter by status" value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTERS} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Task
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Zone
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Assignee
              </th>
              <th scope="col" aria-sort={ariaSortFor("qty")} className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                <button
                  type="button"
                  onClick={() => toggleSort("qty")}
                  className={`-m-1.5 ml-auto flex items-center gap-1 p-1.5 ${FOCUS}`}
                >
                  Qty {sortIcon("qty")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Priority
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Status
              </th>
              <th scope="col" aria-sort={ariaSortFor("eta")} className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                <button
                  type="button"
                  onClick={() => toggleSort("eta")}
                  className={`-m-1.5 flex items-center gap-1 p-1.5 ${FOCUS}`}
                >
                  ETA {sortIcon("eta")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((task) => {
              const person = PERSON_BY_ID.get(task.assigneeId)!;
              return (
                <tr key={task.id} className="hover:bg-zinc-50">
                  <td className="px-3 py-2.5 align-top">
                    <p className="truncate text-sm font-medium text-zinc-900">{task.item}</p>
                    <p className="truncate text-xs font-normal text-zinc-500">
                      {task.id} · {task.sku}
                    </p>
                  </td>
                  <td className="truncate px-3 py-2.5 align-top text-sm font-normal text-zinc-700">{task.zoneName}</td>
                  <td className="px-3 py-2.5 align-top">
                    <div className="flex min-w-0 items-center gap-2">
                      <Image
                        src={`https://images.unsplash.com/photo-${person.photoId}?q=80&w=96&auto=format&fit=crop`}
                        alt={`Portrait of ${person.name}`}
                        width={24}
                        height={24}
                        className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0 truncate text-sm font-normal text-zinc-700">{person.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 align-top text-right text-sm font-medium tabular-nums text-zinc-900">
                    {fmtNumber(task.qty)}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <PriorityBadge priority={task.priority} label={PRIORITY_LABEL[task.priority]} />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <StatusBadge status={task.status} label={REPL_STATUS_LABEL[task.status]} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 align-top text-sm font-normal tabular-nums text-zinc-700">
                    {task.etaLabel}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm font-normal text-zinc-500">
                  No tasks match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
