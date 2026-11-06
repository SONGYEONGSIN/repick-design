"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { METRICS, anomaliesForMetric, type MetricKey } from "./data";
import { formatSignedMetricValue } from "./format";
import { DirectionGlyph, FOCUS_RING } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  onSelectMetric,
  onSelectAnomaly,
}: {
  open: boolean;
  onClose: () => void;
  onSelectMetric: (key: MetricKey) => void;
  onSelectAnomaly: (key: MetricKey, hour: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prop-to-state reset happens during render (compared against a stored previous value) instead of
  // inside a useEffect keyed on `open`, so this never triggers the derived-state-in-effect warning.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const metricResults = METRICS.filter((m) => m.label.toLowerCase().includes(q) || m.shortLabel.toLowerCase().includes(q));
  const anomalyResults = METRICS.flatMap((m) =>
    anomaliesForMetric(m)
      .filter((a) => m.label.toLowerCase().includes(q) || a.hour.includes(q) || m.shortLabel.toLowerCase().includes(q))
      .map((a) => ({ metric: m, event: a }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search metrics and anomalies" className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            aria-label="Search metrics and anomalies by hour"
            placeholder="Search metrics and anomalies..."
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {metricResults.length === 0 && anomalyResults.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-500">No matches for &quot;{query}&quot;.</p>
          ) : (
            <>
              {metricResults.length > 0 ? (
                <div className="mb-1">
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">Metrics</p>
                  <ul>
                    {metricResults.map((m) => (
                      <li key={m.key}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectMetric(m.key);
                            onClose();
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
                        >
                          <span className="font-medium text-sm text-zinc-900">{m.label}</span>
                          <span className="font-normal text-xs text-zinc-500">{anomaliesForMetric(m).length} anomalies</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {anomalyResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-500">Anomalies</p>
                  <ul>
                    {anomalyResults.map(({ metric, event }) => (
                      <li key={`${metric.key}-${event.hour}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAnomaly(metric.key, event.hour);
                            onClose();
                          }}
                          className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <DirectionGlyph direction={event.direction} className="h-3 w-3 shrink-0 text-red-600" />
                            <span className="font-medium text-sm text-zinc-900">{event.hour}</span>
                            <span className="truncate font-normal text-xs text-zinc-500">{metric.label}</span>
                          </span>
                          <span className="shrink-0 font-medium text-xs tabular-nums text-red-700">
                            {formatSignedMetricValue(metric, event.direction === "above" ? event.deviation : -event.deviation)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
