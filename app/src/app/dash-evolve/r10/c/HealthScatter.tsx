"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ARR_THRESHOLD,
  HEALTH_THRESHOLD,
  formatDate,
  formatUsd,
  formatUsdCompact,
  round2,
  clamp,
  type AccountSnapshot,
} from "./data";
import { QUADRANT, SVG_FOCUS, TEXT_CAPTION, cx, type QuadrantId } from "./tokens";

/* ---------------------------------------------------------------------- */
/* Fixed viewBox coordinate system — all coordinates rounded to 2 decimals */
/* for hydration stability.                                                */
/* ---------------------------------------------------------------------- */

const VB_W = 1200;
const VB_H = 560;
const PAD = { left: 76, right: 28, top: 28, bottom: 48 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;

const HEALTH_MAX = 100;
const ARR_MAX = 560_000;
const X_TICKS = [0, 20, 40, 60, 80, 100];
const Y_TICKS = [0, 100_000, 200_000, 300_000, 400_000, 500_000];

function xFor(health: number): number {
  return round2(PAD.left + (health / HEALTH_MAX) * PLOT_W);
}
function yFor(arr: number): number {
  return round2(PAD.top + (1 - clamp(arr, 0, ARR_MAX) / ARR_MAX) * PLOT_H);
}
function rFor(arr: number): number {
  return round2(clamp(4.5 + Math.sqrt(arr / 9000) * 1.05, 5, 15));
}

/** Truncates on a word boundary (never mid-word) for the always-visible risk labels. */
function labelText(name: string, maxLen = 20): string {
  if (name.length <= maxLen) return name;
  const cut = name.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${lastSpace > 6 ? cut.slice(0, lastSpace) : cut}…`;
}

const QUADRANT_ANCHOR: Record<QuadrantId, { x: number; y: number; anchor: "start" | "end" }> = {
  at_risk: { x: xFor(2), y: PAD.top + 16, anchor: "start" },
  champions: { x: VB_W - PAD.right - 2, y: PAD.top + 16, anchor: "end" },
  nurture: { x: xFor(2), y: VB_H - PAD.bottom - 10, anchor: "start" },
  stable: { x: VB_W - PAD.right - 2, y: VB_H - PAD.bottom - 10, anchor: "end" },
};

export default function HealthScatter({
  accounts,
  selectedId,
  onSelect,
  quadrantFilter,
  onToggleQuadrant,
  focusToken,
  rangeLabel,
}: {
  accounts: AccountSnapshot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  quadrantFilter: QuadrantId | null;
  onToggleQuadrant: (q: QuadrantId) => void;
  focusToken: number;
  rangeLabel: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const pointRefs = useRef<Map<string, SVGCircleElement | null>>(new Map());

  const sortedByX = useMemo(() => [...accounts].sort((a, b) => a.health - b.health), [accounts]);

  useEffect(() => {
    if (!selectedId) return;
    pointRefs.current.get(selectedId)?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusToken]);

  const quadrantSummary = useMemo(() => {
    const map = new Map<QuadrantId, { count: number; arr: number }>();
    (Object.keys(QUADRANT) as QuadrantId[]).forEach((q) => map.set(q, { count: 0, arr: 0 }));
    for (const a of accounts) {
      const s = map.get(a.quadrant)!;
      s.count += 1;
      s.arr += a.arr;
    }
    return map;
  }, [accounts]);

  /** Highest-ARR accounts inside the At Risk quadrant get an always-visible name label —
   *  readable at a glance without hovering, per commercial-polish requirement. */
  const alwaysLabeled = useMemo(() => {
    const risky = accounts.filter((a) => a.quadrant === "at_risk").sort((a, b) => b.arr - a.arr);
    return new Set(risky.slice(0, 3).map((a) => a.id));
  }, [accounts]);

  const active = activeId ? accounts.find((a) => a.id === activeId) ?? null : null;

  function handleSelect(id: string) {
    onSelect(id);
  }

  function keyActivate(e: ReactKeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id);
    }
  }

  function arrowNav(e: ReactKeyboardEvent, id: string) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = sortedByX.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = clamp(idx + dir, 0, sortedByX.length - 1);
    pointRefs.current.get(sortedByX[next].id)?.focus();
  }

  function quadrantKeyActivate(e: ReactKeyboardEvent, q: QuadrantId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleQuadrant(q);
    }
  }

  const dimmed = (a: AccountSnapshot) => quadrantFilter !== null && a.quadrant !== quadrantFilter;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="group"
        aria-label={`Health score by ARR quadrant scatter, ${accounts.length} accounts, ${rangeLabel}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* plot background */}
        <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} className="fill-zinc-50" />

        {/* y gridlines + always-visible tick labels (ARR) */}
        {Y_TICKS.map((v) => {
          const y = yFor(v);
          return (
            <g key={`y-${v}`}>
              <line x1={PAD.left} x2={VB_W - PAD.right} y1={y} y2={y} className="stroke-zinc-200" strokeWidth={1} />
              <text x={PAD.left - 10} y={round2(y + 4)} textAnchor="end" className={cx("text-[11px]", TEXT_CAPTION)} fill="currentColor">
                {v === 0 ? "$0" : formatUsdCompact(v)}
              </text>
            </g>
          );
        })}

        {/* x gridlines + always-visible tick labels (health score) */}
        {X_TICKS.map((v) => {
          const x = xFor(v);
          return (
            <g key={`x-${v}`}>
              <line x1={x} x2={x} y1={PAD.top} y2={VB_H - PAD.bottom} className="stroke-zinc-200" strokeWidth={1} />
              <text x={x} y={VB_H - PAD.bottom + 20} textAnchor="middle" className={cx("text-[11px] tabular-nums", TEXT_CAPTION)} fill="currentColor">
                {v}
              </text>
            </g>
          );
        })}

        {/* axis titles */}
        <text x={round2(PAD.left + PLOT_W / 2)} y={VB_H - 6} textAnchor="middle" className={cx("text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)} fill="currentColor">
          Health score (0-100)
        </text>
        <text
          x={16}
          y={round2(PAD.top + PLOT_H / 2)}
          textAnchor="middle"
          transform={`rotate(-90 16 ${round2(PAD.top + PLOT_H / 2)})`}
          className={cx("text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}
          fill="currentColor"
        >
          Annual recurring revenue
        </text>

        {/* quadrant boundary lines */}
        <line x1={xFor(HEALTH_THRESHOLD)} x2={xFor(HEALTH_THRESHOLD)} y1={PAD.top} y2={VB_H - PAD.bottom} className="stroke-zinc-400" strokeWidth={1.25} strokeDasharray="5 4" />
        <line x1={PAD.left} x2={VB_W - PAD.right} y1={yFor(ARR_THRESHOLD)} y2={yFor(ARR_THRESHOLD)} className="stroke-zinc-400" strokeWidth={1.25} strokeDasharray="5 4" />

        {/* quadrant labels — clickable, always paired with color dot + text + count/ARR, filter the account table */}
        {(Object.keys(QUADRANT) as QuadrantId[]).map((q) => {
          const meta = QUADRANT[q];
          const anchor = QUADRANT_ANCHOR[q];
          const summary = quadrantSummary.get(q)!;
          const isFilterActive = quadrantFilter === q;
          const boxW = 168;
          const boxX = anchor.anchor === "start" ? anchor.x : anchor.x - boxW;
          return (
            <g
              key={q}
              role="button"
              tabIndex={0}
              aria-pressed={isFilterActive}
              aria-label={`${meta.label} quadrant: ${summary.count} accounts, ${formatUsd(summary.arr)} ARR. ${isFilterActive ? "Selected — click to clear filter" : "Click to filter the account table"}.`}
              onClick={() => onToggleQuadrant(q)}
              onKeyDown={(e) => quadrantKeyActivate(e, q)}
              className={cx("cursor-pointer", SVG_FOCUS)}
            >
              <rect
                x={round2(boxX)}
                y={round2(anchor.y - 14)}
                width={boxW}
                height={40}
                rx={9}
                className={isFilterActive ? meta.tintClass : "fill-white/75"}
              />
              <rect
                x={round2(boxX)}
                y={round2(anchor.y - 14)}
                width={boxW}
                height={40}
                rx={9}
                fill="none"
                strokeWidth={isFilterActive ? 1.5 : 1}
                className={isFilterActive ? meta.strokeClass : "stroke-zinc-200"}
              />
              <circle cx={round2(boxX + 12)} cy={round2(anchor.y + 4)} r={4} className={meta.dotClass} />
              <text x={round2(boxX + 22)} y={round2(anchor.y)} textAnchor="start" className={cx("text-[12px] font-semibold", meta.textClass)} fill="currentColor">
                {meta.label}
              </text>
              <text x={round2(boxX + 22)} y={round2(anchor.y + 13)} textAnchor="start" className={cx("text-[10px] tabular-nums", TEXT_CAPTION)} fill="currentColor">
                {summary.count} accts · {formatUsdCompact(summary.arr)}
              </text>
            </g>
          );
        })}

        {/* crosshair for the hovered/focused point */}
        {active ? (
          <g aria-hidden="true" className="motion-safe:transition-opacity motion-reduce:transition-none">
            <line x1={xFor(active.health)} x2={xFor(active.health)} y1={yFor(active.arr)} y2={VB_H - PAD.bottom} className="stroke-indigo-400" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={PAD.left} x2={xFor(active.health)} y1={yFor(active.arr)} y2={yFor(active.arr)} className="stroke-indigo-400" strokeWidth={1} strokeDasharray="3 3" />
          </g>
        ) : null}

        {/* data points */}
        {accounts.map((a) => {
          const meta = QUADRANT[a.quadrant];
          const selected = selectedId === a.id;
          const x = xFor(a.health);
          const y = yFor(a.arr);
          const r = selected ? rFor(a.arr) + 2 : rFor(a.arr);
          const isDimmed = dimmed(a);
          return (
            <g key={a.id}>
              <circle
                ref={(el) => {
                  pointRefs.current.set(a.id, el);
                }}
                cx={x}
                cy={y}
                r={r}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                aria-label={`${a.name}: health ${a.health.toFixed(0)} of 100, ${formatUsd(a.arr)} ARR, renews ${formatDate(a.renewalIso)}, ${meta.label} quadrant`}
                className={cx(
                  meta.dotClass,
                  selected ? "stroke-zinc-900" : "stroke-white",
                  "cursor-pointer transition-opacity motion-reduce:transition-none",
                  SVG_FOCUS,
                  isDimmed ? "opacity-15" : selected ? "opacity-100" : "opacity-80",
                )}
                strokeWidth={selected ? 2.5 : 1.5}
                onMouseEnter={() => setActiveId(a.id)}
                onMouseLeave={() => setActiveId((v) => (v === a.id ? null : v))}
                onFocus={() => setActiveId(a.id)}
                onBlur={() => setActiveId((v) => (v === a.id ? null : v))}
                onClick={() => handleSelect(a.id)}
                onKeyDown={(e) => {
                  keyActivate(e, a.id);
                  arrowNav(e, a.id);
                }}
              />
              {alwaysLabeled.has(a.id) ? (
                <text
                  x={round2(x + r + 6)}
                  y={round2(y + 3.5)}
                  textAnchor="start"
                  aria-hidden="true"
                  className={cx("text-[10.5px] font-semibold", isDimmed ? "opacity-25" : "opacity-100", meta.textClass)}
                  fill="currentColor"
                >
                  {labelText(a.name)}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* hover/focus tooltip — anchored to the point's own coordinates, not pointer position */}
        {active ? <ScatterTooltip account={active} /> : null}
      </svg>

      {/* sr-only live summary mirrors the visual tooltip for assistive tech */}
      <div aria-live="polite" className="sr-only">
        {active ? `${active.name}: health ${active.health.toFixed(0)} of 100, ${formatUsd(active.arr)} ARR, renews ${formatDate(active.renewalIso)}` : ""}
      </div>
    </div>
  );
}

function ScatterTooltip({ account }: { account: AccountSnapshot }) {
  const x = xFor(account.health);
  const y = yFor(account.arr);
  const lines = [account.name, `Health ${account.health.toFixed(0)} / 100 · ${formatUsd(account.arr)} ARR`, `Renews ${formatDate(account.renewalIso)}`];
  const longest = Math.max(...lines.map((l) => l.length));
  const boxW = Math.min(260, Math.max(150, longest * 6 + 24));
  const boxH = 58;
  let bx = round2(x - boxW / 2);
  bx = Math.min(VB_W - 8 - boxW, Math.max(8, bx));
  let by = round2(y - boxH - 14);
  const r = rFor(account.arr);
  if (by < PAD.top - 4) by = round2(y + r + 10);
  return (
    <g aria-hidden="true">
      <rect x={bx} y={by} width={round2(boxW)} height={boxH} rx={8} className="fill-zinc-900" fillOpacity={0.96} />
      <text x={round2(bx + 12)} y={round2(by + 17)} className="text-[12px] font-semibold fill-white">
        {lines[0]}
      </text>
      <text x={round2(bx + 12)} y={round2(by + 33)} className="text-[11px] tabular-nums fill-zinc-300">
        {lines[1]}
      </text>
      <text x={round2(bx + 12)} y={round2(by + 47)} className="text-[11px] tabular-nums fill-zinc-300">
        {lines[2]}
      </text>
    </g>
  );
}
