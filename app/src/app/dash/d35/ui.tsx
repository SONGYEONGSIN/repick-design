"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import {
  BORDER,
  CARD,
  FOCUS_RING,
  NUM,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
  round2,
  type CategoryMeta,
} from "./data";

/* ---- Card ---------------------------------------------------------- */
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

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>
  );
}

/* ---- Category badge (색 + 텍스트 병행) ----------------------------- */
export function CategoryBadge({ meta, short = false }: { meta: CategoryMeta; short?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        meta.badge,
      )}
    >
      <meta.Icon size={11} aria-hidden="true" />
      {short ? meta.short : meta.label}
    </span>
  );
}

/* ---- Segmented control (radiogroup, Arrow 키 지원) ----------------- */
export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  size = "md",
}: {
  ariaLabel: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  size?: "sm" | "md";
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
  const pad = size === "sm" ? "min-h-8 px-2.5 text-[11px]" : "min-h-9 px-3 text-xs";
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("inline-flex rounded-lg border p-0.5", BORDER, "bg-zinc-50 dark:bg-zinc-950")}
    >
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
              "rounded-md font-semibold",
              pad,
              NUM,
              TRANSITION,
              FOCUS_RING,
              checked
                ? cx("bg-white shadow-sm dark:bg-zinc-800", TEXT_PRIMARY)
                : cx(TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---- Filter chip (토글) -------------------------------------------- */
export function FilterChip({
  active,
  onClick,
  Icon,
  dot,
  children,
}: {
  active: boolean;
  onClick: () => void;
  Icon?: LucideIcon;
  dot?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium",
        TRANSITION,
        FOCUS_RING,
        active
          ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/15 dark:text-violet-200"
          : cx(BORDER, "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"),
      )}
    >
      {Icon ? <Icon size={13} aria-hidden="true" /> : dot ? <span className={cx("h-2 w-2 rounded-full", dot)} aria-hidden="true" /> : null}
      {children}
      {active ? <Check size={13} aria-hidden="true" className="opacity-70" /> : null}
    </button>
  );
}

/* ---- 목표 대비 진행바 ---------------------------------------------- */
export function TargetBar({ actual, target }: { actual: number; target: number }) {
  const max = Math.max(actual, target, 1);
  const a = round2((actual / max) * 100);
  const t = round2((target / max) * 100);
  return (
    <div className="relative h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 rounded-full bg-violet-500 dark:bg-violet-400" style={{ width: `${a}%` }} />
      <div className="absolute inset-y-[-2px] w-0.5 rounded bg-zinc-900/70 dark:bg-white/70" style={{ left: `${t}%` }} />
    </div>
  );
}

/* ---- Sparkline (좌표 2자리 반올림) --------------------------------- */
export function Sparkline({
  values,
  className = "",
  label,
  width = 220,
  height = 56,
  up,
}: {
  values: number[];
  className?: string;
  label: string;
  width?: number;
  height?: number;
  up: boolean;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const pts = values.map((v, i) => {
    const x = round2(i * step);
    const y = round2(height - ((v - min) / range) * (height - 6) - 3);
    return { x, y };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pts.map((p) => `${p.x},${p.y}`).join(" ")} ${width},${height} 0,${height}`;
  const stroke = up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
  const fill = up ? "text-emerald-500/15 dark:text-emerald-400/15" : "text-rose-500/15 dark:text-rose-400/15";
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={label} preserveAspectRatio="none">
      <polygon points={area} className={fill} fill="currentColor" />
      <polyline
        points={line}
        fill="none"
        className={stroke}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---- 정렬 가능한 테이블 헤더 -------------------------------------- */
export type SortDir = "asc" | "desc";
export function SortableTh<K extends string>({
  columnKey,
  activeKey,
  dir,
  onSort,
  align = "left",
  className,
  children,
}: {
  columnKey: K;
  activeKey: K;
  dir: SortDir;
  onSort: (key: K) => void;
  align?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const active = columnKey === activeKey;
  const ariaSort = active ? (dir === "asc" ? "ascending" : "descending") : "none";
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cx("px-3 py-2", align === "right" ? "text-right" : "text-left", className)}
    >
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
        <span aria-hidden="true" className={active ? "opacity-100" : "opacity-30"}>
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
