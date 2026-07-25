"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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
  Icon,
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            {title}
          </Tag>
        </div>
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

/** Dot indicator (always used alongside label text to honor the color+text pairing rule). */
export function Dot({ tone = "neutral" }: { tone?: Tone }) {
  const t = TONE[tone];
  return <span aria-hidden="true" className={cx("inline-block size-1.5 shrink-0 rounded-full", t.dot)} />;
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
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex rounded-lg border p-0.5", BORDER, "bg-zinc-950")}>
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
              checked ? cx("bg-zinc-800 shadow-sm", TEXT_PRIMARY) : cx(TEXT_CAPTION, "hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- Dropdown */

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

export function Dropdown<T extends string>({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const current = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium",
          BORDER,
          "bg-zinc-950 hover:bg-white/5",
          TEXT_CAPTION,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <span className={TEXT_CAPTION}>{label}:</span>
        <span className={TEXT_PRIMARY}>{current?.label ?? "All"}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cx("absolute left-0 top-full z-30 mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border p-1", BORDER, "bg-zinc-900 shadow-lg shadow-black/40")}
        >
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
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? cx("bg-teal-500/10", TEXT_PRIMARY) : cx(TEXT_CAPTION, "hover:bg-white/5 hover:text-zinc-100"),
                )}
              >
                {opt.label}
                {selected && <Check size={13} aria-hidden="true" className="shrink-0 text-teal-300" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- Sparkline */

/** Deterministic mini sparkline — line + subtle area fill + endpoint dot. Coordinates rounded to 2 decimals. */
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
      <path d={area} className={fill} fillOpacity={0.14} stroke="none" />
      <path d={line} className={stroke} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.6} className={cx(stroke, fill)} strokeWidth={1.5} />
    </svg>
  );
}

export { NUM };
