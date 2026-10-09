"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Priority, Ticket } from "./data";
import { Avatar, PriorityBadge, TicketStatusBadge } from "./ui";

type SortKey = "age" | "priority" | "status";
type SortDir = "asc" | "desc";

const PRIORITY_RANK: Record<Priority, number> = { Low: 0, Medium: 1, High: 2, Urgent: 3 };
const STATUS_RANK: Record<Ticket["status"], number> = {
  New: 0,
  "In Progress": 1,
  "Waiting on Customer": 2,
  Escalated: 3,
};

const PRIORITY_OPTIONS: (Priority | "All")[] = ["All", "Low", "Medium", "High", "Urgent"];

export default function TicketTable({ tickets, categoryName }: { tickets: Ticket[]; categoryName: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("age");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const filterId = useId();

  const filtered = useMemo(
    () => (priorityFilter === "All" ? tickets : tickets.filter((t) => t.priority === priorityFilter)),
    [tickets, priorityFilter]
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "age") cmp = a.ageDays - b.ageDays;
      else if (sortKey === "priority") cmp = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      else cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "age", label: "Age" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={filterId} className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          Filter by priority
        </label>
        <select
          id={filterId}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
          className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[12px] text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All priorities" : opt}
            </option>
          ))}
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-[12.5px] text-zinc-500">
          No tickets match this filter.
        </p>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only relative">
              {categoryName} tickets, {sorted.length} shown, sortable by age, priority and status.
            </caption>
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[34%]" />
              <col className="w-[8%]" />
              <col className="w-[16%]" />
              <col className="w-[20%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Ticket
                </th>
                <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Subject
                </th>
                {columns.map((col) => {
                  const active = col.key === sortKey;
                  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={ariaSort as "ascending" | "descending" | "none"}
                      className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]"
                      >
                        {col.label}
                        {active ? (
                          sortDir === "asc" ? (
                            <ArrowUp aria-hidden className="h-3 w-3" />
                          ) : (
                            <ArrowDown aria-hidden className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown aria-hidden className="h-3 w-3 text-zinc-500" />
                        )}
                      </button>
                    </th>
                  );
                })}
                <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Assignee
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="whitespace-nowrap px-3 py-2 text-[12px] tabular-nums text-zinc-500">{t.id}</td>
                  <td className="px-3 py-2 text-[12.5px] text-zinc-800">
                    <span className="line-clamp-2">{t.subject}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[12px] tabular-nums text-zinc-700">{t.ageDays}d</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <TicketStatusBadge status={t.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <Avatar initials={t.assigneeInitials} name={t.assignee} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
