"use client";

/**
 * Quorum 디자인 프리미티브.
 * radius / border / shadow / spacing 을 한 곳에서 고정해 카드·컨트롤·배지가
 * 같은 시스템으로 읽히게 한다. 포커스는 전부 아래 FOCUS 토큰 하나로 통일한다 —
 * Tailwind v4 에서 실제로 그려지지 않는 두 관용구(링 오프셋 병용, 아웃라인 선제 해제)는
 * 어디에서도 쓰지 않는다.
 */

import { useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AVATAR_TINTS } from "./data";

export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ----------------------------------------------------------------- Label */

export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] uppercase tracking-[0.14em] text-zinc-500", className)}>
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- Badge */

export function Badge({
  children,
  icon: Icon,
  className,
}: {
  children: ReactNode;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs whitespace-nowrap ring-1 ring-inset",
        className ?? "bg-zinc-50 text-zinc-700 ring-zinc-200",
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Avatar */

export function Avatar({
  name,
  tint,
  size = "md",
}: {
  name: string;
  tint: number;
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-white",
        AVATAR_TINTS[tint % AVATAR_TINTS.length],
        size === "sm" ? "h-6 w-6 text-[11px]" : "h-9 w-9 text-sm",
      )}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* ------------------------------------------------------ SegmentedControl */

export type SegmentOption<T extends string> = { value: T; label: string };

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (next: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1",
        size === "sm" ? "h-9" : "h-11",
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-full items-center rounded-md px-3 text-sm whitespace-nowrap transition-colors motion-reduce:transition-none",
              FOCUS,
              active
                ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(24,24,27,0.10)]"
                : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- Dropdown */

export function Dropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (next: T) => void;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-9 max-w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 motion-reduce:transition-none",
          FOCUS,
        )}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden /> : null}
        <span className="text-zinc-500">{label}</span>
        <span className="truncate text-zinc-900">{current.label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1 shadow-[0_12px_32px_rgba(24,24,27,0.12)]"
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50",
                  FOCUS,
                )}
              >
                <span className={active ? "text-zinc-900" : undefined}>{option.label}</span>
                {active ? <Check className="h-4 w-4 shrink-0 text-violet-700" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ Sparkline */

export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = Math.round((index / (values.length - 1)) * 6800) / 100;
      const y = Math.round((22 - ((value - min) / span) * 18) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 68 24"
      className="h-6 w-[68px] shrink-0 overflow-visible"
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ------------------------------------------------------------- SlaMeter */

export function SlaMeter({
  remaining,
  budget,
  urgent,
}: {
  remaining: number;
  budget: number;
  urgent: boolean;
}) {
  const pct = Math.max(4, Math.min(100, Math.round((remaining / budget) * 100)));
  return (
    <span
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={budget}
      aria-valuenow={remaining}
      aria-label="SLA 잔여 시간"
      className="block h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
    >
      <span
        className={cn(
          "block h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none",
          urgent ? "bg-violet-700" : "bg-zinc-400",
        )}
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

/* ---------------------------------------------------------- 스크롤 잠금 */

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}
