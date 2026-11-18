"use client";

import { MousePointerClick, RotateCcw } from "lucide-react";
import { FLAG_BY_ID, numberFmt } from "./data";
import { Badge, Card, InitialsAvatar, NUM, SectionLabel, Sparkline, StatusBadge } from "./ui";

/**
 * Independently-scoped detail widget. Selecting a row in `FlagTable` updates only this panel —
 * never the hero or the stat tiles above, which stay fixed workspace-wide aggregates (see the
 * comment in Hero.tsx). This is the tier-2 half of the fan-out: one selection, one other widget.
 */
export function FlagDetailPanel({ selectedId }: { selectedId: string | null }) {
  const flag = selectedId ? FLAG_BY_ID.get(selectedId) ?? null : null;

  if (!flag) {
    return (
      <Card className="flex h-full min-w-0 flex-col items-center justify-center gap-2 py-12 text-center">
        <MousePointerClick className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="max-w-[220px] text-sm text-zinc-500">Select a flag from the table to see its rollout history and details.</p>
      </Card>
    );
  }

  const first = flag.history[0];
  const last = flag.history[flag.history.length - 1];

  return (
    <Card className="flex h-full min-w-0 flex-col">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <SectionLabel>Flag detail</SectionLabel>
          <h3 className="truncate text-base font-semibold text-zinc-900">{flag.name}</h3>
          <p className="truncate text-xs text-zinc-500">{flag.key}</p>
        </div>
        <StatusBadge status={flag.status} />
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Rollout history</span>
          <span className={`text-xs text-zinc-500 ${NUM}`}>
            {first}% → {last}%
          </span>
        </div>
        <div className="mt-2">
          <Sparkline
            data={flag.history}
            width={220}
            height={40}
            strokeClassName="stroke-lime-600"
            ariaLabel={`${flag.name} rollout history over 7 checkpoints: from ${first} to ${last} percent.`}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
        <div>
          <dt className="text-xs text-zinc-500">Eligible users</dt>
          <dd className={`mt-0.5 text-sm font-medium text-zinc-900 ${NUM}`}>{numberFmt.format(flag.eligibleUsers)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Enrolled users</dt>
          <dd className={`mt-0.5 text-sm font-medium text-zinc-900 ${NUM}`}>{numberFmt.format(flag.enrolledUsers)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs text-zinc-500">
            <RotateCcw className="h-3 w-3 shrink-0" aria-hidden="true" />
            Rollbacks this month
          </dt>
          <dd className={`mt-0.5 text-sm font-medium text-zinc-900 ${NUM}`}>{flag.rollbackEventsThisMonth}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Last changed</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-900">{flag.lastChangedLabel}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <SectionLabel>Segments</SectionLabel>
        <div className="mt-2 flex min-w-0 flex-wrap gap-1.5">
          {flag.segments.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-center gap-2.5 border-t border-zinc-100 pt-4">
        <InitialsAvatar initials={flag.owner.initials} size={28} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">{flag.owner.name}</p>
          <p className="truncate text-xs text-zinc-500">Flag owner</p>
        </div>
      </div>
    </Card>
  );
}
