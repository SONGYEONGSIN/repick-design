import { Lock, TriangleAlert } from "lucide-react";
import UsageChart from "./usage-chart";
import { FREE_TIER } from "./data";

/** The left column — the "why you're here" panel. It states the blocked state as plain text and
 * numbers first (not an image with text laid over it), then backs that claim with a chart, so the
 * core reason for the paywall reads even if every script on the page failed. This is the page's one
 * h1 — everything else on the route is an h2, so heading order never skips a level. */
export default function LockedPanel() {
  // The Free tier pauses ingestion exactly at its cap, so usage is always 100% when this panel is
  // shown — a fixed literal, not a computed ratio of a number against itself.
  const pct = 100;

  return (
    <section aria-labelledby="quota-heading" className="min-w-0">
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
        <TriangleAlert className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
        Free plan &middot; ingestion paused
      </div>

      <h1
        id="quota-heading"
        className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        You&rsquo;ve hit this month&rsquo;s event limit.
      </h1>
      <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-zinc-400">
        Ridgeline stops ingesting new events once a Free workspace crosses its monthly allowance.
        Nothing is deleted — every event you&rsquo;ve already captured stays readable. Upgrade to
        resume ingestion immediately, or wait for next month&rsquo;s reset.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-medium text-zinc-300">Events this month</p>
          <p className="text-sm font-normal text-zinc-400">
            <span className="tabular-nums text-zinc-50">
              {FREE_TIER.events.toLocaleString("en-US")}
            </span>
            {" / "}
            <span className="tabular-nums">{FREE_TIER.events.toLocaleString("en-US")}</span>
          </p>
        </div>

        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Free plan monthly event quota used"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800"
        >
          <div className="h-full rounded-full bg-red-400" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-normal text-zinc-400">
          <Lock className="h-3.5 w-3.5 flex-none text-red-400" aria-hidden="true" />
          <span className="tabular-nums text-zinc-300">100%</span>
          &nbsp;used &middot; resets at the start of next month
        </p>

        <div className="mt-5">
          <UsageChart />
          <div className="mt-1 flex items-center justify-between text-[11px] font-normal text-zinc-400">
            <span>14 days ago</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden="true" />
              Plan limit reached
            </span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </section>
  );
}
