import Image from "next/image";
import { Sparkles, BadgeCheck, ShieldCheck, ArrowDownRight } from "lucide-react";
import type { Listing } from "./data";

export default function ListingCard({
  listing,
  heading = true,
}: {
  listing: Listing;
  /** Render the listing name as an <h3> (nested under a section heading) or, in a
   *  context with no preceding <h2> yet (the hero), a plain styled label instead —
   *  keeps the document's heading levels sequential. */
  heading?: boolean;
}) {
  const discount = Math.round(
    (1 - listing.priceNow / listing.priceOriginal) * 100
  );
  const NameTag = heading ? "h3" : "p";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e5e4] bg-white">
      <div className="relative aspect-[4/3] w-full flex-none bg-[#f5f5f4]">
        <Image
          src={`${listing.image}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name}, ${listing.gradeLabel.toLowerCase()} condition, listed on repick`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#57534e]">
          {listing.category}
        </p>
        <NameTag className="mt-1 text-lg font-semibold tracking-[-0.01em] text-[#1c1917]">
          {listing.name}
        </NameTag>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm tabular-nums text-[#57534e] line-through">
            ${listing.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-xl font-extrabold tabular-nums text-[#1c1917]">
            ${listing.priceNow.toLocaleString("en-US")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-0.5 text-xs font-semibold text-[#9a3412]">
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}%
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2.5 py-1 text-xs font-semibold text-[#c2410c]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.match}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f4] px-2.5 py-1 text-xs font-semibold text-[#1c1917]">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.gradeLabel}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f4] px-2.5 py-1 text-xs font-semibold text-[#1c1917]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Verified seller
            </span>
          )}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#57534e]">
          {listing.tags.join(" · ")}
        </p>
      </div>
    </article>
  );
}
