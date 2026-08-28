"use client";

import { AlertTriangle, FileWarning, Gauge, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import CaseList from "./CaseList";
import CommandPalette from "./CommandPalette";
import FindingsTable from "./FindingsTable";
import RiskRadar from "./RiskRadar";
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";
import Topbar from "./Topbar";
import { AVG_SCORE, CASES, ESCALATED_COUNT, OPEN_COUNT, OPEN_FINDINGS_COUNT, formatInt } from "./data";
import { APP_BG, BORDER, NUM, SEVERITY_BADGE, SEVERITY_LABEL, STATUS_BADGE, STATUS_LABEL, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, type CaseStatus, cx } from "./tokens";
import { Badge, Card, CardHead, Eyebrow } from "./ui";

export default function VantageClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [selectedId, setSelectedId] = useState(CASES[0].id);

  const selected = CASES.find((c) => c.id === selectedId) ?? CASES[0];

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
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Vendor risk · ${formatInt(OPEN_COUNT)} open cases`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Case register</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Select a case on the left to open its risk profile — the detail pane is the sole consumer of that selection, nothing else on this page reacts to it.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Register summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Open cases</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <ShieldAlert size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(OPEN_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`of ${formatInt(CASES.length)} in the register`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", ESCALATED_COUNT > 0 ? "border-rose-200 bg-rose-50" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", ESCALATED_COUNT > 0 ? "text-rose-700" : TEXT_MUTED)}>Escalated</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={ESCALATED_COUNT > 0 ? "text-rose-600" : TEXT_AUX} />
                  {formatInt(ESCALATED_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", ESCALATED_COUNT > 0 ? "text-rose-700" : TEXT_MUTED)}>referred to legal or InfoSec</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Avg risk score</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Gauge size={17} aria-hidden="true" className={TEXT_AUX} />
                  {AVG_SCORE}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>0 = highest risk, 100 = lowest</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Open findings</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <FileWarning size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(OPEN_FINDINGS_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>across all cases</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="lg:w-[360px] lg:shrink-0">
              <div className={cx("overflow-hidden rounded-2xl border bg-white shadow-sm shadow-zinc-900/[0.03] lg:h-[700px]", BORDER)}>
                <CaseList query={query} onQueryChange={setQuery} statusFilter={statusFilter} onStatusChange={setStatusFilter} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={cx("font-mono text-[11px] font-normal", TEXT_AUX)}>{selected.key}</p>
                    <h2 className={cx("mt-0.5 text-lg font-semibold tracking-tight", TEXT_PRIMARY)}>{selected.vendor}</h2>
                    <p className={cx("mt-0.5 text-xs font-normal", TEXT_MUTED)}>{selected.category}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge className={STATUS_BADGE[selected.status]}>{STATUS_LABEL[selected.status]}</Badge>
                    <Badge className={SEVERITY_BADGE[selected.severity]}>{SEVERITY_LABEL[selected.severity]}</Badge>
                  </div>
                </div>
              </Card>

              <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_280px]">
                <Card>
                  <CardHead title="Risk profile" hint="Five-axis score, always printed alongside the shape — hover or focus a point for the exact reading." Icon={Gauge} />
                  <div className="mt-3">
                    <RiskRadar riskCase={selected} />
                  </div>
                </Card>

                <Card>
                  <CardHead title="Case timeline" />
                  <div className="mt-3">
                    <Timeline riskCase={selected} />
                  </div>
                </Card>
              </div>

              <div className="mt-4">
                <Card>
                  <CardHead title="Findings" Icon={FileWarning} />
                  <div className="mt-3">
                    <FindingsTable riskCase={selected} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectCase={(id) => {
            setSelectedId(id);
            setQuery("");
            setStatusFilter("all");
          }}
        />
      ) : null}
    </div>
  );
}
