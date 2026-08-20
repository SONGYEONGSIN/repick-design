"use client";

/**
 * Backhaul — page shell and the single source of selection state.
 *
 * One stage id and one period id drive the entire page: the funnel band, the stage ledger, the
 * headline stat tiles, the conversion trend, the drop-off breakdown and the held-units table all
 * read from the same two values, so nothing on screen can describe a different stage or a different
 * window than its neighbour. The crosshair index is clamped rather than reset on period change,
 * because the three windows have different point counts.
 */

import { Layers, ListChecks, PackageSearch, Recycle, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import FunnelFlow from "./FunnelFlow";
import Sidebar from "./Sidebar";
import StageInspector from "./StageInspector";
import StageLedger from "./StageLedger";
import Topbar from "./Topbar";
import TrendChart from "./TrendChart";
import UnitsTable from "./UnitsTable";
import type { PeriodId, StageId } from "./data";
import { BRAND, DEFAULT_PERIOD, DEFAULT_STAGE, PERIODS, PIPELINES, buildTrend, fmtInt, fmtPct, fmtUsd, unitsFor } from "./data";
import { APP_BG, BORDER, EYEBROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Card, CardHeader, DeltaChip, Eyebrow, SegmentedControl, StatTile } from "./ui";

export default function ConsoleClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [periodId, setPeriodId] = useState<PeriodId>(DEFAULT_PERIOD);
  const [stageId, setStageId] = useState<StageId>(DEFAULT_STAGE);
  const [crosshair, setCrosshair] = useState<number | null>(null);

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

  const pipeline = PIPELINES[periodId];
  const period = pipeline.period;
  const stage = pipeline.stages.find((s) => s.id === stageId) ?? pipeline.stages[0];
  const units = useMemo(() => unitsFor(stage.id, periodId), [stage.id, periodId]);
  const trend = useMemo(() => buildTrend(periodId, stage.id), [periodId, stage.id]);

  const crosshairIndex = crosshair === null ? null : Math.min(crosshair, trend.length - 1);
  const breachedCount = units.filter((u) => u.sla === "breached").length;
  const heldValue = units.reduce((sum, u) => sum + u.valueUsd, 0);

  return (
    <div className={cx("flex min-h-dvh", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <p aria-live="polite" className="sr-only">
            {stage.name} selected. {fmtInt(stage.entered)} units entered, {fmtPct(stage.passRatePct)} passed through, over the {period.longLabel.toLowerCase()}.
          </p>

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <Eyebrow>{BRAND.tagline}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-wide)" }}>
                Recovery pipeline
              </h1>
              <p className={cx("mt-1 text-sm font-normal", TEXT_CAPTION)}>
                Reno hub · every returned unit from RMA request to sellable stock, {period.longLabel.toLowerCase()}.
              </p>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              <Eyebrow>Window</Eyebrow>
              <SegmentedControl
                ariaLabel="Reporting window — recomputes the funnel, the trend and the held-unit list"
                value={periodId}
                onChange={(id) => setPeriodId(id)}
                options={PERIODS.map((p) => ({ id: p.id, label: p.label }))}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Units into pipeline"
              value={fmtInt(pipeline.intake)}
              Icon={PackageSearch}
              sub={<DeltaChip value={pipeline.intakeDeltaPct} suffix={`vs prior ${period.days} days`} />}
            />
            <StatTile
              label="Units lost in pipeline"
              value={fmtInt(pipeline.totalDropped)}
              Icon={Recycle}
              sub={
                <span className={cx("text-xs font-normal", TEXT_CAPTION)}>
                  <span className={cx("font-medium", NUM, TEXT_SECONDARY)}>{fmtPct(Math.round((pipeline.totalDropped / pipeline.intake) * 1000) / 10)}</span> of
                  intake, across 5 stages
                </span>
              }
            />
            <StatTile
              label="Stage pass rate"
              value={stage.dropped === 0 ? "—" : fmtPct(stage.passRatePct)}
              Icon={Layers}
              emphasis
              sub={
                <span className={cx("text-xs font-normal leading-snug", TEXT_CAPTION)}>
                  {stage.name} · {stage.dropped === 0 ? "terminal stage" : `${fmtPct(stage.dropRatePct)} drop-off`}
                </span>
              }
            />
            <StatTile
              label="Held in this stage"
              value={fmtInt(units.length)}
              Icon={ShieldAlert}
              sub={
                <span className={cx("text-xs font-normal", TEXT_CAPTION)}>
                  <span className={cx("font-medium", NUM, TEXT_SECONDARY)}>{fmtInt(breachedCount)}</span> breaching SLA ·{" "}
                  <span className={cx("font-medium", NUM, TEXT_SECONDARY)}>{fmtUsd(heldValue)}</span> at risk
                </span>
              }
            />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <Card id="funnel-card" className="col-span-12 min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-8">
                <div className="min-w-0 sm:max-w-md">
                  <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Recovery funnel</h2>
                  <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_CAPTION)}>
                    Band width is the share of intake still moving; the hatched wedges are units leaving the pipeline. Select a stage — by click or arrow key — to
                    drive every panel below.
                  </p>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <span className={cx(EYEBROW, TEXT_CAPTION)}>End-to-end recovery</span>
                    <p className={cx("mt-1 text-4xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-wide)" }}>
                      {fmtPct(pipeline.recoveryPct)}
                    </p>
                  </div>
                  <div className={cx("border-l pl-4", BORDER)}>
                    <span className={cx(EYEBROW, TEXT_CAPTION)}>Restocked</span>
                    <p className={cx("mt-1 text-xl font-semibold leading-none", NUM, TEXT_SECONDARY)}>
                      {fmtInt(pipeline.restocked)}
                      <span className={cx("ml-1 text-xs font-normal", TEXT_CAPTION)}>of {fmtInt(pipeline.intake)}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <FunnelFlow stages={pipeline.stages} selectedId={stage.id} onSelect={setStageId} />
              </div>
            </Card>

            <Card id="ledger-card" className="col-span-12 min-w-0 xl:col-span-7">
              <CardHeader title="Stage ledger" Icon={ListChecks} />
              <StageLedger stages={pipeline.stages} selectedId={stage.id} onSelect={setStageId} periodId={periodId} periodLabel={period.longLabel} />
            </Card>

            <Card id="trend-card" className="col-span-12 min-w-0 xl:col-span-5">
              <CardHeader
                title="Conversion over time"
                description={`${stage.name} pass rate against end-to-end recovery, ${period.longLabel.toLowerCase()}.`}
              />
              <div className="mt-4">
                <TrendChart
                  points={trend}
                  activeIndex={crosshairIndex}
                  onActiveIndexChange={setCrosshair}
                  stageName={stage.name}
                  periodLabel={period.longLabel}
                />
              </div>
            </Card>

            <Card id="inspector-card" className="col-span-12 min-w-0">
              <CardHeader title={`Stage inspector — ${stage.name}`} description={stage.blurb} Icon={stage.Icon} />
              <StageInspector stage={stage} units={units} />
            </Card>

            <Card id="units-card" className="col-span-12 min-w-0">
              <CardHeader
                title={`Units held in ${stage.name}`}
                description={`Exceptions waiting on an operator decision in this stage, ${period.longLabel.toLowerCase()}.`}
              />
              <UnitsTable stage={stage} units={units} periodLabel={period.longLabel} />
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectStage={setStageId} /> : null}
    </div>
  );
}
