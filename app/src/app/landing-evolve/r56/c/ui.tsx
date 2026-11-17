import { Footprints, Gem, Shirt, ShieldAlert, ShieldCheck, ShoppingBag, Sparkles, Tag, Watch } from "lucide-react";

import type { Category, Listing } from "./lib";
import { discountPct } from "./lib";

/**
 * Focus rule for the whole page: never pair `outline-none`/`outline-hidden` with a
 * `focus-visible:outline-*` utility on the same element — Tailwind v4 routes both through the
 * same `--tw-outline-style` custom property, so the later class silently loses. Every focusable
 * element below only ever ADDS an outline on top of the browser default; nothing turns one off
 * first. `ring-2`/`ring-offset-*` is avoided entirely as the sole focus signal per the brief's
 * known-dead-idiom #2 — this is a real outline, not a ring.
 */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212]";

export const CATEGORY_ICON: Record<Category, typeof Footprints> = {
  Sneakers: Footprints,
  Outerwear: Shirt,
  Bags: ShoppingBag,
  Accessories: Watch,
};

/**
 * The four required product-preview badges (§5.2 of the brief), kept in their own row below the
 * photo — never an overlay directly on top of it, so a broken-image fallback's alt text can never
 * visually collide with a badge.
 */
export function ProofBadges({
  listing,
  matchPct,
  reason,
  compact = false,
}: {
  listing: Listing;
  matchPct: number;
  reason: string;
  compact?: boolean;
}) {
  const discount = discountPct(listing);
  const textSize = compact ? "text-[10px]" : "text-[12.5px]";
  const pad = compact ? "px-1.5 py-0.5" : "px-2.5 py-1.5";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* 1. AI match reasoning */}
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-lime-200 bg-lime-50 ${pad} ${textSize} font-semibold text-lime-800`}
        title={reason}
      >
        <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">{matchPct}% match</span>
      </span>

      {/* 2. Condition grade */}
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 ${pad} ${textSize} font-semibold text-zinc-700`}
      >
        <Gem className="h-3 w-3 shrink-0" aria-hidden="true" />
        {listing.condition}
      </span>

      {/* 3. Seller verification */}
      {listing.verifiedSeller ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 ${pad} ${textSize} font-semibold text-zinc-700`}
        >
          <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
          {compact ? "Verified" : "Verified seller"}
        </span>
      ) : (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 ${pad} ${textSize} font-semibold text-zinc-700`}
        >
          <ShieldAlert className="h-3 w-3 shrink-0" aria-hidden="true" />
          {compact ? "Unverified" : "Unverified seller"}
        </span>
      )}

      {/* 4. Before/after discount, as a filled pill — never a bare text line */}
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-lime-700 ${pad} ${textSize} font-semibold text-white`}
      >
        <Tag className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">
          <span className="line-through">${listing.originalPrice}</span>{" "}
          <span>${listing.price}</span>
        </span>
        <span className="tabular-nums">· {discount}% off</span>
      </span>
    </div>
  );
}
