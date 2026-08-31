"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import KpiCard from "./KpiCard";
import PeriodToggle from "./PeriodToggle";
import WaterfallChart from "./WaterfallChart";
import LineItemTable from "./LineItemTable";
import { BRIDGES, KPIS, PERIOD_META, type Period } from "./data";

export default function RevenueConsole() {
  const [period, setPeriod] = useState<Period>("month");
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const rows = BRIDGES[period];
  const meta = PERIOD_META[period];

  function handlePeriodChange(next: Period) {
    setPeriod(next);
    setHoveredKey(null);
  }

  return (
    <div className="flex min-h-dvh bg-white">
      <a
        href="#main-content"
        className="fixed left-2 top-2 z-50 -translate-y-16 rounded-md bg-orange-700 px-3 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0 motion-reduce:transition-none"
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenSidebar={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[26px]" style={{ fontFamily: "var(--font-display-wide)" }}>
                Revenue Recognition
              </h1>
              <p className="mt-1 text-sm text-zinc-500">Bridge of recognized revenue from opening to ending balance, {meta.axisNote}.</p>
            </div>
            <PeriodToggle value={period} onChange={handlePeriodChange} />
          </div>

          <div className="grid grid-cols-12 gap-4">
            {KPIS.map((kpi) => (
              <div key={kpi.key} className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
                <KpiCard kpi={kpi} />
              </div>
            ))}

            <div className="col-span-12 min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">{meta.caption}</h2>
                  <p className="text-sm text-zinc-500">{meta.title}</p>
                </div>
                <p className="text-xs text-zinc-500">
                  Ending balance reconciles: opening + bookings + expansion − churn − downgrades − adjustments.
                </p>
              </div>
              <WaterfallChart
                rows={rows}
                pinnedKey={pinnedKey}
                hoveredKey={hoveredKey}
                onHover={setHoveredKey}
                onPin={setPinnedKey}
                axisNote={meta.axisNote}
              />
            </div>

            <div className="col-span-12 min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-1 text-base font-semibold text-zinc-900">Line items</h2>
              <LineItemTable
                rows={rows}
                pinnedKey={pinnedKey}
                hoveredKey={hoveredKey}
                onPin={setPinnedKey}
                onHover={setHoveredKey}
                periodLabel={meta.title}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
