"use client";

import type { ReactNode } from "react";
import styles from "./console.module.css";

/**
 * 공유 UI 프리미티브 — "명판 플레이트" 프레이밍(리벳 코너 + 코드 라벨)을
 * 모든 위젯 카드에 일관 적용하기 위한 최소 컴포넌트 집합.
 */

export function RivetCorners() {
  return (
    <>
      <span aria-hidden className={`${styles.rivet} left-2 top-2`} />
      <span aria-hidden className={`${styles.rivet} right-2 top-2`} />
      <span aria-hidden className={`${styles.rivet} left-2 bottom-2`} />
      <span aria-hidden className={`${styles.rivet} right-2 bottom-2`} />
    </>
  );
}

export function Panel({
  id,
  code,
  eyebrow,
  title,
  action,
  children,
  bodyClassName = "p-4 md:p-5",
  className = "",
}: {
  id: string;
  code: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={`${styles.panel} relative min-w-0 rounded-sm ${className}`}
    >
      <RivetCorners />
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--hair)] px-4 py-3 md:px-5">
        <div className="min-w-0">
          <p className={`${styles.eyebrow} text-[var(--ink-2)]`}>
            {eyebrow} <span aria-hidden>· {code}</span>
          </p>
          <h2
            id={titleId}
            className="mt-0.5 truncate text-sm font-semibold tracking-tight text-[var(--ink-0)] md:text-base"
          >
            {title}
          </h2>
        </div>
        {action ? <div className="min-w-0 max-w-full shrink">{action}</div> : null}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={`${styles.eyebrow} text-[var(--ink-2)]`}>{children}</p>;
}

const TIER_STYLE: Record<string, string> = {
  normal: "border-[var(--hair-strong)] text-[var(--ink-1)]",
  elevated: "border-[var(--caution)] text-[var(--caution)]",
  overload: "border-[var(--alarm)] text-[var(--alarm)]",
  info: "border-[var(--hair-strong)] text-[var(--ink-1)]",
  warning: "border-[var(--caution)] text-[var(--caution)]",
  alarm: "border-[var(--alarm)] text-[var(--alarm)]",
  caution: "border-[var(--caution)] text-[var(--caution)]",
};

export function StatusPill({
  tone,
  icon,
  children,
}: {
  tone: "normal" | "elevated" | "overload" | "info" | "warning" | "alarm" | "caution";
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span
      className={`${styles.pillLabel} inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium ${TIER_STYLE[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaTone = "normal",
  icon,
  className = "",
}: {
  label: string;
  value: string;
  unit: string;
  delta?: string;
  deltaTone?: "up" | "down" | "normal";
  icon?: ReactNode;
  className?: string;
}) {
  const deltaColor =
    deltaTone === "up"
      ? "text-[var(--amber-strong)]"
      : deltaTone === "down"
        ? "text-[var(--cyan)]"
        : "text-[var(--ink-2)]";
  return (
    <div className={`min-w-0 bg-[var(--bg-1)] px-4 py-4 md:px-5 ${className}`}>
      <div className="flex items-center gap-1.5 text-[var(--ink-2)]">
        {icon}
        <p className={styles.eyebrow}>{label}</p>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5 font-mono text-3xl font-semibold tabular-nums tracking-tight text-[var(--ink-0)] md:text-4xl">
        {value}
        <span className="text-sm font-medium text-[var(--ink-2)]">{unit}</span>
      </p>
      {delta ? (
        <p className={`mt-1 font-mono text-xs tabular-nums ${deltaColor}`}>{delta}</p>
      ) : null}
    </div>
  );
}
