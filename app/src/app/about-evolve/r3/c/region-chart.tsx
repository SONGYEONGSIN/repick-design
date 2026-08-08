"use client";

import { useState } from "react";
import { REGIONS, FOCUS_RING, type Region } from "./data";

/**
 * First wired interaction: a people-per-region distribution chart. Every bar's region name and
 * headcount is rendered unconditionally as text (color is never the only carrier of the value —
 * bar length is a decoration on top of a number that is already there), so the chart reads fine
 * with CSS off or on a screen reader. Hovering or focusing a bar (native <button>, so it is
 * reachable by Tab and activates on Enter/Space) swaps a detail readout below the chart between
 * the four regions' hub, coverage window, and on-call handoff line. Clicking pins a region so
 * touch users — who have no hover — get the same detail without needing to hold a finger down.
 * Leaving/blurring falls back to the pinned region, not to nothing, so the detail panel is never
 * empty.
 */
export default function RegionChart() {
  const [pinnedId, setPinnedId] = useState<string>(REGIONS[0].id);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const activeId = previewId ?? pinnedId;
  const active = REGIONS.find((r) => r.id === activeId) as Region;
  const max = Math.max(...REGIONS.map((r) => r.count));

  return (
    <div>
      <ul className="space-y-3">
        {REGIONS.map((region) => {
          const isActive = region.id === activeId;
          const widthPct = Math.round((region.count / max) * 100);
          return (
            <li key={region.id}>
              <button
                type="button"
                onMouseEnter={() => setPreviewId(region.id)}
                onMouseLeave={() => setPreviewId(null)}
                onFocus={() => setPreviewId(region.id)}
                onBlur={() => setPreviewId(null)}
                onClick={() => setPinnedId(region.id)}
                aria-pressed={region.id === pinnedId}
                className={`grid w-full grid-cols-[7.5rem_1fr_3rem] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors motion-reduce:transition-none sm:grid-cols-[9rem_1fr_3rem] ${FOCUS_RING} ${
                  isActive ? "border-cyan-400/60 bg-cyan-400/[0.07]" : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <span
                  className={`truncate text-sm ${
                    isActive ? "font-semibold text-cyan-200" : "font-normal text-zinc-300"
                  }`}
                >
                  {region.name}
                </span>
                <span className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <span
                    className={`block h-full rounded-full transition-[width] motion-reduce:transition-none ${
                      isActive ? "bg-cyan-400" : "bg-cyan-700"
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </span>
                <span
                  className={`text-right text-sm tabular-nums ${
                    isActive ? "font-semibold text-cyan-200" : "font-normal text-zinc-400"
                  }`}
                >
                  {region.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        aria-live="polite"
        className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
      >
        <p className="text-sm font-semibold text-zinc-50">
          {active.name} <span className="font-normal text-zinc-400">· {active.hub}</span>
        </p>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Coverage window</dt>
            <dd className="mt-1 text-sm font-normal tabular-nums text-zinc-300">{active.coverage}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Handoff</dt>
            <dd className="mt-1 text-sm font-normal text-zinc-300">{active.handoff}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
