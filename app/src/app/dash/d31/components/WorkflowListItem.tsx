import { workflowSuccessRate, type Workflow } from "../lib/data";
import { formatNumber, formatPercent } from "../lib/format";
import Sparkline from "./Sparkline";
import { statusLabel } from "./StatusBadge";

const DOT_CLASS: Record<Workflow["lastStatus"], string> = {
  success: "bg-emerald-400",
  failed: "bg-rose-400",
  running: "bg-blue-400",
  warning: "bg-amber-400",
};

interface WorkflowListItemProps {
  workflow: Workflow;
  selected: boolean;
  onSelect: () => void;
}

/** A single workflow entry in the list rail — summarizes name/status dot/mini sparkline/success rate. */
export default function WorkflowListItem({ workflow, selected, onSelect }: WorkflowListItemProps) {
  const successRate = workflowSuccessRate(workflow);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={`block min-h-[64px] w-full rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-400 ${
          selected ? "bg-indigo-500/10 ring-1 ring-inset ring-indigo-400/30" : "hover:bg-white/[0.05]"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASS[workflow.lastStatus]}`} aria-hidden="true" />
          <span className="sr-only">{statusLabel(workflow.lastStatus)}</span>
          <span
            className={`min-w-0 flex-1 truncate text-sm font-medium ${selected ? "text-zinc-50" : "text-zinc-200"}`}
          >
            {workflow.name}
          </span>
          <Sparkline
            values={workflow.sparkline}
            label={`${workflow.name} execution trend, last 7 days`}
            className={`h-4 w-10 shrink-0 ${selected ? "text-indigo-300" : "text-zinc-400"}`}
          />
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 pl-3.5 text-xs text-zinc-400">
          <span className="truncate">{workflow.category}</span>
          <span className="shrink-0 tabular-nums">
            {formatPercent(successRate, 0)} · {formatNumber(workflow.executions)} runs
          </span>
        </div>
      </button>
    </li>
  );
}
