"use client";

import { useEffect, useState } from "react";
import { Gavel } from "lucide-react";
import { Sidebar, MobileDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { WatchlistRail } from "./WatchlistRail";
import { PinnedSummaryCard } from "./PinnedSummaryCard";
import { CandlestickChart } from "./CandlestickChart";
import { BidPanel } from "./BidPanel";
import { ActivityFeed } from "./ActivityFeed";
import { CommandPalette } from "./CommandPalette";
import { LOTS, findLot } from "./data";

const DEFAULT_PINNED_ID = LOTS[0].id;

export function DashboardApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED_ID);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const pinnedLot = findLot(pinnedId) ?? LOTS[0];

  function focusFloorAdjuster() {
    const el = document.getElementById("floor-adjust");
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    (el as HTMLInputElement).focus();
  }

  return (
    <div className="flex min-h-dvh bg-zinc-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMenu={() => setMobileNavOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
          onNewAdjustment={focusFloorAdjuster}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-6 lg:py-8">
          <div className="flex items-center gap-2 text-indigo-300">
            <Gavel aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Pricing &amp; liquidation desk</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Lot pricing desk</h1>
          <p className="mt-1 max-w-2xl text-sm font-normal text-zinc-400">
            Watch active lots, track clearing-price movement, and place floor adjustments before each auction closes.
          </p>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start">
            <WatchlistRail pinnedId={pinnedId} onPin={setPinnedId} />

            <div className="min-w-0 flex-1 space-y-5">
              <PinnedSummaryCard lot={pinnedLot} />
              <CandlestickChart />
            </div>

            <div className="w-full shrink-0 lg:w-[300px]">
              <div className="space-y-5 lg:sticky lg:top-[88px]">
                <BidPanel lot={pinnedLot} />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} lots={LOTS} onClose={() => setPaletteOpen(false)} onSelect={setPinnedId} />
    </div>
  );
}
