"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CATEGORY_META,
  INCIDENTS,
  STORES,
  formatDate,
  getStoreBridge,
  type CategoryId,
  type StoreId,
} from "./data";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { StoreRail } from "./StoreRail";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { Waterfall } from "./Waterfall";
import { Spotlight } from "./Spotlight";
import { IncidentsTable } from "./IncidentsTable";
import { Card, downloadCsv } from "./ui";

export function Dashboard() {
  const [storeId, setStoreId] = useState<StoreId>("harbor-point");
  const [pinnedId, setPinnedId] = useState<CategoryId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Clears the pin whenever the selected location changes — a pin is
  // scoped to the store it was set on. Adjusted during render (React's
  // documented pattern for state that tracks a prop) rather than in an
  // effect, so there's no extra render tick and no synchronous
  // setState-in-effect.
  const [prevStoreId, setPrevStoreId] = useState(storeId);
  if (storeId !== prevStoreId) {
    setPrevStoreId(storeId);
    setPinnedId(null);
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const store = useMemo(() => STORES.find((s) => s.id === storeId) ?? STORES[0], [storeId]);
  const steps = useMemo(() => getStoreBridge(storeId), [storeId]);

  const togglePin = useCallback((id: CategoryId) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, []);

  const handleExport = useCallback(() => {
    const rows = INCIDENTS.filter((i) => i.storeId === storeId).map((i) => [
      i.id,
      i.description,
      CATEGORY_META[i.category].label,
      i.impact,
      i.investigator,
      i.status,
      formatDate(i.loggedDate),
    ]);
    downloadCsv(`${storeId}-incidents.csv`, ["ID", "Description", "Category", "Impact (USD)", "Investigator", "Status", "Logged"], rows);
  }, [storeId]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Inert while the command palette is open, so background controls
          can't be tabbed to or activated behind the modal. */}
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
        >
          Skip to content
        </a>

        <AppSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onOpenPalette={() => setPaletteOpen(true)}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onExport={handleExport}
          />

          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <StoreRail selectedId={storeId} onSelect={setStoreId} />

            <main
              id="main-content"
              tabIndex={-1}
              className="min-w-0 flex-1 px-4 py-6 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-teal-400 sm:px-6 lg:px-8 lg:py-8"
            >
              <div className="mb-6 flex flex-col gap-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{store.region} region</p>
                <h1 className="text-2xl font-semibold text-zinc-50">{store.name}</h1>
                <p className="text-sm text-zinc-400">Managed by {store.manager} — shrinkage bridge and incident ledger.</p>
              </div>

              <div className="mb-6">
                <KpiRow storeId={storeId} />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section
                  id="shrinkage-bridge"
                  tabIndex={-1}
                  aria-labelledby="shrinkage-bridge-heading"
                  className="min-w-0 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-teal-400 xl:col-span-8"
                >
                  <Card>
                    <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                      <h2 id="shrinkage-bridge-heading" className="text-base font-semibold text-zinc-50">
                        Shrinkage bridge
                      </h2>
                      <span className="text-sm text-zinc-400">This quarter</span>
                    </div>
                    <p className="mb-5 text-sm text-zinc-400">
                      Opening inventory through recoveries, theft, damage, admin error and vendor shortage to the
                      closing balance. Tab through steps or click one to pin it in the panel on the right.
                    </p>
                    <Waterfall steps={steps} pinnedId={pinnedId} onTogglePin={togglePin} />
                  </Card>
                </section>

                <section id="cause-spotlight" className="min-w-0 xl:col-span-4">
                  <Spotlight storeId={storeId} storeName={store.name} pinnedId={pinnedId} onClearPin={() => setPinnedId(null)} />
                </section>
              </div>

              <section
                id="incident-ledger"
                tabIndex={-1}
                className="mt-6 min-w-0 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-teal-400"
              >
                <IncidentsTable storeId={storeId} storeName={store.name} />
              </section>
            </main>
          </div>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigateTo}
        currentStoreId={storeId}
        onSelectStore={setStoreId}
        onPin={setPinnedId}
        onExport={handleExport}
      />
    </div>
  );
}
