import styles from "./d20.module.css";

interface RadialGaugeProps {
  label: string;
  displayValue: string;
  unit: string;
  context: string;
  percent: number;
  tone: "teal" | "amber" | "red";
  animationIndex?: number;
}

const TONE_VAR: Record<RadialGaugeProps["tone"], string> = {
  teal: "var(--dg-teal)",
  amber: "var(--dg-amber)",
  red: "var(--dg-red)",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RadialGauge({
  label,
  displayValue,
  unit,
  context,
  percent,
  tone,
  animationIndex = 0,
}: RadialGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const color = TONE_VAR[tone];

  return (
    <article
      className={`${styles.enter} flex items-center gap-4 rounded-lg border border-[var(--dg-border)] bg-[var(--dg-panel)] p-4`}
      style={{ animationDelay: `${animationIndex * 70}ms` }}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-20 w-20 shrink-0 -rotate-90"
        role="img"
        aria-label={`${label} ${displayValue}${unit}, ${context}`}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="var(--dg-border-strong)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={styles.gaugeArc}
        />
      </svg>
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--dg-text-dim)] uppercase">
          {label}
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold text-[var(--dg-text)] tabular-nums">
          {displayValue}
          <span className="ml-1 text-sm font-normal text-[var(--dg-text-dim)]">{unit}</span>
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--dg-text-faint)]">{context}</p>
      </div>
    </article>
  );
}
