"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { costCenterById, formatCompactCurrency, formatSignedPercent, orgDeltaAt, orgSpendAt, PERIOD_OPTIONS, type PeriodMode, serviceById } from "./data";
import { buildArcs } from "./geometry";
import { DISPLAY, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";

/**
 * The SVG itself is decorative (aria-hidden): every number it encodes is also printed as real
 * text in the always-visible center overlay below and in HierarchyTree.tsx's keyboard-reachable
 * fallback list, which is the thing a screen-reader or keyboard user actually reads. Hovering a
 * wedge here and focusing/activating the matching row in the tree set the exact same `activeId`
 * state (owned by the parent SpendBreakdown section) — two input paths into one ephemeral,
 * non-persistent highlight that never touches the cost-center rail's pin.
 */
export default function SunburstChart({ period, activeId, onActivate }: { period: PeriodMode; activeId: string | null; onActivate: (id: string | null) => void }) {
  const { centerArcs, serviceArcs } = buildArcs(period);
  const total = orgSpendAt(period);
  const delta = orgDeltaAt(period);
  const DeltaIcon = delta.direction === "up" ? ArrowUp : delta.direction === "down" ? ArrowDown : Minus;
  const deltaTone = delta.direction === "up" ? "text-amber-300" : delta.direction === "down" ? "text-cyan-300" : TEXT_AUX;
  const periodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.fullLabel.split(" vs")[0] ?? "This month";

  const activeCenterId = activeId ? (costCenterById(activeId) ? activeId : (serviceById(activeId)?.center.id ?? null)) : null;

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <svg viewBox="0 0 620 620" aria-hidden="true" className="h-full w-full">
        <circle cx={310} cy={310} r={90} className="fill-zinc-900" />

        {centerArcs.map((arc) => {
          const related = activeCenterId === null || activeCenterId === arc.id;
          const isExact = activeId === arc.id;
          return (
            <path
              key={arc.id}
              d={arc.path}
              fill={arc.fill}
              stroke="#09090b"
              strokeWidth={isExact ? 3 : 2}
              opacity={related ? 1 : 0.45}
              className="cursor-pointer transition-opacity duration-150 motion-reduce:transition-none"
              onMouseEnter={() => onActivate(arc.id)}
              onMouseLeave={() => onActivate(null)}
              onClick={() => onActivate(activeId === arc.id ? null : arc.id)}
            />
          );
        })}

        {serviceArcs.map((arc) => {
          const related = activeCenterId === null || activeCenterId === arc.center.id;
          const isExact = activeId === arc.id;
          return (
            <g key={arc.id}>
              <path
                d={arc.path}
                fill={arc.fill}
                stroke="#09090b"
                strokeWidth={isExact ? 3 : 1.5}
                opacity={related ? (isExact ? 1 : 0.92) : 0.4}
                className="cursor-pointer transition-opacity duration-150 motion-reduce:transition-none"
                onMouseEnter={() => onActivate(arc.id)}
                onMouseLeave={() => onActivate(null)}
                onClick={() => onActivate(activeId === arc.id ? null : arc.id)}
              />
              {arc.showLabel ? (
                <g aria-hidden="true">
                  <line x1={arc.leaderFrom.x} y1={arc.leaderFrom.y} x2={arc.leaderTo.x} y2={arc.leaderTo.y} className="stroke-zinc-500" strokeWidth={1} />
                  <text
                    x={arc.labelAnchor.x}
                    y={arc.labelAnchor.y}
                    textAnchor={arc.textAnchor}
                    dominantBaseline="central"
                    className="fill-zinc-300 text-[11px] font-medium"
                  >
                    {arc.service.shortLabel}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{periodLabel}</p>
        <p className={cx("mt-1 text-[30px] leading-none font-semibold", DISPLAY, TEXT_PRIMARY)}>{formatCompactCurrency(total)}</p>
        <p className={cx("mt-1.5 flex items-center gap-1 text-xs font-medium", deltaTone)}>
          <DeltaIcon size={12} aria-hidden="true" />
          {formatSignedPercent(delta.pct)} vs. prior
        </p>
      </div>
    </div>
  );
}
