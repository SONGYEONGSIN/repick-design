"use client";

import { Clock, MousePointerClick, TrendingDown, Users } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import FunnelCanvas from "./FunnelCanvas";
import SegmentTable from "./SegmentTable";
import Sidebar from "./Sidebar";
import StageDetailPanel from "./StageDetailPanel";
import Topbar from "./Topbar";
import {
  AVG_TIME_TO_PURCHASE,
  formatCount,
  formatPct,
  PERIODS,
  STAGES,
  STAGE_COUNTS,
  transitionsForPeriod,
  type DeviceId,
  type PeriodId,
  type StageId,
} from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, EyebrowLabel, SegmentedControl } from "./ui";

export default function FunnelClient() {
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [device, setDevice] = useState<DeviceId>("all");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
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

  function selectStageById(id: StageId) {
    const idx = STAGES.findIndex((s) => s.id === id);
    if (idx >= 0) setSelectedIdx(idx);
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
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Checkout Funnel</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Fernwell Outfitters · Web checkout · 7 tracked steps</p>
              </div>
            </header>

            <KpiStrip period={period} />

            <Card className="min-w-0" padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 id="funnel-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
                    Visit-to-purchase funnel
                  </h2>
                  <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
                    Band width encodes sessions remaining · select a stage to sync detail and segments below
                  </p>
                </div>
                <SegmentedControl ariaLabel="Funnel period" options={PERIODS} value={period} onChange={setPeriod} />
              </div>
              <div className={cx("border-t p-3 sm:p-4", BORDER)} aria-labelledby="funnel-heading">
                <FunnelCanvas period={period} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-4">
                <StageDetailPanel selectedIdx={selectedIdx} period={period} />
              </div>
              <div className="min-w-0 xl:col-span-8">
                <SegmentTable
                  period={period}
                  device={device}
                  onDeviceChange={setDevice}
                  selectedSegmentId={selectedSegmentId}
                  onSelectSegment={setSelectedSegmentId}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectStage={selectStageById}
          onSelectSegment={setSelectedSegmentId}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- KPI strip */

function KpiStrip({ period }: { period: PeriodId }) {
  const counts = STAGE_COUNTS[period];
  const totalVisits = counts[0];
  const totalPurchases = counts[counts.length - 1];
  const overallConversion = (totalPurchases / totalVisits) * 100;

  const transitions = transitionsForPeriod(period);
  const worst = transitions.reduce((max, t) => (t.dropPct > max.dropPct ? t : max), transitions[0]);
  const worstLabel = `${STAGES[worst.fromIdx].label} → ${STAGES[worst.toIdx].label}`;

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <EyebrowLabel>Overall conversion</EyebrowLabel>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse motion-reduce:animate-none" />
              Live
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className={cx("text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl", TEXT_PRIMARY)}>
              {formatPct(overallConversion)}
            </span>
            <span className={cx("text-sm", TEXT_CAPTION)}>site visit → order placed</span>
          </div>
          <p className={cx("mt-1 text-xs tabular-nums", TEXT_CAPTION)}>
            {formatCount(totalPurchases)} orders from {formatCount(totalVisits)} sessions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SubStat icon={Users} label="Total sessions" value={formatCount(totalVisits)} />
          <Divider />
          <SubStat icon={TrendingDown} label="Biggest drop-off" value={worstLabel} valueClass="text-rose-700 dark:text-rose-300 text-sm" caption={formatPct(worst.dropPct)} />
          <Divider />
          <SubStat icon={Clock} label="Avg time to purchase" value={AVG_TIME_TO_PURCHASE[period]} />
          <Divider />
          <SubStat icon={MousePointerClick} label="Steps tracked" value={String(STAGES.length)} />
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
  icon: typeof Users;
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
