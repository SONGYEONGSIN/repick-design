import { ArrowDownRight, ArrowUpRight, Flame } from "lucide-react";
import type { Aggregates } from "./data";
import { Label } from "./ui";

const SLA_TARGET = 95;

export function HeroPanel({ current, previous }: { current: Aggregates; previous: Aggregates }) {
  const delta = Number((current.slaComplianceRate - previous.slaComplianceRate).toFixed(1));
  const improved = delta >= 0;
  const onTarget = current.slaComplianceRate >= SLA_TARGET;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Label>SLA compliance · {current.period === "this-month" ? "This month" : "Last month"}</Label>
        {/* Hero number stays zinc-900, not the orange accent: at this size (~64px) orange-600 only
           clears the WCAG large-text floor (3:1), not the full 4.5:1 floor some scanners still
           apply to any-size text. Near-black keeps it unambiguously AA at every checker's bar; the
           orange accent instead frames the number via the icon chip and the delta badge below. */}
        <p className="mt-1 text-[56px] font-semibold leading-none tracking-tight tabular-nums text-zinc-900 sm:text-[64px]">
          {current.slaComplianceRate.toFixed(1)}
          <span className="text-[0.4em] font-medium text-zinc-500">%</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              improved ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {improved ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
            {improved ? "+" : ""}
            {delta.toFixed(1)} pts vs prior period
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              onTarget ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
            }`}
          >
            Target {SLA_TARGET}% · {onTarget ? "on target" : "below target"}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-zinc-500">
          {current.slaWithinCount} of {current.totalIncidents} incidents resolved inside their severity&apos;s SLA window this period.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 sm:self-auto">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-700 text-white">
          <Flame className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="font-medium text-zinc-900">{current.totalIncidents} incidents logged</p>
          <p className="text-zinc-500">{current.p1Count} were P1 severity</p>
        </div>
      </div>
    </div>
  );
}
