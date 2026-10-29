import { Gauge, Pin } from "lucide-react";
import {
  AVG_RESOLUTION_MINUTES,
  computeVolatilityScore,
  formatCount,
  formatMinutes,
  getCandles,
  getInstrument,
  SEVERITY_COUNTS,
  THRESHOLD_BREACH_COUNT,
  TOTAL_SIGNALS,
} from "./data";
import { cx, NUM, SEVERITY_DOT, SEVERITY_LABEL, TEXT_AUX, TEXT_PRIMARY, type Severity } from "./tokens";
import { Card } from "./ui";

const SEVERITY_ORDER: Severity[] = ["high", "medium", "low"];

function SeverityRow({ severity }: { severity: Severity }) {
  const count = SEVERITY_COUNTS[severity];
  const pct = Math.round((count / TOTAL_SIGNALS) * 1000) / 10;
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px]">
        <span className={cx("flex items-center gap-1.5 font-medium", TEXT_PRIMARY)}>
          <span aria-hidden="true" className={cx("size-1.5 rounded-full", SEVERITY_DOT[severity])} />
          {SEVERITY_LABEL[severity]}
        </span>
        <span className={cx(NUM, TEXT_AUX)}>
          {count} &middot; {pct}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5" role="presentation">
        <div
          className={cx("h-full rounded-full", severity === "high" ? "bg-rose-400" : severity === "medium" ? "bg-amber-400" : "bg-zinc-400")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Two independent widgets stacked in one narrow rail. The severity breakdown and the resolution
 * stats never change no matter what gets pinned in the feed — only the "Pinned instrument" card
 * below reacts, and it reacts to exactly one thing: the instrument behind the currently pinned
 * signal. This is the single KPI figure the pin axis is allowed to touch (see fluxgate-client.tsx).
 */
export function RiskPanel({ pinnedInstrumentId }: { pinnedInstrumentId: string | null }) {
  const pinnedInstrument = pinnedInstrumentId ? getInstrument(pinnedInstrumentId) : undefined;
  const pinnedScore = pinnedInstrument ? computeVolatilityScore(getCandles(pinnedInstrument, "1D")) : null;

  return (
    <div className="flex flex-col gap-4">
      <Card id="risk" title="Risk overview" description={`${formatCount(TOTAL_SIGNALS)} signals · last 24h`}>
        <div className="space-y-3 px-5 pb-5">
          {SEVERITY_ORDER.map((s) => (
            <SeverityRow key={s} severity={s} />
          ))}
        </div>
        {/* Flat dt/dd pairs, no wrapping <div> — axe's definition-list rule (a promoted hard-fail
            audit in this catalog) is safest treated as requiring dl's direct children to be only
            dt/dd. */}
        <dl className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 border-t border-white/10 px-5 py-4">
          <dt className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>Thresholds breached</dt>
          <dd className={cx("text-right text-lg font-semibold", NUM, TEXT_PRIMARY)}>{THRESHOLD_BREACH_COUNT}</dd>
          <dt className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>Avg. time to stabilize</dt>
          <dd className={cx("text-right text-lg font-semibold", NUM, TEXT_PRIMARY)}>{formatMinutes(AVG_RESOLUTION_MINUTES)}</dd>
        </dl>
      </Card>

      <Card id="pinned-kpi" title="Pinned instrument">
        <div className="px-5 pb-5">
          {pinnedInstrument && pinnedScore !== null ? (
            <div>
              <p className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-violet-300")}>
                <Pin aria-hidden="true" className="size-3" /> Synced from feed
              </p>
              <p title={pinnedInstrument.name} className={cx("mt-1.5 truncate text-sm font-medium", TEXT_PRIMARY)}>
                {pinnedInstrument.name}
              </p>
              <p className={cx("text-[11.5px]", TEXT_AUX)}>{pinnedInstrument.category}</p>
              <div className="mt-3 flex items-end justify-between">
                <span className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>Volatility score</span>
                <span className={cx("text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{pinnedScore.toFixed(1)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5" role="presentation">
                <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min(100, pinnedScore * 10)}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Gauge aria-hidden="true" className="size-5 text-zinc-500" />
              <p className={cx("text-[12.5px]", TEXT_AUX)}>No instrument pinned. Pin a signal from the feed to score it here.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
