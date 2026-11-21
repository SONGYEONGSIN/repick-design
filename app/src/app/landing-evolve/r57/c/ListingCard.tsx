"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ArrowDownRight, BadgeCheck, ChevronDown, ShieldCheck } from "lucide-react";
import { discountPct, formatUSD, type Listing } from "./data";
import { ACCENT_BASE, FOCUS, INK } from "./ui";

/**
 * All four proof badges (AI match %, condition grade, seller verification, before/after discount)
 * live in a row *below* the photo, never as absolute overlays on top of it, so a slow or failed
 * remote-image load never collides with badge text -- and the image container reserves a fixed
 * aspect ratio plus a background color before the photo decodes, so layout never collapses.
 *
 * The "Why this match" disclosure is the product-preview interaction: a real `<button>` toggling
 * `aria-expanded`, not a hover-only reveal, so it is reachable and visible on touch and keyboard.
 */
export default function ListingCard({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const discount = discountPct(listing);

  return (
    <article
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-800"
      style={{ backgroundColor: "#12141A" }}
    >
      <div className="relative aspect-[4/3] w-full flex-none bg-zinc-900">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={`${listing.name} by ${listing.brand}, ${listing.conditionLabel.toLowerCase()}, listed on repick`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {listing.brand} · {listing.category}
        </p>
        {/* Not a heading: this card renders inside the Hero before any h2 exists in the document,
            as well as inside the ProductPreview grid -- a card title can't safely be an <h3> in
            both places without risking a level skip, so it stays a styled paragraph. */}
        <p className="mt-1 truncate text-[16px] font-semibold tracking-[-0.01em] text-zinc-50">
          {listing.name}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          <span className="text-[13px] text-zinc-400 line-through">
            {formatUSD(listing.priceOriginal)}
          </span>
          <span className="text-[19px] font-bold text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            {formatUSD(listing.priceNow)}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: ACCENT_BASE, color: INK }}
          >
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-200">
            {listing.matchPct}% AI match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
            {listing.conditionLabel}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
              Verified seller
            </span>
          )}
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`mt-4 inline-flex items-center gap-1.5 self-start text-[12.5px] font-semibold text-zinc-300 transition-colors hover:text-white ${FOCUS} rounded`}
        >
          Why this match
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
            strokeWidth={2.5}
          />
        </button>
        <p
          id={panelId}
          className={`mt-2 max-w-[400px] text-[13px] font-normal leading-[1.6] text-zinc-400 ${open ? "block" : "hidden"}`}
        >
          {listing.matchReason}
        </p>
      </div>
    </article>
  );
}
