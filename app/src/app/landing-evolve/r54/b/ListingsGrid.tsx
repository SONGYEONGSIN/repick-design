"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import type { Listing } from "./data";
import { discountPct, formatUsd } from "./model";
import { ACCENT_TEXT, FOCUS_RING, MUTED_TEXT, SURFACE, SURFACE_BORDER } from "./tokens";

function ListingCard({ listing }: { listing: Listing }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const pct = discountPct(listing.price, listing.originalPrice);

  return (
    <article className={`flex min-w-0 flex-col rounded-2xl border ${SURFACE_BORDER}`}>
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl ${SURFACE}`}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={listing.alt}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      {/* Badge row sits BELOW the image, never overlaid on it. */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-3 text-[11px] font-semibold">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#4F46E5] px-2 py-1 text-white">
          <Sparkles className="h-3 w-3" aria-hidden="true" /> {listing.matchPct}% match
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${SURFACE_BORDER}`}>{listing.grade}</span>
        {listing.verifiedSeller ? (
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${SURFACE_BORDER}`}>
            <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Verified seller
          </span>
        ) : null}
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${SURFACE_BORDER}`}>{pct}% off new</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 pb-1 pt-2">
        <h3 className="text-[15px] font-semibold leading-snug">{listing.title}</h3>
        <p className={`text-[12px] font-normal ${MUTED_TEXT}`}>{listing.seller}</p>
        <p className="mt-1 flex items-baseline gap-2 text-[16px] font-extrabold tabular-nums">
          {formatUsd(listing.price)}
          <span className={`text-[12px] font-normal line-through ${MUTED_TEXT}`}>{formatUsd(listing.originalPrice)}</span>
        </p>
      </div>

      <div className="px-4 pb-4 pt-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`${FOCUS_RING} flex w-full items-center justify-between gap-2 rounded-lg border ${SURFACE_BORDER} px-3 py-2 text-left text-[12px] font-semibold`}
        >
          View match reasoning
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {/* Always mounted (never conditionally rendered) so `aria-controls` above always points
            at a real element -- only its visibility toggles. */}
        <ul id={panelId} hidden={!open} className={`mt-2 flex flex-col gap-1.5 text-[12px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          {listing.reasoning.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className={`${ACCENT_TEXT} font-semibold`} aria-hidden="true">
                &middot;
              </span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ListingsGrid({ listings }: { listings: readonly Listing[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
