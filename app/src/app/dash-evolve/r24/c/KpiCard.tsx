import { ChevronDown, ChevronUp } from "lucide-react";
import Sparkline from "./Sparkline";
import type { Kpi } from "./data";

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.deltaDirection === "up" ? ChevronUp : ChevronDown;
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{kpi.label}</p>
        {kpi.sparkline && (
          <span className="hidden text-orange-600 sm:block" aria-hidden="true">
            <Sparkline values={kpi.sparkline} />
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-2xl font-semibold tabular-nums text-zinc-900 sm:text-[28px]">{kpi.value}</p>
      <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-600">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">{kpi.deltaLabel}</span>
      </div>
    </div>
  );
}
