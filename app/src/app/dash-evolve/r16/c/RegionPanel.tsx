"use client";

import { Activity, AlertOctagon, DollarSign, Gauge, MapPin, ShieldCheck, Zap } from "lucide-react";
import { currentLatency, deriveOverallStatus, SERVICE_META, type MetricId, type Region } from "./data";
import { ACCENT_LINE, BORDER, DIVIDE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, EyebrowLabel, StatTile, StatusBadge } from "./ui";
import MiniLineChart from "./MiniLineChart";

const TIER_TONE: Record<Region["tier"], string> = {
  Primary: "text-teal-800 bg-teal-50 border-teal-200",
  Secondary: "text-zinc-600 bg-zinc-100 border-zinc-200",
  Edge: "text-zinc-600 bg-zinc-100 border-zinc-200",
};

export default function RegionPanel({
  slot,
  region,
  focusMetric,
  activeIndex,
  onActiveIndexChange,
}: {
  slot: "a" | "b";
  region: Region;
  focusMetric: MetricId;
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
}) {
  const overall = deriveOverallStatus(region);
  const headingId = `panel-${slot}-heading`;

  return (
    <Card id={`panel-${slot}`} className="flex h-full min-w-0 flex-col" padded={false}>
      <section aria-labelledby={headingId} className="flex h-full flex-col p-4 sm:p-5">
        {/* Identity header */}
        <div className={cx("flex flex-wrap items-start justify-between gap-3 border-b pb-4", BORDER)}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <EyebrowLabel>Region {slot.toUpperCase()}</EyebrowLabel>
              <span className={cx("rounded-full border px-1.5 py-0.5 text-[10px] font-medium", TIER_TONE[region.tier])}>{region.tier}</span>
            </div>
            <h2 id={headingId} className={cx("mt-1 truncate text-xl font-semibold tracking-tight", TEXT_PRIMARY)}>
              {region.name}
            </h2>
            <p className={cx("mt-0.5 flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
              <MapPin size={12} aria-hidden="true" />
              {region.city}, {region.countryCode} &middot; {region.provider}
            </p>
          </div>
          <StatusBadge status={overall} />
        </div>

        {/* KPI cluster */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile label="Uptime (30d)" value={`${region.uptimePct30d.toFixed(2)}%`} Icon={ShieldCheck} focused={focusMetric === "uptime"} />
          <StatTile label="P95 latency" value={`${currentLatency(region)} ms`} Icon={Gauge} focused={focusMetric === "latency"} />
          <StatTile label="Error rate" value={`${region.errorRatePct.toFixed(2)}%`} Icon={AlertOctagon} focused={focusMetric === "errorRate"} />
          <StatTile label="Cost / hour" value={`$${region.costPerHour.toFixed(2)}`} Icon={DollarSign} focused={focusMetric === "cost"} />
          <StatTile label="Requests / min" value={`${region.requestsPerMinK.toFixed(1)}K`} Icon={Zap} />
          <StatTile label="Active incidents" value={String(region.services.filter((s) => s.status !== "operational").length)} Icon={Activity} />
        </div>

        {/* Dominant mini-visualization: 24h P95 latency trend, value always visible (not hover-only) */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-baseline justify-between">
            <EyebrowLabel>24h P95 latency trend</EyebrowLabel>
            <span className={cx("text-xs font-medium tabular-nums", TEXT_CAPTION)}>
              now: <span className={TEXT_PRIMARY}>{currentLatency(region)} ms</span>
            </span>
          </div>
          <MiniLineChart
            series={region.latencySeries}
            activeIndex={activeIndex}
            onActiveIndexChange={onActiveIndexChange}
            color={ACCENT_LINE}
            ariaLabel={`${region.name} P95 latency, last 24 hours, use arrow keys to scrub`}
            regionName={region.name}
          />
        </div>

        {/* Status list */}
        <div className="mt-4 flex-1">
          <EyebrowLabel>Service status</EyebrowLabel>
          <ul className={cx("mt-1.5 divide-y rounded-lg border", DIVIDE, BORDER)}>
            {SERVICE_META.map((meta) => {
              const state = region.services.find((s) => s.id === meta.id)!;
              return (
                <li key={meta.id} className="flex items-center gap-2.5 px-3 py-2">
                  <meta.Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  {/* Wraps instead of mid-word-truncating on narrow panels ("Primary Dat…" reads
                      worse than a two-line label — dash-brief-v3's grid-craft "말줄임 최소화" rule). */}
                  <span className={cx("min-w-0 flex-1 text-sm leading-snug", TEXT_PRIMARY)}>{meta.label}</span>
                  <span className={cx("shrink-0 whitespace-nowrap text-xs tabular-nums", TEXT_CAPTION_MUTED)}>{state.latencyMs} ms</span>
                  <StatusBadge status={state.status} />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Card>
  );
}
