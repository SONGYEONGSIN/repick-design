"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardHeader } from "./ui";
import { PERIOD_STATS, PRIORITY_META } from "./data";
import { formatNumber, formatPercent } from "./format";
import type { Period } from "./types";

const TITLE_ID = "sla-title";

export function SlaComplianceCard({ period }: { period: Period }) {
  const stat = PERIOD_STATS[period];

  return (
    <Card as="section" id="sla-card" aria-labelledby={TITLE_ID} className="flex flex-col">
      <CardHeader icon={<BarChart3 className="h-4 w-4" aria-hidden="true" />} title="우선순위별 SLA 준수" titleId={TITLE_ID} />

      <div className="px-4 py-4 sm:px-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            준수
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            위험
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
            위반
          </span>
          <span className="ml-auto whitespace-nowrap text-zinc-400">{stat.shortLabel} · 전체 채널 기준</span>
        </div>

        <div className="space-y-3.5">
          {stat.slaByPriority.map((row) => {
            const meta = PRIORITY_META[row.priority];
            const total = row.within + row.atRisk + row.breached;
            const withinPct = (row.within / total) * 100;
            const atRiskPct = (row.atRisk / total) * 100;
            const breachedPct = (row.breached / total) * 100;
            return (
              <div key={row.priority}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-zinc-200">{meta.label}</span>
                  <span className="tabular-nums text-zinc-400">
                    <span className="font-semibold text-zinc-100">{formatPercent(Math.round(withinPct))}</span> 준수 ·{" "}
                    {formatNumber(total)}건
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5" role="img" aria-label={`${meta.label} SLA: 준수 ${Math.round(withinPct)}%, 위험 ${Math.round(atRiskPct)}%, 위반 ${Math.round(breachedPct)}%`}>
                  <div className="h-full bg-emerald-400" style={{ width: `${withinPct}%` }} />
                  <div className="h-full bg-amber-400" style={{ width: `${atRiskPct}%` }} />
                  <div className="h-full bg-rose-400" style={{ width: `${breachedPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
