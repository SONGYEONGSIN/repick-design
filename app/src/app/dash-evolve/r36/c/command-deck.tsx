"use client";

import { ScatterChart as ScatterChartIcon, Table2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AggregatePanel from "./aggregate-panel";
import CommandPalette from "./command-palette";
import DataTable from "./data-table";
import { CAMPAIGNS, CHANNELS, PERIOD_DAYS, TOTAL_CAMPAIGNS, computeDomains, computeMetrics } from "./data";
import FilterRail from "./filter-rail";
import ScatterChart from "./scatter-chart";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { APP_BG, TEXT_DIM, TEXT_PRIMARY, type ChannelId, type GoalFilter, type PeriodId, cx } from "./tokens";
import { Card, CardHead, Eyebrow } from "./ui";

const ALL_CHANNELS = new Set<ChannelId>(CHANNELS.map((c) => c.id));

/**
 * Command-deck macro layout: a narrow filter rail on the left owns three inputs
 * (channel, goal, period) that converge into one `filtered` array — the ONLY
 * state threaded to more than one widget. It feeds the aggregate panel and the
 * scatter chart (and, for completeness, the fallback table) alike, and every one
 * of them recomputes fully from `filtered` on every change.
 *
 * `pinnedIds` and `activeId` are two separate, narrower axes that live between
 * exactly the chart and the table and nowhere else:
 *  - `activeId` is ephemeral hover/focus-readout, synced from either the chart's
 *    own pointer hover or the table row's focus — never persisted, never read by
 *    the aggregate panel or the filter rail.
 *  - `pinnedIds` is the chart-local pin from fix #2: set only by the table's Pin
 *    button, read only by the chart's own annotation layer. It never re-filters
 *    the aggregate panel and never changes the filter rail's selection — the
 *    command palette (below) deliberately has no way to touch it either, so it
 *    never grows a third independent consumer.
 */
export default function CommandDeckClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [channelFilter, setChannelFilter] = useState<Set<ChannelId>>(() => new Set(ALL_CHANNELS));
  const [goal, setGoal] = useState<GoalFilter>("all");
  const [period, setPeriod] = useState<PeriodId>("30");

  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const withMetrics = useMemo(() => CAMPAIGNS.map((c) => ({ ...c, m: computeMetrics(c, period) })), [period]);
  const domains = useMemo(() => computeDomains(withMetrics), [withMetrics]);
  const goalFiltered = useMemo(() => withMetrics.filter((c) => goal === "all" || c.goal === goal), [withMetrics, goal]);
  const filtered = useMemo(() => goalFiltered.filter((c) => channelFilter.has(c.channel)), [goalFiltered, channelFilter]);

  const isDefaultFilters = channelFilter.size === ALL_CHANNELS.size && goal === "all" && period === "30";

  function toggleChannel(id: ChannelId) {
    setChannelFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setChannelFilter(new Set(ALL_CHANNELS));
    setGoal("all");
    setPeriod("30");
  }

  function togglePin(id: string) {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <Eyebrow>Acme Retail Co. · Growth analytics</Eyebrow>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Campaign correlation</h1>
          <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_DIM)}>
            {"Every active campaign plotted by spend against conversion rate, bubble size showing conversion volume. Filter by channel, goal or date window on the left — the summary and the chart both recalculate to match."}
          </p>

          <div className="mt-5 grid grid-cols-12 gap-4">
            <div id="filters" className="col-span-12 min-w-0 lg:col-span-3">
              <div className="lg:sticky lg:top-20">
                <FilterRail
                  countsSource={goalFiltered}
                  visibleCount={filtered.length}
                  channelFilter={channelFilter}
                  onToggleChannel={toggleChannel}
                  goal={goal}
                  onGoal={setGoal}
                  period={period}
                  onPeriod={setPeriod}
                  onReset={resetFilters}
                  isDefault={isDefaultFilters}
                />
              </div>
            </div>

            <div className="col-span-12 min-w-0 lg:col-span-9">
              <AggregatePanel items={filtered} totalCampaigns={TOTAL_CAMPAIGNS} windowDays={PERIOD_DAYS[period]} />

              <div id="chart" className="mt-4">
                <Card>
                  <CardHead
                    title="Spend vs. conversion rate"
                    hint="Shape marks the channel. Hover a bubble, or tab to its row in the table, for its exact numbers — pin it from the table to keep its label on screen."
                    Icon={ScatterChartIcon}
                  />
                  <div className="mt-4">
                    <ScatterChart
                      items={filtered}
                      domainMaxSpend={domains.maxSpend}
                      domainMaxRate={domains.maxRate}
                      domainMaxConversions={domains.maxConversions}
                      windowDays={PERIOD_DAYS[period]}
                      pinnedIds={pinnedIds}
                      activeId={activeId}
                      onHover={setActiveId}
                    />
                  </div>
                </Card>
              </div>

              <div id="table" className="mt-4">
                <Card>
                  <CardHead title="Every campaign, exact" hint="The persistent fallback — sort it, but nothing here is ever hidden behind a hover or a pin." Icon={Table2} />
                  <div className="mt-3">
                    <DataTable items={filtered} pinnedIds={pinnedIds} onTogglePin={togglePin} onFocusRow={setActiveId} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onResetFilters={resetFilters} /> : null}
    </div>
  );
}
