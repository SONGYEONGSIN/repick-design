"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Pin } from "lucide-react";
import type { CaseStatus, SupportCase } from "./data";
import { formatAge, priorityRank } from "./data";
import { AgentAvatar } from "./Avatar";
import { FOCUS_RING, PriorityBadge, Segmented, StatusBadge } from "./ui";

type SortKey = "priority" | "age";
type StatusFilter = "all" | CaseStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];

export function CaseRail({
  cases,
  pinnedId,
  onPin,
}: {
  cases: SupportCase[];
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => {
    const filtered = statusFilter === "all" ? cases : cases.filter((c) => c.status === statusFilter);
    const sorted = [...filtered].sort((a, b) =>
      sortKey === "priority" ? priorityRank(a.priority) - priorityRank(b.priority) : b.ageHours - a.ageHours
    );
    return sorted;
  }, [cases, statusFilter, sortKey]);

  const previewCase = previewId ? cases.find((c) => c.id === previewId) ?? null : null;

  function armPreview(id: string) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPreviewId(id), 120);
  }
  function disarmPreview() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setPreviewId(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-3 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">Cases</h2>
          <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-zinc-600">
            {visible.length}
          </span>
        </div>
        <Segmented
          ariaLabel="Sort cases"
          options={[
            { value: "priority", label: "Priority" },
            { value: "age", label: "Age" },
          ]}
          value={sortKey}
          onChange={setSortKey}
        />
      </div>

      <div
        className="relative shrink-0 border-b border-zinc-200 px-3 py-2"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFilterOpen(false);
        }}
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={filterOpen}
          onClick={() => setFilterOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <span>Filter: {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}</span>
          <ChevronDown className="size-3.5 text-zinc-500" aria-hidden="true" />
        </button>
        {filterOpen && (
          <div
            role="menu"
            aria-label="Filter cases by status"
            className="absolute left-3 right-3 top-full z-20 mt-1 overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-md"
          >
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={statusFilter === opt.value}
                onClick={() => {
                  setStatusFilter(opt.value);
                  setFilterOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                {opt.label}
                {statusFilter === opt.value && <span className="size-1.5 rounded-full bg-teal-600" aria-hidden="true" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto" aria-label="Support cases">
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">No cases match this filter.</li>
        )}
        {visible.map((c) => {
          const pinned = c.id === pinnedId;
          return (
            <li key={c.id} className="relative border-b border-zinc-100 last:border-b-0">
              <button
                type="button"
                onClick={() => onPin(c.id)}
                onMouseEnter={() => armPreview(c.id)}
                onMouseLeave={disarmPreview}
                onFocus={() => setPreviewId(c.id)}
                onBlur={disarmPreview}
                aria-pressed={pinned}
                className={`block w-full border-l-2 px-3 py-3 text-left transition-colors ${FOCUS_RING} ${
                  pinned ? "border-l-teal-600 bg-teal-50/40" : "border-l-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-zinc-900">{c.subject}</p>
                  <Pin
                    className={`mt-0.5 size-3.5 shrink-0 ${pinned ? "fill-teal-600 text-teal-600" : "text-zinc-400"}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {c.requester.name} &middot; {c.requester.company}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <AgentAvatar agent={c.assignee} size={20} />
                    <span className="whitespace-nowrap text-xs tabular-nums text-zinc-500">{formatAge(c.ageHours)}</span>
                  </div>
                </div>
                {pinned && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-teal-700 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    <Pin className="size-2.5 fill-white" aria-hidden="true" />
                    Pinned
                  </span>
                )}
              </button>

              {previewCase?.id === c.id && !pinned && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-2 z-30 ml-2 hidden w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg lg:block"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold tabular-nums text-zinc-500">{previewCase.id}</span>
                    <StatusBadge status={previewCase.status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-900">{previewCase.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {previewCase.timeline[previewCase.timeline.length - 1]?.body}
                  </p>
                  <p className="mt-2 text-[11px] text-zinc-500">Preview only &middot; click to pin to the detail view</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export type { StatusFilter };
