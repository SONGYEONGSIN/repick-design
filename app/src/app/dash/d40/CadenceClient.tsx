"use client";

import { CalendarRange, ListChecks } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import DayDetailPanel from "./DayDetailPanel";
import DeployTable from "./DeployTable";
import HeatmapCalendar from "./HeatmapCalendar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ACTIVE_WEEKS, ALL_DEPLOYS_DESC, computeHeroStats, DAYS, daysForPeriod, PERIODS, type PeriodId } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader, SegmentedControl, Sparkline, TrendPill } from "./ui";

function pickDefaultDay() {
  const reversed = [...DAYS].reverse();
  return reversed.find((d) => d.inRange && d.incident) ?? reversed.find((d) => d.inRange) ?? null;
}

export default function CadenceClient() {
  const [periodId, setPeriodId] = useState<PeriodId>("quarter");
  const [selectedDateMs, setSelectedDateMs] = useState<number | null>(() => pickDefaultDay()?.dateMs ?? null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tableQuery, setTableQuery] = useState("");

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

  const days = useMemo(() => daysForPeriod(periodId), [periodId]);
  const heroStats = useMemo(() => computeHeroStats(periodId), [periodId]);
  const selectedDay = useMemo(() => DAYS.find((d) => d.dateMs === selectedDateMs) ?? null, [selectedDateMs]);

  function handlePeriodChange(next: PeriodId) {
    setPeriodId(next);
    const nextDays = daysForPeriod(next);
    const stillVisible = nextDays.some((d) => d.inRange && d.dateMs === selectedDateMs);
    if (!stillVisible) {
      const lastInRange = [...nextDays].reverse().find((d) => d.inRange);
      setSelectedDateMs(lastInRange?.dateMs ?? null);
    }
  }

  function handleSelectDay(dateMs: number) {
    setSelectedDateMs(dateMs);
  }

  function handleSelectServiceFromPalette(serviceName: string) {
    setTableQuery(serviceName);
    setPaletteOpen(false);
  }

  function handleSelectDayFromPalette(dateMs: number) {
    setSelectedDateMs(dateMs);
    setPaletteOpen(false);
  }

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-white dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Release health</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>
                  Orbital Platform &middot; {ACTIVE_WEEKS.length} weeks tracked &middot; {ALL_DEPLOYS_DESC.length} deploys total
                </p>
              </div>
              <SegmentedControl options={PERIODS.map((p) => ({ id: p.id, label: p.label }))} value={periodId} onChange={handlePeriodChange} ariaLabel="Select reporting period" />
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <Card key={stat.id} className="min-w-0">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <stat.Icon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    <span className={cx("truncate text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{stat.label}</span>
                  </div>
                  <div className="mt-1.5 flex items-end justify-between gap-2">
                    <p className={cx("whitespace-nowrap text-2xl font-semibold tabular-nums", TEXT_PRIMARY)}>
                      {stat.value}
                      <span className={cx("ml-1 text-xs font-medium", TEXT_CAPTION)}>{stat.unit}</span>
                    </p>
                    <Sparkline values={stat.spark} width={52} height={22} className="shrink-0" />
                  </div>
                  <div className="mt-1.5">
                    <TrendPill good={stat.trendGood} direction={stat.trendDirection} label={stat.trendLabel} />
                  </div>
                </Card>
              ))}
            </div>

            <Card className="min-w-0">
              <CardHeader
                Icon={CalendarRange}
                title="Deploy activity"
                description={`Daily deploy count and incident markers across the ${PERIODS.find((p) => p.id === periodId)?.label.toLowerCase()}. Each cell shows its deploy count; select a cell for details.`}
              />
              <div className="mt-4">
                <HeatmapCalendar days={days} selectedDateMs={selectedDateMs} onSelectDay={handleSelectDay} />
              </div>
            </Card>

            <Card className="min-w-0">
              <CardHeader as="h2" title="Day detail" description="Deploys shipped on the selected day, most recent first." />
              <div className="mt-4">
                <DayDetailPanel day={selectedDay} />
              </div>
            </Card>

            <Card className="min-w-0" padded={false}>
              <div className="p-4 sm:p-5">
                <CardHeader Icon={ListChecks} title="Recent deploys" description="Every deploy in the tracked range — sortable, filterable by status or search." />
                <div className="mt-4">
                  <DeployTable deploys={ALL_DEPLOYS_DESC} query={tableQuery} onQueryChange={setTableQuery} />
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onSelectService={handleSelectServiceFromPalette} onSelectDay={handleSelectDayFromPalette} />
      ) : null}
    </div>
  );
}
