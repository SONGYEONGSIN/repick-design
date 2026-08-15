"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { CARD, FOCUS, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx, type Tone } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <div id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </div>
  );
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
        {description ? <p className={cx("mt-0.5 text-xs leading-snug", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-semibold tracking-wider uppercase", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-none font-medium", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function SeverityLabel({ severity, toneMap }: { severity: "low" | "medium" | "high"; toneMap: Record<"low" | "medium" | "high", Tone> }) {
  const label = severity === "high" ? "High" : severity === "medium" ? "Medium" : "Low";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300">
      <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", toneDot(toneMap[severity]))} />
      {label}
    </span>
  );
}

function toneDot(tone: Tone): string {
  if (tone === "bad") return "bg-rose-500";
  if (tone === "warn") return "bg-amber-500";
  if (tone === "good") return "bg-emerald-500";
  return "bg-zinc-400";
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

/* -------------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-lg border p-0.5", "border-white/10 bg-zinc-950")}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cx(
              "h-9 rounded-md px-3 text-xs font-medium",
              TRANSITION,
              FOCUS,
              active ? cx(CARD, TEXT_PRIMARY, "font-semibold") : cx(TEXT_CAPTION, "hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- Pills */

export function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cx(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium whitespace-nowrap",
        TRANSITION,
        FOCUS,
        active ? cx("border-emerald-500/30 bg-emerald-500/15 text-emerald-300") : cx("border-white/10 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5"),
      )}
    >
      {children}
    </button>
  );
}
