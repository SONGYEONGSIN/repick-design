"use client";

import { useEffect, useState } from "react";
import { PERIODS, type Period } from "./data";
import { SegmentedControl } from "./ui";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { KpiStrip, PinnedVendorCard } from "./kpi-section";
import { BoxPlotPanel } from "./box-plot-panel";
import { VendorTable } from "./vendor-table";

const PERIOD_OPTIONS = PERIODS.map((p) => ({ value: p, label: p }));

/**
 * Two independent, differently-scoped reactions to "pick a vendor", kept as two separate pieces of
 * state on purpose rather than one `selectedId` threaded into every widget:
 *  - `pinnedId` is set only by a click on a box (or a command-palette pick) and is read by exactly
 *    one consumer, `PinnedVendorCard`. The four KpiStrip cards and the table never see it.
 *  - the box plot's own hover/focus tooltip is fully local state inside `BoxPlotPanel` — it never
 *    escapes that component, touches no prop here, and leaves nothing behind when it closes.
 */
export function PortcallDashboard() {
  const [period, setPeriod] = useState<Period>("24h");
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  return (
    <div className="min-h-screen min-w-0 bg-white lg:flex">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto min-w-0 w-full max-w-[1680px] px-4 py-6 lg:px-8 lg:py-8">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 pb-6">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-zinc-900">Vendor performance</h1>
                <p className="mt-1 text-sm font-normal text-zinc-500">Response-latency distribution and SLA posture across every integrated API vendor.</p>
              </div>
              <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={setPeriod} label="Reporting window" />
            </div>

            <div className="grid min-w-0 grid-cols-12 gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-8">
                <KpiStrip period={period} />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-4">
                <PinnedVendorCard period={period} pinnedId={pinnedId} onClear={() => setPinnedId(null)} />
              </div>

              <div className="col-span-12 min-w-0">
                <BoxPlotPanel period={period} pinnedId={pinnedId} onSelect={(id) => setPinnedId((cur) => (cur === id ? null : id))} />
              </div>

              <div className="col-span-12 min-w-0">
                <VendorTable period={period} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        period={period}
        onChangePeriod={setPeriod}
        onSelectVendor={(id) => setPinnedId(id)}
      />
    </div>
  );
}
