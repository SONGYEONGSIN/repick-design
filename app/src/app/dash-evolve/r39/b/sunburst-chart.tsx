"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  type CostNode,
  REGION_HUES,
  formatCurrency,
  formatPercent,
} from "./cost-data";

const SIZE = 560;
const CENTER = 280;
const HUB_R = 64;
const RING1_INNER = 70;
const RING1_OUTER = 158;
const RING2_INNER = 164;
const RING2_OUTER = 234;
const START_ANGLE = -Math.PI / 2;
const GAP = 0.014;
const RING1_LABEL_MIN_DEG = 28;
const RING2_LABEL_MIN_DEG = 38;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function polar(r: number, angle: number): [number, number] {
  return [round2(CENTER + r * Math.cos(angle)), round2(CENTER + r * Math.sin(angle))];
}

function arcPath(innerR: number, outerR: number, startAngle: number, endAngle: number): string {
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  const [x1, y1] = polar(outerR, startAngle);
  const [x2, y2] = polar(outerR, endAngle);
  const [x3, y3] = polar(innerR, endAngle);
  const [x4, y4] = polar(innerR, startAngle);
  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
}

interface Wedge {
  key: string;
  node: CostNode;
  chain: CostNode[];
  ring: 1 | 2;
  start: number;
  end: number;
  color: string;
  share: number;
  parentName: string;
}

function buildWedges(focus: CostNode, branchHue: string | null): Wedge[] {
  const children = focus.children ?? [];
  if (children.length === 0) return [];
  const total = focus.value;
  const wedges: Wedge[] = [];
  let angle = START_ANGLE;

  children.forEach((child, i) => {
    const span = (child.value / total) * (Math.PI * 2);
    const hueKey = branchHue ?? child.id;
    const ramp = REGION_HUES[hueKey] ?? REGION_HUES["us-east"];
    wedges.push({
      key: child.id,
      node: child,
      chain: [child],
      ring: 1,
      start: angle + GAP / 2,
      end: angle + span - GAP / 2,
      color: ramp[i % ramp.length],
      share: (child.value / total) * 100,
      parentName: focus.name,
    });

    const grandchildren = child.children ?? [];
    if (grandchildren.length > 0) {
      let gAngle = angle;
      grandchildren.forEach((grand, gi) => {
        const gSpan = (grand.value / child.value) * span;
        const gHueKey = branchHue ?? child.id;
        const gRamp = REGION_HUES[gHueKey] ?? REGION_HUES["us-east"];
        wedges.push({
          key: `${child.id}__${grand.id}`,
          node: grand,
          chain: [child, grand],
          ring: 2,
          start: gAngle + GAP / 2,
          end: gAngle + gSpan - GAP / 2,
          color: gRamp[gi % gRamp.length],
          share: (grand.value / child.value) * 100,
          parentName: child.name,
        });
        gAngle += gSpan;
      });
    }

    angle += span;
  });

  return wedges;
}

function degSpan(w: Wedge): number {
  return ((w.end - w.start) * 180) / Math.PI;
}

interface Inspected {
  name: string;
  value: number;
  share: number;
  parentName: string;
}

export interface SunburstChartProps {
  path: CostNode[];
  onSetPath: (next: CostNode[]) => void;
}

