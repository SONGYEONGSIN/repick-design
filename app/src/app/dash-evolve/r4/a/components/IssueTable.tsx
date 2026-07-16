"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  XCircle,
} from "lucide-react";
import { Avatar, Badge, UnassignedAvatar } from "./ui";
import {
  Issue,
  IssueStatus,
  LABEL_META,
  PRIORITY_META,
  Priority,
  STATUS_META,
  memberById,
} from "../lib/data";
import { SortKey } from "../lib/data";

const STATUS_ICON: Record<IssueStatus, typeof Circle> = {
  backlog: CircleDashed,
  todo: Circle,
  "in-progress": CircleDot,
  "in-review": CircleEllipsis,
  done: CheckCircle2,
  cancelled: XCircle,
};

const PRIORITY_ICON: Record<Priority, typeof Circle> = {
  urgent: AlertTriangle,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: SignalZero,
};

type SortDir = "asc" | "desc";

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === activeKey;
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500 ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 rounded outline-none transition-colors motion-reduce:transition-none hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {label}
        <Icon className={`h-3 w-3 ${active ? "text-indigo-600" : "text-zinc-400"}`} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function IssueTable({
  issues,
  selectedId,
  onSelect,
  sortKey,
  sortDir,
  onSort,
}: {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[880px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
        <caption className="sr-only">
          All issues in Core Platform, sortable by ID, priority, or last updated
        </caption>
        <colgroup>
          <col className="lg:w-[10%]" />
          <col className="lg:w-[30%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[11%]" />
          <col className="lg:w-[17%]" />
          <col className="lg:w-[10%]" />
          <col className="lg:w-[10%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <SortHeader label="ID" sortKey="id" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Title
            </th>
            <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Status
            </th>
            <SortHeader label="Priority" sortKey="priority" activeKey={sortKey} dir={sortDir} onSort={onSort} />
            <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Assignee
            </th>
            <th scope="col" className="hidden px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500 lg:table-cell">
              Labels
            </th>
            <SortHeader
              label="Updated"
              sortKey="updated"
              activeKey={sortKey}
              dir={sortDir}
              onSort={onSort}
              className="whitespace-nowrap"
            />
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const StatusIcon = STATUS_ICON[issue.status];
            const PriorityIcon = PRIORITY_ICON[issue.priority];
            const statusMeta = STATUS_META[issue.status];
            const priorityMeta = PRIORITY_META[issue.priority];
            const assignee = memberById(issue.assigneeId ?? undefined);
            const selected = issue.id === selectedId;

            return (
              <tr
                key={issue.id}
                aria-selected={selected}
                className={`border-b border-zinc-100 last:border-b-0 ${selected ? "bg-indigo-50" : "hover:bg-zinc-50"}`}
              >
                <td className="px-3 py-2 align-middle">
                  <button
                    type="button"
                    onClick={() => onSelect(issue.id)}
                    className="rounded text-[12px] font-medium tabular-nums text-zinc-500 outline-none transition-colors motion-reduce:transition-none hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {issue.id}
                  </button>
                </td>
                <td className="min-w-0 px-3 py-2 align-middle">
                  <button
                    type="button"
                    onClick={() => onSelect(issue.id)}
                    className="block w-full truncate rounded text-left text-[13px] font-medium text-zinc-900 outline-none transition-colors motion-reduce:transition-none hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {issue.title}
                  </button>
                </td>
                <td className="px-3 py-2 align-middle">
                  <Badge className={`${statusMeta.badgeClass} whitespace-nowrap`}>
                    <StatusIcon className="h-3 w-3" aria-hidden="true" />
                    {statusMeta.label}
                  </Badge>
                </td>
                <td className="px-3 py-2 align-middle">
                  <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium ${priorityMeta.textClass}`}>
                    <PriorityIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {priorityMeta.label}
                  </span>
                </td>
                <td className="px-3 py-2 align-middle">
                  {assignee ? (
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Avatar src={assignee.avatar} name={assignee.name} size={20} />
                      <span className="truncate text-xs text-zinc-700">{assignee.name}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <UnassignedAvatar size={20} />
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="hidden px-3 py-2 align-middle lg:table-cell">
                  <div className="flex flex-wrap items-center gap-1">
                    {issue.labels.slice(0, 2).map((label) => (
                      <Badge key={label} className={`${LABEL_META[label]?.badgeClass ?? ""} px-1.5 py-0 text-[10px]`}>
                        {label}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2 align-middle text-xs tabular-nums text-zinc-500">
                  {issue.updatedLabel}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
