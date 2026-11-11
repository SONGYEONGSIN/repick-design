"use client";

import { useEffect, useState } from "react";
import { CalendarRange, PinOff, Table2 } from "lucide-react";
import { PERIODS, type PeriodKey } from "./lib/data";
import { Sidebar, MobileSidebarDrawer } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Hero } from "./components/Hero";
import { FlowSection } from "./components/FlowSection";
import { CommandPalette, type PaletteCommand } from "./components/CommandPalette";

const TABLE_ANCHOR_ID = "path-summary";

export default function ConsoleClient() {
  // Two independently-scoped pieces of state, deliberately not merged into one "selection":
  // `period` swaps the whole dataset the page reads; `pinnedStageId` only feeds StageDetailCard
  // (see that file's comment). Edge-hover state lives even further down, inside FlowSection,
  // because it is ephemeral and never needs to be read from up here.
  const [period, setPeriod] = useState<PeriodKey>("30d");
  // Seeded once from the initial period's top bottleneck so the detail card opens non-empty —
  // never reset by a later period toggle (that would need an effect watching `period`, the exact
  // set-state-in-effect pattern this route avoids elsewhere). Afterward it only changes via a real
  // user pin, same discipline as the hierarchy tree's seeded-open pattern in the sibling b route.
  const [pinnedStageId, setPinnedStageId] = useState<string | null>(() => PERIODS["30d"].bottlenecks[0]?.id ?? null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const data = PERIODS[period];

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

  const commands: PaletteCommand[] = [
    {
      id: "period-7d",
      label: "View last 7 days",
      hint: "Period",
      icon: CalendarRange,
      run: () => setPeriod("7d"),
    },
    {
      id: "period-30d",
      label: "View last 30 days",
      hint: "Period",
      icon: CalendarRange,
      run: () => setPeriod("30d"),
    },
    {
      id: "pin-bottleneck",
      label: `Pin ${data.bottlenecks[0].name} (top bottleneck)`,
      hint: "Inspect",
      icon: Table2,
      run: () => setPinnedStageId(data.bottlenecks[0].id),
    },
    {
      id: "clear-pin",
      label: "Clear pinned stage",
      hint: "Inspect",
      icon: PinOff,
      run: () => setPinnedStageId(null),
    },
    {
      id: "jump-table",
      label: "Jump to path summary table",
      hint: "Navigate",
      icon: Table2,
      run: () => {
        document.getElementById(TABLE_ANCHOR_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    },
  ];

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-violet-400 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-zinc-950 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-50"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full min-w-0 max-w-[1660px] flex-col gap-6">
            <Hero data={data} period={period} onPeriodChange={setPeriod} />
            <FlowSection
              data={data}
              pinnedStageId={pinnedStageId}
              onPinStage={setPinnedStageId}
              tableAnchorId={TABLE_ANCHOR_ID}
            />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  );
}
