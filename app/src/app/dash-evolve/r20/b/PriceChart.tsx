"use client";

import { useMemo, useState } from "react";
import type { Candle, InstrumentRow } from "./data";
import { DOWN_FILL, DOWN_TEXT, NUM, TEXT_AUX, TEXT_PRIMARY, UP_FILL, UP_TEXT, cx } from "./tokens";
import { formatPrice } from "./data";
import { useElementWidth, r2 } from "./ui";

const HEIGHT = 220;
const PAD = { top: 12, right: 8, bottom: 22, left: 8 };

export type Range = 20 | 10 | 5;

export default function PriceChart({ instrument, range }: { instrument: InstrumentRow; range: Range }) {
  const { ref, width } = useElementWidth<HTMLDivElement>(680);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const candles = useMemo(() => instrument.candles.slice(instrument.candles.length - range), [instrument, range]);

  const plotW = Math.max(80, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const step = plotW / candles.length;
  const bodyW = Math.max(2, r2(step * 0.56));

  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const span = hi - lo || 1;
  const y = (v: number) => r2(PAD.top + plotH - ((v - lo) / span) * plotH);
  const x = (i: number) => r2(PAD.left + i * step + step / 2);

  const linePath = candles.map((c, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(c.c)}`).join(" ");

  const active = activeDay !== null ? candles.find((c) => c.day === activeDay) ?? null : null;
  const last = candles[candles.length - 1];
  const first = candles[0];
  const changePct = Math.round(((last.c - first.o) / first.o) * 1000) / 10;
  const up = changePct >= 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{instrument.symbol}</p>
          <p className={cx("mt-0.5 flex items-baseline gap-2 text-[26px] font-semibold leading-none", NUM, TEXT_PRIMARY)}>
            {formatPrice(last.c, instrument.decimals)}
            <span className={cx("text-sm font-semibold", up ? UP_TEXT : DOWN_TEXT)}>
              {up ? "▲" : "▼"} {formatPrice(Math.abs(changePct), 2)}%
            </span>
          </p>
        </div>
        <div className={cx("flex gap-4 text-right text-[11px] font-normal", TEXT_AUX)}>
          <span>
            {`${range}D high `}
            <span className={cx("block font-semibold", NUM, TEXT_PRIMARY)}>{formatPrice(hi, instrument.decimals)}</span>
          </span>
          <span>
            {`${range}D low `}
            <span className={cx("block font-semibold", NUM, TEXT_PRIMARY)}>{formatPrice(lo, instrument.decimals)}</span>
          </span>
        </div>
      </div>

      <div ref={ref} className="mt-3">
        <svg viewBox={`0 0 ${width} ${HEIGHT}`} width="100%" height={HEIGHT} role="img" aria-label={`${instrument.symbol} candlestick chart, last ${range} sessions`} className="motion-reduce:transition-none">
          <line x1={PAD.left} x2={width - PAD.right} y1={y(lo)} y2={y(lo)} stroke="currentColor" strokeOpacity={0.12} className={TEXT_AUX} />
          <line x1={PAD.left} x2={width - PAD.right} y1={y(hi)} y2={y(hi)} stroke="currentColor" strokeOpacity={0.12} className={TEXT_AUX} />
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth={1.5} strokeOpacity={0.55} />
          {activeDay !== null && active ? <line x1={x(candles.indexOf(active))} x2={x(candles.indexOf(active))} y1={PAD.top} y2={PAD.top + plotH} stroke="#60a5fa" strokeWidth={1} strokeDasharray="2,2" /> : null}
          {candles.map((c, i) => {
            const isUp = c.c >= c.o;
            const fill = isUp ? UP_FILL : DOWN_FILL;
            const cx_ = x(i);
            return (
              <g key={c.day}>
                <line x1={cx_} x2={cx_} y1={y(c.h)} y2={y(c.l)} stroke={fill} strokeWidth={1} />
                <rect x={r2(cx_ - bodyW / 2)} y={r2(Math.min(y(c.o), y(c.c)))} width={bodyW} height={Math.max(1.5, r2(Math.abs(y(c.o) - y(c.c))))} fill={fill} />
              </g>
            );
          })}
          {/* Transparent focusable/hoverable hit targets — one per day, keyboard reachable, drive the reading rail below (ephemeral: no other widget reacts). */}
          {candles.map((c, i) => (
            <rect
              key={`hit-${c.day}`}
              x={r2(x(i) - step / 2)}
              y={0}
              width={r2(step)}
              height={HEIGHT}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`Day ${c.day}: open ${formatPrice(c.o, instrument.decimals)}, high ${formatPrice(c.h, instrument.decimals)}, low ${formatPrice(c.l, instrument.decimals)}, close ${formatPrice(c.c, instrument.decimals)}`}
              onMouseEnter={() => setActiveDay(c.day)}
              onFocus={() => setActiveDay(c.day)}
              onMouseLeave={() => setActiveDay((cur) => (cur === c.day ? null : cur))}
              onBlur={() => setActiveDay((cur) => (cur === c.day ? null : cur))}
              className="outline-none focus-visible:fill-white/[0.06]"
            />
          ))}
        </svg>
      </div>

      <div aria-live="polite" className={cx("mt-2 min-h-[1.5rem] rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-normal", TEXT_AUX)}>
        {active ? (
          <span className={NUM}>
            {`Day ${active.day} · O ${formatPrice(active.o, instrument.decimals)} · H ${formatPrice(active.h, instrument.decimals)} · L ${formatPrice(active.l, instrument.decimals)} · C ${formatPrice(active.c, instrument.decimals)}`}
          </span>
        ) : (
          "Hover or focus a candle for its exact OHLC."
        )}
      </div>
    </div>
  );
}

export type { Candle };
