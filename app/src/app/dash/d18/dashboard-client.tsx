"use client";

import { useMemo, useState } from "react";
import { flights, gates, turnarounds, delayReasons, type Terminal } from "./data";
import { KpiRow } from "./kpi-row";
import { FlightBoard, type StatusFilter } from "./flight-board";
import { GateMap } from "./gate-map";
import { TurnaroundPanel } from "./turnaround-panel";
import { DelayChart } from "./delay-chart";

export function DashboardClient() {
  const [terminal, setTerminal] = useState<Terminal>("T1");
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const filteredFlights = useMemo(
    () =>
      flights.filter(
        (f) =>
          f.terminal === terminal && (filter === "ALL" || f.status === filter)
      ),
    [terminal, filter]
  );

  const filteredGates = useMemo(
    () => gates.filter((g) => g.terminal === terminal),
    [terminal]
  );

  const kpis = useMemo(() => {
    const total = filteredFlights.length;
    const delayed = filteredFlights.filter((f) => f.status === "DELAYED");
    const onTimePct =
      total === 0 ? 0 : Math.round(((total - delayed.length) / total) * 100);
    const avgDelayMin =
      delayed.length === 0
        ? 0
        : Math.round(
            delayed.reduce((sum, f) => sum + f.delayMin, 0) / delayed.length
          );
    return {
      total,
      onTimePct,
      delayedCount: delayed.length,
      avgDelayMin,
    };
  }, [filteredFlights]);

  return (
    <div className="flex flex-col gap-6">
      <KpiRow
        total={kpis.total}
        onTimePct={kpis.onTimePct}
        delayedCount={kpis.delayedCount}
        avgDelayMin={kpis.avgDelayMin}
      />

      <FlightBoard
        flights={filteredFlights}
        filter={filter}
        onFilterChange={setFilter}
        terminal={terminal}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <GateMap
            gates={filteredGates}
            terminal={terminal}
            onTerminalChange={setTerminal}
          />
        </div>
        <div className="xl:col-span-2">
          <DelayChart reasons={delayReasons} />
        </div>
      </div>

      <TurnaroundPanel turnarounds={turnarounds} />
    </div>
  );
}
