"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, PackageSearch, Scale, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import type { CategoryId, Period, TeamId } from "./data";
import {
  PERIODS,
  RESOURCES,
  TEAM_META,
  TEAM_ORDER,
  UNALLOCATED_SPEND,
  anomalousResources,
  budgetVariancePct,
  companyBudget,
  companyTeamsTotal,
  companyTotal,
  resourceCost,
  teamTotal,
} from "./data";
import { formatCount, formatCurrency, formatSignedPercent } from "./format";
import { Card, Delta, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { TeamsRail } from "./teams-rail";
import { CostTreemap } from "./cost-treemap";
import { BreadcrumbCard } from "./breadcrumb-card";
import { PinnedResourceCard } from "./pinned-resource-card";
import { TreeTable } from "./tree-table";
import { ResourcesTable } from "./resources-table";

const DEFAULT_PINNED_RESOURCE_ID = "platform-logs-bucket";

function KpiTile({ icon: Icon, label, value, trail }: { icon: LucideIcon; label: string; value: string; trail: ReactNode }) {
  return (
    <div className="min-w-0">
      {/* Icon lives inside `dt`, never wrapping both `dt` and `dd` — keeps the `dl > div >
          (dt, dd)` shape the definition-list audit requires. */}
      <dt className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
        <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1.5 pl-[22px]">
        <span className="block font-semibold text-2xl tabular-nums text-zinc-50 [font-family:var(--font-display-grotesk)]">{value}</span>
        <span className="mt-1 block">{trail}</span>
      </dd>
    </div>
  );
}

export default function Page() {
  const [period, setPeriod] = useState<Period>("this-month");
  const [activeTeamId, setActiveTeamId] = useState<TeamId>("platform");
  const [drillCategoryId, setDrillCategoryId] = useState<CategoryId | null>(null);
  const [pinnedResourceId, setPinnedResourceId] = useState<string>(DEFAULT_PINNED_RESOURCE_ID);
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

  const activeTeam = TEAM_META[activeTeamId];
  const otherPeriod: Period = period === "this-month" ? "last-month" : "this-month";
  const otherPeriodLabel = PERIODS.find((p) => p.value === otherPeriod)?.label ?? "";

  const totalSpend = companyTotal(period);
  const otherTotalSpend = companyTotal(otherPeriod);
  const spendDeltaPct = ((totalSpend - otherTotalSpend) / otherTotalSpend) * 100;

  const budget = companyBudget();
  const variancePct = budgetVariancePct(companyTeamsTotal(period), budget);
  const otherVariancePct = budgetVariancePct(companyTeamsTotal(otherPeriod), budget);

  const unallocated = UNALLOCATED_SPEND[period];
  const otherUnallocated = UNALLOCATED_SPEND[otherPeriod];
  const unallocatedDeltaPct = ((unallocated - otherUnallocated) / otherUnallocated) * 100;

  const anomalyCount = anomalousResources().length;

  function handleExport() {
    const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";
    const lines: string[] = [];
    lines.push(`Ration cost allocation export — ${periodLabel}`);
    lines.push("");
    lines.push("Team,Monthly Budget,Spend,Budget Variance %");
    for (const id of TEAM_ORDER) {
      const team = TEAM_META[id];
      const spend = teamTotal(id, period);
      lines.push([team.name, team.monthlyBudget, spend, budgetVariancePct(spend, team.monthlyBudget).toFixed(1)].join(","));
    }
    lines.push("");
    lines.push("Unallocated Spend," + unallocated);
    lines.push("");
    lines.push("Resource,Team,Category,Cost,Utilization %,Status");
    for (const r of RESOURCES) {
      lines.push([r.name, TEAM_META[r.teamId].name, r.categoryId, resourceCost(r, period), r.utilizationPct, r.status].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ration-cost-allocation-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-950 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-950">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-xl text-zinc-50 [font-family:var(--font-display-grotesk)]">Cost Allocation</h1>
                <p className="mt-0.5 max-w-xl font-normal text-sm text-zinc-400">
                  Cloud spend by team, service category and resource — {PERIODS.find((p) => p.value === period)?.label}.
                </p>
              </div>
              <SegmentedControl label="Period" options={PERIODS} value={period} onChange={setPeriod} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiTile
                icon={Wallet}
                label="Total Cloud Spend"
                value={formatCurrency(totalSpend)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={spendDeltaPct} invertGoodness />
                    <span className="font-normal text-xs text-zinc-400">vs {otherPeriodLabel}</span>
                  </span>
                }
              />
              <KpiTile
                icon={Scale}
                label="Budget Variance"
                value={formatSignedPercent(variancePct)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={variancePct - otherVariancePct} suffix="pp" invertGoodness />
                    <span className="font-normal text-xs text-zinc-400">vs {otherPeriodLabel}</span>
                  </span>
                }
              />
              <KpiTile
                icon={PackageSearch}
                label="Unallocated Spend"
                value={formatCurrency(unallocated)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={unallocatedDeltaPct} invertGoodness />
                    <span className="font-normal text-xs text-zinc-400">vs {otherPeriodLabel}</span>
                  </span>
                }
              />
              <KpiTile
                icon={AlertTriangle}
                label="Active Anomalies"
                value={formatCount(anomalyCount)}
                trail={<span className="font-normal text-xs text-zinc-400">Flagged resources right now</span>}
              />
            </dl>

            <div className="mt-5 grid grid-cols-1 gap-4 2xl:grid-cols-12">
              <div className="col-span-1 min-w-0 2xl:col-span-3">
                <TeamsRail period={period} activeTeamId={activeTeamId} onSelect={setActiveTeamId} />
              </div>

              <div className="col-span-1 flex min-w-0 flex-col gap-4 2xl:col-span-9">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <Card as="section" ariaLabelledBy="treemap-heading" className="col-span-12 min-w-0 p-4 sm:p-5 lg:col-span-8">
                    <h2 id="treemap-heading" className="font-semibold text-sm text-zinc-50">
                      Cost Treemap — {activeTeam.name}
                    </h2>
                    <p className="mt-0.5 font-normal text-xs text-zinc-400">Category and value are always shown as text on every tile.</p>
                    <div className="mt-3">
                      <CostTreemap
                        teamId={activeTeamId}
                        teamName={activeTeam.name}
                        period={period}
                        drillCategoryId={drillCategoryId}
                        onDrill={setDrillCategoryId}
                        onPinResource={setPinnedResourceId}
                      />
                    </div>
                  </Card>

                  <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-4">
                    <BreadcrumbCard teamId={activeTeamId} teamName={activeTeam.name} period={period} drillCategoryId={drillCategoryId} />
                    <PinnedResourceCard pinnedResourceId={pinnedResourceId} period={period} />
                  </div>
                </div>

                <Card className="min-w-0 p-4 sm:p-5">
                  <TreeTable teamId={activeTeamId} teamName={activeTeam.name} period={period} />
                </Card>

                <Card className="min-w-0 p-4 sm:p-5">
                  <ResourcesTable
                    teamId={activeTeamId}
                    teamName={activeTeam.name}
                    period={period}
                    pinnedResourceId={pinnedResourceId}
                    onPin={setPinnedResourceId}
                  />
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        period={period}
        onSelectTeam={setActiveTeamId}
        onSelectResource={setPinnedResourceId}
      />
    </div>
  );
}
