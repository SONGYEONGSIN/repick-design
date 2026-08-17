"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import type { ChartPeriod } from "./ForecastChart";
import ForecastChart from "./ForecastChart";
import ExperimentPicker from "./ExperimentPicker";
import ExperimentsTable from "./ExperimentsTable";
import type { ExperimentId } from "./data";
import { EXPERIMENT_BY_ID, EXPERIMENTS, numberFmt, SIGNIFICANT_COUNT, TOTAL_PARTICIPANTS } from "./data";
import Sidebar from "./Sidebar";
import SignificancePanel from "./SignificancePanel";
import { APP_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import Topbar from "./Topbar";
import { Card } from "./ui";
import VariantCompare from "./VariantCompare";

const DEFAULT_EXPERIMENT_ID: ExperimentId = "checkout-cta";

export default function VelaClient() {
  const [selectedId, setSelectedId] = useState<ExperimentId>(DEFAULT_EXPERIMENT_ID);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("recent");
  const [showForecast, setShowForecast] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const experiment = EXPERIMENT_BY_ID[selectedId] ?? EXPERIMENTS[0];
  const notYetCount = EXPERIMENTS.length - SIGNIFICANT_COUNT;

  function selectExperiment(id: ExperimentId) {
    setSelectedId(id);
  }

  return (
    <div className={cx("flex min-h-dvh", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className={cx("text-2xl font-semibold tracking-tight", TEXT_PRIMARY)}>Experiments</h1>
              <p className={cx("mt-1 text-sm", TEXT_CAPTION)}>
                <span className={cx(NUM, TEXT_PRIMARY, "font-medium")}>{EXPERIMENTS.length}</span> experiments &middot;{" "}
                <span className={cx(NUM, TEXT_PRIMARY, "font-medium")}>{SIGNIFICANT_COUNT}</span> significant &middot;{" "}
                <span className={cx(NUM, TEXT_PRIMARY, "font-medium")}>{notYetCount}</span> not yet significant &middot;{" "}
                <span className={cx(NUM, TEXT_PRIMARY, "font-medium")}>{numberFmt.format(TOTAL_PARTICIPANTS)}</span> total participants
              </p>
            </div>
          </div>

          <div className="mt-5">
            <ExperimentPicker selectedId={selectedId} onSelect={selectExperiment} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <Card id="forecast-chart-card" className="lg:col-span-8">
              <ForecastChart experiment={experiment} period={chartPeriod} onPeriodChange={setChartPeriod} showForecast={showForecast} onShowForecastChange={setShowForecast} />
            </Card>
            <Card className="lg:col-span-4">
              <SignificancePanel experiment={experiment} />
            </Card>
          </div>

          <Card id="compare-card" className="mt-4 lg:mt-6">
            <VariantCompare experiment={experiment} />
          </Card>

          <Card id="experiments-table-card" className="mt-4 lg:mt-6">
            <ExperimentsTable selectedId={selectedId} onSelect={selectExperiment} />
          </Card>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectExperiment={selectExperiment} /> : null}
    </div>
  );
}
