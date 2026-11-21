"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import {
  REGIONS,
  TIERS,
  TIER_BY_ID,
  VIEW_OPTIONS,
  grandTotal,
  leadingTierOverall,
  regionSharePct,
  regionTotal,
  regionsByRank,
  round2,
  tierShareOfGrandPct,
  tierShareOfRegionPct,
  tierTotal,
  type MekkoView,
  type TierId,
} from "./data";
import { formatArr, formatArrExact, formatPercent } from "./format";
import { Card, FOCUS_RING, SegmentedControl, cn } from "./ui";

type HoverCell = { regionId: string; tierId: TierId } | null;

/** The Mekko board's own stack: one flex column per region, anchored to the shared baseline so
 *  "Revenue scale" view reads as true bars while "Share mix" always fills the full track. Column
 *  track widths come from a single CSS Grid whose `gridTemplateColumns` uses each region's own
 *  ARR figure as its `fr` value — the browser does the proportional math, so width can never drift
 *  from the underlying numbers. Heights are percentages derived from the same figures, rounded to
 *  2 decimals. Hovering/focusing a segment opens a fully ephemeral tooltip local to this component
 *  — it never touches `pinnedRegionId`, the spotlight card, or the fallback table below. */
export function MekkoBoard({
  view,
  onViewChange,
  pinnedRegionId,
  onPinRegion,
}: {
  view: MekkoView;
  onViewChange: (v: MekkoView) => void;
  pinnedRegionId: string;
  onPinRegion: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<HoverCell>(null);

  const total = grandTotal();
  const maxRegionTotal = Math.max(...REGIONS.map((r) => regionTotal(r)));
  const leadingTierId = leadingTierOverall();
  const leadingTier = TIER_BY_ID[leadingTierId];
  const topRegion = regionsByRank()[0];

  const gridTemplateColumns = REGIONS.map((r) => `${regionTotal(r)}fr`).join(" ");

  return (
    <Card as="section" aria-labelledby="mekko-heading" className="min-w-0 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="mekko-heading" className="font-medium text-[11px] uppercase tracking-[0.08em] text-zinc-400">
            Revenue mix board — Q4 2026
          </h2>
          {/* Always-visible headline readout — never hidden behind hover. Deliberately the
              single largest text on the page (text-4xl / 36px) so no KPI tile can outrank it. */}
          <p className="mt-1 font-semibold text-4xl tabular-nums text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
            {formatArr(total)}
          </p>
          <p className="mt-1.5 max-w-xl font-normal text-sm text-zinc-400">
            <span className={cn("mr-1.5 inline-block h-2 w-2 shrink-0 rounded-sm align-middle", leadingTier.swatch)} aria-hidden="true" />
            <span className="font-medium text-zinc-200">{leadingTier.label}</span> leads the tier mix at {formatArr(tierTotal(leadingTierId))} (
            {formatPercent(tierShareOfGrandPct(leadingTierId))} of ARR) — <span className="font-medium text-zinc-200">{topRegion.name}</span> is the
            largest region at {formatArr(regionTotal(topRegion))} ({formatPercent(regionSharePct(topRegion))}).
          </p>
        </div>
        <SegmentedControl ariaLabel="Board view" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
      </div>

      <p className="mt-5 font-normal text-xs text-zinc-400">
        Column width = each region&rsquo;s share of total ARR. Column height = plan-tier mix within that region. Click a region header to pin it to the
        spotlight card on the right; hover or focus a segment for its exact figures.
      </p>

      {/* Kanban-style column headers — each is a button that pins this region to the Region
          Spotlight card only. It never changes what the chart or the table below render. */}
      <div className="mt-4 grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns }}>
        {REGIONS.map((region) => {
          const pinned = region.id === pinnedRegionId;
          return (
            <button
              key={region.id}
              type="button"
              aria-pressed={pinned}
              aria-label={`Pin ${region.name} (${formatArr(regionTotal(region))}, ${formatPercent(regionSharePct(region))} of ARR) to the spotlight card`}
              onClick={() => onPinRegion(region.id)}
              className={cn(
                "min-w-0 rounded-md border px-1.5 py-1.5 text-left motion-safe:transition-colors sm:px-2",
                FOCUS_RING,
                pinned ? "border-teal-400/50 bg-teal-500/10" : "border-white/10 bg-zinc-950/60 hover:border-white/20",
              )}
            >
              <span className="flex items-center gap-1">
                {pinned ? <Pin className="h-2.5 w-2.5 shrink-0 text-teal-400" aria-hidden="true" /> : null}
                <span className="truncate font-medium text-[11px] text-zinc-100">{region.code}</span>
              </span>
              <span className="mt-0.5 block truncate font-normal text-[11px] tabular-nums text-zinc-400">{formatArr(regionTotal(region))}</span>
            </button>
          );
        })}
      </div>

      {/* The proportional stacks. CSS only — no chart library. */}
      <div className="mt-2 grid h-64 gap-1.5 sm:h-72 sm:gap-2 lg:h-80" style={{ gridTemplateColumns }}>
        {REGIONS.map((region, regionIndex) => {
          const regionTtl = regionTotal(region);
          const stackHeightPct = view === "share" ? 100 : round2((regionTtl / maxRegionTotal) * 100);
          const anchor = regionIndex === 0 ? "left-0" : regionIndex === REGIONS.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
          const activeHover = hovered?.regionId === region.id ? hovered : null;

          return (
            <div key={region.id} className="relative flex min-w-0 flex-col justify-end">
              <div
                className="flex w-full flex-col overflow-hidden rounded-[3px] outline outline-1 -outline-offset-1 outline-white/10"
                style={{ height: `${stackHeightPct}%` }}
              >
                {TIERS.map((tier) => {
                  const pct = tierShareOfRegionPct(region, tier.id);
                  const isHovered = activeHover?.tierId === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      style={{ height: `${pct}%` }}
                      onMouseEnter={() => setHovered({ regionId: region.id, tierId: tier.id })}
                      onMouseLeave={() => setHovered((h) => (h?.regionId === region.id && h.tierId === tier.id ? null : h))}
                      onFocus={() => setHovered({ regionId: region.id, tierId: tier.id })}
                      onBlur={() => setHovered((h) => (h?.regionId === region.id && h.tierId === tier.id ? null : h))}
                      aria-label={`${region.name}, ${tier.label}: ${formatArrExact(region.tiers[tier.id])}, ${formatPercent(pct)} of ${region.name}'s ARR`}
                      className={cn(
                        "w-full border-b border-zinc-950/50 last:border-b-0 motion-safe:transition-[filter] focus-visible:z-10",
                        FOCUS_RING,
                        tier.fill,
                        isHovered && "brightness-125",
                      )}
                    />
                  );
                })}
              </div>

              {activeHover ? (
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute bottom-[calc(100%+6px)] z-20 w-48 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 shadow-2xl",
                    anchor,
                  )}
                >
                  <p className="flex items-center gap-1.5 font-medium text-xs text-zinc-100">
                    <span className={cn("inline-block h-2 w-2 shrink-0 rounded-sm", TIER_BY_ID[activeHover.tierId].swatch)} />
                    {region.name} · {TIER_BY_ID[activeHover.tierId].label}
                  </p>
                  <p className="mt-1 font-semibold text-sm tabular-nums text-zinc-50">{formatArrExact(region.tiers[activeHover.tierId])}</p>
                  <p className="mt-0.5 font-normal text-[11px] text-zinc-400">
                    {formatPercent(tierShareOfRegionPct(region, activeHover.tierId))} of {region.name}&rsquo;s ARR
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Legend — color is always paired with a text label and an exact figure, never used alone. */}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">
        {TIERS.map((tier) => (
          <li key={tier.id} className="flex items-center gap-2">
            <span className={cn("inline-block h-2.5 w-2.5 shrink-0 rounded-sm", tier.swatch)} aria-hidden="true" />
            <span className="font-medium text-xs text-zinc-200">{tier.label}</span>
            <span className="font-normal text-xs tabular-nums text-zinc-400">
              {formatArr(tierTotal(tier.id))} · {formatPercent(tierShareOfGrandPct(tier.id))}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
