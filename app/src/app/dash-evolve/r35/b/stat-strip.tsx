"use client";

import { Gauge, Server, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import {
  ERROR_SERIES,
  LATENCY_SERIES,
  REGION_NODES,
  THROUGHPUT_SERIES,
  formatDeltaPct,
  formatErrorPct,
  formatMs,
  formatReq,
  regionLabel,
  seriesValueAt,
  type RegionId,
} from "./data";
import { NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";

export default function StatStrip({ region, tick }: { region: RegionId; tick: number }) {
  const throughputSeries = THROUGHPUT_SERIES[region];
  const current = seriesValueAt(throughputSeries, tick, 0);
  const trailing = seriesValueAt(throughputSeries, tick, 30);
  const deltaPct = trailing === 0 ? 0 : ((current - trailing) / trailing) * 100;
  const trendUp = deltaPct >= 0;

  const latency = seriesValueAt(LATENCY_SERIES[region], tick, 0);
  const errorRate = seriesValueAt(ERROR_SERIES[region], tick, 0);
  const nodes = REGION_NODES[region];

  return (
    <div className="grid grid-cols-2 gap-4 sm:flex sm:items-stretch sm:gap-0 sm:divide-x sm:divide-zinc-200 sm:rounded-2xl sm:border sm:border-zinc-200 sm:bg-white sm:px-6 sm:py-5 sm:shadow-sm sm:shadow-zinc-900/[0.03]">
      <div className="col-span-2 sm:flex-[1.6] sm:pr-6">
        <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{`Current throughput — ${regionLabel(region)}`}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className={cx("text-4xl font-semibold leading-none tracking-tight sm:text-5xl", NUM, TEXT_PRIMARY)}>{formatReq(current)}</p>
          <span className={cx("text-sm font-medium", TEXT_MUTED)}>req/s</span>
          <span className={cx("ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium", NUM, trendUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
            {trendUp ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
            {formatDeltaPct(deltaPct)}
          </span>
        </div>
        <p className={cx("mt-1 text-xs font-normal", TEXT_AUX)}>vs. 30s ago — this number always reflects the live point, independent of the chart&apos;s scrub control below</p>
      </div>

      <div className="col-span-2 grid grid-cols-3 gap-3 sm:contents">
        <div className="min-w-0 sm:flex-1 sm:px-6">
          <p className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
            <Gauge size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate">p95 latency</span>
          </p>
          <p className={cx("mt-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>
            {formatMs(latency)}
            <span className={cx("ml-1 text-sm font-medium", TEXT_MUTED)}>ms</span>
          </p>
        </div>

        <div className="min-w-0 sm:flex-1 sm:px-6">
          <p className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
            <ShieldAlert size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate">Error rate</span>
          </p>
          <p className={cx("mt-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>{formatErrorPct(errorRate)}</p>
        </div>

        <div className="min-w-0 sm:flex-1 sm:pl-6">
          <p className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
            <Server size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate">Healthy nodes</span>
          </p>
          <p className={cx("mt-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>
            {nodes.healthy}
            <span className={cx("ml-1 text-sm font-medium", TEXT_MUTED)}>{`/ ${nodes.total}`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
