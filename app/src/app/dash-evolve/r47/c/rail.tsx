"use client";

import { useMemo } from "react";
import { AlertTriangle, CircleCheck, CircleX } from "lucide-react";
import { ACCOUNTS, METRICS, rankAccounts, type Account, type HealthStatus, type MetricKey } from "./data";
import { formatCurrency, formatNumber, formatPercent } from "./format";
import { Badge, FOCUS_RING, RankDelta } from "./ui";

const HEALTH_STYLE: Record<HealthStatus, { tone: "success" | "warning" | "danger"; icon: typeof CircleCheck }> = {
  Healthy: { tone: "success", icon: CircleCheck },
  "At Risk": { tone: "warning", icon: AlertTriangle },
  Critical: { tone: "danger", icon: CircleX },
};

function metricValue(account: Account, metric: MetricKey): number {
  return account.metrics[metric].current;
}

function formatValue(metric: MetricKey, value: number): string {
  if (metric === "arrAtRisk") return formatCurrency(value);
  if (metric === "nrr") return formatPercent(value);
  return formatNumber(value);
}

function maxForMetric(metric: MetricKey): number {
  if (metric === "healthScore") return 100;
  return Math.max(...ACCOUNTS.map((a) => metricValue(a, metric)));
}

export function Rail({
  metric,
  selectedId,
  onSelect,
}: {
  metric: MetricKey;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const sorted = useMemo(
    () => [...ACCOUNTS].sort((a, b) => metricValue(b, metric) - metricValue(a, metric)),
    [metric],
  );
  const currentRanks = useMemo(() => rankAccounts(metric, "current"), [metric]);
  const previousRanks = useMemo(() => rankAccounts(metric, "previous"), [metric]);
  const max = useMemo(() => maxForMetric(metric), [metric]);

  return (
    <div className="flex min-w-0 flex-col">
      <ol className="flex min-w-0 flex-col divide-y divide-zinc-100">
        {sorted.map((account) => {
          const value = metricValue(account, metric);
          const widthPct = Math.max(2, Math.min(100, (value / max) * 100));
          const rank = currentRanks.get(account.id) ?? 0;
          const delta = (previousRanks.get(account.id) ?? rank) - rank;
          const selected = account.id === selectedId;
          const health = HEALTH_STYLE[account.health];
          const HealthIcon = health.icon;

          return (
            <li key={account.id} className="min-w-0">
              <button
                type="button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(account.id)}
                className={`flex w-full min-w-0 flex-col gap-1.5 border-l-4 px-4 py-3 text-left transition-colors duration-150 ${FOCUS_RING} ${
                  selected
                    ? "border-l-blue-600 bg-blue-50/60"
                    : "border-l-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-5 shrink-0 text-right text-xs font-medium tabular-nums text-zinc-600">
                    {rank}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                    {account.name}
                  </span>
                  <Badge tone={health.tone} icon={<HealthIcon className="h-3 w-3" aria-hidden="true" />} className="shrink-0">
                    {account.health}
                  </Badge>
                  <RankDelta delta={delta} />
                </div>

                <div className="flex min-w-0 items-center gap-3 pl-7">
                  <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: `${widthPct.toFixed(2)}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-zinc-900">
                    {formatValue(metric, value)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="px-4 pb-3 pt-3 text-xs text-zinc-500">
        Ranked by {METRICS[metric].label.toLowerCase()} · {sorted.length} accounts
      </p>
    </div>
  );
}
