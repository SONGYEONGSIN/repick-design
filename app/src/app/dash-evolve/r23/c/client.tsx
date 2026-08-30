"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CalendarDays, LayoutGrid, PackageSearch } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Calendar } from "./Calendar";
import { DayDetailPanel } from "./DayDetailPanel";
import { KpiCards } from "./KpiCards";
import { PickupTable } from "./PickupTable";
import { CommandPalette, type CommandItem } from "./CommandPalette";
import { Card, SegmentedControl } from "./ui";
import { TODAY, TODAY_ISO, fromISO, toISO, addDays, startOfWeek, shiftMonth, formatMedium } from "./data";

type ViewMode = "month" | "week";

export function Client() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [monthAnchor, setMonthAnchor] = useState({ y: TODAY.y, m: TODAY.m });
  const [selectedIso, setSelectedIso] = useState(TODAY_ISO);

  const selectedCivil = useMemo(() => fromISO(selectedIso), [selectedIso]);

  // The one piece of state that governs the split described in the report:
  // pinnedWeekStart is *derived* from selectedIso, not stored independently.
  // Selecting a different day in the SAME week yields the same Monday here,
  // so anything reading pinnedWeekStart (the KPI capacity sparkline) simply
  // does not re-render with new values — it only changes when a day in a
  // different week is pinned. That "stays put on purpose" behavior falls out
  // of using derived state rather than needing an explicit guard.
  const pinnedWeekStart = useMemo(() => startOfWeek(selectedCivil), [selectedCivil]);

  const handleSelectDay = useCallback((iso: string) => setSelectedIso(iso), []);

  const handleMonthNav = useCallback((delta: number) => {
    setMonthAnchor((a) => shiftMonth(a.y, a.m, delta));
  }, []);

  const handleWeekNav = useCallback(
    (delta: number) => {
      setSelectedIso((iso) => toISO(addDays(fromISO(iso), delta * 7)));
    },
    []
  );

  const jumpToday = useCallback(() => {
    setSelectedIso(TODAY_ISO);
    setMonthAnchor({ y: TODAY.y, m: TODAY.m });
  }, []);

  const scrollToQueue = useCallback(() => {
    const el = document.getElementById("pickup-queue");
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commandItems: CommandItem[] = useMemo(
    () => [
      { id: "today", label: "Jump to today", hint: `${formatMedium(TODAY)}, ${TODAY.y}`, icon: CalendarCheck2, action: jumpToday },
      { id: "month", label: "Switch to Month view", icon: LayoutGrid, action: () => setViewMode("month") },
      { id: "week", label: "Switch to Week view", icon: CalendarDays, action: () => setViewMode("week") },
      { id: "queue", label: "Go to Pickup Queue", icon: PackageSearch, action: scrollToQueue },
    ],
    [jumpToday, scrollToQueue]
  );

  return (
    <div className="flex min-h-dvh bg-zinc-50">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="text-[21px] font-semibold text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Pickup &amp; Inspection Schedule
              </h1>
              <p className="mt-1 text-[13px] text-zinc-500">Seoul Metro Hub · logistics operations console</p>
            </div>
            <SegmentedControl
              label="Calendar view"
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: "month", label: "Month" },
                { value: "week", label: "Week" },
              ]}
            />
          </div>

          <div className="grid grid-cols-12 gap-4 sm:gap-6">
            <div className="col-span-12 min-w-0">
              <KpiCards pinnedWeekStart={pinnedWeekStart} />
            </div>

            <div className="col-span-12 min-w-0">
              <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
                <Card className="min-w-0 flex-1">
                  <Calendar
                    viewMode={viewMode}
                    monthCivil={{ y: monthAnchor.y, m: monthAnchor.m, d: 1 }}
                    onMonthNav={handleMonthNav}
                    weekAnchor={pinnedWeekStart}
                    onWeekNav={handleWeekNav}
                    selectedIso={selectedIso}
                    onSelect={handleSelectDay}
                    onJumpToday={jumpToday}
                  />
                </Card>
                <div className="w-full min-w-0 shrink-0 lg:w-[380px]">
                  <DayDetailPanel selectedIso={selectedIso} />
                </div>
              </div>
            </div>

            <div className="col-span-12 min-w-0" id="pickup-queue">
              <PickupTable />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={commandItems} />
    </div>
  );
}
