import { Gauge, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { AVG_RESOLUTION_MINUTES, formatCount, formatMinutes, THRESHOLD_BREACH_COUNT, TOTAL_SIGNALS, VOLATILITY_INDEX_DELTA, VOLATILITY_INDEX_NOW } from "./data";
import { cx, DISPLAY_MONO, NUM, TEXT_AUX, TEXT_PRIMARY } from "./tokens";
import { Card, SectionLabel } from "./ui";

function DeltaNote({ value }: { value: number }) {
  const isZero = Math.abs(value) < 0.05;
  const Icon = isZero ? Minus : value > 0 ? TrendingUp : TrendingDown;
  const color = isZero ? "text-zinc-400" : value > 0 ? "text-rose-400" : "text-emerald-400";
  return (
    <span className={cx("inline-flex items-center gap-1 text-[12.5px] font-medium", NUM, color)}>
      <Icon aria-hidden="true" className="size-3.5" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)} pts vs last week
    </span>
  );
}

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>{label}</p>
      <p className={cx("mt-1 text-lg font-semibold", NUM, TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

/**
 * Hero number + inline supporting stats, not a four-up KPI card grid — one of this round's
 * "KPI variety" layout requirements. Every figure here reduces from SIGNALS/INSTRUMENTS in data.ts,
 * never a hand-typed duplicate total.
 */
export function HeroStats() {
  return (
    <Card className="overflow-visible">
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Gauge aria-hidden="true" className="size-5" />
          </span>
          <div>
            <SectionLabel>Portfolio volatility index</SectionLabel>
            <div className="mt-1 flex items-baseline gap-3">
              <span style={DISPLAY_MONO} className={cx("text-4xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                {VOLATILITY_INDEX_NOW.toFixed(1)}
              </span>
              <DeltaNote value={VOLATILITY_INDEX_DELTA} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-5 sm:border-t-0 sm:pt-0">
          <InlineStat label="Active signals today" value={formatCount(TOTAL_SIGNALS)} />
          <InlineStat label="Thresholds breached" value={formatCount(THRESHOLD_BREACH_COUNT)} />
          <InlineStat label="Avg. time to stabilize" value={formatMinutes(AVG_RESOLUTION_MINUTES)} />
        </div>
      </div>
    </Card>
  );
}
