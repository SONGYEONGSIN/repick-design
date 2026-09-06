"use client";

import { Landmark, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import HeroPanel from "./HeroPanel";
import RunDetailPanel from "./RunDetailPanel";
import SettlementsTable from "./SettlementsTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import VolumeChart from "./VolumeChart";
import { HERO_DATA, SETTLEMENT_RUNS, formatDate, type Period, TODAY_ISO } from "./data";
import { APP_BG, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead } from "./ui";

export default function PayoutsClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("month");

  // Branched selection (required split for this round): "pin" is a persistent selection that
  // recomputes only the detail rail on the right — a SUBSET of the page. The hero number, its
  // supporting stat strip, and the volume chart deliberately do NOT read pinnedRunId: they are
  // marketplace-wide period aggregates, and scoping them to one sampled row would misrepresent an
  // aggregate as if it were derived from a single settlement. The settlement table's row-hover
  // preview, by contrast, is a second, unrelated selection-adjacent behavior: purely ephemeral,
  // zero persisted state, gone on mouseleave/blur — see the tooltip wiring in SettlementsTable.
  const [pinnedRunId, setPinnedRunId] = useState<string | null>(null);

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

  function togglePin(id: string) {
    setPinnedRunId((cur) => (cur === id ? null : id));
  }

  const snapshot = HERO_DATA[period];

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className={cx("text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Payouts overview</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_MUTED)}>
                {`Repick Marketplace · seller settlements, as of ${formatDate(TODAY_ISO)}. Switch the window below to recompute the payout total and its trend.`}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 min-w-0">
              <HeroPanel period={period} onPeriodChange={setPeriod} snapshot={snapshot} />
            </div>

            <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-8 lg:gap-6">
              <Card>
                <CardHead
                  title="Volume trend"
                  Icon={TrendingUp}
                  hint={`${snapshot.chart.length} windows shown for the selected ${period} view — bars sum exactly to the hero number above.`}
                />
                <div className="mt-3">
                  <VolumeChart data={snapshot.chart} />
                </div>
              </Card>

              <Card>
                <CardHead title="Settlement runs" Icon={Landmark} hint="Sortable and filterable. Pin a row to open its full breakdown in the panel on the right." />
                <div className="mt-3">
                  <SettlementsTable runs={SETTLEMENT_RUNS} pinnedRunId={pinnedRunId} onPinToggle={togglePin} />
                </div>
              </Card>
            </div>

            <div className="col-span-12 min-w-0 lg:col-span-4">
              <RunDetailPanel pinnedRunId={pinnedRunId} period={period} onChangePeriod={setPeriod} />
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onPinRun={(id) => setPinnedRunId(id)} /> : null}
    </div>
  );
}
