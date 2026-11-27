"use client";

import type { KeyboardEvent } from "react";
import {
  EDGES,
  NEEDS,
  PRODUCTS,
  edgeFor,
  edgesForNeed,
  type NeedId,
  type ProductId,
} from "./data";
import { ACCENT_BASE, ACCENT_BRIGHT, EDGE_INACTIVE, FOCUS, INK } from "./ui";

// Fixed layout -- hand-placed, not computed at runtime, so there is nothing for server and client
// to disagree on. ViewBox is 400x540 and deliberately close to the smallest real rendered width
// this graph ever hits (mobile, ~340-360px), so a node's SVG-unit radius maps to a near-1:1 CSS
// pixel radius at the narrowest breakpoint and only gets larger (never smaller) on wider screens --
// that keeps every node's tap target comfortably clear of the 24x24px minimum at every width.
const VIEW_W = 400;
const VIEW_H = 540;

const NEED_POS: Record<NeedId, { x: number; y: number }> = {
  budget: { x: 54, y: 72 },
  condition: { x: 54, y: 202 },
  brand: { x: 54, y: 332 },
  "ships-fast": { x: 54, y: 462 },
};
const NEED_R = 19;

const PRODUCT_POS: Record<ProductId, { x: number; y: number }> = {
  "jordan-1": { x: 338, y: 46 },
  "yeezy-350": { x: 352, y: 136 },
  "nb-550": { x: 330, y: 226 },
  "dunk-low": { x: 350, y: 316 },
  "bape-hoodie": { x: 328, y: 406 },
  rayban: { x: 344, y: 496 },
};
// 16 (not a smaller, more "proportionate" dot) is deliberate: at the narrowest real render width
// (390px viewport, ~350px available, scale ~0.875 against this 400-wide viewBox) a 32-unit diameter
// still clears the 24x24 CSS px minimum tap target (32 * 0.875 = 28px) with real margin, not just
// barely.
const PRODUCT_R = 16;

const SHORT_NAME: Record<ProductId, string> = {
  "jordan-1": "Jordan 1",
  "yeezy-350": "Yeezy 350",
  "nb-550": "NB 550",
  "dunk-low": "Dunk Low",
  "bape-hoodie": "BAPE Hoodie",
  rayban: "Ray-Ban",
};

function lerp(a: number, b: number, t: number): number {
  return Math.round((a + (b - a) * t) * 100) / 100;
}

type Props = {
  activeNeedId: NeedId;
  activeProductId: ProductId;
  onSelectNeed: (id: NeedId) => void;
  onSelectProduct: (id: ProductId) => void;
};

