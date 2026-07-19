"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useState } from "react";
import {
  ancestorsOf,
  CANVAS_H,
  CANVAS_W,
  CONNECTORS,
  formatCount,
  LEVEL_MAX_HEADCOUNT,
  NODE_H,
  NODE_MAP,
  NODE_W,
  NODES,
  ROOT_ID,
  round2,
  STATUS_META,
  type OrgNode,
} from "./data";
import { BORDER, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ProgressBar } from "./ui";

export type MetricMode = "utilization" | "headcount";

const KIND_LABEL: Record<OrgNode["kind"], string> = { company: "회사", division: "부문", team: "팀" };

function clampPct(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function nodeVisual(node: OrgNode, mode: MetricMode) {
  const status = STATUS_META[node.status];
  if (mode === "utilization") {
    const barPct = round2(clampPct((node.utilization / 130) * 100, 4, 100));
    return {
      big: `${node.utilization}%`,
      bigUnit: "가동률",
      secondary: `${formatCount(node.headcount)}명`,
      barPct,
      barClass: status.bar,
    };
  }
  const levelMax = LEVEL_MAX_HEADCOUNT[node.level] || 1;
  const ratio = node.headcount / levelMax;
  const barPct = round2(clampPct(ratio * 100, 4, 100));
  let barClass = "bg-teal-300 dark:bg-teal-700";
  if (ratio >= 0.85) barClass = "bg-teal-700 dark:bg-teal-300";
  else if (ratio >= 0.6) barClass = "bg-teal-600 dark:bg-teal-400";
  else if (ratio >= 0.35) barClass = "bg-teal-500 dark:bg-teal-500";
  return {
    big: formatCount(node.headcount),
    bigUnit: "헤드카운트",
    secondary: `${node.utilization}% 가동`,
    barPct,
    barClass,
  };
}

export default function OrgTreeCanvas({
  metricMode,
  selectedId,
  onSelect,
}: {
  metricMode: MetricMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [roveId, setRoveId] = useState<string>(selectedId ?? ROOT_ID);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [domFocusedId, setDomFocusedId] = useState<string | null>(null);

  const roveEffective = NODE_MAP[roveId] ? roveId : ROOT_ID;
  const activeId = hoveredId ?? domFocusedId;
  const activeNode = activeId ? NODE_MAP[activeId] : null;

  // 선택된 노드까지 이어지는 조상 체인 — 커넥터를 강조해 트리 경로를 눈으로 읽게 한다.
  const highlightChain = new Set<string>();
  if (selectedId && NODE_MAP[selectedId]) {
    highlightChain.add(selectedId);
    for (const a of ancestorsOf(selectedId)) highlightChain.add(a.id);
  }

  function focusNode(id: string) {
    setRoveId(id);
    if (typeof document !== "undefined") document.getElementById(`org-node-${id}`)?.focus();
  }

  function onNodeKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, node: OrgNode) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(node.id);
      setRoveId(node.id);
      return;
    }
    let target: OrgNode | undefined;
    if (e.key === "ArrowDown") {
      target = node.childIds.length ? NODE_MAP[node.childIds[0]] : undefined;
    } else if (e.key === "ArrowUp") {
      target = node.parentId ? NODE_MAP[node.parentId] : undefined;
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const sibs = node.siblingIds;
      const idx = sibs.indexOf(node.id);
      if (idx >= 0 && sibs.length > 1) {
        const dir = e.key === "ArrowRight" ? 1 : -1;
        target = NODE_MAP[sibs[(idx + dir + sibs.length) % sibs.length]];
      }
    } else if (e.key === "Home") {
      target = NODE_MAP[ROOT_ID];
    }
    if (target) {
      e.preventDefault();
      focusNode(target.id);
    }
  }

  return (
    <div>
      {/* 설계 폭(CANVAS_W)이 표준 데스크톱 카드 폭보다 좁게 잡혀 있어(DagCanvas 선례와 동일 원리로
          뷰박스+퍼센트 좌표 스케일) 데스크톱에서는 실제로 가로 스크롤이 발생하지 않는다.
          overflow-x-auto는 매우 좁은 뷰포트(모바일)를 위한 안전망일 뿐이다. */}
      <div className="relative w-full min-w-[872px] overflow-x-auto [scrollbar-width:thin]">
        <div className="relative w-full" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
          <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
            {CONNECTORS.map((c) => {
              const on = highlightChain.has(c.parentId) && highlightChain.has(c.childId);
              return (
                <path
                  key={c.id}
                  d={c.path}
                  fill="none"
                  strokeWidth={on ? 2.25 : 1.5}
                  className={cx(TRANSITION, on ? "stroke-teal-500 dark:stroke-teal-400" : "stroke-zinc-300 dark:stroke-zinc-700")}
                />
              );
            })}
          </svg>

          {NODES.map((node) => {
            const xPct = round2((node.x / CANVAS_W) * 100);
            const yPct = round2((node.y / CANVAS_H) * 100);
            const v = nodeVisual(node, metricMode);
            const status = STATUS_META[node.status];
            const isSelected = node.id === selectedId;
            return (
              <button
                key={node.id}
                id={`org-node-${node.id}`}
                type="button"
                tabIndex={node.id === roveEffective ? 0 : -1}
                aria-pressed={isSelected}
                aria-label={`${node.name} ${KIND_LABEL[node.kind]}. 리드 ${node.leadName}. 헤드카운트 ${node.headcount}명, 가동률 ${node.utilization}%, 상태 ${status.label}${
                  node.childIds.length ? `, 하위 팀 ${node.childIds.length}개` : ""
                }. 선택하면 상세 패널과 로스터가 동기화됩니다.`}
                onClick={() => {
                  onSelect(node.id);
                  setRoveId(node.id);
                }}
                onKeyDown={(e) => onNodeKeyDown(e, node)}
                onFocus={() => setDomFocusedId(node.id)}
                onBlur={() => setDomFocusedId((p) => (p === node.id ? null : p))}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId((p) => (p === node.id ? null : p))}
                style={{ left: `${xPct}%`, top: `${yPct}%`, width: NODE_W, height: NODE_H }}
                className={cx(
                  "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-xl border-2 p-2 text-left shadow-sm",
                  TRANSITION,
                  FOCUS_RING_INSET,
                  "bg-white dark:bg-zinc-900",
                  isSelected ? "border-teal-500 ring-2 ring-teal-200 dark:ring-teal-500/30" : "border-zinc-200 dark:border-zinc-700",
                )}
              >
                <span>
                  <span className={cx("block text-[8px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{KIND_LABEL[node.kind]}</span>
                  <span className={cx("mt-0.5 block text-[10.5px] font-semibold leading-[13px]", TEXT_PRIMARY)} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {node.name}
                  </span>
                </span>

                <span className={cx("inline-flex items-center gap-1 truncate text-[9px] font-semibold", status.text)}>
                  <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", status.dot)} />
                  {status.label}
                </span>

                <span>
                  <span className="flex items-baseline justify-between gap-1">
                    <span className={cx("text-[13px] font-bold leading-none", NUM, TEXT_PRIMARY)}>{v.big}</span>
                    <span className={cx("shrink-0 text-[8.5px]", NUM, TEXT_CAPTION)}>{v.secondary}</span>
                  </span>
                  <ProgressBar value={v.barPct} max={100} toneClass={v.barClass} className="mt-1 h-1" label={`${node.name} ${v.bigUnit}`} />
                </span>
              </button>
            );
          })}

          {activeNode ? <NodeTooltip node={activeNode} mode={metricMode} xPct={round2((activeNode.x / CANVAS_W) * 100)} yPct={round2((activeNode.y / CANVAS_H) * 100)} /> : null}
        </div>
      </div>

      <p className="sr-only" aria-live="off">
        화살표 키로 조직도 노드 사이를 이동합니다. 아래는 하위 팀, 위는 상위 부문, 좌우는 같은 부모의 형제 팀 사이를 이동하며 Enter 또는 Space로 선택합니다.
      </p>
    </div>
  );
}

