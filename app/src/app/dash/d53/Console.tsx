"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import { CASES, formatMinutes, type SupportCase } from "./data";
import { MobileDrawer, Sidebar, Topbar } from "./AppShell";
import { CaseRail } from "./CaseRail";
import { CaseDetail } from "./CaseDetail";
import { CommandPalette } from "./CommandPalette";
import { Card } from "./ui";

export function Console() {
  const [cases, setCases] = useState<SupportCase[]>(CASES);
  const [pinnedId, setPinnedId] = useState<string>(CASES[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const updateCase = useCallback((id: string, updater: (c: SupportCase) => SupportCase) => {
    setCases((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

  const pinnedCase = useMemo(() => cases.find((c) => c.id === pinnedId) ?? cases[0], [cases, pinnedId]);

  const kpi = useMemo(() => {
    const open = cases.filter((c) => c.status === "open").length;
    const pending = cases.filter((c) => c.status === "pending").length;
    const resolved = cases.filter((c) => c.status === "resolved").length;
    const breached = cases.filter((c) => c.slaState === "breached" || c.slaState === "missed").length;
    const avgFirstResponse = Math.round(cases.reduce((sum, c) => sum + c.firstResponseMinutes, 0) / cases.length);
    return { total: cases.length, open, pending, resolved, breached, avgFirstResponse };
  }, [cases]);

  return (
    <div className="flex h-dvh min-w-0 flex-col bg-zinc-50 text-zinc-900 lg:flex-row">
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} onOpenPalette={() => setPaletteOpen(true)} pageTitle="Support cases" />

        <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:overflow-hidden">
          <div className="grid shrink-0 grid-cols-12 gap-3">
            <KpiCard className="col-span-6 xl:col-span-3" icon={CircleDot} tone="sky" label="Open cases" value={kpi.open} />
            <KpiCard className="col-span-6 xl:col-span-3" icon={Clock3} tone="amber" label="Pending" value={kpi.pending} />
            <KpiCard className="col-span-6 xl:col-span-3" icon={AlertTriangle} tone="red" label="SLA breached" value={kpi.breached} />
            <KpiCard
              className="col-span-6 xl:col-span-3"
              icon={CheckCircle2}
              tone="emerald"
              label="Avg first response"
              value={formatMinutes(kpi.avgFirstResponse)}
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:flex-row">
            <div className="max-h-[440px] shrink-0 overflow-y-auto border-b border-zinc-200 lg:h-full lg:max-h-none lg:w-[344px] lg:overflow-hidden lg:border-b-0 lg:border-r">
              <CaseRail cases={cases} pinnedId={pinnedCase?.id ?? pinnedId} onPin={setPinnedId} />
            </div>
            <div className="min-h-0 min-w-0 flex-1 lg:h-full">
              {pinnedCase && <CaseDetail kase={pinnedCase} onUpdate={updateCase} />}
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} cases={cases} onSelect={setPinnedId} />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
  className = "",
}: {
  icon: typeof CircleDot;
  label: string;
  value: string | number;
  tone: "sky" | "amber" | "red" | "emerald";
  className?: string;
}) {
  const toneCls = {
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];
  return (
    <Card className={`flex min-w-0 items-center gap-3 p-3.5 ${className}`}>
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneCls}`}>
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
        <span className="block text-lg font-semibold tabular-nums text-zinc-900">{value}</span>
      </span>
    </Card>
  );
}
