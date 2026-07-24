"use client";

import { ArrowRight } from "lucide-react";
import {
  formatCount,
  formatPct,
  STAGE_COUNTS,
  STAGES,
  stagePct,
  stageRetentionPct,
  trendSeries,
  transitionsForPeriod,
  type PeriodId,
} from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Card, CardHeader, EyebrowLabel, Progress } from "./ui";
import TrendChart from "./TrendChart";

export default function StageDetailPanel({ selectedIdx, period }: { selectedIdx: number; period: PeriodId }) {
  const stage = STAGES[selectedIdx];
  const Icon = stage.Icon;
  const count = STAGE_COUNTS[period][selectedIdx];
  const pctOfTotal = stagePct(period, selectedIdx);
  const retention = stageRetentionPct(period, selectedIdx);
  const transitions = transitionsForPeriod(period);
  const incoming = selectedIdx > 0 ? transitions[selectedIdx - 1] : null;

  const trend = trendSeries(selectedIdx, period);
  const isVolume = selectedIdx === 0;

  return (
    <Card className="flex h-full flex-col" padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader
          title="Stage detail"
          titleId="stage-detail-heading"
          description="Selecting a funnel stage syncs this panel and the segment table below."
        />
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <Icon size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className={cx("truncate text-base font-semibold", TEXT_PRIMARY)}>{stage.label}</p>
            <p className={cx("text-xs", TEXT_CAPTION)}>Stage {selectedIdx + 1} of {STAGES.length}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Sessions" value={formatCount(count)} />
          <Stat label="Of total visits" value={formatPct(pctOfTotal)} />
          {selectedIdx > 0 ? (
            <Stat label="Retained from prior stage" value={formatPct(retention)} valueClass="text-emerald-700 dark:text-emerald-300" />
          ) : (
            <Stat label="Entry point" value="—" />
          )}
          {incoming ? (
            <Stat label="Dropped before this stage" value={formatCount(incoming.dropCount)} valueClass="text-rose-700 dark:text-rose-300" />
          ) : (
            <Stat label="Drop-off" value="n/a" />
          )}
        </div>
      </div>

      {incoming ? (
        <div className={cx("border-t p-4 sm:p-5", BORDER)}>
          <EyebrowLabel>Why they didn&apos;t continue</EyebrowLabel>
          <ul className="mt-2.5 flex flex-col gap-2.5">
            {incoming.reasons.map((r) => (
              <li key={r.label}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={cx("truncate text-xs", TEXT_SECONDARY)}>{r.label}</span>
                  <span className={cx("shrink-0 whitespace-nowrap text-xs tabular-nums", TEXT_CAPTION)}>
                    {formatCount(r.count)} · {r.pct}%
                  </span>
                </div>
                <Progress pct={r.pct} tone={r.label === "Other reasons" ? "neutral" : "down"} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={cx("flex-1 border-t p-4 sm:p-5", BORDER)}>
        <div className="mb-2 flex items-center justify-between">
          <EyebrowLabel>{isVolume ? "Weekly session volume" : `Retention from ${STAGES[selectedIdx - 1].label}`}</EyebrowLabel>
          <span className={cx("inline-flex items-center gap-1 text-xs", TEXT_CAPTION)}>
            12 weeks <ArrowRight size={11} aria-hidden="true" />
          </span>
        </div>
        <TrendChart
          points={trend}
          formatValue={(v) => (isVolume ? `${v}k sessions/wk` : `${v}%`)}
          ariaLabel={isVolume ? "Weekly session volume, last 12 weeks" : `Retention rate into ${stage.label}, last 12 weeks`}
          strokeClass="stroke-violet-600 dark:stroke-violet-400"
          fillClass="fill-violet-600 dark:fill-violet-400"
        />
      </div>
    </Card>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-950">
      <EyebrowLabel>{label}</EyebrowLabel>
      <p className={cx("mt-0.5 truncate text-sm font-semibold tabular-nums", valueClass ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

