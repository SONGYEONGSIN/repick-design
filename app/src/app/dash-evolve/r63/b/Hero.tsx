"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ACTIVE_FLAGS, ELIGIBLE_ACTIVE_TOTAL, ENROLLED_ACTIVE_TOTAL, ENROLLED_PCT, HERO_TREND, numberFmt } from "./data";
import { Card, DISPLAY_FACE, NUM, Sparkline } from "./ui";

/**
 * Workspace-wide hero metric. This is the page's one deliberate visual anchor — large typography,
 * not a chart — and it is a fixed aggregate over every active flag's current state. It
 * intentionally does NOT take a `selectedFlagId` prop and never recomputes when a table row is
 * selected: selecting a flag only updates `FlagDetailPanel`, a separately-scoped widget. Keeping
 * this number workspace-wide (rather than re-scoping it to whatever is selected) is the deliberate
 * choice this round is testing — see candidates/b.md.
 */
export function Hero() {
  const deltaPts = Math.round((ENROLLED_PCT - HERO_TREND[0]) * 10) / 10;
  const trendingUp = deltaPts >= 0;
  const TrendIcon = trendingUp ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="flex h-full min-w-0 flex-col justify-between">
      <span className="block text-[11px] font-medium uppercase tracking-wide text-zinc-500">Workspace enrollment</span>

      <div className="mt-2 flex min-w-0 flex-wrap items-end gap-4">
        <span className={`text-6xl font-semibold leading-none text-zinc-900 ${NUM}`} style={DISPLAY_FACE}>
          {ENROLLED_PCT}%
        </span>
        <Sparkline
          data={HERO_TREND}
          width={112}
          height={32}
          strokeClassName="stroke-lime-600"
          ariaLabel={`Enrollment trend over the last 7 checkpoints: from ${HERO_TREND[0]} to ${ENROLLED_PCT} percent.`}
        />
      </div>

      <p className="mt-3 min-w-0 text-sm text-zinc-600">
        of eligible users enrolled across{" "}
        <span className={`font-medium text-zinc-900 ${NUM}`}>{ACTIVE_FLAGS.length}</span> active flags
      </p>

      <p
        className={`mt-2 flex min-w-0 items-center gap-1 text-xs font-medium ${NUM} ${trendingUp ? "text-lime-700" : "text-amber-700"}`}
      >
        <TrendIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {trendingUp ? "+" : ""}
        {deltaPts} pts over the last 7 checkpoints
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        {numberFmt.format(ENROLLED_ACTIVE_TOTAL)} of {numberFmt.format(ELIGIBLE_ACTIVE_TOTAL)} eligible users
      </p>
    </Card>
  );
}
