"use client";

import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import { formatPct, formatUSD, pctOfParent, pctOfTotal, type RevNode } from "./data";
import { ACCENT_HEX, ACCENT_HEX_700, TEXT_AUX, cx, r2 } from "./tokens";

const SIZE = 296;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_HUB = 56;
const RING1_INNER = 60;
const RING1_OUTER = 104;
const RING2_INNER = 108;
const RING2_OUTER = 148;

interface Arc {
  node: RevNode;
  a0: number;
  a1: number;
  ring: 1 | 2;
}

/** Proportion `nodes` across [a0, a1] by value, inset by a small pad so adjacent
 *  wedges read as separate shapes rather than one continuous ring. */
function partition(nodes: RevNode[], a0: number, a1: number, pad: number): Omit<Arc, "ring">[] {
  const total = nodes.reduce((s, n) => s + n.value, 0) || 1;
  const span = a1 - a0;
  let cursor = a0;
  return nodes.map((n) => {
    const raw0 = cursor;
    const raw1 = cursor + (n.value / total) * span;
    cursor = raw1;
    const inset = nodes.length > 1 ? Math.min(pad, (raw1 - raw0) * 0.12) : 0;
    return { node: n, a0: r2(raw0 + inset / 2), a1: r2(raw1 - inset / 2) };
  });
}

function polar(r: number, angle: number): [number, number] {
  return [r2(CX + r * Math.sin(angle)), r2(CY - r * Math.cos(angle))];
}

function wedgePath(rInner: number, rOuter: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(rOuter, a0);
  const [x1, y1] = polar(rOuter, a1);
  const [x2, y2] = polar(rInner, a1);
  const [x3, y3] = polar(rInner, a0);
  return `M${x0},${y0} A${rOuter},${rOuter} 0 ${largeArc} 1 ${x1},${y1} L${x2},${y2} A${rInner},${rInner} 0 ${largeArc} 0 ${x3},${y3} Z`;
}

/** Near-monochrome fill: every arc is the same violet hue, distinguished from its
 *  siblings only by lightness — depth 1 (region) reads darkest/most saturated,
 *  depth 2 (channel) a paler tint, so the ring itself communicates hierarchy
 *  before any label or color-key is read. */
function shade(depth: number, index: number, count: number): string {
  const spread = count > 1 ? index / (count - 1) : 0;
  if (depth === 1) {
    const l = 40 + spread * 16; // 40%..56%
    return `hsl(262 72% ${r2(l)}%)`;
  }
  const l = 68 + spread * 18; // 68%..86%
  return `hsl(262 55% ${r2(l)}%)`;
}

