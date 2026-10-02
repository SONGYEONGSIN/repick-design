"use client";

import { useCallback, useEffect, useState } from "react";
import { ScatterChart as ScatterIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import SellerRail from "./SellerRail";
import ScatterChart from "./ScatterChart";
import DetailCard from "./DetailCard";
import SellerTable from "./SellerTable";
import { SELLERS, TOTALS, formatCurrency, formatCount, formatPercent, sellersToCsv, FOCUS_RING } from "./data";
import { Card, SectionLabel } from "./ui";

export default function DashboardApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinnedId, setPinnedId] = useState<string | null>("sl-3");
  const [hoveredRailId, setHoveredRailId] = useState<string | null>(null);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const handlePin = useCallback((id: string) => {
    setPinnedId((current) => (current === id ? null : id));
  }, []);

  const handleExport = useCallback(() => {
    const csv = sellersToCsv(SELLERS);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reloop-seller-quality.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex min-h-dvh bg-zinc-950">
      <a
        href="#main-content"
        className={`sr-only font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-sm focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onExport={handleExport}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex items-center gap-2.5 text-sky-400">
            <ScatterIcon className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Seller quality</span>
          </div>
          <h1 className="mt-1 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
            Return rate vs. revenue
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-normal text-zinc-400">
            Every active reseller on the marketplace, plotted by return rate and trailing 90-day revenue —
            bubble size is order volume.
          </p>

          {/* Small, secondary summary strip — deliberately not a standalone KPI-tile grid competing
              with the scatter plot for attention. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-white/10 py-3">
            <InlineStat label="Sellers" value={formatCount(TOTALS.sellerCount)} />
            <Divider />
            <InlineStat label="Total revenue" value={formatCurrency(TOTALS.totalRevenue)} />
            <Divider />
            <InlineStat label="Avg. return rate" value={formatPercent(TOTALS.avgReturnRatePct)} />
            <Divider />
            <InlineStat label="Flagged" value={formatCount(TOTALS.flaggedCount)} tone="text-amber-400" />
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <SellerRail pinnedId={pinnedId} hoveredId={hoveredRailId} onPin={handlePin} onHover={setHoveredRailId} />

            <div className="min-w-0 flex-1 space-y-6">
              <DetailCard pinnedId={pinnedId} onClear={() => setPinnedId(null)} />

              <Card>
                <SectionLabel>Performance map</SectionLabel>
                <h2 className="mt-0.5 text-sm font-semibold text-zinc-50">
                  Return rate vs. revenue, sized by order volume
                </h2>
                <p className="mt-0.5 text-xs font-normal text-zinc-400">
                  Top 3 sellers by revenue and the 3 highest return rates are labeled directly. Hover or focus
                  any point for exact values; hovering a seller in the rail traces it here without pinning.
                </p>
                <div className="mt-4">
                  <ScatterChart pinnedId={pinnedId} hoveredRailId={hoveredRailId} onPin={handlePin} />
                </div>
              </Card>

              <SellerTable pinnedId={pinnedId} onPin={handlePin} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={handlePin} />
    </div>
  );
}

function InlineStat({ label, value, tone = "text-zinc-50" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

function Divider() {
  return <div aria-hidden="true" className="hidden h-8 w-px bg-white/10 sm:block" />;
}
