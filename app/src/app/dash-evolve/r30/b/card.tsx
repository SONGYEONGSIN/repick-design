"use client";

import { useRef } from "react";
import { SeverityBadge, SlaPill, Sparkline, Avatar, FOCUS_RING } from "./ui";
import { formatMinutes, formatCompact, ageMinFor, type Incident } from "./data";

export function IncidentCard({
  incident, pinned, onPin, onHoverStart, onHoverEnd,
}: {
  incident: Incident;
  pinned: boolean;
  onPin: (id: string) => void;
  onHoverStart: (id: string, rect: DOMRect) => void;
  onHoverEnd: (id: string) => void;
}) {
  const liRef = useRef<HTMLLIElement>(null);

  function reportHover() {
    const rect = liRef.current?.getBoundingClientRect();
    if (rect) onHoverStart(incident.id, rect);
  }

  return (
    <li
      id={`card-${incident.id}`}
      ref={liRef}
      onMouseEnter={reportHover}
      onMouseMove={reportHover}
      onMouseLeave={() => onHoverEnd(incident.id)}
      onFocus={reportHover}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onHoverEnd(incident.id);
      }}
      className={`overflow-hidden rounded-lg border bg-zinc-900 transition-colors motion-reduce:transition-none ${
        pinned ? "border-emerald-400/50 ring-1 ring-inset ring-emerald-400/20" : "border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={() => onPin(incident.id)}
        aria-pressed={pinned}
        aria-describedby={`${incident.id}-quicklook`}
        className={`block w-full px-3 pb-2 pt-3 text-left hover:bg-white/[0.03] ${FOCUS_RING}`}
      >
        <div className="flex items-center justify-between gap-2">
          <SeverityBadge severity={incident.severity} />
          {pinned && <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-emerald-300">Pinned</span>}
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-zinc-50">{incident.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-400">{incident.service}</p>

        <div className="mt-2.5 flex items-center gap-1.5">
          <Avatar initials={incident.assignee?.initials ?? null} size={20} />
          <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-300">
            {incident.assignee ? incident.assignee.name : "Unassigned"}
          </span>
          <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums text-zinc-400">
            {formatMinutes(ageMinFor(incident))} {incident.column === "resolved" ? "total" : "open"}
          </span>
        </div>

        <div className="mt-2">
          <SlaPill incident={incident} />
        </div>

        <p className="mt-1.5 truncate text-[11px] tabular-nums text-zinc-400">
          {formatCompact(incident.impacted)} requests impacted
        </p>

        <span id={`${incident.id}-quicklook`} className="sr-only">
          Latest update: {incident.lastUpdate} Next action: {incident.nextAction}
        </span>
      </button>

      <div className="px-3 pb-3 pt-1">
        <Sparkline data={incident.errorRate} label={`Error rate trend for ${incident.title}, last 30 minutes`} />
      </div>
    </li>
  );
}
