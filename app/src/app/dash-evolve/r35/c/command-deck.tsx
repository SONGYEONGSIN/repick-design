"use client";

import { GitCompare, ScatterChart as ScatterChartIcon, Table2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AggregatePanel from "./aggregate-panel";
import CommandPalette from "./command-palette";
import DataTable from "./data-table";
import {
  CAMPAIGNS,
  CHANNELS,
  PERIOD_DAYS,
  TOTAL_CAMPAIGNS,
  computeDomains,
  computeMetrics,
} from "./data";
import FilterRail from "./filter-rail";
import ScatterChart from "./scatter-chart";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, type ChannelId, type ObjectiveFilter, type PeriodId, cx, pearsonR } from "./tokens";
import { Card, CardHead, Eyebrow } from "./ui";

const ALL_CHANNELS = new Set<ChannelId>(CHANNELS.map((c) => c.id));

/**
 * Command-deck macro layout: a filter rail that decides WHICH CAMPAIGNS APPEAR,
 * the scatter as the one large dominant visualization, and an aggregate panel that
 * recalculates for the currently-visible set. That filter→aggregate axis is the
 * only state this component threads through several widgets — `channelFilter`,
 * `objective` and `period` all converge into one `filtered` array consumed by the
 * chart, the panel and the table alike.
 *
 * `pinnedIds` is a second, independent axis: it is lifted up here so the command
 * palette and the data table's Pin column can also set it (the table's Pin button
 * is the fully keyboard-accessible route to the same action the chart's pointer-
 * only bubbles offer to a mouse — see scatter-chart.tsx and data-table.tsx).
 * AggregatePanel never receives it and never re-renders because of it. Filtering
 * the chart does not touch pin state either way.
 */
export default function CommandDeckClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [channelFilter, setChannelFilter] = useState<Set<ChannelId>>(() => new Set(ALL_CHANNELS));
  const [objective, setObjective] = useState<ObjectiveFilter>("all");
  const [period, setPeriod] = useState<PeriodId>("30");

  // Chart-local selection, lifted only so the command palette can reach it — see
  // the doc comment above and scatter-chart.tsx's own header comment.
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => new Set());

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
  const objectiveFiltered = useMemo(() => withMetrics.filter((c) => objective === "all" || c.objective === objective), [withMetrics, objective]);
  const filtered = useMemo(() => objectiveFiltered.filter((c) => channelFilter.has(c.channel)), [objectiveFiltered, channelFilter]);
  const corr = useMemo(() => pearsonR(filtered.map((c) => ({ x: c.m.spend, y: c.m.conversionRate }))), [filtered]);

  const isDefaultFilters = channelFilter.size === ALL_CHANNELS.size && objective === "all" && period === "30";

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
    setObjective("all");
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

  function clearPins() {
    setPinnedIds(new Set());
  }

  /** The command palette's "jump to a campaign" is an explicit power-user shortcut,
   * distinct from the narrow chart-only pin: it may widen the channel/objective
   * filters so the campaign is guaranteed to be visible before pinning it. */
  function selectCampaignFromPalette(id: string) {
    const campaign = CAMPAIGNS.find((c) => c.id === id);
    if (!campaign) return;
    setChannelFilter((prev) => (prev.has(campaign.channel) ? prev : new Set(prev).add(campaign.channel)));
    setObjective("all");
    setPinnedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>Acme Retail Co. · Growth analytics</Eyebrow>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]">Campaign correlation</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Every active campaign plotted by spend against conversion rate, bubble size showing volume. Filter by channel, objective or date window to see how the cohort behaves — the panel on the right recalculates to match.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <FilterRail
              countsSource={objectiveFiltered}
              visibleCount={filtered.length}
              channelFilter={channelFilter}
              onToggleChannel={toggleChannel}
              objective={objective}
              onObjective={setObjective}
              period={period}
              onPeriod={setPeriod}
              onReset={resetFilters}
              isDefault={isDefaultFilters}
            />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <Card>
                <CardHead
                  title="Spend vs. conversion rate"
                  hint="Shape marks the channel, size marks total conversions. Hover or tab to a bubble for its exact numbers; click or press Enter to pin its label."
                  Icon={ScatterChartIcon}
                  action={
                    corr !== null ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/25 bg-orange-400/10 px-2.5 py-1 text-[11px] font-semibold text-orange-300">
                        <GitCompare size={11} aria-hidden="true" />
                        {`r = ${corr.toFixed(2)}`}
                      </span>
                    ) : null
                  }
                />
                <div className="mt-4">
                  <ScatterChart
                    items={filtered}
                    domainMaxSpend={domains.maxSpend}
                    domainMaxRate={domains.maxRate}
                    domainMaxConversions={domains.maxConversions}
                    windowDays={PERIOD_DAYS[period]}
                    pinnedIds={pinnedIds}
                    onTogglePin={togglePin}
                    onClearPins={clearPins}
                  />
                </div>
              </Card>
            </div>

            <div className="col-span-12 min-w-0 xl:col-span-4">
              <Card className="xl:sticky xl:top-20">
                <CardHead
                  title="Filtered cohort"
                  hint="Totals and the correlation below recalculate the instant a filter changes — independent of anything pinned on the chart."
                />
                <div className="mt-3">
                  <AggregatePanel items={filtered} totalCampaigns={TOTAL_CAMPAIGNS} windowDays={PERIOD_DAYS[period]} />
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <CardHead title="Every campaign, exact" hint="The persistent fallback — sort it, but nothing here is ever hidden behind a hover or a pin." Icon={Table2} />
              <div className="mt-3">
                <DataTable items={filtered} pinnedIds={pinnedIds} onTogglePin={togglePin} />
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectCampaign={selectCampaignFromPalette} /> : null}
    </div>
  );
}
