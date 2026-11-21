"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./MobileDrawer";
import { Topbar } from "./Topbar";
import { WatchlistRail } from "./WatchlistRail";
import { MarketChart } from "./MarketChart";
import { ExchangeTable } from "./ExchangeTable";
import { DetailPane } from "./DetailPane";
import { CommandPalette } from "./CommandPalette";
import { NAV_ITEMS, type NavId } from "./Nav";
import { EXCHANGES, EXCHANGE_TYPES, DEFAULT_SELECTED_ID, type Period } from "./data";

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavId>("market");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("24H");
  const [followingIds, setFollowingIds] = useState<string[]>(() => EXCHANGES.filter((e) => e.following).map((e) => e.id));

  // The ONE persistent selection on this page. It is read by the watchlist rail and the exchange
  // table (to show which row is active) and it pins the right detail pane — nothing else. The
  // market chart's own hover/scrub inspector (inside MarketChart) is a wholly separate, ephemeral
  // bit of state that never touches this value and is never touched by it.
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const watchlist = EXCHANGES.filter((e) => followingIds.includes(e.id));
  const addCandidates = EXCHANGES.filter((e) => !followingIds.includes(e.id));
  const selectedExchange = EXCHANGES.find((e) => e.id === selectedId) ?? EXCHANGES[0];
  const atRiskCount = watchlist.filter((e) => e.status === "at-risk").length;
  const degradedCount = watchlist.filter((e) => e.status === "degraded").length;

  function handleAddToWatchlist(id: string) {
    setFollowingIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSelectedId(id);
  }

  const navLabel = NAV_ITEMS.find((n) => n.id === activeNav)?.label ?? "";

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenDrawer={() => setDrawerOpen(true)}
          atRiskCount={atRiskCount}
          degradedCount={degradedCount}
          addCandidates={addCandidates}
          onAddToWatchlist={handleAddToWatchlist}
        />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {activeNav === "market" ? (
            <>
              <WatchlistRail exchanges={watchlist} selectedId={selectedId} onSelect={setSelectedId} />

              <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5 lg:h-full lg:min-h-0">
                <MarketChart period={period} onPeriodChange={setPeriod} />
                <ExchangeTable exchanges={EXCHANGES} allTypes={EXCHANGE_TYPES} selectedId={selectedId} onSelect={setSelectedId} />
              </div>

              <div className="flex-shrink-0 border-t border-zinc-200 p-4 sm:p-5 lg:h-full lg:border-t-0 lg:p-3">
                <DetailPane exchange={selectedExchange} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10">
              <div className="max-w-sm text-center">
                <p className="text-lg font-semibold text-zinc-900">{navLabel}</p>
                <p className="mt-1 text-sm font-normal text-zinc-600">
                  This section isn&apos;t wired up in this preview — the market overview and watchlist are the focus here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={activeNav} onNavigate={setActiveNav} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} exchanges={EXCHANGES} onJump={setSelectedId} />
    </div>
  );
}
