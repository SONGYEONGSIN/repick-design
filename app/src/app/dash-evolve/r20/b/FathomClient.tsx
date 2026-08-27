"use client";

import { LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import FillsFeed from "./FillsFeed";
import PriceChart, { type Range } from "./PriceChart";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import WatchlistRail from "./WatchlistRail";
import { FILLS, INSTRUMENTS, INSTRUMENT_BY_ID, changePct } from "./data";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

const RANGE_OPTIONS: { id: Range; label: string }[] = [
  { id: 5, label: "5D" },
  { id: 10, label: "10D" },
  { id: 20, label: "20D" },
];

const gainers = INSTRUMENTS.filter((r) => changePct(r) >= 0).length;

export default function FathomClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(INSTRUMENTS[0].id);
  const [range, setRange] = useState<Range>(20);

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

  const selected = INSTRUMENT_BY_ID[selectedId];

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Treasury desk · ${new Intl.NumberFormat("en-US").format(FILLS.length)} fills today`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Trading desk</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                {`${INSTRUMENTS.length} instruments live — ${gainers} up, ${INSTRUMENTS.length - gainers} down. Select a row to chart it; the fill feed on the right always shows the whole desk.`}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row">
            <div className="lg:w-72 lg:shrink-0">
              <Card padded={false} className="h-[420px] overflow-hidden lg:h-[560px]">
                <WatchlistRail selectedId={selectedId} onSelect={setSelectedId} />
              </Card>
            </div>

            <div className="min-w-0 flex-1">
              <Card>
                <CardHead
                  title={`${selected.name} (${selected.category})`}
                  Icon={LineChart}
                  hint="Selecting a watchlist row rewrites only this chart's own dataset — the fill feed on the right never reacts to it."
                  action={<Segmented options={RANGE_OPTIONS} value={range} onChange={setRange} ariaLabel="Chart range" />}
                />
                <div className="mt-3">
                  <PriceChart instrument={selected} range={range} />
                </div>
              </Card>
            </div>

            <div className="lg:w-80 lg:shrink-0">
              <Card padded={false} className="h-[420px] overflow-hidden lg:h-[560px]">
                <FillsFeed />
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectInstrument={setSelectedId} /> : null}
    </div>
  );
}
