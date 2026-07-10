"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  BORDER,
  CARD,
  CARD_PAD,
  FOCUS_RING,
  FOCUS_RING_INSET,
  NUM,
  STATUS,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TRANSITION,
  cx,
  type StatusTone,
} from "./tokens";
import { unsplashAvatar } from "./data";

/* ---------------------------------------------------------------------- */
/* Card                                                                    */
/* ---------------------------------------------------------------------- */

const MOTION_TAG = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
} as const;

export function Card({
  children,
  className,
  padded = true,
  as = "div",
  hoverLift = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "article" | "section";
  /** 카드 hover 시 미세한 상승 효과(절제된 폭). prefers-reduced-motion 시 자동 비활성. */
  hoverLift?: boolean;
}) {
  const MotionTag = MOTION_TAG[as];
  return (
    <MotionTag
      className={cx(CARD, padded && CARD_PAD, className)}
      whileHover={
        hoverLift
          ? { y: -3, boxShadow: "0 10px 24px -8px rgba(24,24,27,0.16)" }
          : undefined
      }
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 id={titleId} className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
          {title}
        </h3>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_SECONDARY)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SectionHeading({
  id,
  title,
  description,
  action,
}: {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className={cx("text-lg font-semibold tracking-tight sm:text-xl", TEXT_PRIMARY)}>
          {title}
        </h2>
        {description ? <p className={cx("mt-1 text-sm", TEXT_SECONDARY)}>{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
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
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
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

/* ---------------------------------------------------------------------- */
/* Avatar                                                                  */
/* ---------------------------------------------------------------------- */

export function Avatar({
  avatarId,
  name,
  size = 32,
}: {
  avatarId: string;
  name: string;
  size?: number;
}) {
  return (
    <Image
      src={unsplashAvatar(avatarId, size * 2)}
      alt={`${name} 프로필 사진`}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-black/5 object-cover dark:border-white/10"
      style={{ width: size, height: size }}
    />
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

export function ProgressBar({
  value,
  max,
  tone = "neutral",
  label,
}: {
  value: number;
  max: number;
  tone?: StatusTone;
  label: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
    >
      <div className={cx("h-full rounded-full", PROGRESS_FILL[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Sparkline (장식용 미니 차트 — 값은 별도 텍스트로 이미 제공되므로 aria-hidden)     */
/* ---------------------------------------------------------------------- */

export function Sparkline({
  data,
  tone = "neutral",
  width = 72,
  height = 26,
  interactive = false,
  formatValue,
}: {
  data: number[];
  tone?: StatusTone;
  width?: number;
  height?: number;
  /** 마우스 호버 시 가장 가까운 지점의 값을 미니 툴팁으로 보여준다 (장식용이므로 마우스 전용). */
  interactive?: boolean;
  formatValue?: (value: number) => string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return { x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const strokeColor: Record<StatusTone, string> = {
    positive: "stroke-emerald-600 dark:stroke-emerald-400",
    negative: "stroke-red-600 dark:stroke-red-400",
    warning: "stroke-amber-600 dark:stroke-amber-400",
    neutral: "stroke-zinc-500 dark:stroke-zinc-400",
  };
  const last = points[points.length - 1];

  function handleMove(e: ReactMouseEvent<SVGSVGElement>) {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = rect.width === 0 ? 0 : (e.clientX - rect.left) / rect.width;
    const idx = Math.round(frac * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, idx)));
  }

  const hoverPoint = interactive && hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <span className="relative inline-block">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        focusable="false"
        onMouseMove={interactive ? handleMove : undefined}
        onMouseLeave={interactive ? () => setHoverIndex(null) : undefined}
      >
        <path d={path} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={strokeColor[tone]} />
        <circle cx={last.x} cy={last.y} r="2" className={cx(strokeColor[tone], "fill-current")} />
        {hoverPoint && (
          <circle
            cx={hoverPoint.x}
            cy={hoverPoint.y}
            r="2.5"
            className={cx(strokeColor[tone], "fill-current stroke-white dark:stroke-zinc-950")}
            strokeWidth="1.5"
          />
        )}
      </svg>
      {hoverPoint && hoverIndex !== null && (
        <span
          role="status"
          className={cx(
            "pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10px] font-medium shadow-sm",
            BORDER,
            "bg-white dark:bg-zinc-900",
            TEXT_PRIMARY,
            NUM,
          )}
        >
          ≈ {formatValue ? formatValue(data[hoverIndex]) : data[hoverIndex]}
        </span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Segmented control (radiogroup 패턴) — 상호 배타적 필터에 사용               */
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
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("inline-flex rounded-full border p-1", BORDER, "bg-white dark:bg-zinc-900")}
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
              "min-h-11 rounded-full px-3.5 py-1.5 text-sm font-medium",
              TRANSITION,
              FOCUS_RING,
              checked ? "bg-indigo-600 text-white" : cx(TEXT_SECONDARY, "hover:bg-zinc-100 dark:hover:bg-white/5"),
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
/* Tabs (tablist / tabpanel 패턴) — 카드 내부 뷰 전환에 사용                    */
/* ---------------------------------------------------------------------- */

export function Tabs<T extends string>({
  ariaLabel,
  idPrefix,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  idPrefix: string;
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
    <div role="tablist" aria-label={ariaLabel} className="inline-flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
      {options.map((opt, idx) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${opt.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${opt.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cx(
              "min-h-9 rounded-md px-3 py-1.5 text-xs font-semibold",
              TRANSITION,
              FOCUS_RING,
              selected
                ? cx("bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50")
                : cx(TEXT_SECONDARY, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  labelledBy,
  children,
}: {
  id: string;
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <div role="tabpanel" id={id} aria-labelledby={labelledBy} tabIndex={0} className={FOCUS_RING_INSET}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Popover — 워크스페이스 스위처/유저 메뉴/알림 패널 공용 open-state 훅         */
/* ---------------------------------------------------------------------- */

export function usePopover() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return { open, setOpen, containerRef, triggerRef };
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
    <th scope="col" aria-sort={ariaSort} className={cx("px-3 py-2.5", align === "right" && "text-right")}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={cx(
          "inline-flex items-center gap-1 py-1.5 text-xs font-semibold uppercase tracking-wide",
          TEXT_SECONDARY,
          "hover:text-zinc-900 dark:hover:text-zinc-100",
          TRANSITION,
          FOCUS_RING,
          "rounded",
          align === "right" && "flex-row-reverse",
        )}
      >
        {children}
        <span aria-hidden="true" className={cx("text-[10px]", active ? "opacity-100" : "opacity-30")}>
          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

export { cx, NUM };
