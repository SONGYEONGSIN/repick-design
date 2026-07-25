"use client";

import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import Card from "./components/Card";
import DetailHeader from "./components/DetailHeader";
import ExecutionChart from "./components/ExecutionChart";
import ExecutionLogTable from "./components/ExecutionLogTable";
import HeroStats from "./components/HeroStats";
import scrollStyles from "./components/scroll.module.css";
import WorkflowListRail from "./components/WorkflowListRail";
import { WORKFLOW_BY_ID, WORKFLOWS, workflowPeriodSeries, type Period } from "./lib/data";

const PERIOD_LABEL: Record<Period, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

export default function DashboardClient() {
  const [selectedId, setSelectedId] = useState<string>(WORKFLOWS[0].id);
  const [period, setPeriod] = useState<Period>("24h");
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const workflow = WORKFLOW_BY_ID.get(selectedId) ?? WORKFLOWS[0];
  const series = useMemo(() => workflowPeriodSeries(workflow.id, period), [workflow.id, period]);
  const periodLabel = PERIOD_LABEL[period];

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileListOpen(false);
  }

  return (
    <AppShell>
      {/* A single accessible page title, independent of the visual order of the master (list) and detail columns. */}
      <h1 className="sr-only">Workflow — {workflow.name}</h1>

      <div className="flex h-full min-h-0 flex-1 flex-col lg:flex-row">
        <WorkflowListRail
          selectedId={workflow.id}
          onSelect={handleSelect}
          open={mobileListOpen}
          onClose={() => setMobileListOpen(false)}
        />

        <div className={`min-h-0 min-w-0 flex-1 overflow-y-auto ${scrollStyles.thinScroll}`}>
          <DetailHeader
            workflow={workflow}
            period={period}
            onPeriodChange={setPeriod}
            onOpenList={() => setMobileListOpen(true)}
            listCount={WORKFLOWS.length}
          />

          <HeroStats workflow={workflow} />

          <div className="px-4 py-5 sm:px-6">
            <Card title="Execution trend" description={`${periodLabel} successful/failed executions`} headingId="exec-trend-heading">
              <ExecutionChart series={series} periodLabel={periodLabel} />
            </Card>
          </div>

          <section aria-labelledby="execution-log-heading" className="min-w-0 px-4 pb-10 sm:px-6">
            <h2 id="execution-log-heading" className="text-sm font-semibold text-zinc-100">
              Execution history
            </h2>
            <p className="mt-0.5 truncate text-xs text-zinc-500">Recent runs of {workflow.name} — click a header to sort</p>
            <div className="mt-3">
              <ExecutionLogTable workflowId={workflow.id} />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
