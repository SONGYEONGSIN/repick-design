"use client";

import { useMemo, useState } from "react";
import { Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { BikeGlyph, ChairGlyph, RugGlyph, WatchGlyph } from "./Glyphs";
import { FigCaption, Folio, Pill } from "./ui";
import { COLOR, DISPLAY_FONT, FOCUS_RING, TRACK, W } from "./tokens";
import { CATEGORIES, LISTINGS, discountPercent, type Category, type Verdict } from "./data";
import Reveal from "./Reveal";

const GLYPH: Record<Category, React.ComponentType<{ className?: string }>> = {
  Furniture: ChairGlyph,
  Watches: WatchGlyph,
  Cycling: BikeGlyph,
  Home: RugGlyph,
};

export default function ProductPreview({ verdict }: { verdict: Verdict }) {
  const [filter, setFilter] = useState<Category | "All">("All");

  const visible = useMemo(
    () => (filter === "All" ? LISTINGS : LISTINGS.filter((l) => l.category === filter)),
    [filter]
  );

  return (
    <section id="listings" className="mx-auto max-w-[1600px] px-5 sm:px-8 py-14 sm:py-20">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[560px]">
          <h2
            className={`${W.heavy} text-[clamp(1.9rem,1.3rem+2vw,3rem)] leading-[1.02]`}
            style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT }}
          >
            Every listing ships with its case file.
          </h2>
          <p className={`${W.body} mt-4 text-[15px] leading-[1.6] max-w-[460px]`} style={{ color: COLOR.ink }}>
            Match reasoning, condition grade, seller verification and the discount against
            replacement value — the evidence, not just the sticker.
          </p>
        </div>
        <Folio n={3} of={6} />
      </div>

      <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter listings by category">
        {(["All", ...CATEGORIES] as const).map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(cat)}
              className={`${W.label} ${FOCUS_RING} inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] transition-colors`}
              style={
                active
                  ? { background: COLOR.accent, color: COLOR.white }
                  : { background: COLOR.surface, color: COLOR.mutedOnSurf, border: `1px solid ${COLOR.ink}1F` }
              }
            >
              {active && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {visible.map((listing, i) => {
          const Glyph = GLYPH[listing.category];
          const match = listing.live ? verdict.confidence : listing.matchPercent;
          const discount = listing.live ? verdict.discountPercent : discountPercent(listing.retail, listing.price);
          const price = listing.live ? verdict.recommendedPrice : listing.price;

          return (
            <Reveal key={listing.id} delay={i * 0.05} className="min-w-0">
              <article
                className="h-full min-w-0 rounded-lg p-3.5"
                style={{ background: COLOR.surface, border: `1px solid ${COLOR.ink}1F` }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-md"
                  style={{ aspectRatio: "4 / 3", background: COLOR.bg }}
                >
                  <Glyph className="absolute inset-0 h-full w-full" />
                </div>
                <FigCaption>
                  Fig. {LISTINGS.indexOf(listing) + 2} — {listing.title}.
                </FigCaption>

                <p className={`${W.label} mt-2 text-[14px] leading-snug`} style={{ color: COLOR.ink }}>
                  {listing.title}
                </p>
                <p className={`${W.body} text-[12.5px] leading-snug max-w-[300px]`} style={{ color: COLOR.mutedOnSurf }}>
                  {listing.detail}
                </p>

                <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="AI match reasoning">
                  {listing.tags.map((tag) => (
                    <li
                      key={tag}
                      className={`${W.body} text-[11px] rounded px-2 py-1`}
                      style={{ background: COLOR.bg, color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill icon={CheckCircle2} variant="accent">
                    {match}% match
                  </Pill>
                  <Pill icon={ShieldCheck} variant="outline">
                    Grade {listing.grade}
                  </Pill>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Pill icon={ShieldCheck} variant="outline">
                    Verified seller
                  </Pill>
                  <Pill icon={CheckCircle2} variant="outline">
                    {discount}% below replacement
                  </Pill>
                </div>

                <div className="mt-3 flex items-baseline justify-between" style={{ borderTop: `1px solid ${COLOR.ink}1F`, paddingTop: "10px" }}>
                  <span className={`${W.heavy} tabular-nums text-[18px]`} style={{ color: COLOR.ink }}>
                    ${price.toLocaleString("en-US")}
                  </span>
                  <span className={`${W.body} tabular-nums text-[12px] line-through`} style={{ color: COLOR.mutedOnSurf }}>
                    ${listing.retail.toLocaleString("en-US")}
                  </span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
