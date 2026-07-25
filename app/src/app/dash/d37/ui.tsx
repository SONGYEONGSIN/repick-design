"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, type LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useRef } from "react";
import { round2 } from "./data";
import { BORDER, CARD, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx, type Tone } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
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
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone = "neutral", Icon, children }: { tone?: Tone; Icon?: LucideIcon; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", t.text, t.bg, t.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** Progress/distribution bar — track + fill; pairing color with a numeric readout is the caller's responsibility. */
export function Progress({ pct, tone = "info" }: { pct: number; tone?: Tone }) {
  const t = TONE[tone];
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" role="presentation">
      <div className={cx("h-full rounded-full", t.dot, TRANSITION)} style={{ width: `${round2(clamped)}%` }} />
    </div>
  );
}

/* ------------------------------------------------- Segmented control */

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
              "rounded-md font-semibold",
              size === "sm" ? "min-h-8 px-2 py-0.5 text-[11px]" : "min-h-9 px-2.5 py-1 text-xs",
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

/* ------------------------------------------------ Sortable table head */

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
    <th scope="col" aria-sort={ariaSort} className={cx("py-2", align === "right" ? "pr-3 text-right" : "pl-3 text-left", className)}>
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

/* --------------------------------------------------------- Sparkline */

/** Deterministic mini sparkline — line + subtle area fill + endpoint dot. Coordinates rounded to 2 decimal places. */
export function Sparkline({ values, stroke, fill, className }: { values: number[]; stroke: string; fill: string; className?: string }) {
  const W = 200;
  const H = 44;
  const pad = 3;
  const n = values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const pts = values.map((v, i) => {
    const x = round2(pad + (i / (n - 1)) * (W - pad * 2));
    const y = round2(pad + (1 - (v - min) / range) * (H - pad * 2));
    return { x, y };
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${pts[n - 1].x} ${H - pad} L ${pts[0].x} ${H - pad} Z`;
  const last = pts[n - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cx("h-full w-full", className)} role="img" aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path d={area} className={fill} fillOpacity={0.12} stroke="none" />
      <path d={line} className={stroke} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.6} className={cx(stroke, fill)} strokeWidth={1.5} />
    </svg>
  );
}

export { NUM };