export default function Sunburst({
  visibleRoot,
  hoverId,
  onHover,
  onActivate,
  canZoomOut,
  onZoomOut,
}: {
  visibleRoot: RevNode;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onActivate: (node: RevNode) => void;
  canZoomOut: boolean;
  onZoomOut: () => void;
}) {
  const { ring1, ring2 } = useMemo(() => {
    const children = visibleRoot.children ?? [];
    const r1 = partition(children, 0, Math.PI * 2, 0.05).map((a) => ({ ...a, ring: 1 as const }));
    const r2Arcs: Arc[] = [];
    for (const c of children) {
      const grandchildren = c.children ?? [];
      if (grandchildren.length === 0) continue;
      const parentArc = r1.find((a) => a.node.id === c.id)!;
      for (const a of partition(grandchildren, parentArc.a0, parentArc.a1, 0.025)) {
        r2Arcs.push({ ...a, ring: 2 });
      }
    }
    return { ring1: r1, ring2: r2Arcs };
  }, [visibleRoot]);

  const hoverNode = hoverId ? [...ring1, ...ring2].find((a) => a.node.id === hoverId)?.node ?? null : null;

  function labelFor(a: Arc): string | null {
    if (a.ring !== 1) return null;
    if (a.a1 - a.a0 < 0.5) return null; // ~29deg minimum before an inline label fits
    return a.node.label;
  }

  const hubValue = visibleRoot.value;
  const hubPct = pctOfTotal(hubValue);

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height={SIZE} role="img" aria-label={`Revenue mix sunburst, currently showing ${visibleRoot.label}, ${formatUSD(hubValue)}, ${formatPct(hubPct)} of total processed volume`} className="mx-auto max-w-[296px]">
        {/* Ring 2 (grandchildren) intentionally skips tabIndex/role/keyboard handlers: at this
            radius some wedges are only a few px across, and giving every one of them a focus
            stop would fail Lighthouse's target-size audit (<24px tap target). Every node ring 2
            can show is still fully keyboard-reachable two ways: drill down ring-by-ring from
            ring 1 (each ring is re-normalized to the full circle, so it's never this thin), or
            use the indented list below, whose rows are real full-width buttons. Ring 2 here is a
            mouse-only shortcut layer on top of that, not the only path to any node. */}
        {ring2.map((a, i) => {
          const isHover = hoverId === a.node.id;
          return (
            <path
              key={`r2-${a.node.id}`}
              d={wedgePath(RING2_INNER, RING2_OUTER, a.a0, a.a1)}
              fill={shade(2, i, ring2.length)}
              stroke="#ffffff"
              strokeWidth={1}
              opacity={hoverId && !isHover ? 0.55 : 1}
              className="cursor-pointer"
              onMouseEnter={() => onHover(a.node.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onActivate(a.node)}
            >
              <title>{`${a.node.label}, ${formatUSD(a.node.value)}, ${formatPct(pctOfTotal(a.node.value))} of total`}</title>
            </path>
          );
        })}
        {ring1.map((a, i) => {
          const isHover = hoverId === a.node.id;
          const label = labelFor(a);
          const mid = (a.a0 + a.a1) / 2;
          const [lx, ly] = polar((RING1_INNER + RING1_OUTER) / 2, mid);
          return (
            <g key={`r1-${a.node.id}`}>
              <path
                d={wedgePath(RING1_INNER, RING1_OUTER, a.a0, a.a1)}
                fill={shade(1, i, ring1.length)}
                stroke="#ffffff"
                strokeWidth={1.5}
                opacity={hoverId && !isHover ? 0.6 : 1}
                tabIndex={0}
                role="button"
                aria-label={`${a.node.label}, ${formatUSD(a.node.value)}, ${formatPct(pctOfTotal(a.node.value))} of total`}
                className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-700"
                onMouseEnter={() => onHover(a.node.id)}
                onFocus={() => onHover(a.node.id)}
                onMouseLeave={() => onHover(null)}
                onBlur={() => onHover(null)}
                onClick={() => onActivate(a.node)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onActivate(a.node);
                  }
                }}
              />
              {label ? (
                <text x={lx} y={ly} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="#ffffff" pointerEvents="none">
                  {label}
                </text>
              ) : null}
            </g>
          );
        })}

        {canZoomOut ? (
          <>
            <circle
              cx={CX}
              cy={CY}
              r={R_HUB}
              fill="#f5f3ff"
              stroke="#ddd6fe"
              strokeWidth={1.5}
              tabIndex={0}
              role="button"
              aria-label={`Zoom out from ${visibleRoot.label}`}
              className="cursor-pointer outline-none focus-visible:stroke-2 focus-visible:stroke-violet-700"
              onClick={onZoomOut}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onZoomOut();
                }
              }}
            />
            <g transform={`translate(${CX - R_HUB + 10}, ${CY - 8})`} pointerEvents="none">
              <ChevronLeft size={16} color={ACCENT_HEX} aria-hidden="true" />
            </g>
          </>
        ) : (
          <circle cx={CX} cy={CY} r={R_HUB} fill="#f5f3ff" stroke="#ddd6fe" strokeWidth={1.5} />
        )}
        {/* 600. 이 한 노드만 700 이라 작품 렌더 웨이트가 4종이 되어 정본(정확히 3종)을 어겼다
            — 같은 파일이 이미 600·500 을 쓴다(2026-09-20 승격 시 §3-1 해소). */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={ACCENT_HEX_700}>
          {visibleRoot.label.length > 14 ? `${visibleRoot.label.slice(0, 13)}…` : visibleRoot.label}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize={11} fontWeight={500} fill={ACCENT_HEX}>
          {`${formatPct(hubPct, 0)} · ${formatUSD(hubValue)}`}
        </text>
      </svg>

      {/* Standing text, always visible — the brief's "핵심 값 상시 텍스트" requirement for a
          single dominant visualization. Exact % and value below repeat what the hub already
          shows so the number survives even if the SVG doesn't render for some reason. */}
      <div aria-live="polite" className={cx("mt-2 min-h-[2.25rem] rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] font-normal", TEXT_AUX)}>
        {hoverNode
          ? `${hoverNode.label}: ${formatUSD(hoverNode.value)} — ${formatPct(pctOfTotal(hoverNode.value))} of total, ${formatPct(pctOfParent(hoverNode.value, visibleRoot.value))} of ${visibleRoot.label}`
          : `Showing ${visibleRoot.label} · ${formatUSD(hubValue)} · ${formatPct(hubPct)} of total processed volume. Hover or focus a wedge for its exact share.`}
      </div>
    </div>
  );
}
