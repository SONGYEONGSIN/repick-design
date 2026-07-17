"use client";

import { useEffect, useState } from "react";
import ChartPanel from "./ChartPanel";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import KpiStrip from "./KpiStrip";
import PositionsTable from "./PositionsTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import WatchlistRail from "./WatchlistRail";
import { instrumentById, type Period } from "../lib/data";
import { APP_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";

const DEFAULT_INSTRUMENT_ID = "usdkrw";

export default function BallastClient() {
  const [selectedId, setSelectedId] = useState(DEFAULT_INSTRUMENT_ID);
  const [period, setPeriod] = useState<Period>("1M");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const instrument = instrumentById(selectedId) ?? instrumentById(DEFAULT_INSTRUMENT_ID)!;

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div>
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>FX 리스크 데스크</h1>
              <p className={cx("mt-0.5 text-sm", NUM, TEXT_CAPTION)}>
                Nordkap Treasury · {instrument.pair} 선택됨 · 마지막 갱신 07/17 09:00 KST
              </p>
            </div>

            <KpiStrip />

            <div className="flex flex-col gap-4 lg:h-[620px] lg:flex-row lg:items-stretch">
              <WatchlistRail selectedId={selectedId} onSelect={setSelectedId} />
              <ChartPanel instrument={instrument} period={period} onPeriodChange={setPeriod} />
              <DetailPanel instrument={instrument} />
            </div>

            <PositionsTable selectedInstrumentId={selectedId} onSelectInstrument={setSelectedId} />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectInstrument={setSelectedId} /> : null}
    </div>
  );
}
