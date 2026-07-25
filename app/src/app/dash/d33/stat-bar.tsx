import { Filter } from "lucide-react";
import { Card } from "./ui";
import { ForecastChart } from "./forecast-chart";
import { formatKRWCompact } from "./format";

export interface StatBarData {
  scopeLabel: string;
  totalPipeline: number;
  weightedForecast: number;
  openCount: number;
  periodLabel: string;
  wonAmount: number;
  wonCount: number;
  winRate: number;
  avgDeal: number;
  trend: { label: string; value: number }[];
  trendUnit: string;
}

export function StatBar({ data }: { data: StatBarData }) {
  const stats: { label: string; value: string; sub: string }[] = [
    { label: "Total pipeline", value: formatKRWCompact(data.totalPipeline), sub: `${data.openCount} open deals` },
    { label: "Weighted forecast", value: formatKRWCompact(data.weightedForecast), sub: "Probability-weighted" },
    { label: `${data.periodLabel} Won`, value: formatKRWCompact(data.wonAmount), sub: `${data.wonCount} deals won` },
    { label: "Win rate", value: `${data.winRate}%`, sub: "Of closed deals" },
    { label: "Avg deal size", value: formatKRWCompact(data.avgDeal), sub: "Across open deals" },
  ];

  return (
    <Card as="section" aria-labelledby="pipeline-stats-heading" className="px-5 py-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="pipeline-stats-heading" className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
              Pipeline summary
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
              <Filter className="h-3 w-3" aria-hidden="true" />
              {data.scopeLabel}
            </span>
          </div>
          {/* Inline stat bar — single row layout, dividers between items */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 xl:flex xl:flex-wrap xl:items-stretch xl:gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`min-w-0 xl:px-5 xl:first:pl-0 ${i > 0 ? "xl:border-l xl:border-zinc-200" : ""}`}
              >
                <dt className="truncate text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                  {s.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-zinc-900 tabular-nums">
                  {s.value}
                </dd>
                <dd className="mt-0.5 text-[11px] text-zinc-400 tabular-nums">{s.sub}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Crosshair trend chart (dataset switches with the period toggle) */}
        <div className="w-full border-t border-zinc-100 pt-4 lg:w-[288px] lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <ForecastChart points={data.trend} unit={data.trendUnit} ariaTitle={`${data.periodLabel} weighted forecast trend`} />
        </div>
      </div>
    </Card>
  );
}
