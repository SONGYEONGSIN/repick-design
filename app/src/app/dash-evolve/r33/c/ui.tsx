"use client";

/**
 * Shared presentational + interaction primitives for the Arcway Growth
 * dashboard. Kept local to this candidate folder per the brief's "split into
 * local files" instruction — nothing here is imported from outside
 * `dash-evolve/r33/c`.
 *
 * Weight discipline: this file only ever applies `font-medium` (buttons,
 * labels, badges, table headers) or leaves text at the inherited regular
 * weight. `font-bold` is reserved for page.tsx / hero-stats.tsx / funnel.tsx
 * headline numbers — see the route-wide 3-weight budget in the self-report.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag
      className={`rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 ${className}`}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

const BADGE_TONE: Record<"neutral" | "accent" | "positive" | "negative", string> = {
  neutral: "bg-white/5 text-zinc-300 border-white/10",
  accent: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  positive: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25",
  negative: "bg-rose-500/10 text-rose-300 border-rose-400/25",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "positive" | "negative";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] ${BADGE_TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

export function Progress({
  value,
  max,
  label,
  valueText,
}: {
  value: number;
  max: number;
  label: string;
  valueText: string;
}) {
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">{label}</span>
        <span className="text-xs tabular-nums text-zinc-300">{valueText}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-violet-500 motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out"
          style={{ width: `${pct.toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline (decorative — the metric it illustrates is always printed as
// text beside it, per the "never hover-only" rule; this is supplementary).
// ---------------------------------------------------------------------------

export function Sparkline({
  values,
  width = 128,
  height = 36,
  color = "#a78bfa",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values
    .map((v, i) => {
      const x = Number((i * stepX).toFixed(2));
      const y = Number((height - ((v - min) / span) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = Number(((values.length - 1) * stepX).toFixed(2));
  const lastY = Number(
    (height - ((values[values.length - 1] - min) / span) * height).toFixed(2)
  );
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      className="overflow-visible"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={2.25} fill={color} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Segmented control — a button group (role="group"), not a tab panel
// switcher. Used for the period toggle.
// ---------------------------------------------------------------------------

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-11 items-center rounded-lg border border-white/10 bg-zinc-900 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-full rounded-md px-3.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
              active ? "bg-violet-500/20 text-violet-200" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs — real ARIA tabs (tablist/tab/tabpanel) with roving tabindex.
// ---------------------------------------------------------------------------

export function Tabs<T extends string>({
  id,
  options,
  value,
  onChange,
  label,
}: {
  /** Shared id namespace — pass the same string to the matching `TabPanel`s. */
  id: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + options.length) % options.length;
    onChange(options[next].value);
    const el = document.getElementById(`${id}-tab-${options[next].value}`);
    el?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className="inline-flex items-center gap-1 border-b border-white/10">
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            id={`${id}-tab-${opt.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${id}-panel-${opt.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`relative px-3 py-2 text-[13px] font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt.label}
            {active ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-400" aria-hidden="true" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  tabId,
  value,
  children,
}: {
  tabId: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div role="tabpanel" id={`${tabId}-panel-${value}`} aria-labelledby={`${tabId}-tab-${value}`}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popover — generic trigger + floating panel with outside-click, Escape and
// focus-return handling. Backs the workspace switcher, notifications and
// avatar menu.
// ---------------------------------------------------------------------------

export function Popover({
  trigger,
  children,
  align = "left",
  panelClassName = "",
}: {
  trigger: (opts: { open: boolean; triggerProps: ButtonHTMLAttributes<HTMLButtonElement> & { ref: Ref<HTMLButtonElement> } }) => ReactNode;
  children: (opts: { close: () => void }) => ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // `close` is handed to the `children` render-prop below, which runs during
  // this component's render — so the ref read inside it has to be deferred
  // behind `useCallback` rather than a plain function declaration. A plain
  // function here reads the same way at call time either way, but the
  // ref-safety lint rule specifically wants the stable-callback form so it
  // can see the ref access is confined to a later event, not this render.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "button, a, [tabindex]:not([tabindex='-1'])"
    );
    firstFocusable?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <div ref={containerRef} className="relative inline-block">
      {trigger({
        open,
        triggerProps: {
          ref: triggerRef,
          "aria-expanded": open,
          "aria-haspopup": "menu",
          onClick: () => setOpen((o) => !o),
        },
      })}
      {open ? (
        <div
          ref={panelRef}
          role="menu"
          className={`absolute z-30 mt-2 min-w-[14rem] rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40 ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {children({ close })}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  icon: Icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-zinc-300 transition-colors motion-reduce:transition-none hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
    >
      {Icon ? <Icon className="h-4 w-4 text-zinc-400" aria-hidden /> : null}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// SelectMenu — single-select list built on Popover (channel filter, workspace
// switcher).
// ---------------------------------------------------------------------------

export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  triggerLabel,
  align = "left",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
  triggerLabel: string;
  align?: "left" | "right";
}) {
  const current = options.find((o) => o.value === value);
  return (
    <Popover
      align={align}
      trigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          type="button"
          className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm font-medium text-zinc-200 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          <span className="text-zinc-400">{triggerLabel}:</span>
          <span className="text-zinc-50">{current?.label ?? "All"}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 motion-safe:transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      )}
    >
      {({ close }) => (
        <ul role="listbox" aria-label={ariaLabel} className="flex flex-col">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  close();
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                {opt.label}
                {opt.value === value ? <Check className="h-4 w-4 text-violet-300" aria-hidden /> : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// IconButton — 44px square control used across the top bar.
// ---------------------------------------------------------------------------

export function IconButton({
  icon: Icon,
  label,
  onClick,
  dotCount,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  dotCount?: number;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
        active ? "border-violet-400/30 bg-violet-500/15 text-violet-200" : "border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5 hover:text-zinc-100"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
      {dotCount && dotCount > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-medium tabular-nums text-white">
          {dotCount > 9 ? "9+" : dotCount}
        </span>
      ) : null}
    </button>
  );
}
