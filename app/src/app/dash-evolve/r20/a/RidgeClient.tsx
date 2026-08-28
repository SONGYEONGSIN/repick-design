"use client";

import { AlertTriangle, Grid3x3, TrendingUp, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import CohortMatrix, { type Metric } from "./CohortMatrix";
import CommandPalette from "./CommandPalette";
import SegmentTable from "./SegmentTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AT_RISK_COUNT, COHORT_ROWS, NET_LOGO_RETENTION, TOTAL_ACTIVE_NOW, TOTAL_MRR_RETAINED, TOTAL_STARTING, formatInt, formatPct, formatUsd } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

const METRIC_OPTIONS: { id: Metric; label: string }[] = [
  { id: "pct", label: "Logo %" },
  { id: "revenuePct", label: "Revenue %" },
];

export default function RidgeClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [metric, setMetric] = useState<Metric>("pct");
  const [baselineId, setBaselineId] = useState<string | null>(null);

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

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Retention · ${COHORT_ROWS.length} monthly cohorts`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Cohort retention matrix</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Every row is a signup month; every column is a month since signup. Pin a row to rewrite the grid onto a relative baseline — nothing else on this page moves.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Retention summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Net logo retention</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <TrendingUp size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatPct(NET_LOGO_RETENTION, 1)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`weighted across ${COHORT_ROWS.length} cohorts at their latest month`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Active accounts</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Users size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(TOTAL_ACTIVE_NOW)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`of ${formatInt(TOTAL_STARTING)} ever onboarded`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>MRR retained</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Wallet size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatUsd(TOTAL_MRR_RETAINED)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>including retained expansion revenue</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", AT_RISK_COUNT > 0 ? "border-rose-800/50 bg-rose-950/30" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", AT_RISK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>Cohorts at risk</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={AT_RISK_COUNT > 0 ? "text-rose-400" : TEXT_AUX} />
                  {formatInt(AT_RISK_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", AT_RISK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>below 60% retained</span>
              </dd>
            </div>
          </dl>

          <Card id="matrix-card" className="mt-4">
            <CardHead
              title="Retention grid"
              Icon={Grid3x3}
              hint="Pin a row (click its label) to rewrite the whole grid onto a percentage-points-vs-baseline scale. Hover or focus any cell for its exact reading."
              action={<Segmented options={METRIC_OPTIONS} value={metric} onChange={setMetric} ariaLabel="Retention metric" />}
            />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <LegendKey swatch="#3f3f46" label="Weak" />
              <LegendKey swatch="#52525b" label="Watch" />
              <LegendKey swatch="#9f1239" label="Healthy" />
              <LegendKey swatch="#be123c" label="Excellent" />
            </div>
            <div className="mt-3">
              <CohortMatrix metric={metric} baselineId={baselineId} onSetBaseline={setBaselineId} />
            </div>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHead title="Cohorts" hint="Every cohort with starting size, current standing, and retained monthly revenue — sortable, filterable, independent of the grid above." />
              <div className="mt-3">
                <SegmentTable />
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onPinCohort={(id) => {
            setBaselineId(id);
            document.getElementById("matrix-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : null}
    </div>
  );
}

function LegendKey({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_AUX)}>
      <span aria-hidden="true" className="inline-block h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: swatch }} />
      {label}
    </span>
  );
}
