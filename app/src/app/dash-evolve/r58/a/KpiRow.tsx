"use client";

import { Card } from "./ui";
import {
  UTILIZATION_PCT,
  UTILIZATION_PCT_LAST,
  WEEK_REVENUE,
  WEEK_REVENUE_LAST,
  NO_SHOW_RATE,
  NO_SHOW_RATE_LAST,
  BOOKINGS,
  fmtUsd,
} from "./data";

const R = 15.5;
const CIRCUMFERENCE = Number((2 * Math.PI * R).toFixed(2));

function UtilizationRing({ pct }: { pct: number }) {
  const offset = Number((CIRCUMFERENCE * (1 - pct / 100)).toFixed(2));
  return (
    <svg width="44" height="44" viewBox="0 0 36 36" className="flex-shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r={R} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10" />
      <circle
        cx="18"
        cy="18"
        r={R}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
        strokeDashoffset={offset}
        className="text-indigo-400"
      />
    </svg>
  );
}

export function KpiRow({ selectedRevenue, selectedLabel }: { selectedRevenue: number | null; selectedLabel: string | null }) {
  const revenueDelta = Math.round(((WEEK_REVENUE - WEEK_REVENUE_LAST) / WEEK_REVENUE_LAST) * 1000) / 10;
  const utilDelta = Math.round((UTILIZATION_PCT - UTILIZATION_PCT_LAST) * 10) / 10;
  const noShowDelta = Math.round((NO_SHOW_RATE - NO_SHOW_RATE_LAST) * 10) / 10;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <Card className="flex items-center gap-3">
        <UtilizationRing pct={UTILIZATION_PCT} />
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Utilization</p>
          <p className="font-[family-name:var(--font-display-wide)] text-xl font-semibold tabular-nums text-slate-50">
            {UTILIZATION_PCT}%
          </p>
          <p className={`text-xs font-normal tabular-nums ${utilDelta >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {utilDelta > 0 ? `+${utilDelta}` : utilDelta} pts vs last week
          </p>
        </div>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Bookings this week</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-slate-50">
          {BOOKINGS.length}
        </p>
        <p className="mt-1 text-xs font-normal tabular-nums text-slate-400">across 6 resources</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Revenue booked</p>
        <p className="mt-1.5 font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-slate-50">
          {fmtUsd(WEEK_REVENUE)}
        </p>
        <p className="mt-1 text-xs font-normal tabular-nums text-emerald-400">+{revenueDelta}% vs last week</p>
      </Card>

      <Card>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          {selectedLabel ? "Selected booking" : "No-show rate"}
        </p>
        {selectedLabel && selectedRevenue !== null ? (
          <>
            <p className="mt-1.5 truncate font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-slate-50">
              {fmtUsd(selectedRevenue)}
            </p>
            <p className="mt-1 truncate text-xs font-normal text-slate-400">{selectedLabel}</p>
          </>
        ) : (
          <>
            <p className="mt-1.5 font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-slate-50">
              {NO_SHOW_RATE}%
            </p>
            <p className="mt-1 text-xs font-normal tabular-nums text-emerald-400">{noShowDelta} pts vs last week</p>
          </>
        )}
      </Card>
    </div>
  );
}
