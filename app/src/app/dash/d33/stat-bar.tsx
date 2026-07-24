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
    { label: "총 파이프라인", value: formatKRWCompact(data.totalPipeline), sub: `진행 거래 ${data.openCount}건` },
    { label: "가중 예측", value: formatKRWCompact(data.weightedForecast), sub: "성사 확률 반영" },
    { label: `${data.periodLabel} 성사`, value: formatKRWCompact(data.wonAmount), sub: `${data.wonCount}건 성사` },
    { label: "승률", value: `${data.winRate}%`, sub: "성사/종료 기준" },
    { label: "평균 딜 규모", value: formatKRWCompact(data.avgDeal), sub: "진행 거래 평균" },
  ];

  return (
    <Card as="section" aria-labelledby="pipeline-stats-heading" className="px-5 py-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="pipeline-stats-heading" className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
              파이프라인 요약
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
              <Filter className="h-3 w-3" aria-hidden="true" />
              {data.scopeLabel}
            </span>
          </div>
          {/* 인라인 스탯 바 — 한 줄 가로 배치, 항목 사이 구분선 */}
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

        {/* 크로스헤어 추이 차트 (기간 토글로 데이터셋 전환) */}
        <div className="w-full border-t border-zinc-100 pt-4 lg:w-[288px] lg:shrink-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <ForecastChart points={data.trend} unit={data.trendUnit} ariaTitle={`${data.periodLabel} 가중 예측 추이`} />
        </div>
      </div>
    </Card>
  );
}
