"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Gauge,
  ShieldCheck,
  Tag,
  UserCheck,
  TrendingUp,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import {
  AXES,
  DEFAULT_WEIGHTS,
  type AxisId,
  type SignalState,
} from "./data";
import { ACCENT, ACCENT_TINT, FOCUS_RING } from "./tokens";

const AXIS_ICON: Record<AxisId, LucideIcon> = {
  condition: Gauge,
  authenticity: ShieldCheck,
  priceFit: Tag,
  sellerTrust: UserCheck,
  demandVelocity: TrendingUp,
};

// SIZE leaves enough margin beyond MAX_R for the axis-label text (which can run
// ~60px past its anchor point on the longest label, "Demand") to stay inside
// the SVG's own clip box rather than being cut off at the viewBox edge.
const SIZE = 520;
const CENTER = SIZE / 2;
const MAX_R = 150;
const RINGS = [0.25, 0.5, 0.75, 1];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function angleFor(index: number) {
  return -Math.PI / 2 + index * ((2 * Math.PI) / AXES.length);
}

function pointFor(index: number, radiusFraction: number) {
  const angle = angleFor(index);
  const r = MAX_R * radiusFraction;
  return {
    x: round2(CENTER + r * Math.cos(angle)),
    y: round2(CENTER + r * Math.sin(angle)),
  };
}

