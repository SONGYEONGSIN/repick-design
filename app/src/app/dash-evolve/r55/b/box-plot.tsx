"use client";

import { useState } from "react";
import type { VendorStats } from "./data";
import { formatMinutes } from "./data";
import { FOCUS_RING } from "./ui";

// Shared log scale (minutes) — every vendor's box plot, in the rail AND in the expanded detail
// view, is drawn against this exact same [1, 1000] domain, so any two rows are directly
// comparable by eye. A LINEAR shared scale was tried first and rejected: Relay SMS Gateway's
// whole distribution (1-18 minutes) and Coldline Storage's (200-950 minutes) differ by ~2 orders
// of magnitude, so a linear shared scale collapses the fast vendors to an invisible sliver near
// the axis origin — failing the "box-plots must be visibly drawn" rule for roughly half the
// portfolio. Log10 keeps one honest shared scale while keeping every single row's box and
// whiskers visibly wide (see MIN_VISUAL_WIDTH_PCT below), and the axis is drawn as explicit
// gridlines so the "it's log, not linear" fact is visible, not hidden.
export const SCALE_MIN = 1;
export const SCALE_MAX = 1000;
const SCALE_LOG_MAX = Math.log10(SCALE_MAX);
export const SCALE_TICKS = [1, 10, 100, 1000];
const MIN_VISUAL_WIDTH_PCT = 1.6;

export function valueToPct(value: number): number {
  const clamped = Math.min(Math.max(value, SCALE_MIN), SCALE_MAX);
  return (Math.log10(clamped) / SCALE_LOG_MAX) * 100;
}

interface Handle {
  key: string;
  pct: number;
  /** Short form shown in the floating tooltip — kept short deliberately so it can never need to
     render wider than its clamped position allows, even inside the narrow rail. */
  shortLabel: string;
  /** Full sentence used only for the accessible name (screen readers), where length is free. */
  ariaLabel: string;
}

function HandleButtons({
  handles,
  activeKey,
  onActivate,
  onDeactivate,
}: {
  handles: Handle[];
  activeKey: string | null;
  onActivate: (key: string) => void;
  onDeactivate: (key: string) => void;
}) {
  const active = handles.find((h) => h.key === activeKey) ?? null;
  return (
    <>
      {handles.map((h, i) => (
        <button
          key={h.key}
          type="button"
          aria-label={h.ariaLabel}
          onMouseEnter={() => onActivate(h.key)}
          onMouseLeave={() => onDeactivate(h.key)}
          onFocus={() => onActivate(h.key)}
          onBlur={() => onDeactivate(h.key)}
          // The visible tick/box/line for each handle is drawn entirely by the decorative
          // aria-hidden layer above — this button never renders anything itself (bg-transparent,
          // no border), so growing its hit area to the 24x24px minimum changes nothing visual.
          // Adjacent handles (e.g. the median tick and a close-by SLA target) can sit only a few
          // px apart on the shared log scale, so a 24px-wide box would otherwise overlap its
          // neighbor's box identically; staggering alternating handles to the top/bottom edge of
          // the track (inset positioning, track overflow-y is visible) keeps each hit box its
          // full 24x24 without two adjacent ones occupying the exact same rectangle.
          className={`absolute h-6 w-6 min-h-6 min-w-6 -translate-x-1/2 rounded-sm bg-transparent ${
            i % 2 === 0 ? "top-0" : "bottom-0"
          } ${FOCUS_RING}`}
          style={{ left: `${h.pct}%` }}
        />
      ))}
      {active ? (
        <div
          role="status"
          className="pointer-events-none absolute -top-6 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-900 shadow-sm"
          style={{ left: `${Math.min(Math.max(active.pct, 16), 84)}%` }}
        >
          {active.shortLabel}
        </div>
      ) : null}
    </>
  );
}

/**
 * Compact box plot for one rail row. The hovered/focused handle (`activeKey`) is local state —
 * it never leaves this component instance, so hovering one vendor's whisker in the rail touches
 * nothing else on the page. This is the "ephemeral" half of the selection-fan-out split; the
 * "persistent" half is the rail row's own click handler (owned by the parent, see VendorRail).
 */
