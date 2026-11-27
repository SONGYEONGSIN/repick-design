"use client";

import { useMemo } from "react";
import { Repeat, Timer, TrendingDown, TrendingUp, UserMinus, UserPlus } from "lucide-react";
import {
  NOW_IDX,
  PERIODS,
  attritionRate,
  attritionRateSeries,
  avgTimeToFill,
  filledRolesCount,
  formatInt,
  formatSigned,
  headcountAt,
  headcountSeries,
  mobilityRate,
  mobilityRateSeries,
  newRolesOpened,
  newRolesSeries,
  timeToFillSeries,
  type PeriodId,
} from "../lib/data";
import { Card, CardHeader, SegmentedControl, Sparkline } from "./ui";

export function HeroStats({ period, onPeriodChange }: { period: PeriodId; onPeriodChange: (p: PeriodId) => void }) {
  const def = PERIODS.find((p) => p.id === period) ?? PERIODS[0];

  const data = useMemo(() => {
    const startIdx = def.startIdx;
    const now = headcountAt(NOW_IDX);
    const before = headcountAt(startIdx - 1);
    const net = now - before;

    const attrition = attritionRate(startIdx);
    const ttf = avgTimeToFill(startIdx);
    const ttfCount = filledRolesCount(startIdx);
    const opened = newRolesOpened(startIdx);
    const mobility = mobilityRate(startIdx);

    return {
      now,
      before,
      net,
      heroSeries: headcountSeries(startIdx),
      attrition,
      attritionSeries: attritionRateSeries(startIdx),
      ttf,
      ttfCount,
      ttfSeries: timeToFillSeries(startIdx),
      opened,
      openedSeries: newRolesSeries(startIdx),
      mobility,
      mobilitySeries: mobilityRateSeries(startIdx),
    };
  }, [def.startIdx]);

  const netUp = data.net > 0;
  const NetIcon = netUp ? TrendingUp : data.net < 0 ? TrendingDown : TrendingUp;

  return (
    <Card>
      <CardHeader
        title="Overview"
        subtitle={def.longLabel}
        action={
          <SegmentedControl
            ariaLabel="Time range"
            value={period}
            onChange={onPeriodChange}
            options={PERIODS.map((p) => ({ value: p.id, label: p.label }))}
          />
        }
      />

      <div className="grid min-w-0 grid-cols-1 gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        {/* Hero number — the one figure on this page set in the display face. */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-400">Net headcount growth</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className={`text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl ${netUp ? "text-lime-300" : data.net < 0 ? "text-rose-300" : "text-zinc-50"}`}
            >
              {formatSigned(data.net)}
            </span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${netUp ? "text-lime-300" : data.net < 0 ? "text-rose-300" : "text-zinc-400"}`}>
              <NetIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              people
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            <span className="font-medium tabular-nums text-zinc-100">{formatInt(data.now)}</span> total headcount today, up from{" "}
            <span className="tabular-nums">{formatInt(data.before)}</span> at the start of this window.
          </p>
          <div className="mt-4 max-w-[220px]">
            <Sparkline values={data.heroSeries} width={220} height={44} tone="text-lime-300" />
          </div>
        </div>

        {/* Inline stats — icon + label + value, each with its own sparkline, driven by the same
            period toggle as the hero number above. */}
        <dl className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950/60 p-3.5">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <UserMinus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Attrition rate</span>
            </dt>
            <dd className="mt-1.5 flex items-end justify-between gap-2">
              <span className="text-xl font-semibold tabular-nums text-zinc-50">{data.attrition.toFixed(1)}%</span>
              <Sparkline values={data.attritionSeries} tone="text-rose-300" />
            </dd>
          </div>

          <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950/60 p-3.5">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Avg time to fill</span>
            </dt>
            <dd className="mt-1.5 flex items-end justify-between gap-2">
              {data.ttfCount > 0 ? (
                <span className="text-xl font-semibold tabular-nums text-zinc-50">{data.ttf.toFixed(0)}d</span>
              ) : (
                <span className="text-sm text-zinc-400">No roles filled yet</span>
              )}
              <Sparkline values={data.ttfSeries} tone="text-sky-300" />
            </dd>
          </div>

          <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950/60 p-3.5">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <UserPlus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">New roles opened</span>
            </dt>
            <dd className="mt-1.5 flex items-end justify-between gap-2">
              <span className="text-xl font-semibold tabular-nums text-zinc-50">{formatInt(data.opened)}</span>
              <Sparkline values={data.openedSeries} tone="text-violet-300" />
            </dd>
          </div>

          <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950/60 p-3.5">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Repeat className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Internal mobility rate</span>
            </dt>
            <dd className="mt-1.5 flex items-end justify-between gap-2">
              <span className="text-xl font-semibold tabular-nums text-zinc-50">{data.mobility.toFixed(1)}%</span>
              <Sparkline values={data.mobilitySeries} tone="text-lime-300" />
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
