"use client";

import { useEffect, useState } from "react";
import { Network, Table as TableIcon, TrendingUp } from "lucide-react";
import AppShell from "./AppShell";
import CommandPalette from "./CommandPalette";
import { GraphView, NetworkHeadlineStats } from "./GraphView";
import { AdjacencyTable } from "./AdjacencyTable";
import { NodeInspector } from "./NodeInspector";
import { CategorySpendStrip } from "./CategorySpendStrip";
import { MONTHLY_SPEND_TREND_USD, usdCompact } from "./data";
import { Card, SegmentedControl, Sparkline, Tabs } from "./ui";

type ViewMode = "graph" | "table";
type TrendWindow = "3mo" | "6mo";
type NavKey = "overview" | "suppliers" | "alerts" | "spend" | "settings";

const VIEW_TABS: Array<{ id: ViewMode; label: string; icon: typeof Network }> = [
  { id: "graph", label: "Network", icon: Network },
  { id: "table", label: "Adjacency list", icon: TableIcon },
];

const TREND_WINDOW_OPTIONS: Array<{ value: TrendWindow; label: string }> = [
  { value: "3mo", label: "3mo" },
  { value: "6mo", label: "6mo" },
];

const DEFAULT_PINNED_ID = "t2-greywick";

export default function TendrilClient() {
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [view, setView] = useState<ViewMode>("graph");
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED_ID);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [trendWindow, setTrendWindow] = useState<TrendWindow>("6mo");

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

  const trendValues = trendWindow === "3mo" ? MONTHLY_SPEND_TREND_USD.slice(-3) : MONTHLY_SPEND_TREND_USD;
  const trendLatest = trendValues[trendValues.length - 1];
  const trendFirst = trendValues[0];
  const trendUpPct = Math.round(((trendLatest - trendFirst) / trendFirst) * 1000) / 10;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-violet-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-50"
      >
        Skip to main content
      </a>

      <AppShell activeNav={activeNav} onNavChange={setActiveNav} onOpenSearch={() => setPaletteOpen(true)}>
        <div id="main-content" className="flex min-w-0 flex-col gap-5 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-zinc-50">Supply chain dependency graph</h1>
            <p className="mt-1 text-sm font-normal text-zinc-400">
              Sites, tier-1 vendors and tier-2 sub-suppliers across the Aurora Electronics workspace, mapped by
              sourcing dependency.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-12 gap-4 sm:gap-5">
            <Card as="section" className="col-span-12 min-w-0 lg:col-span-8" padded={false}>
              <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-zinc-50">Vendor network</h2>
                  <Tabs tabs={VIEW_TABS} activeId={view} onChange={setView} ariaLabel="Network view" />
                </div>

                <NetworkHeadlineStats />

                <div id="tabpanel-graph" role="tabpanel" aria-labelledby="tab-graph" hidden={view !== "graph"}>
                  {view === "graph" && <GraphView pinnedId={pinnedId} onPin={setPinnedId} />}
                </div>
                <div id="tabpanel-table" role="tabpanel" aria-labelledby="tab-table" hidden={view !== "table"}>
                  {view === "table" && <AdjacencyTable pinnedId={pinnedId} onPin={setPinnedId} />}
                </div>
              </div>
            </Card>

            <Card as="section" className="col-span-12 min-w-0 lg:col-span-4">
              <h2 className="text-sm font-medium text-zinc-50">Node inspector</h2>
              <div className="mt-3">
                <NodeInspector pinnedId={pinnedId} onPin={setPinnedId} />
              </div>
            </Card>

            <Card as="section" className="col-span-12 min-w-0 md:col-span-7 xl:col-span-8">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-zinc-50">Spend by category</h2>
                <span className="shrink-0 text-xs font-normal text-zinc-400">Hover a row for share &amp; owner</span>
              </div>
              <div className="mt-3">
                <CategorySpendStrip />
              </div>
            </Card>

            <Card as="section" className="col-span-12 min-w-0 md:col-span-5 xl:col-span-4">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-zinc-50">Spend trend</h2>
                <SegmentedControl options={TREND_WINDOW_OPTIONS} value={trendWindow} onChange={setTrendWindow} label="Trend window" />
              </div>
              <div className="mt-3 flex min-w-0 items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-2xl font-semibold tabular-nums text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
                    {usdCompact(trendLatest)}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-normal text-zinc-400">
                    <TrendingUp aria-hidden="true" className="size-3 shrink-0 text-violet-300" />
                    {trendUpPct >= 0 ? "+" : ""}
                    {trendUpPct}% over {trendWindow === "3mo" ? "3 months" : "6 months"}
                  </p>
                </div>
                <Sparkline
                  values={trendValues}
                  ariaLabel={`Monthly network spend trend, from ${usdCompact(trendFirst)} to ${usdCompact(trendLatest)} over the trailing ${trendWindow === "3mo" ? "3 months" : "6 months"}`}
                  className="text-violet-400"
                />
              </div>
              <p className="mt-3 text-xs font-normal text-zinc-400">Monthly network run-rate across all sites and vendors.</p>
            </Card>
          </div>
        </div>
      </AppShell>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onPin={setPinnedId} />}
    </>
  );
}
