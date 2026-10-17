"use client";

import { AlertTriangle, Building2, Gauge, Radar as RadarIcon, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import RadarChart from "./RadarChart";
import ScoreTable from "./ScoreTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import VendorSpotlight from "./VendorSpotlight";
import VendorToggle from "./VendorToggle";
import { AVG_OVERALL, OPEN_INCIDENTS_TOTAL, RISK_AXES, TOTAL_ANNUAL_SPEND, VENDORS, WEAK_COUNT, formatInt, formatScore, formatUsd } from "./data";
import { APP_BG, BORDER, NUM, SERIES_HEX, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow } from "./ui";

export default function VantageClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Widget A's own selection: which vendors plot on the radar. Scoped to the radar + the "category
  // leaders" side panel that reads the same set — it never touches the table below.
  const [plotted, setPlotted] = useState<Set<string>>(() => new Set(VENDORS.map((v) => v.id)));
  // Widget B's own selection, set only by clicking a table row (or the palette): which vendor the
  // spotlight card recomputes for. Independently scoped from `plotted` above — see VendorSpotlight.
  const [spotlightId, setSpotlightId] = useState<string>(VENDORS[0].id);

  const spotlightVendor = VENDORS.find((v) => v.id === spotlightId) ?? VENDORS[0];
  const shownVendors = useMemo(() => VENDORS.filter((v) => plotted.has(v.id)), [plotted]);

  const leaders = useMemo(
    () =>
      RISK_AXES.map((axis) => {
        const best = [...shownVendors].sort((a, b) => b.axes[axis] - a.axes[axis])[0];
        return { axis, vendor: best };
      }),
    [shownVendors],
  );

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

  function toggleVendor(id: string) {
    setPlotted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Vendor scorecard · Contract packaging — Tier 1`}</Eyebrow>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]" style={{ fontFamily: "var(--font-display-wide)" }}>
                Vendor comparison
              </h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Three vendors under review for the same sourcing category, scored across seven fixed risk axes. The radar is the shape at a glance; every number behind it is printed in the table underneath, always.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Cohort summary</h2>
          <div className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Category spend</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-2xl font-semibold leading-none">
                <Building2 size={17} aria-hidden="true" className={TEXT_AUX} />
                <span className={cx(NUM, "whitespace-nowrap")}>{formatUsd(TOTAL_ANNUAL_SPEND)}</span>
              </p>
              <p className={cx("mt-2 text-[11px] font-normal", TEXT_MUTED)}>{`across ${formatInt(VENDORS.length)} vendors, annualized`}</p>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Cohort avg. overall</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-2xl font-semibold leading-none">
                <Gauge size={17} aria-hidden="true" className={TEXT_AUX} />
                <span className={NUM}>{formatScore(AVG_OVERALL)}</span>
              </p>
              <p className={cx("mt-2 text-[11px] font-normal", TEXT_MUTED)}>0 = highest risk, 10 = lowest</p>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", WEAK_COUNT > 0 ? "border-rose-400/25 bg-rose-400/[0.08]" : cx(BORDER, SURFACE_INSET))}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", WEAK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>At-risk band</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-2xl font-semibold leading-none">
                <AlertTriangle size={17} aria-hidden="true" className={WEAK_COUNT > 0 ? "text-rose-400" : TEXT_AUX} />
                <span className={NUM}>{formatInt(WEAK_COUNT)}</span>
              </p>
              <p className={cx("mt-2 text-[11px] font-normal", WEAK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>overall score below 5.0</p>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Open incidents</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-2xl font-semibold leading-none">
                <ShieldAlert size={17} aria-hidden="true" className={TEXT_AUX} />
                <span className={NUM}>{formatInt(OPEN_INCIDENTS_TOTAL)}</span>
              </p>
              <p className={cx("mt-2 text-[11px] font-normal", TEXT_MUTED)}>trailing twelve months</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <Card>
                <CardHead
                  title="Risk radar"
                  hint="Toggle a vendor to add or remove its polygon. Stroke style, not just color, tells the three apart — solid, dashed, dotted."
                  Icon={RadarIcon}
                />
                <div className="mt-3">
                  <VendorToggle vendors={VENDORS} plotted={plotted} onToggle={toggleVendor} />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                  <RadarChart vendors={VENDORS} plotted={plotted} />

                  <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-950 p-3.5">
                    <p className={cx("text-[11px] font-semibold uppercase tracking-[0.05em]", TEXT_MUTED)}>Category leaders</p>
                    <ul className="mt-2.5 flex flex-col gap-2">
                      {leaders.map(({ axis, vendor }) =>
                        vendor ? (
                          <li key={axis} className="flex items-center justify-between gap-2 text-xs">
                            <span className={cx("truncate", TEXT_MUTED)}>{axis}</span>
                            <span className="flex shrink-0 items-center gap-1.5 font-medium">
                              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SERIES_HEX[vendor.id] }} />
                              <span className={cx("tabular-nums", TEXT_PRIMARY)}>{vendor.axes[axis].toFixed(1)}</span>
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <CardHead title="Every score, exact" hint="The persistent fallback — sort or filter it, but nothing here is ever hidden behind a hover." />
                  <div className="mt-3">
                    <ScoreTable vendors={VENDORS} spotlightId={spotlightId} onSpotlight={setSpotlightId} />
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-span-12 min-w-0 xl:col-span-4">
              <Card className="xl:sticky xl:top-20">
                <CardHead title="Vendor spotlight" hint="Set by clicking a row in the table — independent of which vendors are plotted on the radar." />
                <div className="mt-3">
                  <VendorSpotlight vendor={spotlightVendor} cohort={VENDORS} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectVendor={(id) => setSpotlightId(id)}
        />
      ) : null}
    </div>
  );
}
