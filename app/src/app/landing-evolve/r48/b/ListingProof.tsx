import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";
import { SAMPLE_LISTING } from "./trade-data";
import { formatUsd } from "./trade-math";
import { ACCENT_TINT_TEXT, CARD_BORDER, INK_CLASS, MUTED_TEXT } from "./tokens";

/**
 * The static proof behind the number the simulator moves: what the item is, its AI match
 * score, condition grade and seller verification. These do not change with the chosen path —
 * the path changes the PAYOUT, not the item's condition — so they render once here, separate
 * from the image (never overlaid on top of the photo, per the badge-placement rule), while the
 * live "before vs after" pairing is the base value shown here against the headline payout
 * number right below it.
 */
export function ListingProof() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <div className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border ${CARD_BORDER} bg-white/5`}>
          <Image
            src={`https://images.unsplash.com/photo-${SAMPLE_LISTING.photoId}?q=80&w=200&auto=format&fit=crop`}
            alt={SAMPLE_LISTING.alt}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${INK_CLASS}`}>{SAMPLE_LISTING.title}</p>
          <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>
            {SAMPLE_LISTING.listingCode} · {formatUsd(SAMPLE_LISTING.baseValue)} market value
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full border border-blue-500/60 bg-blue-600/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          98% condition match
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border ${CARD_BORDER} px-2 py-0.5 text-[11px] font-semibold ${INK_CLASS}`}>
          Grade A-
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border ${CARD_BORDER} px-2 py-0.5 text-[11px] font-semibold ${INK_CLASS}`}>
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
      </div>
    </div>
  );
}
