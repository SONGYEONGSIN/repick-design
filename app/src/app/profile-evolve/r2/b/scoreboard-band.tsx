import { ArrowDownRight, ArrowUpRight, CalendarDays, TrendingUp, Users } from "lucide-react";
import {
  BASELINE_OPTIONS,
  PROFILE,
  RANGE_OPTIONS,
  cumulativeReturn,
  formatCount,
  formatPercent,
  formatPoints,
  rangeSlice,
  winRate,
  type BaselineKey,
  type RangeKey,
} from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/**
 * The always-on "them vs baseline" spine. Sticky at the top of the viewport once scrolled to,
 * so the core proof (return, win rate, copiers, track-record length) and the live baseline
 * comparison stay visible at every scroll depth and every filter state — never gated behind a
 * tab or click (page-brief-core §3 + the r1 delta this round is required to carry forward).
 */
export default function ScoreboardBand({
  range,
  onRangeChange,
  baseline,
  onBaselineChange,
  copiers,
}: {
  range: RangeKey;
  onRangeChange: (r: RangeKey) => void;
  baseline: BaselineKey;
  onBaselineChange: (b: BaselineKey) => void;
  copiers: number;
}) {
  const rows = rangeSlice(range);
  const ownReturn = cumulativeReturn(rows, "own");
  const baseReturn = cumulativeReturn(rows, baseline);
  const delta = Math.round((ownReturn - baseReturn) * 100) / 100;
  const beating = delta >= 0;
  const baselineMeta = BASELINE_OPTIONS.find((b) => b.key === baseline)!;
  const rangeMeta = RANGE_OPTIONS.find((r) => r.key === range)!;
  const wr = winRate(rows);

  return (
    <section
      aria-labelledby="scoreboard-heading"
      className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/97 supports-[backdrop-filter]:backdrop-blur"
    >
      <h2 id="scoreboard-heading" className="sr-only">
        Performance vs baseline
      </h2>
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Row 1: range + baseline controls — these drive every number below and in the panels further down the page. */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div role="group" aria-label="Time range" className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 p-1">
            {RANGE_OPTIONS.map((opt) => {
              const active = opt.key === range;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onRangeChange(opt.key)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${FOCUS} ${
                    active ? "bg-cyan-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="Baseline" className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 p-1">
            {BASELINE_OPTIONS.map((opt) => {
              const active = opt.key === baseline;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onBaselineChange(opt.key)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${FOCUS} ${
                    active ? "bg-cyan-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
                  }`}
                >
                  vs {opt.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: the spine itself — Solstice Macro's numbers on the left, the selected baseline's on the right, a delta badge between them. */}
        <div className="mt-3 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-400">{PROFILE.strategyName}</p>
            <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              <div>
                <dt className="text-xs font-normal text-zinc-400">Return ({rangeMeta.label})</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
                  {formatPercent(ownReturn, { signed: true })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-normal text-zinc-400">Win rate</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
                  {formatPercent(wr)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs font-normal text-zinc-400">
                  <Users aria-hidden="true" className="h-3 w-3 shrink-0" />
                  Copiers
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
                  {formatCount(copiers)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs font-normal text-zinc-400">
                  <CalendarDays aria-hidden="true" className="h-3 w-3 shrink-0" />
                  Live since
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
                  {PROFILE.liveSince}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-center">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums ${
                beating ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300" : "border-zinc-700 bg-zinc-900 text-zinc-300"
              }`}
            >
              {beating ? (
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {formatPoints(delta)} {beating ? "ahead of" : "behind"} {baselineMeta.short}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-400">
              <TrendingUp aria-hidden="true" className="h-3 w-3 shrink-0" />
              {baselineMeta.label}
            </p>
            <dl className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-normal text-zinc-400">Return ({rangeMeta.label})</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50" style={DISPLAY_FONT}>
                  {formatPercent(baseReturn, { signed: true })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-normal text-zinc-400">Benchmark type</dt>
                <dd className="mt-0.5 text-sm font-normal text-zinc-300">
                  {baseline === "index" ? "Broad market index" : "341-strategy cohort"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
