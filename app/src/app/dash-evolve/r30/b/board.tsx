"use client";

import { IncidentCard } from "./card";
import {
  COLUMN_ORDER,
  COLUMN_META,
  compareIncidents,
  ageMinFor,
  slaFor,
  formatMinutes,
  type Incident,
  type SortKey,
  type SortDir,
} from "./data";

export function Board({
  incidents, sortKey, sortDir, pinnedId, onPin, onHoverStart, onHoverEnd,
}: {
  incidents: Incident[];
  sortKey: SortKey;
  sortDir: SortDir;
  pinnedId: string | null;
  onPin: (id: string) => void;
  onHoverStart: (id: string, rect: DOMRect) => void;
  onHoverEnd: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:h-full xl:grid-cols-5">
      {COLUMN_ORDER.map((col) => {
        const items = incidents
          .filter((i) => i.column === col)
          .sort((a, b) => compareIncidents(a, b, sortKey, sortDir));

        const avgAge = items.length > 0 ? Math.round(items.reduce((s, i) => s + ageMinFor(i), 0) / items.length) : 0;
        const flagged = items.filter((i) => {
          const s = slaFor(i).state;
          return s === "at-risk" || s === "breached" || s === "missed";
        }).length;
        const isResolved = col === "resolved";

        return (
          <section
            key={col}
            aria-labelledby={`col-${col}-heading`}
            className="flex max-h-[480px] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 xl:h-full xl:max-h-none"
          >
            <div className="shrink-0 border-b border-white/10 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <h2 id={`col-${col}-heading`} className="text-sm font-medium text-zinc-50">
                  {COLUMN_META[col].label}
                </h2>
                <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] tabular-nums text-zinc-300">
                  {items.length}
                </span>
              </div>
              <p className="mt-0.5 truncate text-[11px] tabular-nums text-zinc-400">
                {items.length === 0
                  ? COLUMN_META[col].blurb
                  : isResolved
                    ? flagged > 0
                      ? `Avg ${formatMinutes(avgAge)} to resolve · ${flagged} missed SLA`
                      : `Avg ${formatMinutes(avgAge)} to resolve · all met SLA`
                    : flagged > 0
                      ? `Avg ${formatMinutes(avgAge)} open · ${flagged} need attention`
                      : `Avg ${formatMinutes(avgAge)} open · all on track`}
              </p>
            </div>

            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
              {items.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  pinned={incident.id === pinnedId}
                  onPin={onPin}
                  onHoverStart={onHoverStart}
                  onHoverEnd={onHoverEnd}
                />
              ))}
              {items.length === 0 && (
                <li className="px-2 py-6 text-center text-xs text-zinc-400">No incidents match the current filters.</li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
