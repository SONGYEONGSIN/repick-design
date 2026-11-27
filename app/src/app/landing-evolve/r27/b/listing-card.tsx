import Image from "next/image";
import { ArrowDownRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { Listing } from "./data";

const ACCENT_TINT = "#7ED9AA";

/**
 * A listing card. Badges (match %, grade, verified, discount) live in a row *below* the photo —
 * never as absolute overlays on top of it — so if the remote Unsplash photo fails to load in this
 * sandbox, the browser's fallback alt text has room to flow without colliding with badge text.
 */
export default function ListingCard({
  listing,
  heading = true,
}: {
  listing: Listing;
  /** Render the name as an <h3> under a section <h2>, or a plain label where no heading precedes it. */
  heading?: boolean;
}) {
  const discount = Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
  const NameTag = heading ? "h3" : "p";

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-[4/3] w-full flex-none bg-zinc-900">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name}, ${listing.gradeLabel.toLowerCase()}, listed on repick`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {listing.categoryLabel}
        </p>
        <NameTag className="mt-1 truncate text-[16px] font-semibold tracking-[-0.01em] text-white">
          {listing.name}
        </NameTag>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          <span className="text-[13px] text-zinc-400 line-through">
            ${listing.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-[19px] font-extrabold text-white">
            ${listing.priceNow.toLocaleString("en-US")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1E7A56] px-2 py-0.5 text-[11px] font-semibold text-white">
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2.5 py-1 text-[11px] font-semibold tabular-nums"
            style={{ color: ACCENT_TINT }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {listing.match}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2.5 py-1 text-[11px] font-semibold text-white">
            <BadgeCheck className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" strokeWidth={2} />
            {listing.gradeLabel}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2.5 py-1 text-[11px] font-semibold text-white">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_TINT }} />
              Verified seller
            </span>
          )}
        </div>

        {/* 70 chars at 12px = 70 x 0.44 x 12 = 370px — capped here rather than left to the card's
            own width, since this same card renders both in a 3-up grid (already narrower) and as
            a single wide card in the hero, where the uncapped column would run past 75 chars/line. */}
        <p className="mt-4 max-w-[369px] text-[12px] leading-[1.6] text-zinc-400">
          {listing.tags.join(" · ")}
        </p>
      </div>
    </article>
  );
}
