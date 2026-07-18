import { SegmentedControl } from "./segmented-control";
import {
  blendedAtPeriod,
  formatPercent,
  formatUsers,
  topChannel,
  totalTrackedUsers,
  type DatasetDefinition,
  type DefinitionId,
  type MetricId,
} from "../lib/data";

interface HeroControlBarProps {
  dataset: DatasetDefinition;
  metric: MetricId;
  definition: DefinitionId;
  onMetricChange: (m: MetricId) => void;
  onDefinitionChange: (d: DefinitionId) => void;
}

const HERO_PERIOD = 4;

export function HeroControlBar({
  dataset,
  metric,
  definition,
  onMetricChange,
  onDefinitionChange,
}: HeroControlBarProps) {
  const heroValue = blendedAtPeriod(dataset, HERO_PERIOD, metric);
  const totalUsers = totalTrackedUsers(dataset);
  const leading = topChannel(dataset);
  const metricLabel = metric === "retention" ? "사용자 리텐션" : "순매출 리텐션";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {dataset.periodUnitLabel === "주차" ? "4주차" : "4개월차"} 블렌디드 {metricLabel}
          </p>
          <p className="mt-1 text-[40px] font-bold leading-none tabular-nums text-zinc-900 dark:text-zinc-50 sm:text-[46px]">
            {formatPercent(heroValue)}
          </p>
          <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            표시된 {dataset.cohorts.length}개 {dataset.label} 중 4{dataset.periodUnitLabel} 데이터가
            있는 코호트를 가입자 수로 가중 평균한 값입니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                총 추적 사용자
              </p>
              <p className="text-[14px] font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                {formatUsers(totalUsers)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                코호트 수
              </p>
              <p className="text-[14px] font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                {dataset.cohorts.length}개
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                최다 유입 채널
              </p>
              <p className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-100">
                {leading.channel}
                <span className="ml-1 tabular-nums text-zinc-400 dark:text-zinc-500">
                  (평균 {leading.avgPct}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div>
            <p className="mb-1.5 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              코호트 정의
            </p>
            <SegmentedControl
              ariaLabel="코호트 정의 선택"
              value={definition}
              onChange={onDefinitionChange}
              options={[
                { value: "weekly", label: "주간" },
                { value: "monthly", label: "월간" },
              ]}
            />
          </div>
          <div>
            <p className="mb-1.5 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              지표
            </p>
            <SegmentedControl
              ariaLabel="매트릭스 지표 선택"
              value={metric}
              onChange={onMetricChange}
              options={[
                { value: "retention", label: "리텐션" },
                { value: "revenue", label: "매출 리텐션" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
