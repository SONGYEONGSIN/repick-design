"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  PERIODS,
  TRAILING_ARR,
  buildBridgeSteps,
  type CategoryId,
  type PeriodId,
} from "./data";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { Hero } from "./Hero";
import { Waterfall } from "./Waterfall";
import { Spotlight } from "./Spotlight";
import { AccountsTable } from "./AccountsTable";
import { Card, SegmentedControl, cn, FOCUS_RING } from "./ui";

const PERIOD_OPTIONS = PERIODS.map((p) => ({ id: p.id, label: p.shortLabel }));

export function Dashboard() {
  // Persistent axis #1: the reporting period. Swaps the waterfall
  // dataset, the hero number and every inline stat together.
  const [period, setPeriod] = useState<PeriodId>("this-quarter");
  // Persistent axis #2: the pinned bridge step. Explicit, visibly marked
  // (pin badge + outline on the bar, "Unpin" control in the spotlight),
  // and fans out to two independently-scoped consumers below.
  const [pinnedId, setPinnedId] = useState<CategoryId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const periodDef = useMemo(() => PERIODS.find((p) => p.id === period) ?? PERIODS[0], [period]);
  const steps = useMemo(() => buildBridgeSteps(periodDef.steps), [periodDef]);
  const endingArr = steps[steps.length - 1].runningTotal;

  const togglePin = useCallback((id: CategoryId) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Inert while the command palette is open, so background controls
          can't be tabbed to or activated behind the modal. */}
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-[2400px] flex-1 px-4 py-6 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cyan-600 sm:px-6 lg:px-8 lg:py-8"
          >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Revenue overview</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Ridgeline · Northline SaaS — ARR bridge and account-level movements.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <SegmentedControl
                label="Reporting period"
                options={PERIOD_OPTIONS}
                value={period}
                onChange={setPeriod}
              />
              <button
                type="button"
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                  FOCUS_RING,
                )}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </button>
            </div>
          </div>

          <Hero periodDef={periodDef} endingArr={endingArr} sparkline={TRAILING_ARR} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section
              id="revenue-bridge"
              tabIndex={-1}
              aria-labelledby="revenue-bridge-heading"
              className="min-w-0 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cyan-600 xl:col-span-8"
            >
              <Card>
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="revenue-bridge-heading" className="text-base font-semibold text-zinc-900">
                    ARR bridge
                  </h2>
                  <span className="text-sm text-zinc-500">{periodDef.shortLabel}</span>
                </div>
                <p className="mb-5 text-sm text-zinc-500">
                  Starting balance through new business, expansion, contraction, churn and
                  reactivation to the ending balance. Tab through steps or click one to pin it below.
                </p>
                <Waterfall steps={steps} pinnedId={pinnedId} onTogglePin={togglePin} />
              </Card>
            </section>

            <section id="category-spotlight" className="min-w-0 xl:col-span-4">
              <Spotlight focusId={pinnedId} onClearPin={() => setPinnedId(null)} />
            </section>
          </div>

          <section
            id="account-activity"
            tabIndex={-1}
            className="mt-6 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-cyan-600"
          >
            <AccountsTable activeCategory={pinnedId} />
          </section>
          </main>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigateTo}
        onPin={setPinnedId}
      />
    </div>
  );
}
