import Image from "next/image";
import { Sparkles, BadgeCheck, ShieldCheck, ArrowDownRight } from "lucide-react";
import type { Listing } from "./data";
import { ACCENT, ACCENT_DEEP, BORDER } from "./tokens";

export default function ListingCard({
  listing,
  heading = true,
  compact = false,
  preload = false,
}: {
  listing: Listing;
  /** Render the item name as an <h3> (nested under a preceding <h2>) or, in a
   *  context with no section heading yet (the hero), a plain styled label —
   *  keeps document heading levels sequential. */
  heading?: boolean;
  /** Smaller card used inside the hero grid, alongside the headline. */
  compact?: boolean;
  /** Set on the one hero image likely to be the LCP element. */
  preload?: boolean;
}) {
  const discount = Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
  const NameTag = heading ? "h3" : "p";

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
      {/* Fixed aspect-ratio + bg color so a failed/slow remote load never collapses layout. */}
      <div className="relative aspect-[4/3] w-full flex-none overflow-hidden bg-[#EDEDEA]">
        <Image
          src={`${listing.image}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name}, ${listing.gradeLabel.toLowerCase()} condition, listed on repick`}
          fill
          sizes={
            compact
              ? "(min-width: 1024px) 220px, 45vw"
              : "(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          }
          className="object-cover"
          preload={preload}
        />
      </div>

      {/* Badges live in their own row below the photo — never overlaid on top of it. */}
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
          {listing.category}
        </p>
        <NameTag
          className={`mt-1 font-semibold tracking-[-0.01em] text-[#15161B] ${compact ? "text-base" : "text-lg"}`}
        >
          {listing.name}
        </NameTag>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm tabular-nums text-[#71717A] line-through">
            ${listing.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-xl font-extrabold tabular-nums text-[#15161B]">
            ${listing.priceNow.toLocaleString("en-US")}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold"
            style={{ borderColor: BORDER, color: ACCENT_DEEP }}
          >
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.match}% match
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
            style={{ borderColor: BORDER, color: ACCENT_DEEP }}
          >
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.gradeLabel}
          </span>
          {listing.verified && (
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
              style={{ borderColor: BORDER, color: ACCENT_DEEP }}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Verified seller
            </span>
          )}
        </div>

        {!compact && (
          <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-[#71717A]">
            <span className="mt-0.5 flex-none font-semibold text-[#15161B]">Why it matched:</span>
            {listing.reason}
          </p>
        )}
      </div>
    </article>
  );
}