export default function ConstellationGraph({
  activeNeedId,
  activeProductId,
  onSelectNeed,
  onSelectProduct,
}: Props) {
  const activeEdges = edgesForNeed(activeNeedId);
  const activeProductIds = new Set(activeEdges.map((e) => e.productId));

  function activateNeed(id: NeedId) {
    onSelectNeed(id);
  }
  function activateProduct(id: ProductId) {
    if (activeProductIds.has(id)) onSelectProduct(id);
  }
  function keyActivate(fn: () => void) {
    return (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        style={{ height: "auto" }}
        role="group"
        aria-label="Buyer-need to listing match graph. Activate a need button to see its matching listings; the full data also appears as a table below."
      >
        {/* Pass 1: every edge not touching the active need -- flat, uniform, no strength implied. */}
        {EDGES.filter((e) => e.needId !== activeNeedId).map((e) => {
          const a = NEED_POS[e.needId];
          const b = PRODUCT_POS[e.productId];
          return (
            <line
              key={`${e.needId}-${e.productId}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={EDGE_INACTIVE}
              strokeWidth={1}
            />
          );
        })}

        {/* Pass 2: the active need's own edges, drawn on top. Width scales with strength, and the
            strength is also always printed as a number next to the line -- never color/opacity
            alone. The selected edge is drawn last, brightest and thickest, so it reads as "on top"
            of its two siblings even where lines cross. */}
        {activeEdges
          .slice()
          .sort((x, y) => (x.productId === activeProductId ? 1 : y.productId === activeProductId ? -1 : 0))
          .map((e) => {
            const a = NEED_POS[e.needId];
            const b = PRODUCT_POS[e.productId];
            const isSelected = e.productId === activeProductId;
            const t = 0.56;
            const mx = lerp(a.x, b.x, t);
            const my = lerp(a.y, b.y, t);
            const labelW = isSelected ? 30 : 26;
            const labelH = isSelected ? 17 : 15;
            return (
              <g key={`${e.needId}-${e.productId}-active`}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={isSelected ? ACCENT_BRIGHT : ACCENT_BASE}
                  strokeWidth={isSelected ? 3.5 : 1.5 + e.strength / 60}
                  strokeLinecap="round"
                />
                <rect
                  x={mx - labelW / 2}
                  y={my - labelH / 2}
                  width={labelW}
                  height={labelH}
                  rx={4}
                  fill="#0B0B0F"
                  stroke={isSelected ? ACCENT_BRIGHT : ACCENT_BASE}
                  strokeWidth={1}
                />
                <text
                  x={mx}
                  y={my}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isSelected ? 10.5 : 9}
                  fontWeight={600}
                  fill={isSelected ? ACCENT_BRIGHT : ACCENT_BASE}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {e.strength}%
                </text>
              </g>
            );
          })}

        {/* Product nodes */}
        {PRODUCTS.map((p) => {
          const pos = PRODUCT_POS[p.id];
          const connected = activeProductIds.has(p.id);
          const selected = p.id === activeProductId;
          return (
            <g key={p.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={selected ? PRODUCT_R + 3 : PRODUCT_R}
                fill={selected ? ACCENT_BRIGHT : "#131318"}
                stroke={connected ? (selected ? INK : ACCENT_BASE) : EDGE_INACTIVE}
                strokeWidth={connected ? (selected ? 3 : 2) : 1.5}
                tabIndex={connected ? 0 : -1}
                role={connected ? "button" : undefined}
                aria-hidden={connected ? undefined : true}
                aria-pressed={connected ? selected : undefined}
                aria-label={
                  connected
                    ? `Show full match detail for ${p.name}, ${edgeFor(activeNeedId, p.id)?.strength}% match on ${NEEDS.find((n) => n.id === activeNeedId)?.label}`
                    : undefined
                }
                onClick={connected ? () => activateProduct(p.id) : undefined}
                onKeyDown={connected ? keyActivate(() => activateProduct(p.id)) : undefined}
                className={
                  connected
                    ? `cursor-pointer transition-[fill,stroke,r] focus-visible:stroke-white focus-visible:[stroke-width:4px] ${FOCUS}`
                    : "transition-[fill,stroke,r]"
                }
                style={{ pointerEvents: connected ? "auto" : "none" }}
              />
              <text
                x={pos.x}
                y={pos.y + PRODUCT_R + 13}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={connected ? 600 : 400}
                fill={connected ? "#E4E4E7" : "#A1A1AA"}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {SHORT_NAME[p.id]}
              </text>
            </g>
          );
        })}

        {/* Need nodes -- always interactive, drawn last so they sit above every line's left end. */}
        {NEEDS.map((n) => {
          const pos = NEED_POS[n.id];
          const active = n.id === activeNeedId;
          return (
            <g key={n.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={active ? NEED_R + 2 : NEED_R}
                fill={active ? ACCENT_BRIGHT : "#131318"}
                stroke={active ? INK : ACCENT_BASE}
                strokeWidth={active ? 3 : 2.5}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`Focus the ${n.label} need — ${edgesForNeed(n.id).length} matching listings`}
                onClick={() => activateNeed(n.id)}
                onKeyDown={keyActivate(() => activateNeed(n.id))}
                className={`cursor-pointer transition-[fill,stroke,r] focus-visible:stroke-white focus-visible:[stroke-width:4px] ${FOCUS}`}
              />
              <text
                x={pos.x}
                y={pos.y + NEED_R + 15}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={active ? "#F4F4F5" : "#D4D4D8"}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export { NEED_POS, PRODUCT_POS, SHORT_NAME };
