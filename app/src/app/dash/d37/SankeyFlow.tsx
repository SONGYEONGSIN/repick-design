"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatCount,
  formatUsd,
  metricValue,
  round2,
  type FlowGraph,
  type FlowLink,
  type FlowNode,
  type MetricId,
} from "./data";
import { COLUMN_FILL, OUTCOME_FILL, OUTCOME_RIBBON_FILL, SVG_FOCUS, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

/* ---------------------------------------------------------------------- */
/* 좌표계 — viewBox 고정 단위, 전부 소수 2자리 반올림(하이드레이션 안정)               */
/* ---------------------------------------------------------------------- */

const VB_W = 1200;
const VB_H = 636;
const MARGIN_Y = 40;
const NODE_W = 14;

const COL_X = { c0: 190, c1: 593, c2: 996 } as const;
const GAP = { c0: 10, c1: 20, c2: 20 } as const;

const USABLE_H = VB_H - MARGIN_Y * 2;

type Rect = { y0: number; y1: number; height: number };

function layoutColumn(nodes: FlowNode[], metric: MetricId, gap: number): { rects: Map<string, Rect>; scale: number } {
  const total = nodes.reduce((s, n) => s + metricValue(n, metric), 0);
  const scale = total > 0 ? (USABLE_H - gap * Math.max(nodes.length - 1, 0)) / total : 0;
  let cursor = MARGIN_Y;
  const rects = new Map<string, Rect>();
  for (const n of nodes) {
    const h = round2(metricValue(n, metric) * scale);
    const y0 = round2(cursor);
    const y1 = round2(cursor + h);
    rects.set(n.id, { y0, y1, height: round2(y1 - y0) });
    cursor = y1 + gap;
  }
  return { rects, scale };
}

type LinkLayout = FlowLink & { sy0: number; sy1: number; ty0: number; ty1: number; path: string };

function layoutLinks(
  links: FlowLink[],
  sourceRects: Map<string, Rect>,
  targetRects: Map<string, Rect>,
  sourceScale: number,
  targetScale: number,
  metric: MetricId,
  x0: number,
  x1: number,
): LinkLayout[] {
  // target-side slice offsets: bucket by target, preserving original (source-major) array order
  const targetBuckets = new Map<string, FlowLink[]>();
  for (const l of links) {
    const arr = targetBuckets.get(l.targetId) ?? [];
    arr.push(l);
    targetBuckets.set(l.targetId, arr);
  }
  const targetSlice = new Map<string, { y0: number; y1: number }>();
  for (const [tid, arr] of targetBuckets) {
    let cursor = targetRects.get(tid)?.y0 ?? MARGIN_Y;
    for (const l of arr) {
      const h = round2(metricValue(l, metric) * targetScale);
      targetSlice.set(l.id, { y0: round2(cursor), y1: round2(cursor + h) });
      cursor = round2(cursor + h);
    }
  }

  // source-side slice offsets: array is already source-major, so a running cursor per source works directly
  const sourceCursor = new Map<string, number>();
  const xi = round2((x0 + x1) / 2);
  const out: LinkLayout[] = [];
  for (const l of links) {
    const startCursor = sourceCursor.get(l.sourceId) ?? sourceRects.get(l.sourceId)?.y0 ?? MARGIN_Y;
    const h = round2(metricValue(l, metric) * sourceScale);
    const sy0 = round2(startCursor);
    const sy1 = round2(startCursor + h);
    sourceCursor.set(l.sourceId, sy1);
    const t = targetSlice.get(l.id) ?? { y0: sy0, y1: sy1 };
    const path = `M ${x0} ${sy0} C ${xi} ${sy0} ${xi} ${t.y0} ${x1} ${t.y0} L ${x1} ${t.y1} C ${xi} ${t.y1} ${xi} ${sy1} ${x0} ${sy1} Z`;
    out.push({ ...l, sy0, sy1, ty0: t.y0, ty1: t.y1, path });
  }
  return out;
}

function metricLabel(node: { customers: number; mrr: number }): string {
  return `${formatCount(node.customers)} accts · ${formatUsd(node.mrr)} new MRR`;
}

function linkMetricLabel(l: FlowLink): string {
  return `${formatCount(l.customers)} accts (${l.shareOfSourcePct.toFixed(1)}% of ${l.sourceLabel}) · ${formatUsd(l.mrr)} new MRR`;
}

/* ---------------------------------------------------------------------- */

export default function SankeyFlow({
  graph,
  metric,
  selectedId,
  onSelect,
  focusToken,
}: {
  graph: FlowGraph;
  metric: MetricId;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** 값이 바뀔 때마다(커맨드 팔레트 등 외부 트리거) selectedId 요소로 실제 DOM 포커스를 이동시킨다. */
  focusToken: number;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const col0 = useMemo(() => layoutColumn(graph.channels, metric, GAP.c0), [graph.channels, metric]);
  const col1 = useMemo(() => layoutColumn(graph.tiers, metric, GAP.c1), [graph.tiers, metric]);
  const col2 = useMemo(() => layoutColumn(graph.outcomes, metric, GAP.c2), [graph.outcomes, metric]);

  const linksA = useMemo(
    () => layoutLinks(graph.linksChannelTier, col0.rects, col1.rects, col0.scale, col1.scale, metric, COL_X.c0 + NODE_W, COL_X.c1),
    [graph.linksChannelTier, col0, col1, metric],
  );
  const linksB = useMemo(
    () => layoutLinks(graph.linksTierOutcome, col1.rects, col2.rects, col1.scale, col2.scale, metric, COL_X.c1 + NODE_W, COL_X.c2),
    [graph.linksTierOutcome, col1, col2, metric],
  );

  const nodeRefs = useRef<Map<string, SVGRectElement | null>>(new Map());
  useEffect(() => {
    if (!selectedId) return;
    nodeRefs.current.get(selectedId)?.focus({ preventScroll: true });
    // focusToken forces re-run even if selectedId string is identical to a prior selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusToken]);

  const connected = useMemo(() => {
    if (!selectedId) return null;
    const ids = new Set<string>([selectedId]);
    const isLink = selectedId.includes("__");
    if (isLink) {
      const [s, t] = selectedId.split("__");
      ids.add(s);
      ids.add(t);
    } else {
      for (const l of [...linksA, ...linksB]) {
        if (l.sourceId === selectedId || l.targetId === selectedId) {
          ids.add(l.id);
          ids.add(l.sourceId);
          ids.add(l.targetId);
        }
      }
    }
    return ids;
  }, [selectedId, linksA, linksB]);

  function dimLink(id: string): boolean {
    return connected !== null && !connected.has(id);
  }
  function dimNode(id: string): boolean {
    return connected !== null && !connected.has(id);
  }

  function handleSelect(id: string) {
    onSelect(selectedId === id ? null : id);
  }

  function keyActivate(e: ReactKeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id);
    } else if (e.key === "Escape") {
      onSelect(null);
    }
  }

  // roving arrow-key nav within a node column
  function columnArrowNav(e: ReactKeyboardEvent, list: FlowNode[], idx: number) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const next = Math.min(list.length - 1, Math.max(0, idx + dir));
    nodeRefs.current.get(list[next].id)?.focus();
  }

  // tooltip content + anchor
  const tooltip = useMemo(() => {
    if (!activeId) return null;
    if (activeId.includes("__")) {
      const l = [...linksA, ...linksB].find((x) => x.id === activeId);
      if (!l) return null;
      const cx0 = l.col === 0 ? COL_X.c0 + NODE_W : COL_X.c1 + NODE_W;
      const cx1 = l.col === 0 ? COL_X.c1 : COL_X.c2;
      const anchorX = round2((cx0 + cx1) / 2);
      const anchorY = round2(((l.sy0 + l.sy1) / 2 + (l.ty0 + l.ty1) / 2) / 2);
      return { title: `${l.sourceLabel} → ${l.targetLabel}`, body: linkMetricLabel(l), x: anchorX, y: anchorY };
    }
    const all = [...graph.channels, ...graph.tiers, ...graph.outcomes];
    const n = all.find((x) => x.id === activeId);
    if (!n) return null;
    const rects = n.col === 0 ? col0.rects : n.col === 1 ? col1.rects : col2.rects;
    const r = rects.get(n.id);
    if (!r) return null;
    const x = n.col === 0 ? COL_X.c0 + NODE_W : n.col === 1 ? COL_X.c1 + NODE_W : COL_X.c2;
    return { title: n.label, body: metricLabel(n), x: round2(x), y: round2((r.y0 + r.y1) / 2) };
  }, [activeId, linksA, linksB, graph, col0, col1, col2]);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="group"
        aria-label="Revenue attribution flow: acquisition channel to plan tier to 90-day outcome"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* column caption row */}
        <text x={COL_X.c0 + NODE_W / 2} y={14} textAnchor="middle" className={cx("text-[12px] font-semibold uppercase tracking-wide", TEXT_CAPTION)} fill="currentColor">
          Acquisition Channel
        </text>
        <text x={COL_X.c1 + NODE_W / 2} y={14} textAnchor="middle" className={cx("text-[12px] font-semibold uppercase tracking-wide", TEXT_CAPTION)} fill="currentColor">
          Plan Tier at Signup
        </text>
        <text x={COL_X.c2 + NODE_W / 2} y={14} textAnchor="middle" className={cx("text-[12px] font-semibold uppercase tracking-wide", TEXT_CAPTION)} fill="currentColor">
          90-Day Outcome
        </text>

        {/* column 0 nodes */}
        {graph.channels.map((n, i) => {
          const r = col0.rects.get(n.id)!;
          const selected = selectedId === n.id;
          return (
            <g key={n.id}>
              <rect
                ref={(el) => {
                  nodeRefs.current.set(n.id, el);
                }}
                x={COL_X.c0}
                y={r.y0}
                width={NODE_W}
                height={Math.max(r.height, 1)}
                rx={3}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                aria-label={`${n.label}: ${metricLabel(n)}`}
                className={cx(
                  COLUMN_FILL[0].fill,
                  "cursor-pointer transition-opacity motion-reduce:transition-none",
                  SVG_FOCUS,
                  dimNode(n.id) ? "opacity-30" : "opacity-95",
                  selected && "stroke-zinc-900 dark:stroke-zinc-50",
                )}
                strokeWidth={selected ? 2 : 0}
                onMouseEnter={() => setActiveId(n.id)}
                onMouseLeave={() => setActiveId((v) => (v === n.id ? null : v))}
                onFocus={() => setActiveId(n.id)}
                onBlur={() => setActiveId((v) => (v === n.id ? null : v))}
                onClick={() => handleSelect(n.id)}
                onKeyDown={(e) => {
                  keyActivate(e, n.id);
                  columnArrowNav(e, graph.channels, i);
                }}
              />
              <text x={COL_X.c0 - 12} y={round2(r.y0 + r.height / 2 - 3)} textAnchor="end" className={cx("text-[13px] font-semibold", TEXT_PRIMARY)} fill="currentColor" aria-hidden="true">
                {n.label}
              </text>
              <text x={COL_X.c0 - 12} y={round2(r.y0 + r.height / 2 + 12)} textAnchor="end" className={cx("text-[11px] tabular-nums", TEXT_CAPTION)} fill="currentColor" aria-hidden="true">
                {formatCount(n.customers)} accts
              </text>
            </g>
          );
        })}

        {/* channel -> tier ribbons */}
        {linksA.map((l) => {
          const selected = selectedId === l.id;
          return (
            <path
              key={l.id}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-label={`${l.sourceLabel} to ${l.targetLabel}: ${linkMetricLabel(l)}`}
              d={l.path}
              className={cx(
                COLUMN_FILL[0].ribbon,
                "cursor-pointer transition-opacity motion-reduce:transition-none",
                SVG_FOCUS,
                dimLink(l.id) ? "opacity-10" : selected ? "opacity-90" : "opacity-60",
                selected && "stroke-sky-800 dark:stroke-sky-200",
              )}
              strokeWidth={selected ? 1.5 : 0}
              onMouseEnter={() => setActiveId(l.id)}
              onMouseLeave={() => setActiveId((v) => (v === l.id ? null : v))}
              onFocus={() => setActiveId(l.id)}
              onBlur={() => setActiveId((v) => (v === l.id ? null : v))}
              onClick={() => handleSelect(l.id)}
              onKeyDown={(e) => keyActivate(e, l.id)}
            />
          );
        })}

        {/* column 1 nodes (tiers) */}
        {graph.tiers.map((n, i) => {
          const r = col1.rects.get(n.id)!;
          const selected = selectedId === n.id;
          return (
            <g key={n.id}>
              <rect
                ref={(el) => {
                  nodeRefs.current.set(n.id, el);
                }}
                x={COL_X.c1}
                y={r.y0}
                width={NODE_W}
                height={Math.max(r.height, 1)}
                rx={3}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                aria-label={`${n.label}: ${metricLabel(n)}`}
                className={cx(
                  COLUMN_FILL[1].fill,
                  "cursor-pointer transition-opacity motion-reduce:transition-none",
                  SVG_FOCUS,
                  dimNode(n.id) ? "opacity-30" : "opacity-95",
                  selected && "stroke-zinc-900 dark:stroke-zinc-50",
                )}
                strokeWidth={selected ? 2 : 0}
                onMouseEnter={() => setActiveId(n.id)}
                onMouseLeave={() => setActiveId((v) => (v === n.id ? null : v))}
                onFocus={() => setActiveId(n.id)}
                onBlur={() => setActiveId((v) => (v === n.id ? null : v))}
                onClick={() => handleSelect(n.id)}
                onKeyDown={(e) => {
                  keyActivate(e, n.id);
                  columnArrowNav(e, graph.tiers, i);
                }}
              />
              <text x={round2(COL_X.c1 + NODE_W / 2)} y={round2(r.y0 - 6)} textAnchor="middle" className={cx("text-[12px] font-semibold", TEXT_PRIMARY)} fill="currentColor" aria-hidden="true">
                {n.label}
              </text>
            </g>
          );
        })}

        {/* tier -> outcome ribbons */}
        {linksB.map((l) => {
          const selected = selectedId === l.id;
          const ribbonClass = OUTCOME_RIBBON_FILL[l.targetId] ?? COLUMN_FILL[1].ribbon;
          return (
            <path
              key={l.id}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-label={`${l.sourceLabel} to ${l.targetLabel}: ${linkMetricLabel(l)}`}
              d={l.path}
              className={cx(
                ribbonClass,
                "cursor-pointer transition-opacity motion-reduce:transition-none",
                SVG_FOCUS,
                dimLink(l.id) ? "opacity-10" : selected ? "opacity-95" : "opacity-70",
                selected && "stroke-slate-700 dark:stroke-slate-200",
              )}
              strokeWidth={selected ? 1.5 : 0}
              onMouseEnter={() => setActiveId(l.id)}
              onMouseLeave={() => setActiveId((v) => (v === l.id ? null : v))}
              onFocus={() => setActiveId(l.id)}
              onBlur={() => setActiveId((v) => (v === l.id ? null : v))}
              onClick={() => handleSelect(l.id)}
              onKeyDown={(e) => keyActivate(e, l.id)}
            />
          );
        })}

        {/* column 2 nodes (outcomes) */}
        {graph.outcomes.map((n, i) => {
          const r = col2.rects.get(n.id)!;
          const selected = selectedId === n.id;
          return (
            <g key={n.id}>
              <rect
                ref={(el) => {
                  nodeRefs.current.set(n.id, el);
                }}
                x={COL_X.c2}
                y={r.y0}
                width={NODE_W}
                height={Math.max(r.height, 1)}
                rx={3}
                tabIndex={0}
                role="button"
                aria-pressed={selected}
                aria-label={`${n.label}: ${metricLabel(n)}`}
                className={cx(
                  OUTCOME_FILL[n.id],
                  "cursor-pointer transition-opacity motion-reduce:transition-none",
                  SVG_FOCUS,
                  dimNode(n.id) ? "opacity-30" : "opacity-95",
                  selected && "stroke-zinc-900 dark:stroke-zinc-50",
                )}
                strokeWidth={selected ? 2 : 0}
                onMouseEnter={() => setActiveId(n.id)}
                onMouseLeave={() => setActiveId((v) => (v === n.id ? null : v))}
                onFocus={() => setActiveId(n.id)}
                onBlur={() => setActiveId((v) => (v === n.id ? null : v))}
                onClick={() => handleSelect(n.id)}
                onKeyDown={(e) => {
                  keyActivate(e, n.id);
                  columnArrowNav(e, graph.outcomes, i);
                }}
              />
              <text x={round2(COL_X.c2 + NODE_W + 12)} y={round2(r.y0 + r.height / 2 - 3)} textAnchor="start" className={cx("text-[13px] font-semibold", TEXT_PRIMARY)} fill="currentColor" aria-hidden="true">
                {n.label}
              </text>
              <text x={round2(COL_X.c2 + NODE_W + 12)} y={round2(r.y0 + r.height / 2 + 12)} textAnchor="start" className={cx("text-[11px] tabular-nums", TEXT_CAPTION)} fill="currentColor" aria-hidden="true">
                {formatCount(n.customers)} accts
              </text>
            </g>
          );
        })}

        {/* hover/focus tooltip — anchored to element's own SVG coordinates, not pointer position (deterministic) */}
        {tooltip ? <SvgTooltip title={tooltip.title} body={tooltip.body} x={tooltip.x} y={tooltip.y} /> : null}
      </svg>

      {/* sr-only live summary for screen readers, mirrors the visual tooltip content on hover/focus */}
      <div aria-live="polite" className="sr-only">
        {tooltip ? `${tooltip.title}: ${tooltip.body}` : ""}
      </div>
    </div>
  );
}

function SvgTooltip({ title, body, x, y }: { title: string; body: string; x: number; y: number }) {
  const longest = Math.max(title.length, body.length);
  const boxW = Math.min(340, Math.max(150, longest * 6.4 + 28));
  const boxH = 46;
  let bx = round2(x - boxW / 2);
  bx = Math.min(VB_W - 10 - boxW, Math.max(10, bx));
  let by = round2(y - boxH - 14);
  if (by < 10) by = round2(y + 14);
  return (
    <g aria-hidden="true" className="motion-safe:transition-opacity motion-reduce:transition-none">
      <rect x={bx} y={by} width={round2(boxW)} height={boxH} rx={8} className="fill-zinc-900 dark:fill-zinc-100" fillOpacity={0.96} />
      <text x={round2(bx + 12)} y={round2(by + 18)} className="text-[12px] font-semibold fill-white dark:fill-zinc-900">
        {title}
      </text>
      <text x={round2(bx + 12)} y={round2(by + 34)} className="text-[11px] tabular-nums fill-zinc-300 dark:fill-zinc-600">
        {body}
      </text>
    </g>
  );
}