function NodeTooltip({ node, mode, xPct, yPct }: { node: OrgNode; mode: MetricMode; xPct: number; yPct: number }) {
  const status = STATUS_META[node.status];
  const v = nodeVisual(node, mode);
  const tx = xPct > 70 ? "calc(-100% - 4px)" : xPct < 12 ? "4px" : "-50%";
  const below = node.level === 0;
  const ty = below ? "calc(52px)" : "calc(-100% - 52px)";
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: `${xPct}%`, top: `${yPct}%` }}>
      <div
        role="status"
        aria-live="polite"
        style={{ transform: `translate(${tx}, ${ty})` }}
        className={cx("w-max min-w-[176px] max-w-[240px] rounded-xl border bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur dark:bg-zinc-900/95", BORDER)}
      >
        <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{node.name}</p>
        <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>
          {node.leadName} · {node.leadTitle}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className={cx("inline-flex items-center gap-1 text-xs font-semibold", status.text)}>
            <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
          <span className={cx("text-sm font-semibold", NUM, TEXT_PRIMARY)}>
            {v.big} <span className={cx("text-[10px] font-normal", TEXT_CAPTION)}>{v.bigUnit}</span>
          </span>
        </div>
        <p className={cx("mt-1.5 text-[11px]", NUM, TEXT_CAPTION)}>
          헤드카운트 {formatCount(node.headcount)}명 · 가동률 {node.utilization}% · 채용 요청 {node.openReqs}건{node.childIds.length ? ` · 하위 팀 ${node.childIds.length}개` : ""}
        </p>
      </div>
    </div>
  );
}
