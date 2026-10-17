"use client";

import { useId, useMemo } from "react";
import { ArrowDown, ArrowUp, ShieldCheck } from "lucide-react";
import {
  AXES,
  bestListingForAxis,
  discountPct,
  getAxisValue,
  savingsOf,
  type AxisId,
  type Listing,
} from "./data";

const ACCENT = "#9F1239";
const MUTED_LINE = "#D4D4D8"; // zinc-300 — decorative context line, not a text node
const AXIS_LINE = "#E4E4E7"; // zinc-200
const AXIS_LINE_ACTIVE = "#A1A1AA"; // zinc-400
const TICK_TEXT = "#52525B"; // zinc-600 — 7.7:1 on white, comfortably clears the small-text floor

const VIEW_W = 720;
const VIEW_H = 340;
const MARGIN_X = 46;
const MARGIN_TOP = 34;
const MARGIN_BOTTOM = 34;
const PLOT_TOP = MARGIN_TOP;
const PLOT_BOTTOM = VIEW_H - MARGIN_BOTTOM;

type Domain = { min: number; max: number };

function paddedDomain(values: number[]): Domain {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const pad = span === 0 ? Math.max(1, Math.abs(max) * 0.1) : span * 0.14;
  return { min: min - pad, max: max + pad };
}

function axisX(index: number, count: number): number {
  const usable = VIEW_W - MARGIN_X * 2;
  return MARGIN_X + (usable * index) / (count - 1);
}

function valueToY(value: number, domain: Domain): number {
  const t = (value - domain.min) / (domain.max - domain.min || 1);
  return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP);
}

