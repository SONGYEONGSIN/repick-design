import type { KpiTile } from "../data";
import styles from "../console.module.css";

const TONE_COLOR: Record<KpiTile["tone"], string> = {
  hold: "var(--hf-hold)",
  go: "var(--hf-go)",
  default: "var(--hf-accent)",
};

export function KpiStrip({ kpis, snapshotAt }: { kpis: KpiTile[]; snapshotAt: string }) {
  return (
    <section aria-labelledby="overview-heading" id="overview" className="scroll-mt-20">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="overview-heading" className="text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
          01 — Mission Snapshot
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--hf-text-3)" }}>
          Static snapshot at {snapshotAt} · not live-updating
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.id}
            className={`${styles.panel} min-w-0 p-4 ${i === 0 ? "lg:col-span-2" : "lg:col-span-1"}`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: "var(--hf-text-3)" }}>
              {kpi.label}
            </p>
            <p
              className={`mt-2 truncate font-mono font-bold tabular-nums ${
                i === 0 ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
              }`}
              style={{ color: TONE_COLOR[kpi.tone] }}
            >
              {kpi.value}
            </p>
            <p className="mt-2 text-xs leading-snug" style={{ color: "var(--hf-text-2)" }}>
              {kpi.sublabel}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
