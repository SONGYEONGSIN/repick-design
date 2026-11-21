"use client";

import { useId, useMemo } from "react";
import { AlertTriangle, ChevronDown, Filter, type LucideIcon } from "lucide-react";
import { BOOKINGS, getCarriers, getOverallStats, formatDuration, pctFmt, countFmt, type Period } from "./data";
import { SegmentedControl, FOCUS_RING, NUM, DISPLAY_FACE } from "./ui";

export function Hero({
  period,
  onPeriodChange,
  focusedCarrier,
  onFocusCarrier,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  focusedCarrier: string | null;
  onFocusCarrier: (carrier: string | null) => void;
}) {
  const selectId = useId();
  const stats = useMemo(() => getOverallStats(period), [period]);
  const carriers = useMemo(() => getCarriers(period), [period]);

  // The carrier-focus "widget" this control drives: an always-real summary line, never an empty
  // default — with no carrier picked it summarizes the whole schedule instead of showing nothing.
  const focusSummary = useMemo(() => {
    if (!focusedCarrier) {
      return `${countFmt.format(stats.bookingCount)} bookings across ${countFmt.format(stats.doorCount)} doors ${period === "today" ? "today" : "tomorrow"}.`;
    }
    const carrierBookings = BOOKINGS[period].filter((bk) => bk.carrier === focusedCarrier);
    const minutes = carrierBookings.reduce((sum, bk) => sum + (bk.end - bk.start), 0);
    const doorCount = new Set(carrierBookings.map((bk) => bk.doorId)).size;
    return `${focusedCarrier}: ${countFmt.format(carrierBookings.length)} booking${carrierBookings.length === 1 ? "" : "s"} across ${countFmt.format(doorCount)} door${doorCount === 1 ? "" : "s"}, ${formatDuration(minutes)} total dwell.`;
  }, [focusedCarrier, period, stats.bookingCount, stats.doorCount]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-x-6 gap-y-4">
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-zinc-50" style={DISPLAY_FACE}>
            Dock schedule
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-zinc-400">
            Every carrier appointment across Harborview Terminal 4&apos;s 12 dock doors, live against the booked time window.
          </p>
        </div>
        <div className="col-span-12 flex min-w-0 items-start justify-start lg:col-span-5 lg:justify-end">
          <SegmentedControl
            label="Schedule day"
            value={period}
            onChange={onPeriodChange}
            options={[
              { value: "today", label: "Today" },
              { value: "tomorrow", label: "Tomorrow" },
            ]}
          />
        </div>
      </div>

      {/* Inline stat strip — deliberately not a KPI card grid: label/value pairs in one flowing
          row, divided by hairlines. */}
      <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 border-y border-white/10 py-3">
        <Stat value={countFmt.format(stats.doorCount)} label="Dock doors" />
        <Stat value={countFmt.format(stats.bookingCount)} label={`Bookings ${period === "today" ? "today" : "tomorrow"}`} />
        <Stat value={pctFmt.format(stats.utilization)} label="Utilization" />
        <Stat
          value={countFmt.format(stats.conflictDoorCount)}
          label="Conflicts flagged"
          icon={stats.conflictDoorCount > 0 ? AlertTriangle : undefined}
          tone={stats.conflictDoorCount > 0 ? "danger" : "default"}
        />
        <Stat value={formatDuration(stats.avgDwellMinutes)} label="Avg dwell time" />
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3">
        <label htmlFor={selectId} className="flex min-w-0 items-center gap-1.5 text-sm text-zinc-300">
          <Filter className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          Focus a carrier
        </label>
        <div className="relative min-w-0 shrink-0">
          <select
            id={selectId}
            value={focusedCarrier ?? ""}
            onChange={(e) => onFocusCarrier(e.target.value === "" ? null : e.target.value)}
            className={`h-9 min-w-0 max-w-[220px] appearance-none truncate rounded-lg border border-white/10 bg-zinc-900 py-0 pl-3 pr-8 text-sm text-zinc-50 ${FOCUS_RING}`}
          >
            <option value="">All carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
        </div>
        <p className="min-w-0 flex-1 truncate text-sm text-zinc-400">{focusSummary}</p>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  icon: Icon,
  tone = "default",
}: {
  value: string;
  label: string;
  icon?: LucideIcon;
  tone?: "default" | "danger";
}) {
  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      {Icon ? <Icon className={`h-4 w-4 shrink-0 self-center ${tone === "danger" ? "text-rose-400" : "text-zinc-400"}`} aria-hidden="true" /> : null}
      <span className={`whitespace-nowrap text-lg font-semibold ${tone === "danger" ? "text-rose-300" : "text-zinc-50"} ${NUM}`}>{value}</span>
      <span className="whitespace-nowrap text-[11px] uppercase tracking-wide text-zinc-400">{label}</span>
    </div>
  );
}
