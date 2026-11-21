"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { layoutOnStage, type LaidOutCircle } from "./packing";
import {
  CATEGORIES,
  fastestOf,
  radiusFor,
  type CategoryId,
} from "./categories";
import { FOCUS } from "./theme";

interface BubbleClusterProps {
  selected: CategoryId[];
}

/**
 * The route's output device — a packed-circle bubble cluster, not a
 * treemap, not a dial, not a ring. Each circle's radius is driven by
 * `sellThroughRate` (percent of that category's listings that sell within
 * 30 days) via `radiusFor`, and packed with the deterministic algorithm in
 * `packing.ts`. As `selected` changes, every circle's position and size
 * is recomputed fresh on that render — there is no separate animation
 * state to keep in sync, only plain CSS `transition` on `left`/`top`/
 * `width`/`height` so the re-pack reads as motion instead of a jump cut
 * (gated by `motion-reduce` below).
 *
 * The median days-to-sell is printed on every circle, at every size tier,
 * as real text in the DOM (never hover-only) — that text, plus the visible
 * category name beside it, is also each circle's accessible name, so
 * nothing relies on an `aria-label` that could drift out of sync with
 * what's on screen. Hovering or focusing any circle additionally drives
 * the detail panel below the stage — the "product preview" interaction —
 * without ever hiding the baseline number on the circle itself.
 */
export default function BubbleCluster({ selected }: BubbleClusterProps) {
  const [inspectedId, setInspectedId] = useState<CategoryId | null>(null);

  const circles = layoutOnStage(selected.map((id) => ({ id, r: radiusFor(CATEGORIES[id].sellThroughRate) })));
  const fastest = fastestOf(selected);
  const spotlightId = inspectedId ?? fastest?.id ?? null;
  const spotlight = spotlightId ? CATEGORIES[spotlightId] : null;
  const isInspectingOther = inspectedId !== null && inspectedId !== fastest?.id;

  return (
    <div className="min-w-0">
      <div
        className="relative mx-auto aspect-square w-full max-w-[440px] rounded-[28px] border border-zinc-200 bg-zinc-50 p-5"
        role="group"
        aria-label={`Bubble cluster of your ${selected.length} selected ${selected.length === 1 ? "category" : "categories"}, sized by 30-day sell-through rate. Hover or focus a bubble for its full detail.`}
      >
        <div className="relative h-full w-full">
          {circles.map((c) => (
            <Bubble
              key={c.id}
              circle={c}
              isFastest={c.id === fastest?.id}
              isInspected={spotlightId === c.id}
              onEnter={() => setInspectedId(c.id as CategoryId)}
              onLeave={() => setInspectedId(null)}
            />
          ))}
        </div>
      </div>

      {spotlight ? (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                {isInspectingOther ? "Inspecting" : "Fastest in your mix"}
              </p>
              <p className="mt-1 truncate text-lg font-extrabold text-zinc-950">{spotlight.label}</p>
            </div>
            <p className="shrink-0 text-right text-3xl font-extrabold tabular-nums leading-none text-[#2563EB]">
              {spotlight.daysToSell}d
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-bold text-zinc-950">
              {spotlight.sellThroughRate}% sell within 30 days
            </span>
            <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-bold tabular-nums text-zinc-950">
              ${spotlight.avgPayout} avg payout
            </span>
            <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-bold tabular-nums text-zinc-950">
              {spotlight.itemsAnalyzed.toLocaleString("en-US")} sales measured
            </span>
          </div>

          <p className="mt-3 max-w-[370px] text-xs font-normal leading-[1.6] text-zinc-600">
            Median time from listing to sale across {spotlight.itemsAnalyzed.toLocaleString("en-US")}{" "}
            {spotlight.label.toLowerCase()} sales last quarter. Hover or focus any other bubble above to swap
            this panel to that category instead.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Bubble({
  circle,
  isFastest,
  isInspected,
  onEnter,
  onLeave,
}: {
  circle: LaidOutCircle;
  isFastest: boolean;
  isInspected: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const stat = CATEGORIES[circle.id as CategoryId];
  const numberSize = isFastest ? "text-[22px] sm:text-[26px]" : "text-[13px] sm:text-[15px]";
  const labelSize = isFastest ? "text-[11px] sm:text-[12px]" : "text-[8px] sm:text-[9px]";

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        left: circle.pctX,
        top: circle.pctY,
        width: circle.pctSize,
        height: circle.pctSize,
      }}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full transition-[transform] duration-150 ease-out motion-reduce:transition-none hover:scale-[1.04] ${FOCUS} ${
        isFastest
          ? "bg-[#2563EB] text-white shadow-[0_10px_28px_-8px_rgba(37,99,235,0.55)]"
          : isInspected
            ? "border-4 border-[#2563EB] bg-white text-zinc-950"
            : "border-2 border-zinc-300 bg-white text-zinc-950 hover:border-[#2563EB]"
      }`}
    >
      {isFastest ? (
        <span
          aria-hidden="true"
          className="absolute -top-6 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white"
        >
          <Zap className="h-2.5 w-2.5" aria-hidden="true" />
          Fastest
        </span>
      ) : null}
      <span className={`px-1 text-center font-bold leading-tight ${labelSize} ${isFastest ? "text-white" : "text-zinc-600"}`}>
        {stat.shortLabel}
      </span>
      <span className={`font-extrabold leading-none tabular-nums ${numberSize}`}>{stat.daysToSell}d</span>
      <span className="sr-only font-normal">
        {" "}
        — {stat.sellThroughRate}% sell within 30 days, {stat.itemsAnalyzed.toLocaleString("en-US")} sales measured.
        {isFastest ? " Fastest category in your current mix." : ""}
      </span>
    </button>
  );
}
