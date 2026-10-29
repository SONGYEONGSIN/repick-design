"use client";

import Image from "next/image";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { CATEGORIES, discountPct, type Listing } from "./data";
import { CATEGORY_COLOR, cx, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

export default function ListingCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {/* Fixed aspect-ratio + background color so a slow/failed load never collapses the layout.
          Badges live in their own row below, never overlaid on the <img>, so a fallback alt text
          run never collides with them. */}
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?w=640&h=480&fit=crop&q=80`}
          alt={`${listing.title}, listed by ${listing.seller}`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span
              className="text-[10.5px] font-semibold uppercase"
              style={{ color: CATEGORY_COLOR[listing.category], letterSpacing: "0.1em" }}
            >
              {CATEGORIES[listing.category].short}
            </span>
            <p className={cx("mt-0.5 truncate text-[15px] font-extrabold", INK_TEXT)}>{listing.title}</p>
            <p className={cx("mt-0.5 flex items-baseline gap-1.5 text-[13px]", MUTED_TEXT)}>
              <span className={cx("font-semibold", NUM, INK_TEXT)}>${listing.price.toLocaleString()}</span>
              <span className={cx("line-through", NUM)}>${listing.originalPrice.toLocaleString()}</span>
              <span className={cx("font-semibold", NUM)}>
                {discountPct(listing.price, listing.originalPrice)}% off
              </span>
            </p>
          </div>
          <span className={cx("shrink-0 rounded-full bg-[#C2410C] px-2.5 py-1 text-[12px] font-extrabold text-white", NUM)}>
            {listing.matchPct}%
          </span>
        </div>

        {!compact && (
          <ul className="flex flex-col gap-1">
            {listing.reasonTags.map((tag) => (
              <li key={tag} className={cx("text-[12px] leading-[1.5]", MUTED_TEXT)}>
                &middot; {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-semibold text-[#111114]">
            Grade {listing.grade}
          </span>
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              listing.verified ? "border border-[#C2410C]/40 text-[#9A3412]" : "border border-zinc-300 text-[#52525B]",
            )}
          >
            {listing.verified ? (
              <BadgeCheck className="h-2.5 w-2.5" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-2.5 w-2.5" aria-hidden="true" />
            )}
            {listing.verified ? "Verified seller" : "Unverified seller"}
          </span>
          <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-semibold text-[#111114]">
            {listing.seller}
          </span>
        </div>
      </div>
    </div>
  );
}