function polygonPoints(values: number[]) {
  return values
    .map((v, i) => {
      const p = pointFor(i, Math.max(0, Math.min(1, v / 100)));
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

function labelAnchor(index: number): { anchor: "start" | "middle" | "end"; dy: number } {
  const angle = angleFor(index);
  const cos = Math.round(Math.cos(angle) * 100) / 100;
  const sin = Math.round(Math.sin(angle) * 100) / 100;
  const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
  const dy = sin < -0.3 ? -6 : sin > 0.3 ? 16 : 4;
  return { anchor, dy };
}

const MINI_SIZE = 72;
const MINI_CENTER = MINI_SIZE / 2;
const MINI_MAX_R = 28;

function miniPointFor(index: number, radiusFraction: number) {
  const angle = angleFor(index);
  const r = MINI_MAX_R * radiusFraction;
  return {
    x: round2(MINI_CENTER + r * Math.cos(angle)),
    y: round2(MINI_CENTER + r * Math.sin(angle)),
  };
}

function miniPolygonPoints(values: number[]) {
  return values
    .map((v, i) => {
      const p = miniPointFor(i, Math.max(0, Math.min(1, v / 100)));
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

/**
 * A small echo of the same polygon, sized for inline use in the closing CTA —
 * so the shape (not just the number) survives to the bottom of the page.
 */
export function MiniSignalGlyph({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const points = miniPolygonPoints(values);
  return (
    <svg
      viewBox={`0 0 ${MINI_SIZE} ${MINI_SIZE}`}
      aria-hidden="true"
      className={className}
    >
      {RINGS.map((frac) => (
        <polygon
          key={frac}
          points={miniPolygonPoints(AXES.map(() => frac * 100))}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}
      <motion.polygon
        points={points}
        fill={ACCENT}
        fillOpacity={0.3}
        stroke={ACCENT}
        strokeWidth={2}
        strokeLinejoin="round"
        animate={{ points }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export default function SignalChart({
  weights,
  state,
  onWeightChange,
  onReset,
  referenceName,
}: {
  weights: number[];
  state: SignalState;
  onWeightChange: (index: number, value: number) => void;
  onReset: () => void;
  referenceName: string;
}) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const isDefault = weights.every((w, i) => w === DEFAULT_WEIGHTS[i]);

  const baselinePoints = polygonPoints(state.axes.map((a) => a.raw));
  const livePoints = polygonPoints(state.axes.map((a) => a.value));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-center">
      {/* Chart */}
      <div className="mx-auto w-full max-w-[440px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-labelledby={`${baseId}-title ${baseId}-desc`}
          className="w-full"
        >
          <title id={`${baseId}-title`}>Weighted verification signal, five axes</title>
          <desc id={`${baseId}-desc`}>
            A five-axis polygon comparing an equal-weighted baseline for the {referenceName}{" "}
            listing against the shape produced by your current slider weights. Condition{" "}
            {state.axes[0].value}%, authenticity {state.axes[1].value}%, price fit{" "}
            {state.axes[2].value}%, seller trust {state.axes[3].value}%, demand velocity{" "}
            {state.axes[4].value}%.
          </desc>

          {/* Grid rings */}
          {RINGS.map((frac) => (
            <polygon
              key={frac}
              points={polygonPoints(AXES.map(() => frac * 100))}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
          ))}

          {/* Axis spokes */}
          {AXES.map((axis, i) => {
            const outer = pointFor(i, 1);
            return (
              <line
                key={axis.id}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="#FFFFFF"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            );
          })}

          {/* Baseline (equal-weight) polygon */}
          <polygon
            points={baselinePoints}
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />

          {/* Live weighted polygon */}
          <motion.polygon
            points={livePoints}
            fill={ACCENT}
            fillOpacity={0.22}
            stroke={ACCENT}
            strokeWidth={2.5}
            strokeLinejoin="round"
            animate={{ points: livePoints }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            }
          />

          {/* Vertex markers */}
          {state.axes.map((a, i) => {
            const p = pointFor(i, Math.max(0, Math.min(1, a.value / 100)));
            return (
              <motion.circle
                key={AXES[i].id}
                cx={p.x}
                cy={p.y}
                r={4.5}
                fill={ACCENT}
                stroke="#0B0B0F"
                strokeWidth={1.5}
                animate={{ cx: p.x, cy: p.y }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                }
              />
            );
          })}

          {/* Axis labels */}
          {AXES.map((axis, i) => {
            const p = pointFor(i, 1.16);
            const { anchor, dy } = labelAnchor(i);
            return (
              <text
                key={axis.id}
                x={p.x}
                y={p.y}
                dy={dy}
                textAnchor={anchor}
                fontSize={13}
                fontWeight={600}
                fill="#FFFFFF"
              >
                {axis.short}
              </text>
            );
          })}
        </svg>

        <div className="mt-2 flex items-center justify-center gap-5 text-xs text-[#A1A1AA]">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0 w-4 border-t-2 border-dashed border-white/40" />
            Equal-weight baseline
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2 w-4 rounded-sm" style={{ backgroundColor: ACCENT }} />
            Your weighting
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Reweight the five axes
          </h3>
          <button
            type="button"
            onClick={onReset}
            disabled={isDefault}
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            Reset
          </button>
        </div>
        <p className="mt-2 text-sm leading-[1.6] text-[#A1A1AA]">
          Weights always sum to 100 — raising one pulls the other four down together,
          so the whole shape redraws, not just one spoke.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {AXES.map((axis, i) => {
            const Icon = AXIS_ICON[axis.id];
            const axisState = state.axes[i];
            const sliderId = `${baseId}-slider-${axis.id}`;
            const hintId = `${baseId}-hint-${axis.id}`;
            return (
              <div key={axis.id}>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={sliderId}
                    className="flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    <Icon className="h-4 w-4 flex-none" aria-hidden="true" style={{ color: ACCENT_TINT }} strokeWidth={2} />
                    {axis.label}
                  </label>
                  <span className="whitespace-nowrap text-sm tabular-nums text-[#A1A1AA]">
                    <span className="font-semibold text-white">{weights[i]}%</span> weight
                    <span className="mx-1.5 text-white/20">·</span>
                    {axisState.value}% shown
                  </span>
                </div>
                <input
                  id={sliderId}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={weights[i]}
                  onChange={(e) => onWeightChange(i, Number(e.target.value))}
                  aria-describedby={hintId}
                  style={{
                    background: `linear-gradient(to right, ${ACCENT} ${weights[i]}%, rgba(255,255,255,0.15) ${weights[i]}%)`,
                  }}
                  className={`mt-2 h-2 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#6E56CF] [&::-webkit-slider-thumb]:bg-white [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/15 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#6E56CF] [&::-moz-range-thumb]:bg-white ${FOCUS_RING}`}
                />
                <p id={hintId} className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
                  {axis.hint} — raw score {axisState.raw}%.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
