"use client";

import { ArrowDownRight, ArrowLeftRight, ArrowUpRight, Circle, Database, Diamond, Layers, Square, X } from "lucide-react";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORY_LABEL,
  EDGES,
  LATENCY_BUCKET_LABEL,
  NODE_BY_ID,
  NODES,
  RELATIONSHIP_CATEGORY,
  RELATIONSHIP_LABEL,
  TIER_LABEL,
  VIEW_H,
  VIEW_W,
  type LatencyBucket,
  type PositionedNode,
  type RelationshipCategory,
  type ServiceEdge,
  type TierId,
} from "./data";
import { BORDER, CATEGORY_DASH, CODE, FOCUS, NUM, PANEL_BG, STATUS_BADGE, STATUS_DOT, STATUS_LABEL, STATUS_STROKE, STATUS_WIDTH, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, type Status } from "./tokens";
import { Badge, Eyebrow, Segmented } from "./ui";

type ViewMode = "tier" | "latency";

const SHAPE_ICON = { square: Square, circle: Circle, diamond: Diamond } as const;

function relFromRect(containerRect: DOMRect, targetRect: DOMRect) {
  return {
    left: targetRect.left - containerRect.left + targetRect.width / 2,
    top: targetRect.top - containerRect.top + targetRect.height / 2,
  };
}

function nodeShapeNode(shape: PositionedNode["shape"], size: number) {
  if (shape === "square") {
    return <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={3} />;
  }
  if (shape === "diamond") {
    return <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={2} transform="rotate(45)" />;
  }
  return <circle r={size / 2} />;
}

/** Status marker at a node's corner: color is never the only cue, so each
 * status also gets its own SHAPE (circle / triangle / square) — visible even
 * without color perception, same idea as the edge dash pattern below. */
function statusMarkerNode(status: Status) {
  if (status === "healthy") return <circle r={3.2} />;
  if (status === "degraded") return <path d="M0 -3.6 L3.4 3 L-3.4 3 Z" />;
  return <rect x={-3} y={-3} width={6} height={6} rx={1} />;
}

const CATEGORY_ICON = { sync: ArrowLeftRight, async: Layers, data: Database } as const;

