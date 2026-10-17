"use client";

import { X } from "lucide-react";
import { SeverityBadge, SlaPill, Avatar, FOCUS_RING } from "./ui";
import { formatMinutes, formatCompact, ageMinFor, COLUMN_META, type Incident } from "./data";

/**
 * The one supporting widget beside the board — a slim, always-visible strip. It is driven
 * ONLY by the persistent pin (a card click), never by hover, which is the point of the
 * pin/hover split: this panel holds still while the pointer wanders the board.
 */
export function InspectorStrip({ incident, onClear }: { incident: Incident | null; onClear: () => void }) {
  return (
    <section
      aria-labelledby="inspector-heading"
      className={`rounded-xl border px-4 py-3 ${incident ? "border-emerald-400/30 bg-zinc-900" : "border-white/10 bg-zinc-900"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="inspector-heading" className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Inspector &middot; pinned incident
        </h2>
        {incident && (
          <button
            type="button"
            onClick={onClear}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Clear pinned incident</span>
          </button>
        )}
      </div>

      {!incident ? (
        <p className="mt-1.5 text-sm text-zinc-300">
          Click any card to pin it here. Hovering or tabbing to a card shows a quick preview without pinning.
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <SeverityBadge severity={incident.severity} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-50">{incident.title}</p>
              <p className="truncate text-xs text-zinc-400">
                {incident.service} &middot; {COLUMN_META[incident.column].label} &middot; {incident.squad}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-zinc-300">
              <Avatar initials={incident.assignee?.initials ?? null} size={20} />
              {incident.assignee?.name ?? "Unassigned"}
            </span>
            <span className="whitespace-nowrap text-xs tabular-nums text-zinc-400">
              {formatMinutes(ageMinFor(incident))} {incident.column === "resolved" ? "total" : "open"}
            </span>
            <SlaPill incident={incident} />
            <span className="whitespace-nowrap text-xs tabular-nums text-zinc-400">
              {formatCompact(incident.impacted)} impacted
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
