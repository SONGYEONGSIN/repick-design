import Image from "next/image";
import { Sparkles, BadgeCheck, ShieldCheck, ArrowDownRight } from "lucide-react";
import type { Listing } from "./data";
import { ACCENT } from "./tokens";

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
  /** Set on the hero image most likely to be the LCP element. */
  preload?: boolean;
}) {
  const discount = Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
  const NameTag = heading ? "h3" : "p";

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] w-full flex-none overflow-hidden bg-zinc-100">
        <Image
          src={`${listing.image}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name}, ${listing.grade.toLowerCase()} condition, listed on repick`}
          fill
          sizes={
            compact
              ? "(min-width: 1024px) 220px, 45vw"
              : "(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          }
          className="object-cover"
          preload={preload}
        />
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          {listing.category}
        </p>
        <NameTag
          className={`mt-1 font-semibold tracking-[-0.01em] text-[#111113] ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {listing.name}
        </NameTag>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm tabular-nums text-zinc-600 line-through">
            ${listing.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-xl font-extrabold tabular-nums text-[#111113]">
            ${listing.priceNow.toLocaleString("en-US")}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-xs font-semibold"
            style={{ color: ACCENT }}
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
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.grade}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Verified seller
            </span>
          )}
        </div>

        {!compact && (
          <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-zinc-600">
            <Sparkles
              className="mt-0.5 h-3.5 w-3.5 flex-none"
              aria-hidden="true"
              strokeWidth={2}
              style={{ color: ACCENT }}
            />
            <span>
              <span className="font-semibold text-zinc-700">Why AI picked this: </span>
              {listing.reason}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
