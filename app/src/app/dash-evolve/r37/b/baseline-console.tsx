"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BoxPlotStrip } from "./box-plot-strip";
import { VendorTable } from "./vendor-table";
import { CommandPalette } from "./command-palette";
import { VENDORS } from "./data";

export function BaselineConsole() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

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
    <div className="flex h-screen min-h-screen w-full bg-zinc-950 text-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          searchTriggerRef={searchTriggerRef}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[2200px]">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                Vendor Quality Scorecards
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Five-number quality distributions across the active supplier base, refreshed at
                each inspection close.
              </p>
            </div>

            <BoxPlotStrip />

            <div className="mt-10">
              <VendorTable />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        vendors={VENDORS}
        returnFocusRef={searchTriggerRef}
      />
    </div>
  );
}
