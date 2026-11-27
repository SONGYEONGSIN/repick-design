"use client";

import { useMemo, useState } from "react";
import { Bell, Gauge, LayoutGrid, ListChecks, Search, Settings, ShieldCheck } from "lucide-react";
import { VENDORS, batchesFor, trendFor, type Period } from "./data";
import BoxPlotChart from "./box-plot-chart";
import VendorRail from "./vendor-rail";
import InspectorPanel from "./inspector-panel";
import { SegmentedControl, cx } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Quality", icon: Gauge, active: true },
  { label: "Audits", icon: ShieldCheck, active: false },
  { label: "Checklists", icon: ListChecks, active: false },
];

const DEFAULT_PINNED = VENDORS.reduce((worst, v) => (v.periods[90].median > worst.periods[90].median ? v : worst), VENDORS[0]).id;

export default function DashboardApp() {
  const [period, setPeriod] = useState<Period>(90);
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pinnedVendor = VENDORS.find((v) => v.id === pinnedId) ?? VENDORS[0];
  const pinnedBatches = useMemo(() => batchesFor(pinnedVendor.id), [pinnedVendor.id]);
  const pinnedTrend = useMemo(() => trendFor(pinnedVendor.id), [pinnedVendor.id]);

  const hoveredVendor = hoveredId && hoveredId !== pinnedId ? VENDORS.find((v) => v.id === hoveredId) : null;
  const atRiskCount = VENDORS.filter((v) => v.periods[period].median >= v.threshold).length;

  return (
    <div className="flex min-h-dvh w-full bg-zinc-50 font-sans text-zinc-900">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-600 text-[13px] font-semibold text-white" style={{ fontFamily: "var(--font-display-mono)" }}>
            T
          </span>
          <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display-mono)" }}>
            Tolerance
          </span>
        </div>
        <nav aria-label="Primary" className="mt-6 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <div
              key={item.label}
              className={cx(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium",
                item.active ? "bg-rose-50 text-rose-700" : "text-zinc-500"
              )}
            >
              <item.icon aria-hidden className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-600">MK</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-zinc-900">Mina Koto</p>
            <p className="truncate text-[11px] text-zinc-500">Supplier quality</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
          <label className="relative hidden flex-1 max-w-xs sm:block">
            <span className="sr-only">Search vendors and batches</span>
            <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search vendors and batches"
              className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            />
          </label>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <Bell aria-hidden className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <Settings aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900">Supplier quality bench</h1>
              <p className="mt-0.5 text-[13px] text-zinc-500">Incoming-inspection defect rate across {VENDORS.length} approved vendors.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] text-zinc-600">
                <span className={cx("h-1.5 w-1.5 rounded-full", atRiskCount > 0 ? "bg-rose-500" : "bg-emerald-500")} aria-hidden />
                <span className="font-medium text-zinc-900 tabular-nums">{atRiskCount}</span>
                <span>vendor{atRiskCount === 1 ? "" : "s"} at or above threshold</span>
              </div>
              <SegmentedControl
                label="Trailing period"
                value={String(period) as "30" | "60" | "90"}
                onChange={(v) => setPeriod(Number(v) as Period)}
                options={[
                  { value: "30", label: "30d" },
                  { value: "60", label: "60d" },
                  { value: "90", label: "90d" },
                ]}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <VendorRail vendors={VENDORS} period={period} pinnedId={pinnedId} onPin={setPinnedId} />

            <section aria-label="Defect rate distribution" className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white p-4 lg:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[13px] font-semibold text-zinc-900">Defect rate distribution by vendor</h2>
                <p className="text-[12px] text-zinc-500" aria-live="polite">
                  {hoveredVendor
                    ? `${hoveredVendor.name}: Q1 ${hoveredVendor.periods[period].q1}% · median ${hoveredVendor.periods[period].median}% · Q3 ${hoveredVendor.periods[period].q3}% · range ${hoveredVendor.periods[period].min}–${hoveredVendor.periods[period].max}%`
                    : "Hover or focus a box for its full five-number summary"}
                </p>
              </div>
              <div className="mt-3">
                <BoxPlotChart vendors={VENDORS} period={period} pinnedId={pinnedId} hoveredId={hoveredId} onPin={setPinnedId} onHoverChange={setHoveredId} />
              </div>
            </section>

            <InspectorPanel vendor={pinnedVendor} batches={pinnedBatches} trend={pinnedTrend} />
          </div>
        </main>
      </div>
    </div>
  );
}
