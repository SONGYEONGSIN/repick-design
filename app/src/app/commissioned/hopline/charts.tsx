// Generative SVG only — no remote images, no chart library. Every coordinate is
// rounded to two decimals so the server and the client agree byte for byte.

import { FLOW_H, FLOW_W, r2, type FlowLayout } from "./data";

export const STROKE_TONE: Record<string, string> = {
  "orange-600": "stroke-orange-600",
  "orange-400": "stroke-orange-400",
  "orange-200": "stroke-orange-200",
};

const AW = 720;
const AH = 200;

function tickIndexes(n: number): number[] {
  const k = Math.min(7, n);
  if (k <= 1) return [0];
  return Array.from({ length: k }, (_, j) => Math.round((j * (n - 1)) / (k - 1)));
}

type AreaChartProps = {
  values: number[];
  labels: string[];
  markerIndex: number;
  srCaption: string;
  srDate: string;
  srValue: string;
  format: (n: number) => string;
};

export function AreaChart({
  values,
  labels,
  markerIndex,
  srCaption,
  srDate,
  srValue,
  format,
}: AreaChartProps) {
  const n = values.length;
  const max = Math.max(...values, 1) * 1.15;
  const points = values.map((v, i) => ({
    x: r2(n <= 1 ? 0 : (i / (n - 1)) * AW),
    y: r2(AH - (v / max) * AH),
  }));
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
    .join(" ");
  const area = `${line} L${AW} ${AH} L0 ${AH} Z`;
  const marker =
    markerIndex >= 0 && markerIndex < n ? points[markerIndex] : undefined;
  const ticks = tickIndexes(n);

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${AW} ${AH}`}
        preserveAspectRatio="none"
        className="h-44 w-full sm:h-56"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="hopline-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(234 88 12)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="rgb(234 88 12)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((k) => (
          <line
            key={`grid-${k}`}
            x1="0"
            x2={AW}
            y1={r2((AH * k) / 4)}
            y2={r2((AH * k) / 4)}
            className="stroke-zinc-200"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={area} fill="url(#hopline-area)" />
        <path
          d={line}
          fill="none"
          className="stroke-orange-600"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {marker ? (
          <g>
            <line
              x1={marker.x}
              x2={marker.x}
              y1="0"
              y2={AH}
              className="stroke-zinc-900"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={r2(marker.x - 4)}
              y={r2(marker.y - 4)}
              width="8"
              height="8"
              rx="1.5"
              className="fill-zinc-900"
            />
          </g>
        ) : null}
      </svg>
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-zinc-500">
        {ticks.map((i) => (
          <span
            key={`tick-${labels[i] ?? i}`}
            className="tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {labels[i] ?? ""}
          </span>
        ))}
      </div>
      <div className="sr-only">
        <table>
          <caption>{srCaption}</caption>
          <thead>
            <tr>
              <th scope="col" className="font-medium">
                {srDate}
              </th>
              <th scope="col" className="font-medium">
                {srValue}
              </th>
            </tr>
          </thead>
          <tbody>
            {values.map((v, i) => (
              <tr key={`sr-${labels[i] ?? i}`}>
                <td>{labels[i] ?? ""}</td>
                <td>{format(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function MiniBars({
  values,
  highlight,
}: {
  values: number[];
  highlight: number[];
}) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const slot = 100 / Math.max(n, 1);
  const gap = n > 8 ? 1.4 : 3;
  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className="h-7 w-full"
      aria-hidden="true"
      focusable="false"
    >
      {values.map((v, i) => {
        const h = Math.max(2, r2((v / max) * 26));
        return (
          <rect
            key={`bar-${i}-${v}`}
            x={r2(i * slot)}
            y={r2(28 - h)}
            width={r2(Math.max(1.5, slot - gap))}
            height={h}
            rx="0.8"
            className={
              highlight.includes(i) ? "fill-orange-600" : "fill-zinc-300"
            }
          />
        );
      })}
    </svg>
  );
}

export function Sparkline({
  values,
  rising,
}: {
  values: number[];
  rising: boolean;
}) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, max);
  const span = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = r2(n <= 1 ? 0 : (i / (n - 1)) * 100);
      const y = r2(20 - ((v - min) / span) * 16 - 2);
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      className="h-5 w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        fill="none"
        className={rising ? "stroke-emerald-600" : "stroke-zinc-400"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Donut({
  slices,
}: {
  slices: { id: string; pct: number; tone: string }[];
}) {
  const radius = 44;
  const circumference = r2(2 * Math.PI * radius);
  const lengths = slices.map((s) => r2((circumference * s.pct) / 100));
  const arcs = slices.map((s, i) => ({
    id: s.id,
    tone: s.tone,
    length: lengths[i] ?? 0,
    offset: r2(lengths.slice(0, i).reduce((acc, v) => acc + v, 0)),
  }));
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-28 w-28 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        className="stroke-zinc-100"
        strokeWidth="16"
      />
      {arcs.map((a) => (
        <circle
          key={a.id}
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className={STROKE_TONE[a.tone] ?? "stroke-orange-600"}
          strokeWidth="16"
          strokeDasharray={`${a.length} ${r2(circumference - a.length)}`}
          strokeDashoffset={-a.offset}
          transform="rotate(-90 60 60)"
        />
      ))}
    </svg>
  );
}

export function FlowSvg({ layout }: { layout: FlowLayout }) {
  return (
    <svg
      viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      {layout.ribbons.map((r) => (
        <path
          key={r.key}
          d={r.d}
          fill="none"
          className="stroke-orange-400/40"
          strokeWidth={r.w}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {layout.sources.map((node) => (
        <rect
          key={`s-${node.id}`}
          x="192"
          y={node.y}
          width="8"
          height={node.h}
          rx="2"
          className="fill-zinc-700"
        />
      ))}
      {layout.links.map((node) => (
        <rect
          key={`l-${node.id}`}
          x="440"
          y={node.y}
          width="8"
          height={node.h}
          rx="2"
          className="fill-orange-600"
        />
      ))}
    </svg>
  );
}
