"use client";

import Image from "next/image";
import { BadgeCheck, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import type { PreviewListing } from "./previewData";
import { formatUsd } from "./stats";
import {
  ACCENT_FILL,
  ACCENT_TEXT_SMALL,
  CAPTION,
  CARD_BORDER_HEX,
  DISPLAY_FONT,
  FOCUS_RING,
  MUTED_TEXT,
  ON_ACCENT_FILL_TEXT,
  ZONE_BORDER_HEX,
  ZONE_SURFACE_HEX,
} from "./tokens";

type ListingPreviewCardProps = {
  listing: PreviewListing;
  isOpen: boolean;
  onToggle: () => void;
};

/**
 * A rich product-preview card. Match / grade / verification / discount badges sit in a row
 * BELOW the image, never overlaid on it -- a broken or slow-loading remote photo leaves its
 * fallback alt text free to flow without colliding with a badge stack. The image container
 * reserves a fixed aspect ratio and a background colour up front so a failed load never
 * collapses the layout.
 */
export function ListingPreviewCard({ listing, isOpen, onToggle }: ListingPreviewCardProps) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white" style={{ borderColor: CARD_BORDER_HEX }}>
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: ZONE_SURFACE_HEX }}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={listing.alt}
          fill
          sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 23vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {listing.matchPct}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: ZONE_BORDER_HEX }}>
            {listing.grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: ZONE_BORDER_HEX }}>
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: ZONE_BORDER_HEX }}>
            <BadgeCheck className="h-3 w-3" aria-hidden="true" />
            {listing.discountPct}% off retail
          </span>
        </div>

        <div>
          <h3 className="text-[16px] font-semibold leading-snug">{listing.title}</h3>
          <p className={`${CAPTION} ${MUTED_TEXT}`}>{listing.category}</p>
        </div>

        <p className="text-[20px] font-extrabold tabular-nums leading-none" style={{ fontFamily: DISPLAY_FONT }}>
          {formatUsd(listing.price)}
          <span className={`ml-1.5 text-[13px] font-normal line-through ${MUTED_TEXT}`}>{formatUsd(listing.retailPrice)}</span>
        </p>

        <div>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={`reason-${listing.id}`}
            onClick={onToggle}
            className={`${FOCUS_RING} ${ACCENT_TEXT_SMALL} inline-flex min-h-9 items-center gap-1 rounded text-[12px] font-semibold`}
          >
            Why this match
            <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          <p
            id={`reason-${listing.id}`}
            hidden={!isOpen}
            className="mt-1.5 text-[13px] font-normal leading-[1.6]"
          >
            {listing.reason}
          </p>
        </div>
      </div>
    </article>
  );
}
