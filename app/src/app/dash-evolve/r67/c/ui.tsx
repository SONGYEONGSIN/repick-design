"use client";

import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { TREND_WEEK_LABELS, fmtUsdCompact } from "./data";

/**
 * Font-weight budget for this whole route, measured route-wide: 400 (body copy, captions, table
 * cells, sparkline tick labels), 500 (nav items, field labels, segmented/tab controls, badges) and
 * 600 (the hero number, card titles, the h1, the primary action). 700/`font-bold` is never used,
 * including on elements with a UA-default bold — every `<th>` carries an explicit `font-medium`
 * override and `<b>`/`<strong>` are avoided outright. No display face anywhere: every one of those
 * three weights renders on `--font-sans` (Pretendard), including the "Ledgerflow" wordmark and the
 * hero figure — only size/weight/color/tracking build the hierarchy.
 *
 * A real, opaque, visible focus ring. Tailwind v4 renders `ring-*`/`ring-offset-*` fully
 * transparent unless a ring color is set explicitly, and the combination is fragile even then, so
 * every focusable element on this route uses the plain `outline` utility instead — it sets
 * `outline-style: solid` directly, so there is nothing for `outline-none` to cancel.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

export const FOCUS_INSET =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-700";

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
    <div
      id={id}
      className={`min-w-0 rounded-2xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-sm font-semibold text-zinc-900 ${className}`}>{children}</h2>;
}

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
    <div
      role="group"
      aria-label={label}
      className="inline-flex min-w-0 flex-wrap items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`${FOCUS} h-8 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${
              active ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Underline tabs — visually distinct from the pill-style `SegmentedControl` above so the two
 *  control families never look interchangeable. Used inside the plan detail panel to switch
 *  between its bridge breakdown and its top-accounts list. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex min-w-0 flex-wrap gap-4 border-b border-zinc-200">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`${FOCUS} -mb-px whitespace-nowrap border-b-2 px-0.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${
              active ? "border-emerald-700 text-emerald-700" : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_TONE: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Active" },
  at_risk: { bg: "bg-amber-50", text: "text-amber-700", label: "At risk" },
  churned: { bg: "bg-rose-50", text: "text-rose-700", label: "Churned" },
};

export function StatusBadge({ status }: { status: "active" | "at_risk" | "churned" }) {
  const tone = STATUS_TONE[status];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tone.bg} ${tone.text}`}>
      {tone.label}
    </span>
  );
}

export function PlanBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
      {label}
    </span>
  );
}

export function ProgressBar({ value, max, label, tone = "bg-emerald-600" }: { value: number; max: number; label: string; tone?: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div role="img" aria-label={label} className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "text-zinc-900",
  sparkline,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: string;
  sparkline?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />}
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">{label}</p>
      </div>
      <p className={`mt-1 truncate text-xl font-semibold tabular-nums ${tone}`}>{value}</p>
      {sparkline && <div className="mt-2">{sparkline}</div>}
    </div>
  );
}

/**
 * Decorative line-with-area sparkline. Always `aria-hidden` — every place this is used (the hero
 * card and the four inline stat tiles) already prints its own headline number as plain text right
 * next to it, so the chart never carries information that isn't available without hovering.
 */
export function Sparkline({
  values,
  tone = "emerald",
  height = 32,
}: {
  values: number[];
  tone?: "emerald" | "rose" | "zinc";
  height?: number;
}) {
  const width = 120;
  const pad = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const scaleX = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (width - pad * 2);
  const scaleY = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2);

  const linePath = values.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${scaleX(values.length - 1).toFixed(1)},${height - pad} L${scaleX(0).toFixed(1)},${height - pad} Z`;

  const stroke = tone === "emerald" ? "text-emerald-600" : tone === "rose" ? "text-rose-500" : "text-zinc-500";
  const fill = tone === "emerald" ? "fill-emerald-600/10" : tone === "rose" ? "fill-rose-500/10" : "fill-zinc-500/10";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} aria-hidden="true" className="block overflow-visible">
      <path d={areaPath} className={fill} stroke="none" />
      <path d={linePath} fill="none" className={stroke} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The route's one ephemeral hover/focus inspector (interaction axis B). Entirely local state —
 * `hoveredIndex` lives inside this single table-cell instance and is never lifted to the page, so
 * hovering one account's trend never reads or writes `pinnedPlanId` (the click-to-pin axis on the
 * plan bridge grid) and vice versa. Keyboard-reachable: focusing the button shows the latest point,
 * and ArrowLeft/ArrowRight walk the series; blur/mouse-leave clears it back to nothing shown.
 */
export function InspectableSparkline({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 108;
  const height = 30;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const scaleX = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (width - pad * 2);
  const scaleY = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2);
  const linePath = values.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`).join(" ");

  const trendUp = values[values.length - 1] >= values[0];

  function nearestIndex(clientX: number, rect: DOMRect): number {
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (values.length - 1));
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label={`${ariaLabel}. Use arrow keys to inspect each week.`}
        className={`${FOCUS_INSET} -m-1 block rounded-md p-1`}
        onMouseMove={(e) => setHoveredIndex(nearestIndex(e.clientX, e.currentTarget.getBoundingClientRect()))}
        onMouseLeave={() => setHoveredIndex(null)}
        onFocus={() => setHoveredIndex(values.length - 1)}
        onBlur={() => setHoveredIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setHoveredIndex((i) => Math.max(0, (i ?? values.length - 1) - 1));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setHoveredIndex((i) => Math.min(values.length - 1, (i ?? values.length - 1) + 1));
          }
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" className="block">
          <path
            d={linePath}
            fill="none"
            className={trendUp ? "text-emerald-600" : "text-rose-500"}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {hoveredIndex !== null && (
            <>
              <line x1={scaleX(hoveredIndex)} x2={scaleX(hoveredIndex)} y1={0} y2={height} className="text-zinc-300" stroke="currentColor" strokeWidth={1} />
              <circle cx={scaleX(hoveredIndex)} cy={scaleY(values[hoveredIndex])} r={2.5} className={trendUp ? "text-emerald-700" : "text-rose-600"} fill="currentColor" />
            </>
          )}
        </svg>
      </button>
      {hoveredIndex !== null && (
        <div
          role="status"
          className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-normal tabular-nums text-zinc-700 shadow-lg"
        >
          {TREND_WEEK_LABELS[hoveredIndex]} · {fmtUsdCompact(values[hoveredIndex])}
        </div>
      )}
    </div>
  );
}

