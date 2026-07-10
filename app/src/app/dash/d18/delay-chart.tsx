import type { DelayReason } from "./data";

export function DelayChart({ reasons }: { reasons: DelayReason[] }) {
  const max = Math.max(...reasons.map((r) => r.count));

  return (
    <section
      id="delay"
      aria-labelledby="delay-heading"
      className="scroll-mt-24 rounded-lg border border-amber-500/10 bg-neutral-950 p-4"
    >
      <h2
        id="delay-heading"
        className="mb-4 font-mono text-sm font-bold tracking-[0.15em] text-neutral-200"
      >
        지연 사유 분석 · 금일
      </h2>
      <ul className="space-y-3">
        {reasons.map((r) => (
          <li key={r.reason} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-neutral-400 sm:w-32">
              {r.reason}
            </span>
            <span
              className="h-4 flex-1 overflow-hidden rounded-sm bg-neutral-900"
              role="progressbar"
              aria-valuenow={r.count}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={`${r.reason} ${r.count}건`}
            >
              <span
                className="block h-full rounded-sm bg-gradient-to-r from-amber-600 to-amber-400"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-neutral-300">
              {r.count}건
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
