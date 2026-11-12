"use client";

import { useId, useState } from "react";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductThumb } from "./ProductThumb";
import { discountPct, formatUsd, type ProductListing } from "./data";
import { ACCENT_BORDER, ACCENT_TINT_TEXT, CARD_BG_CLASS, CARD_BORDER, FOCUS_RING, INK_CLASS, MUTED_TEXT } from "./tokens";

/**
 * Rich product card: AI-match tag + condition grade + seller verification + before/after
 * discount, all four badges present every time. Badges sit in their own row BELOW the image
 * frame, never as an absolute overlay on the photo — a failed or slow image load's alt text
 * falls into normal flow here and can never collide with badge text. The "Why this match"
 * disclosure is this card's own hover/press interaction, independent of the hero scrubber.
 */
export function ProductCard({ product, sizes = "(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" }: { product: ProductListing; sizes?: string }) {
  const [expanded, setExpanded] = useState(false);
  const reasoningId = useId();
  const off = discountPct(product);

  return (
    <div className={`group flex min-w-0 flex-col gap-3 rounded-2xl border ${CARD_BORDER} ${CARD_BG_CLASS} p-4 transition-colors duration-200 hover:border-white/20`}>
      <ProductThumb photoId={product.photoId} alt={product.alt} sizes={sizes} />

      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${INK_CLASS}`}>{product.title}</p>
        <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{product.brand}</p>
      </div>

      {/* Badge row — separate flow, never overlaid on the image above. All four badge types. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full border ${ACCENT_BORDER} bg-blue-600/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {product.matchPercent}% match
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border ${CARD_BORDER} px-2 py-0.5 text-[11px] font-semibold ${INK_CLASS}`}>
          Grade {product.grade}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border ${CARD_BORDER} px-2 py-0.5 text-[11px] font-semibold ${INK_CLASS}`}>
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border ${CARD_BORDER} px-2 py-0.5 text-[11px] font-semibold tabular-nums ${INK_CLASS}`}>
          <span className={`${MUTED_TEXT} line-through`}>{formatUsd(product.priceOriginal)}</span>
          −{off}%
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={reasoningId}
        className={`inline-flex min-h-7 w-fit items-center gap-1 py-1 text-xs font-semibold ${MUTED_TEXT} transition-colors duration-150 hover:text-white ${FOCUS_RING} rounded-sm`}
      >
        <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
        Why this match
      </button>
      {expanded && (
        <p id={reasoningId} className={`text-xs font-normal leading-[1.6] ${MUTED_TEXT}`}>
          {product.matchReasoning}
        </p>
      )}

      <div className={`flex items-baseline justify-between gap-2 border-t ${CARD_BORDER} pt-3`}>
        <p className={`text-base font-semibold tabular-nums ${INK_CLASS}`}>{formatUsd(product.priceNow)}</p>
        <p className={`text-[11px] font-normal ${MUTED_TEXT}`}>{product.sellerLabel}</p>
      </div>
    </div>
  );
}
