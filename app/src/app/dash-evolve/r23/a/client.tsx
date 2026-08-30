"use client";

import { useCallback, useEffect, useState } from "react";
import { CASES } from "./data";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { KpiRow } from "./KpiRow";
import { CaseRail } from "./CaseRail";
import { DetailPane } from "./DetailPane";
import { CommandPalette } from "./CommandPalette";
import { Card } from "./ui";

export default function DashboardClient() {
  const [selectedId, setSelectedId] = useState<string>(CASES[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const selectedCase = CASES.find((c) => c.id === selectedId) ?? CASES[0];

  // Mode A entry point #2 — ⌘K / Ctrl+K opens the palette; selecting a result there calls the exact
  // same `setSelectedId` the rail row's onClick uses (see CaseRail.tsx / CommandPalette.tsx).
  const handleGlobalKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setPaletteOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
  }, [handleGlobalKeydown]);

  return (
    <div className="flex min-h-screen w-full bg-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setMobileNavOpen(true)} onSearch={() => setPaletteOpen(true)} />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[1760px]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">Disputes queue</h1>
                <p className="mt-1 text-[13px] text-zinc-500">Buyer claims and seller responses awaiting a trust-desk decision.</p>
              </div>
            </div>

            <div className="mt-5">
              <KpiRow />
            </div>

            <div className="mt-5 grid grid-cols-12 gap-5">
              <div className="col-span-12 min-w-0 2xl:col-span-4">
                <Card padded={false} className="h-[560px] overflow-hidden">
                  <CaseRail selectedId={selectedId} onSelect={setSelectedId} />
                </Card>
              </div>
              <div className="col-span-12 min-w-0 2xl:col-span-8">
                {/* Selection propagation, mode A ("pin"): keying by case id forces DetailPane to
                    remount on every rail-row click, so its internal state (active tab, resolution
                    choice) resets deliberately. KpiRow above never reads `selectedCase`, so it is
                    intentionally excluded from this recompute — see DetailPane.tsx and KpiRow.tsx. */}
                <DetailPane key={selectedCase.id} c={selectedCase} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onSelect={(id) => setSelectedId(id)}
          onClose={() => setPaletteOpen(false)}
        />
      )}
    </div>
  );
}
