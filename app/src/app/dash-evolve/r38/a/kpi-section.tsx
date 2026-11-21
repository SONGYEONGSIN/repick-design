"use client";

import { Boxes, Gauge, OctagonAlert, CheckCircle2, PinOff } from "lucide-react";
import { VENDORS, getVendorStat, median, formatMs, formatNum, formatPct, STATUS_LABEL, type Period } from "./data";
import { Card, CategoryTag, StatusBadge, ProgressBar } from "./ui";

function KpiCard({ icon: Icon, label, value, caption }: { icon: typeof Boxes; label: string; value: string; caption: string }) {
  return (
    <Card className="flex min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-zinc-900">{value}</p>
      <p className="text-xs font-normal text-zinc-500">{caption}</p>
    </Card>
  );
}

/**
 * The four cards here are a fixed view of the whole fleet for the selected period — nothing in the
 * box plot or table ever changes what they show. The pinned-vendor card next to them is the only
 * thing a click on a box touches, and it is a completely separate component with its own prop, not
 * a fifth slot in this same grid fed by the same selector.
 */
export function KpiStrip({ period }: { period: Period }) {
  const stats = VENDORS.map((v) => getVendorStat(v, period));
  const fleetMedian = median(stats.map((s) => s.median));
  const breachCount = stats.filter((s) => s.status === "breach").length;
  const watchCount = stats.filter((s) => s.status === "watch").length;
  const onTrackCount = stats.filter((s) => s.status === "on-track").length;
  const outlierSum = stats.reduce((sum, s) => sum + s.outliers, 0);
  const onTrackPct = (onTrackCount / VENDORS.length) * 100;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard icon={Boxes} label="Vendors monitored" value={formatNum(VENDORS.length)} caption="across 6 integration categories" />
      <KpiCard icon={Gauge} label="Fleet median latency" value={formatMs(fleetMedian)} caption={`median of all vendor medians · ${period}`} />
      <KpiCard icon={OctagonAlert} label="SLA breaches" value={formatNum(breachCount)} caption={`${watchCount} more on watch`} />
      <Card className="flex min-w-0 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="text-[11px] font-medium uppercase tracking-wide">On-track share</span>
        </div>
        <p className="text-2xl font-semibold tabular-nums text-zinc-900">{onTrackPct.toFixed(0)}%</p>
        <ProgressBar value={onTrackPct} label="Share of vendors on track" valueText={`${onTrackPct.toFixed(0)} percent on track, ${outlierSum} outliers flagged fleet-wide this period`} />
        <p className="text-xs font-normal text-zinc-500">{formatNum(outlierSum)} outliers flagged this period</p>
      </Card>
    </div>
  );
}

export function PinnedVendorCard({ period, pinnedId, onClear }: { period: Period; pinnedId: string | null; onClear: () => void }) {
  const vendor = VENDORS.find((v) => v.id === pinnedId) ?? null;

  if (!vendor) {
    return (
      <Card className="flex h-full min-w-0 flex-col items-start justify-center gap-1 p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Pinned vendor</p>
        <p className="text-sm font-normal text-zinc-500">Click any box in the chart to pin its summary here.</p>
      </Card>
    );
  }

  const stat = getVendorStat(vendor, period);

  return (
    <Card className="flex min-w-0 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Pinned vendor</p>
          <p className="truncate text-sm font-semibold text-zinc-900">{vendor.name}</p>
          <CategoryTag category={vendor.category} />
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 outline-offset-2 transition-colors duration-150 ease-out hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
        >
          <PinOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Unpin
        </button>
      </div>
      <StatusBadge status={stat.status} label={STATUS_LABEL[stat.status]} />
      <dl className="grid grid-cols-5 gap-2 text-center">
        {(
          [
            ["Min", stat.min],
            ["Q1", stat.q1],
            ["Med", stat.median],
            ["Q3", stat.q3],
            ["Max", stat.max],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
            <dd className={`text-xs tabular-nums ${label === "Med" ? "font-semibold text-zinc-900" : "font-normal text-zinc-700"}`}>{formatNum(value)}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs font-normal tabular-nums text-zinc-500">
        {formatNum(stat.requests)} requests · {formatPct(stat.errorRate)} errors · {stat.outliers} outliers
      </p>
    </Card>
  );
}
