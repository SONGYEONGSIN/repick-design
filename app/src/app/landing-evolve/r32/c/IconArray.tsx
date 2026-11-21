'use client';

import { Tag } from 'lucide-react';
import { SAMPLE_LISTINGS, qualifiesListing, type Thresholds } from './data';

type IconArrayProps = {
  thresholds: Thresholds;
};

/**
 * The pictogram/isotype array. A fixed 10x10 grid of 100 `Tag` icons, one per
 * sample listing — lit (accent fill) when that exact listing currently
 * qualifies under all three active thresholds, dimmed (grey) otherwise. The
 * lit/dim split is plain derived data (`qualifiesListing`), computed fresh on
 * every render straight from props — it is correct on the very first paint,
 * before any JS entrance animation could run, and never depends on one.
 * Cells are purely decorative (not individually interactive — the sliders
 * are the only control surface), so `target-size` does not apply here; the
 * grid is `aria-hidden` and the adjoining live-region sentence in Hero is the
 * accessible equivalent of what it shows.
 */
export default function IconArray({ thresholds }: IconArrayProps) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-10 gap-1 sm:gap-1.5"
    >
      {SAMPLE_LISTINGS.map((listing) => {
        const lit = qualifiesListing(listing, thresholds);
        return (
          <div key={listing.id} className="flex aspect-square min-w-0 items-center justify-center">
            <Tag
              size={14}
              strokeWidth={2}
              className={
                lit
                  ? 'text-[#65a30d] transition-colors duration-300'
                  : 'text-zinc-400 transition-colors duration-300'
              }
            />
          </div>
        );
      })}
    </div>
  );
}
