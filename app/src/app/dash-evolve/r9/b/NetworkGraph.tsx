"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useState } from "react";
import {
  CANVAS_H,
  CANVAS_W,
  CONNECTORS,
  formatMs,
  formatPercent,
  formatVolume,
  LATENCY_META,
  LAYER_META,
  NODE_MAP,
  NODES,
  RELIABILITY_META,
  round2,
  type ServiceNode,
} from "./data";
import { BORDER, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export type MetricMode = "reliability" | "latency";

function colorMetaFor(node: ServiceNode, mode: MetricMode) {
  return mode === "reliability" ? RELIABILITY_META[node.reliability] : LATENCY_META[node.latency];
}

export default function NetworkGraph({
  metricMode,
  selectedId,
  onSelect,
}: {
  metricMode: MetricMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [roveId, setRoveId] = useState<string>(selectedId ?? NODES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [domFocusedId, setDomFocusedId] = useState<string | null>(null);

  const roveEffective = NODE_MAP[roveId] ? roveId : NODES[0].id;
  const activeId = hoveredId ?? domFocusedId;
  const activeNode = activeId ? NODE_MAP[activeId] : null;

  // 선택된 노드와 직접 연결된 상·하류 — 연결선을 강조해 웹 안에서 관계를 즉시 읽게 한다.
  const selected = selectedId ? NODE_MAP[selectedId] : null;
  const connectedIds = new Set<string>();
  if (selected) {
    connectedIds.add(selected.id);
    selected.upstreamIds.forEach((id) => connectedIds.add(id));
    selected.downstreamIds.forEach((id) => connectedIds.add(id));
  }

  function isEdgeHighlighted(source: string, target: string): boolean {
    if (!selected) return false;
    return (source === selected.id || target === selected.id) && connectedIds.has(source) && connectedIds.has(target);
  }

  function focusNode(id: string) {
    setRoveId(id);
    if (typeof document !== "undefined") document.getElementById(`mesh-node-${id}`)?.focus();
  }

  function onNodeKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, node: ServiceNode) {
    const idx = NODES.findIndex((n) => n.id === node.id);
    let target: ServiceNode | undefined;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      target = NODES[(idx + 1) % NODES.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      target = NODES[(idx - 1 + NODES.length) % NODES.length];
    } else if (e.key === "Home") {
      target = NODES[0];
    } else if (e.key === "End") {
      target = NODES[NODES.length - 1];
    }
    if (target) {
      e.preventDefault();
      focusNode(target.id);
    }
  }

  return (
    <div>
      {/* 설계 폭(CANVAS_W)이 표준 데스크톱 카드 폭보다 좁게 잡혀 있어(DagCanvas/OrgTreeCanvas 선례와
          동일 원리로 뷰박스+퍼센트 좌표 스케일) 데스크톱에서는 실제로 가로 스크롤이 발생하지 않는다.
          min-w는 아주 좁은 모바일 뷰포트에서 16개 노드 라벨이 지나치게 짓눌리지 않도록 하는
          안전망일 뿐이며, 그 경우에만 overflow-x-auto가 로컬 가로 스크롤을 허용한다(그리드 룰v2). */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <div className="relative min-w-[640px] w-full min-h-[320px] sm:min-w-0 sm:min-h-[380px]" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
          {/* 크로스헤어 가이드선 — 호버/포커스된 노드를 지나는 십자선으로 위치를 즉시 읽게 한다. */}
          {activeNode ? (
            <g className="motion-safe:transition-opacity motion-reduce:transition-none">
              <line x1={activeNode.x} y1={0} x2={activeNode.x} y2={CANVAS_H} strokeDasharray="3 4" strokeWidth={1} className="stroke-indigo-300 dark:stroke-indigo-700" />
              <line x1={0} y1={activeNode.y} x2={CANVAS_W} y2={activeNode.y} strokeDasharray="3 4" strokeWidth={1} className="stroke-indigo-300 dark:stroke-indigo-700" />
            </g>
          ) : null}

          {CONNECTORS.map((c) => {
            const on = isEdgeHighlighted(c.source, c.target);
            return (
              <path
                key={c.id}
                d={c.path}
                fill="none"
                strokeWidth={on ? 2 : 1.25}
                strokeDasharray={c.channel === "event" ? "5 3" : undefined}
                className={cx(TRANSITION, on ? "stroke-indigo-500 dark:stroke-indigo-400" : "stroke-zinc-300 dark:stroke-zinc-700")}
              />
            );
          })}
        </svg>

        {NODES.map((node) => {
          const xPct = round2((node.x / CANVAS_W) * 100);
          const yPct = round2((node.y / CANVAS_H) * 100);
          const meta = colorMetaFor(node, metricMode);
          const Icon = LAYER_META[node.layer].Icon;
          const isSelected = node.id === selectedId;
          const isDimmed = Boolean(selected) && !connectedIds.has(node.id);
          return (
            <button
              key={node.id}
              id={`mesh-node-${node.id}`}
              type="button"
              tabIndex={node.id === roveEffective ? 0 : -1}
              aria-pressed={isSelected}
              aria-label={`${node.name} 서비스, ${LAYER_META[node.layer].label}. 요청량 ${formatVolume(node.requestVolume)}, 오류율 ${formatPercent(node.errorRate)}, P99 지연 ${formatMs(node.p99)}, 상태 ${RELIABILITY_META[node.reliability].label}. 선택하면 상세 패널과 테이블이 동기화됩니다.`}
              onClick={() => {
                onSelect(node.id);
                setRoveId(node.id);
              }}
              onKeyDown={(e) => onNodeKeyDown(e, node)}
              onFocus={() => setDomFocusedId(node.id)}
              onBlur={() => setDomFocusedId((p) => (p === node.id ? null : p))}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId((p) => (p === node.id ? null : p))}
              style={{ left: `${xPct}%`, top: `${yPct}%`, width: node.chipW, height: node.chipH }}
              className={cx(
                "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full border-2 px-1.5 text-center shadow-sm",
                TRANSITION,
                FOCUS_RING_INSET,
                isDimmed ? "opacity-35" : "opacity-100",
                isSelected ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30" : meta.border,
                meta.bg,
              )}
            >
              <Icon size={Math.round(clampIcon(node.radius))} aria-hidden="true" className={meta.text} />
              <span className={cx("block max-w-full truncate px-0.5 text-[9px] font-semibold leading-[10px]", TEXT_PRIMARY)}>{node.shortLabel}</span>
              <span aria-hidden="true" className={cx("h-1 w-1 shrink-0 rounded-full", meta.dot)} />
            </button>
          );
        })}

        {activeNode ? (
          <NodeTooltip node={activeNode} mode={metricMode} xPct={round2((activeNode.x / CANVAS_W) * 100)} yPct={round2((activeNode.y / CANVAS_H) * 100)} />
        ) : null}
        </div>
      </div>

      <p className="sr-only" aria-live="off">
        화살표 키로 서비스 노드 사이를 이동합니다. Enter 또는 Space로 선택하면 상세 패널과 테이블이 동기화됩니다.
      </p>
    </div>
  );
}

function clampIcon(radius: number): number {
  return Math.min(16, Math.max(10, radius * 0.5));
}

function NodeTooltip({ node, mode, xPct, yPct }: { node: ServiceNode; mode: MetricMode; xPct: number; yPct: number }) {
  const reliability = RELIABILITY_META[node.reliability];
  const latency = LATENCY_META[node.latency];
  const primary = mode === "reliability" ? reliability : latency;
  const tx = xPct > 68 ? "calc(-100% - 6px)" : xPct < 14 ? "6px" : "-50%";
  const ty = yPct > 70 ? "calc(-100% - 36px)" : "calc(100% + 36px)";
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: `${xPct}%`, top: `${yPct}%` }}>
      <div
        role="status"
        aria-live="polite"
        style={{ transform: `translate(${tx}, ${ty})` }}
        className={cx("w-max min-w-[192px] max-w-[260px] rounded-xl border bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur dark:bg-zinc-900/95", BORDER)}
      >
        <div className="flex items-center justify-between gap-2">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{node.name}</p>
          <span className={cx("shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold", primary.text, primary.bg, primary.border)}>{primary.label}</span>
        </div>
        <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>
          {LAYER_META[node.layer].label} · {node.owner}
        </p>
        <dl className={cx("mt-2 grid grid-cols-3 gap-1.5 text-[10.5px]", NUM)}>
          <div>
            <dt className={TEXT_CAPTION}>요청량</dt>
            <dd className={cx("font-semibold", TEXT_PRIMARY)}>{formatVolume(node.requestVolume)}</dd>
          </div>
          <div>
            <dt className={TEXT_CAPTION}>오류율</dt>
            <dd className={cx("font-semibold", reliability.text)}>{formatPercent(node.errorRate)}</dd>
          </div>
          <div>
            <dt className={TEXT_CAPTION}>P99</dt>
            <dd className={cx("font-semibold", latency.text)}>{formatMs(node.p99)}</dd>
          </div>
        </dl>
        <p className={cx("mt-1.5 text-[11px]", TEXT_CAPTION)}>
          상류 {node.upstreamIds.length}개 · 하류 {node.downstreamIds.length}개
        </p>
      </div>
    </div>
  );
}
