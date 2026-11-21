"use client";

import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./data";
import { CAPTION, FG, MUTED, PROSE_WIDTH_COLUMN } from "./tokens";

interface ProductPreviewProps {
  min: number;
  max: number;
}

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

export function ProductPreview({ min, max }: ProductPreviewProps) {
  return (
    <section id="preview" className="px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="max-w-[1180px]">
        <p className={CAPTION} style={{ color: MUTED }}>
          Chapter 02 — The listings
        </p>
        <h2
          className="mt-2 text-[clamp(1.6rem,2.8vw+0.8rem,2.3rem)] font-extrabold tracking-[-0.02em]"
          style={{ ...displayFace, color: FG }}
        >
          Six fixed listings, no filler data
        </h2>
        <p className={`mt-2 text-[14px] font-normal leading-[1.6] ${PROSE_WIDTH_COLUMN} sm:max-w-none`} style={{ color: MUTED }}>
          Each card already carries its match score, condition grade, seller-verification badge,
          and real before/after discount — open &ldquo;which checks passed&rdquo; on any card to
          see why.
        </p>

        <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LISTINGS.map((listing) => (
            <div key={listing.id} className="min-w-0">
              <ListingCard listing={listing} min={min} max={max} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
