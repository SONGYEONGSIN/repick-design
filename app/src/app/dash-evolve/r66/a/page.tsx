"use client";

import { useEffect, useState } from "react";
import { Activity, Gauge, Globe, TrendingDown, TrendingUp } from "lucide-react";
import AppShell from "./AppShell";
import RegionRail from "./RegionRail";
import GridChart from "./GridChart";
import EventFeed from "./EventFeed";
import CommandPalette from "./CommandPalette";
import { GRID_HOURLY, REGIONS, supplyOf, balanceOf, renewableShareOf, formatMw, formatSignedMw, formatPct, type TimeRange } from "./data";

export default function Page() {
  const [pinnedRegionId, setPinnedRegionId] = useState(REGIONS[2].id);
  const [range, setRange] = useState<TimeRange>("24h");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The stat strip is reduced directly from the exact same GRID_HOURLY array the center chart and
  // the region rail both read — never authored as separate "plausible" numbers.
  const now = GRID_HOURLY[GRID_HOURLY.length - 1];
  const totalSupply = supplyOf(now);
  const totalBalance = balanceOf(now);
  const renewableShare = renewableShareOf(now);
  const surplus = totalBalance >= 0;

  return (
    <>
      <AppShell onOpenSearch={() => setPaletteOpen(true)}>
        <div className="flex flex-col lg:h-full lg:min-h-0">
          <section aria-labelledby="grid-heading" className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6">
            <h2 id="grid-heading" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Grid-wide health
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <StatTile icon={Globe} label="Regions" value={String(REGIONS.length)} tone="text-zinc-300" />
              <StatTile icon={Gauge} label="Generation" value={formatMw(totalSupply)} tone="text-zinc-300" />
              <StatTile icon={Activity} label="Demand" value={formatMw(now.demandMw)} tone="text-zinc-300" />
              <StatTile
                icon={surplus ? TrendingUp : TrendingDown}
                label="Net balance"
                value={formatSignedMw(totalBalance)}
                tone={surplus ? "text-emerald-400" : "text-rose-400"}
              />
              <StatTile icon={TrendingUp} label="Renewable share" value={formatPct(renewableShare)} tone="text-indigo-300" />
            </dl>
          </section>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_380px] lg:overflow-hidden">
            <div className="min-w-0 border-b border-white/10 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
              <RegionRail pinnedId={pinnedRegionId} onPin={setPinnedRegionId} />
            </div>

            <div className="min-w-0 lg:min-h-0 lg:overflow-hidden">
              <GridChart range={range} onRangeChange={setRange} />
            </div>

            <div className="min-w-0 border-t border-white/10 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
              <EventFeed pinnedRegionId={pinnedRegionId} />
            </div>
          </div>
        </div>
      </AppShell>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onPinRegion={setPinnedRegionId} />}
    </>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${tone}`} />
        <span className="min-w-0 truncate">{label}</span>
      </dt>
      <dd className={`mt-1 truncate text-xl font-semibold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}
