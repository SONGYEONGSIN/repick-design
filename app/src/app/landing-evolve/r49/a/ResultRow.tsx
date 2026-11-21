import Image from "next/image";
import { Award, Sparkles, Tag, ShieldCheck, ShieldX } from "lucide-react";
import type { RankedListing } from "./search-math";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, ACCENT_TINT_TEXT, MUTED_TEXT, PANEL_BORDER } from "./tokens";

/**
 * One compact search-result row — used in the Hero's pre-populated match list.
 * Carries all four required proof badges (AI match%, condition grade, seller
 * verification, before/after discount) in a row BELOW the title/price, never as an
 * absolute overlay on the photo: a failed/slow image load's fallback alt text can
 * never collide with a badge here, because the photo and the badges are different
 * flex children, not stacked layers. The image container reserves a fixed
 * aspect-square box with its own background color up front, so a slow/failed load
 * never collapses or reflows the row.
 */
export default function ResultRow({ listing, matchPercent, discountPercent }: RankedListing) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border ${PANEL_BORDER} bg-[#0F0E14] p-2.5`}>
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#1D1B24]">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=160&q=70`}
          alt={listing.alt}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight text-white">
              {listing.title}
            </p>
            <p className={`truncate text-[11px] font-normal leading-tight ${MUTED_TEXT}`}>
              {listing.brand} · {listing.category}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular-nums text-[14px] font-extrabold leading-tight text-white">
              ${listing.price}
            </p>
            <p
              className={`tabular-nums text-[10.5px] font-normal leading-tight ${MUTED_TEXT} line-through`}
            >
              ${listing.originalPrice}
            </p>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full border ${ACCENT_SOFT_BORDER} ${ACCENT_SOFT_BG} px-2 py-0.5 text-[10.5px] font-semibold ${ACCENT_TINT_TEXT}`}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span className="tabular-nums">{matchPercent}% match</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#15141C] px-2 py-0.5 text-[10.5px] font-semibold text-white`}
          >
            <Award className="h-3 w-3" aria-hidden="true" />
            {listing.grade}
          </span>

          {listing.verifiedSeller ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#15141C] px-2 py-0.5 text-[10.5px] font-semibold text-white`}
            >
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#15141C] px-2 py-0.5 text-[10.5px] font-semibold ${MUTED_TEXT}`}
            >
              <ShieldX className="h-3 w-3" aria-hidden="true" />
              Unverified
            </span>
          )}

          <span
            className={`tabular-nums inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#15141C] px-2 py-0.5 text-[10.5px] font-semibold text-white`}
          >
            <Tag className="h-3 w-3" aria-hidden="true" />
            {discountPercent}% off
          </span>
        </div>
      </div>
    </div>
  );
}
