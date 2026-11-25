const W = 96;
const H = 28;
const PAD = 2;

export default function Sparkline({
  values,
  tone = "indigo",
}: {
  values: number[];
  tone?: "indigo" | "emerald" | "amber" | "rose";
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const scaleX = (i: number) => PAD + (i / Math.max(1, values.length - 1)) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2);

  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`).join(" ");

  const strokeClass =
    tone === "indigo"
      ? "text-indigo-400"
      : tone === "emerald"
        ? "text-emerald-400"
        : tone === "amber"
          ? "text-amber-400"
          : "text-rose-400";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" className={strokeClass} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
