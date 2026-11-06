"use client";

import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { ACCOUNTS, METRICS, rankAccounts, type MetricKey } from "./data";
import { formatCurrency, formatNumber, formatPercent } from "./format";
import { Card, IconButton, SegmentedControl } from "./ui";
import { SidebarContent } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { Rail } from "./rail";
import { DetailPanel } from "./detail-panel";
import { TasksTable } from "./tasks-table";

const METRIC_OPTIONS = [
  { value: "arrAtRisk", label: "ARR at Risk" },
  { value: "healthScore", label: "Health Score" },
  { value: "nrr", label: "NRR" },
];
const METRIC_ORDER: MetricKey[] = ["arrAtRisk", "healthScore", "nrr"];

function defaultSelectedId(): string {
  const ranks = rankAccounts("arrAtRisk", "current");
  return ACCOUNTS.find((a) => ranks.get(a.id) === 1)?.id ?? ACCOUNTS[0].id;
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatMetricValue(metric: MetricKey, value: number): string {
  if (metric === "arrAtRisk") return formatCurrency(value);
  if (metric === "nrr") return formatPercent(value);
  return formatNumber(value);
}

function KpiCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Card className="min-w-0 p-4">
      <p className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p
        className="mt-1 truncate text-2xl font-semibold tabular-nums text-zinc-900"
        style={mono ? { fontFamily: "var(--font-display-mono)" } : undefined}
      >
        {value}
      </p>
    </Card>
  );
}

export default function Page() {
  const [metric, setMetric] = useState<MetricKey>("arrAtRisk");
  const [selectedId, setSelectedId] = useState<string>(() => defaultSelectedId());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const tasksRef = useRef<HTMLDivElement | null>(null);

  const selectedAccount = useMemo(
    () => ACCOUNTS.find((a) => a.id === selectedId) ?? ACCOUNTS[0],
    [selectedId],
  );

  const totals = useMemo(() => {
    const count = ACCOUNTS.length;
    const totalArrAtRisk = ACCOUNTS.reduce((sum, a) => sum + a.metrics.arrAtRisk.current, 0);
    const avgHealth = ACCOUNTS.reduce((sum, a) => sum + a.metrics.healthScore.current, 0) / count;
    const avgNrr = ACCOUNTS.reduce((sum, a) => sum + a.metrics.nrr.current, 0) / count;
    return { count, totalArrAtRisk, avgHealth, avgNrr };
  }, []);

  function handleExportCsv() {
    const sorted = [...ACCOUNTS].sort(
      (a, b) => b.metrics[metric].current - a.metrics[metric].current,
    );
    const header = ["Rank", "Account", "Segment", "Health", METRICS[metric].label, "Renewal Date"].join(",");
    const lines = sorted.map((account, index) =>
      [
        String(index + 1),
        csvCell(account.name),
        csvCell(account.segment),
        csvCell(account.health),
        csvCell(formatMetricValue(metric, account.metrics[metric].current)),
        account.renewalDate,
      ].join(","),
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northbound-renewal-ranking.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleJumpToTasks() {
    const node = tasksRef.current;
    if (!node) return;
    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  }

  function handleCycleMetric() {
    setMetric((current) => {
      const next = (METRIC_ORDER.indexOf(current) + 1) % METRIC_ORDER.length;
      return METRIC_ORDER[next];
    });
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-zinc-50">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-zinc-900/30"
          />
          <div className="relative z-10 flex h-full w-72 max-w-[80vw] flex-col border-r border-zinc-200 bg-white shadow-sm">
            <div className="flex justify-end px-2 pt-2">
              <IconButton aria-label="Close navigation" onClick={() => setMobileNavOpen(false)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </div>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onExportCsv={handleExportCsv}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
          <div className="flex min-w-0 flex-col gap-1 animate-[rise_0.4s_ease-out] motion-reduce:animate-none">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Renewal Rankings</h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Every renewing account in your book, ranked by the metric that matters today. Select
              an account to see its full renewal picture.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <KpiCard label="Total ARR at risk" value={formatCurrency(totals.totalArrAtRisk)} />
            <KpiCard label="Avg. health score" value={formatNumber(Math.round(totals.avgHealth))} mono />
            <KpiCard label="Avg. NRR" value={formatPercent(totals.avgNrr)} mono />
            <KpiCard label="Accounts tracked" value={formatNumber(totals.count)} mono />
          </div>

          <div className="grid min-w-0 grid-cols-12 gap-4 lg:gap-6">
            <section className="col-span-12 min-w-0 lg:col-span-7" aria-label="Account ranking">
              <Card className="min-w-0 p-0">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
                  <h2 className="text-base font-semibold text-zinc-900">Top accounts</h2>
                  <SegmentedControl
                    ariaLabel="Rank accounts by"
                    options={METRIC_OPTIONS}
                    value={metric}
                    onChange={(v) => setMetric(v as MetricKey)}
                  />
                </div>
                <Rail metric={metric} selectedId={selectedId} onSelect={setSelectedId} />
              </Card>
            </section>

            <section className="col-span-12 min-w-0 lg:col-span-5" aria-label="Account detail">
              <DetailPanel account={selectedAccount} />
            </section>
          </div>

          <div ref={tasksRef} className="min-w-0 scroll-mt-20">
            <TasksTable />
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onToggle={() => setPaletteOpen((v) => !v)}
        onClose={() => setPaletteOpen(false)}
        onSelectAccount={setSelectedId}
        onExportCsv={handleExportCsv}
        onJumpToTasks={handleJumpToTasks}
        onCycleMetric={handleCycleMetric}
      />
    </div>
  );
}
