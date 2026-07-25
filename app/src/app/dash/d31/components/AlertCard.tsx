import { TriangleAlert } from "lucide-react";
import { detectErrorSpike, WORKFLOW_BY_ID } from "../lib/data";
import { formatNumber } from "../lib/format";

interface AlertCardProps {
  onSelectWorkflow: (workflowId: string) => void;
}

/** Compact failure-spike alert atop the workflow list rail — clicking syncs to that workflow's detail view. */
export default function AlertCard({ onSelectWorkflow }: AlertCardProps) {
  const spike = detectErrorSpike();
  const workflow = WORKFLOW_BY_ID.get("wf_b84c0e");
  if (!workflow) return null;
  const ratioText = `${spike.ratio.toFixed(1)}x`;

  return (
    <button
      type="button"
      onClick={() => onSelectWorkflow(workflow.id)}
      className="flex w-full items-start gap-2 rounded-lg border border-rose-500/25 bg-rose-500/[0.06] px-2.5 py-2 text-left transition-colors hover:bg-rose-500/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
    >
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-rose-400" aria-hidden="true" />
      <span className="min-w-0 flex-1 text-xs leading-relaxed text-rose-200">
        <span className="font-medium text-rose-100">{workflow.name}</span> failure spike — {spike.label} window{" "}
        <span className="tabular-nums">{formatNumber(spike.count)} failures</span>
        {" "}(<span className="tabular-nums font-medium">{ratioText}</span> the usual rate)
      </span>
    </button>
  );
}