export default function SunburstChart({ path, onSetPath }: SunburstChartProps) {
  const focus = path[path.length - 1];
  const branchHue = path.length >= 2 ? path[1].id : null;
  const wedges = buildWedges(focus, branchHue);
  const canGoBack = path.length > 1;

  const [inspected, setInspected] = useState<Inspected | null>(null);

  // Adjust state during render (not in an effect) when the PROP `path` changes,
  // so a stale hover/focus readout from the previous focus level never lingers.
  const [prevFocusId, setPrevFocusId] = useState(focus.id);
  if (prevFocusId !== focus.id) {
    setPrevFocusId(focus.id);
    if (inspected !== null) {
      setInspected(null);
    }
  }

  const handleDrill = (chain: CostNode[]) => {
    setInspected(null);
    onSetPath([...path, ...chain]);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    setInspected(null);
    onSetPath(path.slice(0, -1));
  };

  return (
    <div className="flex min-w-0 flex-col items-center gap-4">
      <div className="relative mx-auto w-full max-w-[560px]">
        <p className="sr-only font-normal">
          Sunburst breakdown of {focus.name}, totaling {formatCurrency(focus.value)}. Each ring segment below is a
          focusable, clickable control describing its own name, value and share.
        </p>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="aspect-square w-full" focusable="false">
          <circle cx={CENTER} cy={CENTER} r={RING1_OUTER + 2} fill="none" stroke="#f4f4f5" strokeWidth={1} />
          {wedges.map((w) => {
            const span = degSpan(w);
            const minDeg = w.ring === 1 ? RING1_LABEL_MIN_DEG : RING2_LABEL_MIN_DEG;
            const showLabel = span >= minDeg;
            const innerR = w.ring === 1 ? RING1_INNER : RING2_INNER;
            const outerR = w.ring === 1 ? RING1_OUTER : RING2_OUTER;
            const mid = (w.start + w.end) / 2;
            const labelR = (innerR + outerR) / 2;
            const [lx, ly] = polar(labelR, mid);
            return (
              <g key={w.key}>
                <path
                  d={arcPath(innerR, outerR, w.start, w.end)}
                  fill={w.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  role="button"
                  tabIndex={0}
                  aria-label={`${w.node.name}: ${formatCurrency(w.node.value)}, ${formatPercent(w.share)} of ${w.parentName}${w.node.children ? ". Activate to drill in." : ""}`}
                  className="cursor-pointer outline-offset-2 transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-orange-600 motion-reduce:transition-none"
                  onClick={() => handleDrill(w.chain)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleDrill(w.chain);
                    }
                  }}
                  onMouseEnter={() =>
                    setInspected({ name: w.node.name, value: w.node.value, share: w.share, parentName: w.parentName })
                  }
                  onMouseLeave={() => setInspected(null)}
                  onFocus={() =>
                    setInspected({ name: w.node.name, value: w.node.value, share: w.share, parentName: w.parentName })
                  }
                  onBlur={() => setInspected(null)}
                />
                {showLabel && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={w.ring === 1 ? 13 : 11}
                    className="select-none font-medium"
                    style={{
                      paintOrder: "stroke",
                      stroke: "rgba(15,23,42,0.55)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                    aria-hidden="true"
                  >
                    <tspan x={lx} dy="-0.3em">
                      {w.node.name}
                    </tspan>
                    <tspan x={lx} dy="1.2em" fontSize={w.ring === 1 ? 11 : 9.5} className="font-normal tabular-nums">
                      {formatCurrency(w.node.value)} &middot; {formatPercent(w.share)}
                    </tspan>
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: `${((HUB_R * 2) / SIZE) * 100}%`,
            height: `${((HUB_R * 2) / SIZE) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {canGoBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-full border border-zinc-200 bg-white text-center shadow-sm outline-offset-2 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-orange-600 motion-reduce:transition-none"
              aria-label={`Go back to ${path[path.length - 2]?.name ?? "overview"}`}
            >
              <ArrowUp className="h-4 w-4 text-zinc-600" aria-hidden="true" />
              <span className="text-[10px] font-medium text-zinc-600">Back</span>
            </button>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-full border border-zinc-200 bg-white text-center shadow-sm">
              <span className="text-[10px] font-normal text-zinc-500">Total</span>
              <span className="text-sm font-bold tabular-nums text-zinc-900">
                {formatCurrency(focus.value)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[72px] w-full max-w-md rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-center" aria-live="polite">
        {inspected ? (
          <>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">Inspecting</p>
            <p className="text-sm font-bold text-zinc-900">{inspected.name}</p>
            <p className="text-sm font-normal tabular-nums text-zinc-600">
              {formatCurrency(inspected.value)} &middot; {formatPercent(inspected.share)} of {inspected.parentName}
            </p>
          </>
        ) : (
          <p className="text-sm font-normal text-zinc-500">Hover or focus (Tab) a segment to inspect its exact value and share.</p>
        )}
      </div>
    </div>
  );
}
