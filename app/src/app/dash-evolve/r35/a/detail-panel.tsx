import { Gauge, Pin, PinOff } from "lucide-react";
import { CandlestickChart } from "./candlestick-chart";
import type { Period, Signal } from "./data";
import { formatPrice, getCandles, getInstrument, PERIOD_OPTIONS } from "./data";
import { OhlcTable } from "./ohlc-table";
import { cx, DISPLAY_MONO, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION } from "./tokens";
import { Card, ChangeBadge, EmptyState, SegmentedControl } from "./ui";

/**
 * The nullable detail area the feed drives. Nothing here is populated until a signal is pinned —
 * this is what keeps the macro layout "feed → detail-on-demand" rather than a trading-terminal third
 * pane that is always live. The persistent price/change/high/low row above the chart is shown as
 * static text regardless of hover, per the "single dominant visualization" completeness bar — the
 * crosshair tooltip inside the chart is strictly additional detail, not the only way to read it.
 */
export function DetailPanel({
  pinnedInstrumentId,
  pinnedSignal,
  period,
  onPeriodChange,
  onUnpin,
}: {
  pinnedInstrumentId: string | null;
  pinnedSignal: Signal | null;
  period: Period;
  onPeriodChange: (p: Period) => void;
  onUnpin: () => void;
}) {
  if (!pinnedInstrumentId) {
    return (
      <Card id="detail" title="Price action" description="Nothing pinned yet">
        <EmptyState
          icon={<Gauge aria-hidden="true" className="size-5" />}
          title="No signal pinned"
          description="Select an event from the signal feed to inspect its instrument's price action here."
        />
      </Card>
    );
  }

  const instrument = getInstrument(pinnedInstrumentId);
  if (!instrument) return null;

  const candles = getCandles(instrument, period);
  const latestClose = candles[candles.length - 1].close;
  const firstOpen = candles[0].open;
  const changePct = Math.round(((latestClose - firstOpen) / firstOpen) * 100 * 100) / 100;
  const periodHigh = Math.max(...candles.map((c) => c.high));
  const periodLow = Math.min(...candles.map((c) => c.low));

  return (
    <Card
      id="detail"
      title={instrument.name}
      description={`${instrument.ticker} · ${instrument.market}`}
      action={<SegmentedControl ariaLabel="Chart period" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} size="sm" />}
    >
      <div className="px-5 pb-5">
        {pinnedSignal ? (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-violet-500/20 bg-violet-500/[0.06] px-3 py-2">
            <p className="flex min-w-0 items-center gap-2 text-[12.5px] text-violet-300">
              <Pin aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">
                Pinned from feed: &ldquo;{pinnedSignal.headline}&rdquo; at {pinnedSignal.time}
              </span>
            </p>
            <button
              type="button"
              onClick={onUnpin}
              className={cx("flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-violet-300", TRANSITION, FOCUS, "hover:bg-violet-500/10")}
            >
              <PinOff aria-hidden="true" className="size-3.5" />
              Unpin
            </button>
          </div>
        ) : null}

        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p style={DISPLAY_MONO} className={cx("text-[28px] font-semibold leading-none", NUM, TEXT_PRIMARY)}>
              {formatPrice(latestClose)}
            </p>
            <div className="mt-2">
              <ChangeBadge value={changePct} />
            </div>
          </div>
          <dl className="flex gap-6 text-right">
            <div>
              <dt className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>Period high</dt>
              <dd className={cx("mt-0.5 text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{formatPrice(periodHigh)}</dd>
            </div>
            <div>
              <dt className={cx("text-[11px] uppercase tracking-wider", TEXT_AUX)}>Period low</dt>
              <dd className={cx("mt-0.5 text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{formatPrice(periodLow)}</dd>
            </div>
          </dl>
        </div>

        <CandlestickChart candles={candles} instrumentName={instrument.name} />
      </div>

      <OhlcTable candles={candles} instrumentName={instrument.name} />
    </Card>
  );
}
