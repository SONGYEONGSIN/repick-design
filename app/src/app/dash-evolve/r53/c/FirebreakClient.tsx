"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { HeroPanel } from "./HeroPanel";
import { StatsGridCard } from "./StatsGrid";
import { ServiceBreakdownChart } from "./ServiceBreakdownChart";
import { IncidentsTable } from "./IncidentsTable";
import { Card, SegmentedControl } from "./ui";
import { computeAggregates, computeServiceBreakdown, type Period } from "./data";

const OTHER_PERIOD: Record<Period, Period> = { "this-month": "last-month", "last-month": "this-month" };

export function FirebreakClient() {
  // Axis A — period: drives the hero number, the inline-stat tiles, and the incident table's base
  // record set as a single scope. Everything here is recomputed from the same `period` value.
  const [period, setPeriod] = useState<Period>("this-month");

  // Axis B — preview: which single incident row is being hovered/focused (or jumped to from the
  // command palette). Deliberately separate state from `period`; nothing below reads `period`
  // when deciding what to render for the preview, and nothing above reads `previewedId`.
  const [previewedId, setPreviewedId] = useState<string | null>(null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

  const current = useMemo(() => computeAggregates(period), [period]);
  const previous = useMemo(() => computeAggregates(OTHER_PERIOD[period]), [period]);
  const serviceBreakdown = useMemo(() => computeServiceBreakdown(period), [period]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-sm focus:ring-2 focus:ring-orange-600"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} paletteTriggerRef={paletteTriggerRef} />
        <main id="main-content" className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Reliability overview</h1>
              <p className="mt-1 text-sm text-zinc-500">SLA health, incident load, and on-call signal for every production service.</p>
            </div>
            <SegmentedControl
              label="Reporting period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "this-month", label: "This month" },
                { value: "last-month", label: "Last month" },
              ]}
            />
          </div>

          <Card className="mt-5">
            <HeroPanel current={current} previous={previous} />
          </Card>

          <div className="mt-5">
            <StatsGridCard current={current} previous={previous} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
            <div className="min-w-0 xl:col-span-2">
              <ServiceBreakdownChart data={serviceBreakdown} />
            </div>
            <div className="min-w-0 xl:col-span-3">
              <IncidentsTable period={period} previewedId={previewedId} onPreview={setPreviewedId} />
            </div>
          </div>
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSwitchPeriod={setPeriod}
        onPreviewIncident={setPreviewedId}
        triggerRef={paletteTriggerRef}
      />
    </div>
  );
}
