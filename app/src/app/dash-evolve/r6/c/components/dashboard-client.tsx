"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { HeroControlBar } from "./hero-control-bar";
import { RetentionMatrix } from "./retention-matrix";
import { CohortDetailPanel } from "./cohort-detail-panel";
import { getDataset, type DefinitionId, type MetricId } from "../lib/data";

export function DashboardClient() {
  const [definition, setDefinition] = useState<DefinitionId>("weekly");
  const [metric, setMetric] = useState<MetricId>("retention");
  const dataset = getDataset(definition);
  const [selectedCohortId, setSelectedCohortId] = useState<string>(dataset.cohorts[0].id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  const selectedCohort =
    dataset.cohorts.find((c) => c.id === selectedCohortId) ?? dataset.cohorts[0];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setPaletteOpen(true)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <h1 className="text-[22px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              코호트 리텐션
            </h1>
            <p className="mt-1 max-w-2xl text-[13px] text-zinc-500 dark:text-zinc-400">
              가입 코호트별로 시간 경과에 따른 재방문율을 추적합니다. 행은 가입 시점, 열은 가입 후
              경과 기간입니다.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-12">
                <h2 className="sr-only">리텐션 개요</h2>
                <HeroControlBar
                  dataset={dataset}
                  metric={metric}
                  definition={definition}
                  onMetricChange={setMetric}
                  onDefinitionChange={setDefinition}
                />
              </div>

              <div className="min-w-0 lg:col-span-12">
                <section
                  aria-labelledby="matrix-heading"
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6"
                >
                  <h2
                    id="matrix-heading"
                    className="mb-4 text-[15px] font-bold text-zinc-900 dark:text-zinc-50"
                  >
                    코호트 리텐션 매트릭스
                  </h2>
                  <RetentionMatrix
                    dataset={dataset}
                    metric={metric}
                    selectedCohortId={selectedCohort.id}
                    onSelectCohort={setSelectedCohortId}
                  />
                </section>
              </div>

              <div className="min-w-0 lg:col-span-12">
                <section
                  aria-labelledby="detail-heading"
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6"
                >
                  <h2
                    id="detail-heading"
                    className="mb-4 text-[15px] font-bold text-zinc-900 dark:text-zinc-50"
                  >
                    선택한 코호트 상세
                  </h2>
                  <CohortDetailPanel cohort={selectedCohort} dataset={dataset} metric={metric} />
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        key={paletteOpen ? "cmdk-open" : "cmdk-closed"}
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSetDefinition={setDefinition}
        onSetMetric={setMetric}
      />
    </div>
  );
}
