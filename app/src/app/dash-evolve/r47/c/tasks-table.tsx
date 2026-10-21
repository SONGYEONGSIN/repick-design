"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Ban, Circle, CircleCheck } from "lucide-react";
import { TASKS, getAccountName, type TaskPriority, type TaskStatus } from "./data";
import { formatDateShort } from "./format";
import { Avatar, Badge, FOCUS_RING, SegmentedControl } from "./ui";

type SortKey = "account" | "due" | "priority" | "status";
type SortDir = "asc" | "desc";

const STATUS_STYLE: Record<TaskStatus, { tone: "info" | "danger" | "success"; icon: typeof Circle }> = {
  Open: { tone: "info", icon: Circle },
  Blocked: { tone: "danger", icon: Ban },
  Done: { tone: "success", icon: CircleCheck },
};

const PRIORITY_RANK: Record<TaskPriority, number> = { Low: 1, Medium: 2, High: 3 };
const PRIORITY_COLOR: Record<TaskPriority, string> = {
  High: "text-red-700",
  Medium: "text-amber-700",
  Low: "text-zinc-600",
};

const FILTER_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Blocked", label: "Blocked" },
  { value: "Done", label: "Done" },
];

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
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600 transition-colors duration-150 hover:text-zinc-900 ${FOCUS_RING} rounded`}
    >
      {label}
      {active ? (
        dir === "asc" ? (
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
        ) : (
          <ArrowDown className="h-3 w-3" aria-hidden="true" />
        )
      ) : (
        <span className="h-3 w-3" aria-hidden="true" />
      )}
    </button>
  );
}

export function TasksTable() {
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    const filtered = filter === "All" ? TASKS : TASKS.filter((t) => t.status === filter);
    const withNames = filtered.map((task) => ({ ...task, accountName: getAccountName(task.accountId) }));
    const sorted = [...withNames].sort((a, b) => {
      let compare = 0;
      if (sortKey === "account") compare = a.accountName.localeCompare(b.accountName);
      else if (sortKey === "due") compare = a.dueDate.localeCompare(b.dueDate);
      else if (sortKey === "priority") compare = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      else compare = a.status.localeCompare(b.status);
      return sortDir === "asc" ? compare : -compare;
    });
    return sorted;
  }, [filter, sortKey, sortDir]);

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900">Renewal tasks</h2>
        <SegmentedControl
          ariaLabel="Filter tasks by status"
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(v) => setFilter(v as "All" | TaskStatus)}
        />
      </div>

      {/* Desktop/tablet: full table, hidden below `sm` in favor of the card list. No
          overflow-x-auto wrapper — the fixed, percentage-based colgroup is sized to fit without
          horizontal scroll at this breakpoint, and the rail above is this page's only wide list. */}
      <div className="hidden overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Open renewal tasks across all ranked accounts</caption>
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Task
              </th>
              <th scope="col" aria-sort={ariaSortFor("account")} className="px-4 py-2.5 text-left">
                <SortButton label="Account" active={sortKey === "account"} dir={sortDir} onClick={() => toggleSort("account")} />
              </th>
              <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Owner
              </th>
              <th scope="col" aria-sort={ariaSortFor("due")} className="px-4 py-2.5 text-left">
                <SortButton label="Due" active={sortKey === "due"} dir={sortDir} onClick={() => toggleSort("due")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("priority")} className="px-4 py-2.5 text-left">
                <SortButton label="Priority" active={sortKey === "priority"} dir={sortDir} onClick={() => toggleSort("priority")} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("status")} className="px-4 py-2.5 text-left">
                <SortButton label="Status" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((task) => {
              const status = STATUS_STYLE[task.status];
              const StatusIcon = status.icon;
              return (
                <tr key={task.id} className="transition-colors duration-150 hover:bg-zinc-50">
                  <td className="truncate px-4 py-2.5 text-zinc-900">{task.title}</td>
                  <td className="truncate px-4 py-2.5 text-zinc-700">{task.accountName}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex min-w-0 items-center gap-2">
                      <Avatar initials={task.ownerInitials} />
                      <span className="min-w-0 truncate text-zinc-700">{task.owner}</span>
                    </span>
                  </td>
                  <td className="truncate px-4 py-2.5 tabular-nums text-zinc-700">{formatDateShort(task.dueDate)}</td>
                  <td className={`truncate px-4 py-2.5 font-medium ${PRIORITY_COLOR[task.priority]}`}>{task.priority}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone={status.tone} icon={<StatusIcon className="h-3 w-3" aria-hidden="true" />}>
                      {task.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile fallback: stacked cards instead of a horizontally-scrolling table. */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((task) => {
          const status = STATUS_STYLE[task.status];
          const StatusIcon = status.icon;
          return (
            <li key={task.id} className="min-w-0 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="flex min-w-0 items-start justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-medium text-zinc-900">{task.title}</p>
                <Badge tone={status.tone} icon={<StatusIcon className="h-3 w-3" aria-hidden="true" />} className="shrink-0">
                  {task.status}
                </Badge>
              </div>
              <p className="mt-1 truncate text-sm text-zinc-700">{task.accountName}</p>
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <Avatar initials={task.ownerInitials} />
                  {task.owner}
                </span>
                <span className="tabular-nums">Due {formatDateShort(task.dueDate)}</span>
                <span className={`font-medium ${PRIORITY_COLOR[task.priority]}`}>{task.priority} priority</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
