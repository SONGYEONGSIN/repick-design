"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ServiceCategory } from "./data";
import { CATEGORY_LABEL, sparklinePoints } from "./data";

/**
 * Font-weight budget for this whole route is exactly three rendered weights: 400 (body copy,
 * captions, auxiliary numbers), 500 (labels, nav, buttons, category tags) and 600 (headings,
 * headline numbers, primary CTA). 700/`font-bold` is never used anywhere, including elements
 * with a UA-default bold (`<th>` always carries an explicit `font-medium` override; `<b>`/
 * `<strong>` are avoided outright).
 *
 * A real, opaque, visible focus ring — never bare `outline-none`, never `ring-*`/`ring-offset-*`
 * (renders fully transparent in this Tailwind v4 setup).
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500";

/** Accent discipline for this round: standard Tailwind `violet-500/600/700` tokens only, used
 *  sparingly — focus rings, the selected treemap tile's border, the primary CTA and segmented
 *  control's active pill, and one progress bar inside the selection drawer. Category tiles
 *  themselves stay on a desaturated zinc scale; violet never colors a whole data tile. */
export const ACCENT_SOLID = "bg-violet-600 hover:bg-violet-700 text-white";

export function Card({
  children,
  className = "",
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={`min-w-0 rounded-2xl border border-white/10 bg-zinc-900/60 ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 ${className}`}>{children}</span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex min-w-0 flex-wrap items-center gap-0.5 rounded-full border border-white/10 bg-zinc-950/60 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`${FOCUS} flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
              active ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Category badge — same fill/text/border pairing the treemap tiles use (`CATEGORY_STYLE`),
 *  so a category reads as the same visual "chip" whether you are looking at the treemap or the
 *  fallback table. */
export const CATEGORY_STYLE: Record<
  ServiceCategory,
  { fill: string; text: string; border: string; borderHover: string; dashed?: boolean }
> = {
  compute: { fill: "bg-zinc-600", text: "text-zinc-50", border: "border-white/10", borderHover: "hover:border-white/30" },
  database: { fill: "bg-zinc-700", text: "text-zinc-50", border: "border-white/10", borderHover: "hover:border-white/30" },
  storage: { fill: "bg-zinc-800", text: "text-zinc-50", border: "border-white/10", borderHover: "hover:border-white/30" },
  network: { fill: "bg-zinc-300", text: "text-zinc-900", border: "border-zinc-900/15", borderHover: "hover:border-zinc-900/40" },
  observability: { fill: "bg-zinc-900", text: "text-zinc-50", border: "border-white/10", borderHover: "hover:border-white/30" },
  other: { fill: "bg-zinc-900", text: "text-zinc-50", border: "border-white/20", borderHover: "hover:border-white/40", dashed: true },
};

export function CategoryBadge({ category }: { category: ServiceCategory }) {
  const s = CATEGORY_STYLE[category];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${s.fill} ${s.text} ${
        s.dashed ? "border border-dashed border-white/30" : ""
      }`}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div role="img" aria-label={label} className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-violet-600" style={{ width: `${safe}%` }} />
    </div>
  );
}

export function Sparkline({
  values,
  width = 72,
  height = 28,
  className = "",
  ariaLabel,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`shrink-0 ${className}`} style={{ width, height }} role="img" aria-label={ariaLabel}>
      <polyline
        points={sparklinePoints(values, width, height)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A tiny shared "how many overlays want the page scroll locked right now" counter — a plain
 * module-level value, not React state, since it only ever drives one side effect
 * (`document.body.style.overflow`) and never needs to trigger a render. Every overlay in this
 * route (drawer, search, new-alert modal, mobile nav) calls this in its mount effect instead of
 * setting `overflow` directly, because `<AnimatePresence>` keeps the OUTGOING overlay mounted
 * for the length of its exit transition — so for a brief moment while one overlay is animating
 * out and another is animating in, two can genuinely be mounted at once, and whichever one's
 * cleanup ran last would otherwise clobber the other's lock.
 */
let scrollLockCount = 0;
export function lockBodyScroll(): () => void {
  scrollLockCount += 1;
  if (scrollLockCount === 1) document.body.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) document.body.style.overflow = "";
  };
}

/** A minimal, dependency-free Tab-key focus trap for a dialog/drawer panel: Tab from the last
 *  focusable element wraps to the first, and Shift+Tab from the first wraps to the last. Used by
 *  every overlay in this route (selection drawer, search overlay, new-alert modal) so keyboard
 *  focus never escapes to the page behind a modal/drawer while it is open. */
export function trapTabKey(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== "Tab" || !container) return;
  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
