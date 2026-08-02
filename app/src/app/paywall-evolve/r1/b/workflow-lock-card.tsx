import { ArrowRight, Filter, Lock, Zap } from "lucide-react";
import { CURRENT_USAGE, WORKFLOW_STEPS, fmt } from "./data";

const STEP_ICON = { Trigger: Zap, Filter: Filter, Action: ArrowRight } as const;

/** The "what's blocked" card: a usage meter (numeric + bar, never color-only) above a compact,
 * grayed-out diagram of a workflow chain — trigger, filter, action — to show concretely what's
 * paused rather than just naming it. Purely presentational: usage numbers are fixed data, not
 * derived from any interactive state, so this never needs "use client". */
export default function WorkflowLockCard() {
  const pct = Math.round((CURRENT_USAGE.runsUsed / CURRENT_USAGE.runsLimit) * 100);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
          <Lock className="h-3 w-3 flex-none" aria-hidden="true" />
          New runs paused
        </span>
        <span className="text-xs font-normal text-zinc-400 tabular-nums">Resets in {CURRENT_USAGE.resetsIn}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-zinc-100 tabular-nums">
            {fmt(CURRENT_USAGE.runsUsed)} / {fmt(CURRENT_USAGE.runsLimit)} runs used this month
          </p>
          <p className="text-sm font-normal text-zinc-400 tabular-nums">{pct}%</p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={CURRENT_USAGE.runsUsed}
          aria-valuemin={0}
          aria-valuemax={CURRENT_USAGE.runsLimit}
          aria-valuetext={`${fmt(CURRENT_USAGE.runsUsed)} of ${fmt(CURRENT_USAGE.runsLimit)} runs used, ${pct} percent`}
          aria-label="Starter plan automation runs used this month"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800"
        >
          <div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-zinc-800 pt-4" aria-hidden="true">
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = STEP_ICON[step];
          return (
            <div key={step} className="flex flex-1 items-center gap-1.5 last:flex-none">
              <span className="flex flex-1 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-2 grayscale">
                <Icon className="h-3.5 w-3.5 flex-none text-zinc-500" />
                <span className="truncate text-xs font-normal text-zinc-500">{step}</span>
              </span>
              {i < WORKFLOW_STEPS.length - 1 && <span className="h-px w-3 flex-none bg-zinc-700" />}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs font-normal text-zinc-400">Example workflow, shown paused — your active chains resume the moment you upgrade.</p>
    </div>
  );
}
