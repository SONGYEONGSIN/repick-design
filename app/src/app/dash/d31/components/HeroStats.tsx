import { NOW, lastRunAt, workflowSuccessRate, type Workflow } from "../lib/data";
import { formatDuration, formatNumber, formatPercent, formatRelative } from "../lib/format";

/** Expresses the workflow summary as a hero number + inline secondary metrics, instead of a row of 4 cards. */
export default function HeroStats({ workflow }: { workflow: Workflow }) {
  const successRate = workflowSuccessRate(workflow);

  return (
    <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-white/10 px-4 py-5 sm:px-6">
      <div>
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">Total executions</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">
          {formatNumber(workflow.executions)}
        </p>
      </div>
      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-400">Success rate</dt>
          <dd className="text-sm font-medium tabular-nums text-emerald-400">{formatPercent(successRate)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-400">Failed</dt>
          <dd className="text-sm font-medium tabular-nums text-rose-400">{formatNumber(workflow.failed)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-400">Avg. duration</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-200">{formatDuration(workflow.avgDurationMs)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-xs text-zinc-400">Last run</dt>
          <dd className="text-sm font-medium tabular-nums text-zinc-200">
            {formatRelative(lastRunAt(workflow.id), NOW)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
