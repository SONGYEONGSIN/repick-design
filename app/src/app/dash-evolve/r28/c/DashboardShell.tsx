"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesGantt, CheckCircle2, CircleDashed, LayoutGrid, TriangleAlert } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import QueueRail from "./QueueRail";
import GanttChart, { type ViewMode } from "./GanttChart";
import DetailStrip from "./DetailStrip";
import CrewTable from "./CrewTable";
import CommandPalette from "./CommandPalette";
import { CREWS, JOBS, QUEUE_JOBS, SCHEDULED_JOBS, TOTALS, formatCount, FOCUS_RING } from "./data";

export default function DashboardShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const pinnedJob = pinnedId ? JOBS.find((j) => j.id === pinnedId) ?? null : null;

  function handlePin(id: string) {
    setPinnedId((current) => (current === id ? null : id));
  }

  const statCards = [
    { label: "Total jobs", value: formatCount(TOTALS.total), icon: LayoutGrid, text: "text-zinc-50", bg: "bg-white/5" },
    { label: "On track", value: formatCount(TOTALS.onTrack), icon: CheckCircle2, text: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Needs attention", value: formatCount(TOTALS.atRisk + TOTALS.blocked), icon: TriangleAlert, text: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Unscheduled", value: formatCount(TOTALS.unscheduled), icon: CircleDashed, text: "text-zinc-400", bg: "bg-white/5" },
  ];

  return (
    <div className="flex min-h-dvh bg-zinc-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <ChartNoAxesGantt className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Schedule</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 font-[family-name:var(--font-display-mono)] sm:text-3xl">
            Deployment schedule
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-400">
            Every install, retrofit, and audit job across your field crews for the next eight weeks.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-xl border border-white/10 bg-zinc-900 p-4">
                  <dt className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${card.bg}`}>
                      <Icon className={`h-4 w-4 ${card.text}`} aria-hidden="true" />
                    </span>
                    {card.label}
                  </dt>
                  <dd className={`mt-2 text-2xl font-semibold tabular-nums ${card.text}`}>{card.value}</dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <QueueRail jobs={QUEUE_JOBS} pinnedId={pinnedId} onPin={handlePin} />

            <div className="min-w-0 flex-1 space-y-6">
              <DetailStrip job={pinnedJob} onClear={() => setPinnedId(null)} />

              <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-50">Timeline</h2>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {viewMode === "month" ? "8-week view, Aug 31–Oct 25" : "2-week zoom, Sep 14–Sep 27"}
                    </p>
                  </div>
                  <div className="flex overflow-hidden rounded-lg border border-white/10 text-sm" role="group" aria-label="Timeline zoom">
                    {(["week", "month"] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setViewMode(mode)}
                        aria-pressed={viewMode === mode}
                        className={`px-3 py-1.5 font-medium capitalize transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                          viewMode === mode ? "bg-cyan-500/20 text-cyan-300" : "bg-transparent text-zinc-400 hover:bg-white/5"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <GanttChart jobs={SCHEDULED_JOBS} viewMode={viewMode} pinnedId={pinnedId} onPin={handlePin} />
                </div>
              </div>

              <CrewTable crews={CREWS} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} jobs={JOBS} onClose={() => setPaletteOpen(false)} onSelect={handlePin} />
    </div>
  );
}
