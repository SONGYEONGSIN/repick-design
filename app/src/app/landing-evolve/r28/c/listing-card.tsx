import Image from "next/image";
import { ArrowDownRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { discountPct, type Listing } from "./data";

const ACCENT = "#9F1239";

/**
 * A listing card. Badges (match %, condition grade, verified seller) live in a row *below* the
 * photo, never as absolute overlays on top of it, so a failed remote-image load never collides
 * with badge text, and every image container reserves a fixed aspect ratio + background color so
 * a slow/failed load never collapses the layout.
 */
export default function ListingCard({ listing }: { listing: Listing }) {
  const discount = discountPct(listing);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] w-full flex-none bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name}, ${listing.conditionLabel.toLowerCase()}, listed on repick`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          {listing.brand}
        </p>
        <p className="mt-1 truncate text-[16px] font-semibold tracking-[-0.01em] text-zinc-900">
          {listing.name}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          <span className="text-[13px] text-zinc-500 line-through">
            ${listing.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-[19px] font-extrabold text-zinc-900">
            ${listing.priceNow.toLocaleString("en-US")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#9F1239] px-2 py-0.5 text-[11px] font-semibold text-white">
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold tabular-nums"
            style={{ color: ACCENT }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.match}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-800">
            <BadgeCheck className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" strokeWidth={2} />
            {listing.conditionLabel}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-800">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT }} />
              Verified seller
            </span>
          )}
        </div>

        {/* Why AI picked this is the conversion argument, so it gets its own line, not a tooltip. */}
        <p className="mt-4 max-w-[369px] text-[12px] leading-[1.6] text-zinc-500">
          <span className="font-semibold text-zinc-700">Why AI picked this: </span>
          {listing.reasoning}
        </p>
      </div>
    </article>
  );
}
