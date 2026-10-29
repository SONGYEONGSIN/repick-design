"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { BulletGrid } from "./BulletGrid";
import { ApprovalsFeed } from "./ApprovalsFeed";
import { VendorTable } from "./VendorTable";
import { Card, SegmentedControl } from "./ui";
import type { MetricId } from "./data";

type Period = "this-quarter" | "last-quarter";

export function LedgercheckClient() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pinnedMetricId, setPinnedMetricId] = useState<MetricId | null>(null);
  const [period, setPeriod] = useState<Period>("this-quarter");

  return (
    <div className="min-h-dvh bg-zinc-950">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-60">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-zinc-50">Spend governance</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Budget position by category, pending approvals, and vendor risk — one cycle at a time.
              </p>
            </div>
            <SegmentedControl
              label="Comparison period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "this-quarter", label: "This quarter" },
                { value: "last-quarter", label: "Last quarter" },
              ]}
            />
          </div>

          <Card>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-50">Budget position</h2>
              {pinnedMetricId ? (
                <button
                  type="button"
                  onClick={() => setPinnedMetricId(null)}
                  className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                  Clear pin
                </button>
              ) : null}
            </div>
            <p className="mb-4 text-xs text-zinc-400">
              {period === "this-quarter"
                ? "Current quarter against last quarter's close."
                : "Last quarter's close against the quarter before it — the vendor table below always reflects live, current-quarter spend."}
            </p>
            <BulletGrid
              pinnedMetricId={pinnedMetricId}
              onPinMetric={(id) => setPinnedMetricId((cur) => (cur === id ? null : id))}
              period={period}
            />
          </Card>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-2">
              <ApprovalsFeed />
            </Card>
            <Card className="min-w-0 xl:col-span-3">
              <VendorTable pinnedMetricId={pinnedMetricId} />
            </Card>
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
