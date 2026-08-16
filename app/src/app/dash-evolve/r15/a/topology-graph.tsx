"use client";

/**
 * The dominant visualization: a deterministic layered (Sugiyama-style) service dependency graph.
 * Node positions are fixed integer coordinates from data.ts (plain arithmetic — a 4-row layered grid
 * needs no trigonometry, so there is nothing non-deterministic to seed). Edges are decorative SVG
 * (`aria-hidden`); every node is a real, independently focusable HTML <button> whose accessible name
 * is built from its own visible + sr-only content (label, tier, health word, P99) rather than an
 * `aria-label` override — so the graph is keyboard-operable on top of (not instead of) the mandatory
 * Table fallback in topology-table.tsx, which is what a screen-reader user should actually rely on
 * (Network Graph is an A11y-D chart per charts.catalog).
 *
 * Health is never color-only: each node shows a shape-distinct status icon (check / triangle /
 * octagon) *and* the word is in the accessible name; each edge's color is reinforced by stroke width
 * and, for degraded/critical edges, an always-visible latency badge — never a hover-only tooltip.
 */

import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CANVAS_H, CANVAS_W, EDGES, EDGE_BADGE_POS, NODES, NODE_MAP, TIER_LABEL, TIER_ORDER, type NodeId } from "./data";
import { formatMs } from "./format";
import { HEALTH_LABEL, HEALTH_TONE, TEXT_CAPTION, cx } from "./tokens";

const HEALTH_ICON: Record<string, LucideIcon> = { healthy: CheckCircle2, degraded: AlertTriangle, critical: AlertOctagon };

const TIER_Y: Record<string, number> = Object.fromEntries(TIER_ORDER.map((t) => [t, NODES.find((n) => n.tier === t)!.y]));

export default function TopologyGraph({ selectedId, onSelect }: { selectedId: NodeId | null; onSelect: (id: NodeId) => void }) {
  const connected = new Set<NodeId>();
  if (selectedId) {
    connected.add(selectedId);
    for (const e of EDGES) {
      if (e.source === selectedId) connected.add(e.target);
      if (e.target === selectedId) connected.add(e.source);
    }
  }

  return (
    // Below `lg`, the canvas holds a legible fixed minimum width and scrolls horizontally inside this
    // local wrapper — the same mobile-only-local-scroll idiom the table fallback uses for its own
    // `min-w`/`lg:min-w-0` — instead of squeezing 15 node chips into ~330px, where they would visually
    // overlap. At `lg`+, `min-w-0` hands width back to the flex layout and the canvas is fully fluid.
    <div className="overflow-x-auto">
      <div className="relative min-w-[820px] select-none lg:min-w-0" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
        {/* Tier row guides — always-visible text labels, not decoration. */}
        {TIER_ORDER.map((tier) => (
          <div key={tier} className="absolute left-0 flex -translate-y-1/2 items-center gap-2" style={{ top: `${(TIER_Y[tier] / CANVAS_H) * 100}%` }}>
            <span className={cx("hidden text-[10px] font-semibold uppercase tracking-wider sm:inline", TEXT_CAPTION)}>{TIER_LABEL[tier]}</span>
          </div>
        ))}

        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          {TIER_ORDER.map((tier) => (
            <line key={tier} x1="0" y1={TIER_Y[tier]} x2={CANVAS_W} y2={TIER_Y[tier]} stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          ))}

          {EDGES.map((e) => {
            const source = NODE_MAP[e.source];
            const target = NODE_MAP[e.target];
            const tone = HEALTH_TONE[e.health];
            const isConnected = selectedId ? e.source === selectedId || e.target === selectedId : false;
            const dimmed = selectedId ? !isConnected : false;
            const widths: Record<string, number> = { healthy: 1.25, degraded: 2, critical: 2.5 };
            const baseOpacity: Record<string, number> = { healthy: 0.32, degraded: 0.8, critical: 0.95 };
            const opacity = dimmed ? baseOpacity[e.health] * 0.25 : isConnected ? 1 : baseOpacity[e.health];
            const badgePos = EDGE_BADGE_POS[e.id];
            const showBadge = e.health !== "healthy" && !dimmed;
            return (
              <g key={e.id}>
                {isConnected ? (
                  <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#38bdf8" strokeOpacity="0.3" strokeWidth={widths[e.health] + 5} strokeLinecap="round" />
                ) : null}
                <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={tone.stroke} strokeOpacity={opacity} strokeWidth={widths[e.health]} strokeLinecap="round" />
                {showBadge ? (
                  <g transform={`translate(${badgePos.x}, ${badgePos.y})`}>
                    <rect x={-22} y={-9} width={44} height={16} rx={8} fill="#09090b" stroke={tone.stroke} strokeOpacity="0.5" />
                    <text x={0} y={3} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={tone.stroke} className="tabular-nums">
                      {formatMs(e.latencyMs)}
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>

        {NODES.map((n) => {
          const tone = HEALTH_TONE[n.health];
          const Icon = HEALTH_ICON[n.health];
          const isSelected = selectedId === n.id;
          const dimmed = selectedId ? !connected.has(n.id) : false;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelect(n.id)}
              aria-pressed={isSelected}
              className={cx(
                "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl border px-2 py-1.5 backdrop-blur-sm",
                "transition-[opacity,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
                "bg-zinc-950/85",
                dimmed ? "opacity-30" : "opacity-100",
                isSelected ? "scale-105 border-sky-400 shadow-[0_0_0_3px_rgba(56,189,248,0.28)]" : tone.border,
              )}
              style={{ left: `${(n.x / CANVAS_W) * 100}%`, top: `${(n.y / CANVAS_H) * 100}%` }}
            >
              {/* No aria-label here on purpose: the accessible name is built from this real content
                  (visible text + sr-only context), which sidesteps the axe `label-content-name-mismatch`
                  check entirely (it only fires on elements carrying an aria-label/aria-labelledby) and
                  guarantees the visible short label is always literally inside the accessible name. */}
              <span className="sr-only">{TIER_LABEL[n.tier]} tier, </span>
              <span className="flex items-center gap-1">
                <Icon size={11} aria-hidden="true" className={cx("shrink-0", tone.text)} />
                <span className="whitespace-nowrap text-[11px] font-semibold leading-none text-zinc-50">{n.short}</span>
                <span className="sr-only">
                  {" "}
                  ({n.label}), {HEALTH_LABEL[n.health]}
                </span>
              </span>
              <span className="whitespace-nowrap text-[10px] font-medium leading-none tabular-nums text-zinc-400">
                {formatMs(n.p99Ms)}
                <span className="sr-only"> P99 latency</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
