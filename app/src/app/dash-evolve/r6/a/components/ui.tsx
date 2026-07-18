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

export function Badge({
  tone = "neutral",
  Icon,
  children,
}: {
  tone?: StatusTone;
  Icon?: LucideIcon;
  children: ReactNode;
}) {
  const t = STATUS[tone];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none",
        t.text,
        t.bg,
        t.border,
      )}
    >
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function StatusDot({ tone, label }: { tone: StatusTone; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", STATUS[tone].dot)} />
      <span className={cx("text-xs font-medium", STATUS[tone].text)}>{label}</span>
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Segmented control (radiogroup) — 기간/뷰 토글에 사용                        */
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
