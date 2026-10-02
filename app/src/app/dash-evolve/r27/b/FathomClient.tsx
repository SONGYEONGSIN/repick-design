"use client";

import { AlertTriangle, Flame, Target, Wallet, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DecompTree, { type CompareMode } from "./DecompTree";
import NodeDetailPanel from "./NodeDetailPanel";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TopMovers from "./TopMovers";
import {
  ALL_NODES,
  ANOMALIES,
  ANOMALY_THRESHOLD_PCT,
  TOTAL_BUDGET,
  TOTAL_BUDGET_DELTA_PCT,
  TOTAL_PRIOR_DELTA_PCT,
  TOTAL_SPEND,
  formatPct1,
  formatUsd,
} from "./data";
import { APP_BG, BORDER, DISPLAY_FONT, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, DeltaChip, Eyebrow, Segmented } from "./ui";

const COMPARE_OPTIONS: { id: CompareMode; label: string }[] = [
  { id: "prior", label: "Prior period" },
  { id: "budget", label: "Budget" },
];

const LARGEST_SKU = [...ALL_NODES].filter((n) => n.level === "SKU").sort((a, b) => b.value - a.value)[0];

export default function FathomClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [compareMode, setCompareMode] = useState<CompareMode>("prior");
  // `selectedId` + `focusToken` are the ONE selection thread on this page. They are consumed only
  // by DecompTree (to expand/focus a node) and NodeDetailPanel (to render it). TopMovers below never
  // sees either value — see the comment block at the top of TopMovers.tsx for why.
  const [selectedId, setSelectedId] = useState<string>("us-east-1");
  const [focusToken, setFocusToken] = useState(0);

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

  function selectFromPalette(id: string) {
    setSelectedId(id);
    setFocusToken((t) => t + 1);
  }

  const totalDelta = compareMode === "prior" ? TOTAL_PRIOR_DELTA_PCT : TOTAL_BUDGET_DELTA_PCT;

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Cost intelligence · September 2026`}</Eyebrow>
              <h1 style={DISPLAY_FONT} className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>
                Cloud spend root cause
              </h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Drill from region down to SKU — every node always shows its own spend and its share of its parent, so you never have to hover to see where the money went.
              </p>
            </div>
            <Segmented options={COMPARE_OPTIONS} value={compareMode} onChange={setCompareMode} ariaLabel="Compare tree values against" />
          </div>

          <h2 className="sr-only font-medium">Spend summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Total cloud spend</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Wallet size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatUsd(TOTAL_SPEND)}
                </span>
                <span className="mt-2 flex items-center gap-1.5">
                  <DeltaChip pct={totalDelta} />
                  <span className={cx("text-[11px] font-normal", TEXT_MUTED)}>{compareMode === "prior" ? "vs. last month" : "vs. plan"}</span>
                </span>
              </dd>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", TOTAL_BUDGET_DELTA_PCT > 0 ? "border-rose-200 bg-rose-50" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TOTAL_BUDGET_DELTA_PCT > 0 ? "text-rose-700" : TEXT_MUTED)}>Monthly budget</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Target size={17} aria-hidden="true" className={TOTAL_BUDGET_DELTA_PCT > 0 ? "text-rose-600" : TEXT_AUX} />
                  {formatUsd(TOTAL_BUDGET)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TOTAL_BUDGET_DELTA_PCT > 0 ? "text-rose-700" : TEXT_MUTED)}>
                  {`Actual spend is ${formatPct1(TOTAL_BUDGET_DELTA_PCT)} ${TOTAL_BUDGET_DELTA_PCT > 0 ? "over" : "under"} plan`}
                </span>
              </dd>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", ANOMALIES.length > 0 ? "border-rose-200 bg-rose-50" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", ANOMALIES.length > 0 ? "text-rose-700" : TEXT_MUTED)}>Anomalies flagged</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  {ANOMALIES.length > 0 ? <Flame size={17} aria-hidden="true" className="text-rose-600" /> : <AlertTriangle size={17} aria-hidden="true" className={TEXT_AUX} />}
                  {ANOMALIES.length}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", ANOMALIES.length > 0 ? "text-rose-700" : TEXT_MUTED)}>{`Line items ≥ +${ANOMALY_THRESHOLD_PCT}% vs. prior period`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Largest single SKU</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Zap size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatUsd(LARGEST_SKU?.value ?? 0)}
                </span>
                <span className={cx("mt-2 block truncate text-[11px] font-normal", TEXT_MUTED)}>{LARGEST_SKU?.label}</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 lg:col-span-8">
              <Card className="flex h-full flex-col">
                <CardHead
                  title="Cost decomposition"
                  hint={"Region › Service › Resource type › SKU. Click a node to inspect it on the right; use the caret or Arrow keys to drill in."}
                />
                <div className="mt-3">
                  <DecompTree selectedId={selectedId} onSelect={setSelectedId} compareMode={compareMode} focusToken={focusToken} />
                </div>
              </Card>
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-4">
              <NodeDetailPanel selectedId={selectedId} compareMode={compareMode} />
            </div>
          </div>

          <div className="mt-4">
            <TopMovers />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={selectFromPalette} /> : null}
    </div>
  );
}
