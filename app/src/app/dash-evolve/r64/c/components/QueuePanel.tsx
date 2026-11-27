"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ShieldAlert } from "lucide-react";
import {
  DAILY_VOLUME_7D,
  PERIOD_OPTIONS,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  alertsWithinPeriod,
  analystWorkload,
  isActiveStatus,
  slaBurnPercent,
  severityCounts,
  type AnalystWorkloadRow,
  type Period,
} from "../lib/data";
import { INT_FMT, formatDuration } from "../lib/format";
import { Avatar, Card, CardHeader, FOCUS_RING, OnCallBadge, ProgressBar, SegmentedControl, Sparkline } from "./ui";

type SortKey = "open" | "avg";
type SortDir = "asc" | "desc";

const SEVERITY_BAR_TONE: Record<string, string> = {
  critical: "bg-rose-500",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-zinc-400",
};

function sortRows(rows: AnalystWorkloadRow[], key: SortKey, dir: SortDir): AnalystWorkloadRow[] {
  const sorted = [...rows].sort((a, b) => {
    const cmp = key === "open" ? a.openCount - b.openCount : a.avgQueueMinutes - b.avgQueueMinutes;
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

function SortHeader({ label, sortKey, active, dir, onSort }: { label: string; sortKey: SortKey; active: boolean; dir: SortDir; onSort: (k: SortKey) => void }) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-2.5 py-1.5 text-right">
      <button type="button" onClick={() => onSort(sortKey)} className={`inline-flex min-w-0 max-w-full items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}>
        <span className="min-w-0 truncate">{label}</span>
        {active ? dir === "asc" ? <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" /> : <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-300" aria-hidden="true" />}
      </button>
    </th>
  );
}

/**
 * Independent axis #3: this panel reads only `period`, the control shared with the feed above
 * it. It never reads `pinnedId` — pinning an alert in the feed never recomputes a single number
 * here — and its own analyst-table sort state is local, so sorting it never touches the feed.
 */
export function QueuePanel({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("open");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const periodAlerts = useMemo(() => alertsWithinPeriod(period), [period]);
  const counts = useMemo(() => severityCounts(periodAlerts), [periodAlerts]);
  const total = periodAlerts.length;
  const slaBreaches = useMemo(
    () => periodAlerts.filter((a) => isActiveStatus(a.status) && (slaBurnPercent(a) ?? 0) >= 100).length,
    [periodAlerts],
  );
  const workload = useMemo(() => sortRows(analystWorkload(periodAlerts), sortKey, sortDir), [periodAlerts, sortKey, sortDir]);
  const dailyTotal = DAILY_VOLUME_7D.reduce((sum, v) => sum + v, 0);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <Card className="flex min-w-0 flex-col">
      <CardHeader
        title="Queue summary"
        subtitle={`${total} alert${total === 1 ? "" : "s"} in the last ${period}`}
        action={<SegmentedControl ariaLabel="Queue window" value={period} onChange={onPeriodChange} options={PERIOD_OPTIONS} />}
      />

      <div className="min-w-0 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">7-day volume</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-900">{dailyTotal} alerts</p>
          </div>
          <Sparkline values={DAILY_VOLUME_7D} width={108} height={30} />
        </div>

        <div className="mt-4 min-w-0 space-y-2">
          {SEVERITY_ORDER.map((sev) => {
            const count = counts[sev];
            const pct = total === 0 ? 0 : Math.round((count / total) * 100);
            return (
              <div key={sev} className="flex min-w-0 items-center gap-2">
                <span className="w-16 shrink-0 truncate text-xs text-zinc-600">{SEVERITY_LABEL[sev]}</span>
                <span className="min-w-0 flex-1">
                  <ProgressBar percent={pct} tone={SEVERITY_BAR_TONE[sev]} />
                </span>
                <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-zinc-900">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-xs text-rose-800">Active alerts past SLA target</span>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-rose-700">{INT_FMT.format(slaBreaches)}</span>
        </div>

        <h3 className="mt-5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">Analyst workload</h3>

        <div className="mt-2 hidden min-w-0 lg:block">
          <table className="w-full min-w-0 table-fixed border-collapse text-xs">
            <caption className="sr-only">Analyst workload for the last {period}, sortable by column</caption>
            <colgroup>
              <col style={{ width: "48%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "26%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                <th scope="col" className="overflow-hidden px-2.5 py-1.5 text-left text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                  <span className="block truncate">Analyst</span>
                </th>
                <SortHeader label="Open" sortKey="open" active={sortKey === "open"} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Avg queue" sortKey="avg" active={sortKey === "avg"} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {workload.map((row) => (
                <tr key={row.analyst.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="overflow-hidden px-2.5 py-1.5">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Avatar name={row.analyst.name} initials={row.analyst.initials} size={18} />
                      <span className="min-w-0 flex-1 truncate text-zinc-800">{row.analyst.name}</span>
                      <OnCallBadge onCall={row.analyst.onCall} />
                    </span>
                  </td>
                  <td className="overflow-hidden px-2.5 py-1.5 text-right font-semibold tabular-nums text-zinc-900">{row.openCount}</td>
                  <td className="overflow-hidden px-2.5 py-1.5 text-right tabular-nums text-zinc-600">
                    {row.openCount === 0 ? "—" : formatDuration(row.avgQueueMinutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-2 flex min-w-0 flex-col gap-1.5 lg:hidden">
          {workload.map((row) => (
            <li key={row.analyst.id} className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 px-2.5 py-2">
              <span className="flex min-w-0 items-center gap-1.5">
                <Avatar name={row.analyst.name} initials={row.analyst.initials} size={18} />
                <span className="min-w-0 truncate text-xs text-zinc-800">{row.analyst.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-600">
                <span className="tabular-nums font-semibold text-zinc-900">{row.openCount} open</span>
                <OnCallBadge onCall={row.analyst.onCall} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
