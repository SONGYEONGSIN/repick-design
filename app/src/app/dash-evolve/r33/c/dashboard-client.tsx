"use client";

/**
 * Owns the two pieces of page state: `period` (This period / Last period)
 * and `pinnedStage` (which funnel stage's cohort breakdown is showing).
 *
 * Exclusion, stated plainly per the brief: pinning a funnel stage drives
 * EXACTLY ONE consumer — the CohortTable below it. It intentionally does
 * NOT reset, filter, or recompute the HeroStats block, the trend sparkline,
 * or the funnel's own printed numbers. Those three already respond to
 * `period` only. The funnel's hover tooltip is a third, fully separate
 * piece of state (local to funnel.tsx) that drives nothing outside itself.
 * Three independent state surfaces, each feeding exactly one destination —
 * no shared "selection" threaded through every widget on the page.
 */

import { useMemo, useState } from "react";
import { Funnel } from "./funnel";
import { HeroStats } from "./hero-stats";
import { CohortTable } from "./cohort-table";
import { Card, SegmentedControl, SectionLabel } from "./ui";
import type { PaletteCommand } from "./command-palette";
import { Shell } from "./shell";
import {
  FUNNEL_DATA,
  PERIOD_META,
  STAGE_ORDER,
  STAGE_META,
  type PeriodId,
  type StageId,
} from "./data";

const PERIOD_OPTIONS: { value: PeriodId; label: string }[] = [
  { value: "current", label: PERIOD_META.current.label },
  { value: "previous", label: PERIOD_META.previous.label },
];

export function DashboardClient() {
  const [period, setPeriod] = useState<PeriodId>("current");
  const [pinnedStage, setPinnedStage] = useState<StageId>("visitor");

  const stages = FUNNEL_DATA[period];

  const paletteCommands: PaletteCommand[] = useMemo(() => {
    const periodCommands: PaletteCommand[] = PERIOD_OPTIONS.filter((o) => o.value !== period).map((o) => ({
      id: `period-${o.value}`,
      label: `Switch to ${o.label}`,
      hint: "View toggle",
      onRun: () => setPeriod(o.value),
    }));
    const pinCommands: PaletteCommand[] = STAGE_ORDER.filter((id) => id !== pinnedStage).map((id) => ({
      id: `pin-${id}`,
      label: `Pin: ${STAGE_META[id].label}`,
      hint: "Funnel stage",
      onRun: () => setPinnedStage(id),
    }));
    return [...periodCommands, ...pinCommands];
  }, [period, pinnedStage]);

  return (
    <Shell paletteCommands={paletteCommands}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:col-span-12">
            <div>
              <SectionLabel>Arcway Growth</SectionLabel>
              <h1 className="mt-1 text-2xl font-bold text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
                Conversion funnel
              </h1>
              <p className="mt-1 max-w-xl text-sm text-zinc-400">
                Visitor-to-retained pipeline for Arcway&rsquo;s self-serve product. Pin a stage to see its cohort breakdown.
              </p>
            </div>
            <SegmentedControl label="Reporting period" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
          </header>

          <div className="min-w-0 lg:col-span-12">
            <HeroStats period={period} />
          </div>

          <Card as="section" className="min-w-0 p-5 sm:p-6 lg:col-span-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-zinc-50">Signup-to-retention funnel</h2>
              <p className="text-xs text-zinc-400">{PERIOD_META[period].range}</p>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Every stage prints its count and stage-over-stage drop-off at rest. Hover or focus a stage for cumulative detail
              &mdash; click to pin its cohort breakdown below.
            </p>
            <div className="mt-5">
              <Funnel stages={stages} pinnedStage={pinnedStage} onPin={setPinnedStage} />
            </div>
          </Card>

          <div className="min-w-0 lg:col-span-12">
            <CohortTable period={period} stageId={pinnedStage} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
