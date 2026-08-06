type HeroDiagramProps = {
  activeStep: number;
  labels: readonly string[];
};

// Fixed layout: 4 node centers along one horizontal axis, 3 connecting segments between them.
// All coordinates are hand-set integers (no runtime trig), so server and client markup always
// match exactly. The diagram is purely decorative relative to the accessible step list below it
// (same order, same names), so the whole <svg> is aria-hidden and the real content lives in the
// process-steps headings/buttons that sit underneath it.
const NODE_X = [110, 390, 670, 950] as const;
const NODE_Y = 110;
const NODE_R = 44;

const SEGMENTS = [
  { from: 0, to: 1, x1: 154, x2: 346 },
  { from: 1, to: 2, x1: 434, x2: 626 },
  { from: 2, to: 3, x1: 714, x2: 906 },
] as const;

export default function HeroDiagram({ activeStep, labels }: HeroDiagramProps) {
  return (
    <svg
      viewBox="0 0 1040 220"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id="about-arrow-neutral"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#a1a1aa" />
        </marker>
        <marker
          id="about-arrow-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="#e11d48" />
        </marker>
      </defs>

      {SEGMENTS.map((seg) => {
        const filled = seg.from < activeStep;
        return (
          <line
            key={`${seg.from}-${seg.to}`}
            x1={seg.x1}
            y1={NODE_Y}
            x2={seg.x2}
            y2={NODE_Y}
            stroke={filled ? "#e11d48" : "#a1a1aa"}
            strokeWidth={filled ? 3 : 2}
            markerEnd={filled ? "url(#about-arrow-active)" : "url(#about-arrow-neutral)"}
            className="transition-[stroke,stroke-width] duration-200 ease-out motion-reduce:transition-none"
          />
        );
      })}

      {NODE_X.map((cx, i) => {
        const state: "done" | "current" | "upcoming" =
          i === activeStep ? "current" : i < activeStep ? "done" : "upcoming";
        const fill = state === "current" ? "#e11d48" : state === "done" ? "#fff1f2" : "#ffffff";
        const stroke = state === "current" ? "#be123c" : state === "done" ? "#fda4af" : "#a1a1aa";
        const numberFill = state === "current" ? "#ffffff" : state === "done" ? "#be123c" : "#3f3f46";
        const labelFill = state === "current" ? "#be123c" : "#3f3f46";

        return (
          <g key={cx} className="transition-[fill,stroke] duration-200 ease-out motion-reduce:transition-none">
            <circle
              cx={cx}
              cy={NODE_Y}
              r={NODE_R}
              fill={fill}
              stroke={stroke}
              strokeWidth={state === "current" ? 3 : 2}
              className="transition-[fill,stroke] duration-200 ease-out motion-reduce:transition-none"
            />
            <text
              x={cx}
              y={NODE_Y + 7}
              textAnchor="middle"
              fontSize="30"
              fill={numberFill}
              className="font-bold tabular-nums transition-[fill] duration-200 ease-out motion-reduce:transition-none"
            >
              {i + 1}
            </text>
            <text
              x={cx}
              y={NODE_Y + NODE_R + 30}
              textAnchor="middle"
              fontSize="19"
              fill={labelFill}
              className="font-semibold transition-[fill] duration-200 ease-out motion-reduce:transition-none"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
