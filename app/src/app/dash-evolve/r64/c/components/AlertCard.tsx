"use client";

import { Clock3 } from "lucide-react";
import { analystOf, categoryOf, isActiveStatus, slaBurnPercent, type Alert } from "../lib/data";
import { formatAge, formatPercent } from "../lib/format";
import { Avatar, FOCUS_RING, ProgressBar, SeverityBadge, StatusBadge } from "./ui";

const SEVERITY_RAIL: Record<Alert["severity"], string> = {
  critical: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-zinc-300",
};

/**
 * Two independently-scoped interactions live on this one card, deliberately kept apart:
 *  - Click/Enter sets the page-level `pinnedId`, which only ever reaches InspectorPanel as a
 *    prop — this card shows its own pinned state (`aria-pressed`) because it is the thing that
 *    was pressed, not because any other widget was rebuilt from that id.
 *  - `hover:`/`focus-within:` below is pure CSS, local to this component's own box. No state is
 *    lifted for it, so it can never leak into the queue summary or any sibling card — the
 *    ephemeral, non-persistent highlight the brief asks for.
 */
export function AlertCard({ alert, pinned, onPin }: { alert: Alert; pinned: boolean; onPin: (id: string) => void }) {
  const category = categoryOf(alert.category);
  const analyst = analystOf(alert.analystId);
  const burn = slaBurnPercent(alert);

  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={() => onPin(alert.id)}
        aria-pressed={pinned}
        className={`group flex w-full min-w-0 items-stretch gap-0 overflow-hidden rounded-xl border text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
          pinned ? "border-orange-300 bg-orange-50/50" : "border-zinc-200 bg-white hover:bg-zinc-50 focus-within:bg-zinc-50"
        }`}
      >
        <span className={`w-1 shrink-0 ${SEVERITY_RAIL[alert.severity]}`} aria-hidden="true" />
        <span className="flex min-w-0 flex-1 flex-col gap-2 px-3.5 py-3">
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            <StatusBadge status={alert.status} />
            <span className="min-w-0 flex-1 truncate text-[11px] uppercase tracking-wide text-zinc-600">{category.shortLabel}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-zinc-600">
              <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
              {formatAge(alert.ageMinutes)}
            </span>
          </span>

          <span className="block min-w-0 text-sm font-medium leading-snug text-zinc-900">{alert.title}</span>

          {/* zinc-600, not -500: this card's own background tints to orange-50 while pinned, and
             zinc-500 falls under the 4.5:1 floor on that tinted surface — see page-brief-core §2. */}
          <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
            <span className="min-w-0 max-w-full truncate">{alert.asset}</span>
            <span className="min-w-0 max-w-full truncate text-zinc-600">{alert.source}</span>
          </span>

          <span className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              {analyst ? (
                <>
                  <Avatar name={analyst.name} initials={analyst.initials} size={18} />
                  <span className="min-w-0 truncate text-xs text-zinc-600">{analyst.name}</span>
                </>
              ) : (
                <span className="text-xs text-zinc-600">Unassigned</span>
              )}
            </span>
            {isActiveStatus(alert.status) && burn !== null ? (
              <span className="flex min-w-0 shrink-0 items-center gap-1.5">
                <span className="w-14 shrink-0">
                  <ProgressBar percent={burn} tone={burn >= 100 ? "bg-rose-600" : burn >= 70 ? "bg-amber-500" : "bg-orange-600"} />
                </span>
                <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums text-zinc-600">{formatPercent(burn)} SLA</span>
              </span>
            ) : null}
          </span>
        </span>
      </button>
    </li>
  );
}
