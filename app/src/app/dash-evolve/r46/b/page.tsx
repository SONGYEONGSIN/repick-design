"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeftRight, RotateCcw, TrendingUp, Users } from "lucide-react";
import {
  EDGES,
  PERIODS,
  REWORK_TOUCHED_TEAM_IDS,
  SPRINT_LABELS,
  TEAMS,
  TEAM_ORDER,
  VIEW_FILTERS,
  edgesFor,
  reworkRatePct,
  strongestEdge,
  totalWeight,
  type Period,
  type ViewFilter,
} from "./data";
import { formatCount, formatPercent, formatSignedPercent } from "./format";
import { Card, Delta, SegmentedControl } from "./ui";
import { ArcDiagram } from "./arc-diagram";
import { HandoffTable } from "./handoff-table";
import { TeamSpotlight } from "./team-spotlight";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";

function KpiTile({
  icon: Icon,
  label,
  value,
  trail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trail: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
        <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1.5 pl-[22px]">
        {/* Strictly smaller than the arc diagram's own headline number (text-4xl/5xl) — this
            route's dominant visualization stays visually primary. */}
        <span className="block font-semibold text-xl tabular-nums text-zinc-900">{value}</span>
        <span className="mt-1 block">{trail}</span>
      </dd>
    </div>
  );
}

export default function Page() {
  const [period, setPeriod] = useState<Period>("current");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const otherPeriod: Period = period === "current" ? "prior" : "current";
  const otherPeriodLabel = PERIODS.find((p) => p.value === otherPeriod)?.label ?? "";

  const total = totalWeight(period);
  const otherTotal = totalWeight(otherPeriod);
  const totalDeltaPct = ((total - otherTotal) / otherTotal) * 100;

  const reworkPct = reworkRatePct(period);
  const otherReworkPct = reworkRatePct(otherPeriod);
  const reworkDeltaPp = reworkPct - otherReworkPct;

  const busiestEdge = strongestEdge(period, EDGES);
  const busiestDeltaPct = ((busiestEdge.weight[period] - busiestEdge.weight[otherPeriod]) / busiestEdge.weight[otherPeriod]) * 100;

  const filteredEdges = edgesFor(viewFilter);
  const sprintLabel = SPRINT_LABELS[period];

  function handleExport() {
    const lines: string[] = [];
    lines.push(`Relay handoff flow export — ${sprintLabel}`);
    lines.push("");
    lines.push("From,To,Type,Weight,Prior Weight,Delta vs Prior (%)");
    for (const edge of EDGES) {
      const deltaPct = ((edge.weight.current - edge.weight.prior) / edge.weight.prior) * 100;
      lines.push(
        [TEAMS[edge.from].name, TEAMS[edge.to].name, edge.type, String(edge.weight.current), String(edge.weight.prior), deltaPct.toFixed(1)].join(",")
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relay-handoff-flow-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-50">
          <div className="mx-auto w-full max-w-[2200px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-xl text-zinc-900 [font-family:var(--font-display-wide)]">Handoff Flow</h1>
                <p className="mt-0.5 max-w-xl font-normal text-sm text-zinc-500">
                  Where work actually moves between {TEAM_ORDER.length} engineering teams — {sprintLabel.toLowerCase()}.
                </p>
              </div>
              <SegmentedControl label="Sprint" options={PERIODS} value={period} onChange={setPeriod} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiTile
                icon={ArrowLeftRight}
                label="Total Handoffs Logged"
                value={formatCount(total)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={totalDeltaPct} />
                    <span className="font-normal text-xs text-zinc-500">vs {otherPeriodLabel.toLowerCase()}</span>
                  </span>
                }
              />
              <KpiTile
                icon={RotateCcw}
                label="Rework Rate"
                value={formatPercent(reworkPct)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={reworkDeltaPp} suffix="pp" invertGoodness />
                    <span className="font-normal text-xs text-zinc-500">vs {otherPeriodLabel.toLowerCase()}</span>
                  </span>
                }
              />
              <KpiTile
                icon={TrendingUp}
                label="Busiest Handoff Volume"
                value={formatCount(busiestEdge.weight[period])}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={busiestDeltaPct} />
                    <span className="truncate font-normal text-xs text-zinc-500">
                      {TEAMS[busiestEdge.from].name} → {TEAMS[busiestEdge.to].name}
                    </span>
                  </span>
                }
              />
              <KpiTile
                icon={Users}
                label="Teams Touched by Rework"
                value={`${REWORK_TOUCHED_TEAM_IDS.length} of ${TEAM_ORDER.length}`}
                trail={<span className="block truncate font-normal text-xs text-zinc-500">Same pairs flagged every sprint</span>}
              />
            </dl>

            <div className="mt-5 flex flex-col gap-4">
              <Card as="section" ariaLabelledBy="handoff-flow-heading" id="handoff-flow" className="min-w-0 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 id="handoff-flow-heading" className="font-semibold text-sm text-zinc-900">
                      Handoff Flow — {sprintLabel}
                    </h2>
                    <p className="mt-0.5 max-w-2xl font-normal text-xs text-zinc-500">
                      Eight teams plotted left to right in pipeline order. Each arc above the line is one handoff pair this sprint; thickness
                      scales with volume. Exact numbers are repeated in the table below.
                    </p>
                  </div>
                  <SegmentedControl label="Handoff type" options={VIEW_FILTERS} value={viewFilter} onChange={setViewFilter} />
                </div>

                <div className="mt-4">
                  <ArcDiagram edges={filteredEdges} allEdges={EDGES} period={period} />
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="col-span-12 min-w-0 lg:col-span-4">
                  <TeamSpotlight period={period} />
                </div>
                <div className="col-span-12 min-w-0 lg:col-span-8">
                  <Card id="handoff-log" className="min-w-0 p-4 sm:p-5">
                    <HandoffTable period={period} />
                  </Card>
                </div>
              </div>
            </div>

            <p className="mt-4 font-normal text-xs text-zinc-500">
              {formatSignedPercent(totalDeltaPct)} vs {otherPeriodLabel.toLowerCase()} in total handoff volume.
            </p>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSetViewFilter={setViewFilter} />
    </div>
  );
}
