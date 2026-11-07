import type { Listing } from "./data";
import { RADAR_AXES } from "./compare";
import { COLOR } from "./theme";

interface RadarChartProps {
  a: Listing;
  b: Listing;
}

const SIZE = 250;
const CENTER = SIZE / 2;
const RADIUS = 78;
const AXIS_COUNT = RADAR_AXES.length;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function axisAngle(index: number): number {
  return -Math.PI / 2 + index * ((2 * Math.PI) / AXIS_COUNT);
}

function pointAt(index: number, fraction: number): { x: number; y: number } {
  const angle = axisAngle(index);
  const r = RADIUS * fraction;
  return {
    x: round2(CENTER + r * Math.cos(angle)),
    y: round2(CENTER + r * Math.sin(angle)),
  };
}

function polygonFor(listing: Listing): string {
  return RADAR_AXES.map((axis, i) => {
    const p = pointAt(i, Math.max(0, Math.min(100, axis.value(listing))) / 100);
    return `${p.x},${p.y}`;
  }).join(" ");
}

// Overlays both selected listings' five axis values on one chart so their
// shapes visibly differ. Lines are additionally distinguished by stroke
// style (solid vs dashed), not color alone.
export function RadarChart({ a, b }: RadarChartProps) {
  const ringFractions = [1 / 3, 2 / 3, 1];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-label={`Radar comparison of ${a.title} and ${b.title} across match score, condition grade, discount, sell speed and affordability`}
        className="max-w-full"
      >
        {ringFractions.map((fraction) => (
          <polygon
            key={fraction}
            points={RADAR_AXES.map((_axis, i) => {
              const p = pointAt(i, fraction);
              return `${p.x},${p.y}`;
            }).join(" ")}
            fill="none"
            stroke="#E4DED7"
            strokeWidth={1}
          />
        ))}

        {RADAR_AXES.map((axis, i) => {
          const edge = pointAt(i, 1);
          const labelPoint = pointAt(i, 1.2);
          return (
            <g key={axis.key}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={edge.x}
                y2={edge.y}
                stroke="#E4DED7"
                strokeWidth={1}
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                letterSpacing="0.08em"
                fill={COLOR.muted}
              >
                {axis.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        <polygon
          points={polygonFor(a)}
          fill={COLOR.ink}
          fillOpacity={0.08}
          stroke={COLOR.ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <polygon
          points={polygonFor(b)}
          fill={COLOR.accent}
          fillOpacity={0.1}
          stroke={COLOR.accentInk}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeDasharray="5,4"
        />
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] font-semibold text-[#171311]">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-0 w-5 border-t-2 border-[#171311]" />
          {a.title}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0 w-5 border-t-2 border-dashed border-[#B8410A]"
          />
          {b.title}
        </span>
      </div>
    </div>
  );
}
