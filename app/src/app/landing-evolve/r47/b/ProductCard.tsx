"use client";

import { useId, useState } from "react";
import { ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductThumb } from "./ProductThumb";
import { discountPct, type ProductListing } from "./product-data";
import { formatUsd } from "./checkpoint-math";
import { ACCENT_TINT_BG, ACCENT_TINT_TEXT, FOCUS_RING, MUTED_TEXT_ON_TINT } from "./tokens";

/**
 * Badges (match, grade, seller, discount) sit in their own row BELOW the image frame, never as
 * an absolute overlay on the photo itself — a failed or slow image load's alt text falls into
 * normal flow here and can never collide with badge text. The "Why this match" toggle is this
 * section's own interaction, independent of the hero's checkpoint deck.
 */
export function ProductCard({ product }: { product: ProductListing }) {
  const [expanded, setExpanded] = useState(false);
  const reasoningId = useId();
  const off = discountPct(product);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <ProductThumb product={product} sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-zinc-900">{product.title}</p>
        <p className={`truncate text-xs font-normal ${MUTED_TEXT_ON_TINT}`}>{product.brand}</p>
      </div>

      {/* Badge row — separate flow, never overlaid on the image above. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full ${ACCENT_TINT_BG} px-2 py-0.5 text-[11px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {product.matchPercent}% match
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-900">
          Grade {product.grade}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-900">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-900">
          <span className={`${MUTED_TEXT_ON_TINT} line-through`}>{formatUsd(product.priceOriginal)}</span>
          −{off}%
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={reasoningId}
        className={`inline-flex w-fit items-center gap-1 text-xs font-semibold text-zinc-600 transition-colors duration-150 hover:text-zinc-900 ${FOCUS_RING} rounded-sm`}
      >
        <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`} aria-hidden="true" />
        Why this match
      </button>
      {expanded && (
        <p id={reasoningId} className={`text-xs font-normal leading-[1.6] ${MUTED_TEXT_ON_TINT}`}>
          {product.matchReasoning}
        </p>
      )}

      <div className="flex items-baseline justify-between gap-2 border-t border-zinc-200 pt-3">
        <p className="text-base font-semibold tabular-nums text-zinc-900">{formatUsd(product.priceNow)}</p>
        <p className={`text-[11px] font-normal ${MUTED_TEXT_ON_TINT}`}>{product.sellerLabel}</p>
      </div>
    </div>
  );
}
