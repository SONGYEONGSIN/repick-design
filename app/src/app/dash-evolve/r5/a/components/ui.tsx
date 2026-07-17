"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  BORDER,
  CARD,
  FOCUS_RING,
  NUM,
  STATUS,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
  type StatusTone,
} from "../lib/tokens";

/* ---------------------------------------------------------------------- */
/* Card                                                                    */
/* ---------------------------------------------------------------------- */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={cx(CARD, padded && "p-4 sm:p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
  as: Tag = "h2",
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
          {title}
        </Tag>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children }: { children: ReactNode }) {
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{children}</span>;
}

/* ---------------------------------------------------------------------- */
/* Badge                                                                   */
/* ---------------------------------------------------------------------- */

export function Badge({ tone = "neutral", Icon, children }: { tone?: StatusTone; Icon?: LucideIcon; children: ReactNode }) {
  const t = STATUS[tone];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", t.text, t.bg, t.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Progress bar                                                            */
/* ---------------------------------------------------------------------- */

const PROGRESS_FILL: Record<StatusTone, string> = {
  positive: "bg-emerald-600 dark:bg-emerald-400",
  negative: "bg-red-600 dark:bg-red-400",
  warning: "bg-amber-600 dark:bg-amber-400",
  neutral: "bg-zinc-500 dark:bg-zinc-400",
};

export function ProgressBar({ value, tone = "neutral", label }: { value: number; tone?: StatusTone; label: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
    >
      <div className={cx("h-full rounded-full", PROGRESS_FILL[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Segmented control (radiogroup) — 기간 토글에 사용                          */
/* ---------------------------------------------------------------------- */

export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex rounded-lg border p-0.5", BORDER, "bg-zinc-50 dark:bg-zinc-950")}>
      {options.map((opt, idx) => {
        const checked = value === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cx(
              "min-h-9 rounded-md px-2.5 py-1 text-xs font-semibold",
              NUM,
              TRANSITION,
              FOCUS_RING,
              checked ? cx("bg-white shadow-sm dark:bg-zinc-800", TEXT_PRIMARY) : cx(TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 정렬 가능 테이블 헤더                                                     */
/* ---------------------------------------------------------------------- */

export type SortDir = "asc" | "desc";

export function SortableTh<K extends string>({
  columnKey,
  activeKey,
  dir,
  onSort,
  align = "left",
  children,
}: {
  columnKey: K;
  activeKey: K;
  dir: SortDir;
  onSort: (key: K) => void;
  align?: "left" | "right";
  children: ReactNode;
}) {
  const active = columnKey === activeKey;
  const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";
  return (
    <th scope="col" aria-sort={ariaSort} className={cx("py-2", align === "right" ? "pr-3 text-right" : "pl-3 text-left")}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={cx(
          "inline-flex items-center gap-1 rounded py-1 text-[11px] font-semibold uppercase tracking-wide",
          TEXT_CAPTION,
          "hover:text-zinc-900 dark:hover:text-zinc-100",
          TRANSITION,
          FOCUS_RING,
          align === "right" && "flex-row-reverse",
        )}
      >
        {children}
        <span aria-hidden="true" className={cx(active ? "opacity-100" : "opacity-30")}>
          {active ? (
            dir === "asc" ? (
              <ArrowUp className="size-3" strokeWidth={2.5} />
            ) : (
              <ArrowDown className="size-3" strokeWidth={2.5} />
            )
          ) : (
            <ArrowUpDown className="size-3" strokeWidth={2.5} />
          )}
        </span>
      </button>
    </th>
  );
}

export { NUM };

/* ---------------------------------------------------------------------- */
/* Sparkline — 워치리스트 행 미니 추이(장식용, 값은 옆 텍스트에 이미 제공되어 aria-hidden) */
/* ---------------------------------------------------------------------- */

import { round2 } from "../lib/math";

export function Sparkline({
  data,
  tone = "neutral",
  width = 64,
  height = 24,
}: {
  data: number[];
  tone?: StatusTone;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data.map((v, i) => ({
    x: round2((i / (data.length - 1 || 1)) * (width - pad * 2) + pad),
    y: round2(height - pad - ((v - min) / range) * (height - pad * 2)),
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const strokeColor: Record<StatusTone, string> = {
    positive: "stroke-emerald-600 dark:stroke-emerald-400",
    negative: "stroke-red-600 dark:stroke-red-400",
    warning: "stroke-amber-600 dark:stroke-amber-400",
    neutral: "stroke-zinc-400 dark:stroke-zinc-500",
  };
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" focusable="false">
      <path d={path} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={strokeColor[tone]} />
      <circle cx={last.x} cy={last.y} r="1.75" className={cx(strokeColor[tone], "fill-current")} />
    </svg>
  );
}
