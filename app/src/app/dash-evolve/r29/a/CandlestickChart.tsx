"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CandlestickChart as CandlestickChartIcon } from "lucide-react";
import { Card, SectionLabel, SegmentedControl, ChangeReadout, FOCUS_RING } from "./ui";
import { OhlcTable } from "./OhlcTable";
import {
  LOTS,
  DEFAULT_CHART_LOT_ID,
  findLot,
  aggregateWeekly,
  currencyFmt,
  shortDateFmt,
  longDateFmt,
  type Period,
} from "./data";

const W = 800;
const H = 240;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const INITIAL_LOT = findLot(DEFAULT_CHART_LOT_ID) ?? LOTS[0];

export function CandlestickChart() {
  const [chartLotId, setChartLotId] = useState(DEFAULT_CHART_LOT_ID);
  const [period, setPeriod] = useState<Period>("daily");
  const [focusIndex, setFocusIndex] = useState<number>(INITIAL_LOT.candles.length - 1);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const lot = findLot(chartLotId) ?? LOTS[0];
  const candles = useMemo(() => (period === "daily" ? lot.candles : aggregateWeekly(lot.candles)), [lot, period]);

  // Keep focusIndex valid whenever the underlying data set changes size; computed
  // during render (not an effect) since it's a pure derivation of props/state we
  // already have, following React's documented pattern for adjusting state from
  // a changed dependency without an extra render-after-effect round trip.
  const clampedFocusIndex = Math.min(focusIndex, candles.length - 1);

  function selectLot(id: string) {
    setChartLotId(id);
    setFocusIndex((LOTS.find((l) => l.id === id) ?? lot).candles.length - 1);
  }

  function selectPeriod(p: Period) {
    setPeriod(p);
    const next = p === "daily" ? lot.candles : aggregateWeekly(lot.candles);
    setFocusIndex(next.length - 1);
  }

  function moveFocus(nextIndex: number) {
    const clamped = Math.max(0, Math.min(candles.length - 1, nextIndex));
    setFocusIndex(clamped);
    buttonRefs.current[clamped]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveFocus(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocus(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveFocus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveFocus(candles.length - 1);
    }
  }

  const prices = candles.flatMap((c) => [c.high, c.low]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.08 || max * 0.05 || 1;
  const scaledMin = min - pad;
  const scaledMax = max + pad;

  function yScale(price: number): number {
    return round2(H - ((price - scaledMin) / (scaledMax - scaledMin)) * H);
  }

  const slot = W / candles.length;
  const bodyWidth = round2(Math.max(slot * 0.5, 2));

  const active = candles[clampedFocusIndex];
  const activeIsLatest = clampedFocusIndex === candles.length - 1;
  const prevForActive = candles[clampedFocusIndex - 1];
  const activeChangePct = prevForActive && prevForActive.close !== 0 ? ((active.close - prevForActive.close) / prevForActive.close) * 100 : 0;
  const dateFmt = period === "daily" ? shortDateFmt : longDateFmt;
  const crosshairX = round2((clampedFocusIndex + 0.5) * slot);

  return (
    <div className="min-w-0 space-y-6">
      <Card className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <SectionLabel as="h2">Price chart</SectionLabel>
          <label className="mt-1 flex items-center gap-2">
            <span className="sr-only">Charting instrument</span>
            <CandlestickChartIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
            <select
              value={chartLotId}
              onChange={(e) => selectLot(e.target.value)}
              className={`min-w-0 max-w-full truncate rounded-md border border-transparent bg-transparent py-1 text-base font-semibold text-zinc-50 hover:border-white/10 ${FOCUS_RING}`}
            >
              {LOTS.map((l) => (
                <option key={l.id} value={l.id} className="bg-zinc-900 text-zinc-50">
                  {l.code} &middot; {l.title}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-0.5 text-xs font-normal text-zinc-400">
            Defaults to the desk&rsquo;s most actively bid lot &mdash; independent of the pin in the watchlist.
          </p>
        </div>
        <SegmentedControl
          label="Candle period"
          value={period}
          onChange={selectPeriod}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </div>

      {/* Embedded readout for the focused candle — always populated, defaults to the latest period. */}
      <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3 border-y border-white/10 py-3 sm:grid-cols-6">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{activeIsLatest ? "Latest" : "Period"}</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{dateFmt.format(active.date)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Open</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{currencyFmt.format(active.open)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">High</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{currencyFmt.format(active.high)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Low</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{currencyFmt.format(active.low)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Close</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{currencyFmt.format(active.close)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Change</dt>
          <dd className="mt-0.5 text-sm">
            <ChangeReadout pct={activeChangePct} />
          </dd>
        </div>
      </dl>

      <div className="relative mt-4" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" preserveAspectRatio="none">
          {/* Horizontal gridlines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={0} x2={W} y1={round2(H * f)} y2={round2(H * f)} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
          ))}
          {/* Crosshair */}
          <line x1={crosshairX} x2={crosshairX} y1={0} y2={H} className="stroke-indigo-400/50" strokeWidth={1} strokeDasharray="3 3" />
          {candles.map((c, i) => {
            const x = round2((i + 0.5) * slot);
            const up = c.close >= c.open;
            const bodyTop = yScale(Math.max(c.open, c.close));
            const bodyBottom = yScale(Math.min(c.open, c.close));
            const bodyHeight = round2(Math.max(bodyBottom - bodyTop, 1.5));
            const isFocused = i === clampedFocusIndex;
            const colorClass = up ? "fill-emerald-500 stroke-emerald-400" : "fill-rose-500 stroke-rose-400";
            return (
              <g key={i} opacity={isFocused ? 1 : 0.82}>
                <line x1={x} x2={x} y1={yScale(c.high)} y2={yScale(c.low)} className={up ? "stroke-emerald-400" : "stroke-rose-400"} strokeWidth={1.25} />
                <rect
                  x={round2(x - bodyWidth / 2)}
                  y={bodyTop}
                  width={bodyWidth}
                  height={bodyHeight}
                  className={colorClass}
                  strokeWidth={1}
                  rx={1}
                />
                {isFocused && (
                  <rect
                    x={round2(x - bodyWidth / 2 - 3)}
                    y={0}
                    width={round2(bodyWidth + 6)}
                    height={H}
                    fill="none"
                    className="stroke-indigo-400"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Roving-tabindex crosshair control: one real, focusable button per period, arrow-key
            navigable. This is the chart's own hover/keyboard crosshair — a third, independent
            interaction from the watchlist pin and its hover preview. */}
        <div role="group" aria-label={`${lot.code} candlestick chart. Use left and right arrow keys to move the crosshair between periods.`} className="absolute inset-0 flex">
          {candles.map((c, i) => {
            const changePct = i > 0 && candles[i - 1].close !== 0 ? ((c.close - candles[i - 1].close) / candles[i - 1].close) * 100 : 0;
            const dir = changePct > 0.05 ? "up" : changePct < -0.05 ? "down" : "flat";
            return (
              <button
                key={i}
                ref={(el) => {
                  buttonRefs.current[i] = el;
                }}
                type="button"
                tabIndex={i === clampedFocusIndex ? 0 : -1}
                onMouseEnter={() => setFocusIndex(i)}
                onFocus={() => setFocusIndex(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-label={`${dateFmt.format(c.date)}. Open ${currencyFmt.format(c.open)}, high ${currencyFmt.format(c.high)}, low ${currencyFmt.format(
                  c.low
                )}, close ${currencyFmt.format(c.close)}. ${dir === "up" ? "Up" : dir === "down" ? "Down" : "Flat"} ${Math.abs(round2(changePct))}% from prior period.`}
                className={`h-full flex-1 rounded-sm hover:bg-white/5 ${FOCUS_RING}`}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs font-normal text-zinc-400">
        {period === "daily" ? "Showing the last 30 trading days." : "Showing the last 6 trading weeks."} Full values are listed in the table below the chart.
      </p>
    </Card>

    <OhlcTable lot={lot} candles={candles} period={period} dateFmt={dateFmt} />
    </div>
  );
}
