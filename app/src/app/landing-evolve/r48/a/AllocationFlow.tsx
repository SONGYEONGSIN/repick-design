"use client";

import { useId, useState } from "react";
import { CheckCircle2, Wrench, XCircle } from "lucide-react";
import {
  BAND_DETAIL,
  STRICTNESS_PROFILES,
  type BandKey,
  type StrictnessId,
} from "./data";
import {
  VB_HEIGHT,
  VB_WIDTH,
  bandContribution,
  buildFlowGeometry,
  expectedPayoutPerItem,
  mostLikelyBand,
  sellThroughPercent,
  totalCount,
} from "./flow-math";
import {
  ACCENT_BG,
  ACCENT_HEX,
  ACCENT_TINT_TEXT,
  BAND_FAIL_FILL,
  BAND_PASS_FILL,
  BAND_REFURBISH_FILL,
  FOCUS,
  MUTED_TEXT,
  PANEL_BORDER,
} from "./tokens";

const BAND_ICON: Record<BandKey, typeof CheckCircle2> = {
  pass: CheckCircle2,
  refurbish: Wrench,
  fail: XCircle,
};

const BAND_FILL: Record<BandKey, string> = {
  pass: BAND_PASS_FILL,
  refurbish: BAND_REFURBISH_FILL,
  fail: BAND_FAIL_FILL,
};

interface AllocationFlowProps {
  strictnessId: StrictnessId;
  onChangeStrictness: (id: StrictnessId) => void;
}

/**
 * The hero device: a proportional flow diagram. One inbound-batch source node splits
 * into three outcome bands (Pass as-is / Refurbish-then-sell / Declined), each sized
 * by count via `buildFlowGeometry`. The strictness toggle swaps in a different fixed
 * BandSpec[] and the whole diagram — ribbon widths, node heights, the stat tiles,
 * the "most likely" line — recomputes from it; nothing here is hand-positioned per
 * strictness value. Defaults to STANDARD with real, non-zero proportions already
 * visible. Hovering, focusing or clicking a band's hit-box shows that band's detail
 * line below the diagram; with nothing hovered it falls back to the most-likely
 * band, so the panel is never blank.
 *
 * SVG sizing: the `<svg>` has no fixed pixel width — `viewBox` + `width="100%"` let
 * it shrink fluidly to its container at any viewport, which is what keeps this
 * diagram from ever forcing page-level horizontal overflow on mobile.
 *
 * Hit-box sizing (the fix this candidate exists for): a band's visual ribbon is
 * allowed to render arbitrarily thin — that's the data talking, and it's supposed to
 * look thin. But the thing a visitor actually TAPS is a separate, absolutely
 * positioned overlay with its own Tailwind `min-h-6` (24px) / `min-w-6` floor, laid
 * out independently of whatever percent height `buildFlowGeometry` computed for that
 * band. Each hit-box is anchored at the node's vertical CENTER (`top: centerTopPct%`)
 * and then re-centered with a self-relative `-translate-y-1/2` — a transform
 * percentage always resolves against the element's own final box, so it re-centers
 * correctly whether that box ended up at its percent height or got floored up to
 * 24px by `min-h-6`. The result: no matter how thin the fluid diagram renders a
 * band, its tap target is never smaller than the WCAG 2.2 24×24px floor, and it
 * never silently reintroduces page-overflow the way a `min-w` on the diagram
 * WRAPPER once did (this overlay's min-size is scoped to one small absolutely
 * positioned element inside an already-fluid box, not to anything that could widen
 * the box itself).
 */
