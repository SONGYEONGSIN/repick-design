"use client";

import { AlertTriangle, Calendar, CircleCheck, CircleDashed, CircleX, FileText } from "lucide-react";
import { CHECKLIST_LABELS, TREND_MONTHS, type Account, type HealthStatus } from "./data";
import { formatCurrency, formatDate, formatNumber, formatPercent, quarterLabel } from "./format";
import { Badge, Card, Progress, SectionLabel } from "./ui";
import { Sparkline } from "./sparkline";

const HEALTH_STYLE: Record<HealthStatus, { tone: "success" | "warning" | "danger"; icon: typeof CircleCheck }> = {
  Healthy: { tone: "success", icon: CircleCheck },
  "At Risk": { tone: "warning", icon: AlertTriangle },
  Critical: { tone: "danger", icon: CircleX },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-600">{label}</p>
      <p className="mt-0.5 truncate text-base font-semibold tabular-nums text-zinc-900">{value}</p>
    </div>
  );
}

export function DetailPanel({ account }: { account: Account }) {
  const health = HEALTH_STYLE[account.health];
  const HealthIcon = health.icon;
  const doneCount = account.checklist.filter(Boolean).length;

  return (
    <Card className="flex min-w-0 flex-col gap-5 p-5 md:p-6">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h2 className="min-w-0 truncate text-lg font-semibold text-zinc-900">{account.name}</h2>
          <Badge tone={health.tone} icon={<HealthIcon className="h-3 w-3" aria-hidden="true" />} className="shrink-0">
            {account.health}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{account.segment}</Badge>
          <span className="text-xs text-zinc-600">
            CSM <span className="font-medium text-zinc-900">{account.csm}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="ARR at risk" value={formatCurrency(account.metrics.arrAtRisk.current)} />
        <Stat label="Health score" value={formatNumber(account.metrics.healthScore.current)} />
        <Stat label="NRR" value={formatPercent(account.metrics.nrr.current)} />
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm">
        <span className="inline-flex items-center gap-2 text-zinc-700">
          <Calendar className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          Renews {formatDate(account.renewalDate)}
        </span>
        <span className="text-zinc-600">{quarterLabel(account.renewalDate)}</span>
        <span className="text-zinc-600">{account.contractTermMonths}-month term</span>
      </div>

      <div className="min-w-0">
        <SectionLabel>Usage trend, last 8 months</SectionLabel>
        <div className="mt-2">
          <Sparkline data={account.usageTrend} labels={TREND_MONTHS} />
        </div>
      </div>

      <div className="min-w-0">
        <SectionLabel>Stakeholders</SectionLabel>
        <ul className="mt-2 flex flex-col gap-2">
          {account.stakeholders.map((person) => (
            <li key={person.name} className="flex min-w-0 items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate font-medium text-zinc-900">{person.name}</span>
              <span className="shrink-0 truncate text-xs text-zinc-600">{person.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between">
          <SectionLabel>Renewal readiness</SectionLabel>
          <span className="text-xs font-medium tabular-nums text-zinc-600">
            {doneCount} of {CHECKLIST_LABELS.length}
          </span>
        </div>
        <div className="mt-2">
          <Progress value={doneCount} max={CHECKLIST_LABELS.length} />
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {CHECKLIST_LABELS.map((label, index) => {
            const done = account.checklist[index];
            return (
              <li key={label} className="flex min-w-0 items-center gap-2 text-sm">
                {done ? (
                  <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <CircleDashed className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                )}
                <span className={`min-w-0 truncate ${done ? "text-zinc-700" : "text-zinc-500"}`}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex min-w-0 items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
        <p className="min-w-0 text-sm text-zinc-700">{account.nextStep}</p>
      </div>
    </Card>
  );
}
