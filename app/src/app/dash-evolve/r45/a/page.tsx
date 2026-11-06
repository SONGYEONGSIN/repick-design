"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Gauge, TrendingUp, Wallet } from "lucide-react";
import {
  AXES,
  PERIODS,
  RISK_FLAG_THRESHOLD,
  VENDOR_LIST,
  atRiskVendors,
  averageUtilization,
  highestPriceChangeVendor,
  metricsFor,
  totalCost,
  type Period,
} from "./data";
import { formatCount, formatCurrency, formatSignedPercent } from "./format";
import { Card, Delta, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { VendorComparisonPanel } from "./vendor-comparison-panel";
import { VendorTable } from "./vendor-table";

function KpiTile({
  icon: Icon,
  label,
  value,
  trail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  trail: ReactNode;
}) {
  return (
    <div className="min-w-0">
      {/* Icon lives inside `dt`, never wrapping both `dt` and `dd` — keeps the `dl > div >
          (dt, dd)` shape a definition-list audit expects. */}
      <dt className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
        <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1.5 pl-[22px]">
        {/* Strictly smaller than the comparison panel's own headline number (text-3xl/4xl) —
            this route's dominant visualization stays visually primary. */}
        <span className="block font-semibold text-xl tabular-nums text-zinc-900">{value}</span>
        <span className="mt-1 block">{trail}</span>
      </dd>
    </div>
  );
}

export default function Page() {
  const [period, setPeriod] = useState<Period>("current");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const otherPeriod: Period = period === "current" ? "prior" : "current";
  const otherPeriodLabel = PERIODS.find((p) => p.value === otherPeriod)?.label ?? "";

  const spend = totalCost(period);
  const otherSpend = totalCost(otherPeriod);
  const spendDeltaPct = ((spend - otherSpend) / otherSpend) * 100;

  const utilization = averageUtilization(period);
  const otherUtilization = averageUtilization(otherPeriod);
  const utilizationDeltaPp = utilization - otherUtilization;

  const flagged = atRiskVendors(period);
  const flaggedNames = flagged.map((v) => v.name).join(" & ") || "None";

  const topIncrease = highestPriceChangeVendor(period);

  function handleExport() {
    const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? "";
    const lines: string[] = [];
    lines.push(`Vendly vendor comparison export — ${periodLabel}`);
    lines.push("");
    lines.push("Vendor,Category," + AXES.map((a) => a.label).join(",") + ",Status");
    for (const v of VENDOR_LIST) {
      const m = metricsFor(v.id, period);
      const values = AXES.map((a) => a.accessor(m));
      const status = m.riskScore >= RISK_FLAG_THRESHOLD ? "At risk" : "Stable";
      lines.push([v.name, v.category, ...values, status].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendly-vendor-comparison-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-50">
          <div className="mx-auto w-full max-w-[2200px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-xl text-zinc-900 [font-family:var(--font-display-wide)]">Vendor Comparison</h1>
                <p className="mt-0.5 max-w-xl font-normal text-sm text-zinc-500">
                  Renewal risk, cost and utilization across every active SaaS contract — {PERIODS.find((p) => p.value === period)?.label.toLowerCase()}.
                </p>
              </div>
              <SegmentedControl label="Renewal cycle" options={PERIODS} value={period} onChange={setPeriod} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiTile
                icon={Wallet}
                label="Total Contracted Spend"
                value={formatCurrency(spend)}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={spendDeltaPct} invertGoodness />
                    <span className="font-normal text-xs text-zinc-500">vs {otherPeriodLabel.toLowerCase()}</span>
                  </span>
                }
              />
              <KpiTile
                icon={AlertTriangle}
                label="Contracts Flagged At-Risk"
                value={formatCount(flagged.length)}
                trail={<span className="block truncate font-normal text-xs text-zinc-500">{flaggedNames}</span>}
              />
              <KpiTile
                icon={Gauge}
                label="Average Seat Utilization"
                value={`${utilization.toFixed(1)}%`}
                trail={
                  <span className="flex items-center gap-1.5">
                    <Delta value={utilizationDeltaPp} suffix="pp" />
                    <span className="font-normal text-xs text-zinc-500">vs {otherPeriodLabel.toLowerCase()}</span>
                  </span>
                }
              />
              <KpiTile
                icon={TrendingUp}
                label="Highest Price Increase"
                value={formatSignedPercent(topIncrease.value)}
                trail={<span className="block truncate font-normal text-xs text-zinc-500">{topIncrease.vendor.name}</span>}
              />
            </dl>

            <div className="mt-5 flex flex-col gap-4">
              <VendorComparisonPanel period={period} />

              <Card className="min-w-0 p-4 sm:p-5">
                <VendorTable period={period} />
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
