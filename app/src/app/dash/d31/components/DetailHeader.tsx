import { List, Play } from "lucide-react";
import type { Period, Workflow } from "../lib/data";
import PeriodToggle from "./PeriodToggle";
import StatusBadge from "./StatusBadge";

interface DetailHeaderProps {
  workflow: Workflow;
  period: Period;
  onPeriodChange: (period: Period) => void;
  onOpenList: () => void;
  listCount: number;
}

/** Detail view header — selected workflow identity + period toggle + primary action. Includes an "open list" button on mobile. */
export default function DetailHeader({ workflow, period, onPeriodChange, onOpenList, listCount }: DetailHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-zinc-950/60 px-4 py-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenList}
        className="mb-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-zinc-400 hover:border-white/20 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 lg:hidden"
      >
        <List className="size-3.5" aria-hidden="true" />
        Workflow list ({listCount})
      </button>

      {/*
        A vertical stack of info block → control block is the default. At lg (1024px), the sidebar
        and list rail are both showing, so the detail column is at its narrowest — the side-by-side
        layout only kicks in once that width pressure ends, at xl (1280px). (Switching earlier at
        sm re-clips the title in the lg range — a real defect confirmed during screenshot review.)
      */}
      <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-start xl:justify-between xl:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={workflow.lastStatus} />
            <span className="text-xs text-zinc-400">{workflow.category}</span>
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
            <span className="font-mono text-xs tabular-nums text-zinc-400">{workflow.id}</span>
          </div>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-balance text-zinc-50 sm:text-2xl xl:truncate">
            {workflow.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <PeriodToggle value={period} onChange={onPeriodChange} />
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            <Play className="size-3.5" aria-hidden="true" />
            Run now
          </button>
        </div>
      </div>
    </div>
  );
}
