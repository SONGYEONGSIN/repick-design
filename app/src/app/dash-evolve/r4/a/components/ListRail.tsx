"use client";

import { useMemo, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  SearchX,
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
  Priority,
  STATUS_META,
  STATUS_ORDER,
  memberById,
} from "../lib/data";

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

export default function ListRail({
  issues,
  selectedId,
  onSelect,
  className = "",
}: {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const grouped = useMemo(() => {
    const map = new Map<IssueStatus, Issue[]>();
    for (const status of STATUS_ORDER) map.set(status, []);
    for (const issue of issues) {
      map.get(issue.status)?.push(issue);
    }
    return map;
  }, [issues]);

  // Flat row order (grouped, in STATUS_ORDER) so arrow-key navigation can move
  // between rows across group boundaries without mutating anything at render time.
  const rowIndexById = useMemo(() => {
    const indexMap = new Map<string, number>();
    let i = 0;
    for (const status of STATUS_ORDER) {
      for (const issue of grouped.get(status) ?? []) {
        indexMap.set(issue.id, i);
        i += 1;
      }
    }
    return indexMap;
  }, [grouped]);

  function focusRow(index: number) {
    const target = rowRefs.current[index];
    if (target) target.focus();
  }

  if (issues.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 px-6 py-16 text-center ${className}`}>
        <SearchX className="h-6 w-6 text-zinc-400" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-700">No matching issues</p>
        <p className="text-xs text-zinc-500">Try a different filter or search term.</p>
      </div>
    );
  }

  return (
    <div className={className} role="listbox" aria-label="Issues">
      {STATUS_ORDER.map((status) => {
        const groupIssues = grouped.get(status) ?? [];
        if (groupIssues.length === 0) return null;
        const meta = STATUS_META[status];
        const StatusIcon = STATUS_ICON[status];

        return (
          <div key={status} role="group" aria-label={`${meta.label} (${groupIssues.length})`}>
            <div className="sticky top-0 z-10 flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/95 px-3 py-1.5 backdrop-blur">
              <StatusIcon className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-zinc-700">{meta.label}</span>
              <span className="text-xs tabular-nums text-zinc-500">{groupIssues.length}</span>
            </div>
            {groupIssues.map((issue) => {
              const idx = rowIndexById.get(issue.id) ?? 0;
              const PriorityIcon = PRIORITY_ICON[issue.priority];
              const priorityMeta = issue.priority;
              const assignee = memberById(issue.assigneeId ?? undefined);
              const selected = issue.id === selectedId;

              return (
                <button
                  key={issue.id}
                  type="button"
                  ref={(el) => {
                    rowRefs.current[idx] = el;
                  }}
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect(issue.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusRow(idx + 1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusRow(idx - 1);
                    }
                  }}
                  className={`block w-full border-b border-zinc-100 px-3 py-2.5 text-left outline-none transition-colors motion-reduce:transition-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                    selected ? "bg-indigo-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PriorityIcon
                      className={`h-3.5 w-3.5 shrink-0 ${
                        priorityMeta === "urgent" ? "text-rose-600" : "text-zinc-400"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="w-16 shrink-0 text-[11px] tabular-nums text-zinc-600">
                      {issue.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-900">
                      {issue.title}
                    </span>
                    {assignee ? (
                      <Avatar src={assignee.avatar} name={assignee.name} size={20} />
                    ) : (
                      <UnassignedAvatar size={20} />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 pl-5 text-[11px] text-zinc-600">
                    {issue.labels.slice(0, 2).map((label) => (
                      <Badge key={label} className={`${LABEL_META[label]?.badgeClass ?? ""} px-1.5 py-0`}>
                        {label}
                      </Badge>
                    ))}
                    <span className="truncate">{issue.updatedLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
