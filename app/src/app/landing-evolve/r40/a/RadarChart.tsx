import { FACTORS, type FactorId } from "./rank-logic";
import { ROSE_600 } from "./theme";

const SIZE = 220;
const CENTER = 110;
const MAX_R = 64;

// Fixed axis positions (the axes never move — only the polygon reshapes).
// Price = top, Condition = right, Speed = bottom, Trust = left.
const AXIS_ANGLE: Record<FactorId, number> = {
  price: -90,
  condition: 0,
  speed: 90,
  trust: 180,
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pointAt(fraction: number, angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [round2(CENTER + MAX_R * fraction * Math.cos(rad)), round2(CENTER + MAX_R * fraction * Math.sin(rad))];
}

function toPointsAttr(points: [number, number][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function RadarChart({ weights }: { weights: Record<FactorId, number> }) {
  const ringFractions = [0.25, 0.5, 0.75, 1];
  const dataPoints = FACTORS.map((f) => pointAt(weights[f.id], AXIS_ANGLE[f.id]));

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full" role="img" aria-labelledby="radar-title">
        <title id="radar-title">Priority weight shape across price, condition, speed and trust</title>
        {ringFractions.map((f) => (
          <polygon
            key={f}
            points={toPointsAttr(FACTORS.map((axis) => pointAt(f, AXIS_ANGLE[axis.id])))}
            fill="none"
            stroke="#E4E4E7"
            strokeWidth={1}
          />
        ))}
        {FACTORS.map((axis) => {
          const [x, y] = pointAt(1, AXIS_ANGLE[axis.id]);
          return <line key={axis.id} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#E4E4E7" strokeWidth={1} />;
        })}
        <polygon points={toPointsAttr(dataPoints)} fill={ROSE_600} fillOpacity={0.16} stroke={ROSE_600} strokeWidth={2} />
        {FACTORS.map((axis) => {
          const [x, y] = pointAt(1.15, AXIS_ANGLE[axis.id]);
          return (
            <text
              key={axis.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fontWeight={600}
              fill="#3f3f46"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
      <ul className="sr-only">
        {FACTORS.map((axis) => (
          <li key={axis.id}>
            {axis.label}: weight {Math.round(weights[axis.id] * 100)} out of 100
          </li>
        ))}
      </ul>
    </div>
  );
}
