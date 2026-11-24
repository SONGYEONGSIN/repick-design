// Tiny inline sparkline used in the service rail. Pure presentational — coordinates are computed
// from the `values` prop with simple linear scaling (no trig), rounded to 2 decimals.

const WIDTH = 72;
const HEIGHT = 28;
const PAD = 2;

export default function Sparkline({
  values,
  tone,
}: {
  values: number[];
  tone: "violet" | "amber" | "rose";
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (WIDTH - PAD * 2);
    const y = HEIGHT - PAD - ((v - min) / span) * (HEIGHT - PAD * 2);
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];

  const stroke =
    tone === "rose" ? "stroke-rose-400" : tone === "amber" ? "stroke-amber-400" : "stroke-violet-400";
  const dot = tone === "rose" ? "fill-rose-400" : tone === "amber" ? "fill-amber-400" : "fill-violet-400";

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <path d={path} fill="none" strokeWidth={1.5} className={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={1.8} className={dot} />
    </svg>
  );
}
