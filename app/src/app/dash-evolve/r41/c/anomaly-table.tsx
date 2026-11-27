"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { AnomalyEvent, MetricDef } from "./data";
import { formatMetricValue, formatRange, formatSignedMetricValue } from "./format";
import { DirectionGlyph, FOCUS_RING, SeverityBadge } from "./ui";

type SortKey = "time" | "deviation";
type SortDir = "asc" | "desc";

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center gap-1 rounded-md px-1.5 font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-500 motion-safe:transition-colors hover:text-zinc-900 ${FOCUS_RING}`}
    >
      {label}
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
    </button>
  );
}

export default function AnomalyTable({ metric, events }: { metric: MetricDef; events: AnomalyEvent[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...events].sort((a, b) => {
    const base = sortKey === "time" ? a.index - b.index : a.deviation - b.deviation;
    return sortDir === "asc" ? base : -base;
  });

  const ariaSort = (key: SortKey): "ascending" | "descending" | "none" =>
    sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  if (events.length === 0) {
    return (
      <p className="font-normal text-sm text-zinc-500">
        No anomaly events recorded for {metric.shortLabel.toLowerCase()} — the table has nothing to list while every reading stays inside range.
      </p>
    );
  }

  return (
    <>
      {/* Desktop / wide table */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-500">
            Anomaly events for {metric.label} over the last 24 hours. Matches the markers plotted on the chart above.
          </caption>
          <colgroup>
            <col style={{ width: "14%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "22%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSort("time")} className="py-2 pr-2 text-left">
                <SortButton label="Time" active={sortKey === "time"} dir={sortDir} onClick={() => toggleSort("time")} />
              </th>
              <th scope="col" className="py-2 pr-2 text-left font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-500">
                Metric
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-500">
                Actual
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-semibold text-[11px] uppercase tracking-[0.03em] text-zinc-500">
                Expected range
              </th>
              <th scope="col" aria-sort={ariaSort("deviation")} className="py-2 text-right">
                <SortButton label="Deviation" active={sortKey === "deviation"} dir={sortDir} onClick={() => toggleSort("deviation")} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <tr key={event.hour} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="py-2.5 pr-2 font-medium text-sm tabular-nums text-zinc-900">{event.hour}</td>
                <td className="py-2.5 pr-2 font-normal text-sm text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <DirectionGlyph direction={event.direction} className="h-3 w-3 shrink-0 text-red-600" />
                    {metric.label}
                  </span>
                </td>
                <td className="py-2.5 pr-2 text-right font-medium text-sm tabular-nums text-zinc-900">
                  {formatMetricValue(metric, event.actual)}
                </td>
                <td className="py-2.5 pr-2 text-right font-normal text-sm tabular-nums text-zinc-600">
                  {formatRange(metric, event.expectedLow, event.expectedHigh)}
                </td>
                <td className="py-2.5 text-right">
                  <span className="font-medium text-sm tabular-nums text-red-700">
                    {formatSignedMetricValue(metric, event.direction === "above" ? event.deviation : -event.deviation)}
                  </span>
                  <SeverityBadge severity={event.severity} className="ml-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow-viewport fallback: a flat definition list (dt/dd siblings only) instead of a cramped table. */}
      <p className="sr-only sm:hidden">Anomaly events for {metric.label} over the last 24 hours, listed chronologically.</p>
      <dl className="flex flex-col gap-3 sm:hidden">
        {[...events]
          .sort((a, b) => a.index - b.index)
          .flatMap((event) => [
            <dt
              key={`${event.hour}-dt`}
              className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-2 font-medium text-sm tabular-nums text-zinc-900 first:border-0 first:pt-0"
            >
              {event.hour}
              <SeverityBadge severity={event.severity} />
            </dt>,
            <dd key={`${event.hour}-metric`} className="mt-1 flex items-center gap-1.5 font-normal text-sm text-zinc-600">
              <DirectionGlyph direction={event.direction} className="h-3 w-3 shrink-0 text-red-600" />
              {metric.label}
            </dd>,
            <dd key={`${event.hour}-range`} className="mt-1 font-normal text-xs tabular-nums text-zinc-500">
              Actual {formatMetricValue(metric, event.actual)} · Expected {formatRange(metric, event.expectedLow, event.expectedHigh)}
            </dd>,
            <dd key={`${event.hour}-deviation`} className="mt-1 font-medium text-xs tabular-nums text-red-700">
              {formatSignedMetricValue(metric, event.direction === "above" ? event.deviation : -event.deviation)} outside range
            </dd>,
          ])}
      </dl>
    </>
  );
}
