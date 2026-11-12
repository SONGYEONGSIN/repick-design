"use client";

import { useState } from "react";
import { Pin, PinOff } from "lucide-react";
import { BENCH_CAPACITY, EXPERIMENTS, classifyLift } from "./data";
import { FOCUS_RING, LIFT_META, StatusBadge } from "./ui";

/**
 * Deliberately NOT a master-detail rail: clicking a chip is a persistent pin (it adds/removes a
 * full run card on the bench above), while hovering or focusing a chip is a purely ephemeral
 * preview that touches no state other than this component's own `hoveredId`. The preview is
 * explicitly suppressed for a chip that is already pinned — its full detail is already visible on
 * the bench, so a duplicate floating summary would just be noise.
 */
export default function ExperimentRail({ pinnedIds, onTogglePin }: { pinnedIds: string[]; onTogglePin: (id: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const showPreviewFor = hoveredId && !pinnedIds.includes(hoveredId) ? hoveredId : null;
  const previewExperiment = showPreviewFor ? EXPERIMENTS.find((e) => e.id === showPreviewFor) ?? null : null;

  return (
    <div className="relative">
      <ul className="flex flex-wrap gap-2">
        {EXPERIMENTS.map((experiment) => {
          const pinned = pinnedIds.includes(experiment.id);
          const liftClass = classifyLift(experiment.ciFull);
          const meta = LIFT_META[liftClass];
          const Icon = pinned ? PinOff : Pin;
          return (
            <li key={experiment.id}>
              <button
                type="button"
                aria-pressed={pinned}
                onClick={() => onTogglePin(experiment.id)}
                onMouseEnter={() => setHoveredId(experiment.id)}
                onMouseLeave={() => setHoveredId((id) => (id === experiment.id ? null : id))}
                onFocus={() => setHoveredId(experiment.id)}
                onBlur={() => setHoveredId((id) => (id === experiment.id ? null : id))}
                className={`flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  pinned ? "border-lime-400/40 bg-lime-400/10" : "border-white/10 hover:bg-white/5"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 ${pinned ? "text-lime-400" : "text-zinc-400"}`} aria-hidden="true" />
                <span className="max-w-[12rem] truncate font-medium text-xs text-zinc-50">{experiment.name}</span>
                <meta.icon className={`h-3 w-3 shrink-0 ${meta.text}`} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 font-normal text-xs text-zinc-400">
        {pinnedIds.length >= BENCH_CAPACITY
          ? "Bench is full — pinning another experiment replaces the longest-pinned slot."
          : `Pin up to ${BENCH_CAPACITY - pinnedIds.length} more to fill the bench.`}
      </p>

      {previewExperiment ? (
        <div
          role="status"
          className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-white/10 bg-zinc-950 p-3 shadow-xl"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium text-sm text-zinc-50">{previewExperiment.name}</p>
            <StatusBadge status={previewExperiment.status} />
          </div>
          <p className="mt-1 line-clamp-2 font-normal text-xs text-zinc-400">{previewExperiment.hypothesis}</p>
          <p className="mt-2 font-normal text-xs tabular-nums text-zinc-400">
            {previewExperiment.metricLabel} · {previewExperiment.confidencePct}% confidence
          </p>
        </div>
      ) : null}
    </div>
  );
}