export default function AllocationFlow({ strictnessId, onChangeStrictness }: AllocationFlowProps) {
  const [hoveredKey, setHoveredKey] = useState<BandKey | null>(null);
  const [pinnedKey, setPinnedKey] = useState<BandKey | null>(null);
  const liveRegionId = useId();

  const profile = STRICTNESS_PROFILES[strictnessId];
  const geometry = buildFlowGeometry(profile.bands);
  const total = totalCount(profile.bands);
  const payout = expectedPayoutPerItem(profile.bands);
  const sellThrough = sellThroughPercent(profile.bands);
  const best = mostLikelyBand(profile.bands);
  const bestGeometry = geometry.find((g) => g.key === best.key) ?? geometry[0];

  const displayKey = pinnedKey ?? hoveredKey ?? best.key;
  const displayGeometry = geometry.find((g) => g.key === displayKey) ?? geometry[0];
  const displayContribution = bandContribution(profile.bands, displayKey);

  function handlePin(key: BandKey) {
    setPinnedKey((prev) => (prev === key ? null : key));
  }

  return (
    <div className={`rounded-2xl border ${PANEL_BORDER} bg-[#F5F3F3] p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717]">
            Sorting yield
          </p>
          <p className={`mt-1 max-w-[320px] text-[13px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
            {profile.label} strictness: {profile.description}
          </p>
        </div>
        <div role="group" aria-label="Inspection strictness" className="flex gap-2">
          {(Object.keys(STRICTNESS_PROFILES) as StrictnessId[]).map((id) => {
            const active = id === strictnessId;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onChangeStrictness(id)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${FOCUS} ${
                  active
                    ? `${ACCENT_BG} border-transparent text-white`
                    : "border-[#D6D3D2] bg-white text-[#171717] hover:border-[#BE123C]"
                }`}
              >
                {STRICTNESS_PROFILES[id].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-5">
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          width="100%"
          className="block w-full"
          role="img"
          aria-label={`Flow diagram: of ${total} inbound items under ${profile.label} strictness, ${geometry
            .map((g) => `${g.count} ${g.label.toLowerCase()} (${g.sharePercent}%)`)
            .join(", ")}.`}
        >
          <defs>
            <pattern id="declined-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={BAND_FAIL_FILL} />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#A8A3A2" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Source node: the undivided inbound batch */}
          <rect x={0} y={14} width={12} height={VB_HEIGHT - 28} rx={2} fill="#171717" />

          {geometry.map((g) => (
            <path
              key={`ribbon-${g.key}`}
              d={g.ribbonPath}
              fill={g.key === "fail" ? "url(#declined-hatch)" : BAND_FILL[g.key]}
              opacity={0.5}
            />
          ))}

          {geometry.map((g) => {
            const isActive = g.key === displayKey;
            return (
              <g key={`node-${g.key}`}>
                {isActive && (
                  <rect
                    x={g.nodeX - 6}
                    y={g.nodeY - 6}
                    width={VB_WIDTH - (g.nodeX - 6) - 6}
                    height={g.nodeHeight + 12}
                    rx={6}
                    fill="none"
                    stroke={ACCENT_HEX}
                    strokeWidth={1.5}
                  />
                )}
                <rect
                  x={g.nodeX}
                  y={g.nodeY}
                  width={g.nodeWidth}
                  height={g.nodeHeight}
                  rx={2}
                  fill={g.key === "fail" ? "url(#declined-hatch)" : BAND_FILL[g.key]}
                  stroke="#8F8A89"
                  strokeWidth={1}
                />
              </g>
            );
          })}
        </svg>

        {/*
         * Labels render as fixed-px HTML, not SVG `<text>`, so their font size never
         * shrinks/grows with the diagram's own fluid scale. `pointer-events-none` +
         * `aria-hidden` keep them purely decorative — the hit-box buttons below
         * already carry the accessible name and all hover/focus/click handling.
         */}
        {geometry.map((g) => (
          <div
            key={`label-${g.key}`}
            aria-hidden="true"
            className="pointer-events-none absolute -translate-y-1/2"
            style={{
              left: `${g.labelAnchor.leftPct}%`,
              top: `${g.labelAnchor.topPct}%`,
              width: `${g.labelAnchor.maxWidthPct}%`,
            }}
          >
            <p className="truncate text-[12px] font-semibold leading-tight text-[#171717]">{g.label}</p>
            <p className="tabular-nums truncate text-[10.5px] font-normal leading-tight text-[#525252]">
              {g.count} items · {g.sharePercent}%
            </p>
          </div>
        ))}

        {/*
         * Hit-boxes: a SEPARATE overlay from the visual node above, not a resize of
         * it. `top`/`height` come from the band's own percent geometry (so a thin
         * band still looks thin and the box still tracks it), but `min-h-6 min-w-6`
         * floors the rendered box at 24px in each dimension no matter how small that
         * percent height resolves to at any container width. `-translate-y-1/2`
         * recenters on `centerTopPct` using the box's own FINAL height (post-floor),
         * so a floored-up box grows symmetrically around the node's center instead
         * of drifting downward past it.
         */}
        {geometry.map((g) => (
          <button
            key={`hit-${g.key}`}
            type="button"
            aria-pressed={pinnedKey === g.key}
            onMouseEnter={() => setHoveredKey(g.key)}
            onMouseLeave={() => setHoveredKey(null)}
            onFocus={() => setHoveredKey(g.key)}
            onBlur={() => setHoveredKey(null)}
            onClick={() => handlePin(g.key)}
            aria-controls={liveRegionId}
            className={`absolute min-h-6 min-w-6 -translate-y-1/2 rounded-md ${FOCUS}`}
            style={{
              left: `${g.hitBox.leftPct}%`,
              top: `${g.hitBox.centerTopPct}%`,
              width: `${g.hitBox.widthPct}%`,
              height: `${g.hitBox.heightPct}%`,
            }}
          >
            <span className="sr-only">
              {g.label}: {g.count} of {total} items, {g.sharePercent}% of this batch
            </span>
          </button>
        ))}
      </div>

      <div
        id={liveRegionId}
        role="status"
        aria-live="polite"
        className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#E5E2E1] bg-white px-4 py-3"
      >
        <DetailIcon bandKey={displayKey} />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#171717]">
            {displayGeometry.label}
            <span className="tabular-nums font-normal text-[#525252]">
              {" "}
              — {displayGeometry.count} items ({displayGeometry.sharePercent}%)
            </span>
          </p>
          <p className={`mt-0.5 text-[12.5px] font-normal leading-[1.45] ${MUTED_TEXT}`}>
            {BAND_DETAIL[displayKey]}{" "}
            <span className="tabular-nums font-semibold text-[#171717]">
              Contributes ${displayContribution} of the ${payout} expected payout.
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-xl border border-[#E5E2E1] bg-white p-3.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#525252]">
            Expected payout / item
          </p>
          <p className="tabular-nums mt-1 text-[26px] font-extrabold leading-none tracking-[-0.01em] text-[#171717]">
            ${payout}
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-[#E5E2E1] bg-white p-3.5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#525252]">
            Sell-through rate
          </p>
          <p className="tabular-nums mt-1 text-[26px] font-extrabold leading-none tracking-[-0.01em] text-[#171717]">
            {sellThrough}%
          </p>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] font-normal leading-[1.45] text-[#171717]">
        Most likely outcome at {profile.label} strictness:{" "}
        <span className={`font-semibold ${ACCENT_TINT_TEXT}`}>
          {best.label} ({bestGeometry.sharePercent}%)
        </span>
        .
      </p>
    </div>
  );
}

function DetailIcon({ bandKey }: { bandKey: BandKey }) {
  const Icon = BAND_ICON[bandKey];
  return (
    <span
      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bandKey === "fail" ? "#EDEBEA" : `${BAND_FILL[bandKey]}1A` }}
    >
      <Icon
        className="h-3.5 w-3.5"
        style={{ color: bandKey === "fail" ? "#6B6665" : BAND_FILL[bandKey] }}
        aria-hidden="true"
      />
    </span>
  );
}
