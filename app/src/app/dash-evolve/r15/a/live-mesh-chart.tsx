"use client";

/**
 * The "live mini chart" interaction: a deterministic ticking readout, not a decorative animation.
 * `index` advances on a fixed interval and walks a fixed, precomputed 24-point array
 * (MESH_RPS_HISTORY, built once at module load from Math.sin — never Math.random/Date.now), so the
 * displayed value and highlighted bar are 100% reproducible regardless of when the tab was opened.
 * The pulsing "live" dot is the only purely decorative motion here and is `motion-reduce`-gated; the
 * data advance itself is left running under reduced motion since it conveys real information.
 */

import { useEffect, useState } from "react";
import { MESH_RPS_HISTORY, MESH_RPS_LABELS } from "./data";
import { formatRps } from "./format";
import { TEXT_PRIMARY, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function LiveMeshChart() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESH_RPS_HISTORY.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const value = MESH_RPS_HISTORY[index];
  const max = Math.max(...MESH_RPS_HISTORY);
  const min = Math.min(...MESH_RPS_HISTORY);
  const range = max - min || 1;

  return (
    <div className="flex items-center gap-3">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <EyebrowLabel>Mesh throughput · live</EyebrowLabel>
        </div>
        <p className={cx("text-xl font-semibold tabular-nums sm:text-2xl", TEXT_PRIMARY)}>{formatRps(value)}</p>
      </div>

      <div
        className="flex h-10 items-end gap-[3px]"
        role="img"
        aria-label={`Mesh requests per second over the last 24 hours, currently ${formatRps(value)} at ${MESH_RPS_LABELS[index]}`}
      >
        {MESH_RPS_HISTORY.map((v, i) => {
          const heightPct = Math.round(((v - min) / range) * 100 * 100) / 100;
          const isCurrent = i === index;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cx("w-1 rounded-full transition-colors duration-200 motion-reduce:transition-none", isCurrent ? "bg-sky-400" : "bg-white/15")}
              style={{ height: `${Math.max(heightPct, 10)}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}
