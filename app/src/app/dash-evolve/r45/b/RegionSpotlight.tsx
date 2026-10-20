"use client";

import { MapPin, Pin } from "lucide-react";
import { REGION_BY_ID, REGIONS, TIER_BY_ID, TIERS, leadingTierOf, regionRank, regionSharePct, regionTotal, tierShareOfRegionPct } from "./data";
import { formatArr, formatCount, formatPercent } from "./format";
import { Card, FOCUS_RING, MiniStack, cn } from "./ui";

/** Scoped to exactly one consumer: clicking a column header in MekkoBoard changes
 *  `pinnedRegionId`, and this card is the ONLY thing that re-renders because of it — the Mekko
 *  board and the fallback table below always keep showing every region regardless of the pin.
 *  Defaults to the largest region at first paint, so this card is never an empty
 *  "click to see details" placeholder. */
export function RegionSpotlight({ pinnedRegionId, onClearPin }: { pinnedRegionId: string; onClearPin: () => void }) {
  const region = REGION_BY_ID[pinnedRegionId] ?? REGIONS[0];
  const total = regionTotal(region);
  const rank = regionRank(region);
  const share = regionSharePct(region);
  const leadingTierId = leadingTierOf(region);
  const leadingTier = TIER_BY_ID[leadingTierId];
  const leadingShare = tierShareOfRegionPct(region, leadingTierId);

  const segments = TIERS.map((t) => ({ pct: tierShareOfRegionPct(region, t.id), fill: t.fill, label: t.label }));

  return (
    <Card as="section" aria-labelledby="spotlight-heading" className="min-w-0 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <h2 id="spotlight-heading" className="font-medium text-[11px] uppercase tracking-[0.08em]">
            Region spotlight
          </h2>
        </div>
        <button
          type="button"
          onClick={onClearPin}
          className={cn("flex items-center gap-1 rounded-md px-1.5 py-1 font-normal text-[11px] text-zinc-400 hover:text-zinc-300", FOCUS_RING)}
        >
          Reset to largest
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Pin className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden="true" />
        <p className="truncate font-semibold text-lg text-zinc-50">{region.name}</p>
      </div>
      <p className="mt-0.5 font-normal text-xs text-zinc-400">
        #{rank} of {REGIONS.length} regions by ARR
      </p>

      <p className="mt-4 font-semibold text-2xl tabular-nums text-zinc-50">{formatArr(total)}</p>
      <p className="mt-1 font-normal text-xs text-zinc-400">{formatPercent(share)} of total ARR</p>

      <div className="mt-4">
        <MiniStack segments={segments} />
        <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
          {TIERS.map((t) => (
            <li key={t.id} className="flex items-center gap-1.5">
              <span className={cn("inline-block h-2 w-2 shrink-0 rounded-sm", t.swatch)} aria-hidden="true" />
              <span className="truncate font-normal text-[11px] text-zinc-400">{t.label}</span>
              <span className="ml-auto shrink-0 font-medium text-[11px] tabular-nums text-zinc-200">{formatPercent(tierShareOfRegionPct(region, t.id), 0)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-zinc-950/60 p-3">
        <p className="font-normal text-[11px] text-zinc-400">
          Leading tier in {region.name} is <span className="font-medium text-zinc-200">{leadingTier.label}</span>, at {formatPercent(leadingShare, 0)} of this
          region&rsquo;s ARR.
        </p>
      </div>

      <p className="mt-3 font-normal text-[11px] text-zinc-400">{formatCount(region.accounts)} billed accounts in {region.name}.</p>
    </Card>
  );
}
