"use client";

import type { Candle } from "./data";
import { formatCompact, formatPrice } from "./data";
import { Card } from "./ui";

/** Accessible fallback for the candlestick chart: every candle's exact values in a plain table,
 *  plus the same up/filled vs down/hollow pattern note used on the chart's legend. Shown alongside
 *  the chart (not instead of it), capped to the most recent 12 rows with a vertical scroller so a
 *  30-candle month view never grows the page without bound; the scroller is vertical only, so it
 *  never competes with the chart's own horizontal space. */
export function OhlcTable({ candles, symbol, decimals, period }: { candles: Candle[]; symbol: string; decimals: number; period: string }) {
  const rows = candles.slice(-12).reverse();

  return (
    <Card className="p-4">
      <h2 className="font-semibold text-sm text-zinc-900">Historical OHLC — {symbol}</h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-500">Up = hollow candle body · Down = filled candle body. Most recent {rows.length} of {candles.length} candles, newest first.</p>

      <ul className="mt-3 space-y-2 sm:hidden">
        {rows.map((c) => (
          <li key={c.label} className="rounded-lg border border-zinc-200 p-2.5">
            <dl className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
              <dt className="col-span-3 font-medium text-zinc-900">{c.label}</dt>
              <dt className="font-normal text-zinc-500">Open</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatPrice(c.open, decimals)}</dd>
              <dt className="font-normal text-zinc-500">High</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatPrice(c.high, decimals)}</dd>
              <dt className="font-normal text-zinc-500">Low</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatPrice(c.low, decimals)}</dd>
              <dt className="font-normal text-zinc-500">Close</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatPrice(c.close, decimals)}</dd>
              <dt className="font-normal text-zinc-500">Volume</dt>
              <dd className="col-span-2 text-right font-normal tabular-nums text-zinc-800">{formatCompact(c.volume)}</dd>
            </dl>
          </li>
        ))}
      </ul>

      <div className="mt-3 hidden max-h-72 overflow-y-auto sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-500">
            {period} candle history for {symbol}, newest first.
          </caption>
          {/* Volume dropped from this desktop table: at the widths this console targets, the
              four price columns (up to 9 tabular-num characters each, e.g. "64,816.10") need
              more room than a 6-way split can spare. Volume stays visible in the mobile card
              list above and in the latest-candle stat row at the top of the page. */}
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "22%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Date
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Open
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                High
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Low
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">
                Close
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.label} className="border-b border-zinc-100 motion-safe:transition-colors hover:bg-zinc-50">
                <td className="py-2 font-medium text-sm text-zinc-800">{c.label}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatPrice(c.open, decimals)}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatPrice(c.high, decimals)}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatPrice(c.low, decimals)}</td>
                <td className="py-2 text-right font-normal text-sm tabular-nums text-zinc-700">{formatPrice(c.close, decimals)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
