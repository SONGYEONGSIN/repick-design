"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./command-palette";
import { BRAND, HUBS, PERIODS, TOTAL_VOLUME, fmtVolume, hubsAtRisk, networkOnTime } from "./data";
import type { PeriodId } from "./types";
import HubDetailPanel from "./hub-detail-panel";
import NetworkMap from "./network-map";
import RoutesTable from "./routes-table";
import Sidebar from "./sidebar";
import { DISPLAY_FONT, FOCUS_VISIBLE, NUM, PAGE_BG, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import Topbar from "./topbar";
import TrendChart from "./trend-chart";
import { Card, CardHeader, SegmentedControl } from "./ui";

const DEFAULT_HUB_ID = "lkm";

export default function ConsoleClient() {
  const [selectedHubId, setSelectedHubId] = useState(DEFAULT_HUB_ID);
  const [period, setPeriod] = useState<PeriodId>("7");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function selectHub(id: string) {
    setSelectedHubId(id);
  }

  const atRisk = hubsAtRisk(period);
  const netOnTime = networkOnTime(period);
  const periodMeta = PERIODS.find((p) => p.id === period)!;

  return (
    <div className={cx("flex min-h-dvh", PAGE_BG)}>
      <a
        href="#main-content"
        className={cx(
          "fixed left-3 top-3 z-[60] -translate-y-16 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-zinc-950 transition-transform focus:translate-y-0",
          FOCUS_VISIBLE,
        )}
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1">
          <div className="mx-auto w-full max-w-[1680px] px-6 py-6 lg:py-8">
            {/* Hero: headline stat + supporting inline stats + the period toggle that drives the
                whole page (map badges, chart, table, detail panel all read the same `period`). */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 style={DISPLAY_FONT} className={cx("text-2xl font-semibold tracking-tight", TEXT_PRIMARY)}>
                  {BRAND.name}
                </h1>
                <p className={cx("mt-1 text-sm", TEXT_CAPTION)}>{BRAND.tagline} across {HUBS.length} hubs and 3 corridors.</p>
              </div>
              <SegmentedControl options={PERIODS.map((p) => ({ id: p.id, label: p.label }))} value={period} onChange={setPeriod} ariaLabel="Reporting period" />
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4">
              <div>
                <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Network on-time rate</p>
                <p className={cx("mt-1 text-4xl font-semibold leading-none", NUM, TEXT_PRIMARY)} style={DISPLAY_FONT}>
                  {netOnTime.toFixed(1)}%
                </p>
                <p className={cx("mt-1 text-xs", TEXT_CAPTION)}>volume-weighted, {periodMeta.fullLabel}</p>
              </div>
              <div className="h-10 w-px shrink-0 bg-white/10" aria-hidden="true" />
              <InlineStat label="Daily volume" value={`${fmtVolume(TOTAL_VOLUME)} parcels`} />
              <InlineStat label="Active hubs" value={`${HUBS.length}`} />
              <InlineStat label="Hubs at risk" value={`${atRisk.length}`} tone={atRisk.length > 0 ? "warn" : undefined} />
            </div>

            <section id="network-map" aria-labelledby="network-map-title" className="scroll-mt-20">
              <Card>
                <CardHeader
                  as="h2"
                  titleId="network-map-title"
                  title="Network map"
                  description="Schematic hub-and-lane view, not a geographic tile map — select any hub for its full readout below."
                />
                <div className="mt-4">
                  <NetworkMap period={period} selectedHubId={selectedHubId} onSelectHub={selectHub} />
                </div>
              </Card>
            </section>

            <div id="trend-panel" className="mt-6 grid scroll-mt-20 grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Card className="h-full">
                  <CardHeader as="h2" title="On-time trend" description="Network trend with the selected hub overlaid for direct comparison." />
                  <div className="mt-4">
                    <TrendChart period={period} selectedHubId={selectedHubId} />
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <HubDetailPanel hubId={selectedHubId} period={period} onSelectHub={selectHub} />
                </Card>
              </div>
            </div>

            <section id="routes-table" aria-labelledby="routes-table-title" className="mt-6 scroll-mt-20">
              <Card>
                <CardHeader as="h2" titleId="routes-table-title" title="Routes & hubs" description="The map's mandatory text fallback — every hub, sortable and filterable, none of it hover-only." />
                <div className="mt-4">
                  <RoutesTable period={period} selectedHubId={selectedHubId} onSelectHub={selectHub} />
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette period={period} onClose={() => setPaletteOpen(false)} onSelectHub={selectHub} /> : null}
    </div>
  );
}

function InlineStat({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div>
      <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>{label}</p>
      <p className={cx("mt-1 text-lg font-semibold", NUM, tone === "warn" ? "text-amber-300" : TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