export default function ParallelPlot({
  listings,
  priorityAxis,
  onSelectAxis,
  reduce,
}: {
  listings: Listing[];
  priorityAxis: AxisId;
  onSelectAxis: (id: AxisId) => void;
  reduce: boolean;
}) {
  const gradientId = useId();
  const domains = useMemo(() => {
    const map = new Map<AxisId, Domain>();
    for (const axis of AXES) {
      map.set(axis.id, paddedDomain(listings.map((l) => getAxisValue(l, axis.id))));
    }
    return map;
  }, [listings]);

  const best = useMemo(() => bestListingForAxis(priorityAxis, listings), [priorityAxis, listings]);

  const linesByListing = useMemo(() => {
    return listings.map((listing) => {
      const points = AXES.map((axis, i) => {
        const domain = domains.get(axis.id)!;
        const x = axisX(i, AXES.length);
        const y = valueToY(getAxisValue(listing, axis.id), domain);
        return { x, y };
      });
      const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
      return { listing, points, d, isBest: listing.id === best.id };
    });
  }, [listings, domains, best.id]);

  // The highlighted line always draws last (on top) — built by partition, not by a sort
  // comparator, since there is at most one "best" entry and a real a/b comparator isn't needed.
  const orderedLines = [
    ...linesByListing.filter((l) => !l.isBest),
    ...linesByListing.filter((l) => l.isBest),
  ];
  const priorityLabel = AXES.find((a) => a.id === priorityAxis)!.label;
  const savings = savingsOf(best);
  const discount = discountPct(best);

  return (
    <div className="min-w-0">
      {/* The manipulation: pick a priority axis and the plot re-highlights the listing that
          actually wins it, live — not a static illustration. */}
      <div role="group" aria-label="Choose which axis to prioritize" className="flex flex-wrap gap-2">
        {AXES.map((axis) => {
          const active = axis.id === priorityAxis;
          return (
            <button
              key={axis.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelectAxis(axis.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239] ${
                active
                  ? "border-[#9F1239] bg-[#9F1239] text-white"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {axis.better === "low" ? (
                <ArrowDown className="h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2.5} />
              ) : (
                <ArrowUp className="h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2.5} />
              )}
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold">{axis.label}</span>
                <span className={`text-[10px] font-normal ${active ? "text-white/80" : "text-zinc-600"}`}>
                  {axis.better === "low" ? "lower is better" : "higher is better"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
        <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            style={{ fontFamily: "var(--font-sans)" }}
            role="img"
            aria-label={`Parallel coordinates chart comparing ${listings.length} camera listings across price, condition, AI match, seller rating, and distance. Prioritizing ${priorityLabel.toLowerCase()} currently highlights ${best.name}.`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="1" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Axis lines + tick labels (real value ticks, not decoration) */}
            {AXES.map((axis, i) => {
              const x = axisX(i, AXES.length);
              const domain = domains.get(axis.id)!;
              const isActive = axis.id === priorityAxis;
              return (
                <g key={axis.id}>
                  <line
                    x1={x}
                    y1={PLOT_TOP}
                    x2={x}
                    y2={PLOT_BOTTOM}
                    stroke={isActive ? AXIS_LINE_ACTIVE : AXIS_LINE}
                    strokeWidth={isActive ? 2 : 1}
                  />
                  <text
                    x={x}
                    y={PLOT_TOP - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill={TICK_TEXT}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {axis.format(domain.max)}
                  </text>
                  <text
                    x={x}
                    y={PLOT_BOTTOM + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill={TICK_TEXT}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {axis.format(domain.min)}
                  </text>
                </g>
              );
            })}

            {/* Polylines — the non-highlighted lines are decorative context, so a lighter gray is
                fine (they're graphics, not text nodes), but the highlighted line is also marked by
                weight + a name label below, never by color alone. */}
            {orderedLines.map(({ listing, d, isBest }) => (
              <path
                key={listing.id}
                d={d}
                fill="none"
                stroke={isBest ? `url(#${gradientId})` : MUTED_LINE}
                strokeWidth={isBest ? 3 : 1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={isBest ? 1 : 0.85}
                className={reduce ? undefined : "transition-[stroke] duration-300"}
              />
            ))}

            {orderedLines.map(({ listing, points, isBest }) =>
              points.map((p, i) => (
                <circle
                  key={`${listing.id}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={isBest ? 4.5 : 2.25}
                  fill={isBest ? ACCENT : MUTED_LINE}
                  stroke={isBest ? "#ffffff" : "none"}
                  strokeWidth={isBest ? 1.5 : 0}
                />
              ))
            )}

            {/* Axis name captions, inside the plot so they travel with the SVG at every width */}
            {AXES.map((axis, i) => (
              <text
                key={`label-${axis.id}`}
                x={axisX(i, AXES.length)}
                y={VIEW_H - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight={axis.id === priorityAxis ? 600 : 400}
                fill={axis.id === priorityAxis ? ACCENT : TICK_TEXT}
              >
                {axis.label}
              </text>
            ))}
          </svg>
          {/* 11px caption: ~70 chars per line = 340px ÷ (0.44 × 11) ≈ 70 (see c.md). */}
          <p className="mt-2 max-w-[340px] text-[11px] leading-[1.6] text-zinc-500">
            {"Fig. 03 — each axis is scaled to its own range; position along the axis is what lines up, not the raw number."}
          </p>
        </div>

        {/* The recomputed result, in text — never color alone. Updates with every axis click. */}
        <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-5" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Top pick on {priorityLabel.toLowerCase()}
          </p>
          <p className="mt-2 text-[19px] font-extrabold tracking-[-0.01em] text-zinc-900">
            {best.name}
          </p>
          {best.verified && (
            <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-zinc-700">
              <ShieldCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" style={{ color: ACCENT }} />
              Verified seller
            </div>
          )}
          <dl className="mt-4 space-y-2 text-[13px] tabular-nums">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-600">Price now</dt>
              <dd className="font-semibold text-zinc-900">${best.priceNow.toLocaleString("en-US")}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-600">You save</dt>
              <dd className="font-semibold text-zinc-900">
                ${savings.toLocaleString("en-US")} ({discount}%)
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-600">AI match</dt>
              <dd className="font-semibold" style={{ color: ACCENT }}>
                {best.match}%
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-600">Condition</dt>
              <dd className="font-semibold text-zinc-900">{best.condition}/100</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-zinc-600">Distance</dt>
              <dd className="font-semibold text-zinc-900">{best.distance.toFixed(1)} mi</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
