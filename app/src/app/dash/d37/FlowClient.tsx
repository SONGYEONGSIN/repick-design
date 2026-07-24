"use client";

import { Handshake, TrendingDown, TrendingUp, Waves } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import FlowTable from "./FlowTable";
import SankeyFlow from "./SankeyFlow";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { computeFlow, formatCount, formatPct, formatUsd, METRICS, PERIODS, type FlowGraph, type MetricId, type PeriodId } from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, EyebrowLabel, SegmentedControl } from "./ui";

export default function FlowClient() {
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [metric, setMetric] = useState<MetricId>("customers");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const graph = useMemo(() => computeFlow(period), [period]);

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

  function selectFromPalette(id: string) {
    setSelectedId(id);
    setFocusToken((v) => v + 1);
  }

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Revenue Attribution Flow</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Solstice Robotics · New accounts · channel → plan tier → 90-day outcome</p>
              </div>
            </header>

            <KpiStrip graph={graph} metric={metric} />

            <Card className="min-w-0" padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 id="flow-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
                    New-account flow, channel to outcome
                  </h2>
                  <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
                    Ribbon width encodes {metric === "customers" ? "customer count" : "new MRR at signup"} · click a node or ribbon to inspect it
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SegmentedControl ariaLabel="Flow metric" options={METRICS} value={metric} onChange={setMetric} size="sm" />
                  <SegmentedControl ariaLabel="Flow period" options={PERIODS} value={period} onChange={setPeriod} />
                </div>
              </div>
              <div className={cx("border-t p-3 sm:p-4", BORDER)} aria-labelledby="flow-heading">
                <SankeyFlow graph={graph} metric={metric} selectedId={selectedId} onSelect={setSelectedId} focusToken={focusToken} />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-4">
                <DetailPanel graph={graph} metric={metric} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
              <div className="min-w-0 xl:col-span-8">
                <FlowTable graph={graph} metric={metric} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={selectFromPalette} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------- KPI strip */

function KpiStrip({ graph, metric }: { graph: FlowGraph; metric: MetricId }) {
  const retained = graph.outcomes.find((o) => o.id === "retained")!;
  const churned = graph.outcomes.find((o) => o.id === "churned")!;
  const topChannel = [...graph.channels].sort((a, b) => b.customers - a.customers)[0];
  const enterprise = graph.tiers.find((t) => t.id === "enterprise")!;

  const retainedPct = (retained.customers / graph.totalCustomers) * 100;
  const churnedPct = (churned.customers / graph.totalCustomers) * 100;
  const avgMrrPerAccount = graph.totalMrr / graph.totalCustomers;

  const heroValue = metric === "customers" ? formatCount(graph.totalCustomers) : formatUsd(graph.totalMrr);
  const heroCaption = metric === "customers" ? "new accounts this period" : "new MRR originated this period";

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <EyebrowLabel>Total new flow</EyebrowLabel>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 dark:text-sky-400">
              <Waves size={11} aria-hidden="true" className="motion-safe:animate-pulse motion-reduce:animate-none" />
              Live
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className={cx("text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl", TEXT_PRIMARY)}>{heroValue}</span>
            <span className={cx("text-sm", TEXT_CAPTION)}>{heroCaption}</span>
          </div>
          <p className={cx("mt-1 text-xs tabular-nums", TEXT_CAPTION)}>
            {formatUsd(avgMrrPerAccount)} avg new MRR per account · {graph.channels.length} channels · {graph.tiers.length} tiers · {graph.outcomes.length} outcomes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SubStat icon={Handshake} label="Top channel" value={topChannel.label} caption={`${formatCount(topChannel.customers)} accts`} />
          <Divider />
          <SubStat icon={TrendingUp} label="Retained at 90d" value={formatPct(retainedPct)} valueClass="text-emerald-700 dark:text-emerald-300" />
          <Divider />
          <SubStat icon={TrendingDown} label="Churned at 90d" value={formatPct(churnedPct)} valueClass="text-rose-700 dark:text-rose-300" />
          <Divider />
          <SubStat icon={Waves} label="Enterprise share" value={formatPct((enterprise.customers / graph.totalCustomers) * 100)} />
        </div>
      </div>
    </Card>
  );
}

function Divider() {
  return <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />;
}

function SubStat({
  icon: Icon,
  label,
  value,
  valueClass,
  caption,
}: {
  icon: typeof Waves;
  label: string;
  value: string;
  valueClass?: string;
  caption?: string;
}) {
  return (
    <div className="min-w-0 max-w-[11rem]">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <EyebrowLabel>{label}</EyebrowLabel>
      </div>
      <p className={cx("mt-0.5 truncate font-semibold tabular-nums", valueClass ?? cx("text-xl", TEXT_PRIMARY))}>{value}</p>
      {caption ? <p className={cx("text-xs tabular-nums", TEXT_CAPTION)}>{caption}</p> : null}
    </div>
  );
}
