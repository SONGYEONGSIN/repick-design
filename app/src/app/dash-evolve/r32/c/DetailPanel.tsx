"use client";

import { AlertTriangle, ArrowRight, Pin, PinOff, Repeat2, ShieldAlert } from "lucide-react";
import {
  statsFor,
  pathById,
  pathSharePct,
  stageById,
  bottleneckStageId,
  medianDwellDays,
  formatCount,
  formatPct,
  formatDays,
  type PeriodId,
  type Selection,
} from "./data";
import { cx, Card, Badge, FOCUS_RING } from "./ui";

export default function DetailPanel({ period, selection, onClear }: { period: PeriodId; selection: Selection; onClear: () => void }) {
  if (!selection) {
    return (
      <Card className="flex flex-col items-center justify-center gap-2 border-dashed py-8 text-center">
        <Pin aria-hidden className="h-5 w-5 text-zinc-300" />
        <p className="text-[12.5px] text-zinc-500">Click a stage on the map, or a path below, to pin its detail here.</p>
      </Card>
    );
  }

  if (selection.kind === "stage") {
    const stats = statsFor(selection.id, period);
    const bottleneckId = bottleneckStageId(period);
    const isBottleneck = selection.id === bottleneckId;
    const median = medianDwellDays(period);
    const dwellRatio = stats.dwellDays !== null && median > 0 ? stats.dwellDays / median : null;
    const Icon = stats.stage.icon;

    return (
      <Card>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-zinc-900">
              <Icon aria-hidden className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-zinc-900">{stats.stage.label}</p>
              <p className="text-[11px] text-zinc-500">Pinned stage</p>
            </div>
          </div>
          <button type="button" onClick={onClear} aria-label="Clear pinned stage" className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700", FOCUS_RING)}>
            <PinOff aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-[12.5px] text-zinc-600">{stats.stage.description}</p>

        {isBottleneck && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5">
            <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p className="text-[12px] text-zinc-800">
              <span className="font-semibold">Bottleneck.</span> Average dwell is {dwellRatio !== null ? `${dwellRatio.toFixed(1)}×` : "—"} the across-stage median, and{" "}
              {formatCount(stats.pooled)} cases ({formatPct((stats.pooled / Math.max(1, stats.inbound)) * 100, 1)} of inbound) are currently pooled here awaiting review.
            </p>
          </div>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Inbound</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatCount(stats.inbound)}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Outbound</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatCount(stats.outbound)}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">{stats.stage.terminal ? "Closed here" : "Pooled now"}</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatCount(stats.stage.terminal ? stats.inbound : stats.pooled)}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Avg dwell</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{stats.dwellDays !== null ? formatDays(stats.dwellDays) : "—"}</dd>
          </div>
        </dl>

        {stats.outgoing.length > 0 && (
          <div className="mt-4">
            <p className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Where outbound cases go</p>
            <ul className="mt-1.5 space-y-1.5">
              {stats.outgoing.map((o) => (
                <li key={o.edge.id} className="flex items-center justify-between gap-2 text-[12.5px]">
                  <span className="flex min-w-0 items-center gap-1.5 text-zinc-700">
                    <ArrowRight aria-hidden className="h-3 w-3 shrink-0 text-zinc-400" />
                    <span className="truncate">{o.to.label}</span>
                    {o.edge.loop && <Repeat2 aria-hidden className="h-3 w-3 shrink-0 text-amber-600" />}
                  </span>
                  <span className="shrink-0 tabular-nums text-zinc-500">
                    {formatCount(o.edge.volume[period])} · {formatPct(o.pct, 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    );
  }

  const path = pathById(selection.id);
  const share = pathSharePct(path, period);

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-zinc-900">{path.label}</p>
          <p className="text-[11px] text-zinc-500">Pinned path</p>
        </div>
        <button type="button" onClick={onClear} aria-label="Clear pinned path" className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700", FOCUS_RING)}>
          <PinOff aria-hidden className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-[12.5px] text-zinc-600">{path.note}</p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={path.outcome === "refunded" ? "emerald" : "rose"}>{path.outcome === "refunded" ? "Refunded" : "Returned to seller"}</Badge>
        {path.throughEscalation && (
          <Badge tone="neutral">
            <ShieldAlert aria-hidden className="h-3 w-3" />
            Via escalation
          </Badge>
        )}
        {path.hasLoop && (
          <Badge tone="amber" className="border border-amber-300">
            <Repeat2 aria-hidden className="h-3 w-3" />
            Re-inspection loop
          </Badge>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Share of total</dt>
          <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatPct(share, 1)}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Cases</dt>
          <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatCount(path.volume[period])}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Avg end-to-end duration</dt>
          <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{formatDays(path.avgDurationDays[period])}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-[10.5px] font-medium uppercase tracking-wide text-zinc-500">Sequence</p>
        <ol className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-[12px]">
          {path.stages.map((sid, i) => (
            <li key={`${sid}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ArrowRight aria-hidden className="h-3 w-3 text-zinc-300" />}
              <span className={cx("rounded-md px-1.5 py-0.5", i === path.stages.length - 1 ? "bg-amber-100 font-medium text-zinc-900" : "bg-zinc-100 text-zinc-700")}>{stageById(sid).short}</span>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
