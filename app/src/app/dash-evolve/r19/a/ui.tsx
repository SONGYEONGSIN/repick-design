"use client";

import type { LucideIcon } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BORDER, CARD, FOCUS, NUM, SURFACE_INSET, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ------------------------------------------------------------------------------------- Card */

export function Card({
  as: As = "section",
  children,
  className,
  padded = true,
  ariaLabelledBy,
  id,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  padded?: boolean;
  ariaLabelledBy?: string;
  id?: string;
}) {
  return (
    <As id={id} aria-labelledby={ariaLabelledBy} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </As>
  );
}

export function CardHeader({
  as: As = "h2",
  titleId,
  title,
  description,
  Icon,
  action,
}: {
  as?: ElementType;
  titleId?: string;
  title: ReactNode;
  description?: ReactNode;
  Icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <As id={titleId} className={cx("text-sm font-medium tracking-tight", TEXT_PRIMARY)}>
            {title}
          </As>
        </div>
        {description ? <p className={cx("mt-1 text-xs leading-relaxed", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_CAPTION, className)}>{children}</span>;
}

/* ------------------------------------------------------------------------------------ Badge */

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", BORDER, SURFACE_INSET, TEXT_CAPTION, className)}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------------------- Avatar */

/** Deterministic hue from a name — no `Math.random`, same name always paints the same tile. */
function hueFrom(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function InitialsAvatar({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const hue = hueFrom(name);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cx("inline-flex shrink-0 items-center justify-center rounded-full border font-medium text-white", className)}
      style={{ width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.4)), backgroundColor: `hsl(${hue} 42% 38%)`, borderColor: `hsl(${hue} 42% 30%)` }}
    >
      {initials}
    </span>
  );
}

/* --------------------------------------------------------------------------- Stat item (dl) */

export function StatItem({
  Icon,
  label,
  value,
  hint,
  valueClassName,
}: {
  Icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className={cx("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border", BORDER, SURFACE_INSET)}>
        <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
      </span>
      <div className="min-w-0">
        <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_CAPTION)}>{label}</dt>
        <dd className={cx("text-lg font-medium leading-tight", NUM, valueClassName ?? TEXT_PRIMARY)}>{value}</dd>
        {hint ? <p className={cx("text-[11px]", TEXT_CAPTION)}>{hint}</p> : null}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
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
              "flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-white font-medium text-zinc-900 shadow-sm" : cx("font-normal", TEXT_CAPTION, "hover:text-zinc-900"),
            )}
          >
            {opt.Icon ? <opt.Icon size={13} aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------------- Outside close */

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

/* ------------------------------------------------------------------------------------ HoverTip */

/**
 * Hover + focus tooltip, keyboard reachable (opens on `onFocus`, closes on `onBlur`, so a Tab user
 * gets the same disclosure a mouse user does). The trigger's OWN visible text already carries the
 * headline number — this only adds the breakdown behind it, per charts.catalog "value must not be
 * hover-only".
 */
export function useHoverTip(id: string) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId === id;
  return {
    open,
    bind: {
      onMouseEnter: () => setOpenId(id),
      onMouseLeave: () => setOpenId((k) => (k === id ? null : k)),
      onFocus: () => setOpenId(id),
      onBlur: () => setOpenId((k) => (k === id ? null : k)),
    },
  };
}

export function HoverTip({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <div id={id} role="tooltip" className={cx("pointer-events-none absolute z-30 rounded-lg border px-2.5 py-2 text-xs shadow-lg", BORDER, "bg-zinc-900 text-white", className)}>
      {children}
    </div>
  );
}
