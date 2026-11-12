"use client";

import { useEffect, useState } from "react";
import type { Period } from "./data";
import { PERIODS, formatCompact, formatPrice, generateTrades, getCandles, getTickerStats, instrumentById } from "./data";
import { Card, ChangeBadge, FOCUS_RING, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { OrderTicketDrawer } from "./order-ticket-drawer";
import { CandlestickChart } from "./candlestick-chart";
import { TradesTable } from "./trades-table";

function OhlcStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">{label}</p>
      <p className="mt-0.5 truncate font-medium text-sm tabular-nums text-zinc-50">{value}</p>
    </div>
  );
}

export default function Page() {
  // `pinnedInstrumentId` is the one piece of state that actually drives the main pane (chart,
  // header stats, trades table) — it only changes when a watchlist row is clicked or picked from
  // the command palette, never on hover. Hovering a watchlist row only ever touches that row's
  // own inline preview (see sidebar.tsx); it is never threaded into the chart or the table.
  const [pinnedInstrumentId, setPinnedInstrumentId] = useState("BTC-USD");
  const [period, setPeriod] = useState<Period>("1D");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const instrument = instrumentById(pinnedInstrumentId);
  const candles = getCandles(instrument, period);
  const trades = generateTrades(instrument);
  const latest = candles[candles.length - 1];
  const ticker = getTickerStats(instrument);
  const datasetKey = `${pinnedInstrumentId}:${period}`;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-white/10 focus:bg-zinc-900 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-50 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <DesktopSidebar pinnedId={pinnedInstrumentId} onPin={setPinnedInstrumentId} />
      <MobileSidebarDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        pinnedId={pinnedInstrumentId}
        onPin={setPinnedInstrumentId}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenOrderTicket={() => setDrawerOpen(true)}
        />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-950">
          <div className="border-b border-white/10 bg-zinc-900 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-xl text-zinc-50">{instrument.symbol}</h1>
                  <span className="font-normal text-sm text-zinc-400">{instrument.name}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-2xl tabular-nums text-zinc-50">{formatPrice(latest.close, instrument.decimals)}</span>
                  <ChangeBadge value={ticker.changePct} />
                  <span className="font-normal text-xs text-zinc-400">24h</span>
                </div>
              </div>
              <SegmentedControl
                ariaLabel="Chart period"
                options={PERIODS.map((p) => ({ value: p.value, label: p.label }))}
                value={period}
                onChange={setPeriod}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
              <OhlcStat label="Open" value={formatPrice(latest.open, instrument.decimals)} />
              <OhlcStat label="High" value={formatPrice(latest.high, instrument.decimals)} />
              <OhlcStat label="Low" value={formatPrice(latest.low, instrument.decimals)} />
              <OhlcStat label="Close" value={formatPrice(latest.close, instrument.decimals)} />
              <OhlcStat label="Volume" value={formatCompact(latest.volume)} />
            </div>
            <p className="mt-1 font-normal text-[11px] text-zinc-400">
              Latest {period} candle · {latest.label}. Values update without needing to hover the chart.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 p-4 sm:p-6">
            <Card className="col-span-12 min-w-0 p-4">
              <h2 className="font-semibold text-sm text-zinc-50">Price Chart</h2>
              <div className="mt-2">
                <CandlestickChart candles={candles} datasetKey={datasetKey} decimals={instrument.decimals} />
              </div>
            </Card>

            <div className="col-span-12 min-w-0">
              <TradesTable trades={trades} symbol={instrument.symbol} decimals={instrument.decimals} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectInstrument={setPinnedInstrumentId} />
      <OrderTicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        symbol={instrument.symbol}
        name={instrument.name}
        decimals={instrument.decimals}
        lastPrice={latest.close}
      />
    </div>
  );
}
