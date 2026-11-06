"use client";

import { useRef, type ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import { SeverityBadge, SlaPill, Avatar, FOCUS_RING } from "./ui";
import {
  formatMinutes,
  formatCompact,
  ageMinFor,
  COLUMN_META,
  type Incident,
  type SortKey,
  type SortDir,
} from "./data";

export function CompactList({
  incidents, sortKey, sortDir, onSort, pinnedId, onPin, onHoverStart, onHoverEnd,
}: {
  incidents: Incident[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  pinnedId: string | null;
  onPin: (id: string) => void;
  onHoverStart: (id: string, rect: DOMRect) => void;
  onHoverEnd: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[890px] table-fixed border-collapse text-sm">
        <caption className="sr-only">
          All incidents across every stage, with severity, assignee, age, SLA remaining and impact
        </caption>
        <colgroup>
          <col style={{ width: "10.1%" }} />
          <col style={{ width: "31.5%" }} />
          <col style={{ width: "19.1%" }} />
          <col style={{ width: "10.1%" }} />
          <col style={{ width: "16.9%" }} />
          <col style={{ width: "12.3%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10 text-left text-xs text-zinc-400">
            <SortableHeader sortKey="severity" activeKey={sortKey} dir={sortDir} onSort={onSort}>
              Severity
            </SortableHeader>
            <th scope="col" className="py-2 pr-2 font-medium">
              Incident
            </th>
            <th scope="col" className="py-2 pr-2 font-medium">
              Assignee
            </th>
            <SortableHeader sortKey="age" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
              Age
            </SortableHeader>
            <SortableHeader sortKey="sla" activeKey={sortKey} dir={sortDir} onSort={onSort}>
              SLA
            </SortableHeader>
            <th scope="col" className="py-2 pl-2 text-right font-medium">
              Impact
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {incidents.map((incident) => (
            <Row
              key={incident.id}
              incident={incident}
              pinned={incident.id === pinnedId}
              onPin={onPin}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
            />
          ))}
          {incidents.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-sm text-zinc-400">
                No incidents match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({
  sortKey, activeKey, dir, onSort, align = "left", children,
}: {
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
  children: ReactNode;
}) {
  const isActive = activeKey === sortKey;
  return (
    <th
      scope="col"
      aria-sort={isActive ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`py-2 pr-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex min-h-6 items-center gap-1 rounded py-1 ${align === "right" ? "ml-auto" : ""} ${FOCUS_RING}`}
      >
        {children}
        <ArrowUpDown className="h-3 w-3 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

function Row({
  incident, pinned, onPin, onHoverStart, onHoverEnd,
}: {
  incident: Incident;
  pinned: boolean;
  onPin: (id: string) => void;
  onHoverStart: (id: string, rect: DOMRect) => void;
  onHoverEnd: (id: string) => void;
}) {
  const rowRef = useRef<HTMLTableRowElement>(null);

  function reportHover() {
    const rect = rowRef.current?.getBoundingClientRect();
    if (rect) onHoverStart(incident.id, rect);
  }

  return (
    <tr
      id={`row-${incident.id}`}
      ref={rowRef}
      onMouseEnter={reportHover}
      onMouseMove={reportHover}
      onMouseLeave={() => onHoverEnd(incident.id)}
      onFocus={reportHover}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onHoverEnd(incident.id);
      }}
      className={pinned ? "bg-emerald-500/[0.06]" : ""}
    >
      <td className="py-2.5 pr-2 align-top">
        <SeverityBadge severity={incident.severity} />
      </td>
      <th scope="row" className="py-2.5 pr-2 text-left align-top font-normal">
        <button
          type="button"
          onClick={() => onPin(incident.id)}
          aria-pressed={pinned}
          aria-describedby={`list-${incident.id}-quicklook`}
          className={`relative block w-full text-left ${FOCUS_RING}`}
        >
          <span className="line-clamp-1 text-sm font-medium text-zinc-50">{incident.title}</span>
          <span className="mt-0.5 block truncate text-xs text-zinc-400">
            {incident.service} &middot; {COLUMN_META[incident.column].label}
          </span>
          <span id={`list-${incident.id}-quicklook`} className="sr-only">
            Latest update: {incident.lastUpdate} Next action: {incident.nextAction}
          </span>
        </button>
      </th>
      <td className="py-2.5 pr-2 align-top">
        <span className="flex items-center gap-1.5">
          <Avatar initials={incident.assignee?.initials ?? null} size={20} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs text-zinc-200">{incident.assignee?.name ?? "Unassigned"}</span>
            <span className="block truncate text-[11px] text-zinc-400">{incident.squad}</span>
          </span>
        </span>
      </td>
      <td className="whitespace-nowrap py-2.5 pr-2 text-right align-top tabular-nums text-zinc-300">
        {formatMinutes(ageMinFor(incident))}
      </td>
      <td className="py-2.5 pr-2 align-top">
        <SlaPill incident={incident} />
      </td>
      <td className="whitespace-nowrap py-2.5 pl-2 text-right align-top tabular-nums text-zinc-300">
        {formatCompact(incident.impacted)}
      </td>
    </tr>
  );
}
