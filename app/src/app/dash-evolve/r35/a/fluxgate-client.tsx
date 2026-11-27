"use client";

import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { DetailPanel } from "./detail-panel";
import type { Period, Signal } from "./data";
import { SIGNALS } from "./data";
import { HeroStats } from "./hero-stats";
import { RiskPanel } from "./risk-panel";
import { Sidebar } from "./sidebar";
import { SignalFeed } from "./signal-feed";
import { Topbar } from "./topbar";
import { WatchlistRail } from "./watchlist-rail";

/**
 * Top-level state for the whole route. Two independently-scoped interaction axes live here on
 * purpose, instead of one `selectedId` threaded identically into three sibling widgets:
 *
 *   1. PIN (persistent) — clicking a feed row, or picking an instrument from the ⌘K palette, sets
 *      `pinnedInstrumentId`. That reaches exactly two places: the detail panel's chart/table, and
 *      the risk panel's single "Pinned instrument" KPI card. It never touches the watchlist rail,
 *      which always renders the full tracked set regardless of what is pinned.
 *   2. HOVER/FOCUS a candle (ephemeral) — lives entirely inside CandlestickChart's own state and
 *      never reaches this component at all. See candlestick-chart.tsx.
 *
 * The ⌘K palette is mounted/unmounted by `paletteOpen` rather than kept alive and reset from an
 * effect — see command-palette.tsx for why that specifically avoids the
 * `react-hooks/set-state-in-effect` trap this catalog has hit before.
 */
export function FluxgateClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinnedInstrumentId, setPinnedInstrumentId] = useState<string | null>(null);
  const [pinnedSignalId, setPinnedSignalId] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("1D");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handlePinFromFeed(signal: Signal) {
    setPinnedInstrumentId(signal.instrumentId);
    setPinnedSignalId(signal.id);
  }

  function handlePinFromPalette(instrumentId: string) {
    setPinnedInstrumentId(instrumentId);
    setPinnedSignalId(null);
  }

  function handleUnpin() {
    setPinnedInstrumentId(null);
    setPinnedSignalId(null);
  }

  const pinnedSignal = pinnedSignalId ? SIGNALS.find((s) => s.id === pinnedSignalId) ?? null : null;

  return (
    <div className="flex min-h-dvh bg-zinc-950">
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-5">
            <h1 className="text-lg font-semibold text-zinc-50">Pricing volatility overview</h1>

            <HeroStats />

            <div className="grid grid-cols-12 gap-5">
              <div className="order-3 col-span-12 min-w-0 lg:order-1 lg:col-span-3">
                <div className="flex flex-col gap-5">
                  <WatchlistRail />
                  <RiskPanel pinnedInstrumentId={pinnedInstrumentId} />
                </div>
              </div>

              <div className="order-1 col-span-12 min-w-0 lg:order-2 lg:col-span-4">
                <SignalFeed pinnedSignalId={pinnedSignalId} onPin={handlePinFromFeed} />
              </div>

              <div className="order-2 col-span-12 min-w-0 lg:order-3 lg:col-span-5">
                <DetailPanel
                  pinnedInstrumentId={pinnedInstrumentId}
                  pinnedSignal={pinnedSignal}
                  period={period}
                  onPeriodChange={setPeriod}
                  onUnpin={handleUnpin}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectInstrument={handlePinFromPalette} /> : null}
    </div>
  );
}
