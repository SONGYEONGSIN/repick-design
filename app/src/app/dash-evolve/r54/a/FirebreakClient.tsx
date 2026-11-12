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
import { computeAggregates, computeServiceBreakdown, INCIDENTS, type Period } from "./data";

const OTHER_PERIOD: Record<Period, Period> = { "this-month": "last-month", "last-month": "this-month" };

export function FirebreakClient() {
  // Axis A — period: drives the hero number, the inline-stat tiles, and the incident table's base
  // record set as a single scope. Everything below is recomputed from this one `period` value.
  const [period, setPeriod] = useState<Period>("this-month");

  // Axis B — preview: which single incident row is being hovered/focused (or jumped to from the
  // command palette). Deliberately separate state from `period`; nothing that reads `period`
  // decides what to render for the preview, and vice versa. (A third, fully independent axis —
  // pinning a service — lives entirely inside ServiceBreakdownChart and never surfaces here.)
  const [previewedId, setPreviewedId] = useState<string | null>(null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

  const current = useMemo(() => computeAggregates(period), [period]);
  const previous = useMemo(() => computeAggregates(OTHER_PERIOD[period]), [period]);
  const serviceBreakdown = useMemo(() => computeServiceBreakdown(period), [period]);

  function jumpToIncident(id: string) {
    const incident = INCIDENTS.find((i) => i.id === id);
    if (incident) setPeriod(incident.period);
    setPreviewedId(id);
  }

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
    <div className="min-h-dvh min-w-0 bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-orange-600"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="min-w-0 lg:pl-64">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} paletteTriggerRef={paletteTriggerRef} />
        <main id="main-content" className="mx-auto w-full min-w-0 max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-1 flex min-w-0 flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-zinc-900">Reliability overview</h1>
              <p className="mt-1 max-w-md break-words text-sm text-zinc-500">SLA health, incident load, and on-call signal for every production service.</p>
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

          <div className="mt-5 min-w-0">
            <StatsGridCard current={current} previous={previous} />
          </div>

          <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-5">
            <div className="min-w-0 xl:col-span-2">
              <ServiceBreakdownChart data={serviceBreakdown} />
            </div>
            <div className="min-w-0 xl:col-span-3">
              <IncidentsTable period={period} previewedId={previewedId} onPreview={setPreviewedId} />
            </div>
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSwitchPeriod={setPeriod} onJumpToIncident={jumpToIncident} triggerRef={paletteTriggerRef} />
    </div>
  );
}
