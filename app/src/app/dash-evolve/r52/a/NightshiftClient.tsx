"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { IncidentTable } from "./IncidentTable";
import { Card, KpiStat, SegmentedControl } from "./ui";
import { OCTOBER_INCIDENTS, SEPTEMBER_SUMMARY } from "./data";

type Period = "october" | "september";

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function NightshiftClient() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pinnedDate, setPinnedDate] = useState("2026-10-28");
  const [period, setPeriod] = useState<Period>("october");

  const octoberStats = useMemo(() => {
    const total = OCTOBER_INCIDENTS.length;
    const sev1 = OCTOBER_INCIDENTS.filter((i) => i.severity === "sev1").length;
    const ackMinutes = OCTOBER_INCIDENTS.filter((i) => i.minutesToAck > 0).map((i) => i.minutesToAck);
    return { total, sev1, medianAck: median(ackMinutes) };
  }, []);

  const stats =
    period === "october"
      ? { total: octoberStats.total, sev1: octoberStats.sev1, medianAck: octoberStats.medianAck }
      : { total: SEPTEMBER_SUMMARY.totalIncidents, sev1: SEPTEMBER_SUMMARY.sev1, medianAck: SEPTEMBER_SUMMARY.medianAckMinutes };

  const delta = period === "october" ? octoberStats.total - SEPTEMBER_SUMMARY.totalIncidents : 0;

  return (
    <div className="min-h-dvh bg-white">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-60">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">On-call coverage</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Platform &amp; Edge rotation — incident density, severity mix and who answered.
              </p>
            </div>
            <SegmentedControl
              label="Comparison period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "october", label: "This month" },
                { value: "september", label: "Last month" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <KpiStat label="Incidents" value={String(stats.total)} delta={period === "october" ? `${delta >= 0 ? "+" : ""}${delta} vs last mo.` : undefined} deltaTone={delta > 0 ? "down" : delta < 0 ? "up" : "neutral"} />
            </Card>
            <Card>
              <KpiStat label="Sev1" value={String(stats.sev1)} />
            </Card>
            <Card>
              <KpiStat label="Median ack" value={`${stats.medianAck}m`} />
            </Card>
            <Card>
              <KpiStat label="Engineers on rotation" value="6" />
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">October coverage</h2>
                {pinnedDate ? (
                  <button
                    type="button"
                    onClick={() => setPinnedDate("")}
                    className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                    Clear pin
                  </button>
                ) : null}
              </div>
              <CalendarHeatmap pinnedDate={pinnedDate} onPinDate={(d) => setPinnedDate((cur) => (cur === d ? "" : d))} />
            </Card>
            <Card className="min-w-0 xl:col-span-2" padded={false}>
              <div className="p-4 sm:p-5">
                <IncidentTable pinnedDate={pinnedDate || null} />
              </div>
            </Card>
          </div>
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectDay={(d) => setPinnedDate(d)}
      />
    </div>
  );
}
