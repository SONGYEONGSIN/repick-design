"use client";

import { useEffect, useMemo, useState } from "react";
import type { PeriodId, SegmentId } from "../lib/data";
import { experimentById, segmentsForPeriod, seriesForPeriod } from "../lib/data";
import { round2, sumSegments } from "../lib/format";
import { twoProportionZTest } from "../lib/stats";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ControlBar from "./ControlBar";
import VariantPanel from "./VariantPanel";
import DividerWinner from "./DividerWinner";
import SignificanceBar from "./SignificanceBar";
import CommandPalette from "./CommandPalette";
import type { AccentTokens } from "./VariantPanel";

const ACCENT_A: AccentTokens = {
  dot: "bg-zinc-400 dark:bg-zinc-500",
  chip: "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400",
  text: "text-zinc-700 dark:text-zinc-300",
  chartText: "text-zinc-500 dark:text-zinc-400",
};

const ACCENT_B: AccentTokens = {
  dot: "bg-indigo-500",
  chip: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300",
  text: "text-indigo-700 dark:text-indigo-300",
  chartText: "text-indigo-600 dark:text-indigo-400",
};

export default function BisectClient() {
  const [experimentId, setExperimentId] = useState("exp-checkout");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [selectedSegment, setSelectedSegment] = useState<SegmentId | "all">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const experiment = experimentById(experimentId);

  const rowsA = useMemo(() => segmentsForPeriod(experiment.variantA, period), [experiment, period]);
  const rowsB = useMemo(() => segmentsForPeriod(experiment.variantB, period), [experiment, period]);
  const totalsA = useMemo(() => sumSegments(rowsA), [rowsA]);
  const totalsB = useMemo(() => sumSegments(rowsB), [rowsB]);

  const liveComparison = useMemo(() => {
    const a =
      selectedSegment === "all" ? totalsA : sumSegments(rowsA.filter((r) => r.id === selectedSegment));
    const b =
      selectedSegment === "all" ? totalsB : sumSegments(rowsB.filter((r) => r.id === selectedSegment));
    return twoProportionZTest(a.visitors, a.conversions, b.visitors, b.conversions);
  }, [rowsA, rowsB, totalsA, totalsB, selectedSegment]);

  const overallComparison = useMemo(
    () => twoProportionZTest(totalsA.visitors, totalsA.conversions, totalsB.visitors, totalsB.conversions),
    [totalsA, totalsB]
  );

  const yDomain = useMemo<[number, number]>(() => {
    const seriesA = seriesForPeriod(experiment.variantA, period);
    const seriesB = seriesForPeriod(experiment.variantB, period);
    const values = [...seriesA.map((d) => d.value), ...seriesB.map((d) => d.value)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.2 || 1;
    return [round2(Math.max(0, min - pad)), round2(max + pad)];
  }, [experiment, period]);

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1920px] min-w-0 flex-col gap-4 p-4 sm:p-6">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{experiment.name}</h1>
              <p className="mt-0.5 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">{experiment.hypothesis}</p>
            </div>

            <ControlBar
              experiment={experiment}
              onSelectExperiment={setExperimentId}
              period={period}
              onSelectPeriod={setPeriod}
            />

            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-3">
              <VariantPanel
                side="a"
                experiment={experiment}
                period={period}
                trafficSplit={experiment.trafficSplitA}
                accent={ACCENT_A}
                yDomain={yDomain}
                selectedSegment={selectedSegment}
                onSelectSegment={setSelectedSegment}
              />
              <DividerWinner comparison={liveComparison} />
              <VariantPanel
                side="b"
                experiment={experiment}
                period={period}
                trafficSplit={experiment.trafficSplitB}
                accent={ACCENT_B}
                yDomain={yDomain}
                selectedSegment={selectedSegment}
                onSelectSegment={setSelectedSegment}
              />
            </div>

            <SignificanceBar
              comparison={overallComparison}
              visitorsA={totalsA.visitors}
              visitorsB={totalsB.visitors}
              experimentName={experiment.name}
            />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectExperiment={setExperimentId} />
    </div>
  );
}
