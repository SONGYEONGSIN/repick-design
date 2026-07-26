"use client";

import { useEffect, useMemo, useState } from "react";
import BridgeChart from "./BridgeChart";
import CommandPalette from "./CommandPalette";
import {
  BRIDGE_INPUT,
  SEGMENT_OWNERS,
  SEGMENTS,
  TREND,
  TREND_PERIOD_LABELS,
  buildAccountContributions,
  buildBridge,
  buildDriverRows,
  buildHeroStats,
  leadSegmentFor,
  type DeltaStepKey,
  type MetricId,
  type PeriodId,
  type StepKey,
} from "./data";
import DetailRail from "./DetailRail";
import DriverTable from "./DriverTable";
import HeroPanel from "./HeroPanel";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { APP_BG, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader } from "./ui";

function isDeltaStep(key: StepKey): key is DeltaStepKey {
  return key === "new" || key === "expansion" || key === "reactivation" || key === "contraction" || key === "churn";
}

export default function AmberlineClient() {
  const [period, setPeriod] = useState<PeriodId>("monthly");
  const [metric, setMetric] = useState<MetricId>("arr");
  const [selectedKey, setSelectedKey] = useState<StepKey>("expansion");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const bars = useMemo(() => buildBridge(period, metric), [period, metric]);
  const driverRows = useMemo(() => buildDriverRows(period, metric), [period, metric]);
  const heroStats = useMemo(() => buildHeroStats(period, metric), [period, metric]);
  const input = BRIDGE_INPUT[period][metric];
  const trend = TREND[period][metric];
  const trendLabels = TREND_PERIOD_LABELS[period];

  const selectedBar = bars.find((b) => b.key === selectedKey) ?? bars[0];
  const selectedIsDelta = isDeltaStep(selectedBar.key);

  const accounts = useMemo(() => (selectedIsDelta ? buildAccountContributions(selectedBar.key as DeltaStepKey, period, metric) : []), [selectedIsDelta, selectedBar.key, period, metric]);
  const leadOwner = useMemo(() => (selectedIsDelta ? SEGMENT_OWNERS[leadSegmentFor(selectedBar.key as DeltaStepKey, period, metric)] : null), [selectedIsDelta, selectedBar.key, period, metric]);

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:gap-5 sm:p-6">
            <header>
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Revenue Bridge</h1>
              <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Amberline · Finance Operations · {SEGMENTS.length} segments reconciled against the billing ledger</p>
            </header>

            <HeroPanel
              period={period}
              metric={metric}
              onPeriodChange={setPeriod}
              onMetricChange={setMetric}
              stats={heroStats}
              trend={trend}
              trendLabels={trendLabels}
              periodLabel={input.periodLabel}
              newValue={input.new}
            />

            <Card>
              <CardHeader
                as="h2"
                titleId="bridge-heading"
                title={`${metric === "arr" ? "ARR" : "Seat"} bridge — ${input.periodLabel}`}
                description="Click a bar, or focus it and press ← →, to inspect that driver below. Every bar shows its value directly, never hover-only."
              />
              <div className="mt-4">
                <BridgeChart bars={bars} metric={metric} selectedKey={selectedKey} onSelect={setSelectedKey} />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:items-start">
              <Card className="min-w-0 lg:col-span-8">
                <CardHeader as="h2" titleId="driver-heading" title="Driver breakdown" description="Per-segment contribution to each bridge step. Sort any column or filter to a single driver." />
                <div className="mt-4">
                  <DriverTable
                    rows={driverRows}
                    bars={bars}
                    metric={metric}
                    highlightStep={selectedKey}
                    onRowFocusStep={(step) => setSelectedKey(step)}
                  />
                </div>
              </Card>

              <Card className="min-w-0 lg:col-span-4">
                <DetailRail bar={selectedBar} metric={metric} accounts={accounts} leadOwner={leadOwner} startLabel={input.startLabel} endLabel={input.endLabel} />
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette bars={bars} driverRows={driverRows} metric={metric} onClose={() => setPaletteOpen(false)} onSelectStep={setSelectedKey} />
      ) : null}
    </div>
  );
}
