"use client";

import { useEffect, useState } from "react";
import { CreditCard, UserCheck, UserX, Users } from "lucide-react";
import type { Period } from "./data";
import { ACCOUNTS, CHANNELS_BY_PERIOD, PERIODS, channelName, totalsForPeriod } from "./data";
import { formatNumber, formatPercent } from "./format";
import { Card, Delta, FOCUS_RING, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { SankeyChart } from "./sankey-chart";
import { ChannelRail } from "./channel-rail";
import { AccountsTable } from "./accounts-table";

function KpiTile({
  icon: Icon,
  label,
  value,
  delta,
  deltaSuffix,
  invertGoodness,
  comparisonLabel,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  delta: number;
  deltaSuffix: string;
  invertGoodness?: boolean;
  comparisonLabel: string;
}) {
  return (
    <div className="min-w-0">
      {/* The icon lives inside `dt` (never wrapping `dt`+`dd` together) so the list keeps the
          `dl > div > (dt, dd)` shape the definition-list audit requires. */}
      <dt className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
        <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1.5 pl-[22px]">
        <span className="block font-semibold text-2xl tabular-nums text-zinc-900 [font-family:var(--font-display-grotesk)]">{value}</span>
        <span className="mt-1 flex items-center gap-1.5">
          <Delta value={delta} suffix={deltaSuffix} invertGoodness={invertGoodness} />
          <span className="font-normal text-xs text-zinc-500">{comparisonLabel}</span>
        </span>
      </dd>
    </div>
  );
}

export default function Page() {
  const [period, setPeriod] = useState<Period>("q3");
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>("organic-search");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const otherPeriod: Period = period === "q3" ? "q2" : "q3";
  const totals = totalsForPeriod(period);
  const otherTotals = totalsForPeriod(otherPeriod);
  const channels = CHANNELS_BY_PERIOD[period];
  const otherPeriodLabel = PERIODS.find((p) => p.value === otherPeriod)?.label.toLowerCase() ?? "";

  const activationRate = (totals.activated / totals.signups) * 100;
  const otherActivationRate = (otherTotals.activated / otherTotals.signups) * 100;
  const paidConversionRate = (totals.paidConverted / totals.activated) * 100;
  const otherPaidConversionRate = (otherTotals.paidConverted / otherTotals.activated) * 100;
  const churnRate = (totals.churned / totals.signups) * 100;
  const otherChurnRate = (otherTotals.churned / otherTotals.signups) * 100;

  function handleExport() {
    const lines: string[] = [];
    lines.push(`Meterbase lifecycle export — ${PERIODS.find((p) => p.value === period)?.label}`);
    lines.push("");
    lines.push("Channel,Signups,Activated,Not Activated,Converted to Paid,Still Trialing,Churned in Trial,Expanding,Stable,Contracting");
    for (const c of channels) {
      lines.push(
        [c.name, c.signups, c.activated, c.notActivated, c.paidConverted, c.trialing, c.churnedInTrial, c.expanding, c.stable, c.contracting].join(",")
      );
    }
    lines.push("");
    lines.push("Account,Domain,Channel,Stage,MRR,Health,Last Activity");
    for (const a of ACCOUNTS) {
      lines.push([a.name, a.domain, channelName(a.channelId, period), a.stage, a.mrr, a.health, a.lastActivity].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meterbase-lifecycle-export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-zinc-200 focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-900 focus:shadow-lg ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto bg-zinc-50">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-xl text-zinc-900">Lifecycle Flow</h1>
                <p className="mt-0.5 font-normal text-sm text-zinc-500">
                  How signups move through activation, trial, and revenue stages — {PERIODS.find((p) => p.value === period)?.label.toLowerCase()}.
                </p>
              </div>
              <SegmentedControl ariaLabel="Period" options={PERIODS} value={period} onChange={setPeriod} />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <KpiTile
                icon={Users}
                label="New Signups"
                value={formatNumber(totals.signups)}
                delta={((totals.signups - otherTotals.signups) / otherTotals.signups) * 100}
                deltaSuffix="%"
                comparisonLabel={`vs ${otherPeriodLabel}`}
              />
              <KpiTile
                icon={UserCheck}
                label="Activation Rate"
                value={formatPercent(activationRate)}
                delta={activationRate - otherActivationRate}
                deltaSuffix="pp"
                comparisonLabel={`vs ${otherPeriodLabel}`}
              />
              <KpiTile
                icon={CreditCard}
                label="Paid Conversion"
                value={formatPercent(paidConversionRate)}
                delta={paidConversionRate - otherPaidConversionRate}
                deltaSuffix="pp"
                comparisonLabel={`vs ${otherPeriodLabel}`}
              />
              <KpiTile
                icon={UserX}
                label="Churn Rate"
                value={formatPercent(churnRate)}
                delta={churnRate - otherChurnRate}
                deltaSuffix="pp"
                invertGoodness
                comparisonLabel={`vs ${otherPeriodLabel}`}
              />
            </dl>

            <div className="mt-5 grid grid-cols-12 gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-4">
                <ChannelRail
                  channels={channels}
                  otherPeriodChannels={CHANNELS_BY_PERIOD[otherPeriod]}
                  otherPeriodLabel={otherPeriodLabel}
                  expandedId={expandedChannelId}
                  onToggle={(id) => setExpandedChannelId((cur) => (cur === id ? null : id))}
                />
              </div>

              <div className="col-span-12 min-w-0 lg:col-span-8">
                <Card className="min-w-0 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-semibold text-sm text-zinc-900">Customer Lifecycle Sankey</h2>
                    <p className="font-normal text-xs text-zinc-500">{formatNumber(totals.signups)} signups this period · values are always shown as text</p>
                  </div>
                  <div className="mt-3">
                    <SankeyChart totals={totals} />
                  </div>
                </Card>
              </div>
            </div>

            <div className="mt-4">
              <AccountsTable period={period} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        period={period}
        onSelectPeriod={setPeriod}
        onSelectChannel={setExpandedChannelId}
        onExport={handleExport}
      />
    </div>
  );
}
