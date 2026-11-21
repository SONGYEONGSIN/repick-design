"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { METRICS, PRIOR_LABEL, CURRENT_LABEL, isFlagged, deltaOf, type Facility, type MetricId } from "../lib/data";
import { FOCUS_RING, TrendIndicator, FlaggedBadge } from "./ui";

function MiniScoreBar({ facility, metricId }: { facility: Facility; metricId: MetricId }) {
  const score = facility[metricId];
  const delta = deltaOf(facility, metricId);
  const trend = Math.abs(delta) < 0.05 ? "flat" : delta > 0 ? "up" : "down";
  const barColor = trend === "up" ? "bg-lime-500" : trend === "down" ? "bg-rose-400" : "bg-zinc-400";
  const dotColor = trend === "up" ? "bg-lime-600" : trend === "down" ? "bg-rose-600" : "bg-zinc-500";
  const left = Math.min(score.prior, score.current);
  const width = Math.abs(score.current - score.prior);

  return (
    <div className="relative mt-3 h-6 px-[10px]">
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" aria-hidden="true" />
      <div
        className={`absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full ${barColor}`}
        style={{ left: `${left}%`, width: `${width}%` }}
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-400 bg-white"
        style={{ left: `${score.prior}%` }}
        aria-hidden="true"
      />
      <span
        className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotColor}`}
        style={{ left: `${score.current}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Independently-scoped detail surface: it reacts only to a "pinned" facility id, never to the
 * slope chart's ephemeral hover state. Pre-populated with the default-pinned facility on first
 * paint (see DEFAULT_PINNED_ID in lib/data.ts), so it is never shown empty. Rendered as a
 * non-modal complementary panel rather than a blocking dialog, so the rest of the page stays
 * interactive while it is open — it is unmounted entirely when closed, not just visually hidden,
 * so closed content can never still be reached by keyboard or screen reader.
 */
export function FacilityDrawer({
  facility,
  open,
  onClose,
}: {
  facility: Facility;
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open, facility.id]);

  if (!open) return null;

  const flagged = isFlagged(facility);

  return (
    <aside
      role="complementary"
      aria-label={`${facility.name} detail panel`}
      className="fixed bottom-0 right-0 top-16 z-20 w-full max-w-sm overflow-y-auto border-l border-zinc-200 bg-white shadow-xl"
    >
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Pinned facility</p>
          <h2 className="mt-0.5 truncate text-base font-semibold text-zinc-900">{facility.name}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {facility.region} · {facility.type}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close facility detail panel"
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="px-5 py-4">
        {flagged ? (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            <FlaggedBadge />
            <span>Compliance score is below the governance threshold this quarter.</span>
          </div>
        ) : null}

        <ul className="flex flex-col gap-5">
          {METRICS.map((m) => {
            const score = facility[m.id];
            const delta = deltaOf(facility, m.id);
            return (
              <li key={m.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-semibold text-zinc-900">{m.label}</p>
                  <TrendIndicator delta={delta} />
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">{m.description}</p>
                <MiniScoreBar facility={facility} metricId={m.id} />
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="tabular-nums">
                    {PRIOR_LABEL}: <span className="font-medium text-zinc-700">{score.prior.toFixed(1)}</span>
                  </span>
                  <span className="tabular-nums">
                    {CURRENT_LABEL}: <span className="font-medium text-zinc-700">{score.current.toFixed(1)}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
