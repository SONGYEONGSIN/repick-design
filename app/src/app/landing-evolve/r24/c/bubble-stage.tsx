"use client";

import { useState } from "react";
import { BadgeCheck, ShieldAlert, Truck, X } from "lucide-react";
import type { ListingId, PackedBubble, Weights } from "./data";
import { discountPct, shipLabel, STAGE } from "./data";
import { ACCENT_HEX, cx, FOCUS, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

/** Percentage-based inline styles keep every circle a true circle at any container width, because
 * the stage wrapper is always forced square (`aspect-square`) — width% and height% then resolve to
 * the same pixel value. Position/size update by plain re-render (no CSS transition on left/top/
 * width/height), which sidesteps the motion catalog's "transform+opacity only" rule for animation
 * entirely: this is an instant recompute, not an animation. */
function pct(n: number): string {
  return `${(n / STAGE) * 100}%`;
}

function BubbleButton({
  bubble,
  isTop,
  isInspected,
  onSelect,
}: {
  bubble: PackedBubble;
  isTop: boolean;
  isInspected: boolean;
  onSelect: () => void;
}) {
  const d = bubble.r * 2;
  // Font sizes are picked from two fixed tiers (top vs satellite) rather than continuously scaled
  // from radius — keeps text legible at the smallest bubble size across every weight combination.
  const scoreSize = isTop ? "text-[22px] sm:text-[26px]" : "text-[13px] sm:text-[15px]";
  const labelSize = isTop ? "text-[11px] sm:text-[12px]" : "text-[8px] sm:text-[9px]";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isInspected}
      aria-label={`${bubble.seller} — ${Math.round(bubble.score)}% match${
        isTop ? ", current top match" : ""
      }. Tap for the full attribute breakdown.`}
      style={{
        left: pct(bubble.x),
        top: pct(bubble.y),
        width: pct(d),
        height: pct(d),
      }}
      className={cx(
        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ease-out",
        "flex flex-col items-center justify-center gap-0.5 motion-reduce:transition-none",
        "hover:scale-[1.04] active:scale-[0.97]",
        FOCUS,
        isTop
          ? "bg-[#0E7490] text-white shadow-[0_10px_30px_-8px_rgba(14,116,144,0.55)]"
          : isInspected
            ? "border-4 border-[#0E7490] bg-white text-[#111114]"
            : "border-2 border-zinc-300 bg-white text-[#111114] hover:border-[#0E7490]",
      )}
    >
      {isTop && (
        <span
          aria-hidden="true"
          className={cx(
            "absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111114] px-2 py-0.5 text-[9px] font-semibold uppercase text-white",
            "tracking-[0.16em]",
          )}
        >
          Top match
        </span>
      )}
      <span
        aria-hidden="true"
        className={cx("px-1 text-center font-semibold leading-tight", labelSize, isTop ? "text-white" : MUTED_TEXT)}
      >
        {bubble.bubbleLabel}
      </span>
      <span aria-hidden="true" className={cx("font-extrabold leading-none", NUM, scoreSize)}>
        {Math.round(bubble.score)}%
      </span>
    </button>
  );
}

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className={cx("text-[11px] font-semibold", MUTED_TEXT)}>{label}</span>
        <span className={cx("text-[11px] font-semibold", NUM, INK_TEXT)}>{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100" role="presentation">
        <div className="h-full rounded-full bg-[#0E7490]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function BubbleStage({ bubbles, weights }: { bubbles: PackedBubble[]; weights: Weights }) {
  // Local to this component: no other part of the page needs to know which bubble the visitor is
  // currently inspecting. `null` means "show the live top match" — the required default state.
  const [inspectedId, setInspectedId] = useState<ListingId | null>(null);

  const top = bubbles.find((b) => b.rank === 0)!;
  const spotlight = bubbles.find((b) => b.id === inspectedId) ?? top;
  const isInspectingNonTop = inspectedId !== null && inspectedId !== top.id;

  return (
    <div className="min-w-0">
      <div
        className="relative mx-auto aspect-square w-full max-w-[420px] rounded-[32px] border border-zinc-200 bg-white p-4"
        role="group"
        aria-label="Six listings for this search, sized by current match score. Tap a bubble for its full breakdown."
      >
        <div className="relative h-full w-full">
          {bubbles
            .slice()
            .sort((a, b) => a.r - b.r) // paint smallest-first so larger bubbles never visually bury a satellite's hit target
            .map((b) => (
              <BubbleButton
                key={b.id}
                bubble={b}
                isTop={b.id === top.id}
                isInspected={inspectedId === b.id}
                onSelect={() => setInspectedId(inspectedId === b.id ? null : b.id)}
              />
            ))}
        </div>
      </div>

      {/* Spotlight / inspect panel — full tag set (match %, condition grade, verification, discount)
          for whichever bubble is currently in focus. Defaults to the live top match with zero taps,
          which is what keeps the required proof inside the hero on first paint. */}
      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={cx("text-[10px] font-semibold uppercase", MUTED_TEXT)} style={{ letterSpacing: "0.16em" }}>
              {isInspectingNonTop ? "Inspecting" : "Current top match"}
            </p>
            <p className={cx("mt-1 truncate text-lg font-extrabold", INK_TEXT)}>{spotlight.seller}</p>
          </div>
          <p className={cx("shrink-0 text-3xl font-extrabold leading-none", NUM)} style={{ color: ACCENT_HEX }}>
            {Math.round(spotlight.score)}%
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-[#111114]">
            Grade {spotlight.grade}
          </span>
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              spotlight.verified ? "border border-[#0E7490]/40 bg-[#0E7490]/[0.07] text-[#155E75]" : "border border-zinc-300 text-[#52525B]",
            )}
          >
            {spotlight.verified ? (
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
            )}
            {spotlight.verified ? "Verified seller" : "Unverified seller"}
          </span>
          <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-[#111114]">
            {discountPct(spotlight)}% off · <span className={NUM}>${spotlight.price}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1 text-[11px] font-semibold text-[#111114]">
            <Truck className="h-3 w-3" aria-hidden="true" />
            {shipLabel(spotlight.shipDays)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          <AttributeBar label="Price value" value={spotlight.priceValue} />
          <AttributeBar label="Condition" value={spotlight.condition} />
          <AttributeBar label="Trust" value={spotlight.trust} />
          <AttributeBar label="Speed" value={spotlight.speed} />
        </div>

        <p className={cx("mt-3 max-w-[360px] text-[12px] leading-[1.5]", MUTED_TEXT)}>
          Weighted at price {weights.price} · condition {weights.condition} · trust {weights.trust} · speed{" "}
          {weights.speed} — drag any slider above and this whole panel recomputes.
        </p>

        {isInspectingNonTop && (
          <button
            type="button"
            onClick={() => setInspectedId(null)}
            className={cx(
              "mt-3 inline-flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-[11px] font-semibold text-[#111114] transition-colors hover:border-[#0E7490]",
              FOCUS,
            )}
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Back to top match
          </button>
        )}
      </div>
    </div>
  );
}
