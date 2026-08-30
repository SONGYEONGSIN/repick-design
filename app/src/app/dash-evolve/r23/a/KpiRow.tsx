import { TrendingDown, TrendingUp, Inbox, TriangleAlert, Timer, Wallet } from "lucide-react";
import { Card, Sparkline, cx } from "./ui";
import { openCases, atRiskCases, avgResolutionHours, refundExposureKrw, formatKrw, OPEN_TREND, RISK_TREND, RESOLUTION_TREND, EXPOSURE_TREND } from "./data";

/**
 * Queue-wide KPI strip. Deliberately does NOT accept a `selectedCase` prop — see the comment atop
 * DetailPane.tsx for why pinning a single case must not recompute these aggregates.
 */
export function KpiRow() {
  const open = openCases().length;
  const risk = atRiskCases().length;
  const avgRes = avgResolutionHours();
  const exposure = refundExposureKrw();

  const cards = [
    {
      label: "Open disputes",
      value: open.toLocaleString("en-US"),
      icon: Inbox,
      trend: OPEN_TREND,
      delta: OPEN_TREND[OPEN_TREND.length - 1] - OPEN_TREND[OPEN_TREND.length - 2],
      deltaSuffix: "",
      deltaIsKrw: false,
    },
    {
      label: "SLA at risk (≤12h)",
      value: risk.toLocaleString("en-US"),
      icon: TriangleAlert,
      trend: RISK_TREND,
      delta: RISK_TREND[RISK_TREND.length - 1] - RISK_TREND[RISK_TREND.length - 2],
      deltaSuffix: "",
      deltaIsKrw: false,
    },
    {
      label: "Avg. resolution time",
      value: `${avgRes}h`,
      icon: Timer,
      trend: RESOLUTION_TREND,
      delta: RESOLUTION_TREND[RESOLUTION_TREND.length - 1] - RESOLUTION_TREND[RESOLUTION_TREND.length - 2],
      deltaSuffix: "h",
      deltaIsKrw: false,
    },
    {
      label: "Refund exposure",
      value: formatKrw(exposure),
      icon: Wallet,
      trend: EXPOSURE_TREND,
      delta: EXPOSURE_TREND[EXPOSURE_TREND.length - 1] - EXPOSURE_TREND[EXPOSURE_TREND.length - 2],
      deltaSuffix: "",
      deltaIsKrw: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((k) => {
        const Icon = k.icon;
        const up = k.delta > 0;
        const flat = k.delta === 0;
        const DeltaIcon = up ? TrendingUp : TrendingDown;
        return (
          <Card key={k.label} className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">{k.label}</p>
              <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            </div>
            <p className="mt-2 truncate text-[24px] font-semibold tabular-nums leading-none text-zinc-900">{k.value}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Sparkline values={k.trend} width={64} height={24} tone="#B45309" />
              {!flat && (
                <p className={cx("flex shrink-0 items-center gap-1 text-[11px] font-medium tabular-nums", up ? "text-red-700" : "text-emerald-700")}>
                  <DeltaIcon className="h-3 w-3 shrink-0" />
                  {up ? "+" : ""}
                  {k.deltaIsKrw ? formatKrw(k.delta) : `${k.delta}${k.deltaSuffix}`}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
