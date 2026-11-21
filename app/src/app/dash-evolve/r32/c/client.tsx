"use client";

import { useEffect, useMemo, useState } from "react";
import { Workflow } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import ProcessGraph from "./ProcessGraph";
import DetailPanel from "./DetailPanel";
import StageTable from "./StageTable";
import Filmstrip, { type PathFilter } from "./Filmstrip";
import {
  PERIODS,
  statsFor,
  bottleneckStageId,
  pathById,
  pathSharePct,
  formatCount,
  formatPct,
  formatDays,
  type PeriodId,
  type Selection,
  type StageId,
} from "./data";
import { cx, FOCUS_RING, SegmentedControl } from "./ui";

const PERIOD_OPTIONS = PERIODS.map((p) => ({ id: p.id, label: p.label }));
const STAGE_TABLE_ID = "stage-detail-table";

export default function ReturnFlowConsole() {
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [selection, setSelection] = useState<Selection>({ kind: "stage", id: "escalated" });
  const [pathFilter, setPathFilter] = useState<PathFilter>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function pinStage(id: StageId) {
    setSelection((current) => (current?.kind === "stage" && current.id === id ? null : { kind: "stage", id }));
  }
  function pinPath(id: string) {
    setSelection((current) => (current?.kind === "path" && current.id === id ? null : { kind: "path", id }));
  }

  const periodDef = useMemo(() => PERIODS.find((p) => p.id === period) ?? PERIODS[0], [period]);
  const bottleneckId = useMemo(() => bottleneckStageId(period), [period]);
  const bottleneckStats = useMemo(() => statsFor(bottleneckId, period), [bottleneckId, period]);
  const requestedStats = useMemo(() => statsFor("requested", period), [period]);
  const refundedStats = useMemo(() => statsFor("refunded", period), [period]);
  const returnedStats = useMemo(() => statsFor("returned_seller", period), [period]);
  const topPath = pathById("standard");
  const topPathShare = pathSharePct(topPath, period);
  const totalN = requestedStats.inbound;

  const summary = `${bottleneckStats.stage.label} is the bottleneck: cases wait an average of ${formatDays(
    bottleneckStats.dwellDays ?? 0,
  )} there and ${formatCount(bottleneckStats.pooled)} are pooled awaiting review right now. ${formatPct(topPathShare, 0)} of cases still follow the standard approval path straight through.`;

  return (
    <div className="flex min-h-dvh bg-zinc-50">
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>

        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

          <main id="main-content" tabIndex={-1} className={cx("min-w-0 flex-1 px-4 py-6 outline-offset-[-2px] sm:px-6 lg:px-8 lg:py-8", FOCUS_RING)}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Workflow aria-hidden className="h-4 w-4" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">Return flow</span>
                </div>
                <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-zinc-900 [font-family:var(--font-display-mono)] sm:text-[26px]">Loopback — returns &amp; refund flow</h1>
                <p className="mt-1 max-w-2xl text-[13px] text-zinc-500">
                  How {formatCount(refundedStats.inbound + returnedStats.inbound)} of {formatCount(totalN)} return cases actually moved through intake, inspection and escalation — including the
                  loops and disputes a simple funnel can&apos;t show.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[11.5px] text-zinc-500">{periodDef.range}</span>
                <SegmentedControl label="Reporting window" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Cases entered <span className="ml-1 font-semibold tabular-nums text-zinc-900">{formatCount(totalN)}</span>
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Refunded <span className="ml-1 font-semibold tabular-nums text-zinc-900">{formatPct((refundedStats.inbound / totalN) * 100, 0)}</span>
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Returned to seller <span className="ml-1 font-semibold tabular-nums text-zinc-900">{formatPct((returnedStats.inbound / totalN) * 100, 0)}</span>
              </span>
              <span className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-zinc-800">
                Escalated backlog <span className="ml-1 font-semibold tabular-nums text-zinc-900">{formatCount(bottleneckStats.pooled)}</span>
              </span>
            </div>

            <section aria-labelledby="process-map-heading" className="mt-6 min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 id="process-map-heading" className="text-[13px] font-semibold text-zinc-900">
                    Process map
                  </h2>
                  <p className="mt-0.5 max-w-2xl text-[12px] text-zinc-500">{summary}</p>
                </div>
                <a href={`#${STAGE_TABLE_ID}`} className="shrink-0 rounded-md text-[11.5px] text-zinc-500 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-700">
                  Skip graph to table
                </a>
              </div>
              <div className="mt-4">
                <ProcessGraph period={period} selection={selection} onPinStage={pinStage} />
              </div>
            </section>

            {/* The detail panel sits directly below the graph rather than squeezed
                into a fixed-width side rail — that keeps the graph's own scale
                consistent and legible across the whole 1280–1920 range instead of
                shrinking it to make room for a companion column. */}
            <div className="mt-4 lg:max-w-md">
              <DetailPanel period={period} selection={selection} onClear={() => setSelection(null)} />
            </div>

            <section aria-labelledby="stage-table-heading" className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-5">
              <h2 id="stage-table-heading" className="text-[13px] font-semibold text-zinc-900">
                Stage detail
              </h2>
              <p className="mt-0.5 text-[12px] text-zinc-500">A sortable, screen-reader-friendly view of the same stage volumes and dwell times shown on the map above.</p>
              <StageTable id={STAGE_TABLE_ID} period={period} selection={selection} onPinStage={pinStage} />
            </section>

            <section aria-labelledby="filmstrip-heading" className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04)] sm:p-5">
              <Filmstrip period={period} selection={selection} filter={pathFilter} onChangeFilter={setPathFilter} onPinPath={pinPath} />
            </section>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} period={period} onClose={() => setPaletteOpen(false)} onPinStage={pinStage} onPinPath={pinPath} />
    </div>
  );
}
