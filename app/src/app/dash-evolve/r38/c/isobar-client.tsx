"use client";

import { useCallback, useState } from "react";
import { CommandPalette } from "./command-palette";
import { TIME_RANGES, type TimeRange } from "./data";
import { KpiStrip } from "./kpi-strip";
import { RegionFeed } from "./region-feed";
import { RegionMap } from "./region-map";
import { RegionTable } from "./region-table";
import { Sidebar } from "./sidebar";
import { TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Topbar } from "./topbar";
import { Segmented } from "./ui";

export function IsobarClient() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [pinnedRegionId, setPinnedRegionId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // The only setter the feed is ever handed — pinning a region is the single effect a feed
  // click has on the rest of the page, and only RegionMap receives `pinnedRegionId` as a prop.
  const handlePinRegion = useCallback((regionId: string) => setPinnedRegionId(regionId), []);
  const handleClearPin = useCallback(() => setPinnedRegionId(null), []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="top" className="px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className={cx("text-xl font-semibold tracking-tight", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-grotesk)" }}>
                Edge network overview
              </h1>
              <p className={cx("mt-1 text-sm font-normal", TEXT_AUX)}>Uptime, latency and incident load across 14 edge regions.</p>
            </div>
            <Segmented options={TIME_RANGES} value={timeRange} onChange={setTimeRange} ariaLabel="Time range" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <KpiStrip range={timeRange} />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-7">
                <RegionFeed onPinRegion={handlePinRegion} />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-5">
                <RegionMap range={timeRange} pinnedRegionId={pinnedRegionId} onClearPin={handleClearPin} />
              </div>
            </div>

            <RegionTable range={timeRange} />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
