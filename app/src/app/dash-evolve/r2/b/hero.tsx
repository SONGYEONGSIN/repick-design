"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, Gauge } from "lucide-react";
import { Card, FilterRadioGroup, SegmentedControl } from "./ui";
import { CrosshairChart } from "./sparkline";
import {
  AGENTS,
  CHANNEL_FILTERS,
  PERIOD_STATS,
  channelAvgResponseSeconds,
  channelSparkline,
} from "./data";
import { formatDuration, formatNumber, formatPercent } from "./format";
import type { ChannelFilter, Period } from "./types";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "24h", label: "24시간" },
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
];

export function Hero({
  period,
  channel,
  onPeriodChange,
  onChannelChange,
}: {
  period: Period;
  channel: ChannelFilter;
  onPeriodChange: (p: Period) => void;
  onChannelChange: (c: ChannelFilter) => void;
}) {
  const stat = PERIOD_STATS[period];

  const avgSeconds = channel === "all" ? stat.avgResponseSeconds : channelAvgResponseSeconds(period, channel);
  const seriesValues = channel === "all" ? stat.sparkline : channelSparkline(period, channel);
  const points = useMemo(
    () => seriesValues.map((value, i) => ({ label: stat.sparklineLabels[i] ?? "", value })),
    [seriesValues, stat.sparklineLabels]
  );

  const deltaSeconds = points[points.length - 1].value - points[0].value;
  const improved = deltaSeconds <= 0;
  const deltaAbs = Math.abs(deltaSeconds);
  const deltaLabel = deltaAbs < 60 ? `${deltaAbs}초` : formatDuration(deltaAbs);

  const totalTickets = channel === "all" ? stat.totalHandled : stat.channelHandled[channel];
  const activeAgents =
    channel === "all"
      ? AGENTS.filter((a) => a.status !== "offline").length
      : AGENTS.filter((a) => a.primaryChannel === channel && a.status !== "offline").length;

  const slaWithin = stat.slaByPriority.reduce((sum, p) => sum + p.within, 0);
  const slaTotal = stat.slaByPriority.reduce((sum, p) => sum + p.within + p.atRisk + p.breached, 0);
  const slaPct = Math.round((slaWithin / slaTotal) * 100);

  const channelLabel = channel === "all" ? "전체 채널" : CHANNEL_FILTERS.find((c) => c.value === channel)?.label ?? "";

  const statItems = [
    { label: "총 티켓", value: formatNumber(totalTickets), unit: "건" },
    { label: "SLA 준수율", value: formatPercent(slaPct), unit: "" },
    { label: "해결율", value: formatPercent(stat.resolutionRatePct), unit: "" },
    { label: "활성 에이전트", value: formatNumber(activeAgents), unit: "명" },
  ];

  return (
    <Card as="section" aria-labelledby="hero-heading" className="p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h2
          id="hero-heading"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase"
        >
          <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
          SLA 히어로 지표
        </h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterRadioGroup
            name="channel-filter"
            ariaLabel="채널 필터"
            options={CHANNEL_FILTERS}
            value={channel}
            onChange={onChannelChange}
          />
          <SegmentedControl ariaLabel="기간 토글" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-7">
          <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
            평균 응답 시간 · {channelLabel} · {stat.shortLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-[clamp(2.75rem,6vw,5.25rem)] leading-none font-bold tracking-tight whitespace-nowrap text-zinc-50 tabular-nums">
              {formatDuration(avgSeconds)}
            </span>
            <span
              className={`mb-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium whitespace-nowrap ${
                improved
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-400/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {improved ? <ArrowDown className="h-3 w-3" aria-hidden="true" /> : <ArrowUp className="h-3 w-3" aria-hidden="true" />}
              {deltaLabel} {improved ? "개선" : "증가"}
            </span>
          </div>

          <div className="mt-5">
            <CrosshairChart
              points={points}
              formatValue={(v) => formatDuration(Math.round(v))}
              ariaTitle={`${stat.shortLabel} 평균 응답 시간 추이`}
            />
          </div>
        </div>

        <div className="min-w-0 divide-y divide-white/10 border-t border-white/10 pt-1 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          {statItems.map((item) => (
            <div key={item.label} className="flex items-baseline justify-between gap-3 py-3 first:pt-0 lg:first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">{item.label}</span>
              <span className="text-xl font-semibold whitespace-nowrap text-zinc-50 tabular-nums">
                {item.value}
                {item.unit && <span className="ml-1 text-[13px] font-normal text-zinc-500">{item.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
