"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Diamond, Square } from "lucide-react";
import {
  ALL_EDGES,
  CONCENTRATION_RISK_IDS,
  FLAT_ORDER,
  LAID_OUT_NODES,
  NODE_BY_ID,
  RISK_BAND_LABEL,
  SITES,
  TIER1,
  TIER2,
  TIER_LABEL,
  TOTAL_ANNUAL_SPEND_USD,
  edgesTouching,
  isConcentrationRisk,
  isSupplierNode,
  neighborsOf,
  riskBand,
  usdCompact,
  type GraphNodeData,
} from "./data";
import { FOCUS_RING } from "./focus";
import { riskBandClass } from "./ui";

const NODE_SIZE: Record<GraphNodeData["tier"], number> = { site: 46, tier1: 38, tier2: 28 };

// Tier-2 nodes get their 45° rotation from the inline `transform` below (which also carries the
// center-anchoring translate), so only the corner radius belongs here — a Tailwind `rotate-45`
// class on the same element would just be overridden by that inline style.
function shapeClassFor(tier: GraphNodeData["tier"]): string {
  if (tier === "site") return "rounded-md";
  if (tier === "tier1") return "rounded-full";
  return "rounded-[3px]";
}

/** The dominant visualization's headline numbers — rendered once, outside the Graph/Table tab
 *  switch, so they stay persistent text no matter which view is active. Never hidden until
 *  hover, per the network-graph completeness rule. */
export function NetworkHeadlineStats() {
  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <StatTile label="Total nodes" value={String(LAID_OUT_NODES.length)} display />
      <StatTile label="Network tiers" value="3" />
      <StatTile label="Concentration risk" value={String(CONCENTRATION_RISK_IDS.size)} icon={AlertTriangle} tone="text-orange-300" />
      <StatTile label="Annual spend" value={usdCompact(TOTAL_ANNUAL_SPEND_USD)} display />
    </dl>
  );
}

