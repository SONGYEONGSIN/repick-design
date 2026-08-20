"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Check, Equal, Sigma } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DrillPanel from "./DrillPanel";
import LedgerTable from "./LedgerTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TrendChart from "./TrendChart";
import WaterfallChart, { WaterfallRows } from "./WaterfallChart";
import type { BasisId, DriverId } from "./data";
import { BASES, BRIDGES, formatCompactUSD, formatPct, formatSignedUSD, formatUSD } from "./data";
import {
  ACCENT_SUBTLE,
  ACCENT_TEXT,
  APP_BG,
  BORDER,
  CHART,
  NUM,
  SURFACE_INSET,
  TEXT_AUX,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  cx,
} from "./tokens";
import { Badge, Card, CardHead, DirectionMark, Eyebrow, Segmented } from "./ui";

const BASIS_OPTIONS = BASES.map((b) => ({ id: b.id, label: b.label }));

function LegendKey({ swatch, label, sublabel, Icon }: { swatch: string; label: string; sublabel: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
      <span aria-hidden="true" className="inline-block h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: swatch }} />
      {Icon ? <Icon size={11} strokeWidth={2.5} aria-hidden="true" className={TEXT_SECONDARY} /> : null}
      {label}
      <span className={cx("font-normal", TEXT_AUX)}>{sublabel}</span>
    </span>
  );
}

