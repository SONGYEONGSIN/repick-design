"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeftRight, Plug, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { ENTITIES, LATEST_INDEX, PERIODS, PREVIOUS_INDEX, rankAt, rankChangeCount, totalActiveConnections, valueAt } from "./data";
import { formatCount } from "./format";
import { Card } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { BumpChartHero } from "./bump-chart";
import { LeaderboardTable } from "./leaderboard-table";

function KpiTile({ icon: Icon, label, value, trail }: { icon: LucideIcon; label: string; value: string; trail: ReactNode }) {
  return (
    <div className="min-w-0">
      {/* Icon lives inside `dt`, never wrapping both `dt` and `dd` — keeps the `dl > div >
          (dt, dd)` shape a definition-list audit expects. */}
      <dt className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
        <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1.5 pl-[22px]">
        {/* Strictly smaller than the bump chart's own headline numbers (text-3xl, in the hero
            card) — the dominant visualization stays visually primary on this route. */}
        <span className="block font-semibold text-xl tabular-nums text-zinc-50">{value}</span>
        <span className="mt-1 block">{trail}</span>
      </dd>
    </div>
  );
}

export default function Page() {
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

  const totalConnectionsNow = totalActiveConnections(LATEST_INDEX);
  const swapsThisWeek = rankChangeCount(PREVIOUS_INDEX, LATEST_INDEX);

  function handleExport() {
    const lines: string[] = [];
    lines.push("Threadline integration leaderboard export");
    lines.push("");
    const header = ["Integration", "Category", ...PERIODS.map((p) => `Rank ${p.label}`), ...PERIODS.map((p) => `Connections ${p.label}`)];
    lines.push(header.join(","));
    for (const entity of ENTITIES) {
      const ranks = PERIODS.map((_, idx) => rankAt(entity.id, idx));
      const values = PERIODS.map((_, idx) => valueAt(entity.id, idx));
      lines.push([entity.name, entity.category, ...ranks, ...values].join(","));
    }
    lines.push("");
    lines.push(`Total active connections (${PERIODS[LATEST_INDEX].label}),${totalConnectionsNow}`);
    lines.push(`Integrations that swapped rank vs ${PERIODS[PREVIOUS_INDEX].label},${swapsThisWeek}`);
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "threadline-integration-leaderboard-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-sky-400 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-950 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-950">
          {/* Sidebar is a fixed 256px rail (`w-64`), same as the rest of this shell family.
              1600px is kept as the content cap for the same reason it worked there: at a 1920px
              viewport the main column is already 1920 - 256 = 1664px wide, so a 1600px inner cap
              only ever introduces ~32px of margin on each side — comfortably inside the "≤40px
              from the viewport edge" rule — and only engages at all on monitors wider than that,
              keeping the chart from stretching out indefinitely on ultrawide displays. */}
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-xl text-zinc-50 [font-family:var(--font-display-mono)]">Integration Leaderboard</h1>
                <p className="mt-0.5 max-w-xl font-normal text-sm text-zinc-400">
                  Which integrations your customers connect most, and how that rank shifts week over week.
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KpiTile
                icon={Plug}
                label="Integrations Tracked"
                value={formatCount(ENTITIES.length)}
                trail={<span className="font-normal text-xs text-zinc-400">Across 4 categories</span>}
              />
              <KpiTile
                icon={Zap}
                label="Active Connections This Week"
                value={formatCount(totalConnectionsNow)}
                trail={<span className="font-normal text-xs text-zinc-400">Summed across all 8 integrations</span>}
              />
              <KpiTile
                icon={ArrowLeftRight}
                label="Ranks Swapped This Week"
                value={formatCount(swapsThisWeek)}
                trail={<span className="font-normal text-xs text-zinc-400">vs {PERIODS[PREVIOUS_INDEX].label}</span>}
              />
            </dl>

            <div className="mt-5 grid grid-cols-1 gap-4 2xl:grid-cols-12">
              <Card as="section" ariaLabelledBy="leaderboard-chart-heading" className="col-span-12 min-w-0 p-4 sm:p-6">
                <BumpChartHero />
              </Card>

              <Card className="col-span-12 min-w-0 p-4 sm:p-6">
                <LeaderboardTable />
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onExport={handleExport} />
    </div>
  );
}
