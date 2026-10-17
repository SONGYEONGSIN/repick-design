"use client";

import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { STAGES, type Period, type StageId } from "./data";
import { FunnelConsole } from "./funnel-console";
import { MobileDrawer, Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell() {
  const [period, setPeriod] = useState<Period>("30d");
  const [pinnedId, setPinnedId] = useState<StageId>(STAGES[0].id);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-screen min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar />
      <MobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1760px] p-4 sm:p-6">
            <FunnelConsole period={period} onPeriodChange={setPeriod} pinnedId={pinnedId} onPinStage={setPinnedId} />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onPinStage={setPinnedId} onSetPeriod={setPeriod} />
    </div>
  );
}
