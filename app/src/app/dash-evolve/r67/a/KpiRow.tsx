"use client";

import { useState, type ReactNode } from "react";
import { CalendarCheck2, TrendingUp, AlertTriangle, Building2 } from "lucide-react";
import {
  SITES,
  TODAY_DAY,
  countFmt,
  formatPercent,
  onTimeRate,
  sparklineSeries,
  statusCounts,
  type Trial,
  type Visit,
} from "./data";
import { Card } from "./Card";
import { Progress } from "./Progress";
import { Sparkline } from "./Sparkline";
import { cx, FOCUS_RING } from "./ui";

interface KpiRowProps {
  visits: Visit[];
  trial: Trial;
}

function KpiShell({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-500">{icon}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      </div>
      {children}
    </Card>
  );
}

export function KpiRow({ visits, trial }: KpiRowProps) {
  // Ephemeral per-site hover/focus axis — entirely separate from `selectedDay` in SiteframeApp,
  // which drives the VisitBoard below. This state never reads or writes that selection, and
  // nothing outside this one card ever reads `hoveredSite`: it is the independently-scoped
  // selection axis the brief asks for, living on a different dominant widget than the calendar.
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);
  const status = statusCounts(visits);
  const total = visits.length;
  const targetRatio = total / trial.monthlyTarget;
  const overallOnTime = onTimeRate(visits);
  const series = sparklineSeries(visits);
  const monthToDateTotal = visits.filter((v) => v.day <= TODAY_DAY).length;
  const missedPct = monthToDateTotal > 0 ? status.missed / monthToDateTotal : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiShell icon={<CalendarCheck2 className="h-4 w-4" aria-hidden="true" />} label="Visits this month">
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-bold tabular-nums text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            {countFmt.format(total)}
          </p>
          <Sparkline values={series} label={`Trailing 7-day visit volume, ending at ${total} this month`} />
        </div>
        <Progress ratio={targetRatio} label={`On pace for target of ${trial.monthlyTarget}`} />
      </KpiShell>

      <KpiShell icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />} label="On-time rate">
        <p className="text-3xl font-bold tabular-nums text-zinc-900">{formatPercent(overallOnTime)}</p>
        <p className="text-xs text-zinc-500">Completed vs. missed, month to date.</p>
        <div className="flex flex-wrap gap-1.5 pt-1" role="group" aria-label="On-time rate by site">
          {SITES.map((site) => {
            const rate = onTimeRate(visits, site.id);
            const active = hoveredSite === site.id;
            return (
              <button
                key={site.id}
                type="button"
                onMouseEnter={() => setHoveredSite(site.id)}
                onMouseLeave={() => setHoveredSite((s) => (s === site.id ? null : s))}
                onFocus={() => setHoveredSite(site.id)}
                onBlur={() => setHoveredSite((s) => (s === site.id ? null : s))}
                className={cx(
                  "relative rounded-md border px-2 py-1.5 text-[11px] font-medium tabular-nums",
                  FOCUS_RING,
                  active ? "border-lime-300 bg-lime-50 text-lime-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                )}
              >
                {site.code}
                <span className="sr-only">
                  {" "}
                  on-time rate {formatPercent(rate)} at {site.name}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-10 w-40 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-2.5 text-left text-xs shadow-lg"
                  >
                    <span className="block truncate font-bold text-zinc-900">{site.name}</span>
                    <span className="mt-0.5 block text-zinc-600">
                      On-time: <span className="font-medium tabular-nums text-zinc-900">{formatPercent(rate)}</span>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </KpiShell>

      <KpiShell icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />} label="Missed visits">
        <p className="text-3xl font-bold tabular-nums text-zinc-900">{countFmt.format(status.missed)}</p>
        <p className="text-xs text-zinc-500">
          <span className="font-medium tabular-nums text-zinc-700">{formatPercent(missedPct)}</span> of month-to-date visits
        </p>
      </KpiShell>

      <KpiShell icon={<Building2 className="h-4 w-4" aria-hidden="true" />} label="Active sites">
        <p className="text-3xl font-bold tabular-nums text-zinc-900">{countFmt.format(SITES.length)}</p>
        <p className="text-xs text-zinc-500">Enrolling and scheduling visits for {trial.code}.</p>
      </KpiShell>
    </div>
  );
}
