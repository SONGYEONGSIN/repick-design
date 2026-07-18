import { TrendSparkline } from "./trend-sparkline";
import {
  domainMax,
  formatPercent,
  formatUsers,
  valueFor,
  type CohortRow,
  type DatasetDefinition,
  type MetricId,
} from "../lib/data";

interface CohortDetailPanelProps {
  cohort: CohortRow;
  dataset: DatasetDefinition;
  metric: MetricId;
}

export function CohortDetailPanel({ cohort, dataset, metric }: CohortDetailPanelProps) {
  const metricLabel = metric === "retention" ? "사용자 리텐션" : "순매출 리텐션";
  const series = metric === "retention" ? cohort.retention : cohort.revenueRetention;
  const latestPeriod = cohort.periodsAvailable - 1;
  const latestValue = valueFor(cohort, latestPeriod, metric);
  const max = domainMax(metric);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50">{cohort.fullLabel}</h3>
          <p className="mt-0.5 text-[12px] text-zinc-500 dark:text-zinc-400">
            행 헤더 또는 셀을 클릭하면 이 패널이 해당 코호트로 즉시 갱신됩니다.
          </p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">가입자 수</p>
            <p className="text-[15px] font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatUsers(cohort.size)}
            </p>
          </div>
          <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
          <div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">관측 기간</p>
            <p className="text-[15px] font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {cohort.periodsAvailable}/8{dataset.periodUnitLabel === "주차" ? "주" : "개월"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            유입 채널 믹스
          </p>
          <ul className="space-y-2">
            {cohort.channelMix.map((share) => (
              <li key={share.channel}>
                <div className="mb-1 flex items-center justify-between text-[12px]">
                  <span className="truncate text-zinc-600 dark:text-zinc-300">{share.channel}</span>
                  <span className="shrink-0 tabular-nums font-medium text-zinc-800 dark:text-zinc-100">
                    {share.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400"
                    style={{ width: `${share.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {metricLabel} 추이
            </p>
            <p className="text-[12px] tabular-nums text-zinc-500 dark:text-zinc-400">
              최근 관측값 {formatPercent(latestValue)}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5">
            <TrendSparkline
              values={series}
              periodsAvailable={cohort.periodsAvailable}
              domainMax={max}
              className="text-indigo-500"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            기간별 스냅샷
          </p>
          <dl className="space-y-1.5 text-[12.5px]">
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">0{dataset.periodUnitLabel}</dt>
              <dd className="tabular-nums font-medium text-zinc-800 dark:text-zinc-100">
                {formatPercent(valueFor(cohort, 0, metric))}
              </dd>
            </div>
            {cohort.periodsAvailable > 3 ? (
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">3{dataset.periodUnitLabel}</dt>
                <dd className="tabular-nums font-medium text-zinc-800 dark:text-zinc-100">
                  {formatPercent(valueFor(cohort, 3, metric))}
                </dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">
                최신 ({latestPeriod}
                {dataset.periodUnitLabel})
              </dt>
              <dd className="tabular-nums font-medium text-zinc-800 dark:text-zinc-100">
                {formatPercent(latestValue)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
