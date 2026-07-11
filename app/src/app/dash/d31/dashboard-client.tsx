"use client";

import { Activity, CircleCheck, Timer, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import Card from "./components/Card";
import KpiCard from "./components/KpiCard";
import PeriodToggle from "./components/PeriodToggle";
import ExecutionChart from "./components/ExecutionChart";
import StatusFilter, { type StatusFilterValue } from "./components/StatusFilter";
import WorkflowTable from "./components/WorkflowTable";
import ExecutionLogTable from "./components/ExecutionLogTable";
import CreditsCard from "./components/CreditsCard";
import AlertCard from "./components/AlertCard";
import {
  EXECUTION_LOG,
  PERIOD_AVG_DURATION_MS,
  PERIOD_DELTA,
  PERIOD_SERIES,
  periodTotals,
  type Period,
} from "./lib/data";
import { formatDuration, formatNumber, formatPercent } from "./lib/format";

const PERIOD_LABEL: Record<Period, string> = {
  "24h": "최근 24시간",
  "7d": "최근 7일",
  "30d": "최근 30일",
};

const PERIOD_CAPTION: Record<Period, string> = {
  "24h": "전일 대비",
  "7d": "지난주 대비",
  "30d": "지난 30일 대비",
};

const STATUS_FILTER_OPTIONS: StatusFilterValue[] = ["all", "success", "failed", "running", "warning"];

export default function DashboardClient() {
  const [period, setPeriod] = useState<Period>("24h");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const totals = useMemo(() => periodTotals(period), [period]);
  const delta = PERIOD_DELTA[period];
  const avgDuration = PERIOD_AVG_DURATION_MS[period];
  const series = PERIOD_SERIES[period];
  const periodLabel = PERIOD_LABEL[period];
  const caption = PERIOD_CAPTION[period];

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(STATUS_FILTER_OPTIONS.map((s) => [s, 0])) as Record<StatusFilterValue, number>;
    counts.all = EXECUTION_LOG.length;
    for (const entry of EXECUTION_LOG) counts[entry.status] += 1;
    return counts;
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">개요</h1>
            <p className="mt-1 text-sm text-zinc-500">워크플로 실행 현황과 파이프라인 성능을 한눈에 확인하세요.</p>
          </div>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KpiCard
              label="총 실행"
              value={formatNumber(totals.total)}
              delta={delta.executions}
              deltaGoodDirection="up"
              caption={caption}
              Icon={Activity}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KpiCard
              label="성공률"
              value={formatPercent(totals.successRate)}
              delta={delta.successRate}
              deltaGoodDirection="up"
              caption={caption}
              Icon={CircleCheck}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KpiCard
              label="실패 건수"
              value={formatNumber(totals.failed)}
              delta={delta.failed}
              deltaGoodDirection="down"
              caption={caption}
              Icon={TriangleAlert}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <KpiCard
              label="평균 소요시간"
              value={formatDuration(avgDuration)}
              delta={delta.avgDuration}
              deltaGoodDirection="down"
              caption={caption}
              Icon={Timer}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 min-w-0 lg:col-span-8">
            <Card
              title="실행 추이"
              description={`${periodLabel} 성공/실패 실행 건수`}
              headingId="exec-trend-heading"
              className="h-full"
            >
              <ExecutionChart series={series} periodLabel={periodLabel} />
            </Card>
          </div>
          <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-4">
            <CreditsCard />
            <AlertCard />
          </div>
        </div>

        <section aria-labelledby="workflow-table-heading" className="mt-8 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="workflow-table-heading" className="text-sm font-semibold text-zinc-100">
                워크플로 성능
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">등록된 워크플로별 실행 지표 — 헤더를 눌러 정렬</p>
            </div>
            <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={statusCounts} />
          </div>
          <div className="mt-3">
            <WorkflowTable statusFilter={statusFilter} />
          </div>
        </section>

        <section id="execution-log" aria-labelledby="execution-log-heading" className="mt-8 min-w-0 pb-10">
          <h2 id="execution-log-heading" className="text-sm font-semibold text-zinc-100">
            최근 실행 로그
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">위 상태 필터가 함께 적용됩니다</p>
          <div className="mt-3">
            <ExecutionLogTable statusFilter={statusFilter} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
