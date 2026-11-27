"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { LatencyHistogram } from "./LatencyHistogram";
import { EndpointTable } from "./EndpointTable";
import { Card } from "./ui";
import { SegmentedControl } from "./ui";
import { ENDPOINT_BY_ID, type Period, type Endpoint } from "./data";

export function PulsebandClient() {
  const [period, setPeriod] = useState<Period>("24h");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const focused: Endpoint | null = focusedId ? ENDPOINT_BY_ID.get(focusedId) ?? null : null;

  function selectEndpointById(id: string) {
    setFocusedId((prev) => (prev === id ? null : id));
  }

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />

        <main className="min-w-0 flex-1 space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-[family-name:var(--font-display-mono)] text-xl font-semibold text-slate-50">
              Latency
            </h1>
            <SegmentedControl
              label="Select time period"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "1h", label: "1h" },
                { value: "24h", label: "24h" },
                { value: "7d", label: "7d" },
              ]}
            />
          </div>

          <KpiRow period={period} focused={focused} />

          <Card>
            <LatencyHistogram
              period={period}
              focusLabel={focused?.path ?? null}
              focusP99={focused?.p99 ?? null}
            />
          </Card>

          <EndpointTable focusedId={focusedId} onFocus={(e) => selectEndpointById(e.id)} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        selectEndpoint={selectEndpointById}
        setPeriod={setPeriod}
        scrollToTable={() => scrollToId("endpoint-table")}
      />
    </div>
  );
}
