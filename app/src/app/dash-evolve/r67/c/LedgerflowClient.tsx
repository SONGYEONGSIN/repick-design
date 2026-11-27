"use client";

import { useEffect, useState } from "react";
import { Calendar1, Download, LayoutGrid, PinOff } from "lucide-react";
import { MobileSidebarDrawer, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette, type PaletteCommand } from "./CommandPalette";
import { HeroStats } from "./HeroStats";
import { PlanWaterfallGrid } from "./PlanWaterfallGrid";
import { PlanDetailPanel } from "./PlanDetailPanel";
import { AccountsTable } from "./AccountsTable";
import { PERIOD_OPTIONS, PLAN_LABEL, PLAN_ORDER, type PeriodKey, type PlanId, periodMetrics } from "./data";

/**
 * Macro layout: hero + inline stats on top (no single dominant chart anywhere on this page), the
 * plan revenue-bridge small-multiples grid plus its detail panel below that, and the accounts
 * table at the bottom. Fluid 12-col grid, no `max-w` cap anywhere — the content simply fills the
 * space to the right of the fixed-width sidebar at any viewport, including 1920px.
 *
 * Two selection axes, fully independent:
 * 1. `pinnedPlanId` — set only by clicking a card in the plan bridge grid (or a palette command).
 *    It drives the plan detail panel and nothing else: not the hero, not the table's rows, sort or
 *    filters.
 * 2. Each account row's trend-column hover/focus inspector — entirely local state inside
 *    `InspectableSparkline`, declared once per row. It never reads or sets `pinnedPlanId`.
 *
 * The period toggle (30D/90D/6M) is a third, independent control: it only recomputes the hero
 * card's own numbers via `periodMetrics`, never the bridge grid (which always reports a fixed
 * "this month" window) and never the table.
 */
export function LedgerflowClient() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [pinnedPlanId, setPinnedPlanId] = useState<PlanId | null>("enterprise");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [exported, setExported] = useState(false);

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

  function togglePinPlan(id: PlanId) {
    setPinnedPlanId((current) => (current === id ? null : id));
  }

  function exportReport() {
    setExported(true);
    window.setTimeout(() => setExported(false), 1800);
  }

  const windowWeeks = PERIOD_OPTIONS.find((o) => o.value === period)?.weeks ?? 4;
  const metrics = periodMetrics(windowWeeks);

  const commands: PaletteCommand[] = [
    ...PLAN_ORDER.map((id) => ({
      id: `pin-${id}`,
      group: "Revenue bridge",
      label: `Pin ${PLAN_LABEL[id]} plan detail`,
      hint: "Plan",
      icon: LayoutGrid,
      run: () => setPinnedPlanId(id),
    })),
    {
      id: "unpin",
      group: "Revenue bridge",
      label: "Clear pinned plan",
      hint: "Reset",
      icon: PinOff,
      run: () => setPinnedPlanId(null),
    },
    ...PERIOD_OPTIONS.map((opt) => ({
      id: `period-${opt.value}`,
      group: "Reporting period",
      label: `Show the ${opt.label} window`,
      hint: "Hero & inline stats",
      icon: Calendar1,
      run: () => setPeriod(opt.value),
    })),
    {
      id: "export",
      group: "Reports",
      label: "Export revenue report",
      hint: "CSV + PDF",
      icon: Download,
      run: exportReport,
    },
  ];

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-900"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} onExport={exportReport} exported={exported} />

        <main id="main-content" className="min-w-0 flex-1 bg-zinc-50/40">
          <div className="min-w-0 space-y-5 p-4 sm:p-6 lg:p-8">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Revenue overview</h1>
              <p className="mt-0.5 text-sm font-normal text-zinc-600">Subscription MRR, plan-level movement and your top accounts, in one place.</p>
            </div>

            <HeroStats period={period} onPeriodChange={setPeriod} metrics={metrics} />

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-8">
                <PlanWaterfallGrid pinnedPlanId={pinnedPlanId} onTogglePin={togglePinPlan} />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-4">
                <PlanDetailPanel pinnedPlanId={pinnedPlanId} onUnpin={() => setPinnedPlanId(null)} />
              </div>
            </div>

            <AccountsTable />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
    </div>
  );
}
