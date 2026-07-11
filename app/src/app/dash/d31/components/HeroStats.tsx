import { NOW, lastRunAt, workflowSuccessRate, type Workflow } from "../lib/data";
import { formatDuration, formatNumber, formatPercent, formatRelative } from "../lib/format";

/** 4카드 가로줄 대신 히어로 숫자 + 인라인 보조 지표로 워크플로 요약을 표현한다. */
export default function HeroStats({ workflow }: { workflow: Workflow }) {
  const successRate = workflowSuccessRate(workflow);

  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-white/10 px-4 py-5 sm:px-6">
      <div>
        <p className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase">총 실행</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">
          {formatNumber(workflow.executions)}
        </p>
      </div>
      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-500">성공률</dt>
          <dd className="text-sm font-medium tabular-nums text-emerald-400">{formatPercent(successRate)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-500">실패</dt>
          <dd className="text-sm font-medium tabular-nums text-rose-400">{formatNumber(workflow.failed)}건</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-500">평균 소요시간</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-200">{formatDuration(workflow.avgDurationMs)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-500">마지막 실행</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-200">
            {formatRelative(lastRunAt(workflow.id), NOW)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
