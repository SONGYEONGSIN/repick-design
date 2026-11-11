"use client";

import { AlertTriangle, CheckCircle2, MousePointerClick, Target } from "lucide-react";
import type { PeriodData } from "../lib/data";
import { formatCount, formatDuration, formatMultiple, formatPercent, stageById } from "../lib/data";
import { Card, FieldLabel } from "./ui";

/**
 * The ONE consumer of `pinnedStageId`. Clicking a stage name — in the process map or in the path
 * table — updates only this card. The hero stats above stay deliberately un-synced to the pin:
 * they always describe the whole pipeline, not whichever stage someone last clicked, so the
 * headline story never gets quietly swapped out from under a reader.
 */
export function StageDetailCard({ data, pinnedStageId }: { data: PeriodData; pinnedStageId: string | null }) {
  const stage = pinnedStageId ? stageById(data, pinnedStageId) : undefined;

  if (!stage) {
    return (
      <Card className="flex h-full min-w-0 flex-col items-start justify-center gap-2 text-center sm:items-center">
        <MousePointerClick className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="text-sm font-normal text-zinc-400">
          Pin a stage from the table to inspect its pass rate, duration and SLA budget here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full min-w-0">
      <FieldLabel>Stage Inspector</FieldLabel>
      <h3 className="mt-1.5 text-lg font-semibold text-zinc-50">{stage.name}</h3>
      <p className="mt-1 text-sm font-normal text-zinc-400">{stage.description}</p>

      {/* A plain grid, not a <dl> — axe's definition-list audit is a hard-fail in this project and
         this is a metric tile grid, not a semantic glossary, so there is no reason to risk it. */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Entered" value={formatCount(stage.entered)} />
        <Metric label="Passed" value={formatCount(stage.passed)} />
        <Metric label="Pass rate" value={formatPercent(1 - stage.failRate)} />
        <Metric label="Avg duration" value={formatDuration(stage.avgDurationMin)} />
      </div>

      <div
        className={`mt-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 ${
          stage.overSla ? "border-amber-400/25 bg-amber-400/[7%]" : "border-emerald-400/20 bg-emerald-400/[6%]"
        }`}
      >
        {stage.overSla ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
        )}
        <p className="text-xs font-normal text-zinc-400">
          {stage.overSla ? (
            <>
              Running at{" "}
              <span className="font-mono tabular-nums text-amber-400">{formatMultiple(stage.slaMultiple)}</span> its{" "}
              {formatDuration(stage.slaMin)} SLA budget — {formatDuration(stage.avgDurationMin)} actual.
            </>
          ) : (
            <>
              Within its {formatDuration(stage.slaMin)} SLA budget — {formatDuration(stage.avgDurationMin)} actual.
            </>
          )}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-normal text-zinc-400">
        <Target className="h-3.5 w-3.5 shrink-0 text-violet-400" aria-hidden="true" />
        Impact score {formatCount(Math.round(stage.impactScore))} &middot; failed builds &times; minutes held
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-white/5 px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">{label}</div>
      <div className="mt-0.5 truncate font-mono text-base font-semibold tabular-nums text-zinc-50">{value}</div>
    </div>
  );
}
