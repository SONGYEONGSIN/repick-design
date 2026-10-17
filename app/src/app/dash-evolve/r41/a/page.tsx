"use client";

import { useEffect, useState } from "react";
import type { Period } from "./data";
import { PERIODS, formatCompact, formatPrice, generateTrades, getCandles, getTickerStats, instrumentById } from "./data";
import { Card, ChangeBadge, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { OrderTicketDrawer } from "./order-ticket-drawer";
import { CandlestickChart } from "./candlestick-chart";
import { OhlcTable } from "./ohlc-table";
import { TradesTable } from "./trades-table";

function OhlcStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">{label}</p>
      <p className="mt-0.5 font-medium text-sm tabular-nums text-zinc-900">{value}</p>
    </div>
  );
}

export default function Page() {
  const [instrumentId, setInstrumentId] = useState("BTC-USD");
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

  const instrument = instrumentById(instrumentId);
  const candles = getCandles(instrument, period);
  const trades = generateTrades(instrument);
  const latest = candles[candles.length - 1];
  const ticker = getTickerStats(instrument);
  const datasetKey = `${instrumentId}:${period}`;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <DesktopSidebar selectedId={instrumentId} onSelect={setInstrumentId} />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} selectedId={instrumentId} onSelect={setInstrumentId} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenOrderTicket={() => setDrawerOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-xl text-zinc-900">{instrument.symbol}</h1>
                  <span className="font-normal text-sm text-zinc-500">{instrument.name}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-2xl tabular-nums text-zinc-900">{formatPrice(latest.close, instrument.decimals)}</span>
                  <ChangeBadge value={ticker.changePct} />
                  <span className="font-normal text-xs text-zinc-500">24h</span>
                </div>
              </div>
              <SegmentedControl
                ariaLabel="Chart period"
                options={PERIODS.map((p) => ({ value: p.value, label: p.label }))}
                value={period}
                onChange={setPeriod}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-6">
              <OhlcStat label="Open" value={formatPrice(latest.open, instrument.decimals)} />
              <OhlcStat label="High" value={formatPrice(latest.high, instrument.decimals)} />
              <OhlcStat label="Low" value={formatPrice(latest.low, instrument.decimals)} />
              <OhlcStat label="Close" value={formatPrice(latest.close, instrument.decimals)} />
              <OhlcStat label="Volume" value={formatCompact(latest.volume)} />
            </div>
            <p className="mt-1 font-normal text-[11px] text-zinc-500">Latest {period} candle · {latest.label}. Values update without needing to hover the chart.</p>
          </div>

          <div className="grid grid-cols-12 gap-4 p-4 sm:p-6">
            <Card className="col-span-12 min-w-0 p-4">
              <h2 className="font-semibold text-sm text-zinc-900">Price Chart</h2>
              <div className="mt-2">
                <CandlestickChart candles={candles} datasetKey={datasetKey} decimals={instrument.decimals} />
              </div>
            </Card>

            <div className="col-span-12 min-w-0 lg:col-span-6">
              <OhlcTable candles={candles} symbol={instrument.symbol} decimals={instrument.decimals} period={period} />
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-6">
              <TradesTable trades={trades} symbol={instrument.symbol} decimals={instrument.decimals} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectInstrument={setInstrumentId} />
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
