"use client";

import { useRef, useState } from "react";
import type { RolloutView } from "./data";
import { fmt } from "./data";

const W = 680;
const H = 260;
const PAD = { top: 14, right: 14, bottom: 26, left: 56 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function xForPct(pct: number) {
  return round2(PAD.left + (pct / 100) * PLOT_W);
}
function yForCount(count: number, total: number) {
  const frac = total > 0 ? count / total : 0;
  return round2(PAD.top + PLOT_H - frac * PLOT_H);
}

export default function RolloutChart({
  totalEligible,
  committedPct,
  view,
}: {
  totalEligible: number;
  committedPct: number;
  view: RolloutView;
}) {
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const curveSteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const curvePoints = curveSteps.map((pct) => {
    const impacted = Math.round((totalEligible * pct) / 100);
    return `${xForPct(pct)},${yForCount(impacted, totalEligible)}`;
  });

  const gridFractions = [0, 0.25, 0.5, 0.75, 1];

  function pctFromClientX(clientX: number): number {
    const el = overlayRef.current;
    if (!el) return committedPct;
    const rect = el.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * W;
    const raw = ((localX - PAD.left) / PLOT_W) * 100;
    return Math.min(100, Math.max(0, Math.round(raw)));
  }

  function moveHover(delta: number) {
    setHoverPct((prev) => {
      const base = prev ?? committedPct;
      return Math.min(100, Math.max(0, base + delta));
    });
  }

  const shownPct = hoverPct ?? committedPct;
  const hoverImpacted = Math.round((totalEligible * shownPct) / 100);
  const hoverX = xForPct(shownPct);
  const hoverY = yForCount(hoverImpacted, totalEligible);
  const committedX = xForPct(committedPct);
  const committedY = yForCount(view.impactedTotal, totalEligible);
  const tooltipLeftPct = Math.min(92, Math.max(8, (hoverX / W) * 100));

  return (
    <div>
      <dl className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wider text-zinc-400">Total eligible</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50">{fmt(totalEligible)}</dd>
        </div>
        <div className="rounded-lg border border-sky-400/20 bg-sky-400/[0.06] px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wider text-sky-300/80">Live rollout</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-sky-300">{committedPct}%</dd>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wider text-zinc-400">Impacted users</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50">{fmt(view.impactedTotal)}</dd>
        </div>
      </dl>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Rollout curve: users impacted rises with rollout percentage, currently ${committedPct}% impacting ${fmt(view.impactedTotal)} of ${fmt(totalEligible)} eligible users.`} className="w-full">
          {gridFractions.map((f) => {
            const y = yForCount(f * totalEligible, totalEligible);
            return (
              <g key={f} aria-hidden="true">
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
                <text x={PAD.left - 8} y={y + 3} textAnchor="end" fontSize={9} className="fill-zinc-400 tabular-nums">
                  {fmt(Math.round(f * totalEligible))}
                </text>
              </g>
            );
          })}
          {[0, 25, 50, 75, 100].map((pct) => (
            <text key={pct} x={xForPct(pct)} y={H - 6} textAnchor="middle" fontSize={9} className="fill-zinc-400 tabular-nums" aria-hidden="true">
              {pct}%
            </text>
          ))}

          <polyline points={curvePoints.join(" ")} fill="none" stroke="#38bdf8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" />

          {hoverPct !== null && (
            <line x1={hoverX} x2={hoverX} y1={PAD.top} y2={H - PAD.bottom} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="3,3" aria-hidden="true" />
          )}
          {hoverPct !== null && <circle cx={hoverX} cy={hoverY} r={3.5} className="fill-zinc-300" aria-hidden="true" />}

          <line x1={committedX} x2={committedX} y1={PAD.top} y2={H - PAD.bottom} stroke="#38bdf8" strokeWidth={1} strokeOpacity={0.5} aria-hidden="true" />
          <circle cx={committedX} cy={committedY} r={4.5} className="fill-sky-400 stroke-zinc-950" strokeWidth={2} aria-hidden="true" />
        </svg>

        {hoverPct !== null && (
          <div
            className="pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs shadow-lg shadow-black/40 opacity-100 transition-opacity duration-150 motion-reduce:transition-none"
            style={{ left: `${tooltipLeftPct}%` }}
          >
            <p className="font-medium text-zinc-100 tabular-nums">Previewing {shownPct}%</p>
            <p className="text-zinc-400 tabular-nums">{fmt(hoverImpacted)} users</p>
          </div>
        )}

        <div
          ref={overlayRef}
          role="slider"
          tabIndex={0}
          aria-label="Preview rollout curve at a percentage without changing the live rollout"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shownPct}
          aria-valuetext={`Previewing ${shownPct} percent, ${fmt(hoverImpacted)} users`}
          className="absolute inset-0 cursor-crosshair rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          onMouseMove={(e) => setHoverPct(pctFromClientX(e.clientX))}
          onMouseLeave={() => setHoverPct(null)}
          onFocus={() => setHoverPct((p) => p ?? committedPct)}
          onBlur={() => setHoverPct(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              moveHover(e.shiftKey ? 10 : 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              moveHover(e.shiftKey ? -10 : -1);
            } else if (e.key === "Home") {
              e.preventDefault();
              setHoverPct(0);
            } else if (e.key === "End") {
              e.preventDefault();
              setHoverPct(100);
            } else if (e.key === "Escape") {
              setHoverPct(null);
              overlayRef.current?.blur();
            }
          }}
        />
      </div>
      <p className="mt-1 text-[11px] text-zinc-400">
        Hover or focus the curve and use arrow keys to preview a percentage — the solid marker shows the live, committed rollout below.
      </p>
    </div>
  );
}
