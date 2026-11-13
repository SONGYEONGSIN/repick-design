"use client";

import { Card } from "./ui";
import { TOTAL_REQUESTS, ERROR_RATE_PCT, ERROR_RATE_PCT_LAST, PERCENTILES, ENDPOINTS, fmtCompact, type Period } from "./data";
import type { Endpoint } from "./data";

export function KpiRow({ period, focused }: { period: Period; focused: Endpoint | null }) {
  const errorDelta = Math.round((ERROR_RATE_PCT[period] - ERROR_RATE_PCT_LAST[period]) * 100) / 100;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Requests ({period})</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-mono)] text-2xl font-semibold tabular-nums text-slate-50">
          {fmtCompact(TOTAL_REQUESTS[period])}
        </p>
        <p className="mt-1 text-xs font-normal text-slate-400">across {ENDPOINTS.length} endpoints</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Error rate</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-mono)] text-2xl font-semibold tabular-nums text-slate-50">
          {ERROR_RATE_PCT[period]}%
        </p>
        <p className={`mt-1 text-xs font-normal tabular-nums ${errorDelta <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {errorDelta > 0 ? `+${errorDelta}` : errorDelta} pts vs prior window
        </p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Aggregate p99</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-mono)] text-2xl font-semibold tabular-nums text-slate-50">
          {PERCENTILES[period].p99}ms
        </p>
        <p className="mt-1 text-xs font-normal text-slate-400">tail latency, {period} window</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {focused ? "Focused endpoint" : "Endpoints monitored"}
        </p>
        {focused ? (
          <>
            <p className="mt-1.5 truncate font-[family-name:var(--font-display-mono)] text-lg font-semibold tabular-nums text-slate-50">
              p99 {focused.p99}ms
            </p>
            <p className="mt-1 truncate text-xs font-normal text-slate-400">{focused.path}</p>
          </>
        ) : (
          <>
            <p className="mt-1.5 font-[family-name:var(--font-display-mono)] text-2xl font-semibold tabular-nums text-slate-50">
              {ENDPOINTS.length}
            </p>
            <p className="mt-1 text-xs font-normal text-slate-400">select a row to focus one</p>
          </>
        )}
      </Card>
    </div>
  );
}