export type BridgeStepKind = "start" | "increase" | "decrease" | "end";
export interface BridgeStep {
  key: string;
  label: string;
  value: number;
  kind: BridgeStepKind;
}

/**
 * Compact per-segment waterfall — the page's small-multiples device (one instance per plan tier in
 * `PlanWaterfallGrid`). Each instance is self-scaled to its own min/max, which is the normal
 * convention for a small-multiples grid of waterfalls (unlike a shared-axis bullet-chart grid,
 * there is no common ceiling across cards here). The bars are `aria-hidden`; the dollar figure
 * under every bar is plain, always-visible text, and the figure's own `role="img"` label repeats
 * the whole bridge as one sentence for screen readers.
 */
export function WaterfallChart({ steps, summary }: { steps: BridgeStep[]; summary: string }) {
  // Pure fold: the running total is threaded through the `reduce` accumulator itself (a dedicated
  // `runningAfter` field, separate from the bar's own `from`/`to` draw coordinates), never an
  // outer mutable variable reassigned from inside a `.map()` callback — that pattern is impure
  // under the render-purity rules and was the one source of both the lint failure and the
  // hydration mismatches, since server and client must compute identical bars from identical
  // inputs. For a "decrease" step the bar's `to` is the higher pre-decrease total (for drawing),
  // but the cumulative total the *next* step must build on is the lower post-decrease value — so
  // `runningAfter`, not `to`, is what gets carried forward.
  const bars = steps
    .reduce<{ step: BridgeStep; from: number; to: number; runningAfter: number }[]>((acc, step) => {
      const runningBefore = acc.length > 0 ? acc[acc.length - 1].runningAfter : 0;
      if (step.kind === "start" || step.kind === "end") {
        return [...acc, { step, from: 0, to: step.value, runningAfter: step.value }];
      }
      if (step.kind === "increase") {
        const runningAfter = runningBefore + step.value;
        return [...acc, { step, from: runningBefore, to: runningAfter, runningAfter }];
      }
      const runningAfter = runningBefore - step.value;
      return [...acc, { step, from: runningAfter, to: runningBefore, runningAfter }];
    }, [])
    .map(({ step, from, to }) => ({ ...step, from, to }));

  const maxVal = Math.max(1, ...bars.flatMap((b) => [b.from, b.to]));
  const chartHeight = 72;
  const barCount = bars.length;
  const gap = 6;
  const barWidth = 28;
  const width = barCount * barWidth + (barCount - 1) * gap;
  const y = (v: number) => chartHeight - (v / maxVal) * chartHeight;

  function barFill(kind: BridgeStepKind): string {
    if (kind === "increase") return "fill-emerald-500";
    if (kind === "decrease") return "fill-rose-400";
    return "fill-zinc-400";
  }

  return (
    <figure role="img" aria-label={summary} className="min-w-0">
      <svg viewBox={`0 0 ${width} ${chartHeight}`} width="100%" height={chartHeight} aria-hidden="true" className="block overflow-visible">
        {bars.map((bar, i) => {
          const x = i * (barWidth + gap);
          const top = y(Math.max(bar.from, bar.to));
          const bottom = y(Math.min(bar.from, bar.to));
          const h = Math.max(1.5, bottom - top);
          return <rect key={bar.key} x={x} y={top} width={barWidth} height={h} rx={2} className={barFill(bar.kind)} />;
        })}
      </svg>
      <figcaption className="mt-1.5 grid gap-1.5 text-center" style={{ gridTemplateColumns: `repeat(${barCount}, minmax(0, 1fr))` }}>
        {bars.map((bar) => (
          <span key={bar.key} className="min-w-0">
            <span className="block truncate text-[10px] font-normal uppercase tracking-wide text-zinc-600">{bar.label}</span>
            <span className="block truncate text-[11px] font-medium tabular-nums text-zinc-900">
              {bar.kind === "decrease" ? "−" : bar.kind === "increase" ? "+" : ""}
              {fmtUsdCompact(bar.value)}
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
