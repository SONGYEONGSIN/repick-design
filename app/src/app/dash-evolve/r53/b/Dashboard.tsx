"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar, MobileDrawer, type NavId } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { LatencyTrendCard } from "./LatencyTrendCard";
import { ErrorBudgetCard } from "./ErrorBudgetCard";
import { IncidentQueueCard } from "./IncidentQueueCard";
import { ServiceHealthCard } from "./ServiceHealthCard";
import { DeployFrequencyCard } from "./DeployFrequencyCard";
import { OnCallCard } from "./OnCallCard";
import { SpendCard } from "./SpendCard";
import { AlertsCard } from "./AlertsCard";
import type { Period } from "./data";

export function Dashboard() {
  const [navActive, setNavActive] = useState<NavId>("overview");
  const [period, setPeriod] = useState<Period>("24h");
  // The one shared selection axis on this page: pinning a service here fans out to exactly two
  // sibling widgets (LatencyTrendCard's highlighted line + stat row, and ServiceHealthCard's
  // highlighted tile). It is set from three equivalent entry points — an Incident Queue row, a
  // Service Health tile, or the command palette — and nothing else on the page reads or writes it.
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const selectService = useCallback((id: string) => {
    setSelectedServiceId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50">
      <Sidebar active={navActive} onNavigate={setNavActive} />
      <MobileDrawer open={mobileNavOpen} active={navActive} onNavigate={setNavActive} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[2200px] px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>
                  Operations overview
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  8 services across 5 teams · last refreshed from the {period === "24h" ? "hourly" : period === "7d" ? "daily" : "30-day"} rollup
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
              <LatencyTrendCard id="section-overview" period={period} onPeriodChange={setPeriod} selectedServiceId={selectedServiceId} />
              <ErrorBudgetCard />
              <IncidentQueueCard id="section-incidents" selectedServiceId={selectedServiceId} onSelectService={selectService} />
              <ServiceHealthCard id="section-services" selectedServiceId={selectedServiceId} onSelect={selectService} />
              <DeployFrequencyCard id="section-deploys" />
              <OnCallCard id="section-oncall" />
              <SpendCard id="section-cost" />
              <AlertsCard />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectService={selectService} />
    </div>
  );
}
