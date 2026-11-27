"use client";

import { Card } from "./ui";
import { currencyFmt, type Candle, type Lot, type Period } from "./data";

/**
 * Required data-table fallback for the candlestick chart above (WCAG a11y grade
 * for this chart type is B). Always rendered in the page flow — never gated
 * behind a modal — and kept in sync with the chart's own lot + period state.
 */
export function OhlcTable({
  lot,
  candles,
  period,
  dateFmt,
}: {
  lot: Lot;
  candles: Candle[];
  period: Period;
  dateFmt: Intl.DateTimeFormat;
}) {
  const rows = [...candles].reverse();

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="px-4 pt-4 sm:px-5">
        <h2 className="text-sm font-medium text-zinc-50">Price history data</h2>
        <p className="mt-0.5 text-xs font-normal text-zinc-400">
          Full {period === "daily" ? "daily" : "weekly"} open, high, low and close values for {lot.code} — the table behind the chart above, most recent
          first.
        </p>
      </div>
      <div className="mt-3 overflow-x-auto lg:overflow-x-visible">
        <table className="w-full min-w-[420px] table-fixed border-collapse text-sm lg:min-w-0">
          <caption className="sr-only">
            {period === "daily" ? "Daily" : "Weekly"} open, high, low and close prices for {lot.title} ({lot.code})
          </caption>
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "20.5%" }} />
            <col style={{ width: "20.5%" }} />
            <col style={{ width: "20.5%" }} />
            <col style={{ width: "20.5%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Period
              </th>
              <th scope="col" className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Open
              </th>
              <th scope="col" className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                High
              </th>
              <th scope="col" className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Low
              </th>
              <th scope="col" className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Close
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((c, i) => (
              <tr key={i} className="transition-colors motion-reduce:transition-none hover:bg-white/[0.03]">
                <th scope="row" className="whitespace-nowrap px-3 py-2 text-left text-xs font-normal tabular-nums text-zinc-300">
                  {dateFmt.format(c.date)}
                </th>
                <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-normal tabular-nums text-zinc-300">{currencyFmt.format(c.open)}</td>
                <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-normal tabular-nums text-zinc-300">{currencyFmt.format(c.high)}</td>
                <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-normal tabular-nums text-zinc-300">{currencyFmt.format(c.low)}</td>
                <td className="whitespace-nowrap px-2 py-2 text-right text-xs font-medium tabular-nums text-zinc-50">{currencyFmt.format(c.close)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" />
    </Card>
  );
}