export function GraphView({
  pinnedId,
  onPin,
}: {
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const [rovingId, setRovingId] = useState<string>(pinnedId);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const nodeRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Keep keyboard entry starting at whichever node is currently pinned, even when the pin
  // changes from elsewhere (the adjacency table or the command palette) — adjusted during
  // render (React's documented pattern for syncing state to a changed prop), not inside an
  // effect, so there is no extra commit/cascading render.
  const prevPinnedIdRef = useRef(pinnedId);
  if (prevPinnedIdRef.current !== pinnedId) {
    prevPinnedIdRef.current = pinnedId;
    setRovingId(pinnedId);
  }

  const activeId = hoverId ?? focusId;
  const activeLayout = activeId ? LAID_OUT_NODES.find((l) => l.node.id === activeId) ?? null : null;
  const touchingEdgeKeys = activeId ? edgesTouching(activeId) : null;

  function moveFocus(fromId: string, key: string) {
    const idx = FLAT_ORDER.indexOf(fromId);
    let next = idx;
    if (key === "ArrowRight" || key === "ArrowDown") next = (idx + 1) % FLAT_ORDER.length;
    else if (key === "ArrowLeft" || key === "ArrowUp") next = (idx - 1 + FLAT_ORDER.length) % FLAT_ORDER.length;
    else if (key === "Home") next = 0;
    else if (key === "End") next = FLAT_ORDER.length - 1;
    else return;
    const nextId = FLAT_ORDER[next];
    setRovingId(nextId);
    nodeRefs.current.get(nextId)?.focus();
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-normal text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <Square aria-hidden="true" className="size-3 shrink-0 rounded-[2px] border border-zinc-300" /> Site —{" "}
          {SITES.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block size-3 shrink-0 rounded-full border border-zinc-300" /> Tier-1
          supplier — {TIER1.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Diamond aria-hidden="true" className="size-3 shrink-0" /> Tier-2 sub-supplier — {TIER2.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-0 w-3 border-t border-dashed border-orange-400" /> dashed
          border = elevated risk band
        </span>
      </p>

      <div
        role="group"
        aria-label="Vendor dependency graph. Use arrow keys to move between nodes, Enter to inspect a node."
        className="relative h-[360px] w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/40 sm:h-[420px] lg:h-[480px] xl:h-[540px]"
      >
        <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="absolute inset-0 h-full w-full">
          {ALL_EDGES.map((e) => {
            const a = NODE_BY_ID.get(e.source);
            const b = NODE_BY_ID.get(e.target);
            const la = LAID_OUT_NODES.find((l) => l.node.id === e.source);
            const lb = LAID_OUT_NODES.find((l) => l.node.id === e.target);
            if (!a || !b || !la || !lb) return null;
            const key = `${e.source}__${e.target}`;
            const concentrated = e.kind === "dependency" && isConcentrationRisk(e.target);
            const isTouching = touchingEdgeKeys?.has(key) ?? false;
            const strokeWidth = e.kind === "spend" ? Math.max(0.6, Math.sqrt(e.spendUsd ?? 0) / 900) : concentrated ? 1.4 : 0.8;
            const baseColor = concentrated ? "rgba(196,181,253,0.55)" : "rgba(255,255,255,0.16)";
            const activeColor = "rgba(196,181,253,0.95)";
            return (
              <line
                key={key}
                x1={la.x}
                y1={la.y}
                x2={lb.x}
                y2={lb.y}
                stroke={isTouching ? activeColor : baseColor}
                strokeWidth={isTouching ? strokeWidth + 1 : strokeWidth}
                strokeDasharray={concentrated ? "4 3" : undefined}
              />
            );
          })}
        </svg>

        {LAID_OUT_NODES.map((l) => {
          const n = l.node;
          const size = NODE_SIZE[n.tier];
          const supplier = isSupplierNode(n) ? n : null;
          const band = supplier ? riskBand(supplier.riskScore) : null;
          const c = band ? riskBandClass(band) : { text: "text-zinc-200", bg: "bg-white/5", border: "border-white/15" };
          const concentrated = isConcentrationRisk(n.id);
          const pinned = pinnedId === n.id;
          const isActive = activeId === n.id;
          const shapeClass = shapeClassFor(n.tier);
          const { upstream, downstream } = neighborsOf(n.id);

          return (
            <button
              key={n.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(n.id, el);
                else nodeRefs.current.delete(n.id);
              }}
              type="button"
              id={`node-${n.id}`}
              tabIndex={rovingId === n.id ? 0 : -1}
              aria-describedby="graph-tooltip"
              onClick={() => onPin(n.id)}
              onKeyDown={(e) => moveFocus(n.id, e.key)}
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId((cur) => (cur === n.id ? null : cur))}
              onFocus={() => {
                setRovingId(n.id);
                setFocusId(n.id);
              }}
              onBlur={() => setFocusId((cur) => (cur === n.id ? null : cur))}
              style={{
                left: `${l.xPct}%`,
                top: `${l.yPct}%`,
                width: size,
                height: size,
                transform: n.tier === "tier2" ? "translate(-50%, -50%) rotate(45deg)" : "translate(-50%, -50%)",
                transitionProperty: "box-shadow, border-color",
              }}
              className={`${FOCUS_RING} absolute flex items-center justify-center border text-[10px] font-semibold tabular-nums transition-shadow motion-reduce:transition-none ${shapeClass} ${c.text} ${c.bg} ${
                pinned ? "border-2 border-violet-400" : c.border
              } ${isActive ? "shadow-[0_0_0_3px_rgba(167,139,250,0.45)]" : ""}`}
            >
              <span style={{ transform: n.tier === "tier2" ? "rotate(-45deg)" : undefined }}>
                {supplier ? supplier.riskScore : n.code}
              </span>
              <span className="sr-only">
                {" "}
                — {n.name}, {TIER_LABEL[n.tier]}, {n.category}, {n.country}.
                {band ? ` Risk score ${supplier?.riskScore} of 100, ${RISK_BAND_LABEL[band]} band.` : " Internal site."}
                {concentrated ? " Flagged as a concentration-risk sub-supplier." : ""}{" "}
                {upstream.length} upstream connection{upstream.length === 1 ? "" : "s"}, {downstream.length} downstream
                connection{downstream.length === 1 ? "" : "s"}. Press Enter to inspect.
              </span>
            </button>
          );
        })}

        <GraphTooltip layout={activeLayout} />
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  display = false,
  icon: Icon,
  tone = "text-zinc-50",
}: {
  label: string;
  value: string;
  display?: boolean;
  icon?: typeof AlertTriangle;
  tone?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <dt className="flex items-center gap-1 text-[11px] font-normal text-zinc-400">
        {Icon && <Icon aria-hidden="true" className={`size-3 shrink-0 ${tone}`} />}
        <span className="min-w-0 truncate">{label}</span>
      </dt>
      <dd
        className={`mt-0.5 truncate text-lg font-semibold tabular-nums ${tone}`}
        style={display ? { fontFamily: "var(--font-display-mono)" } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

function GraphTooltip({ layout }: { layout: { node: GraphNodeData; xPct: number; yPct: number } | null }) {
  const supplier = layout && isSupplierNode(layout.node) ? layout.node : null;
  const band = supplier ? riskBand(supplier.riskScore) : null;
  return (
    <div
      id="graph-tooltip"
      role="status"
      className="pointer-events-none absolute z-20 w-48 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs shadow-2xl shadow-black/60 transition-opacity motion-reduce:transition-none"
      style={{
        left: layout ? `clamp(12%, ${layout.xPct}%, 88%)` : "50%",
        top: layout ? `clamp(10%, ${layout.yPct}%, 85%)` : "50%",
        transform: layout && layout.yPct > 50 ? "translate(-50%, calc(-100% - 14px))" : "translate(-50%, 14px)",
        opacity: layout ? 1 : 0,
      }}
    >
      {layout && (
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
            {layout.node.code} &middot; {TIER_LABEL[layout.node.tier]}
          </p>
          <p className="truncate font-semibold text-zinc-50">{layout.node.name}</p>
          <p className="truncate font-normal text-zinc-400">
            {layout.node.category} &middot; {layout.node.country}
          </p>
          {band && supplier && (
            <p className="truncate font-normal tabular-nums text-zinc-300">
              Risk {supplier.riskScore}/100 &middot; {RISK_BAND_LABEL[band]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
