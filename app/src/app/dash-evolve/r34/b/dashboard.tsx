"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, ShieldAlert, Users } from "lucide-react";
import {
  AXES,
  CONTRACTS_EXPIRING_60D,
  DEFAULT_SELECTED_IDS,
  MAX_SELECTED,
  PERIODS,
  SERIES_STYLES,
  VENDORS,
  overallScore,
  trendFromCurrent,
  type PeriodId,
} from "./data";
import { RadarChart, type RadarSeriesInput } from "./radar-chart";
import { FallbackTable } from "./fallback-table";
import { EntityToggle } from "./entity-toggle";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { Card, Progress, SegmentedControl, Sparkline, StatusBadge, useAnnouncer } from "./ui";

const TABLE_ID = "scorecard-table";

export function Dashboard() {
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_SELECTED_IDS);
  const [period, setPeriod] = useState<PeriodId>("q3-2026");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const { message: toggleMessage, announce } = useAnnouncer();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = paletteOpen || mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, mobileNavOpen]);

  function requestToggle(id: string) {
    const isSelected = selectedIds.includes(id);
    if (isSelected) {
      if (selectedIds.length <= 1) {
        announce("At least one vendor must stay selected.");
        return;
      }
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= MAX_SELECTED) {
      announce(`Maximum ${MAX_SELECTED} vendors overlaid — remove one to add another.`);
      return;
    }
    setSelectedIds((prev) => [...prev, id]);
  }

  const selectedVendors = useMemo(
    () => selectedIds.map((id) => VENDORS.find((v) => v.id === id)).filter((v): v is NonNullable<typeof v> => Boolean(v)),
    [selectedIds]
  );

  const series: RadarSeriesInput[] = useMemo(
    () =>
      selectedVendors.map((v, i) => ({
        id: v.id,
        name: v.name,
        scores: v.scores[period],
        style: SERIES_STYLES[i],
      })),
    [selectedVendors, period]
  );

  const periodLabel = PERIODS.find((p) => p.id === period)?.label ?? period;

  const kpi = useMemo(() => {
    const avgFor = (p: PeriodId) =>
      selectedVendors.length
        ? Math.round(
            selectedVendors.reduce((sum, v) => sum + overallScore(v.scores[p]), 0) / selectedVendors.length
          )
        : 0;
    const avgQ3 = avgFor("q3-2026");
    const avgQ2 = avgFor("q2-2026");
    return {
      activeVendors: VENDORS.length,
      avgScore: avgQ3,
      trend: trendFromCurrent(avgQ2, avgQ3),
      contractsExpiring: CONTRACTS_EXPIRING_60D,
      riskFlags: VENDORS.filter((v) => v.status === "at-risk").length,
    };
  }, [selectedVendors]);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          paletteTriggerRef={paletteTriggerRef}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-[family-name:var(--font-display-grotesk)] text-2xl font-bold text-zinc-900">
                  Vendor Scorecard
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Compare suppliers side by side across six fixed performance axes.
                </p>
              </div>
              <SegmentedControl
                label="Reporting period"
                value={period}
                onChange={setPeriod}
                options={PERIODS.map((p) => ({ value: p.id, label: p.label }))}
              />
            </div>

            <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
              <Card className="col-span-6 min-w-0 p-4 md:col-span-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  <Users aria-hidden="true" className="h-3.5 w-3.5" />
                  Active vendors
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">{kpi.activeVendors}</p>
                <p className="mt-1 text-xs text-zinc-500">Across all categories</p>
              </Card>

              <Card className="col-span-6 min-w-0 p-4 md:col-span-3">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Avg overlay score</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <p className="text-2xl font-bold tabular-nums text-zinc-900">{kpi.avgScore}</p>
                  <Sparkline values={kpi.trend} label={`Average overlay score trend, last 4 quarters, ending at ${kpi.avgScore}`} />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{selectedVendors.length} vendors overlaid, Q3 2026</p>
              </Card>

              <Card className="col-span-6 min-w-0 p-4 md:col-span-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Contracts expiring
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">{kpi.contractsExpiring}</p>
                <p className="mt-1 text-xs text-zinc-500">Within 60 days</p>
              </Card>

              <Card className="col-span-6 min-w-0 p-4 md:col-span-3">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-zinc-500">
                  <ShieldAlert aria-hidden="true" className="h-3.5 w-3.5" />
                  Open risk flags
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900">{kpi.riskFlags}</p>
                <p className="mt-1 text-xs text-zinc-500">Flagged this quarter</p>
              </Card>

              <Card className="col-span-12 min-w-0 p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-zinc-900">Overlay vendors</h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Toggle up to {MAX_SELECTED} vendors to overlay on the radar chart and table below.
                </p>
                <div className="mt-3">
                  <EntityToggle
                    vendors={VENDORS}
                    selectedIds={selectedIds}
                    onToggle={requestToggle}
                    max={MAX_SELECTED}
                    period={period}
                    styles={SERIES_STYLES}
                    message={toggleMessage}
                  />
                </div>
              </Card>

              <Card className="col-span-12 min-w-0 p-4 sm:p-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-zinc-900">Radar comparison</h2>
                  <p className="text-xs text-zinc-500">
                    {periodLabel} · {selectedVendors.length} of {VENDORS.length} vendors overlaid
                  </p>
                </div>
                <div className="mx-auto mt-4 flex max-w-4xl flex-col gap-6 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <RadarChart axes={AXES} series={series} periodLabel={periodLabel} tableId={TABLE_ID} />
                  </div>
                  <div className="flex w-full shrink-0 flex-col gap-3 lg:w-64">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">Legend</p>
                    {series.map((s, i) => (
                      <div key={s.id} className="min-w-0 rounded-lg border border-zinc-200 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate text-xs text-zinc-800">{s.name}</span>
                          <span className="shrink-0 tabular-nums text-xs text-zinc-700">
                            {overallScore(s.scores)}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <StatusBadge status={selectedVendors[i].status} />
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <svg width="16" height="8" viewBox="0 0 16 8" aria-hidden="true" className="shrink-0">
                            <line
                              x1="0"
                              y1="4"
                              x2="16"
                              y2="4"
                              stroke={s.style.color}
                              strokeWidth={1.8}
                              strokeDasharray={s.style.dash}
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                          <span aria-hidden="true" className="min-w-0 flex-1">
                            <Progress value={overallScore(s.scores)} color={s.style.color} />
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500">{s.style.patternLabel}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="col-span-12 min-w-0 p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-zinc-900">Scorecard data</h2>
                <div className="mt-4">
                  <FallbackTable id={TABLE_ID} axes={AXES} series={series} periodLabel={periodLabel} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        vendors={VENDORS}
        selectedIds={selectedIds}
        onToggleVendor={requestToggle}
        period={period}
        onSetPeriod={setPeriod}
        triggerRef={paletteTriggerRef}
      />
    </div>
  );
}
