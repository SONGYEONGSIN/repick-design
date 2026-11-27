import Image from "next/image";
import { Sparkles, ShieldCheck, BadgeCheck, TrendingDown, CircleDashed } from "lucide-react";
import {
  discountPercent,
  gradeLabel,
  type Listing,
} from "./lib";
import { ACCENT_TINT } from "./ui";

/**
 * The hero's product-proof card. All four required badge types — AI
 * match-reason tag, condition grade, seller verification, before/after
 * discount — render below the image (never as absolute overlays on top of
 * the photo), and the image container reserves a fixed aspect-ratio and a
 * background color before the photo loads.
 */
export default function TopPickCard({ listing }: { listing: Listing }) {
  const discount = discountPercent(listing);
  const grade = gradeLabel(listing.conditionScore);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className="relative aspect-[4/3] w-full bg-zinc-800">
        <Image
          src={`https://images.unsplash.com/${listing.photoId}?w=900&q=80`}
          alt={`${listing.title}, condition grade ${grade}`}
          fill
          sizes="(max-width: 1024px) 90vw, 480px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-base font-extrabold tracking-[-0.02em] text-white">
            {listing.title}
          </p>
          <div className="flex shrink-0 items-baseline gap-2 tabular-nums">
            <span className="text-base font-extrabold text-white">${listing.price}</span>
            <span className="text-xs text-zinc-400 line-through">${listing.originalPrice}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold tabular-nums"
            style={{ borderColor: "rgba(124,166,255,0.4)", backgroundColor: "rgba(47,111,237,0.1)", color: ACCENT_TINT }}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {listing.matchPercent}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-200">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            {grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-200">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              Verified seller
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-200">
              <CircleDashed className="h-3 w-3" aria-hidden="true" />
              Community seller
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-600 bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-white tabular-nums">
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
            -{discount}% vs retail
          </span>
        </div>

        <p className="max-w-[320px] text-[11px] leading-snug text-zinc-400">{listing.matchReason}</p>
      </div>
    </div>
  );
}
