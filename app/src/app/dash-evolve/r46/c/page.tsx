"use client";

import { useEffect, useState } from "react";
import type { AlertDirection, Period, RevenueAlert, Scheme } from "./data";
import { DEFAULT_PERIOD, DEFAULT_SCHEME } from "./data";
import { FOCUS_RING } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import CommandPalette from "./command-palette";
import NewAlertDrawer from "./new-alert-drawer";
import HorizonBoard from "./horizon-board";
import FallbackTable from "./fallback-table";

export default function Page() {
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [scheme, setScheme] = useState<Scheme>(DEFAULT_SCHEME);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState<RevenueAlert[]>([]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function createAlert(channelId: string, thresholdPct: number, direction: AlertDirection) {
    setAlerts((prev) => [...prev, { id: `alert-${prev.length + 1}`, channelId, thresholdPct, direction }]);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-white/10 focus:bg-zinc-900 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-50 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar alerts={alerts} onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onOpenAlertDrawer={() => setAlertDrawerOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-950">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-2xl text-zinc-50">Revenue overview</h1>
                <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
                  Ten channels, one horizon view. Every strip keeps its current value in view at all times — nothing on this page is hover-only.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
              <HorizonBoard period={period} onPeriodChange={setPeriod} scheme={scheme} onSchemeChange={setScheme} />
              <FallbackTable />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <NewAlertDrawer open={alertDrawerOpen} onClose={() => setAlertDrawerOpen(false)} onCreate={createAlert} />
    </div>
  );
}