export default function GraphCanvas({ focusRequest, onFocusHandled }: { focusRequest?: { id: string; token: number } | null; onFocusHandled?: () => void }) {
  const [view, setView] = useState<ViewMode>("tier");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ left: number; top: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ kind: "node" | "edge"; id: string; left: number; top: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const nodeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const openInspector = useCallback((nodeId: string, triggerEl: HTMLElement) => {
    const container = containerRef.current;
    if (!container) return;
    const pos = relFromRect(container.getBoundingClientRect(), triggerEl.getBoundingClientRect());
    setPopoverPos(pos);
    setSelectedId(nodeId);
    lastTriggerRef.current = triggerEl;
  }, []);

  const closeInspector = useCallback(() => {
    setSelectedId(null);
    setPopoverPos(null);
    lastTriggerRef.current?.focus();
  }, []);

  // Escape closes the inspector from anywhere; a click outside the whole
  // graph card (sidebar, topbar, table, timeline) also closes it. Clicking a
  // different node inside the canvas instead re-anchors the popover there.
  useEffect(() => {
    if (!selectedId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeInspector();
    }
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) closeInspector();
    }
    function onResize() {
      closeInspector();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [selectedId, closeInspector]);

  useEffect(() => {
    if (selectedId) closeBtnRef.current?.focus();
  }, [selectedId]);

  // Jumping here from the command palette re-uses the exact same open path a
  // click would: it looks up the real trigger button for that node and opens
  // the inspector anchored to it, then hands keyboard focus to that button.
  useEffect(() => {
    if (!focusRequest) return;
    const el = nodeButtonRefs.current.get(focusRequest.id);
    if (el) {
      el.scrollIntoView({ block: "center", inline: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      openInspector(focusRequest.id, el);
      el.focus();
    }
    onFocusHandled?.();
  }, [focusRequest, openInspector, onFocusHandled]);

  const showTooltip = useCallback((kind: "node" | "edge", id: string, el: HTMLElement) => {
    const container = containerRef.current;
    if (!container) return;
    const pos = relFromRect(container.getBoundingClientRect(), el.getBoundingClientRect());
    setTooltip({ kind, id, left: pos.left, top: pos.top });
  }, []);
  const hideTooltip = useCallback(() => setTooltip(null), []);

  const selectedNode = selectedId ? NODE_BY_ID.get(selectedId) ?? null : null;
  const outbound = selectedId ? EDGES.filter((e) => e.source === selectedId) : [];
  const inbound = selectedId ? EDGES.filter((e) => e.target === selectedId) : [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Eyebrow>Group by</Eyebrow>
          <Segmented
            ariaLabel="Group nodes by"
            value={view}
            onChange={setView}
            options={[
              { id: "tier", label: "By tier" },
              { id: "latency", label: "By latency" },
            ]}
          />
        </div>
        <Legend view={view} />
      </div>

      <div ref={containerRef} className="relative">
        <div className="w-full overflow-x-auto rounded-xl sm:overflow-visible">
          <div className="relative min-w-[760px] sm:min-w-0" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <g aria-hidden="true">
                {EDGES.map((edge) => (
                  <EdgeLine key={edge.id} edge={edge} view={view} hovered={tooltip?.kind === "edge" && tooltip.id === edge.id} selectedId={selectedId} />
                ))}
              </g>
              <g>
                {NODES.map((node) => (
                  <NodeMark key={node.id} node={node} view={view} selected={selectedId === node.id} hovered={tooltip?.kind === "node" && tooltip.id === node.id} />
                ))}
              </g>
            </svg>
            {/* Native HTML overlay carrying the real interactive elements, positioned
                with the exact same percentage coordinates as the decorative SVG above
                (which is aria-hidden) — this keeps focus order, ARIA and hit-testing in
                plain HTML/button semantics rather than relying on SVG a11y quirks. It
                lives inside this same aspect-ratio box (not the outer, non-scrolling
                containerRef) so its percentage coordinates always match the SVG's
                rendered box exactly, including while the box itself is horizontally
                scrolled at narrow widths. */}
            {NODES.map((node) => (
              <NodeHitTarget
                key={node.id}
                node={node}
                view={view}
                selected={selectedId === node.id}
                onOpen={openInspector}
                onShowTooltip={showTooltip}
                onHideTooltip={hideTooltip}
                registerRef={(el) => {
                  if (el) nodeButtonRefs.current.set(node.id, el);
                  else nodeButtonRefs.current.delete(node.id);
                }}
              />
            ))}
            {EDGES.map((edge) => (
              <EdgeHitTarget key={edge.id} edge={edge} view={view} onShowTooltip={showTooltip} onHideTooltip={hideTooltip} />
            ))}
          </div>
        </div>
        {/* Popover and tooltip are positioned relative to THIS outer, non-scrolling
            container (via getBoundingClientRect at interaction time), so they stay on
            screen even while the graph box above is scrolled horizontally. */}

        {tooltip ? <ValueTooltip tooltip={tooltip} /> : null}

        {selectedNode && popoverPos ? (
          <NodeInspector node={selectedNode} pos={popoverPos} outbound={outbound} inbound={inbound} onClose={closeInspector} closeBtnRef={closeBtnRef} />
        ) : null}
      </div>

      <p className="mt-3 text-xs font-normal leading-relaxed text-zinc-400">
        Tab through services and connections for exact values read aloud on focus. Every node and edge here is also listed in the{" "}
        <a href="#adjacency-table" className={cx("underline underline-offset-2", FOCUS)}>
          adjacency table
        </a>{" "}
        below.
      </p>
    </div>
  );
}

function Legend({ view }: { view: ViewMode }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
        {view === "tier" ? (
          (["edge", "service", "data"] as TierId[]).map((tier) => {
            const Icon = SHAPE_ICON[tier === "edge" ? "square" : tier === "service" ? "circle" : "diamond"];
            return (
              <span key={tier} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                <Icon size={10} aria-hidden="true" className="text-zinc-400" />
                {TIER_LABEL[tier]}
              </span>
            );
          })
        ) : (
          (["fast", "moderate", "slow"] as LatencyBucket[]).map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <span className="h-2 w-2 rounded-full border border-white/20 bg-zinc-700" aria-hidden="true" />
              {LATENCY_BUCKET_LABEL[b]}
            </span>
          ))
        )}
        <span className="mx-1 h-3 w-px bg-white/10" aria-hidden="true" />
        {(["healthy", "degraded", "down"] as const).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
            <span className={cx("h-2 w-2 rounded-full", STATUS_DOT[s])} aria-hidden="true" />
            {STATUS_LABEL[s]}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
        {(["sync", "async", "data"] as RelationshipCategory[]).map((cat) => {
          const Icon = CATEGORY_ICON[cat];
          return (
            <span key={cat} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <Icon size={10} aria-hidden="true" className="text-zinc-400" />
              {CATEGORY_LABEL[cat]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function pos(node: PositionedNode, view: ViewMode) {
  return view === "tier" ? { x: node.tierX, y: node.tierY } : { x: node.latencyX, y: node.latencyY };
}

function NodeMark({ node, view, selected, hovered }: { node: PositionedNode; view: ViewMode; selected: boolean; hovered: boolean }) {
  const { x, y } = pos(node, view);
  const size = node.tier === "service" ? 22 : 24;
  const active = selected || hovered;
  const statusFill = node.status === "healthy" ? "#34d399" : node.status === "degraded" ? "#fbbf24" : "#fb7185";
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={cx(active ? "text-emerald-400" : "text-zinc-400")} fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.25}>
        <g fill={node.status === "down" ? "#450a0a" : node.status === "degraded" ? "#451a03" : "#09090b"}>{nodeShapeNode(node.shape, size)}</g>
      </g>
      <g transform={`translate(${size / 2 - 1} ${-size / 2 + 1})`} fill={statusFill} stroke="#09090b" strokeWidth={1}>
        {statusMarkerNode(node.status)}
      </g>
      <text y={size / 2 + 13} textAnchor="middle" fontSize={10.5} fontFamily="var(--font-sans)" fontWeight={500} className={selected ? "fill-emerald-300" : "fill-zinc-300"}>
        {node.name.length > 16 ? `${node.name.slice(0, 15)}…` : node.name}
      </text>
    </g>
  );
}

function NodeHitTarget({
  node,
  view,
  selected,
  onOpen,
  onShowTooltip,
  onHideTooltip,
  registerRef,
}: {
  node: PositionedNode;
  view: ViewMode;
  selected: boolean;
  onOpen: (id: string, el: HTMLElement) => void;
  onShowTooltip: (kind: "node" | "edge", id: string, el: HTMLElement) => void;
  onHideTooltip: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const { x, y } = pos(node, view);
  const leftPct = (x / VIEW_W) * 100;
  const topPct = (y / VIEW_H) * 100;
  const size = node.tier === "service" ? 26 : 28;
  return (
    <button
      ref={registerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={selected}
      aria-label={`${node.name}, ${node.team} team, ${STATUS_LABEL[node.status]}. Press Enter to open details.`}
      onClick={(e) => onOpen(node.id, e.currentTarget)}
      onFocus={(e) => onShowTooltip("node", node.id, e.currentTarget)}
      onBlur={onHideTooltip}
      onMouseEnter={(e) => onShowTooltip("node", node.id, e.currentTarget)}
      onMouseLeave={onHideTooltip}
      className={cx("absolute rounded-full", FOCUS, TRANSITION)}
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: "transparent",
      }}
    />
  );
}

function EdgeLine({ edge, view, hovered, selectedId }: { edge: ServiceEdge; view: ViewMode; hovered: boolean; selectedId: string | null }) {
  const a = NODE_BY_ID.get(edge.source);
  const b = NODE_BY_ID.get(edge.target);
  if (!a || !b) return null;
  const pa = pos(a, view);
  const pb = pos(b, view);
  const touchesSelected = selectedId === edge.source || selectedId === edge.target;
  const stroke = hovered ? "#34d399" : STATUS_STROKE[edge.status];
  const width = (hovered ? 1.25 : touchesSelected ? 0.75 : 0) + STATUS_WIDTH[edge.status];
  const category = RELATIONSHIP_CATEGORY[edge.relationship];
  return (
    <line
      x1={pa.x}
      y1={pa.y}
      x2={pb.x}
      y2={pb.y}
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={CATEGORY_DASH[category]}
      strokeLinecap="round"
      opacity={selectedId && !touchesSelected ? 0.35 : 1}
    />
  );
}

function EdgeHitTarget({
  edge,
  view,
  onShowTooltip,
  onHideTooltip,
}: {
  edge: ServiceEdge;
  view: ViewMode;
  onShowTooltip: (kind: "node" | "edge", id: string, el: HTMLElement) => void;
  onHideTooltip: () => void;
}) {
  const a = NODE_BY_ID.get(edge.source);
  const b = NODE_BY_ID.get(edge.target);
  if (!a || !b) return null;
  const pa = pos(a, view);
  const pb = pos(b, view);
  const midX = ((pa.x + pb.x) / 2 / VIEW_W) * 100;
  const midY = ((pa.y + pb.y) / 2 / VIEW_H) * 100;
  const label = `${a.name} to ${b.name}: ${RELATIONSHIP_LABEL[edge.relationship]}, ${edge.latencyMs} millisecond p50 latency, ${STATUS_LABEL[edge.status]}, ${edge.callsPerMin.toLocaleString("en-US")} calls per minute.`;
  return (
    <button
      type="button"
      aria-label={label}
      onFocus={(e) => onShowTooltip("edge", edge.id, e.currentTarget)}
      onBlur={onHideTooltip}
      onMouseEnter={(e) => onShowTooltip("edge", edge.id, e.currentTarget)}
      onMouseLeave={onHideTooltip}
      className={cx("absolute rounded-md", FOCUS, TRANSITION)}
      style={{ left: `${midX}%`, top: `${midY}%`, width: 20, height: 20, transform: "translate(-50%, -50%)", background: "transparent" }}
    />
  );
}

function ValueTooltip({ tooltip }: { tooltip: { kind: "node" | "edge"; id: string; left: number; top: number } }) {
  if (tooltip.kind === "node") {
    const n = NODE_BY_ID.get(tooltip.id);
    if (!n) return null;
    return (
      <div
        role="status"
        className={cx("pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-lg border p-2.5 shadow-lg shadow-black/40", BORDER, PANEL_BG)}
        style={{ left: tooltip.left, top: tooltip.top - 14, transform: "translate(-50%, -100%)" }}
      >
        <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{n.name}</p>
        <p className={cx("mt-0.5 truncate text-[11px]", CODE, "text-zinc-400")}>{n.hostname}</p>
        <dl className={cx("mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]", TEXT_AUX)}>
          <dt>p50</dt>
          <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{n.selfLatencyMs}ms</dd>
          <dt>p99</dt>
          <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{n.p99LatencyMs}ms</dd>
          <dt>Uptime</dt>
          <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{n.uptimePct}%</dd>
        </dl>
      </div>
    );
  }
  const e = EDGES.find((edge) => edge.id === tooltip.id);
  if (!e) return null;
  const a = NODE_BY_ID.get(e.source);
  const b = NODE_BY_ID.get(e.target);
  return (
    <div
      role="status"
      className={cx("pointer-events-none absolute z-20 w-60 -translate-x-1/2 rounded-lg border p-2.5 shadow-lg shadow-black/40", BORDER, PANEL_BG)}
      style={{ left: tooltip.left, top: tooltip.top - 14, transform: "translate(-50%, -100%)" }}
    >
      <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>
        {a?.name} → {b?.name}
      </p>
      <p className="mt-0.5 text-[11px] font-normal text-zinc-400">{RELATIONSHIP_LABEL[e.relationship]}</p>
      <dl className={cx("mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]", TEXT_AUX)}>
        <dt>p50 latency</dt>
        <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{e.latencyMs}ms</dd>
        <dt>Calls/min</dt>
        <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{e.callsPerMin.toLocaleString("en-US")}</dd>
        <dt>Status</dt>
        <dd className="text-right">{STATUS_LABEL[e.status]}</dd>
      </dl>
    </div>
  );
}

function NodeInspector({
  node,
  pos: p,
  outbound,
  inbound,
  onClose,
  closeBtnRef,
}: {
  node: PositionedNode;
  pos: { left: number; top: number };
  outbound: ServiceEdge[];
  inbound: ServiceEdge[];
  onClose: () => void;
  closeBtnRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div
      role="dialog"
      aria-label={`${node.name} details`}
      className={cx("absolute z-30 w-[min(21rem,calc(100vw-2.5rem))] rounded-2xl border p-4 shadow-2xl shadow-black/50", BORDER, PANEL_BG)}
      style={{ left: `clamp(8px, ${p.left}px, calc(100% - 8px))`, top: p.top + 18, transform: "translateX(-50%)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{node.name}</p>
          <p className={cx("mt-0.5 truncate", CODE, "text-zinc-400")} title={node.hostname}>
            {node.hostname}
          </p>
        </div>
        <button type="button" ref={closeBtnRef} onClick={onClose} className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-50", FOCUS, TRANSITION)}>
          <X size={15} aria-hidden="true" />
          <span className="sr-only">Close details for {node.name}</span>
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge className={STATUS_BADGE[node.status]}>{STATUS_LABEL[node.status]}</Badge>
        <Badge>{TIER_LABEL[node.tier]} tier</Badge>
        <Badge>{node.team}</Badge>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
        <Metric label="p50 latency" value={`${node.selfLatencyMs}ms`} />
        <Metric label="p99 latency" value={`${node.p99LatencyMs}ms`} />
        <Metric label="Uptime" value={`${node.uptimePct}%`} />
        <Metric label="Calls / min" value={node.callsPerMin.toLocaleString("en-US")} />
      </dl>

      <div className="mt-3 border-t border-white/10 pt-3">
        <Eyebrow>Dependencies</Eyebrow>
        <ul className="mt-2 flex max-h-40 flex-col gap-1.5 overflow-y-auto [scrollbar-width:thin]">
          {outbound.map((e) => (
            <DepRow key={e.id} edge={e} direction="out" otherId={e.target} />
          ))}
          {inbound.map((e) => (
            <DepRow key={e.id} edge={e} direction="in" otherId={e.source} />
          ))}
          {outbound.length === 0 && inbound.length === 0 ? <li className="text-xs font-normal text-zinc-400">No direct dependencies.</li> : null}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">{label}</dt>
      <dd className={cx("text-base font-semibold", NUM, TEXT_PRIMARY)}>{value}</dd>
    </div>
  );
}

function DepRow({ edge, direction, otherId }: { edge: ServiceEdge; direction: "in" | "out"; otherId: string }) {
  const other = NODE_BY_ID.get(otherId);
  const Icon = direction === "out" ? ArrowUpRight : ArrowDownRight;
  return (
    <li className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5 text-xs">
      <Icon size={13} aria-hidden="true" className={direction === "out" ? "text-emerald-400" : "text-sky-400"} />
      <span className="min-w-0 flex-1 truncate font-medium text-zinc-50">{other?.name ?? otherId}</span>
      <span className="shrink-0 text-zinc-400">{RELATIONSHIP_LABEL[edge.relationship]}</span>
      <span className={cx("shrink-0", NUM, "text-zinc-400")}>{edge.latencyMs}ms</span>
    </li>
  );
}
