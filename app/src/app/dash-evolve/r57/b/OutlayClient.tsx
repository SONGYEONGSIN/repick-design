"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import CostCenterRail from "./CostCenterRail";
import KpiRow from "./KpiRow";
import { BRAND, COST_CENTERS, type PeriodMode, serviceById } from "./data";
import PinnedCenterCard from "./PinnedCenterCard";
import Sidebar from "./Sidebar";
import SpendBreakdown from "./SpendBreakdown";
import { APP_BG, DISPLAY, FOCUS, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import Topbar from "./Topbar";

export default function OutlayClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodMode>("this");

  // Independently-scoped pin, set only by the cost-center rail or the command palette. See
  // SpendBreakdown.tsx and PinnedCenterCard.tsx for the other half of this split: the sunburst
  // and its ephemeral hover/focus state never read or write this.
  const [pinnedId, setPinnedId] = useState<string | null>(null);

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

  return (
    <div className={cx("min-h-screen", APP_BG, TEXT_PRIMARY)}>
      <a
        href="#main-content"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      <div className="mx-auto flex min-h-screen w-full max-w-[2560px]">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", DISPLAY, TEXT_PRIMARY)}>Cost allocation</h1>
              <p className={cx("mt-1 text-sm font-normal", TEXT_AUX)}>
                {BRAND.name} · Nimbus Cloud Platform · November 2026 billing cycle · {COST_CENTERS.length} cost centers tracked
              </p>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <CostCenterRail period={period} pinnedId={pinnedId} onPin={(id) => setPinnedId((prev) => (prev === id ? null : id))} />

              <div className="grid min-w-0 flex-1 grid-cols-12 gap-4 sm:gap-5">
                <div className="col-span-12 min-w-0">
                  <KpiRow period={period} />
                </div>

                <div className="col-span-12 min-w-0 xl:col-span-8">
                  <SpendBreakdown period={period} onPeriodChange={setPeriod} />
                </div>

                <div className="col-span-12 min-w-0 xl:col-span-4">
                  <PinnedCenterCard centerId={pinnedId} period={period} onClear={() => setPinnedId(null)} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelect={(id, kind) => {
            if (kind === "center") {
              setPinnedId(id);
            } else {
              const resolved = serviceById(id);
              if (resolved) setPinnedId(resolved.center.id);
            }
          }}
        />
      ) : null}
    </div>
  );
}
