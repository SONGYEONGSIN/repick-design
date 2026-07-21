"use client";

import Gauge, { type GaugeZone } from "./Gauge";
import {
  formatErrRate,
  formatMs,
  formatRps,
  formatUptimePct,
  metricsFor,
  round2,
  sloTargetFor,
  type PeriodId,
  type ServiceId,
} from "./data";

function pctZones(breakpoints: [number, number]): GaugeZone[] {
  const [warnAt, badAt] = breakpoints;
  return [
    { from: 0, to: warnAt, tone: "good" },
    { from: warnAt, to: badAt, tone: "warn" },
    { from: badAt, to: 100, tone: "bad" },
  ];
}

export default function GaugeCluster({ scope, period }: { scope: ServiceId | "all"; period: PeriodId }) {
  const snap = metricsFor(scope, period);
  const target = sloTargetFor(scope);
  const budgetBurnPct = round2(100 - snap.errorBudgetRemainingPct);
  const volumeMax = scope === "all" ? 5200 : 2500;

  const uptimeZones: GaugeZone[] = [
    { from: 98.5, to: round2(target - 0.3), tone: "bad" },
    { from: round2(target - 0.3), to: target, tone: "warn" },
    { from: target, to: 100, tone: "good" },
  ];
  const latencyZones: GaugeZone[] = [
    { from: 0, to: 250, tone: "good" },
    { from: 250, to: 450, tone: "warn" },
    { from: 450, to: 800, tone: "bad" },
  ];
  const errRateZones: GaugeZone[] = [
    { from: 0, to: 0.1, tone: "good" },
    { from: 0.1, to: 0.4, tone: "warn" },
    { from: 0.4, to: 1, tone: "bad" },
  ];
  const burnZones: GaugeZone[] = pctZones([60, 85]);
  const volumeZones: GaugeZone[] = [
    { from: 0, to: round2(volumeMax * 0.7), tone: "good" },
    { from: round2(volumeMax * 0.7), to: round2(volumeMax * 0.9), tone: "warn" },
    { from: round2(volumeMax * 0.9), to: volumeMax, tone: "bad" },
  ];

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Gauge
          size="hero"
          label="Uptime SLO"
          value={snap.uptimePct}
          min={98.5}
          max={100}
          target={target}
          zones={uptimeZones}
          formatValue={formatUptimePct}
          caption={`vs. ${formatUptimePct(target)} target`}
          className="mx-auto max-w-[300px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:col-span-7">
        <Gauge
          size="md"
          label="Error Budget Burn"
          value={budgetBurnPct}
          min={0}
          max={100}
          zones={burnZones}
          formatValue={(v) => `${v}%`}
          caption={`${snap.errorBudgetRemainingPct}% budget left`}
        />
        <Gauge size="md" label="P99 Latency" value={snap.p99LatencyMs} min={0} max={800} zones={latencyZones} formatValue={formatMs} caption="rolling window" />
        <Gauge
          size="md"
          label="Request Volume"
          value={snap.requestRateRps}
          min={0}
          max={volumeMax}
          zones={volumeZones}
          formatValue={formatRps}
          caption={`of ${formatRps(volumeMax)} capacity`}
        />
        <Gauge
          size="md"
          label="Error Rate"
          value={snap.errorRatePct}
          min={0}
          max={1}
          zones={errRateZones}
          formatValue={formatErrRate}
          formatPrecise={formatErrRate}
          caption="5xx of all responses"
        />
      </div>
    </div>
  );
}
