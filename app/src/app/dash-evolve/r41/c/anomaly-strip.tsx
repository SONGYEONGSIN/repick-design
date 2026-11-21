"use client";

import type { AnomalyEvent, MetricDef } from "./data";
import { formatSignedMetricValue } from "./format";
import { DirectionGlyph, FOCUS_RING, SeverityBadge } from "./ui";

export default function AnomalyStrip({
  metric,
  events,
  selectedHour,
  onSelect,
}: {
  metric: MetricDef;
  events: AnomalyEvent[];
  selectedHour: string | null;
  onSelect: (hour: string) => void;
}) {
  if (events.length === 0) {
    return (
      <p className="font-normal text-sm text-zinc-500">
        No anomalies flagged for {metric.shortLabel.toLowerCase()} in the last 24 hours — every reading fell inside the expected range.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {events.map((event) => {
        const selected = event.hour === selectedHour;
        return (
          <li key={event.hour}>
            <button
              type="button"
              onClick={() => onSelect(event.hour)}
              aria-pressed={selected}
              className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-1.5 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                selected ? "border-sky-300 bg-sky-50" : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <DirectionGlyph direction={event.direction} className="h-3 w-3 text-red-600" />
              <span className="font-medium text-sm tabular-nums text-zinc-900">{event.hour}</span>
              <span className="font-medium text-sm tabular-nums text-red-700">
                {formatSignedMetricValue(metric, event.direction === "above" ? event.deviation : -event.deviation)}
              </span>
              <SeverityBadge severity={event.severity} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
