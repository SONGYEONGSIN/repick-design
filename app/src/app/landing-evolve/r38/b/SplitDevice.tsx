"use client";

import { useRef } from "react";
import Image from "next/image";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { LISTINGS, TOTAL_BOXES } from "./data";
import { confidenceAt, discountPct, fairPrice, formatUsd, gradeLabel, revealedBoxes } from "./score-math";
import { ACCENT_SOFT_BG, ACCENT_TINT, BG, BORDER, FLAW, FOCUS, SURFACE } from "./theme";
import { cx, STAT_LABEL } from "./ui";

/**
 * "The Split": a listing selector (tab-set, input axis #1) paired with a
 * continuous drag-divider over a real photo (input axis #2). Left of the
 * divider is the plain listing photo; right of it is the same photo under
 * an AI-processed treatment with bounding-box annotations that pop in as
 * the divider sweeps past each one's position — not a small circular
 * magnifier over one fixed illustration, and not a fixed set of hotspots
 * that just toggle. The output — AI confidence, a fair-price estimate and a
 * "checks visible" count — recomputes continuously from `reveal` (0–100)
 * AND from which listing is selected (score-math.ts), and is read back out
 * by Hero's proof cards, ValueSection and ClosingCTA from the same two
 * pieces of state, never duplicated.
 *
 * Keyboard path: the divider is a real `<input type="range">` spanning the
 * whole image — native Left/Right arrow keys move it by 1, Home/End jump
 * to the ends, so dragging is never the only way in. The visible divider
 * line/handle is a `peer` sibling that paints a visible focus outline via
 * `peer-focus-visible:outline-*` (never a bare `ring-*`, never preceded by
 * `outline-none`) since the input itself renders at opacity 0.
 */
export default function SplitDevice({
  selectedId,
  onSelect,
  reveal,
  onRevealChange,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  reveal: number;
  onRevealChange: (n: number) => void;
}) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listing = LISTINGS.find((l) => l.id === selectedId) ?? LISTINGS[0];
  const confidence = confidenceAt(listing, reveal);
  const revealed = revealedBoxes(listing, reveal);
  const grade = gradeLabel(confidence);
  const estimate = fairPrice(listing, confidence);
  const discount = discountPct(listing);

  function focusTab(index: number) {
    const i = (index + LISTINGS.length) % LISTINGS.length;
    tabRefs.current[i]?.focus();
    onSelect(LISTINGS[i].id);
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(LISTINGS.length - 1);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Choose a listing to inspect" className="flex flex-wrap gap-2">
        {LISTINGS.map((l, i) => {
          const active = l.id === listing.id;
          return (
            <button
              key={l.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${l.id}`}
              aria-selected={active}
              aria-controls={active ? `panel-${l.id}` : undefined}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(l.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cx(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none",
                FOCUS,
                active ? "text-white" : "text-[#A1A1AA] hover:text-white",
              )}
              style={{
                borderColor: active ? ACCENT_TINT : BORDER,
                backgroundColor: active ? ACCENT_SOFT_BG : "transparent",
              }}
            >
              {l.title}
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${listing.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${listing.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border"
        style={{ borderColor: BORDER, backgroundColor: SURFACE }}
      >
        {/* layer 0 — raw, unprocessed photo */}
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=900&q=75`}
          alt={listing.alt}
          fill
          priority
          sizes="(min-width: 1024px) 680px, 100vw"
          className="object-cover"
        />

        {/* layer 1 — AI-processed treatment, clipped to the revealed region */}
        <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
          <Image
            src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=900&q=75`}
            alt=""
            fill
            sizes="(min-width: 1024px) 680px, 100vw"
            className="object-cover"
            style={{ filter: "saturate(0.5) brightness(0.8) contrast(1.08)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${ACCENT_SOFT_BG}, transparent 60%)` }}
          />
        </div>

        {/* layer 2 — annotation boxes, own layer so they never get cut mid-box by the clip */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {listing.boxes.map((b) => {
            const shown = reveal >= b.leftPct + b.widthPct;
            // Boxes past the horizontal midpoint anchor their label to the box's
            // right edge instead of its left — so the chip grows back toward the
            // center of the frame instead of running off the right edge on a
            // narrow (390px) viewport. The chip's own max-width + wrap keeps it
            // bounded either way, so nothing can clip a text node unexpectedly.
            const anchorRight = b.leftPct + b.widthPct / 2 > 55;
            return (
              <div
                key={b.id}
                style={{ left: `${b.leftPct}%`, top: `${b.topPct}%`, width: `${b.widthPct}%`, height: `${b.heightPct}%` }}
                className={cx(
                  "absolute rounded-md transition-[opacity,transform] duration-300 motion-reduce:transition-none",
                  shown ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
              >
                <div
                  className="absolute inset-0 rounded-md"
                  style={{ borderWidth: 2, borderStyle: "solid", borderColor: b.flaw ? FLAW : ACCENT_TINT }}
                />
                <span
                  className={cx(
                    "absolute -top-7 inline-flex max-w-[150px] items-start gap-1 whitespace-normal rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-white",
                    anchorRight ? "right-0" : "left-0",
                  )}
                  style={{ backgroundColor: BG, border: `1px solid ${b.flaw ? FLAW : ACCENT_TINT}` }}
                >
                  {b.flaw ? (
                    <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" style={{ color: FLAW }} aria-hidden />
                  ) : (
                    <BadgeCheck className="mt-0.5 h-3 w-3 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden />
                  )}
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>

        <span
          className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold text-white"
          style={{ borderColor: BORDER, backgroundColor: `${BG}CC` }}
        >
          Live AI read
        </span>

        {/* the real control: a full-box range input, keyboard-native (arrow keys, Home/End) */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={reveal}
          onChange={(e) => onRevealChange(Number(e.target.value))}
          aria-label={`Reveal the AI grading overlay on the ${listing.title} photo`}
          className={cx(
            "peer absolute inset-0 z-30 h-full w-full cursor-ew-resize touch-none opacity-0",
            "[appearance:none] [&::-webkit-slider-thumb]:appearance-none",
          )}
        />

        {/* visual divider line + handle — pointer-events-none, paints the real focus ring via peer-focus-visible */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 z-20" style={{ left: `${reveal}%` }}>
          <div className="h-full w-px" style={{ backgroundColor: ACCENT_TINT }} />
          <div
            className={cx(
              "absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2",
              "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#22D3EE]",
            )}
            style={{ borderColor: ACCENT_TINT, backgroundColor: BG }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M2 2 L2 10 M10 2 L10 10" stroke={ACCENT_TINT} strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {listing.title}: {confidence}% AI confidence, {revealed.length} of {TOTAL_BOXES} checks visible.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="AI confidence" value={`${confidence}%`} />
        <Stat label="Checks visible" value={`${revealed.length} / ${TOTAL_BOXES}`} />
        <Stat label="Fair price est." value={formatUsd(estimate)} />
        <Stat label="Read" value={grade} small />
      </div>
      <p className="text-sm font-normal leading-[1.6]" style={{ color: "#A1A1AA" }}>
        Asking {formatUsd(listing.price)}, listed from {formatUsd(listing.originalPrice)} (&minus;{discount}%
        off). Drag the line above, or switch listings, and every number here moves with you.
      </p>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
      <p className={STAT_LABEL} style={{ color: "#A1A1AA" }}>
        {label}
      </p>
      <p className={cx("mt-1.5 font-extrabold tabular-nums text-white", small ? "text-base" : "text-2xl")}>
        {value}
      </p>
    </div>
  );
}
