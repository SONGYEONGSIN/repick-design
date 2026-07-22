"use client";

import { Check, ChevronDown } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { round2 } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx, type StateMeta, type Tone, TONE } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={cx(CARD_CLASS, padded && "p-4 sm:p-5", className)}>{children}</div>;
}
const CARD_CLASS = cx("rounded-2xl border", BORDER, "bg-white dark:bg-zinc-900", "shadow-sm");

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

/* -------------------------------------------------------------- Outside close hook (dropdown/popover 공용) */

export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone = "neutral", Icon, children }: { tone?: Tone; Icon?: typeof Check; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", t.text, t.bg, t.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** 상태 배지(색 + 텍스트 병행) — 피킹 작업 상태(STATUS_META) 공용, meta를 직접 받는다. */
export function StatusBadge({ meta }: { meta: StateMeta }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium leading-none", meta.text, meta.bg, meta.border)}>
      <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

/* ---------------------------------------------------------------- Progress */

/** 수평 진행률 바 — 적재율 등 공용 시각화. value/max 0 이상, 색+수치 병행. */
export function ProgressBar({
  value,
  max = 100,
  toneClass,
  trackClass,
  className,
  label,
}: {
  value: number;
  max?: number;
  toneClass: string;
  trackClass?: string;
  className?: string;
  label?: string;
}) {
  const pct = round2(clampPct((value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cx("h-1.5 w-full overflow-hidden rounded-full", trackClass ?? "bg-zinc-100 dark:bg-zinc-800", className)}
    >
      <div className={cx("h-full rounded-full", toneClass, "motion-safe:transition-[width] motion-safe:duration-500")} style={{ width: `${pct}%` }} />
    </div>
  );
}
function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
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

/* --------------------------------------------------------- Listbox dropdown (필터 등) */

export function Listbox<T extends string>({
  ariaLabel,
  triggerLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  triggerLabel: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const activeLabel = options.find((o) => o.id === value)?.label ?? triggerLabel;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
          TEXT_PRIMARY,
        )}
      >
        <span className="max-w-[8.5rem] truncate">{triggerLabel}: {activeLabel}</span>
        <ChevronDown size={13} aria-hidden="true" className={TEXT_CAPTION} />
      </button>
      {open ? (
        <div role="listbox" aria-label={ariaLabel} className={cx("absolute right-0 top-full z-30 mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg dark:bg-zinc-900")}>
          {options.map((opt) => {
            const selected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? "bg-indigo-50 dark:bg-indigo-500/10" : HOVER_ACTIVE_BG,
                  TEXT_PRIMARY,
                )}
              >
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                {selected && <Check size={13} aria-hidden="true" className="shrink-0 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- Sort trigger (피킹 큐 정렬 버튼) */

export function SortTrigger<T extends string>({
  ariaLabel,
  options,
  value,
  dir,
  onChange,
  onToggleDir,
}: {
  ariaLabel: string;
  options: { id: T; label: string }[];
  value: T;
  dir: "asc" | "desc";
  onChange: (id: T) => void;
  onToggleDir: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={ariaLabel}>
      <SegmentedControl ariaLabel={ariaLabel} options={options} value={value} onChange={onChange} size="sm" />
      <button
        type="button"
        onClick={onToggleDir}
        aria-label={dir === "asc" ? "오름차순 정렬 중 — 내림차순으로 전환" : "내림차순 정렬 중 — 오름차순으로 전환"}
        className={cx(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
          TEXT_CAPTION,
        )}
      >
        <ChevronDown size={14} aria-hidden="true" className={cx("motion-safe:transition-transform", dir === "asc" && "rotate-180")} />
      </button>
    </div>
  );
}

/* --------------------------------------------------------- Sparkline */

/** 결정론 추이 스파크라인 — 라인 + 은은한 면적 + 종점. 좌표 소수 2자리. */
export function Sparkline({ values, stroke, fill, className }: { values: number[]; stroke: string; fill: string; className?: string }) {
  const W = 120;
  const H = 28;
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
      <path d={area} className={fill} fillOpacity={0.14} stroke="none" />
      <path d={line} className={stroke} fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.2} className={cx(stroke, fill)} strokeWidth={1.25} />
    </svg>
  );
}

export { NUM };
