"use client";

import {
  BEST_CHANNEL_NOW,
  CHANNELS,
  DEFAULT_EXPANDED_CHANNEL_ID,
  PERIODS,
  SCHEMES,
  WORST_CHANNEL_NOW,
  currentValue,
  decliningCount,
  netRevenueImpact,
} from "./data";
import type { Period, Scheme } from "./data";
import { formatCount, formatPctSigned, formatUsdSigned } from "./format";
import { Card, SegmentedControl, valueTextClass } from "./ui";
import HorizonRow from "./horizon-row";

const BAND_LEGEND_VIOLET: { range: string; cls: string }[] = [
  { range: "0–15%", cls: "fill-violet-300" },
  { range: "15–30%", cls: "fill-violet-500" },
  { range: "30%+", cls: "fill-violet-700" },
];
const BAND_LEGEND_ROSE: { range: string; cls: string }[] = [
  { range: "0–15%", cls: "fill-rose-300" },
  { range: "15–30%", cls: "fill-rose-500" },
  { range: "30%+", cls: "fill-rose-700" },
];

function KpiCard({ label, value, valueClassName = "text-zinc-50", subtext }: { label: string; value: string; valueClassName?: string; subtext: string }) {
  return (
    <Card className="col-span-12 min-w-0 p-4 sm:col-span-6 xl:col-span-3">
      <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">{label}</p>
      {/* Strictly smaller than the 20px (text-xl) current-value label each horizon
          row renders — this KPI strip never outranks the dominant chart's own
          data text, even though it sits above it on the page. */}
      <p className={`mt-1.5 truncate tabular-nums text-base font-semibold ${valueClassName}`}>{value}</p>
      <p className="mt-0.5 truncate font-normal text-xs text-zinc-400">{subtext}</p>
    </Card>
  );
}

function Swatch({ range, cls }: { range: string; cls: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width={10} height={10} aria-hidden="true">
        <rect width={10} height={10} rx={2} className={cls} />
      </svg>
      <span className="font-normal text-[11px] text-zinc-400">{range}</span>
    </span>
  );
}

export default function HorizonBoard({
  period,
  onPeriodChange,
  scheme,
  onSchemeChange,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  scheme: Scheme;
  onSchemeChange: (s: Scheme) => void;
}) {
  const periodDays = period === "30d" ? 30 : 90;
  const netImpact = netRevenueImpact(periodDays);
  const declining = decliningCount(periodDays);
  const worstNow = currentValue(WORST_CHANNEL_NOW.id);
  const bestNow = currentValue(BEST_CHANNEL_NOW.id);

  return (
    <>
      {/* KPI / headline strip — above the grid of rows, never a separate detail
          pane. The "steepest decline" card is this page's single most important
          readout and is always on screen as plain text, never behind a hover. */}
      <KpiCard
        label="Net revenue impact"
        value={formatUsdSigned(netImpact)}
        valueClassName={valueTextClass(netImpact)}
        subtext={`vs baseline, ${period === "30d" ? "last 30 days" : "last 90 days"}`}
      />
      <KpiCard label="Channels declining" value={`${formatCount(declining)} / ${formatCount(CHANNELS.length)}`} subtext={`by average deviation, ${period === "30d" ? "30d" : "90d"}`} />
      <KpiCard
        label="Steepest decline, right now"
        value={`${WORST_CHANNEL_NOW.name} ${formatPctSigned(worstNow)}`}
        valueClassName={valueTextClass(worstNow)}
        subtext="today vs 28-day baseline, independent of the period toggle"
      />
      <KpiCard
        label="Strongest gain, right now"
        value={`${BEST_CHANNEL_NOW.name} ${formatPctSigned(bestNow)}`}
        valueClassName={valueTextClass(bestNow)}
        subtext="today vs 28-day baseline, independent of the period toggle"
      />

      <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="horizon-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="horizon-heading" className="font-semibold text-sm text-zinc-50">
              Revenue deviation by channel
            </h2>
            <p className="mt-1 max-w-xl font-normal text-xs text-zinc-400">
              Daily % deviation from each channel&apos;s 28-day baseline, folded into three-band horizon strips. Current value is pinned at the right
              of every row, so color is never the only way to read it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl ariaLabel="Chart period" options={PERIODS.map((p) => ({ value: p.value, label: p.value === "30d" ? "30d" : "90d" }))} value={period} onChange={onPeriodChange} />
            <SegmentedControl ariaLabel="Band intensity scheme" options={SCHEMES} value={scheme} onChange={onSchemeChange} />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 pt-3">
          <span className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Gain</span>
          {BAND_LEGEND_VIOLET.map((b) => (
            <Swatch key={b.range} range={b.range} cls={b.cls} />
          ))}
          {scheme === "diverging" ? (
            <>
              <span className="ml-2 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Decline</span>
              {BAND_LEGEND_ROSE.map((b) => (
                <Swatch key={b.range} range={b.range} cls={b.cls} />
              ))}
            </>
          ) : (
            <span className="font-normal text-[11px] text-zinc-400">(decline uses the same ramp — sign is read from each row&apos;s signed value, not color)</span>
          )}
        </div>

        <div className="mt-2">
          {CHANNELS.map((channel) => (
            <HorizonRow
              key={channel.id}
              channel={channel}
              period={period}
              scheme={scheme}
              isWorstNow={channel.id === WORST_CHANNEL_NOW.id}
              isBestNow={channel.id === BEST_CHANNEL_NOW.id}
              defaultExpanded={channel.id === DEFAULT_EXPANDED_CHANNEL_ID}
            />
          ))}
        </div>
      </Card>
    </>
  );
}
