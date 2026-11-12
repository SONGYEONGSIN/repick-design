"use client";

import type { MarkerShape, StrokeStyle } from "./data";

export type SwatchTone = "neutral" | "pinned" | "hover";

export const DASH_PATTERNS: Record<StrokeStyle, string | undefined> = {
  solid: undefined,
  dashed: "6 3",
  dotted: "1.5 3",
};

export const TONE_STROKE: Record<SwatchTone, string> = {
  neutral: "#71717a", // zinc-500
  pinned: "#e11d48", // rose-600
  hover: "#fb7185", // rose-400
};

export function Marker({
  shape,
  cx,
  cy,
  color,
  filled,
  size = 1,
}: {
  shape: MarkerShape;
  cx: number;
  cy: number;
  color: string;
  filled: boolean;
  size?: number;
}) {
  const fill = filled ? color : "white";
  const r = round2(3.5 * size);
  if (shape === "circle") {
    return <circle cx={cx} cy={cy} r={r} fill={fill} stroke={color} strokeWidth={1.5} />;
  }
  if (shape === "square") {
    const half = round2(3.2 * size);
    return (
      <rect
        x={round2(cx - half)}
        y={round2(cy - half)}
        width={round2(half * 2)}
        height={round2(half * 2)}
        fill={fill}
        stroke={color}
        strokeWidth={1.5}
      />
    );
  }
  const tr = round2(4.2 * size);
  const points = `${cx},${round2(cy - tr)} ${round2(cx + tr)},${round2(cy + tr * 0.7)} ${round2(cx - tr)},${round2(cy + tr * 0.7)}`;
  return <polygon points={points} fill={fill} stroke={color} strokeWidth={1.5} />;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Small legend swatch: a dashed/dotted/solid stroke segment ending in the vendor's marker shape. */
export function VendorSwatch({
  marker,
  stroke,
  tone = "neutral",
  className,
}: {
  marker: MarkerShape;
  stroke: StrokeStyle;
  tone?: SwatchTone;
  className?: string;
}) {
  const color = TONE_STROKE[tone];
  return (
    <svg
      viewBox="0 0 32 14"
      width={32}
      height={14}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <line
        x1={2}
        y1={7}
        x2={24}
        y2={7}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={DASH_PATTERNS[stroke]}
        strokeLinecap="round"
      />
      <Marker shape={marker} cx={26} cy={7} color={color} filled={tone === "pinned"} />
    </svg>
  );
}
