// Bounded 0–100% meter. Only used for metrics that cannot legitimately exceed 100% (state of
// charge, renewable share) — a metric that CAN blow past its target gets a text overflow label
// elsewhere instead of a silently-clamped bar.
export default function ProgressBar({
  value,
  tone = "indigo",
  label,
}: {
  value: number;
  tone?: "indigo" | "emerald" | "amber" | "rose";
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const fillClass =
    tone === "indigo"
      ? "bg-indigo-400"
      : tone === "emerald"
        ? "bg-emerald-400"
        : tone === "amber"
          ? "bg-amber-400"
          : "bg-rose-400";
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
