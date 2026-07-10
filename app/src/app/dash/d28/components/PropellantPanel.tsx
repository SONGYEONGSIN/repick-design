import type { Milestone } from "../data";
import styles from "../console.module.css";

const CRYO_TEMP: Record<"LOX" | "CH4", string> = {
  LOX: "-183°C",
  CH4: "-162°C",
};

function Bar({
  stage,
  propellant,
  pct,
}: {
  stage: "Booster" | "Ship";
  propellant: "LOX" | "CH4";
  pct: number;
}) {
  const fillClass = propellant === "LOX" ? styles.solidFill : styles.hatch;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <p className="font-mono text-lg font-bold tabular-nums" style={{ color: "var(--hf-text)" }}>
        {pct}%
      </p>
      <div
        role="img"
        aria-label={`${stage} ${propellant} tank loaded to ${pct} percent, ${CRYO_TEMP[propellant]}`}
        className="relative h-40 w-full overflow-hidden rounded-md border"
        style={{ borderColor: "var(--hf-border-strong)", background: "var(--hf-bg)" }}
      >
        {[25, 50, 75].map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="absolute left-0 right-0 h-px"
            style={{ bottom: `${tick}%`, background: "var(--hf-border)" }}
          />
        ))}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 ${fillClass}`}
          style={{ height: `${pct}%` }}
        />
      </div>
      <p className="text-center text-xs font-medium" style={{ color: "var(--hf-text-2)" }}>
        {stage} {propellant}
      </p>
      <p className="font-mono text-[11px] tabular-nums" style={{ color: "var(--hf-text-3)" }}>
        {CRYO_TEMP[propellant]}
      </p>
    </div>
  );
}

export function PropellantPanel({ milestone }: { milestone: Milestone }) {
  const t = milestone.telemetry;
  return (
    <section aria-labelledby="propellant-heading" id="propellant" className="min-w-0 scroll-mt-20 lg:col-span-4">
      <h2 id="propellant-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
        05 — Propellant Load
      </h2>
      <div className={`${styles.panel} p-4 sm:p-6`}>
        <p className="text-xs" style={{ color: "var(--hf-text-3)" }}>
          Snapshot at {milestone.tMinus} · solid fill = LOX (oxidizer) · hatched fill = CH4 (fuel)
        </p>
        <div role="group" aria-label={`Propellant load at ${milestone.tMinus}`} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Bar stage="Booster" propellant="LOX" pct={t.boosterLoxPct} />
          <Bar stage="Booster" propellant="CH4" pct={t.boosterCh4Pct} />
          <Bar stage="Ship" propellant="LOX" pct={t.shipLoxPct} />
          <Bar stage="Ship" propellant="CH4" pct={t.shipCh4Pct} />
        </div>
      </div>
    </section>
  );
}
