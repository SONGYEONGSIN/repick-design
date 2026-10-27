"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Beaker, Flag as FlagIcon, GitCompare, Layers, Percent, Pin, ShieldAlert } from "lucide-react";
import type { Environment, Experiment, FeatureFlag, MetricKey } from "./types";
import { EXPERIMENTS, INITIAL_FLAGS } from "./data";
import { defaultPinnedId, resolveMetric } from "./format";
import { Card, CardHeader, SegmentedControl, StatCard, useReducedMotion } from "./ui";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { NewFlagDrawer } from "./new-flag-drawer";
import { SlopeChart } from "./slope-chart";
import { ExperimentsList } from "./experiments-list";
import { FlagsTable } from "./flags-table";
import { PinSummaryCard } from "./pin-summary-card";
import { RolloutCard } from "./rollout-card";

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: "conversion", label: "Conversion" },
  { value: "latency", label: "Latency" },
  { value: "error", label: "Error rate" },
];

export function FlaglineDashboard() {
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [metric, setMetric] = useState<MetricKey>("conversion");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string>(() => defaultPinnedId(EXPERIMENTS));
  const [envFilter, setEnvFilter] = useState<Environment | "all">("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightedFlagId, setHighlightedFlagId] = useState<string | null>(null);
  const [newFlagCount, setNewFlagCount] = useState(0);

  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  const registerRowRef = useCallback((id: string, el: HTMLTableRowElement | null) => {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }, []);
  const reducedMotion = useReducedMotion();

  // Global ⌘K / Ctrl+K to open the command palette.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredFlags = useMemo(
    () => (envFilter === "all" ? flags : flags.filter((f) => f.environment === envFilter)),
    [flags, envFilter]
  );
  const activeFlagsCount = filteredFlags.filter((f) => f.status === "active").length;
  const activeFlagsForAvg = filteredFlags.filter((f) => f.status === "active");
  const avgRollout =
    activeFlagsForAvg.length === 0 ? 0 : Math.round(activeFlagsForAvg.reduce((sum, f) => sum + f.rollout, 0) / activeFlagsForAvg.length);

  const regressingExperiments = useMemo(
    () => EXPERIMENTS.filter((e) => resolveMetric(e.conversion, "conversion").direction === "regressed"),
    []
  );

  const pinnedExperiment = EXPERIMENTS.find((e) => e.id === pinnedId) ?? EXPERIMENTS[0];

  function handleSelectExperimentFromPalette(experiment: Experiment) {
    setPinnedId(experiment.id);
  }

  function handleSelectFlagFromPalette(flag: FeatureFlag) {
    setEnvFilter("all");
    setHighlightedFlagId(flag.id);
    window.setTimeout(() => {
      const el = rowRefs.current.get(flag.id);
      el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }, 0);
  }

  function handleCreateFlag(flag: FeatureFlag) {
    setFlags((prev) => [flag, ...prev]);
    setNewFlagCount((n) => n + 1);
    setHighlightedFlagId(flag.id);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-emerald-600 focus:px-3 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Topbar
        envFilter={envFilter}
        onEnvFilterChange={setEnvFilter}
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenNewFlag={() => setDrawerOpen(true)}
        regressingExperiments={regressingExperiments}
        onPinFromNotification={setPinnedId}
      />

      <main id="main-content" className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-12 gap-4">
          <StatCard
            icon={<FlagIcon className="h-3.5 w-3.5" />}
            label="Active flags"
            value={String(activeFlagsCount)}
            hint={envFilter === "all" ? `of ${filteredFlags.length} total` : `in ${envFilter}`}
          />
          <StatCard icon={<Beaker className="h-3.5 w-3.5" />} label="Live experiments" value={String(EXPERIMENTS.length)} hint="reporting guardrails" />
          <StatCard
            icon={<ShieldAlert className="h-3.5 w-3.5" />}
            label="Conversion regressions"
            value={String(regressingExperiments.length)}
            hint="of 8 experiments"
          />
          <StatCard icon={<Percent className="h-3.5 w-3.5" />} label="Avg rollout" value={`${avgRollout}%`} hint="active flags, scoped" />

          <Card className="col-span-12 flex h-[520px] flex-col lg:col-span-8" aria-labelledby="slope-chart-title">
            <CardHeader
              icon={<GitCompare className="h-3.5 w-3.5" />}
              title="Guardrail metric — before vs. after"
              titleId="slope-chart-title"
              action={<SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={setMetric} ariaLabel="Choose guardrail metric" />}
            />
            <div className="min-h-0 flex-1 p-4 sm:p-5">
              <SlopeChart experiments={EXPERIMENTS} metric={metric} hoveredId={hoveredId} onHover={setHoveredId} />
            </div>
          </Card>

          <Card className="col-span-12 flex h-[520px] flex-col lg:col-span-4" aria-labelledby="experiments-list-title">
            <CardHeader icon={<Beaker className="h-3.5 w-3.5" />} title="Active experiments" titleId="experiments-list-title" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <ExperimentsList experiments={EXPERIMENTS} metric={metric} pinnedId={pinnedId} onPin={setPinnedId} />
            </div>
          </Card>

          <Card className="col-span-12 lg:col-span-8" aria-labelledby="flags-table-title">
            <CardHeader
              icon={<FlagIcon className="h-3.5 w-3.5" />}
              title="Feature flags"
              titleId="flags-table-title"
              action={newFlagCount > 0 ? <span className="text-[11px] font-normal text-emerald-700">+{newFlagCount} created this session</span> : undefined}
            />
            <FlagsTable flags={filteredFlags} highlightedId={highlightedFlagId} registerRowRef={registerRowRef} />
          </Card>

          <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
            <Card aria-labelledby="pin-summary-title">
              <CardHeader icon={<Pin className="h-3.5 w-3.5" />} title="Pinned experiment" titleId="pin-summary-title" />
              <PinSummaryCard experiment={pinnedExperiment} />
            </Card>
            <Card aria-labelledby="rollout-title">
              <CardHeader icon={<Layers className="h-3.5 w-3.5" />} title="Rollout by environment" titleId="rollout-title" />
              <RolloutCard flags={flags} />
            </Card>
          </div>
        </div>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        flags={flags}
        experiments={EXPERIMENTS}
        onSelectFlag={handleSelectFlagFromPalette}
        onSelectExperiment={handleSelectExperimentFromPalette}
      />
      <NewFlagDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreate={handleCreateFlag} nextId={newFlagCount + 1} />
    </div>
  );
}