export default function TrusslineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [basisId, setBasisId] = useState<BasisId>("mom");
  const [selectedId, setSelectedId] = useState<DriverId>(BRIDGES.mom.largest.id);
  const [trendIndex, setTrendIndex] = useState(BRIDGES.mom.basis.series.length - 1);

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

  const bridge = BRIDGES[basisId];
  const basis = bridge.basis;
  const selected = bridge.rows.find((r) => r.id === selectedId) ?? bridge.largest;
  const isLargest = selected.id === bridge.largest.id;
  const clampedTrend = Math.min(basis.series.length - 1, Math.max(0, trendIndex));

  const changeBasis = useCallback((next: BasisId) => {
    setBasisId(next);
    setTrendIndex(BRIDGES[next].basis.series.length - 1);
  }, []);

  const pickFromPalette = useCallback(
    (nextBasis: BasisId, driver: DriverId, target: "bridge" | "drill") => {
      changeBasis(nextBasis);
      setSelectedId(driver);
      document.getElementById(target === "drill" ? "drill-card" : "waterfall-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [changeBasis],
  );

  return (
    <div className={cx("flex min-h-dvh", APP_BG, TEXT_PRIMARY)}>
      {/* The host document's own background follows the OS colour scheme; this route is committed
          to dark, so a fixed ground behind the shell keeps overscroll and any sub-viewport gap
          from flashing white. */}
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {/* ---------------------------------------------------------------- page header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Reconciliation · ${basis.full}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Cloud spend bridge</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                {`Every dollar between ${basis.openingLabel.toLowerCase()} and ${basis.closingLabel.toLowerCase()} is assigned to exactly one of eight drivers. Select a bar to decompose it.`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Segmented options={BASIS_OPTIONS} value={basisId} onChange={changeBasis} ariaLabel="Comparison basis" />
            </div>
          </div>

          {/* ------------------------------------------------------------------ KPI strip */}
          <h2 className="sr-only font-medium">Reconciliation summary</h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className={cx("rounded-2xl border p-4", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Opening balance</dt>
              <dd className="mt-1.5">
                <span className={cx("block text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatUSD(bridge.opening)}</span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>{basis.openingLabel}</span>
              </dd>
            </div>

            <div className={cx("rounded-2xl border p-4", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Net movement</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <DirectionMark amount={bridge.net} size={18} />
                  {formatSignedUSD(bridge.net)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>
                  {`${formatPct((Math.abs(bridge.net) / bridge.opening) * 100)} of opening · ${formatUSD(bridge.grossVariance)} gross`}
                </span>
              </dd>
            </div>

            <div className={cx("rounded-2xl border p-4", "border-lime-400/30 bg-lime-400/[0.06]")}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", ACCENT_TEXT)}>Closing balance</dt>
              <dd className="mt-1.5">
                <span
                  className={cx("block text-[26px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {formatUSD(bridge.closing)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_SECONDARY)}>{basis.closingLabel}</span>
              </dd>
            </div>

            <div className={cx("rounded-2xl border p-4", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{isLargest ? "Largest mover" : "Selected driver"}</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-lg font-semibold leading-tight", NUM, TEXT_PRIMARY)}>
                  <DirectionMark amount={selected.amount} size={15} />
                  {formatSignedUSD(selected.amount)}
                </span>
                <span className={cx("mt-1 block truncate text-xs font-medium", TEXT_SECONDARY)}>{selected.label}</span>
                <span className={cx("mt-1 block text-[11px] font-normal", TEXT_AUX)}>{`${formatPct(selected.share)} of gross variance`}</span>
              </dd>
            </div>
          </dl>

          {/* ------------------------------------------------------------------- waterfall */}
          <Card id="waterfall-card" className="mt-4">
            <CardHead
              title="Variance bridge"
              Icon={Sigma}
              hint={`${basis.openingLabel} → ${basis.closingLabel}. Eight signed drivers, each printed with its own arrow, value and running total. Click or tab to a bar; arrow keys walk the bridge.`}
              action={
                <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", bridge.balanced ? ACCENT_SUBTLE : cx(BORDER, TEXT_PRIMARY))}>
                  {bridge.balanced ? <Check size={12} aria-hidden="true" strokeWidth={2.5} /> : <Equal size={12} aria-hidden="true" />}
                  {bridge.balanced ? "Balanced" : "Out of balance"}
                </span>
              }
            />

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <LegendKey swatch={CHART.balance} label="Balance" sublabel="opening / closing" />
              <LegendKey swatch={CHART.increase} label="Increase" sublabel="adds to spend" Icon={ArrowUp} />
              <LegendKey swatch={CHART.decrease} label="Decrease" sublabel="removes spend" Icon={ArrowDown} />
              <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", TEXT_SECONDARY)}>
                <span aria-hidden="true" className="inline-block h-0.5 w-6" style={{ backgroundImage: `repeating-linear-gradient(to right, ${CHART.connector} 0 4px, transparent 4px 7px)` }} />
                Running total
              </span>
            </div>

            <div className="mt-2 hidden lg:block">
              <WaterfallChart bridge={bridge} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="mt-3 lg:hidden">
              <WaterfallRows bridge={bridge} selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            <div className={cx("mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t pt-3", BORDER)}>
              <p className={cx("text-[11px] font-normal", TEXT_AUX)}>
                {`Value axis begins below the lowest running total (${formatCompactUSD(bridge.opening)} opening) rather than at zero, the standard bridge convention — balance columns are truncated, contribution bars are to scale.`}
              </p>
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <Badge Icon={ArrowDown}>{`${bridge.rows.filter((r) => r.direction === "decrease").length} decreases`}</Badge>
                <Badge Icon={ArrowUp}>{`${bridge.rows.filter((r) => r.direction === "increase").length} increases`}</Badge>
                <Badge>{`Gross ${formatUSD(bridge.grossVariance)}`}</Badge>
              </div>
            </div>

            <p aria-live="polite" className="sr-only">
              {`${selected.label} selected. ${formatSignedUSD(selected.amount)}, running total ${formatUSD(selected.runningTotal)}.`}
            </p>
          </Card>

          {/* ------------------------------------------------------- ledger + decomposition */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 2xl:col-span-7">
              <LedgerTable bridge={bridge} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="col-span-12 min-w-0 2xl:col-span-5">
              <DrillPanel bridge={bridge} row={selected} />
            </div>
          </div>

          {/* ----------------------------------------------------------------------- trend */}
          <Card className="mt-4">
            <CardHead
              title="Spend across periods"
              hint="Actual against plan for every period in the window. Focus the plot and use the arrow keys, Home or End to move the crosshair."
              action={
                <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", BORDER, SURFACE_INSET, TEXT_AUX)}>
                  {`${basis.series.length} ${basis.unitNoun}s`}
                </span>
              }
            />
            <div className="mt-3">
              <TrendChart series={basis.series} caption={basis.seriesCaption} activeIndex={clampedTrend} onActiveIndexChange={setTrendIndex} />
            </div>
          </Card>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onPick={pickFromPalette} onBasis={changeBasis} /> : null}
    </div>
  );
}
