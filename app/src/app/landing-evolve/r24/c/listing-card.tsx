"use client";

import { BadgeCheck, ShieldAlert, Truck } from "lucide-react";
import type { Listing } from "./data";
import { discountPct, shipLabel } from "./data";
import { cx, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

export default function ListingCard({ listing, score }: { listing: Listing; score: number }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div
        className="aspect-[4/3] w-full bg-zinc-100"
        style={{ background: `linear-gradient(135deg, ${listing.swatch[0]}, ${listing.swatch[1]})` }}
        aria-hidden="true"
      />

      {/* Badges sit in their own row below the photo frame, never as an overlay on top of it — an
          overlay would collide with the browser's fallback alt text if the image ever fails to
          load, making both unreadable at once. */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cx("truncate text-[15px] font-extrabold", INK_TEXT)}>{listing.seller}</p>
            <p className={cx("mt-0.5 flex items-baseline gap-1.5 text-[13px]", MUTED_TEXT)}>
              <span className={cx("font-semibold", NUM, INK_TEXT)}>${listing.price}</span>
              <span className={cx("line-through", NUM)}>${listing.originalPrice}</span>
              <span className={cx("font-semibold", NUM)}>{discountPct(listing)}% off</span>
            </p>
          </div>
          <span
            className={cx(
              "shrink-0 rounded-full bg-[#0E7490] px-2.5 py-1 text-[12px] font-extrabold text-white",
              NUM,
            )}
          >
            {Math.round(score)}%
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          {listing.reasonTags.map((tag) => (
            <li key={tag} className={cx("text-[12px] leading-[1.5]", MUTED_TEXT)}>
              &middot; {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-semibold text-[#111114]">
            Grade {listing.grade}
          </span>
          <span
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              listing.verified ? "border border-[#0E7490]/40 text-[#155E75]" : "border border-zinc-300 text-[#52525B]",
            )}
          >
            {listing.verified ? (
              <BadgeCheck className="h-2.5 w-2.5" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-2.5 w-2.5" aria-hidden="true" />
            )}
            {listing.verified ? "Verified" : "Unverified"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-[10px] font-semibold text-[#111114]">
            <Truck className="h-2.5 w-2.5" aria-hidden="true" />
            {shipLabel(listing.shipDays)}
          </span>
        </div>
      </div>
    </div>
  );
}
