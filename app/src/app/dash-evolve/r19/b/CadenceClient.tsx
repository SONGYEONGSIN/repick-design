"use client";

import { AlertTriangle, CalendarRange, ClipboardList, Gauge, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import GanttChart, { MobileScheduleList } from "./GanttChart";
import OrderTable from "./OrderTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { LINE_BY_ID, SCALES, WORK_ORDERS, deriveSummary, formatInt, formatPct } from "./data";
import type { LineId, ScaleId } from "./data";
import {
  ACCENT_TEXT,
  APP_BG,
  BORDER,
  FOCUS,
  NUM,
  SURFACE_INSET,
  TEXT_AUX,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
} from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

const SCALE_OPTIONS: { id: ScaleId; label: string }[] = (["week", "month", "quarter"] as ScaleId[]).map((id) => ({ id, label: SCALES[id].label }));

export default function CadenceClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scaleId, setScaleId] = useState<ScaleId>("month");
  const [focusLineId, setFocusLineId] = useState<LineId | null>(null);

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

  const scale = SCALES[scaleId];
  // `deriveSummary` is the only place `focusLineId` gets read to produce a VALUE — the KPI strip
  // below only ever sees the resulting `Summary` object, never the raw id, and the ledger table
  // never sees either.
  const summary = deriveSummary(focusLineId);

  const toggleFocusLine = useCallback((id: LineId) => {
    setFocusLineId((cur) => (cur === id ? null : id));
  }, []);

  const focusFromPalette = useCallback((id: LineId) => {
    setFocusLineId(id);
    document.getElementById("roadmap-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className={cx("flex min-h-dvh", APP_BG, TEXT_PRIMARY)}>
      {/* This route commits to a real light theme; a fixed ground behind the shell keeps overscroll
          and any sub-viewport gap from ever flashing the host document's own colour scheme. */}
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {/* ---------------------------------------------------------------- page header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Schedule · ${summary.scopeLabel}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Production line roadmap</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                {`${WORK_ORDERS.length} work orders across six lines, ${scale.fullLabel.toLowerCase()}. Pin a line to bring it to the top and rescope the totals below; the ledger stays independent.`}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------------ KPI strip */}
          <h2 className="sr-only font-medium">Schedule summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Open work orders</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <ClipboardList size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(summary.open)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>{`of ${formatInt(summary.total)} total · ${summary.scopeLabel}`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>On-time rate</dt>
              <dd className="mt-1.5">
                <span className={cx("block text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatPct(summary.onTimeRate)}</span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>{`complete or on track · holds excluded`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", summary.atRiskCount + summary.delayedCount > 0 ? "border-amber-200 bg-amber-50/70" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", summary.atRiskCount + summary.delayedCount > 0 ? "text-amber-800" : TEXT_AUX)}>At risk or delayed</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={summary.atRiskCount + summary.delayedCount > 0 ? "text-amber-700" : TEXT_AUX} />
                  {formatInt(summary.atRiskCount + summary.delayedCount)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", summary.atRiskCount + summary.delayedCount > 0 ? "text-amber-800" : TEXT_AUX)}>
                  {`${summary.atRiskCount} at risk · ${summary.delayedCount} delayed`}
                </span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", summary.utilizationPct > 100 ? "border-amber-200 bg-amber-50/70" : "border-cyan-200 bg-cyan-50/70")}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", summary.utilizationPct > 100 ? "text-amber-800" : ACCENT_TEXT)}>
                {summary.utilizationPct > 100 ? "Line utilization — over capacity" : "Line utilization"}
              </dt>
              <dd className="mt-1.5">
                <span
                  className={cx("flex items-center gap-1.5 text-[26px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  <Gauge size={18} aria-hidden="true" className={summary.utilizationPct > 100 ? "text-amber-700" : "text-cyan-600"} />
                  {formatPct(summary.utilizationPct)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal tabular-nums", summary.utilizationPct > 100 ? "text-amber-800" : "text-cyan-800")}>
                  {`${formatInt(summary.plannedHours)} of ${formatInt(summary.capacityHrs)} hrs planned`}
                </span>
              </dd>
            </div>
          </dl>

          {/* ------------------------------------------------------------------------ roadmap */}
          <Card id="roadmap-card" className="mt-4">
            <CardHead
              title="Line roadmap"
              Icon={CalendarRange}
              hint="Each row is a production line; each bar is a work order sized to its own start and due date. Hover or focus a bar for its detail card and a time-aligned band across every line; arrow keys move between orders and rows."
              action={
                <div className="flex flex-wrap items-center gap-2">
                  {focusLineId ? (
                    <button
                      type="button"
                      onClick={() => setFocusLineId(null)}
                      className={cx("inline-flex h-9 items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-2.5 text-xs font-medium text-cyan-700", TRANSITION, FOCUS, "hover:bg-cyan-100")}
                    >
                      {`Focused: ${LINE_BY_ID[focusLineId].name}`}
                      <X size={12} aria-hidden="true" />
                      <span className="sr-only">Clear line focus</span>
                    </button>
                  ) : null}
                  <Segmented options={SCALE_OPTIONS} value={scaleId} onChange={setScaleId} ariaLabel="Timeline scale" />
                </div>
              }
            />

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <LegendKey swatch="#0e7490" label="On track" />
              <LegendKey swatch="#047857" label="Complete" />
              <LegendKey swatch="#92400e" label="At risk" />
              <LegendKey swatch="#9f1239" label="Delayed" />
              <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_AUX)}>
                <span aria-hidden="true" className="inline-block h-3 w-3 shrink-0 rounded-[3px] border-2 border-dashed border-zinc-600" />
                On hold
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-zinc-200">
              <GanttChart scale={scale} orders={WORK_ORDERS} focusLineId={focusLineId} onToggleFocus={toggleFocusLine} />
              <div className="p-3 lg:hidden">
                <MobileScheduleList orders={WORK_ORDERS} focusLineId={focusLineId} onToggleFocus={toggleFocusLine} />
              </div>
            </div>

            <p className={cx("mt-3 border-t pt-3 text-[11px] font-normal", BORDER, TEXT_AUX)}>
              {`${scale.fullLabel} — window runs ${scale.windowEnd - scale.windowStart} days. Switching scale rescales every bar's pixel position; it never changes which orders exist.`}
            </p>
          </Card>

          {/* --------------------------------------------------------------------------- ledger */}
          <div className="mt-4">
            <OrderTable />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onFocusLine={focusFromPalette} /> : null}
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
