import { Trophy } from "lucide-react";
import { COHORT, cohortPercentile } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/**
 * Cohort standing — always-visible supporting proof next to the spine, not tucked behind a
 * click. Purely presentational (no state to filter or toggle), which is deliberate: not every
 * panel needs to be interactive, but the number itself must never require one to see.
 */
export default function PercentileGauge() {
  const percentile = cohortPercentile();
  return (
    <section aria-labelledby="cohort-heading" className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="cohort-heading" className="text-base font-semibold text-zinc-50">
          Cohort standing
        </h2>
        <Trophy aria-hidden="true" className="h-4 w-4 text-cyan-400" />
      </div>
      <p className="mt-1 text-sm font-normal text-zinc-400">
        Rank among {COHORT.size.toLocaleString("en-US")} audited Systematic Macro strategies on Meridian.
      </p>

      <div className="mt-4 flex items-end gap-3">
        <p className="text-3xl font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
          {percentile}
          <span className="text-lg align-top">th</span>
        </p>
        <p className="pb-1 text-sm font-normal text-zinc-400">
          percentile &middot; rank {COHORT.rank} of {COHORT.size}
        </p>
      </div>

      <div className="mt-3">
        <div aria-hidden="true" className="relative h-2 rounded-full bg-zinc-800">
          <div className="absolute inset-y-0 left-0 rounded-full bg-cyan-400" style={{ width: `${percentile}%` }} />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-cyan-300"
            style={{ left: `calc(${percentile}% - 7px)` }}
          />
        </div>
        <div aria-hidden="true" className="mt-1 flex justify-between text-[10px] font-normal tabular-nums text-zinc-400">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
        <span className="sr-only">{percentile} out of 100 on the cohort percentile scale</span>
      </div>
    </section>
  );
}
