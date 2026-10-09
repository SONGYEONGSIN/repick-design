"use client";

import { useState, type FocusEvent } from "react";
import { Pin, Globe2, ChevronDown } from "lucide-react";
import {
  EVENTS, EVENT_TYPE_META, SEVERITY_LABEL, STATUS_LABEL, getNode,
  fmtRelative, fmtAbsolute, fmtNumber,
  type Severity, type SecurityEvent,
} from "./data";
import {
  Card, SectionLabel, Avatar, SeverityBadge, StatusBadge, EVENT_TYPE_ICON, FOCUS_RING, FOCUS_RING_FULL,
} from "./ui";

const PAGE_SIZE = 10;
const SEVERITY_OPTIONS: { key: Severity | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export function Feed({
  severityFilter, onSeverityFilterChange, pinnedId, onTogglePin,
}: {
  severityFilter: Severity | "all";
  onSeverityFilterChange: (s: Severity | "all") => void;
  pinnedId: string | null;
  onTogglePin: (id: string) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when the severity filter changes, adjusted synchronously during render
  // (React's documented "resetting state when a prop changes" pattern).
  const [lastFilter, setLastFilter] = useState(severityFilter);
  if (severityFilter !== lastFilter) {
    setLastFilter(severityFilter);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = severityFilter === "all" ? EVENTS : EVENTS.filter((e) => e.severity === severityFilter);
  const visible = filtered.slice(0, visibleCount);

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-zinc-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionLabel as="h2">Event Stream</SectionLabel>
          <div
            role="group"
            aria-label="Filter by severity"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5"
          >
            {SEVERITY_OPTIONS.map((opt) => {
              const active = severityFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSeverityFilterChange(opt.key)}
                  className={`flex h-11 items-center rounded-md px-3 text-xs font-medium transition-colors ${FOCUS_RING} ${
                    active ? "border border-zinc-200 bg-white text-emerald-800 shadow-sm" : "border border-transparent text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-xs font-normal text-zinc-500">
          Showing <span className="font-medium tabular-nums text-zinc-700">{fmtNumber(visible.length)}</span> of{" "}
          <span className="font-medium tabular-nums text-zinc-700">{fmtNumber(filtered.length)}</span> events, newest first.
          Feed order and filters stay independent of pinned events — this is a chronological record, not a filtered view;
          pinning an event only updates the two panels on the right.
        </p>
      </div>

      <ul className="divide-y divide-zinc-100">
        {visible.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            pinned={pinnedId === event.id}
            onTogglePin={() => onTogglePin(event.id)}
          />
        ))}
        {visible.length === 0 && (
          <li className="px-6 py-10 text-center text-sm font-normal text-zinc-500">
            No events match this filter.
          </li>
        )}
      </ul>

      {visibleCount < filtered.length && (
        <div className="border-t border-zinc-200 p-4">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length))}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
            Load more events
          </button>
        </div>
      )}
    </Card>
  );
}

function EventCard({
  event, pinned, onTogglePin,
}: { event: SecurityEvent; pinned: boolean; onTogglePin: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const previewOpen = hovered || focused;

  const meta = EVENT_TYPE_META[event.type];
  const TypeIcon = EVENT_TYPE_ICON[event.type];
  const actor = getNode(event.actorId);
  const target = getNode(event.targetId);

  function handleBlur(e: FocusEvent<HTMLLIElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  }

  return (
    <li
      className={`relative px-5 py-4 transition-colors sm:px-6 ${pinned ? "bg-emerald-50/60" : hovered ? "bg-zinc-50" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
              event.severity === "critical" ? "border-red-200 bg-red-50 text-red-700" :
              event.severity === "high" ? "border-orange-200 bg-orange-50 text-orange-700" :
              event.severity === "medium" ? "border-amber-200 bg-amber-50 text-amber-700" :
              "border-zinc-200 bg-zinc-100 text-zinc-600"
            }`}
          >
            <TypeIcon className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-zinc-900">{meta.label}</span>
              <SeverityBadge severity={event.severity} label={SEVERITY_LABEL[event.severity]} />
            </div>
            <p className="mt-1 text-sm font-normal leading-snug text-zinc-700">{event.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-medium tabular-nums text-zinc-700 whitespace-nowrap">{fmtRelative(event.timestampMin)}</p>
            <p className="text-[11px] font-normal tabular-nums text-zinc-500 whitespace-nowrap">{fmtAbsolute(event.timestampMin)}</p>
          </div>
          <button
            type="button"
            onClick={onTogglePin}
            aria-pressed={pinned}
            aria-label={pinned ? `Unpin ${meta.label} for ${actor.name}` : `Pin ${meta.label} for ${actor.name}`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${FOCUS_RING_FULL} ${
              pinned ? "border-emerald-300 bg-emerald-100 text-emerald-800" : "border-zinc-200 text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            <Pin aria-hidden="true" className={`h-4 w-4 ${pinned ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 pl-12">
        <div className="flex items-center gap-2">
          <Avatar initials={initialsOf(actor.name)} size={24} />
          <span className="text-xs font-medium text-zinc-700">{actor.name}</span>
          <span className="text-xs font-normal text-zinc-500">{"role" in actor ? actor.role : ""}</span>
        </div>
        <span className="text-xs font-normal text-zinc-400" aria-hidden="true">→</span>
        <span className="text-xs font-medium text-zinc-700">
          {target.name}
          <span className="ml-1 font-normal text-zinc-500">({target.kind === "account" ? "account" : "service"})</span>
        </span>
        <div className="flex items-center gap-1.5 text-xs font-normal text-zinc-500">
          <Globe2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {event.location.city}, {event.location.country}
        </div>
        <StatusBadge status={event.status} label={STATUS_LABEL[event.status]} />
      </div>

      <div className={`grid pl-12 transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${previewOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-xs font-normal text-zinc-600">
            <span><span className="font-medium text-zinc-500">Device:</span> {event.device}</span>
            <span><span className="font-medium text-zinc-500">Source IP:</span> <span className="tabular-nums">{event.ip}</span></span>
            {event.recordCount !== undefined && (
              <span><span className="font-medium text-zinc-500">Records:</span> <span className="tabular-nums">{fmtNumber(event.recordCount)}</span></span>
            )}
            {event.travelMin !== undefined && (
              <span><span className="font-medium text-zinc-500">Travel window:</span> <span className="tabular-nums">{event.travelMin} min</span></span>
            )}
            {event.fromRole && event.toRole && (
              <span><span className="font-medium text-zinc-500">Role change:</span> {event.fromRole} → {event.toRole}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function initialsOf(name: string): string {
  const parts = name.split(" ");
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}
