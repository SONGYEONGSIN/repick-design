"use client";

import { AlertOctagon, ClipboardCheck, FileWarning, Gauge, Pin } from "lucide-react";
import { useEffect, useState } from "react";
import BoxPlotPanel from "./BoxPlotPanel";
import CommandPalette from "./CommandPalette";
import InspectionLedger from "./InspectionLedger";
import Sidebar from "./Sidebar";
import SupplierRail from "./SupplierRail";
import Topbar from "./Topbar";
import { BOX_STATS, ORG_TOTALS, PERIODS, PERIOD_LABEL, RECORDS, STATUS_ICON, STATUS_LABEL, SUPPLIERS, TIER_BADGE, TIER_LABEL, formatInt, riskTierOf, type InspectionStatus, type Period } from "./data";
import { ACCENT_SOLID, APP_BG, BORDER, FOCUS, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, Card, CardHead, Eyebrow, Segmented } from "./ui";

const STATUS_ORDER: InspectionStatus[] = ["pass", "watch", "flagged"];
const STATUS_BAR_FILL: Record<InspectionStatus, string> = { pass: "bg-emerald-500", watch: "bg-amber-500", flagged: "bg-rose-500" };
const STATUS_ICON_TINT: Record<InspectionStatus, string> = { pass: "text-emerald-600", watch: "text-amber-600", flagged: "text-rose-600" };

export default function AuditlaneClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("30D");
  const [pinnedId, setPinnedId] = useState("kessler");

  const supplier = SUPPLIERS.find((s) => s.id === pinnedId) ?? SUPPLIERS[0];
  const stats = BOX_STATS[supplier.id][period];
  const records = RECORDS[supplier.id][period];
  const tier = riskTierOf(stats.median);
  const org = ORG_TOTALS[period];

  const statusCounts: Record<InspectionStatus, number> = { pass: 0, watch: 0, flagged: 0 };
  records.forEach((r) => {
    statusCounts[r.status] += 1;
  });
  const statusTotal = records.length || 1;

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
      <a
        href="#main-content"
        className={cx("sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:px-3.5 focus:py-2 focus:text-sm focus:font-semibold", ACCENT_SOLID, FOCUS)}
      >
        Skip to main content
      </a>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Quality assurance · ${PERIOD_LABEL[period]}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Supplier quality console</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Hover a supplier on the left for an ephemeral preview — nothing else changes. Click one to pin it: that swaps the entire detail pane below, and only the detail pane.
              </p>
            </div>
            <Segmented<Period> ariaLabel="Reporting window" value={period} onChange={setPeriod} options={PERIODS.map((p) => ({ id: p, label: p }))} />
          </div>

          {/*
            Org-wide KPI strip — deliberately NOT a consumer of `pinnedId`. It reacts only to
            the shared `period` control, so pinning a different supplier below never moves
            these four numbers: they describe the whole console, not one sampled cohort.
          */}
          <h2 className="sr-only font-medium">Console summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Inspections</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <ClipboardCheck size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(org.inspections)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`across ${formatInt(SUPPLIERS.length)} suppliers`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Org median severity</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Gauge size={17} aria-hidden="true" className={TEXT_AUX} />
                  {org.medianSeverity.toFixed(1)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>0 = clean, 100 = severe</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", org.atRiskSuppliers > 0 ? "border-rose-200 bg-rose-50" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", org.atRiskSuppliers > 0 ? "text-rose-700" : TEXT_MUTED)}>Suppliers at risk</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertOctagon size={17} aria-hidden="true" className={org.atRiskSuppliers > 0 ? "text-rose-600" : TEXT_AUX} />
                  {formatInt(org.atRiskSuppliers)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", org.atRiskSuppliers > 0 ? "text-rose-700" : TEXT_MUTED)}>median severity ≥ 45</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Flagged records</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <FileWarning size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(org.flaggedRecords)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>severity ≥ 55, this window</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="lg:w-[320px] lg:shrink-0">
              <div className={cx("rounded-2xl border bg-white shadow-sm shadow-zinc-900/[0.03] lg:h-[700px] lg:overflow-y-auto lg:[scrollbar-width:thin]", BORDER)}>
                <SupplierRail suppliers={SUPPLIERS} period={period} pinnedId={pinnedId} onPin={setPinnedId} />
              </div>
            </div>

            {/*
              Everything from here down is the sole consumer of `pinnedId`. Clicking a
              different row in SupplierRail replaces this whole pane in one go — a
              standard master-detail swap, which is fine; the branching this brief asks
              for lives one level up, between that click and the rail's own ephemeral
              hover preview (see the comment in SupplierRail.tsx).
            */}
            <div className="min-w-0 flex-1">
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={cx("font-mono text-[11px] font-normal", TEXT_AUX)}>{`${supplier.region} · ${supplier.category}`}</p>
                    <h2 className={cx("mt-0.5 text-lg font-semibold tracking-tight", TEXT_PRIMARY)}>{supplier.name}</h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                      <Pin size={11} aria-hidden="true" className="fill-violet-700" />
                      Pinned
                    </span>
                    <Badge className={TIER_BADGE[tier]}>{TIER_LABEL[tier]}</Badge>
                  </div>
                </div>
              </Card>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                <Card className="lg:col-span-8">
                  <CardHead
                    title="Defect severity distribution"
                    hint="Tukey box plot, this window's inspections for the pinned supplier. Hover or focus a marker for its exact reading — every quartile is also printed below, hover or not."
                    Icon={Gauge}
                  />
                  <div className="mt-3">
                    <BoxPlotPanel stats={stats} orgMedian={org.medianSeverity} supplierName={supplier.name} />
                  </div>
                </Card>

                <Card className="lg:col-span-4">
                  <CardHead title="Status mix" hint={`${supplier.name}, ${PERIOD_LABEL[period]}.`} />
                  <div className="mt-3">
                    <div
                      className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100"
                      role="img"
                      aria-label={`Status mix for ${supplier.name}: ${STATUS_ORDER.map((k) => `${STATUS_LABEL[k]} ${statusCounts[k]}`).join(", ")}`}
                    >
                      {STATUS_ORDER.map((k) =>
                        statusCounts[k] > 0 ? <span key={k} aria-hidden="true" className={STATUS_BAR_FILL[k]} style={{ width: `${(statusCounts[k] / statusTotal) * 100}%` }} /> : null,
                      )}
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {STATUS_ORDER.map((k) => {
                        const Icon = STATUS_ICON[k];
                        const pctVal = Math.round((statusCounts[k] / statusTotal) * 100);
                        return (
                          <li key={k} className="flex items-center justify-between gap-2 text-sm">
                            <span className="flex items-center gap-1.5">
                              <Icon size={13} aria-hidden="true" className={STATUS_ICON_TINT[k]} />
                              <span className={TEXT_SECONDARY}>{STATUS_LABEL[k]}</span>
                            </span>
                            <span className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{`${statusCounts[k]} · ${pctVal}%`}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Card>
              </div>

              <div className="mt-4">
                <Card>
                  <CardHead title="Inspection records" Icon={FileWarning} />
                  <div className="mt-3">
                    <InspectionLedger records={records} supplierName={supplier.name} periodLabel={PERIOD_LABEL[period]} />
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
          onSelectSupplier={(id) => {
            setPinnedId(id);
          }}
        />
      ) : null}
    </div>
  );
}
