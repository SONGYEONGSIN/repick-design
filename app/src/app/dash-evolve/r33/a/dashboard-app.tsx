"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { CATEGORIES, categoryById, type CategoryId } from "./categories";
import { allocateCells } from "./allocation";
import { ticketsForPeriod, countsInCategoryOrder, PERIOD_LABEL, type Period } from "./data";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { StatCards } from "./stat-cards";
import { WaffleGrid } from "./waffle-grid";
import { CategoryLegend } from "./category-legend";
import { SlideOver } from "./slide-over";
import { CommandPalette } from "./command-palette";
import { Card, SectionLabel, SegmentedControl } from "./ui";

const PERIODS: readonly Period[] = ["today", "7d", "30d"];

export function DashboardApp() {
  const [period, setPeriod] = useState<Period>("30d");
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerReturnFocusRef = useRef<HTMLElement | null>(null);
  const paletteReturnFocusRef = useRef<HTMLElement | null>(null);

  const periodTickets = useMemo(() => ticketsForPeriod(period), [period]);

  const orderedCounts = useMemo(() => countsInCategoryOrder(periodTickets), [periodTickets]);

  const counts = useMemo(() => {
    const record = {} as Record<CategoryId, number>;
    CATEGORIES.forEach((category, index) => {
      record[category.id] = orderedCounts[index];
    });
    return record;
  }, [orderedCounts]);

  const total = periodTickets.length;

  const cells = useMemo(() => {
    const cellCounts = allocateCells(orderedCounts, 100);
    const out: CategoryId[] = [];
    cellCounts.forEach((n, index) => {
      for (let k = 0; k < n; k += 1) out.push(CATEGORIES[index].id);
    });
    return out;
  }, [orderedCounts]);

  const selectedCategory = selectedCategoryId ? categoryById(selectedCategoryId) : null;
  const drawerTickets = useMemo(
    () => (selectedCategoryId ? periodTickets.filter((t) => t.category === selectedCategoryId) : []),
    [periodTickets, selectedCategoryId],
  );

  const handleSelectCategory = useCallback((id: CategoryId) => {
    if (typeof document !== "undefined") {
      drawerReturnFocusRef.current = document.activeElement as HTMLElement | null;
    }
    setSelectedCategoryId(id);
  }, []);

  const handlePaletteOpenChange = useCallback((next: boolean) => {
    if (next && typeof document !== "undefined") {
      paletteReturnFocusRef.current = document.activeElement as HTMLElement | null;
    }
    setPaletteOpen(next);
  }, []);

  return (
    <div className="flex h-screen min-h-screen w-full bg-zinc-50 text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => handlePaletteOpenChange(true)}
          searchTriggerRef={searchTriggerRef}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[2560px]">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Ticket triage</h1>
              <p className="mt-1 text-sm text-zinc-600">
                Open backlog across all channels, by category composition.
              </p>
            </div>

            <StatCards />

            <div className="mt-4 grid grid-cols-12 gap-4">
              <Card className="col-span-12 lg:col-span-8" padded={false}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 p-5">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900">Backlog composition</h2>
                    <p className="mt-0.5 text-xs text-zinc-600">
                      Each cell is 1% of {total} open {total === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>
                  <SegmentedControl
                    options={PERIODS}
                    value={period}
                    onChange={setPeriod}
                    getLabel={(p) => PERIOD_LABEL[p]}
                    ariaLabel="Backlog snapshot period"
                  />
                </div>
                <div className="p-5">
                  <div className="mx-auto max-w-[640px]">
                    <WaffleGrid
                      cells={cells}
                      counts={counts}
                      total={total}
                      selectedId={selectedCategoryId}
                      onSelect={handleSelectCategory}
                    />
                  </div>
                </div>
              </Card>

              <Card className="col-span-12 lg:col-span-4">
                <SectionLabel>Categories</SectionLabel>
                <div className="mt-3">
                  <CategoryLegend
                    counts={counts}
                    total={total}
                    selectedId={selectedCategoryId}
                    onSelect={handleSelectCategory}
                  />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <SlideOver
        open={selectedCategoryId !== null}
        category={selectedCategory}
        tickets={drawerTickets}
        period={period}
        onClose={() => setSelectedCategoryId(null)}
        returnFocusRef={drawerReturnFocusRef}
      />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={handlePaletteOpenChange}
        counts={counts}
        total={total}
        onSelect={handleSelectCategory}
        returnFocusRef={paletteReturnFocusRef}
      />
    </div>
  );
}
