"use client";

import { Bot, Clock3, Smile } from "lucide-react";
import { Card, CardHeader, ProgressBar } from "./ui";
import { COVERAGE, PERIOD_STATS } from "./data";
import { formatPercent } from "./format";
import { MiniSparkline } from "./sparkline";
import type { Period } from "./types";

export function AutomationCard({ period }: { period: Period }) {
  const stat = PERIOD_STATS[period];
  const titleId = "automation-title";
  return (
    <Card as="section" id="automation-card" aria-labelledby={titleId} className="flex flex-col">
      <CardHeader icon={<Bot className="h-4 w-4" aria-hidden="true" />} title="Automation deflection" titleId={titleId} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
        <div>
          <span className="text-3xl font-bold whitespace-nowrap text-zinc-50 tabular-nums">
            {formatPercent(stat.automationDeflectionPct)}
          </span>
          <p className="mt-1 text-[12px] text-zinc-400">Share resolved by chatbots and macros without agent involvement · {stat.shortLabel}</p>
        </div>
        <div className="h-10 w-full">
          <MiniSparkline values={stat.automationSparkline} strokeColor="rgb(129 140 248)" />
        </div>
      </div>
    </Card>
  );
}

export function CsatCard({ period }: { period: Period }) {
  const stat = PERIOD_STATS[period];
  const titleId = "csat-title";
  return (
    <Card as="section" id="csat-card" aria-labelledby={titleId} className="flex flex-col">
      <CardHeader icon={<Smile className="h-4 w-4" aria-hidden="true" />} title="Customer satisfaction" titleId={titleId} />
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
        <div>
          <span className="text-3xl font-bold whitespace-nowrap text-zinc-50 tabular-nums">
            {stat.csatScore.toFixed(1)}
            <span className="text-base font-normal text-zinc-400"> / 5.0</span>
          </span>
          <p className="mt-1 text-[12px] text-zinc-400">Average post-ticket survey score · {stat.shortLabel}</p>
        </div>
        <div className="h-10 w-full">
          <MiniSparkline values={stat.csatSparkline} strokeColor="rgb(52 211 153)" />
        </div>
      </div>
    </Card>
  );
}

export function CoverageCard() {
  const titleId = "coverage-title";
  return (
    <Card as="section" id="coverage-card" aria-labelledby={titleId} className="flex flex-col">
      <CardHeader icon={<Clock3 className="h-4 w-4" aria-hidden="true" />} title="Shift coverage" titleId={titleId} />
      <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-3 sm:px-5">
        {COVERAGE.map((shift) => (
          <div key={shift.shift} className="min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[13px] font-medium text-zinc-100">{shift.shift}</span>
              <span className="shrink-0 text-[11px] whitespace-nowrap text-zinc-400 tabular-nums">{shift.hours}</span>
            </div>
            <p className="mt-0.5 text-[12px] whitespace-nowrap text-zinc-400 tabular-nums">
              {shift.agents} agents · {shift.utilizationPct}% utilization
            </p>
            <ProgressBar
              className="mt-2"
              value={shift.utilizationPct}
              label={`${shift.shift} utilization ${shift.utilizationPct}%`}
              barClassName={shift.utilizationPct >= 85 ? "bg-rose-400" : shift.utilizationPct >= 65 ? "bg-amber-400" : "bg-emerald-400"}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
