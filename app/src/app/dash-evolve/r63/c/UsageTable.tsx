"use client";

import type { ApiKey } from "./data";
import { BUCKETS, bucketTotal, endpointLabel, formatNumber, matrixTotal } from "./data";

/**
 * Accessible fallback for the heatmap above: a real `<table>` with every row and column labeled
 * and every value printed, so the same data is available without hovering a single grid cell.
 * Rolled up into the same 4-hour `BUCKETS` the rail's mini-bar uses (rather than all 24 hourly
 * columns) purely so the table stays scroll-free at desktop widths — it reads the identical
 * `apiKey.matrix` the heatmap does, just regrouped, never a second dataset.
 */
export function UsageTable({ apiKey }: { apiKey: ApiKey }) {
  const colCount = BUCKETS.length + 2;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
        <caption className="sr-only">
          Request volume for {apiKey.name}, by endpoint and 4-hour window, today.
        </caption>
        <colgroup>
          <col style={{ width: "28%" }} />
          {BUCKETS.map((b) => (
            <col key={b.label} style={{ width: `${63 / BUCKETS.length}%` }} />
          ))}
          <col style={{ width: "9%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" className="px-2 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">
              Endpoint
            </th>
            {BUCKETS.map((b) => (
              <th
                key={b.label}
                scope="col"
                className="whitespace-nowrap px-2 py-2 text-right text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600"
              >
                {b.label}
              </th>
            ))}
            <th scope="col" className="whitespace-nowrap px-2 py-2 text-right text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {apiKey.scope.map((endpointId, r) => {
            const row = apiKey.matrix[r];
            const rowTotal = row.reduce((s, v) => s + v, 0);
            return (
              <tr key={endpointId} className="border-b border-zinc-100">
                <th
                  scope="row"
                  className="px-2 py-2 text-left font-mono text-xs font-normal text-zinc-700"
                  title={endpointLabel(endpointId)}
                >
                  <span className="block w-full truncate">{endpointLabel(endpointId)}</span>
                </th>
                {BUCKETS.map((b) => (
                  <td key={b.label} className="whitespace-nowrap px-2 py-2 text-right font-mono text-xs tabular-nums text-zinc-700">
                    {formatNumber(bucketTotal(row, b.hours))}
                  </td>
                ))}
                <td className="whitespace-nowrap px-2 py-2 text-right font-mono text-xs font-semibold tabular-nums text-zinc-900">
                  {formatNumber(rowTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="px-2 py-2 text-left text-xs font-semibold text-zinc-900">
              All endpoints
            </th>
            {BUCKETS.map((b) => (
              <td key={b.label} className="whitespace-nowrap px-2 py-2 text-right font-mono text-xs font-semibold tabular-nums text-zinc-900">
                {formatNumber(apiKey.matrix.reduce((sum, row) => sum + bucketTotal(row, b.hours), 0))}
              </td>
            ))}
            <td className="whitespace-nowrap px-2 py-2 text-right font-mono text-xs font-semibold tabular-nums text-zinc-900">
              {formatNumber(matrixTotal(apiKey.matrix))}
            </td>
          </tr>
        </tfoot>
      </table>
      <p className="sr-only">Table has {colCount} columns including endpoint and total.</p>
    </div>
  );
}
