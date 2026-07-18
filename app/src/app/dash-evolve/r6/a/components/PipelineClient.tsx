"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DagCanvas, { DagLegend } from "./DagCanvas";
import RunHistoryTable from "./RunHistoryTable";
import Sidebar from "./Sidebar";
import StatsRow from "./StatsRow";
import TaskDetailPanel from "./TaskDetailPanel";
import Topbar from "./Topbar";
import { PIPELINE, type RangeId } from "../lib/data";
import { APP_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";
import { Card, CardHeader } from "./ui";

const DEFAULT_TASK_ID = "join_orders_customers";

export default function PipelineClient() {
  const [selectedTaskId, setSelectedTaskId] = useState(DEFAULT_TASK_ID);
  const [range, setRange] = useState<RangeId>("7d");
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

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            <div>
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>
                {PIPELINE.name}
              </h1>
              <p className={cx("mt-0.5 text-sm", NUM, TEXT_CAPTION)}>
                오너 {PIPELINE.owner} · {PIPELINE.schedule} · 런 #2118 진행 중
              </p>
            </div>

            <StatsRow range={range} onRangeChange={setRange} />

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-12 2xl:items-stretch">
              <Card className="min-w-0 2xl:col-span-9" padded={false}>
                <div className="p-4 sm:p-5">
                  <CardHeader
                    title="파이프라인 그래프"
                    description="태스크를 클릭하면 오른쪽 상세 패널과 의존 엣지가 함께 동기화됩니다."
                  />
                  <div className="mt-3">
                    <DagLegend />
                  </div>
                </div>
                <div className="border-t border-zinc-200 px-4 pb-4 pt-4 dark:border-zinc-800 sm:px-5 sm:pb-5">
                  <DagCanvas selectedId={selectedTaskId} onSelect={setSelectedTaskId} />
                </div>
              </Card>

              <TaskDetailPanel selectedId={selectedTaskId} onSelect={setSelectedTaskId} />
            </div>

            <RunHistoryTable range={range} />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectTask={setSelectedTaskId} /> : null}
    </div>
  );
}
