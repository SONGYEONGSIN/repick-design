"use client";

import type { ReactNode } from "react";
import { ClipboardList, Gauge, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getFleetStats, getFleetAvgUtilizationPct, UTIL_HISTORY_PREV, pctFmt, countFmt } from "./data";
import { Card, NUM, SectionLabel, Sparkline } from "./ui";

function KpiTile({
  icon: Icon,
  label,
  value,
  sub,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  children?: ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <SectionLabel>{label}</SectionLabel>
          <p className={`mt-1 truncate text-2xl font-semibold text-zinc-900 ${NUM}`}>{value}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{sub}</p>
        </div>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          {children}
        </span>
      </div>
    </Card>
  );
}

export function KpiRow() {
  const fleet = getFleetStats();
  const avgPct = getFleetAvgUtilizationPct();
  const history = [...UTIL_HISTORY_PREV, avgPct];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <KpiTile
        icon={ClipboardList}
        label="Jobs today"
        value={countFmt.format(fleet.totalJobs)}
        sub={`${countFmt.format(fleet.scheduled)} scheduled · ${countFmt.format(fleet.active)} active`}
      />
      <KpiTile
        icon={Gauge}
        label="Crew utilization"
        value={pctFmt.format(avgPct / 100)}
        sub="Fleet average, last 7 days"
      >
        <Sparkline values={history} label={`Utilization trend, ${history[0]}% to ${history[history.length - 1]}% over 7 days`} />
      </KpiTile>
      <KpiTile
        icon={AlertTriangle}
        label="Urgent open"
        value={countFmt.format(fleet.urgentOpen)}
        sub="Priority jobs not yet complete"
      />
      <KpiTile
        icon={CheckCircle2}
        label="Completed today"
        value={countFmt.format(fleet.completed)}
        sub={`Of ${countFmt.format(fleet.totalJobs)} jobs on the board`}
      />
    </div>
  );
}