export function CompactBoxPlot({
  stats,
  target,
  vendorName,
}: {
  stats: VendorStats;
  target: number;
  vendorName: string;
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const p10Pct = valueToPct(stats.p10);
  const p25Pct = valueToPct(stats.p25);
  const p50Pct = valueToPct(stats.p50);
  const p75Pct = valueToPct(stats.p75);
  const p90Pct = valueToPct(stats.p90);
  const targetPct = valueToPct(target);
  const boxWidth = Math.max(p75Pct - p25Pct, MIN_VISUAL_WIDTH_PCT);

  const handles: Handle[] = [
    { key: "p10", pct: p10Pct, shortLabel: `P10 ${formatMinutes(stats.p10)}`, ariaLabel: `${vendorName} — 10th percentile ${formatMinutes(stats.p10)}` },
    { key: "p50", pct: p50Pct, shortLabel: `Median ${formatMinutes(stats.p50)}`, ariaLabel: `${vendorName} — median ${formatMinutes(stats.p50)}` },
    { key: "p90", pct: p90Pct, shortLabel: `P90 ${formatMinutes(stats.p90)}`, ariaLabel: `${vendorName} — 90th percentile ${formatMinutes(stats.p90)}` },
    { key: "target", pct: targetPct, shortLabel: `Target ${formatMinutes(target)}`, ariaLabel: `${vendorName} — SLA target ${formatMinutes(target)}` },
  ];

  return (
    <div className="relative h-7 w-full min-w-0 overflow-x-hidden overflow-y-visible">
      {/* overflow-x-hidden clips the handful of px any centered marker/handle can bleed past 0%/
         100% at the scale extremes, without an overflow-x-auto scroller ever existing — the
         floating tooltip (which intentionally pops above the track) stays unclipped because the
         y axis is explicitly left visible. */}
      {/* Decorative drawing layer only — kept out of the a11y tree via this wrapper so the real
         interactive handles just below are never nested inside an aria-hidden ancestor. */}
      <div aria-hidden="true">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-zinc-400"
          style={{ left: `${p10Pct}%`, width: `${Math.max(p90Pct - p10Pct, 0)}%` }}
        />
        <div
          className="absolute top-1 bottom-1 rounded-[3px] border border-orange-400 bg-orange-200/70"
          style={{ left: `${p25Pct}%`, width: `${boxWidth}%` }}
        />
        <div className="absolute top-0 bottom-0 w-[2px] -translate-x-1/2 bg-orange-800" style={{ left: `${p50Pct}%` }} />
        {/* Target marker: a dashed vertical line, deliberately a different line STYLE (not just a
           different color) from the solid median tick, so the two stay distinguishable without
           relying on color alone. */}
        <div
          className="absolute -top-0.5 -bottom-0.5 w-0 -translate-x-1/2 border-l-2 border-dashed border-zinc-900"
          style={{ left: `${targetPct}%` }}
        />
      </div>
      <HandleButtons
        handles={handles}
        activeKey={activeKey}
        onActivate={(k) => setActiveKey(k)}
        onDeactivate={(k) => setActiveKey((cur) => (cur === k ? null : cur))}
      />
    </div>
  );
}

/**
 * Expanded box plot for the pinned vendor's Overview tab — same shared [1,1000] log scale as
 * every compact rail row, drawn larger with the full five-number summary and the SLA target
 * always printed as text (never hover-gated), plus axis gridlines so the log scale is legible.
 */
export function ExpandedBoxPlot({ stats, target, vendorName }: { stats: VendorStats; target: number; vendorName: string }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const p10Pct = valueToPct(stats.p10);
  const p25Pct = valueToPct(stats.p25);
  const p50Pct = valueToPct(stats.p50);
  const p75Pct = valueToPct(stats.p75);
  const p90Pct = valueToPct(stats.p90);
  const targetPct = valueToPct(target);
  const boxWidth = Math.max(p75Pct - p25Pct, MIN_VISUAL_WIDTH_PCT);

  const handles: Handle[] = [
    { key: "p10", pct: p10Pct, shortLabel: `P10 ${formatMinutes(stats.p10)}`, ariaLabel: `${vendorName} — 10th percentile ${formatMinutes(stats.p10)}` },
    { key: "p25", pct: p25Pct, shortLabel: `P25 ${formatMinutes(stats.p25)}`, ariaLabel: `${vendorName} — 25th percentile ${formatMinutes(stats.p25)}` },
    { key: "p50", pct: p50Pct, shortLabel: `Median ${formatMinutes(stats.p50)}`, ariaLabel: `${vendorName} — median ${formatMinutes(stats.p50)}` },
    { key: "p75", pct: p75Pct, shortLabel: `P75 ${formatMinutes(stats.p75)}`, ariaLabel: `${vendorName} — 75th percentile ${formatMinutes(stats.p75)}` },
    { key: "p90", pct: p90Pct, shortLabel: `P90 ${formatMinutes(stats.p90)}`, ariaLabel: `${vendorName} — 90th percentile ${formatMinutes(stats.p90)}` },
    { key: "target", pct: targetPct, shortLabel: `Target ${formatMinutes(target)}`, ariaLabel: `${vendorName} — SLA target ${formatMinutes(target)}` },
  ];

  return (
    <div className="min-w-0">
      <div className="relative h-14 w-full min-w-0 overflow-x-hidden overflow-y-visible">
        <div aria-hidden="true">
          {SCALE_TICKS.map((tick, i) => {
            // The last tick sits at exactly 100% of the track. Positioning a 1px-wide gridline
            // with `left: 100%` pushes its own box 1px past the container's right edge (the
            // element is 1px wide starting AT the edge), which is a fixed, width-independent 1px
            // overflow — not a rounding artifact. Anchoring that one tick from the right instead
            // keeps it flush inside the track with no visual change.
            const isLast = i === SCALE_TICKS.length - 1;
            return (
              <div
                key={tick}
                className="absolute top-0 bottom-5 w-px bg-zinc-100"
                style={isLast ? { right: 0 } : { left: `${valueToPct(tick)}%` }}
              />
            );
          })}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 bg-zinc-400"
            style={{ left: `${p10Pct}%`, width: `${Math.max(p90Pct - p10Pct, 0)}%` }}
          />
          <div
            className="absolute top-2 bottom-7 rounded-[4px] border border-orange-400 bg-orange-200/70"
            style={{ left: `${p25Pct}%`, width: `${boxWidth}%` }}
          />
          <div className="absolute top-0 bottom-5 w-[2px] -translate-x-1/2 bg-orange-800" style={{ left: `${p50Pct}%` }} />
          <div
            className="absolute top-0 bottom-5 w-0 -translate-x-1/2 border-l-2 border-dashed border-zinc-900"
            style={{ left: `${targetPct}%` }}
          />
        </div>
        <HandleButtons
          handles={handles}
          activeKey={activeKey}
          onActivate={(k) => setActiveKey(k)}
          onDeactivate={(k) => setActiveKey((cur) => (cur === k ? null : cur))}
        />
        <div className="absolute inset-x-0 bottom-0 h-4 text-[10px] text-zinc-500" aria-hidden="true">
          {/* First/last tick are anchored to their own edge (not centered) so their label text
             can never bleed past the container — only the two interior ticks (10, 100) center
             on their point, where there is always room on both sides for a short "Nm" label. */}
          {SCALE_TICKS.map((tick, i) => {
            const isFirst = i === 0;
            const isLast = i === SCALE_TICKS.length - 1;
            const translate = isFirst ? "0%" : isLast ? "-100%" : "-50%";
            return (
              <span
                key={tick}
                className="absolute tabular-nums"
                style={{ left: `${valueToPct(tick)}%`, transform: `translateX(${translate})` }}
              >
                {tick}m
              </span>
            );
          })}
        </div>
      </div>

      {/* Persistent five-number summary + SLA target — always rendered as real text, never
         behind a hover state. This is the completeness the brief asks for from the dominant viz. */}
      <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2.5 sm:grid-cols-6">
        {[
          { label: "P10", value: stats.p10 },
          { label: "P25", value: stats.p25 },
          { label: "P50 (median)", value: stats.p50, emphasize: true },
          { label: "P75", value: stats.p75 },
          { label: "P90", value: stats.p90 },
        ].map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="truncate text-[11px] uppercase tracking-wide text-zinc-500">{row.label}</dt>
            <dd className={`tabular-nums ${row.emphasize ? "text-base font-semibold text-zinc-900" : "text-sm font-medium text-zinc-700"}`}>
              {formatMinutes(row.value)}
            </dd>
          </div>
        ))}
        <div className="min-w-0">
          <dt className="truncate text-[11px] uppercase tracking-wide text-zinc-500">SLA target</dt>
          <dd className="flex items-center gap-1 text-sm font-medium text-zinc-900 tabular-nums">
            <span aria-hidden="true" className="inline-block h-2.5 w-0 border-l-2 border-dashed border-zinc-900" />
            {formatMinutes(target)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
