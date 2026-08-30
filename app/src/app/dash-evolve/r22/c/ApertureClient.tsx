"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";
import {
  DEFAULT_SAVED_QUESTIONS,
  DIMENSIONS,
  METRICS,
  PERIODS,
  bucketsFor,
  dimensionById,
  metricById,
  periodById,
  tableRowsFor,
  type DimensionId,
  type MetricId,
  type PeriodId,
  type SavedQuestion,
} from "./data";
import { Card, FOCUS_RING } from "./ui";
import { Sidebar, MobileDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { QueryBar } from "./QueryBar";
import { ExploreChart } from "./ExploreChart";
import { ResultsTable } from "./ResultsTable";
import { CommandPalette, type CommandPaletteHandle, type PaletteCommand } from "./CommandPalette";

const DEFAULT_METRIC: MetricId = "revenue";
const DEFAULT_DIMENSION: DimensionId = "channel";
const DEFAULT_PERIOD: PeriodId = "30d";

export function ApertureClient() {
  const [metric, setMetric] = useState<MetricId>(DEFAULT_METRIC);
  const [dimension, setDimension] = useState<DimensionId>(DEFAULT_DIMENSION);
  const [period, setPeriod] = useState<PeriodId>(DEFAULT_PERIOD);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>(DEFAULT_SAVED_QUESTIONS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const paletteRef = useRef<CommandPaletteHandle>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        paletteRef.current?.open();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const metricDef = metricById(metric);
  const dimensionDef = dimensionById(dimension);
  const periodDef = periodById(period);
  const buckets = useMemo(() => bucketsFor(periodDef), [periodDef]);
  const rows = useMemo(() => tableRowsFor(metricDef, dimensionDef, periodDef), [metricDef, dimensionDef, periodDef]);

  const isCurrentSaved = savedQuestions.some((q) => q.metric === metric && q.dimension === dimension && q.period === period);

  function toggleSaved() {
    if (isCurrentSaved) {
      setSavedQuestions((qs) => qs.filter((q) => !(q.metric === metric && q.dimension === dimension && q.period === period)));
    } else {
      setSavedQuestions((qs) => [
        ...qs,
        {
          id: `custom-${metric}-${dimension}-${period}-${qs.length}`,
          label: `${metricDef.label} by ${dimensionDef.label.toLowerCase()}, ${periodDef.short}`,
          metric,
          dimension,
          period,
        },
      ]);
    }
  }

  function applyQuestion(q: SavedQuestion) {
    setMetric(q.metric);
    setDimension(q.dimension);
    setPeriod(q.period);
  }

  function newQuestion() {
    setMetric(DEFAULT_METRIC);
    setDimension(DEFAULT_DIMENSION);
    setPeriod(DEFAULT_PERIOD);
  }

  const commands = useMemo<PaletteCommand[]>(() => {
    const metricCmds = METRICS.map((m) => ({
      id: `metric-${m.id}`,
      group: "Metric",
      label: `Metric — ${m.label}`,
      run: () => setMetric(m.id),
    }));
    const dimensionCmds = DIMENSIONS.map((d) => ({
      id: `dimension-${d.id}`,
      group: "Group by",
      label: d.groupLabel,
      run: () => setDimension(d.id),
    }));
    const periodCmds = PERIODS.map((p) => ({
      id: `period-${p.id}`,
      group: "Period",
      label: p.label,
      run: () => setPeriod(p.id),
    }));
    const savedCmds = savedQuestions.map((q) => ({
      id: `saved-${q.id}`,
      group: "Saved questions",
      label: q.label,
      run: () => {
        setMetric(q.metric);
        setDimension(q.dimension);
        setPeriod(q.period);
      },
    }));
    return [...metricCmds, ...dimensionCmds, ...periodCmds, ...savedCmds];
  }, [savedQuestions]);

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[#1f5fc4] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => paletteRef.current?.open()}
          onNewQuestion={newQuestion}
        />

        <main id="main-content" className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1680px] px-6 py-6 sm:px-8 sm:py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Explore</h1>
            <p className="mt-1 max-w-2xl text-sm font-normal text-zinc-400">
              Assemble a question from a metric, a group-by, and a period. The chart and table below always answer
              exactly that question — change any control and both recompute.
            </p>

            <Card className="mt-6">
              <h2 className="sr-only font-medium">Assemble your question</h2>
              <QueryBar
                metric={metric}
                dimension={dimension}
                period={period}
                onMetric={setMetric}
                onDimension={setDimension}
                onPeriod={setPeriod}
                saved={isCurrentSaved}
                onToggleSaved={toggleSaved}
              />
            </Card>

            <section id="saved-questions" className="mt-5 scroll-mt-6">
              <h2 className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Saved questions</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {savedQuestions.map((q) => {
                  const active = q.metric === metric && q.dimension === dimension && q.period === period;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => applyQuestion(q)}
                      aria-pressed={active}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${FOCUS_RING} ${
                        active
                          ? "border-[rgba(57,135,229,0.32)] bg-[rgba(57,135,229,0.14)] text-[#8ab6f2]"
                          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:text-zinc-50"
                      }`}
                    >
                      <Star size={12} aria-hidden="true" fill={active ? "currentColor" : "none"} />
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <Card className="mt-5">
              <ExploreChart metric={metricDef} dimension={dimensionDef} period={periodDef} rows={rows} buckets={buckets} />
            </Card>

            <div className="mt-5">
              <ResultsTable metric={metricDef} dimensionLabel={dimensionDef.label} rows={rows} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette ref={paletteRef} commands={commands} />
    </div>
  );
}
